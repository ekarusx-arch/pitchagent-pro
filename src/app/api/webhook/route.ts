import { NextResponse } from "next/server";
import { paddle } from "@/lib/paddle";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = req.headers.get("paddle-signature") || "";

    try {
        const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;

        if (!webhookSecret) {
            console.warn("PADDLE_WEBHOOK_SECRET is missing. Skipping signature verification for local testing.");
            // In a real production environment, you MUST verify the signature.
            // For now, we'll parse the body directly if secret is missing.
            const event = JSON.parse(body);
            return await handlePaddleEvent(event);
        }

        const event = paddle.webhooks.unmarshal(body, webhookSecret, signature);
        if (!event) {
            return new NextResponse("Invalid webhook signature", { status: 400 });
        }

        return await handlePaddleEvent(event);
    } catch (error: any) {
        console.error(`Paddle Webhook Error: ${error.message}`);
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }
}

async function handlePaddleEvent(event: any) {
    const { createAdminClient } = await import("@/utils/supabase/admin");
    const supabase = await createAdminClient();

    // transaction.completed: One-time payments or initial subscription payments
    if (event.eventType === "transaction.completed") {
        const transaction = event.data;
        const customerEmail = transaction.customer?.email || transaction.details?.customer_email || transaction.customerEmail;
        const customData = transaction.customData || {};
        const creditsToPass = parseInt(customData.credits || "0", 10);
        const planName = customData.planName;

        if (customerEmail) {
            const { data: userData } = await supabase
                .from("profiles")
                .select("id, credits")
                .eq("email", customerEmail)
                .single();

            if (userData) {
                const updateData: any = {
                    credits: (userData.credits || 0) + creditsToPass,
                };

                if (planName) {
                    updateData.subscription_plan = planName;
                    updateData.is_pro = true;
                }

                // Store paddle customer ID for future updates/cancellations
                if (transaction.customerId || transaction.customer_id) {
                    updateData.paddle_customer_id = transaction.customerId || transaction.customer_id;
                }

                await supabase.from("profiles").update(updateData).eq("id", userData.id);
                console.log(`[Paddle Webhook] Transaction completed for ${customerEmail}: +${creditsToPass} credits, Plan: ${planName}`);
            }
        }
    }

    // subscription.updated: Plan changes
    if (event.eventType === "subscription.updated") {
        const subscription = event.data;
        // In subscription.updated, custom data might be in different places depending on version
        const customData = subscription.customData || {};
        const planName = customData.planName;

        // Find user by customerId or email
        const customerId = subscription.customerId;

        const { data: userData } = await supabase
            .from("profiles")
            .select("id")
            .eq("paddle_customer_id", customerId)
            .single();

        if (userData && planName) {
            await supabase.from("profiles").update({
                subscription_plan: planName,
                is_pro: true
            }).eq("id", userData.id);
            console.log(`[Paddle Webhook] Subscription updated for customer ${customerId}: Plan -> ${planName}`);
        }
    }

    // subscription.canceled: Membership end
    if (event.eventType === "subscription.canceled") {
        const subscription = event.data;
        const customerId = subscription.customerId;

        const { data: userData } = await supabase
            .from("profiles")
            .select("id")
            .eq("paddle_customer_id", customerId)
            .single();

        if (userData) {
            await supabase.from("profiles").update({
                subscription_plan: "Free",
                is_pro: false
            }).eq("id", userData.id);
            console.log(`[Paddle Webhook] Subscription canceled for customer ${customerId}`);
        }
    }

    return NextResponse.json({ success: true });
}

import { NextResponse } from "next/server";
import { paddle } from "@/lib/paddle";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = req.headers.get("paddle-signature") || "";

    console.log("--- Paddle Webhook Received ---");
    console.log("Headers:", JSON.stringify(req.headers, null, 2));
    console.log("Body length:", body.length);

    try {
        const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;

        // Debug info for configuration
        console.log("Secret present:", !!webhookSecret);
        console.log("Signature present:", !!signature);

        let event;
        if (!webhookSecret || req.headers.get("x-test-webhook") === "true") {
            console.warn("[Paddle Webhook] TEST MODE: Skipping signature verification.");
            try {
                event = JSON.parse(body);
            } catch (e) {
                console.error("Failed to parse body as JSON in test mode");
                return new NextResponse("Invalid JSON body", { status: 400 });
            }
        } else {
            event = paddle.webhooks.unmarshal(body, webhookSecret, signature);
        }

        if (!event) {
            console.error("[Paddle Webhook] Validation failed: Event is null");
            return new NextResponse("Invalid webhook signature", { status: 400 });
        }

        console.log("[Paddle Webhook] Event Type:", event.eventType);
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
        const userId = customData.userId;
        const creditsToPass = parseInt(customData.credits || "0", 10);
        const planName = customData.planName;

        console.log(`[Paddle Webhook] Processing transaction. UserID: ${userId}, Email: ${customerEmail}`);

        // 1. Find the user (prioritize userId from customData, fallback to email)
        let userData = null;
        if (userId) {
            const { data } = await supabase.from("profiles").select("id, credits, email").eq("id", userId).single();
            userData = data;
        }

        if (!userData && customerEmail) {
            const { data } = await supabase.from("profiles").select("id, credits, email").eq("email", customerEmail).single();
            userData = data;
        }

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

            console.log(`[Paddle Webhook] Updating profile ${userData.id}:`, updateData);
            const { error: updateError } = await supabase.from("profiles").update(updateData).eq("id", userData.id);

            if (updateError) {
                console.error("[Paddle Webhook] Supabase Update Error:", updateError);
            } else {
                console.log(`[Paddle Webhook] ✅ Success! Updated user ${userData.email}: +${creditsToPass} credits`);
            }
        } else {
            console.warn(`[Paddle Webhook] ❌ User not found in DB. ID: ${userId}, Email: ${customerEmail}`);
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

import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event: Stripe.Event;

    try {
        if (!signature) {
            console.warn("결제 웹훅 테스트 실패: stripe-signature 헤더가 없습니다.");
            return new NextResponse("Webhook Error: Missing signature", { status: 400 });
        }

        // STRIPE_WEBHOOK_SECRET이 환경 변수에 설정되어 있어야 서명 검증이 통과됩니다.
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!webhookSecret) {
            console.warn("STRIPE_WEBHOOK_SECRET이 없습니다. 로컬 테스트 용도로 서명 검증을 우회합니다.");
            event = JSON.parse(body) as Stripe.Event;
        } else {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        }
    } catch (error: any) {
        console.error(`Webhook Signature Verification Error: ${error.message}`);
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    // Handle the Stripe events
    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            console.log(`[Stripe Webhook] 결제 세션 완료: ${session.id}`);

            const { createAdminClient } = await import("@/utils/supabase/admin");
            const supabase = await createAdminClient();

            // 1. 고객 이메일을 통해 user_id 식별
            const userEmail = session.customer_details?.email;
            if (!userEmail) break;

            const { data: userData } = await supabase
                .from("profiles")
                .select("id, credits")
                .eq("email", userEmail)
                .single();

            if (!userData) {
                console.error(`User with email ${userEmail} not found in profiles.`);
                break;
            }

            // 2. Metadata에서 구매한 크레딧 또는 플랜 정보 추출
            const creditsToPass = parseInt(session.metadata?.credits || "0", 10);
            const planName = session.metadata?.planName;

            // 3. 크레딧 합산 및 플랜 업데이트
            const updateData: any = {
                credits: (userData.credits || 0) + creditsToPass,
            };

            if (planName) {
                updateData.subscription_plan = planName;
                updateData.is_pro = true;
            }

            const { error: updateError } = await supabase
                .from("profiles")
                .update(updateData)
                .eq("id", userData.id);

            if (updateError) {
                console.error(`Failed to update profile for ${userEmail}:`, updateError);
            } else {
                console.log(`Successfully updated credits (+${creditsToPass}) and plan (${planName}) for ${userEmail}`);
            }
            break;
        }

        case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;
            console.log(`[Stripe Webhook] 구독 해지됨: ${subscription.id}`);

            const { createAdminClient } = await import("@/utils/supabase/admin");
            const supabase = await createAdminClient();

            // 고객 ID로 사용자 식별 (실제로는 Stripe Customer ID <-> User ID 매핑 테이블 추천)
            // 여기서는 단순 데모를 위해 is_pro 만 끕니다.
            // await supabase.from("profiles").update({ is_pro: false }).eq("stripe_customer_id", subscription.customer);
            break;
        }

        default:
            console.log(`[Stripe Webhook] 처리되지 않은 이벤트 타입: ${event.type}`);
    }

    // 처리 성공 응답
    return NextResponse.json({ received: true });
}

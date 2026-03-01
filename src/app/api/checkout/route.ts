import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
    try {
        const { priceId, mode = "subscription", planName, amount, credits } = await req.json();

        // 현재 요청의 URL 인스턴스를 통해 origin 도출
        const url = new URL(req.url);
        const origin = `${url.protocol}//${url.host}`;

        // Dummy 키를 사용할 경우의 방어 로직 (MVP/데모용)
        if (process.env.STRIPE_SECRET_KEY === undefined || process.env.STRIPE_SECRET_KEY === "sk_test_dummy") {
            console.warn("STRIPE_SECRET_KEY is missing. Redirecting as simulated checkout.");
            return NextResponse.json({
                url: `${origin}/dashboard?success=true&simulated=true&plan=${planName || 'standard'}`
            });
        }

        // Stripe Checkout Session 생성
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price: priceId, // Stripe Dashboard에서 생성한 실재 Price ID 필요
                    quantity: 1,
                },
            ],
            mode: mode as "subscription" | "payment",
            metadata: {
                planName,
                credits: credits?.toString() || "0",
            },
            success_url: `${origin}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/dashboard?canceled=true`,
        });

        if (session.url) {
            return NextResponse.json({ url: session.url });
        }

        return NextResponse.json({ error: "No session url returned from Stripe." }, { status: 500 });
    } catch (err: any) {
        console.error("Error creating checkout session:", err);
        return NextResponse.json(
            { error: err.message || "Failed to create checkout session" },
            { status: err.statusCode || 500 }
        );
    }
}

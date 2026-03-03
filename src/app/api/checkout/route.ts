import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    try {
        const { priceId, planName, mode = "subscription", credits } = await req.json();
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.warn("[Checkout] No session found. Returning 401.");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Return the configuration for Paddle.js
        return NextResponse.json({
            items: [{ priceId, quantity: 1 }],
            customData: {
                userId: user.id,
                planName,
                credits: credits?.toString() || "0"
            },
            customerEmail: user.email
        });
    } catch (err: any) {
        console.error("Error preparing checkout:", err);
        return NextResponse.json(
            { error: err.message || "Failed to prepare checkout" },
            { status: 500 }
        );
    }
}

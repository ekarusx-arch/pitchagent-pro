/**
 * Paddle Price IDs and Plan Configuration
 * 
 * Replace these placeholder IDs with the actual Price IDs from your 
 * Paddle Dashboard (Sandbox or Production).
 * Price IDs usually look like 'pri_01h...'
 */

export const PADDLE_PLANS = {
    // Subscriptions
    STARTER: {
        id: "pri_01kjrqv7rbwf48tv5dp2dteavc", // Starter 적용 완료
        name: "Starter",
        price: "$29",
    },
    PRO: {
        id: "pri_01kjrq28anzaxrp4acjs4f3qdp", // 실제 Pro Agent Price ID 적용 완료
        name: "Pro Agent",
        price: "$99",
    },
    SCALE: {
        id: "pri_01kjrqz0q04gt3rh4q1jvhs5em", // Scale 적용 완료
        name: "Scale",
        price: "$249",
    },

    // Add-ons (One-time)
    CREDITS_5000: {
        id: "pri_01kjrr5yee7scqk6a95rc5w0ve", // Credit Refill 적용 완료
        name: "Credit Refill",
        credits: 5000,
    },
    SUPER_AGENT: {
        id: "price_super_agent", // Replace with real Price ID
        name: "Super-Agent Scan",
    },
    FAST_TRACK: {
        id: "price_fast_track", // Replace with real Price ID
        name: "Fast-Track Queue",
    },
    TEMPLATE_PRO: {
        id: "price_templates", // Replace with real Price ID
        name: "Template Pro Pack",
    },
};

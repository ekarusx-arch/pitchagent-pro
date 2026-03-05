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
        id: "pri_01kjrqv7rbwf48tv5dp2dteavc", // Starter price linked
        name: "Starter",
        price: "$29",
    },
    PRO: {
        id: "pri_01kjrq28anzaxrp4acjs4f3qdp", // Pro Agent Price ID linked
        name: "Pro Agent",
        price: "$99",
    },
    SCALE: {
        id: "pri_01kjrqz0q04gt3rh4q1jvhs5em", // Scale price linked
        name: "Scale",
        price: "$249",
    },

    // Add-ons (One-time)
    CREDITS_5000: {
        id: "pri_01kjrr5yee7scqk6a95rc5w0ve", // Credit Refill linked
        name: "Credit Refill",
        credits: 5000,
    },
    SUPER_AGENT: {
        id: "pri_01kjszbk3ncvb5psykmf5jg1ed", // Super-Agent Scan linked
        name: "Super-Agent Scan",
    },
    FAST_TRACK: {
        id: "pri_01kjszdsb3gcvrbtndht9cn5jk", // Fast-Track Queue linked
        name: "Fast-Track Queue",
    },
    TEMPLATE_PRO: {
        id: "pri_01kjszfbtn8bv5n8hqj2md77ah", // Template Pro Pack linked
        name: "Template Pro Pack",
    },
};

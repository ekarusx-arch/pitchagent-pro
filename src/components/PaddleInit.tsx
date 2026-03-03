"use client";

import Script from "next/script";

export default function PaddleInit() {
    const PADDLE_CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    const PADDLE_SANDBOX = process.env.NEXT_PUBLIC_PADDLE_SANDBOX === "true";

    return (
        <Script
            src="https://cdn.paddle.com/paddle/v2/paddle.js"
            strategy="afterInteractive"
            onLoad={() => {
                // @ts-ignore
                if (typeof Paddle !== "undefined" && PADDLE_CLIENT_TOKEN) {
                    console.log("[PaddleInit] Initializing Paddle in", PADDLE_SANDBOX ? "sandbox" : "production");
                    // @ts-ignore
                    Paddle.Environment.set(PADDLE_SANDBOX ? "sandbox" : "production");
                    // @ts-ignore
                    Paddle.Initialize({
                        token: PADDLE_CLIENT_TOKEN,
                        eventCallback: function (data: any) {
                            console.log("[Paddle Event]", data);
                        }
                    });
                }
            }}
        />
    );
}

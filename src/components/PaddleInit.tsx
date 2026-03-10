"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function PaddleInit() {
    // Force sandbox true if token starts with 'test_' to prevent 403 environment mismatch
    const PADDLE_CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    const isTestToken = PADDLE_CLIENT_TOKEN?.startsWith('test_');
    const PADDLE_SANDBOX = isTestToken || process.env.NEXT_PUBLIC_PADDLE_SANDBOX === "true";

    useEffect(() => {
        const initPaddle = () => {
            // @ts-ignore
            if (typeof Paddle !== "undefined" && PADDLE_CLIENT_TOKEN) {
                console.log("[PaddleInit] Initializing Paddle in", PADDLE_SANDBOX ? "sandbox" : "production");
                // @ts-ignore
                Paddle.Environment.set(PADDLE_SANDBOX ? "sandbox" : "production");
                // @ts-ignore
                Paddle.Initialize({
                    token: PADDLE_CLIENT_TOKEN,
                });
            } else {
                console.warn("[PaddleInit] Paddle is available but token is missing or initialization failed.");
            }
        };

        // @ts-ignore
        if (typeof Paddle !== "undefined") {
            initPaddle();
        } else {
            const interval = setInterval(() => {
                // @ts-ignore
                if (typeof Paddle !== "undefined") {
                    initPaddle();
                    clearInterval(interval);
                }
            }, 500);
            return () => clearInterval(interval);
        }
    }, [PADDLE_CLIENT_TOKEN, PADDLE_SANDBOX]);

    return (
        <Script
            src="https://cdn.paddle.com/paddle/v2/paddle.js"
            strategy="afterInteractive"
        />
    );
}

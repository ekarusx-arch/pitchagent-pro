"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Lock, ShieldCheck } from "lucide-react";

export default function CheckoutPage() {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    // 이 페이지는 Lean Startup Validation을 위한 가상의 결제 모달 모방입니다.
    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        // 가짜 결제 처리 딜레이 후 대시보드로 이동
        setTimeout(() => {
            router.push("/dashboard");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-pink-500" />

                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">Secure Checkout</h1>
                    <p className="text-slate-400 mt-2 text-sm">
                        PitchAgent Pro - Start 7-Day Trial<br />
                        $100/month after trial ends.
                    </p>
                </div>

                <form onSubmit={handleSubscribe} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Name on Card</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-600"
                            placeholder="Elon Musk"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Card Information</label>
                        <div className="relative">
                            <input
                                type="text"
                                required
                                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono placeholder:text-slate-600"
                                placeholder="0000 0000 0000 0000"
                            />
                        </div>
                        <div className="flex gap-4 mt-2">
                            <input
                                type="text"
                                required
                                className="w-1/2 bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono placeholder:text-slate-600"
                                placeholder="MM/YY"
                            />
                            <input
                                type="text"
                                required
                                className="w-1/2 bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono placeholder:text-slate-600"
                                placeholder="CVC"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium flex items-center justify-center transition-colors disabled:opacity-70"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "Start Free Trial"
                            )}
                        </button>
                    </div>

                    <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-500">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Payments mock powered by PitchAgent MVP</span>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

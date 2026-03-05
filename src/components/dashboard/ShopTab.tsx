"use client";

import { motion } from "framer-motion";
import { Package, Search, Zap, Copy } from "lucide-react";
import { PADDLE_PLANS } from "@/lib/paddle-config";

export type ShopTabProps = {
    handleCheckout: (options: { priceId?: string, planName: string, mode?: string, credits?: number }) => void;
};

export function ShopTab({ handleCheckout }: ShopTabProps) {
    const shopItems = [
        {
            title: "Credit Refill",
            description: "Instantly add 5,000 credits to your workspace for high-volume campaigns.",
            price: "$25",
            icon: Package,
            bgColor: "bg-indigo-500/10",
            textColor: "text-indigo-400",
            priceId: PADDLE_PLANS.CREDITS_5000.id,
            credits: PADDLE_PLANS.CREDITS_5000.credits,
            mode: "payment"
        },
        {
            title: "Super-Agent Scan",
            description: "Deep-crawl 50+ subpages of target websites for extreme personalization.",
            price: "$49 / mo",
            icon: Search,
            bgColor: "bg-violet-500/10",
            textColor: "text-violet-400",
            priceId: PADDLE_PLANS.SUPER_AGENT.id,
            mode: "subscription"
        },
        {
            title: "Fast-Track Queue",
            description: "Skip the processing line. Get your pitches generated in under 30 seconds.",
            price: "$10 / mo",
            icon: Zap,
            bgColor: "bg-amber-500/10",
            textColor: "text-amber-400",
            priceId: PADDLE_PLANS.FAST_TRACK.id,
            mode: "subscription"
        },
        {
            title: "Template Pro Pack",
            description: "Unlock 20 premium sales structures for SaaS, Design, and Agency niches.",
            price: "$19",
            icon: Copy,
            bgColor: "bg-emerald-500/10",
            textColor: "text-emerald-400",
            priceId: PADDLE_PLANS.TEMPLATE_PRO.id,
            mode: "payment"
        }
    ];

    return (
        <motion.div
            key="shop"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full relative max-w-7xl mx-auto px-4 md:px-8"
        >
            {/* Background Glows */}
            <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="mb-12 relative">
                <h1 className="text-4xl font-extrabold mb-3 tracking-tight">Agent Resources</h1>
                <p className="text-slate-400 text-lg">Enhance your existing workflow with one-time power-ups.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 relative">
                {shopItems.map((item, i) => (
                    <div key={i} className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:bg-slate-800/60 hover:translate-y-[-4px] transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col h-full border-b-2 hover:border-b-primary/50 shadow-sm hover:shadow-xl">
                        <div className={`w-10 h-10 rounded-xl ${item.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner border border-white/5`}>
                            <item.icon className={`w-4 h-4 ${item.textColor}`} />
                        </div>
                        <h3 className="text-base font-black mb-1.5 text-white tracking-widest uppercase">{item.title}</h3>
                        <p className="text-[11px] text-slate-500 mb-4 leading-relaxed font-medium">
                            {item.description}
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                            <span className="text-white font-black text-sm">{item.price}</span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCheckout({
                                        priceId: item.priceId,
                                        planName: item.title,
                                        mode: item.mode,
                                        credits: (item as any).credits
                                    });
                                }}
                                className="text-[9px] font-black uppercase tracking-widest py-2 px-3 rounded-lg bg-primary text-white hover:bg-indigo-500 transition-all shadow-glow active:scale-95"
                            >
                                Get
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

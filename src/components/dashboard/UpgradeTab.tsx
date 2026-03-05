"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, TrendingUp } from "lucide-react";
import { PADDLE_PLANS } from "@/lib/paddle-config";
import { Profile } from "@/app/dashboard/types";

export type UpgradeTabProps = {
    profile: Profile | null;
    handleCheckout: (options: { priceId?: string, planName: string, mode?: string, credits?: number }) => void;
};

export function UpgradeTab({ profile, handleCheckout }: UpgradeTabProps) {
    return (
        <motion.div
            key="upgrade"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full relative"
        >
            {/* Background Glows */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/2 -left-20 w-80 h-80 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="mb-12 relative">
                <h1 className="text-4xl font-extrabold mb-3 tracking-tight">Upgrade Your Agent</h1>
                <p className="text-slate-400 text-lg max-w-2xl">Scale your outreach from single pitches to world-class campaigns with Pro capabilities.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto relative justify-center">
                {/* Starter Plan */}
                <div className={`relative group bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[40px] p-9 flex flex-col hover:border-emerald-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/5 overflow-hidden ${profile?.subscription_plan === "Starter" ? "ring-2 ring-emerald-500 border-emerald-500/50" : ""}`}>
                    <div className="mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
                            <TrendingUp className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Starter</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black text-white">$29</span>
                            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">/mo</span>
                        </div>
                    </div>

                    <ul className="space-y-4 mb-10 flex-1">
                        <li className="flex items-center gap-3 text-[13px] font-medium text-slate-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" /> 100 pitches per month
                        </li>
                        <li className="flex items-center gap-3 text-[13px] font-medium text-slate-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" /> Basic web research
                        </li>
                        <li className="flex items-center gap-3 text-[13px] font-medium text-slate-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" /> Email support
                        </li>
                    </ul>

                    {profile?.subscription_plan === "Starter" ? (
                        <button disabled className="w-full py-4 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-black text-xs uppercase tracking-widest cursor-not-allowed">Active</button>
                    ) : (
                        <button
                            onClick={() => handleCheckout({ priceId: PADDLE_PLANS.STARTER.id, planName: PADDLE_PLANS.STARTER.name, mode: "subscription" })}
                            className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest transition-all border border-white/10 shadow-lg"
                        >
                            Select Plan
                        </button>
                    )}
                </div>

                {/* Pro Plan */}
                <div className={`relative group bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[40px] p-9 flex flex-col hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 overflow-hidden ${profile?.subscription_plan === "Pro Agent" ? "ring-2 ring-primary border-primary/50" : "scale-105 shadow-2xl z-10 border-primary/20"}`}>
                    <div className="absolute top-0 right-0 px-5 py-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-bl-2xl">Recommended</div>
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />

                    <div className="mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 shadow-glow">
                            <Zap className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight italic">Pro Agent</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black text-white">$99</span>
                            <span className="text-primary/60 text-xs font-bold uppercase tracking-widest">/mo</span>
                        </div>
                    </div>

                    <ul className="space-y-4 mb-10 flex-1">
                        <li className="flex items-center gap-3 text-[13px] font-bold text-slate-200">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Unlimited pitches
                        </li>
                        <li className="flex items-center gap-3 text-[13px] font-bold text-slate-200">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Advanced web-scraping
                        </li>
                        <li className="flex items-center gap-3 text-[13px] font-bold text-slate-200">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" /> CRM Integration
                        </li>
                        <li className="flex items-center gap-3 text-[13px] font-bold text-slate-200">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Priority support
                        </li>
                    </ul>

                    {profile?.subscription_plan === "Pro Agent" ? (
                        <button disabled className="w-full py-4 rounded-2xl bg-primary/10 text-primary border border-primary/30 font-black text-xs uppercase tracking-widest cursor-not-allowed">Active</button>
                    ) : (
                        <button
                            onClick={() => handleCheckout({ priceId: PADDLE_PLANS.PRO.id, planName: PADDLE_PLANS.PRO.name, mode: "subscription" })}
                            className="w-full py-4 rounded-2xl bg-primary hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest transition-all shadow-glow"
                        >
                            Upgrade Now
                        </button>
                    )}
                </div>

                {/* Enterprise Plan */}
                <div className={`relative group bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[40px] p-9 flex flex-col hover:border-slate-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-white/5 overflow-hidden ${profile?.subscription_plan === "Scale" ? "ring-2 ring-slate-400 border-slate-400/50" : ""}`}>
                    <div className="mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                            <ShieldCheck className="w-6 h-6 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Scale</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black text-white">$249</span>
                            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">/mo</span>
                        </div>
                    </div>
                    <ul className="space-y-4 mb-10 flex-1">
                        <li className="flex items-center gap-3 text-[13px] font-medium text-slate-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-500/40" /> Multi-seat workspace
                        </li>
                        <li className="flex items-center gap-3 text-[13px] font-medium text-slate-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-500/40" /> Custom parameters
                        </li>
                        <li className="flex items-center gap-3 text-[13px] font-medium text-slate-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-500/40" /> Account manager
                        </li>
                    </ul>
                    {profile?.subscription_plan === "Scale" ? (
                        <button disabled className="w-full py-4 rounded-2xl bg-slate-800/50 text-slate-500 font-bold cursor-not-allowed border border-slate-700/50">Current Plan</button>
                    ) : (
                        <button
                            onClick={() => handleCheckout({ priceId: PADDLE_PLANS.SCALE.id, planName: PADDLE_PLANS.SCALE.name, mode: "subscription" })}
                            className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest transition-all"
                        >
                            Contact Sales
                        </button>
                    )}
                </div>
            </div>

            <div className="mt-16 flex items-center gap-8 justify-center grayscale opacity-50">
                <ShieldCheck className="w-6 h-6" />
                <div className="h-6 w-px bg-slate-800" />
                <span className="text-xs font-medium tracking-widest uppercase text-slate-500">Secure Paddle Checkout</span>
            </div>
        </motion.div>
    );
}

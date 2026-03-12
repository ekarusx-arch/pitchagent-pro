"use client";

import { motion } from "framer-motion";
import {
    Settings,
    CreditCard,
    User,
    Zap,
    Package,
    ShieldCheck,
    ExternalLink,
    Mail,
    Lock
} from "lucide-react";
import { Profile } from "@/app/dashboard/types";

export type SettingsTabProps = {
    profile: Profile | null;
    setActiveTab: (tab: any) => void;
};

export function SettingsTab({ profile, setActiveTab }: SettingsTabProps) {
    if (!profile) return null;

    return (
        <motion.div
            key="settings"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="max-w-4xl mx-auto w-full pb-20 mt-10"
        >
            <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-glow">
                    <Settings className="w-7 h-7 text-primary" />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Account Settings</h1>
                    <p className="text-slate-500 font-medium">Manage your subscription, resources, and credentials.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subscription Section */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 hover:border-primary/30 transition-all duration-500 group">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-violet-400" />
                            </div>
                            <h2 className="text-lg font-black text-white uppercase tracking-tight">Subscription</h2>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${profile.is_pro
                            ? "bg-primary/20 text-primary border border-primary/30 shadow-glow"
                            : "bg-slate-800 text-slate-400 border border-white/5"
                            }`}>
                            {profile.subscription_plan}
                        </span>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between items-center px-2">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Current Plan</span>
                            <span className="text-sm text-white font-black italic">{profile.subscription_plan}</span>
                        </div>
                        <div className="flex justify-between items-center px-2">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Status</span>
                            <span className="text-sm text-emerald-400 font-black">ACTIVE</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setActiveTab("upgrade")}
                        className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white text-[11px] font-black uppercase tracking-widest transition-all border border-white/10 flex items-center justify-center gap-2"
                    >
                        <Zap className="w-4 h-4 text-primary" />
                        {profile.is_pro ? "Modify Subscription" : "Upgrade to Pro"}
                    </button>
                </div>

                {/* Resources Section */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 hover:border-primary/30 transition-all duration-500 group">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h2 className="text-lg font-black text-white uppercase tracking-tight">Resources</h2>
                        </div>
                    </div>

                    <div className="mb-8 p-6 bg-slate-950/50 rounded-2xl border border-white/5 shadow-inner">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Available Credits</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-mono font-black text-primary">{(profile.credits || 0).toLocaleString()}</span>
                            <span className="text-xs font-bold text-slate-600 uppercase">Credits</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setActiveTab("shop")}
                        className="w-full py-4 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary text-[11px] font-black uppercase tracking-widest transition-all border border-primary/20 flex items-center justify-center gap-2 shadow-glow-sm"
                    >
                        <Package className="w-4 h-4" />
                        Refill Resources
                    </button>
                </div>

                {/* Account Info Section */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 hover:border-primary/30 transition-all duration-500 md:col-span-2">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-slate-500/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-slate-400" />
                        </div>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight">Account Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="p-5 bg-white/2 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-3 mb-3">
                                <Mail className="w-4 h-4 text-slate-500" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</span>
                            </div>
                            <p className="text-sm text-white font-bold px-7">{profile.email}</p>
                        </div>
                        <div className="p-5 bg-white/2 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-3 mb-3">
                                <User className="w-4 h-4 text-slate-500" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Full Name</span>
                            </div>
                            <p className="text-sm text-white font-bold px-7">{profile.full_name || "Not set"}</p>
                        </div>
                        <div className="p-5 bg-white/2 rounded-2xl border border-white/5 opacity-50 cursor-not-allowed">
                            <div className="flex items-center gap-3 mb-3">
                                <Lock className="w-4 h-4 text-slate-500" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Password Management</span>
                            </div>
                            <p className="text-xs text-slate-400 font-bold px-7">Managed via Identity Provider</p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex flex-wrap gap-4">
                        <a
                            href="#"
                            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors"
                            onClick={(e) => {
                                e.preventDefault();
                                alert("Paddle Customer Portal will be available after KYC completion. 😊");
                            }}
                        >
                            Open Billing Portal <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                </div>
            </div>

            <div className="mt-12 p-8 rounded-[32px] border border-red-500/10 bg-red-500/5 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-lg font-black text-red-400 uppercase tracking-tight">Danger Zone</h3>
                    <p className="text-slate-500 text-sm font-medium">Once you delete your account, there is no going back. Please be certain.</p>
                </div>
                <button className="px-8 py-3 rounded-xl bg-red-400/10 text-red-400 border border-red-400/20 text-[11px] font-black uppercase tracking-widest hover:bg-red-400 hover:text-white transition-all">
                    Delete Account
                </button>
            </div>
        </motion.div>
    );
}

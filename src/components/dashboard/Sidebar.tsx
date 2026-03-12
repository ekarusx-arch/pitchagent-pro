"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Layout,
    Zap,
    Package,
    History as HistoryIcon,
    Users,
    LogOut,
    Sparkles,
    ShieldCheck,
    X,
    Settings
} from "lucide-react";
import { DashboardTab, Profile } from "@/app/dashboard/types";

export type SidebarProps = {
    activeTab: DashboardTab;
    setActiveTab: (tab: DashboardTab) => void;
    profile: Profile | null;
    handleSignOut: () => void;
    isMobileMenuOpen: boolean;
    toggleMobileMenu: () => void;
};

export function Sidebar({ activeTab, setActiveTab, profile, handleSignOut, isMobileMenuOpen, toggleMobileMenu }: SidebarProps) {
    const navItems: { id: DashboardTab; label: string; icon: any }[] = [
        { id: "workspace", label: "Workspace", icon: Layout },
        { id: "upgrade", label: "Upgrade Plan", icon: Zap },
        { id: "shop", label: "Resource Shop", icon: Package },
        { id: "history", label: "History", icon: HistoryIcon },
        { id: "profile", label: "Profiles", icon: Users },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    return (
        <>
            {/* Backdrop for mobile */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleMobileMenu}
                        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[55] lg:hidden"
                    />
                )}
            </AnimatePresence>

            <aside className={`
                w-80 max-w-[calc(100vw-2rem)] h-[calc(100vh-3rem)] flex flex-col bg-slate-950/40 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 shadow-2xl overflow-hidden group z-[60]
                fixed lg:sticky top-4 lg:top-0 transition-transform duration-500 ease-out
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                left-4 lg:left-0
            `}>
                {/* Background Accent */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="mb-14 relative z-10 px-2">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20 shadow-glow">
                                <Sparkles className="w-6 h-6 text-primary" />
                            </div>
                            <span className="text-2xl font-black text-white tracking-tight uppercase">Pitch<span className="text-primary italic">Agent</span></span>
                        </div>
                        <button onClick={toggleMobileMenu} className="lg:hidden p-2 text-slate-500 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="flex items-center gap-2.5 px-0.5">
                        <div className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                        </div>
                        <span className="text-emerald-500/80 text-[10px] font-bold uppercase tracking-[0.2em]">Swarm Connectivity: Active</span>
                    </div>
                </div>

                <nav className="flex-1 space-y-2 relative z-10">
                    {navItems.map((item) => {
                        const active = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group/item relative ${active
                                    ? "text-white"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                {active && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-2xl -z-10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <item.icon className={`w-5 h-5 ${active ? "text-primary shadow-glow" : "group-hover/item:text-slate-200 transition-colors"}`} />
                                <span className={`text-sm tracking-wide ${active ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="mt-auto space-y-6 pt-10 border-t border-white/5 relative z-10">
                    <div className="glass-card rounded-2xl p-5 shadow-inner relative group/card overflow-hidden">
                        <div className="absolute -top-2 -right-2 p-4 opacity-5 group-hover/card:opacity-10 transition-opacity">
                            <ShieldCheck className="w-12 h-12" />
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">System Status</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <span className="text-[11px] text-slate-500 font-bold uppercase">Plan</span>
                                <span className="text-xs text-white font-black tracking-wider uppercase">{profile?.subscription_plan || "Free"}</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-[11px] text-slate-500 font-bold uppercase">Credits</span>
                                <span className="text-sm text-primary font-mono font-bold">{(profile?.credits || 0).toLocaleString()}</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden glass-border">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (profile?.credits || 0) / 100)}%` }}
                                    className="h-full bg-gradient-to-r from-primary to-accent relative"
                                >
                                    <div className="absolute inset-0 bg-[length:20px_20px] bg-gradient-to-r from-white/20 to-transparent animate-shimmer" />
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-center gap-3 px-6 py-3 text-slate-500 hover:text-red-400 transition-all font-bold text-xs tracking-widest uppercase hover:bg-red-400/5 rounded-xl"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}

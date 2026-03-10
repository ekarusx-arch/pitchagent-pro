"use client";

import { useState, useRef, useEffect } from "react";
import { User, Zap, Menu, X, Settings, LogOut, ChevronDown, UserCircle } from "lucide-react";
import { Profile, DashboardTab } from "@/app/dashboard/types";
import { motion, AnimatePresence } from "framer-motion";

type DashboardHeaderProps = {
    profile: Profile | null;
    isMobileMenuOpen: boolean;
    toggleMobileMenu: () => void;
    setActiveTab: (tab: DashboardTab) => void;
    handleSignOut: () => void;
};

export function DashboardHeader({
    profile,
    isMobileMenuOpen,
    toggleMobileMenu,
    setActiveTab,
    handleSignOut
}: DashboardHeaderProps) {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 lg:left-80 z-50 flex items-center justify-between px-6 py-4 bg-slate-950/50 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none border-b border-white/5 lg:border-none">
            <div className="flex items-center gap-3 lg:hidden">
                <button
                    onClick={toggleMobileMenu}
                    className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-primary" />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6 ml-auto">
                <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Available Credits</span>
                    <span className="text-sm text-primary font-mono font-bold leading-none">
                        {(profile?.credits || 0).toLocaleString()}
                    </span>
                </div>

                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-white/5 transition-all border border-transparent hover:border-white/5 group"
                    >
                        <div className="w-9 h-9 rounded-full bg-slate-800 border-2 border-primary/20 flex items-center justify-center overflow-hidden shadow-glow group-hover:border-primary/40 transition-all">
                            {profile?.email ? (
                                <div className="w-full h-full flex items-center justify-center text-xs font-black text-white bg-gradient-to-br from-primary/40 to-accent/40">
                                    {profile.email[0].toUpperCase()}
                                </div>
                            ) : (
                                <User className="w-5 h-5 text-slate-400" />
                            )}
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isUserMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-3 w-64 bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden p-2 z-[60]"
                            >
                                <div className="px-4 py-3 border-b border-white/5 mb-2">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Signed in as</p>
                                    <p className="text-xs font-bold text-white truncate">{profile?.email}</p>
                                </div>

                                <button
                                    onClick={() => {
                                        setActiveTab("profile");
                                        setIsUserMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all text-sm font-bold group"
                                >
                                    <UserCircle className="w-4 h-4 text-slate-500 group-hover:text-primary transition-colors" />
                                    Manage Profiles
                                </button>

                                <button
                                    onClick={() => {
                                        setActiveTab("profile"); // Or settings if we had one
                                        setIsUserMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all text-sm font-bold group"
                                >
                                    <Settings className="w-4 h-4 text-slate-500 group-hover:text-primary transition-colors" />
                                    Account Settings
                                </button>

                                <div className="h-[1px] bg-white/5 my-2 mx-2" />

                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400/70 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all text-sm font-bold group"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}

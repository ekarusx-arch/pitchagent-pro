"use client";

import { motion } from "framer-motion";
import { Users, Plus, Trash2, Zap, CheckCircle2, Sparkles } from "lucide-react";
import { Profile, ProfileContext } from "@/app/dashboard/types";

export type ProfileTabProps = {
    profile: Profile | null;
    setProfile: (profile: any) => void;
    addProfile: () => void;
    handleDeleteProfile: (index: number) => void;
    handleSaveProfile: (contexts: ProfileContext[]) => void;
    isSavingProfile: boolean;
    setCurrentProfileIndex: (index: number) => void;
    setContext: (content: string) => void;
    setActiveTab: (tab: any) => void;
};

export function ProfileTab({
    profile,
    setProfile,
    addProfile,
    handleDeleteProfile,
    handleSaveProfile,
    isSavingProfile,
    setCurrentProfileIndex,
    setContext,
    setActiveTab
}: ProfileTabProps) {
    if (!profile) return null;

    return (
        <motion.div
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-6xl mx-auto w-full pb-20 relative px-4 md:px-8"
        >
            {/* Background Decorations */}
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />

            <div className="mb-12">
                <h1 className="text-4xl font-extrabold mb-3 tracking-tight">Professional Identities</h1>
                <p className="text-slate-400 text-lg">Manage your 'Professional Personas' that the agent will use to pitch on your behalf.</p>
            </div>

            <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden space-y-8">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-violet-500 to-indigo-600 opacity-50" />

                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-black tracking-tight">Profiles</h2>
                    </div>
                    <button
                        type="button"
                        onClick={addProfile}
                        className="px-6 py-3 rounded-xl bg-white text-slate-950 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2 shadow-2xl active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        New Profile
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
                    {profile.contexts.map((ctx, idx) => (
                        <div key={idx} className="bg-card/60 border border-border/60 rounded-[32px] p-8 md:p-10 space-y-8 hover:border-primary/40 hover:bg-card/80 transition-all duration-300 group relative flex flex-col shadow-inner">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm border border-primary/20 shrink-0">
                                        {idx + 1}
                                    </div>
                                    <input
                                        value={ctx.name}
                                        onChange={(e) => {
                                            const newContexts = [...profile.contexts];
                                            newContexts[idx].name = e.target.value;
                                            setProfile({ ...profile, contexts: newContexts });
                                        }}
                                        className="bg-transparent border-none text-xl font-black text-white focus:outline-none focus:ring-0 w-full placeholder:text-slate-700"
                                        placeholder="Profile Name"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteProfile(idx)}
                                    className="w-10 h-10 rounded-xl bg-red-400/5 text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center shrink-0"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            <textarea
                                value={ctx.content}
                                onChange={(e) => {
                                    const newContexts = [...profile.contexts];
                                    newContexts[idx].content = e.target.value;
                                    setProfile({ ...profile, contexts: newContexts });
                                }}
                                placeholder="Describe your background, value props, and successes..."
                                className="w-full h-56 bg-slate-950/40 border border-border/30 rounded-2xl p-6 text-[14px] focus:outline-none focus:border-primary/50 transition-all shadow-inner placeholder:text-slate-800 leading-relaxed font-medium resize-none custom-scrollbar"
                            />

                            <button
                                onClick={() => {
                                    setCurrentProfileIndex(idx);
                                    setContext(ctx.content);
                                    setActiveTab("workspace");
                                }}
                                className="w-full py-4 rounded-xl bg-white/5 text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] border border-white/5 hover:bg-primary/20 hover:text-primary hover:border-primary/20 transition-all flex items-center justify-center gap-3 mt-auto"
                            >
                                <Zap className="w-4 h-4" />
                                Active in Workspace
                            </button>
                        </div>
                    ))}
                </div>

                <div className="pt-8 border-t border-border/30 relative z-10">
                    <button
                        onClick={() => handleSaveProfile(profile.contexts)}
                        disabled={isSavingProfile}
                        className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-primary to-violet-600 text-white font-black text-base uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 transition-all hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] active:scale-[0.99] group shadow-xl"
                    >
                        {isSavingProfile ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                        ) : (
                            <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        )}
                        {isSavingProfile ? "Syncing to Cloud..." : "Save All Profiles"}
                    </button>
                </div>
            </div>

            <div className="mt-8 p-6 rounded-3xl border border-primary/20 bg-primary/5 backdrop-blur-sm flex items-start gap-4 group mx-auto w-full md:w-[90%] lg:w-[80%]">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center group-hover:rotate-12 transition-transform shrink-0">
                    <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                    <h4 className="font-black text-white text-base mb-1.5">Pro Tip: Specific data drives performance.</h4>
                    <p className="text-slate-400 leading-relaxed font-medium text-xs md:text-[13px]">Include industries you've worked in, technologies used, and measurable success metrics. The agent uses these to draft significantly more powerful proposals.</p>
                </div>
            </div>
        </motion.div>
    );
}

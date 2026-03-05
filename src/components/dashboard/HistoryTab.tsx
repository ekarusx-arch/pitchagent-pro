"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    History as HistoryIcon,
    TrendingUp,
    Mail,
    ExternalLink,
    Calendar,
    ChevronRight,
    ShieldCheck,
    X,
    Copy,
    Sparkles,
    Layout,
    FileDown
} from "lucide-react";
import { PitchHistoryItem } from "@/app/dashboard/types";

export type HistoryTabProps = {
    history: PitchHistoryItem[];
    isLoadingHistory: boolean;
    fetchHistory: () => void;
    selectedHistoryItem: PitchHistoryItem | null;
    setSelectedHistoryItem: (item: PitchHistoryItem | null) => void;
    handleDownloadPDF: (result: { pitch: string; insights: string[] }) => void;
    setConfirmModal: (modal: any) => void;
    setActiveTab: (tab: any) => void;
};

export function HistoryTab({
    history,
    isLoadingHistory,
    fetchHistory,
    selectedHistoryItem,
    setSelectedHistoryItem,
    handleDownloadPDF,
    setConfirmModal,
    setActiveTab
}: HistoryTabProps) {
    return (
        <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full relative max-w-7xl mx-auto px-4 md:px-8"
        >
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="mb-12 flex items-center justify-between relative">
                <div>
                    <h1 className="text-4xl font-extrabold mb-3 tracking-tight">Campaign History</h1>
                    <p className="text-slate-400 text-lg">View and manage all your previous pitch campaigns from the archive.</p>
                </div>
                <button
                    onClick={fetchHistory}
                    className="p-4 rounded-2xl bg-card border border-border hover:bg-slate-800 transition-all text-slate-400 hover:text-white shadow-xl group"
                >
                    <TrendingUp className={`w-6 h-6 ${isLoadingHistory ? 'animate-spin' : 'group-hover:scale-110 transition-transform'}`} />
                </button>
            </div>

            {isLoadingHistory ? (
                <div className="flex flex-col items-center justify-center py-32 grayscale opacity-30">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />
                    <p className="font-bold tracking-widest uppercase text-xs text-slate-400">Retrieving data from the archive...</p>
                </div>
            ) : history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-border/30 rounded-[48px] bg-card/10 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                    <div className="w-24 h-24 rounded-3xl bg-slate-900 flex items-center justify-center mb-8 shadow-inner border border-white/5">
                        <HistoryIcon className="w-12 h-12 text-slate-600" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white">No Pitches Found</h3>
                    <p className="text-slate-500 mb-10 text-center max-w-sm">Deploy your agents to start your first campaign!</p>
                    <button
                        onClick={() => setActiveTab("workspace")}
                        className="px-10 py-4 rounded-2xl bg-primary text-white font-bold hover:scale-105 transition-all shadow-2xl shadow-primary/30"
                    >
                        Go to Workspace
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 relative">
                    {history.map((item) => (
                        <div
                            key={item.id}
                            className="bg-card/40 backdrop-blur-xl border border-border/50 hover:border-primary/40 hover:bg-card/60 transition-all duration-300 rounded-[32px] p-8 flex flex-col md:flex-row md:items-center justify-between group cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-primary/5"
                            onClick={() => setSelectedHistoryItem(item)}
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                                    <Mail className="w-7 h-7 text-indigo-400" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="font-bold text-lg text-white truncate max-w-[200px] md:max-w-md tracking-tight">{item.target_url}</h4>
                                        <div className="p-1 rounded-md bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        <span className="flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-slate-800" />
                                        <span className="text-slate-400 opacity-60">{(item.context || "").substring(0, 30)}...</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mt-6 md:mt-0 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                <span className="text-[11px] font-black tracking-widest text-primary uppercase">View Details</span>
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <ChevronRight className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* History Detail Modal */}
            <AnimatePresence>
                {selectedHistoryItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-slate-950/90 backdrop-blur-xl"
                        onClick={() => setSelectedHistoryItem(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 30, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.95, y: 30, opacity: 0 }}
                            className="bg-card/80 border border-white/10 rounded-[48px] w-full max-w-5xl max-h-[85vh] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] relative flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-10 md:p-14 overflow-y-auto custom-scrollbar">
                                <div className="flex items-start justify-between mb-12">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                                            <ShieldCheck className="w-3.5 h-3.5" />
                                            Pitch Archive
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">{selectedHistoryItem.target_url}</h2>
                                    </div>
                                    <button
                                        onClick={() => setSelectedHistoryItem(null)}
                                        className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all group"
                                    >
                                        <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                    <div className="lg:col-span-2 space-y-8">
                                        <div className="relative group">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-violet-600 rounded-[36px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                                            <div className="relative bg-slate-950/80 border border-white/5 p-10 rounded-[32px] shadow-inner">
                                                <div className="whitespace-pre-wrap text-slate-200 leading-relaxed font-medium text-lg">
                                                    {selectedHistoryItem.pitch_text}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(selectedHistoryItem.pitch_text);
                                                    setConfirmModal({
                                                        isOpen: true,
                                                        type: "success",
                                                        title: "Copy Complete",
                                                        message: "The pitch text has been copied to your clipboard. 📋✨",
                                                        onConfirm: () => setConfirmModal(null),
                                                        showCancel: false
                                                    });
                                                }}
                                                className="py-5 rounded-2xl bg-white text-slate-950 font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-3 shadow-2xl"
                                            >
                                                <Copy className="w-5 h-5" /> Copy
                                            </button>
                                            <button
                                                onClick={() => handleDownloadPDF({ pitch: selectedHistoryItem.pitch_text, insights: selectedHistoryItem.insights })}
                                                className="py-5 rounded-2xl bg-slate-800 text-white font-black text-sm uppercase tracking-widest hover:bg-slate-700 transition-all flex items-center justify-center gap-3"
                                            >
                                                <FileDown className="w-5 h-5 text-emerald-400" /> PDF
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const subject = encodeURIComponent("Strategic Pitch Proposal");
                                                    const body = encodeURIComponent(selectedHistoryItem.pitch_text);
                                                    window.open(`mailto:?subject=${subject}&body=${body}`);
                                                }}
                                                className="py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3 md:col-start-auto col-span-2 md:col-span-1"
                                            >
                                                <Mail className="w-5 h-5" /> Email
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-10">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 text-slate-500">
                                                <Sparkles className="w-4 h-4 text-primary" />
                                                <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">Strategic Insights</h4>
                                            </div>
                                            <div className="space-y-4">
                                                {Array.isArray(selectedHistoryItem.insights) && selectedHistoryItem.insights.length > 0 ? (
                                                    selectedHistoryItem.insights.map((insight, idx) => (
                                                        <div key={idx} className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-primary/30 transition-colors">
                                                            <p className="text-slate-400 text-xs leading-relaxed font-medium">{insight}</p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5 opacity-50 text-center">
                                                        <p className="text-slate-500 text-xs italic">No tactical insights for this campaign.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 text-slate-500">
                                                <Layout className="w-4 h-4 text-primary" />
                                                <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">Input Context</h4>
                                            </div>
                                            <div className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl">
                                                <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">
                                                    "{selectedHistoryItem.context}"
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

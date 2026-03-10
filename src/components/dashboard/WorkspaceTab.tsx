"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    MessageSquare,
    Sparkles,
    Search,
    Zap,
    CheckCircle2,
    FileDown,
    Mail,
    Copy,
    Check,
    Twitter,
    Linkedin,
    ArrowLeft
} from "lucide-react";
import { TemplateId, TEMPLATES, AGENT_STEPS } from "@/app/dashboard/types";

export type WorkspaceTabProps = {
    step: "input" | "processing" | "result";
    setStep: (step: any) => void;
    context: string;
    setContext: (context: string) => void;
    targetUrl: string;
    setTargetUrl: (url: string) => void;
    pitchTemplate: TemplateId;
    setPitchTemplate: (id: TemplateId) => void;
    pitchStyle: "Concise" | "Professional" | "Bold";
    setPitchStyle: (style: any) => void;
    handleDeploy: () => void;
    activeAgentStep: number;
    result: { pitch: string; insights: string[] } | null;
    isCopied: boolean;
    copyToClipboard: () => void;
    handleDownloadPDF: () => void;
    handleComposeGmail: () => void;
    loadExample: () => void;
};

export function WorkspaceTab({
    step,
    setStep,
    context,
    setContext,
    targetUrl,
    setTargetUrl,
    pitchTemplate,
    setPitchTemplate,
    pitchStyle,
    setPitchStyle,
    handleDeploy,
    activeAgentStep,
    result,
    isCopied,
    copyToClipboard,
    handleDownloadPDF,
    handleComposeGmail,
    loadExample
}: WorkspaceTabProps) {
    return (
        <motion.div
            key="workspace"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full"
        >
            <AnimatePresence mode="wait">
                {/* ----- STEP 1: INPUT ----- */}
                {step === "input" && (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="max-w-4xl lg:max-w-5xl mx-auto w-full mt-4 md:mt-10"
                    >
                        <div className="mb-12">
                            <h1 className="text-5xl font-black mb-4 tracking-tighter text-white">
                                New <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent italic">Campaign</span>
                            </h1>
                            <p className="text-slate-400 text-lg font-medium">Orchestrate specialized AI agents for deep research and perfect pitching.</p>
                        </div>

                        <div className="space-y-10">
                            <div className="space-y-4">
                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2.5 px-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    Portfolio Context
                                </label>
                                <textarea
                                    value={context}
                                    onChange={(e) => setContext(e.target.value)}
                                    placeholder="Briefly describe your expertise, key achievements, and the specific value you provide..."
                                    className="w-full h-44 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-7 text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all shadow-inner placeholder:text-slate-600 leading-relaxed font-medium resize-none text-slate-200"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2.5 px-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                    Target Destination
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                        <Search className="w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <input
                                        type="url"
                                        value={targetUrl}
                                        onChange={(e) => setTargetUrl(e.target.value)}
                                        placeholder="Enter company URL or LinkedIn profile link"
                                        className="w-full bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all shadow-inner placeholder:text-slate-600 font-medium text-slate-200"
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5">
                                <div className="grid grid-cols-2 gap-6 mb-10">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 px-1">Strategy Template</label>
                                        <select
                                            value={pitchTemplate}
                                            onChange={(e) => setPitchTemplate(e.target.value as TemplateId)}
                                            className="w-full bg-slate-900/60 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-slate-300 focus:outline-none hover:bg-slate-800 transition-colors cursor-pointer appearance-none shadow-sm"
                                        >
                                            {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 px-1">Tonal Direction</label>
                                        <select
                                            value={pitchStyle}
                                            onChange={(e) => setPitchStyle(e.target.value as any)}
                                            className="w-full bg-slate-900/60 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-slate-300 focus:outline-none hover:bg-slate-800 transition-colors cursor-pointer appearance-none shadow-sm"
                                        >
                                            <option value="Professional">Professional</option>
                                            <option value="Concise">Concise</option>
                                            <option value="Bold">Bold</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center gap-5">
                                    <button
                                        onClick={handleDeploy}
                                        disabled={!targetUrl || !context}
                                        className="flex-1 py-5 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-[0.25em] hover:bg-indigo-500 transition-all shadow-glow hover:scale-[1.02] disabled:opacity-20 disabled:grayscale flex items-center justify-center gap-3 active:scale-95 group overflow-hidden relative"
                                    >
                                        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                                        <Zap className="w-4 h-4 fill-white animate-pulse" />
                                        Initiate Swarm
                                    </button>
                                    <button
                                        onClick={loadExample}
                                        className="px-8 py-5 rounded-2xl text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all border border-dashed border-white/10"
                                    >
                                        Example
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ----- STEP 2: PROCESSING ----- */}
                {step === "processing" && (
                    <motion.div
                        key="processing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="max-w-4xl lg:max-w-5xl mx-auto w-full flex flex-col items-center justify-center py-20 mt-10"
                    >
                        <div className="w-40 h-40 mb-14 relative">
                            <div className="absolute inset-0 rounded-full border-t border-primary/40 animate-spin" style={{ animationDuration: '3s' }} />
                            <div className="absolute inset-4 rounded-full border-r border-accent/40 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }} />
                            <div className="absolute inset-0 flex items-center justify-center bg-radial from-primary/10 to-transparent rounded-full shadow-glow">
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }}>
                                    <Sparkles className="w-12 h-12 text-primary text-glow" />
                                </motion.div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-black mb-12 tracking-widest text-white uppercase text-center">
                            Synchronizing <span className="text-primary italic">Intelligence...</span>
                        </h2>

                        <div className="w-full space-y-3">
                            {AGENT_STEPS.map((agentStep) => {
                                const isActive = activeAgentStep === agentStep.id;
                                const isCompleted = activeAgentStep > agentStep.id;

                                if (activeAgentStep < agentStep.id) return null;

                                return (
                                    <motion.div
                                        key={agentStep.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex items-center gap-6 p-6 rounded-2xl border transition-all duration-500 ${isActive ? 'bg-primary/5 border-primary/30 shadow-glow' : 'bg-slate-900/20 border-white/5 opacity-50'}`}
                                    >
                                        <div className="shrink-0">
                                            {isCompleted ? (
                                                <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                </div>
                                            ) : (
                                                <div className="w-6 h-6 rounded-full border border-primary/20 border-t-primary animate-spin" />
                                            )}
                                        </div>
                                        <span className={`text-xs font-bold tracking-widest uppercase ${isCompleted ? 'text-slate-500  line-through' : isActive ? 'text-white' : 'text-slate-500'}`}>
                                            {agentStep.text}
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* ----- STEP 3: RESULT ----- */}
                {step === "result" && result && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-[1400px] mx-auto w-full space-y-12 relative pb-20"
                    >
                        {/* Header Section */}
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-glow relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-primary/20 animate-pulse group-hover:bg-primary/30 transition-colors" />
                                    <Sparkles className="w-8 h-8 text-primary relative z-10" />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
                                        <p className="text-emerald-500 font-black tracking-[0.2em] text-[10px] uppercase">Intelligence Synthesis Complete</p>
                                    </div>
                                    <h1 className="text-5xl font-black text-white tracking-tighter leading-tight">
                                        Strategic <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent italic">Blueprint</span>
                                    </h1>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex bg-slate-900/40 backdrop-blur-xl border border-white/5 p-1.5 rounded-2xl overflow-hidden shadow-2xl">
                                    <button
                                        onClick={handleDownloadPDF}
                                        className="px-6 py-3 rounded-xl bg-white text-slate-950 font-black text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2.5 shadow-lg active:scale-95"
                                    >
                                        <FileDown className="w-4 h-4" /> Download Report
                                    </button>
                                    <button
                                        onClick={handleComposeGmail}
                                        className="px-5 py-3 rounded-xl text-slate-400 font-bold text-[11px] uppercase tracking-widest hover:text-white transition-all flex items-center gap-2.5 active:scale-95"
                                    >
                                        <Mail className="w-4 h-4" /> Gmail
                                    </button>
                                    <button
                                        onClick={copyToClipboard}
                                        className={`px-5 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all flex items-center gap-2.5 active:scale-95 ${isCopied ? 'text-emerald-400 bg-emerald-400/10' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        {isCopied ? 'Copied' : 'Copy Text'}
                                    </button>
                                </div>

                                <div className="flex bg-slate-900/40 backdrop-blur-xl border border-white/5 p-1.5 rounded-2xl overflow-hidden shadow-2xl">
                                    <button
                                        onClick={() => {
                                            const text = encodeURIComponent("Just generated a hyper-personalized cold email pitch with PitchAgent Pro 🚀 pitchagent-pro.vercel.app");
                                            window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
                                        }}
                                        className="px-4 py-3 rounded-xl text-slate-400 hover:text-white transition-all active:scale-90"
                                    >
                                        <Twitter className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            const url = encodeURIComponent("https://pitchagent-pro.vercel.app");
                                            const summary = encodeURIComponent("I used PitchAgent Pro's AI agents to generate a hyper-personalized cold email pitch in under 3 minutes.");
                                            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${summary}`, "_blank");
                                        }}
                                        className="px-4 py-3 rounded-xl text-slate-400 hover:text-white transition-all active:scale-90"
                                    >
                                        <Linkedin className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                            {/* Main Pitch Card */}
                            <div className="xl:col-span-8 space-y-10">
                                <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[48px] p-10 md:p-20 shadow-[0_32px_128px_-12px_rgba(0,0,0,0.6)] relative overflow-hidden group border border-white/10">
                                    {/* Subdued Gradient Overlays */}
                                    <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary/5 blur-[120px] rounded-full -mr-[10rem] -mt-[10rem] group-hover:bg-primary/10 transition-colors duration-1000" />
                                    <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-accent/5 blur-[100px] rounded-full -ml-[12rem] -mb-[12rem]" />

                                    {/* Document Header Line */}
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 pb-8 border-b border-white/5 relative z-10">
                                        <div className="space-y-1">
                                            <p className="text-primary font-black text-[10px] tracking-[0.3em] uppercase">Private & Confidential</p>
                                            <h3 className="text-xl font-bold text-white tracking-tight">Personalized Outreach Narrative</h3>
                                        </div>
                                        <div className="flex items-center gap-6 text-slate-500 font-bold text-[10px] uppercase tracking-widest whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                                                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                            <div className="flex items-center gap-2 border-l border-white/10 pl-6">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                Strategic Blueprint
                                            </div>
                                        </div>
                                    </div>

                                    <div className="prose prose-invert max-w-none relative z-10">
                                        <div className="whitespace-pre-wrap text-slate-200 text-lg md:text-2xl leading-[1.85] font-serif tracking-tight selection:bg-primary/40 selection:text-white opacity-95">
                                            {result.pitch.split(/(\[.*?\])/).map((part, i) => (
                                                part.startsWith('[') && part.endsWith(']') ? (
                                                    <span key={i} className="px-3 py-1 rounded-xl bg-white/5 text-primary border border-primary/30 font-sans not-italic text-[13px] md:text-sm align-middle mx-1 font-black uppercase tracking-[0.15em] shadow-inner backdrop-blur-sm group/tag hover:bg-primary/10 transition-colors cursor-help">
                                                        {part.replace(/[\[\]]/g, '')}
                                                    </span>
                                                ) : part
                                            ))}
                                        </div>
                                    </div>

                                    {/* Subtle Footer Watermark */}
                                    <div className="mt-20 pt-10 border-t border-white/5 flex items-center justify-between opacity-30 select-none grayscale">
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Prepared by AI Agents</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-[1px] bg-slate-700" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">PitchAgent Pro</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-start">
                                    <button
                                        onClick={() => {
                                            setStep("input");
                                            setContext("");
                                            setTargetUrl("");
                                        }}
                                        className="group flex items-center gap-4 text-slate-500 hover:text-white transition-all text-[11px] font-black uppercase tracking-[0.25em] px-10 py-5 rounded-2xl border border-white/5 hover:border-white/10 hover:bg-white/5 shadow-sm active:scale-95"
                                    >
                                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-2" />
                                        Initialize New Campaign
                                    </button>
                                </div>
                            </div>

                            {/* Strategic Insights Sidebar */}
                            <div className="xl:col-span-4 space-y-10">
                                <div className="px-2 space-y-2">
                                    <div className="flex items-center gap-3">
                                        <Sparkles className="w-5 h-5 text-primary text-glow" />
                                        <h2 className="text-sm font-black text-white uppercase tracking-[0.25em]">Strategic DNA</h2>
                                    </div>
                                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed uppercase tracking-wider">
                                        AI recommendations based on target analysis
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {result.insights.map((insight, i) => {
                                        const parts = insight.split(':');
                                        const title = parts.length > 1 ? parts[0] : '';
                                        const content = parts.length > 1 ? parts.slice(1).join(':') : insight;

                                        return (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 * i }}
                                                className="glass-card rounded-[24px] p-7 transition-all hover:bg-white/5 border border-white/5 group hover:border-primary/20 shadow-sm"
                                            >
                                                <div className="flex items-start gap-5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 group-hover:shadow-glow transition-all" />
                                                    <div className="space-y-3">
                                                        {title && (
                                                            <h4 className="font-black text-[11px] tracking-[0.15em] text-white uppercase italic">
                                                                {title}
                                                            </h4>
                                                        )}
                                                        <p className="text-slate-400 text-sm leading-relaxed font-medium">
                                                            {content.trim()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                <div className="p-8 rounded-[32px] glass-card border-dashed border-white/10 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50" />
                                    <p className="text-slate-300 text-sm leading-[1.8] text-center italic font-serif relative z-10 opacity-70">
                                        "Engineered to maximize authority through semantic alignment and frictionless conversion levers."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

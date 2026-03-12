"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, User, Target, Zap, Rocket, ChevronRight, ArrowLeft } from "lucide-react";

type OnboardingModalProps = {
    isOpen: boolean;
    onComplete: (data: {
        fullName: string;
        specialty: string;
        strength: string;
    }) => void;
};

export function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: "",
        specialty: "",
        strength: ""
    });

    const specialtyOptions = [
        "SaaS Founder",
        "UI/UX Designer",
        "Full-stack Developer",
        "Marketing Agency",
        "Freelancer",
        "Sales Professional"
    ];

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = () => {
        onComplete(formData);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-3xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 30 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="w-full max-w-xl bg-slate-900/60 border border-white/10 rounded-[48px] p-10 md:p-16 shadow-[0_0_120px_rgba(99,102,241,0.15)] relative overflow-hidden backdrop-saturate-150"
                >
                    {/* Premium Background Accents */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px] pointer-events-none -mr-40 -mt-20 opacity-40" />
                    <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[120px] pointer-events-none opacity-30" />
                    
                    {/* Subtle grid pattern overlay */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />

                    {/* Navigation Header */}
                    <div className="relative z-10 flex items-center justify-between mb-12">
                        {step > 1 ? (
                            <button 
                                onClick={prevStep}
                                className="p-3 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group"
                            >
                                <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                            </button>
                        ) : <div className="w-11 h-11" />}
                        
                        <div className="flex gap-2">
                            {[1, 2, 3].map((s) => (
                                <motion.div
                                    key={s}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${
                                        s === step ? "w-8 bg-primary shadow-glow-sm" : 
                                        s < step ? "w-4 bg-primary/40" : "w-4 bg-white/10"
                                    }`}
                                />
                            ))}
                        </div>
                        <div className="w-11 h-11" />
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                                transition={{ duration: 0.4 }}
                                className="space-y-10 relative z-10"
                            >
                                <div className="space-y-4">
                                    <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 shadow-glow-sm">
                                        <User className="w-8 h-8 text-primary" />
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
                                        Welcome! <br />
                                        What's your <span className="text-primary italic">name</span>?
                                    </h2>
                                    <p className="text-slate-400 font-medium text-lg leading-relaxed">
                                        We'll use this to personalize your professional experience.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="relative group">
                                        <input
                                            autoFocus
                                            type="text"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            onKeyDown={(e) => e.key === "Enter" && formData.fullName && nextStep()}
                                            placeholder="John Doe"
                                            className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 text-2xl text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/20 transition-all font-bold placeholder:text-slate-700 shadow-inner group-hover:bg-white/[0.07]"
                                        />
                                    </div>
                                    <button
                                        disabled={!formData.fullName}
                                        onClick={nextStep}
                                        className="w-full py-6 rounded-3xl bg-white text-slate-950 font-black text-base uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-3 disabled:opacity-30 shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        Get Started <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                                transition={{ duration: 0.4 }}
                                className="space-y-10 relative z-10"
                            >
                                <div className="space-y-4">
                                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 shadow-glow-sm">
                                        <Target className="w-8 h-8 text-indigo-400" />
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
                                        What is your <br />
                                        <span className="text-indigo-400 italic">specialty</span>?
                                    </h2>
                                    <p className="text-slate-400 font-medium text-lg leading-relaxed">
                                        Our AI learns the professional tone that best fits your expertise.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {specialtyOptions.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => {
                                                setFormData({ ...formData, specialty: opt });
                                                nextStep();
                                            }}
                                            className={`px-6 py-5 rounded-2xl border text-xs font-bold uppercase tracking-widest transition-all text-center ${formData.specialty === opt
                                                    ? "bg-primary border-primary text-white shadow-glow-sm scale-[1.02]"
                                                    : "bg-white/5 border-white/5 text-slate-400 hover:border-white/20 hover:text-white hover:bg-white/[0.08]"
                                                }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setFormData({ ...formData, specialty: "Other" })}
                                        className={`px-6 py-5 rounded-2xl border text-xs font-bold uppercase tracking-widest transition-all text-center ${formData.specialty === "Other" || (!specialtyOptions.includes(formData.specialty) && formData.specialty !== "")
                                                ? "bg-primary border-primary text-white shadow-glow-sm scale-[1.02]"
                                                : "bg-white/5 border-white/5 text-slate-400 hover:border-white/20 hover:text-white hover:bg-white/[0.08]"
                                            }`}
                                    >
                                        Other...
                                    </button>
                                </div>

                                <AnimatePresence>
                                    {(formData.specialty === "Other" || (!specialtyOptions.includes(formData.specialty) && formData.specialty !== "")) && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                            animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                            className="space-y-4 overflow-hidden"
                                        >
                                            <input
                                                autoFocus
                                                type="text"
                                                value={formData.specialty === "Other" ? "" : formData.specialty}
                                                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                                                placeholder="Type your specialty..."
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all font-bold placeholder:text-slate-700"
                                            />
                                            <button
                                                disabled={!formData.specialty || formData.specialty === "Other"}
                                                onClick={nextStep}
                                                className="w-full py-5 rounded-2xl bg-white text-slate-950 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-3 disabled:opacity-30"
                                            >
                                                Confirm Specialty <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                                transition={{ duration: 0.4 }}
                                className="space-y-10 relative z-10"
                            >
                                <div className="space-y-4">
                                    <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6 shadow-glow-sm">
                                        <Zap className="w-8 h-8 text-accent" />
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
                                        Define your <br />
                                        <span className="text-accent italic">edge</span>.
                                    </h2>
                                    <p className="text-slate-400 font-medium text-lg leading-relaxed">
                                        What's your unfair advantage? Tell us what sets you apart.
                                    </p>
                                </div>

                                    <div className="space-y-6">
                                        <textarea
                                            autoFocus
                                            value={formData.strength}
                                            onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                                            placeholder="e.g. 10+ years in Fintech, fast execution, obsessed with ROI..."
                                            className="w-full h-40 bg-white/5 border border-white/10 rounded-3xl px-8 py-6 text-xl text-white focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/20 transition-all font-medium placeholder:text-slate-700 resize-none shadow-inner"
                                        />
                                        <button
                                            onClick={handleSubmit}
                                            disabled={!formData.strength}
                                            className="w-full py-7 rounded-3xl bg-gradient-to-r from-primary to-accent text-white font-black text-base uppercase tracking-widest flex items-center justify-center gap-3 shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
                                        >
                                            <Rocket className="w-6 h-6 animate-pulse" /> Finalize My Identity
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

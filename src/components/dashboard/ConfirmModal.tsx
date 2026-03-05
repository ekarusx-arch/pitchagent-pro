"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Trash2, Sparkles } from "lucide-react";

export type ConfirmModalProps = {
    isOpen: boolean;
    type?: "danger" | "success" | "info";
    title: string;
    message: string;
    onConfirm: () => void;
    onClose: () => void;
    showCancel?: boolean;
};

export function ConfirmModal({ isOpen, type, title, message, onConfirm, onClose, showCancel }: ConfirmModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        className="relative w-full max-w-sm bg-card/90 border border-white/10 rounded-[48px] p-10 shadow-2xl z-10 text-center"
                    >
                        <div className={`w-20 h-20 rounded-[28px] mx-auto flex items-center justify-center mb-8 shadow-inner ${type === "success" ? "bg-green-500/10 text-green-400" :
                            type === "danger" ? "bg-red-500/10 text-red-400" :
                                "bg-primary/10 text-primary"
                            }`}>
                            {type === "success" ? (
                                <CheckCircle2 className="w-10 h-10" />
                            ) : type === "danger" ? (
                                <Trash2 className="w-10 h-10" />
                            ) : (
                                <Sparkles className="w-10 h-10" />
                            )}
                        </div>
                        <h3 className="text-2xl font-black text-white mb-3 tracking-tighter">{title}</h3>
                        <p className="text-slate-400 text-[15px] leading-relaxed mb-10 font-medium">{message}</p>
                        <div className="flex gap-4">
                            {showCancel !== false && (
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={onConfirm}
                                className={`flex-1 py-4 rounded-2xl text-white font-black text-sm uppercase tracking-widest transition-all shadow-2xl ${type === "success" ? "bg-green-600 hover:bg-green-500 shadow-green-500/20" :
                                    type === "danger" ? "bg-red-600 hover:bg-red-500 shadow-red-500/20" :
                                        "bg-primary hover:bg-primary/90 shadow-primary/20"
                                    }`}
                            >
                                {type === "success" ? "OK" : showCancel === false ? "OK" : "Confirm"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

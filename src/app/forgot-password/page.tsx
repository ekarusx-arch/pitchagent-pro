"use client";

import { resetPassword } from "./actions";
import { motion } from "framer-motion";
import { Mail, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function ForgotPasswordForm() {
    const searchParams = useSearchParams();
    const errorMessage = searchParams.get("error");
    const successMessage = searchParams.get("message");

    return (
        <>
            <div className="flex justify-center mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent box-glow flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                </div>
            </div>

            <h1 className="text-2xl font-bold text-center mb-2">Reset Password</h1>
            <p className="text-slate-400 text-sm text-center mb-8">Enter your email and we'll send you a link to reset your password.</p>

            {errorMessage && (
                <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-red-200">{errorMessage}</span>
                </div>
            )}

            {successMessage && (
                <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-emerald-200">{successMessage}</span>
                </div>
            )}

            <form className="space-y-4">
                <div className="space-y-2 mb-6">
                    <label className="text-sm font-medium text-slate-300" htmlFor="email">Email address</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-600"
                        placeholder="you@example.com"
                    />
                </div>

                <div className="pt-2">
                    <button
                        formAction={resetPassword}
                        className="w-full h-11 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium flex items-center justify-center transition-colors"
                    >
                        Send Reset Link
                    </button>
                    <Link
                        href="/login"
                        className="mt-4 w-full h-11 bg-transparent border border-border hover:bg-white/5 text-slate-200 rounded-lg font-medium flex items-center justify-center transition-colors flex gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Login
                    </Link>
                </div>
            </form>
        </>
    );
}

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm bg-card border border-border rounded-2xl p-8 shadow-2xl relative z-10"
            >
                <Suspense fallback={<div className="text-center text-slate-400 py-10">Loading...</div>}>
                    <ForgotPasswordForm />
                </Suspense>
            </motion.div>
        </div>
    );
}

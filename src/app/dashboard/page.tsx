"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Copy,
    Sparkles,
    CheckCircle2,
    ChevronRight,
    Check,
    LogOut,
    Mail,
    LayoutDashboard,
    CreditCard,
    ShoppingBag,
    Zap,
    ShieldCheck,
    TrendingUp,
    MessageSquare,
    Package,
    Search,
    History as HistoryIcon,
    ExternalLink,
    Calendar,
    Menu,
    X,
    FileDown,
    Share2,
    Trash2,
    Plus,
    Edit2,
    Check as CheckIcon,
    Settings,
    Users,
    Layout
} from "lucide-react";
import Link from "next/link";
import { logout } from "@/app/login/actions";

type AgentStep = {
    id: number;
    text: string;
};

const AGENT_STEPS: AgentStep[] = [
    { id: 1, text: "ROUTER: Initializing 4-agent swarm for target analysis..." },
    { id: 2, text: "SCRAPER: Bypassing bot detection and extracting business KPIs..." },
    { id: 3, text: "ANALYST: Processing source context against target pain points..." },
    { id: 4, text: "STRATEGIST: Formulating persuasive value proposition hooks..." },
    { id: 5, text: "COPYWRITER: Drafting professional cold email & proposal draft..." },
    { id: 6, text: "FINALIZER: Polishing and sanity-checking result..." },
];

const TEMPLATES = [
    { id: "cold_email", label: "🎯 Cold Email", hint: "Write a concise, direct cold email focused on pain points and ROI." },
    { id: "partnership", label: "🤝 Partnership", hint: "Write a warm partnership proposal highlighting mutual benefits and synergies." },
    { id: "job_inquiry", label: "💼 Job Inquiry", hint: "Write a compelling job inquiry email showcasing unique skills and cultural fit." },
    { id: "pr_pitch", label: "📣 PR / Media", hint: "Write a media pitch email with a newsworthy angle and clear story hook." },
] as const;

type TemplateId = typeof TEMPLATES[number]["id"];

type DashboardTab = "workspace" | "upgrade" | "shop" | "history" | "profile";

type PitchHistoryItem = {
    id: string;
    target_url: string;
    pitch_text: string;
    insights: string[];
    context: string;
    created_at: string;
};

type ProfileContext = {
    name: string;
    content: string;
};

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState<DashboardTab>("workspace");
    const [step, setStep] = useState<"input" | "processing" | "result">("input");
    const [context, setContext] = useState("");
    const [targetUrl, setTargetUrl] = useState("");
    const [pitchTemplate, setPitchTemplate] = useState<TemplateId>("cold_email");
    const [pitchStyle, setPitchStyle] = useState<"Concise" | "Professional" | "Bold">("Professional");
    const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
    const [isInitialProfileLoad, setIsInitialProfileLoad] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Processing State
    const [activeAgentStep, setActiveAgentStep] = useState<number>(0);

    // Result State
    const [result, setResult] = useState<{ pitch: string, insights: string[] } | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    // History State
    const [history, setHistory] = useState<PitchHistoryItem[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [selectedHistoryItem, setSelectedHistoryItem] = useState<PitchHistoryItem | null>(null);

    // Profile State
    const [profile, setProfile] = useState<{ credits: number, is_pro: boolean, subscription_plan: string, email: string, contexts: ProfileContext[] } | null>(null);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [editingProfileIndex, setEditingProfileIndex] = useState<number | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const { createClient } = await import("@/utils/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { data } = await supabase
                .from("profiles")
                .select("credits, is_pro, subscription_plan, email, context")
                .eq("id", user.id)
                .single();

            if (data) {
                let parsedContexts: ProfileContext[] = [];
                try {
                    if (Array.isArray(data.context)) {
                        parsedContexts = data.context;
                    } else if (typeof data.context === "string" && data.context.startsWith("[")) {
                        parsedContexts = JSON.parse(data.context);
                    } else if (data.context) {
                        // Legacy single string context or non-array object
                        parsedContexts = typeof data.context === "string"
                            ? [{ name: "Default", content: data.context }]
                            : [{ name: "Default", content: JSON.stringify(data.context) }];
                    } else {
                        parsedContexts = [{ name: "Default", content: "" }];
                    }
                } catch (e) {
                    parsedContexts = [{ name: "Default", content: "" }];
                }

                setProfile({
                    credits: data.credits || 0,
                    is_pro: data.is_pro || false,
                    subscription_plan: data.subscription_plan || "Free",
                    email: user.email || "",
                    contexts: parsedContexts
                });
            } else {
                // [FALLBACK] If profile does not exist, create it (for legacy users)
                const defaultContexts = [{ name: "Default", content: "" }];
                const { error: insertError } = await supabase
                    .from("profiles")
                    .insert({
                        id: user.id,
                        email: user.email,
                        credits: 100,
                        context: JSON.stringify(defaultContexts)
                    });

                if (!insertError) {
                    setProfile({
                        credits: 100,
                        is_pro: false,
                        subscription_plan: "Free",
                        email: user.email || "",
                        contexts: defaultContexts
                    });
                }
            }
        }
    };

    useEffect(() => {
        if (profile && profile.contexts.length > 0 && isInitialProfileLoad) {
            if (!context) {
                setContext(profile.contexts[0].content);
            }
            setCurrentProfileIndex(0);
            setIsInitialProfileLoad(false);
        }
    }, [profile, isInitialProfileLoad, context]);

    useEffect(() => {
        if (activeTab === "history") {
            fetchHistory();
        }
    }, [activeTab]);

    const fetchHistory = async () => {
        const { createClient } = await import("@/utils/supabase/client");
        const supabase = createClient();

        setIsLoadingHistory(true);
        try {
            const { data, error } = await supabase
                .from("pitches")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setHistory(data || []);
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const loadExample = () => {
        setTargetUrl("https://www.notion.so/about");
        setContext("I am a UI/UX designer with 10 years of experience in B2B SaaS. I specialize in simplifying complex dashboards to improve user retention. Most recently, I successfully increased user retention by 30% for a major client.");
    };

    useEffect(() => {
        if (step === "processing") {
            let currentStep = 1;
            setActiveAgentStep(currentStep);

            const interval = setInterval(() => {
                currentStep += 1;
                if (currentStep <= AGENT_STEPS.length) {
                    setActiveAgentStep(currentStep);
                } else {
                    clearInterval(interval);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [step]);

    const handleDeploy = async () => {
        if (!targetUrl || !context) return;

        setStep("processing");

        try {
            const templateHint = TEMPLATES.find(t => t.id === pitchTemplate)?.hint || "";
            // API call
            const res = await fetch("/api/generate-pitch", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ context, targetUrl, templateHint, pitchStyle })
            });

            const data = await res.json();

            if (data.success) {
                setResult(data.data);
                setStep("result");
                fetchProfile(); // Refresh credits
            } else {
                alert("Error: " + (data.error || "Failed to generate pitch."));
                setStep("input");
            }
        } catch (error) {
            console.error(error);
            alert("An unexpected error occurred. Please try again.");
            setStep("input");
        }
    };

    const handleDeleteProfile = async (index: number) => {
        if (!profile || profile.contexts.length <= 1) {
            alert("Cannot delete the last profile.");
            return;
        }
        const updatedContexts = profile.contexts.filter((_, i) => i !== index);
        try {
            await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contexts: updatedContexts }),
            });
            setProfile(prev => prev ? { ...prev, contexts: updatedContexts } : null);
            alert("Profile deleted successfully.");
        } catch (error) {
            console.error("Error deleting profile:", error);
            alert("Failed to delete profile.");
        }
    };

    const handleRenameProfile = async (index: number, newName: string) => {
        if (!profile) return;
        const updatedContexts = [...profile.contexts];
        updatedContexts[index].name = newName;
        try {
            await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contexts: updatedContexts }),
            });
            setProfile(prev => prev ? { ...prev, contexts: updatedContexts } : null);
            setEditingProfileIndex(null);
        } catch (error) {
            console.error("Error renaming profile:", error);
            alert("Failed to rename profile.");
        }
    };

    const handleSaveProfile = async (updatedContexts: ProfileContext[]) => {
        setIsSavingProfile(true);
        try {
            // Save as JSON string
            const res = await fetch("/api/profiles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ context: updatedContexts })
            });
            const data = await res.json();
            if (data.success) {
                setProfile(prev => prev ? { ...prev, contexts: updatedContexts } : null);
                alert("All profiles synced to cloud successfully!");
            } else {
                alert("Error saving profiles: " + data.error);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to save profiles.");
        } finally {
            setIsSavingProfile(false);
        }
    };

    const addProfile = () => {
        if (!profile) return;
        const newProfiles = [...profile.contexts, { name: "New Profile", content: "" }];
        setProfile({ ...profile, contexts: newProfiles });
    };

    const deleteProfile = (index: number) => {
        if (!profile || profile.contexts.length <= 1) return;
        const newProfiles = profile.contexts.filter((_, i) => i !== index);
        setProfile({ ...profile, contexts: newProfiles });
        if (currentProfileIndex >= newProfiles.length) {
            setCurrentProfileIndex(newProfiles.length - 1);
        }
    };

    const handleCheckout = async (options: { priceId?: string, planName: string, mode?: string, credits?: number }) => {
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(options)
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert("Error initializing checkout: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            console.error(error);
            alert("Payment failed to initialize.");
        }
    };

    const copyToClipboard = () => {
        if (result) {
            navigator.clipboard.writeText(result.pitch);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    const handleDownloadPDF = async () => {
        if (!result) return;
        const { jsPDF } = await import("jspdf");
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        });

        const pageW = doc.internal.pageSize.getWidth();
        const margin = 20;
        const maxW = pageW - margin * 2;
        let y = 20;

        // Header
        doc.setFillColor(99, 102, 241);
        doc.rect(0, 0, pageW, 14, "F");
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.text("PitchAgent Pro — Generated Pitch", margin, 9);
        doc.text(new Date().toLocaleDateString("en-US"), pageW - margin, 9, { align: "right" });
        y = 28;

        // Pitch section title
        doc.setFontSize(14);
        doc.setTextColor(30, 30, 50);
        doc.setFont("helvetica", "bold");
        doc.text("Cold Email Draft", margin, y);
        y += 8;

        // Divider
        doc.setDrawColor(99, 102, 241);
        doc.setLineWidth(0.5);
        doc.line(margin, y, pageW - margin, y);
        y += 6;

        // Pitch body
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 70);
        doc.setFont("helvetica", "normal");
        const pitchLines = doc.splitTextToSize(result.pitch, maxW);
        pitchLines.forEach((line: string) => {
            if (y > 270) { doc.addPage(); y = 20; }
            doc.text(line, margin, y);
            y += 5.5;
        });

        y += 10;

        // Insights section title
        if (y > 250) { doc.addPage(); y = 20; }
        doc.setFontSize(14);
        doc.setTextColor(30, 30, 50);
        doc.setFont("helvetica", "bold");
        doc.text("Strategic Insights", margin, y);
        y += 8;

        doc.setDrawColor(99, 102, 241);
        doc.line(margin, y, pageW - margin, y);
        y += 6;

        // Insights body
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(50, 50, 70);
        result.insights.forEach((insight, i) => {
            const lines = doc.splitTextToSize(`${i + 1}. ${insight}`, maxW - 4);
            lines.forEach((line: string) => {
                if (y > 270) { doc.addPage(); y = 20; }
                doc.text(line, margin + 2, y);
                y += 5.5;
            });
            y += 2;
        });

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(160, 160, 180);
        doc.text("Generated by PitchAgent Pro — pitchagent-pro.vercel.app", pageW / 2, 290, { align: "center" });

        doc.save(`pitchagent-pitch-${Date.now()}.pdf`);
    };

    const handleSendEmail = () => {
        if (!result) return;
        const subject = encodeURIComponent("Cold Email Draft from PitchAgent Pro");
        const body = encodeURIComponent(result.pitch);
        window.open(`mailto:?subject=${subject}&body=${body}`);
    };

    const handleComposeGmail = () => {
        if (!result) return;
        const subject = encodeURIComponent("Cold Email Draft from PitchAgent Pro");
        const body = encodeURIComponent(result.pitch);
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`;
        window.open(gmailUrl, "_blank");
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 bg-card/90 backdrop-blur-xl border-r border-border flex flex-col shrink-0 z-50 transition-transform duration-300 lg:relative lg:translate-x-0 ${isMobileMenuOpen ? "translate-x-0 w-72" : "-translate-x-full w-64 lg:w-64"}`}>
                <div className="p-6">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-110 transition-transform">
                            <Zap className="w-4 h-4 text-white" />
                        </div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">PitchAgent</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <button
                        onClick={() => { setActiveTab("workspace"); setIsMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "workspace" ? "bg-primary/15 text-primary border border-primary/20 shadow-[0_0_15px_-3px_rgba(139,92,246,0.3)]" : "text-slate-400 hover:text-white hover:bg-slate-800/50"}`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-medium text-sm">Workspace</span>
                    </button>
                    <button
                        onClick={() => { setActiveTab("upgrade"); setIsMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "upgrade" ? "bg-primary/15 text-primary border border-primary/20 shadow-[0_0_15px_-3px_rgba(139,92,246,0.3)]" : "text-slate-400 hover:text-white hover:bg-slate-800/50"}`}
                    >
                        <TrendingUp className="w-5 h-5" />
                        <span className="font-medium text-sm">Upgrade</span>
                    </button>
                    <button
                        onClick={() => { setActiveTab("history"); setIsMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "history" ? "bg-primary/15 text-primary border border-primary/20 shadow-[0_0_15px_-3px_rgba(139,92,246,0.3)]" : "text-slate-400 hover:text-white hover:bg-slate-800/50"}`}
                    >
                        <HistoryIcon className="w-5 h-5" />
                        <span className="font-medium text-sm">History</span>
                    </button>
                    <button
                        onClick={() => { setActiveTab("shop"); setIsMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "shop" ? "bg-primary/15 text-primary border border-primary/20 shadow-[0_0_15px_-3px_rgba(139,92,246,0.3)]" : "text-slate-400 hover:text-white hover:bg-slate-800/50"}`}
                    >
                        <ShoppingBag className="w-5 h-5" />
                        <span className="font-medium text-sm">Shop</span>
                    </button>
                    <button
                        onClick={() => { setActiveTab("profile"); setIsMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "profile" ? "bg-primary/15 text-primary border border-primary/20 shadow-[0_0_15px_-3px_rgba(139,92,246,0.3)]" : "text-slate-400 hover:text-white hover:bg-slate-800/50"}`}
                    >
                        <Users className="w-5 h-5 outline-none" />
                        <span className="font-medium text-sm">My Profile</span>
                    </button>
                </nav>

                <div className="p-4 mt-auto border-t border-border/50">
                    <form action={logout}>
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/5 transition-all group">
                            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium text-sm">Sign Out</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 relative flex flex-col h-screen overflow-y-auto bg-gradient-to-b from-slate-950 to-background">
                {/* Header */}
                <header className="h-16 border-b border-border/50 flex items-center justify-between px-4 md:px-8 bg-card/10 backdrop-blur-sm sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 hover:bg-white/5 rounded-lg text-slate-400"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="text-sm font-medium text-slate-400 uppercase tracking-widest">
                            {activeTab}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-bold text-slate-500 uppercase">Credits</span>
                            <span className="text-sm font-mono font-bold text-primary">
                                {profile ? profile.credits.toLocaleString() : "---"}
                            </span>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-sm font-bold shadow-lg border border-white/10 uppercase">
                            {profile?.email?.[0] || "U"}
                        </div>
                    </div>
                </header>

                <div className="p-8 md:p-12 w-full max-w-6xl mx-auto flex-1">
                    <AnimatePresence mode="wait">
                        {/* ----- WORKSPACE TAB ----- */}
                        {activeTab === "workspace" && (
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
                                            className="max-w-2xl mx-auto w-full"
                                        >
                                            <div className="mb-8">
                                                <h1 className="text-4xl font-extrabold mb-3 tracking-tight">New Pitch Campaign</h1>
                                                <p className="text-slate-400 text-lg">Deploy 4 specialized agents to research and draft the perfect cold pitch.</p>
                                            </div>

                                            <div className="space-y-8">
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                                            <MessageSquare className="w-4 h-4 text-primary" />
                                                            My Context (Portfolio / Skills)
                                                        </label>
                                                        <div className="flex items-center gap-3">
                                                            {profile && profile.contexts.length > 0 && (
                                                                <select
                                                                    value={currentProfileIndex}
                                                                    onChange={(e) => {
                                                                        const idx = parseInt(e.target.value);
                                                                        setCurrentProfileIndex(idx);
                                                                        setContext(profile.contexts[idx].content);
                                                                    }}
                                                                    className="bg-card border border-border rounded-lg px-3 py-1 text-xs font-bold text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary/30"
                                                                >
                                                                    {profile.contexts.map((p, i) => (
                                                                        <option key={i} value={i}>{p.name}</option>
                                                                    ))}
                                                                </select>
                                                            )}
                                                            <button
                                                                onClick={loadExample}
                                                                className="text-[11px] font-bold text-primary hover:text-primary/80 transition-colors bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10"
                                                            >
                                                                Load Example
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <textarea
                                                        value={context}
                                                        onChange={(e) => setContext(e.target.value)}
                                                        placeholder="Describe your unique value prop, portfolio highlights, and success metrics here. This is what the agents use to sell 'YOU'."
                                                        className="w-full h-44 bg-card border border-border rounded-2xl p-5 text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm resize-none placeholder:text-slate-700 leading-relaxed font-medium"
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <label className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                                        <Layout className="w-4 h-4 text-primary" />
                                                        Select Pitch Template
                                                    </label>
                                                    <div className="flex flex-wrap gap-3">
                                                        {TEMPLATES.map((t) => (
                                                            <button
                                                                key={t.id}
                                                                onClick={() => setPitchTemplate(t.id)}
                                                                className={`px-5 py-3 rounded-2xl text-[13px] font-bold transition-all border shadow-sm ${pitchTemplate === t.id
                                                                    ? "bg-primary/10 text-primary border-primary/40 ring-1 ring-primary/20"
                                                                    : "bg-card border-border text-slate-500 hover:border-slate-700 hover:text-slate-300"
                                                                    }`}
                                                            >
                                                                {t.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <label className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                                        <TrendingUp className="w-4 h-4 text-primary" />
                                                        Pitch Tone & Style
                                                    </label>
                                                    <div className="grid grid-cols-3 gap-3">
                                                        {[
                                                            { id: "Concise", label: "Concise", icon: Zap, desc: "Quick & Punchy" },
                                                            { id: "Professional", label: "Professional", icon: ShieldCheck, desc: "Safe & Balanced" },
                                                            { id: "Bold", label: "Bold", icon: Sparkles, desc: "High Energy" }
                                                        ].map((s) => (
                                                            <button
                                                                key={s.id}
                                                                onClick={() => setPitchStyle(s.id as any)}
                                                                className={`flex flex-col items-center gap-1 p-3 rounded-2xl border transition-all ${pitchStyle === s.id
                                                                    ? "bg-indigo-500/10 border-indigo-500/40 border-b-2 shadow-sm"
                                                                    : "bg-card border-border grayscale opacity-60 hover:grayscale-0 hover:opacity-100"}`}
                                                            >
                                                                <s.icon className={`w-4 h-4 ${pitchStyle === s.id ? "text-indigo-400" : "text-slate-500"}`} />
                                                                <span className={`text-[11px] font-bold uppercase tracking-tighter ${pitchStyle === s.id ? "text-indigo-300" : "text-slate-600"}`}>{s.label}</span>
                                                                <span className="text-[9px] text-slate-700 font-medium">{s.desc}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                                        <Sparkles className="w-4 h-4 text-primary" />
                                                        Target Client URL
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={targetUrl}
                                                        onChange={(e) => setTargetUrl(e.target.value)}
                                                        placeholder="https://company.com"
                                                        className="w-full bg-card border border-border rounded-2xl p-5 text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm placeholder:text-slate-600 font-mono"
                                                    />
                                                </div>

                                                <div className="pt-4">
                                                    <button
                                                        onClick={handleDeploy}
                                                        disabled={!context || !targetUrl}
                                                        className="w-full py-5 rounded-2xl bg-gradient-to-r from-primary to-violet-600 text-white font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.01] active:scale-[0.99] shadow-xl shadow-primary/20"
                                                    >
                                                        <Zap className="w-5 h-5 fill-white" />
                                                        Deploy AI Agents
                                                    </button>
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
                                            className="max-w-2xl mx-auto w-full flex flex-col items-center justify-center py-20"
                                        >
                                            <div className="w-32 h-32 mb-12 relative">
                                                <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" style={{ animationDuration: '0.8s' }} />
                                                <div className="absolute inset-3 rounded-full border-r-2 border-accent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }} />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                                                </div>
                                            </div>

                                            <h2 className="text-3xl font-extrabold mb-10 tracking-tight">Agents are strategizing...</h2>

                                            <div className="w-full space-y-4">
                                                {AGENT_STEPS.map((agentStep) => {
                                                    const isActive = activeAgentStep === agentStep.id;
                                                    const isCompleted = activeAgentStep > agentStep.id;

                                                    if (activeAgentStep < agentStep.id) return null;

                                                    return (
                                                        <motion.div
                                                            key={agentStep.id}
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            className={`flex items-center gap-5 p-5 rounded-2xl border transition-all ${isActive ? 'bg-primary/5 border-primary/40 shadow-[0_0_20px_rgba(139,92,246,0.15)] ring-1 ring-primary/20' : 'bg-card/30 border-border/30 opacity-60'}`}
                                                        >
                                                            <div className="shrink-0">
                                                                {isCompleted ? (
                                                                    <div className="w-7 h-7 rounded-full bg-green-500/10 flex items-center justify-center">
                                                                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                                                                    </div>
                                                                ) : (
                                                                    <div className="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                                                                )}
                                                            </div>
                                                            <span className={`text-[15px] font-mono ${isCompleted ? 'text-slate-500 line-through decoration-slate-600' : isActive ? 'text-primary font-bold animate-pulse' : 'text-slate-400'}`}>
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
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="w-full grid grid-cols-1 lg:grid-cols-3 gap-10 items-start"
                                        >
                                            <div className="lg:col-span-2 flex flex-col gap-6">
                                                <div className="flex items-center justify-between">
                                                    <h2 className="text-3xl font-extrabold flex items-center gap-3 tracking-tight">
                                                        <CheckCircle2 className="text-green-400 w-8 h-8" />
                                                        Campaign Result
                                                    </h2>
                                                    <div className="flex items-center gap-3 flex-wrap">
                                                        <button
                                                            onClick={handleDownloadPDF}
                                                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all text-sm font-bold shadow-sm"
                                                        >
                                                            <FileDown className="w-4 h-4" />
                                                            PDF
                                                        </button>
                                                        <button
                                                            onClick={handleComposeGmail}
                                                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all text-sm font-bold shadow-sm"
                                                        >
                                                            <Mail className="w-4 h-4" />
                                                            Gmail
                                                        </button>
                                                        <button
                                                            onClick={handleSendEmail}
                                                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all text-sm font-bold shadow-sm"
                                                        >
                                                            <Mail className="w-4 h-4" />
                                                            Mail App
                                                        </button>
                                                        <button
                                                            onClick={copyToClipboard}
                                                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-card border border-border hover:bg-slate-800 transition-all text-sm font-bold shadow-sm"
                                                        >
                                                            {isCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                                            {isCopied ? 'Copied' : 'Copy'}
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                const text = encodeURIComponent("Just generated a hyper-personalized cold email pitch with PitchAgent Pro 🚀 pitchagent-pro.vercel.app");
                                                                window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
                                                            }}
                                                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:bg-sky-500/20 transition-all text-sm font-bold"
                                                        >
                                                            <Share2 className="w-4 h-4" />
                                                            X
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                const url = encodeURIComponent("https://pitchagent-pro.vercel.app");
                                                                const summary = encodeURIComponent("I used PitchAgent Pro's AI agents to generate a hyper-personalized cold email pitch in under 3 minutes.");
                                                                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${summary}`, "_blank");
                                                            }}
                                                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-600/20 hover:bg-blue-600/20 transition-all text-sm font-bold"
                                                        >
                                                            <Share2 className="w-4 h-4" />
                                                            LinkedIn
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="bg-card border border-border shadow-2xl rounded-[32px] p-8 md:p-12 relative overflow-hidden group">
                                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-violet-600 opacity-50" />
                                                    <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap leading-relaxed text-lg font-medium selection:bg-primary/20">
                                                        {result.pitch}
                                                    </div>
                                                </div>

                                                <div className="flex justify-end mt-4">
                                                    <button
                                                        onClick={() => {
                                                            setStep("input");
                                                            setContext("");
                                                            setTargetUrl("");
                                                            setResult(null);
                                                        }}
                                                        className="text-slate-500 hover:text-white transition-colors text-[15px] font-bold flex items-center gap-2 px-4 py-2 hover:bg-slate-800 rounded-lg"
                                                    >
                                                        Start new campaign <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-6 sticky top-24">
                                                <h3 className="text-xl font-extrabold flex items-center gap-3 tracking-tight">
                                                    <Sparkles className="w-6 h-6 text-accent" />
                                                    Strategic Insights
                                                </h3>
                                                <div className="bg-gradient-to-b from-card/80 to-card/20 border border-border rounded-3xl p-8 shadow-xl backdrop-blur-sm">
                                                    <ul className="space-y-8">
                                                        {result.insights.map((insight, i) => (
                                                            <li key={i} className="flex gap-4 text-sm relative">
                                                                <div className="w-2 h-2 rounded-full bg-accent shrink-0 mt-1.5 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                                                                <span className="text-slate-300 leading-relaxed font-medium">{insight}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}

                        {/* ----- UPGRADE TAB ----- */}
                        {activeTab === "upgrade" && (
                            <motion.div
                                key="upgrade"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="w-full flex flex-col items-center"
                            >
                                <div className="text-center mb-16">
                                    <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Choose Your Plan</h1>
                                    <p className="text-slate-400 text-xl max-w-xl mx-auto">Scale your outreach with more power, deeper analysis, and enterprise features.</p>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                                    <div className={`bg-card border border-border rounded-3xl p-8 flex flex-col hover:border-slate-700 transition-all ${profile?.subscription_plan === "Starter" ? "" : "opacity-70 grayscale"}`}>
                                        <div className="mb-6">
                                            <h3 className="text-lg font-bold text-slate-400 mb-1">Starter</h3>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-4xl font-extrabold">$29</span>
                                                <span className="text-slate-500 text-sm">/mo</span>
                                            </div>
                                        </div>
                                        <ul className="space-y-4 mb-8 flex-1">
                                            <li className="flex items-center gap-3 text-sm text-slate-500">
                                                <CheckCircle2 className="w-4 h-4 text-slate-600" /> 10 pitches / week
                                            </li>
                                            <li className="flex items-center gap-3 text-sm text-slate-500">
                                                <CheckCircle2 className="w-4 h-4 text-slate-600" /> Basic research
                                            </li>
                                        </ul>
                                        {profile?.subscription_plan === "Starter" ? (
                                            <button disabled className="w-full py-4 rounded-2xl bg-slate-800 text-slate-500 font-bold cursor-not-allowed">Current Plan</button>
                                        ) : (
                                            <button
                                                onClick={() => handleCheckout({ priceId: "price_starter", planName: "Starter", mode: "subscription" })}
                                                className="w-full py-4 rounded-2xl bg-card border border-border hover:bg-slate-800 text-white font-bold transition-all"
                                            >
                                                Get Started
                                            </button>
                                        )}
                                    </div>

                                    <div className={`bg-slate-900/60 border-2 ${profile?.subscription_plan === "Pro Agent" ? "border-green-500" : "border-primary"} rounded-3xl p-8 flex flex-col relative shadow-[0_0_40px_-10px_rgba(139,92,246,0.3)] scale-105`}>
                                        {profile?.subscription_plan === "Pro Agent" ? (
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-green-500 text-white text-xs font-bold tracking-widest uppercase text-center">Active Now</div>
                                        ) : (
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-primary text-white text-xs font-bold tracking-widest uppercase">Popular</div>
                                        )}
                                        <div className="mb-6">
                                            <h3 className="text-lg font-bold text-primary mb-1">Pro Agent</h3>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-4xl font-extrabold">$99</span>
                                                <span className="text-slate-400 text-sm">/mo</span>
                                            </div>
                                        </div>
                                        <ul className="space-y-4 mb-8 flex-1">
                                            <li className="flex items-center gap-3 text-sm text-slate-200">
                                                <CheckCircle2 className="w-4 h-4 text-primary" /> Unlimited pitches
                                            </li>
                                            <li className="flex items-center gap-3 text-sm text-slate-200">
                                                <CheckCircle2 className="w-4 h-4 text-primary" /> Advanced web-scraping
                                            </li>
                                            <li className="flex items-center gap-3 text-sm text-slate-200">
                                                <CheckCircle2 className="w-4 h-4 text-primary" /> CRM Integration
                                            </li>
                                            <li className="flex items-center gap-3 text-sm text-slate-200">
                                                <CheckCircle2 className="w-4 h-4 text-primary" /> Priority email support
                                            </li>
                                        </ul>
                                        {profile?.subscription_plan === "Pro Agent" ? (
                                            <button disabled className="w-full py-4 rounded-2xl bg-green-500/10 text-green-500 border border-green-500/50 font-bold cursor-not-allowed">Current Plan</button>
                                        ) : (
                                            <button
                                                onClick={() => handleCheckout({ priceId: "price_pro", planName: "Pro Agent", mode: "subscription" })}
                                                className="w-full py-4 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold transition-all shadow-lg shadow-primary/20"
                                            >
                                                Upgrade Now
                                            </button>
                                        )}
                                    </div>

                                    {/* Enterprise Plan */}
                                    <div className={`bg-card border border-border rounded-3xl p-8 flex flex-col hover:border-slate-700 transition-all ${profile?.subscription_plan === "Scale" ? "" : "opacity-70"}`}>
                                        <div className="mb-6">
                                            <h3 className="text-lg font-bold text-white mb-1">Scale</h3>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-4xl font-extrabold">$249</span>
                                                <span className="text-slate-500 text-sm">/mo</span>
                                            </div>
                                        </div>
                                        <ul className="space-y-4 mb-8 flex-1">
                                            <li className="flex items-center gap-3 text-sm text-slate-300">
                                                <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Multi-seat workspace
                                            </li>
                                            <li className="flex items-center gap-3 text-sm text-slate-300">
                                                <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Custom agent parameters
                                            </li>
                                            <li className="flex items-center gap-3 text-sm text-slate-300">
                                                <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Account manager
                                            </li>
                                        </ul>
                                        {profile?.subscription_plan === "Scale" ? (
                                            <button disabled className="w-full py-4 rounded-2xl bg-slate-800 text-slate-500 font-bold cursor-not-allowed">Current Plan</button>
                                        ) : (
                                            <button
                                                onClick={() => handleCheckout({ priceId: "price_scale", planName: "Scale", mode: "subscription" })}
                                                className="w-full py-4 rounded-2xl bg-card border border-border hover:bg-slate-800 text-white font-bold transition-all"
                                            >
                                                Contact Sales
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-16 flex items-center gap-8 justify-center grayscale opacity-50">
                                    <ShieldCheck className="w-6 h-6" />
                                    <div className="h-6 w-px bg-slate-800" />
                                    <span className="text-xs font-medium tracking-widest uppercase text-slate-500">Secure Stripe Checkout</span>
                                </div>
                            </motion.div>
                        )}

                        {/* ----- SHOP TAB ----- */}
                        {activeTab === "shop" && (
                            <motion.div
                                key="shop"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="w-full"
                            >
                                <div className="mb-12">
                                    <h1 className="text-4xl font-extrabold mb-3 tracking-tight">Agent Resources</h1>
                                    <p className="text-slate-400 text-lg">Enhance your existing workflow with one-time power-ups.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[
                                        {
                                            title: "Credit Refill",
                                            description: "Instantly add 5,000 credits to your workspace for high-volume campaigns.",
                                            price: "$25",
                                            icon: Package,
                                            bgColor: "bg-indigo-500/10",
                                            textColor: "text-indigo-400",
                                            priceId: "price_credits_5000",
                                            credits: 5000,
                                            mode: "payment"
                                        },
                                        {
                                            title: "Super-Agent Scan",
                                            description: "Deep-crawl 50+ subpages of target websites for extreme personalization.",
                                            price: "$49 / month",
                                            icon: Search,
                                            bgColor: "bg-violet-500/10",
                                            textColor: "text-violet-400",
                                            priceId: "price_super_agent",
                                            mode: "subscription"
                                        },
                                        {
                                            title: "Fast-Track Queue",
                                            description: "Skip the processing line. Get your pitches generated in under 30 seconds.",
                                            price: "$10 / month",
                                            icon: Zap,
                                            bgColor: "bg-amber-500/10",
                                            textColor: "text-amber-400",
                                            priceId: "price_fast_track",
                                            mode: "subscription"
                                        },
                                        {
                                            title: "Template Pro Pack",
                                            description: "Unlock 20 premium sales structures for SaaS, Design, and Agency niches.",
                                            price: "$19",
                                            icon: Copy,
                                            bgColor: "bg-emerald-500/10",
                                            textColor: "text-emerald-400",
                                            priceId: "price_templates",
                                            mode: "payment"
                                        }
                                    ].map((item, i) => (
                                        <div key={i} className="bg-card/50 border border-border rounded-2xl p-6 hover:bg-card hover:translate-y-[-4px] transition-all group cursor-pointer relative overflow-hidden">
                                            <div className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                                <item.icon className={`w-6 h-6 ${item.textColor}`} />
                                            </div>
                                            <h3 className="text-lg font-bold mb-2 text-white">{item.title}</h3>
                                            <p className="text-sm text-slate-400 mb-6 leading-relaxed">{item.description}</p>
                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/40">
                                                <span className="text-white font-mono font-bold">{item.price}</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCheckout({
                                                            priceId: item.priceId,
                                                            planName: item.title,
                                                            mode: item.mode,
                                                            credits: (item as any).credits
                                                        });
                                                    }}
                                                    className="text-xs font-bold uppercase tracking-widest py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                                                >
                                                    Buy Now
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                        {/* ----- HISTORY TAB ----- */}
                        {activeTab === "history" && (
                            <motion.div
                                key="history"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="w-full"
                            >
                                <div className="mb-12 flex items-center justify-between">
                                    <div>
                                        <h1 className="text-4xl font-extrabold mb-3 tracking-tight">Campaign History</h1>
                                        <p className="text-slate-400 text-lg">Review and reuse your previous AI-generated pitches.</p>
                                    </div>
                                    <button
                                        onClick={fetchHistory}
                                        className="p-3 rounded-xl bg-card border border-border hover:bg-slate-800 transition-all text-slate-400 hover:text-white"
                                    >
                                        <TrendingUp className={`w-5 h-5 ${isLoadingHistory ? 'animate-spin' : ''}`} />
                                    </button>
                                </div>

                                {isLoadingHistory ? (
                                    <div className="flex flex-col items-center justify-center py-20 grayscale opacity-30">
                                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                                        <p className="font-bold tracking-widest uppercase text-xs">Accessing Archives...</p>
                                    </div>
                                ) : history.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-border/50 rounded-[40px] bg-card/10">
                                        <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center mb-6">
                                            <HistoryIcon className="w-10 h-10 text-slate-700" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">No history yet</h3>
                                        <p className="text-slate-500 mb-8">Deploy your first agent to see campaigns here.</p>
                                        <button
                                            onClick={() => setActiveTab("workspace")}
                                            className="px-8 py-3 rounded-2xl bg-primary text-white font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20"
                                        >
                                            Go to Workspace
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4">
                                        {history.map((item) => (
                                            <div
                                                key={item.id}
                                                className="bg-card/40 border border-border hover:border-primary/40 hover:bg-card/60 transition-all rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between group cursor-pointer"
                                                onClick={() => setSelectedHistoryItem(item)}
                                            >
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <Mail className="w-6 h-6 text-indigo-400" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-bold text-white truncate max-w-[200px] md:max-w-md">{item.target_url}</h4>
                                                            <ExternalLink className="w-3 h-3 text-slate-600" />
                                                        </div>
                                                        <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                                                            <span className="flex items-center gap-1.5 uppercase tracking-wider">
                                                                <Calendar className="w-3 h-3" />
                                                                {new Date(item.created_at).toLocaleDateString()}
                                                            </span>
                                                            <span className="w-1 h-1 rounded-full bg-slate-700" />
                                                            <span className="text-slate-400 truncate max-w-[150px]">{(item.context || "").substring(0, 30)}...</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 mt-4 md:mt-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-widest transition-all">View Details</button>
                                                    <ChevronRight className="w-5 h-5 text-slate-600" />
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
                                            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-slate-950/80 backdrop-blur-md"
                                            onClick={() => setSelectedHistoryItem(null)}
                                        >
                                            <motion.div
                                                initial={{ scale: 0.9, y: 20 }}
                                                animate={{ scale: 1, y: 0 }}
                                                exit={{ scale: 0.9, y: 20 }}
                                                className="bg-card border border-border rounded-[40px] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div className="p-8 md:p-12">
                                                    <div className="flex items-center justify-between mb-8">
                                                        <div>
                                                            <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Pitch Archive</h3>
                                                            <h2 className="text-3xl font-extrabold text-white tracking-tight">{selectedHistoryItem.target_url}</h2>
                                                        </div>
                                                        <button
                                                            onClick={() => setSelectedHistoryItem(null)}
                                                            className="w-10 h-10 rounded-full bg-slate-900 border border-border flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all"
                                                        >
                                                            &times;
                                                        </button>
                                                    </div>

                                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                                        <div className="lg:col-span-2 space-y-6">
                                                            <div className="bg-slate-900/50 border border-border p-8 rounded-3xl relative overflow-hidden group">
                                                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-violet-600 opacity-50" />
                                                                <div className="whitespace-pre-wrap text-slate-300 leading-relaxed font-medium">
                                                                    {selectedHistoryItem.pitch_text}
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(selectedHistoryItem.pitch_text);
                                                                    alert("Copied to clipboard!");
                                                                }}
                                                                className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold transition-all flex items-center justify-center gap-2"
                                                            >
                                                                <Copy className="w-4 h-4" /> Copy Pitch Text
                                                            </button>
                                                        </div>
                                                        <div className="space-y-6">
                                                            <div className="space-y-4">
                                                                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Insights</h4>
                                                                <div className="space-y-4">
                                                                    {Array.isArray(selectedHistoryItem.insights) ? selectedHistoryItem.insights.map((insight, idx) => (
                                                                        <div key={idx} className="flex gap-3 text-xs bg-slate-900/40 p-4 rounded-2xl border border-border/50">
                                                                            <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1 shrink-0" />
                                                                            <p className="text-slate-400 leading-relaxed">{insight}</p>
                                                                        </div>
                                                                    )) : (
                                                                        <p className="text-slate-500 text-xs italic">No strategic insights available for this pitch.</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="space-y-4">
                                                                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Original Context</h4>
                                                                <div className="bg-slate-900/20 border border-border/30 p-5 rounded-2xl text-[11px] text-slate-500 italic leading-relaxed">
                                                                    {selectedHistoryItem.context}
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
                        )}

                        {/* ----- PROFILE TAB ----- */}
                        {activeTab === "profile" && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="max-w-2xl mx-auto w-full"
                            >
                                <div className="mb-10">
                                    <h1 className="text-4xl font-extrabold mb-3 tracking-tight">Personal Branding</h1>
                                    <p className="text-slate-400 text-lg">Your profile context is used to personalize every pitch generated by the AI agents.</p>
                                </div>

                                <div className="bg-card/50 border border-border rounded-[32px] p-8 md:p-10 shadow-2xl relative overflow-hidden space-y-8">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-violet-600 opacity-30" />

                                    <div className="max-w-4xl mx-auto w-full space-y-10 py-8">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
                                                <Settings className="w-8 h-8 text-primary" />
                                                Professional Identities
                                            </h2>
                                            <button
                                                onClick={addProfile}
                                                className="px-6 py-3 rounded-xl bg-white text-slate-950 font-bold text-sm hover:bg-slate-200 transition-all flex items-center gap-2 shadow-lg"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add New Profile
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {profile?.contexts.map((ctx, idx) => (
                                                <div key={idx} className="bg-card/50 border border-border rounded-3xl p-6 space-y-4 hover:border-primary/30 transition-all group relative">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3 w-full mr-10">
                                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                                {idx + 1}
                                                            </div>
                                                            <input
                                                                value={ctx.name}
                                                                onChange={(e) => {
                                                                    const newContexts = [...profile.contexts];
                                                                    newContexts[idx].name = e.target.value;
                                                                    setProfile({ ...profile, contexts: newContexts });
                                                                }}
                                                                className="bg-transparent border-none text-lg font-bold text-white focus:outline-none focus:ring-1 focus:ring-primary/30 rounded px-2 w-full"
                                                                placeholder="Profile Name (e.g. Sales Agent)"
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => deleteProfile(idx)}
                                                            className="p-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all absolute top-6 right-6"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <textarea
                                                        value={ctx.content}
                                                        onChange={(e) => {
                                                            const newContexts = [...profile.contexts];
                                                            newContexts[idx].content = e.target.value;
                                                            setProfile({ ...profile, contexts: newContexts });
                                                        }}
                                                        placeholder="Define your bio, USP, and case studies..."
                                                        className="w-full h-48 bg-slate-950/50 border border-border rounded-2xl p-5 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-inner placeholder:text-slate-800 leading-relaxed"
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            setCurrentProfileIndex(idx);
                                                            setContext(ctx.content);
                                                            setActiveTab("workspace");
                                                        }}
                                                        className="w-full py-2 rounded-xl bg-slate-800/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:bg-primary/20 hover:text-primary transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        Use in Workspace
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-6 border-t border-border/50">
                                            <button
                                                onClick={() => handleSaveProfile(profile?.contexts || [])}
                                                disabled={isSavingProfile}
                                                className="w-full py-5 rounded-2xl bg-gradient-to-r from-primary to-violet-600 text-white font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 transition-all hover:scale-[1.01] shadow-xl shadow-primary/20"
                                            >
                                                {isSavingProfile ? <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" /> : <CheckIcon className="w-5 h-5" />}
                                                {isSavingProfile ? "Syncing to Cloud..." : "Save All Profiles"}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 p-6 rounded-2xl border border-primary/20 bg-primary/5 flex items-start gap-4">
                                    <Sparkles className="w-6 h-6 text-primary shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-white mb-1">Pro Tip: Deep Context leads to higher conversion.</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed">Mention specific industries you've worked in, technologies you use, and measurable results. Our agents use this as their core knowledge base.</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

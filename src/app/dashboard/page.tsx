"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { logout } from "@/app/login/actions";

// Types & Config
import {
    DashboardTab,
    TemplateId,
    Profile,
    PitchHistoryItem,
    ProfileContext,
    AGENT_STEPS,
    TEMPLATES
} from "./types";

// Components
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ConfirmModal } from "@/components/dashboard/ConfirmModal";
import { WorkspaceTab } from "@/components/dashboard/WorkspaceTab";
import { UpgradeTab } from "@/components/dashboard/UpgradeTab";
import { ShopTab } from "@/components/dashboard/ShopTab";
import { HistoryTab } from "@/components/dashboard/HistoryTab";
import { ProfileTab } from "@/components/dashboard/ProfileTab";
import { SettingsTab } from "@/components/dashboard/SettingsTab";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { OnboardingModal } from "@/components/dashboard/OnboardingModal";

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState<DashboardTab>("workspace");
    const [step, setStep] = useState<"input" | "processing" | "result">("input");
    const [context, setContext] = useState("");
    const [targetUrl, setTargetUrl] = useState("");
    const [pitchTemplate, setPitchTemplate] = useState<TemplateId>("cold_email");
    const [pitchStyle, setPitchStyle] = useState<"Concise" | "Professional" | "Bold">("Professional");
    const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
    const [isInitialProfileLoad, setIsInitialProfileLoad] = useState(true);

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
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [onboardingCompleted, setOnboardingCompleted] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        type?: "danger" | "success" | "info";
        title: string;
        message: string;
        onConfirm: () => void;
        showCancel?: boolean;
    } | null>(null);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const { createClient } = await import("@/utils/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            // Set initial minimal profile to avoid null state issues
            const minimalProfile: Profile = {
                credits: 0,
                is_pro: false,
                subscription_plan: "Free",
                email: user.email || "",
                full_name: "",
                has_onboarded: false,
                contexts: [{ name: "Default", content: "" }]
            };

            const { data, error } = await supabase
                .from("profiles")
                .select("*")
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
                    full_name: data.full_name || "",
                    has_onboarded: data.has_onboarded === true, // Explicitly check for true
                    contexts: parsedContexts
                });
            } else {
                // Try to create profile if it doesn't exist
                const defaultContexts = [{ name: "Default", content: "" }];
                const { error: insertError } = await supabase
                    .from("profiles")
                    .upsert({ // Use upsert instead of insert to handle existing rows
                        id: user.id,
                        email: user.email,
                        credits: 100,
                        context: JSON.stringify(defaultContexts)
                    }, { onConflict: 'id' });

                setProfile({
                    ...minimalProfile,
                    credits: 100,
                    has_onboarded: false
                });
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
            const res = await fetch("/api/generate-pitch", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ context, targetUrl, templateHint, pitchStyle })
            });
            const data = await res.json();
            if (data.success) {
                setResult(data.data);
                setStep("result");
                await fetchProfile();
            } else {
                setConfirmModal({
                    isOpen: true,
                    type: "danger",
                    title: "Generation Failed",
                    message: data.error || "Failed to generate the pitch.",
                    onConfirm: () => setConfirmModal(null),
                    showCancel: false
                });
                setStep("input");
            }
        } catch (error) {
            setConfirmModal({
                isOpen: true,
                type: "danger",
                title: "Network Error",
                message: "An unexpected error occurred. Please try again.",
                onConfirm: () => setConfirmModal(null),
                showCancel: false
            });
            setStep("input");
        }
    };

    const handleDeleteProfile = async (index: number) => {
        if (!profile || profile.contexts.length <= 1) {
            setConfirmModal({
                isOpen: true,
                type: "info",
                title: "Deletion Resticted",
                message: "At least one profile must be maintained for service continuity. 😊",
                onConfirm: () => setConfirmModal(null),
                showCancel: false
            });
            return;
        }

        setConfirmModal({
            isOpen: true,
            type: "danger",
            title: "Delete Profile",
            message: "Are you sure you want to delete this profile? This action cannot be undone.",
            onConfirm: async () => {
                const updatedContexts = profile.contexts
                    .filter((_, i) => i !== index)
                    .map((ctx, i) => {
                        if (/^New Profile \d+$/.test(ctx.name)) {
                            return { ...ctx, name: `New Profile ${i + 1}` };
                        }
                        return ctx;
                    });

                const { createClient } = await import("@/utils/supabase/client");
                const supabase = createClient();
                const { error } = await supabase
                    .from("profiles")
                    .update({ context: updatedContexts })
                    .eq("email", profile.email);

                if (!error) {
                    setProfile({ ...profile, contexts: updatedContexts });
                    setConfirmModal({
                        isOpen: true,
                        type: "success",
                        title: "Deletion Successful",
                        message: "The profile has been successfully deleted.",
                        onConfirm: () => setConfirmModal(null),
                        showCancel: false
                    });
                }
            }
        });
    };

    const handleSaveProfile = async (contexts: ProfileContext[]) => {
        if (!profile) return;
        setIsSavingProfile(true);
        try {
            const { createClient } = await import("@/utils/supabase/client");
            const supabase = createClient();
            const { error } = await supabase
                .from("profiles")
                .update({ context: contexts })
                .eq("email", profile.email);

            if (error) throw error;

            setConfirmModal({
                isOpen: true,
                type: "success",
                title: "Save Successful",
                message: "All profile information has been securely synced to the cloud. ✨",
                onConfirm: () => setConfirmModal(null),
                showCancel: false
            });
        } catch (error) {
            setConfirmModal({
                isOpen: true,
                type: "danger",
                title: "Save Failed",
                message: "An error occurred while saving. Please check your internet connection.",
                onConfirm: () => setConfirmModal(null),
                showCancel: false
            });
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleOnboardingComplete = async (data: { fullName: string; specialty: string; strength: string }) => {
        if (!profile) return;

        const firstContext: ProfileContext = {
            name: data.specialty || "My Primary Identity",
            content: `I am a ${data.specialty}. ${data.strength}`
        };

        const updatedContexts = [firstContext];

        try {
            const { createClient } = await import("@/utils/supabase/client");
            const supabase = createClient();

            // Try updating full_name and has_onboarded. 
            // If the columns don't exist yet, this might error, but we'll try to handle it.
            const { error } = await supabase
                .from("profiles")
                .update({
                    full_name: data.fullName,
                    has_onboarded: true,
                    context: updatedContexts
                })
                .eq("email", profile.email);

            if (error) {
                console.warn("Onboarding update failed, possibly due to missing columns:", error);
                // Fallback: just update the context if columns are missing
                await supabase
                    .from("profiles")
                    .update({ context: updatedContexts })
                    .eq("email", profile.email);
            }

            setProfile({
                ...profile,
                full_name: data.fullName,
                has_onboarded: true,
                contexts: updatedContexts
            });
            setOnboardingCompleted(true);
            setContext(firstContext.content);

        } catch (error) {
            console.error("Onboarding error:", error);
        }
    };

    const addProfile = () => {
        if (!profile) return;
        const newProfile: ProfileContext = {
            name: `New Profile ${profile.contexts.length + 1}`,
            content: ""
        };
        setProfile({
            ...profile,
            contexts: [...profile.contexts, newProfile]
        });
    };

    const handleCheckout = async (options: { priceId?: string, planName: string, mode?: string, credits?: number }) => {
        if (!options.priceId) return;
        const { createClient } = await import("@/utils/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            setConfirmModal({
                isOpen: true,
                type: "info",
                title: "Login Required",
                message: "You must be signed in to proceed with checkout.",
                onConfirm: () => setConfirmModal(null),
                showCancel: false
            });
            return;
        }

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    priceId: options.priceId,
                    planName: options.planName,
                    email: user.email,
                    userId: user.id,
                    mode: options.mode || "subscription",
                    credits: options.credits
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to prepare checkout");
            }

            if ((window as any).Paddle) {
                (window as any).Paddle.Checkout.open({
                    settings: {
                        displayMode: "overlay",
                        theme: "dark",
                        locale: "en",
                        successUrl: window.location.origin + window.location.pathname,
                    },
                    items: data.items || [{ priceId: options.priceId, quantity: 1 }],
                    customer: { email: user.email },
                    customData: data.customData || {
                        userId: user.id,
                        planName: options.planName,
                        credits: options.credits?.toString()
                    }
                });
            } else {
                setConfirmModal({
                    isOpen: true,
                    type: "danger",
                    title: "Paddle Not Loaded",
                    message: "The payment system is still initializing. Please wait a moment and try again.",
                    onConfirm: () => setConfirmModal(null),
                    showCancel: false
                });
            }
        } catch (error: any) {
            console.error("Checkout error:", error);
            setConfirmModal({
                isOpen: true,
                type: "danger",
                title: "Checkout Error",
                message: error.message || "An error occurred while preparing your checkout.",
                onConfirm: () => setConfirmModal(null),
                showCancel: false
            });
        }
    };

    const copyToClipboard = () => {
        if (!result) return;
        navigator.clipboard.writeText(result.pitch);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleComposeGmail = () => {
        if (!result) return;
        const subject = encodeURIComponent("Strategic Pitch Proposal");
        const body = encodeURIComponent(result.pitch);
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`, "_blank");
    };

    const handleDownloadPDF = async (itemResult?: { pitch: string; insights: string[] }) => {
        const activeResult = itemResult || result;
        if (!activeResult) return;

        try {
            const { jsPDF } = await import("jspdf");
            const doc = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            const cleanForPDF = (text: string) => {
                return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/gu, '');
            };

            const pageW = doc.internal.pageSize.getWidth();
            const pageH = doc.internal.pageSize.getHeight();
            const margin = 20;
            const maxW = pageW - margin * 2;
            let y = 20;

            const addFooter = (pageNum: number) => {
                doc.setFontSize(8);
                doc.setTextColor(150, 150, 150);
                doc.setFont("helvetica", "normal");
                doc.text(`Page ${pageNum}`, pageW - margin, pageH - 10, { align: "right" });
                doc.text("Generated by PitchAgent Pro", margin, pageH - 10);
            };

            // Header - Sophisticated & Minimal
            doc.setDrawColor(220, 220, 230);
            doc.line(margin, 15, pageW - margin, 15);

            doc.setFontSize(8);
            doc.setTextColor(120, 130, 150);
            doc.setFont("helvetica", "bold");
            doc.text("STRATEGIC BLUEPRINT", margin, 12);

            doc.setFontSize(8);
            doc.setTextColor(180, 180, 190);
            doc.setFont("helvetica", "normal");
            doc.text(`GEN_ID: ${Date.now().toString(36).toUpperCase()}`, pageW / 2, 12, { align: "center" });

            doc.setTextColor(120, 130, 150);
            doc.text(new Date().toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase(), pageW - margin, 12, { align: "right" });

            y = 28;
            addFooter(1);

            // Title
            doc.setFontSize(16);
            doc.setTextColor(30, 30, 50);
            doc.text("Optimized Outreach Strategy", margin, y);
            y += 10;

            // Pitch Body
            doc.setFontSize(10);
            doc.setTextColor(50, 50, 70);
            doc.setFont("helvetica", "normal");
            const cleanedPitch = cleanForPDF(activeResult.pitch);
            const pitchLines = doc.splitTextToSize(cleanedPitch, maxW);

            let currentPage = 1;
            pitchLines.forEach((line: string) => {
                if (y > 270) {
                    doc.addPage();
                    currentPage++;
                    y = 20;
                    addFooter(currentPage);
                }
                doc.text(line, margin, y);
                y += 5.5;
            });

            y += 10;

            // Insights
            if (activeResult.insights && activeResult.insights.length > 0) {
                if (y > 240) {
                    doc.addPage();
                    currentPage++;
                    y = 20;
                    addFooter(currentPage);
                }
                doc.setFont("helvetica", "bold");
                doc.text("Strategic Tactical Insights", margin, y);
                y += 7;
                doc.setDrawColor(99, 102, 241);
                doc.line(margin, y, pageW - margin, y);
                y += 8;

                doc.setFont("helvetica", "normal");
                activeResult.insights.forEach((insight, i) => {
                    const cleanedInsight = cleanForPDF(insight);
                    const lines = doc.splitTextToSize(`${i + 1}. ${cleanedInsight}`, maxW - 4);
                    lines.forEach((line: string) => {
                        if (y > 275) {
                            doc.addPage();
                            currentPage++;
                            y = 20;
                            addFooter(currentPage);
                        }
                        doc.text(line, margin + 2, y);
                        y += 5.5;
                    });
                    y += 2;
                });
            }

            // Standard Blob-based download for Chrome compatibility
            const pdfBlob = doc.output('blob');
            const url = URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `PitchAgent_Result_${Date.now()}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(url), 100);

        } catch (error) {
            console.error("PDF Generation Error:", error);
        }
    };

    const handleSignOut = async () => {
        await logout();
        window.location.href = "/login";
    };

    return (
        <main className="min-h-screen bg-slate-950 text-slate-200 selection:bg-primary/30 flex flex-col lg:flex-row p-0 lg:p-6 lg:gap-8 overflow-x-hidden relative">
            {/* Mobile Header */}
            <DashboardHeader
                profile={profile}
                isMobileMenuOpen={isMobileMenuOpen}
                toggleMobileMenu={toggleMobileMenu}
                setActiveTab={setActiveTab}
                handleSignOut={handleSignOut}
            />

            <Sidebar
                activeTab={activeTab}
                setActiveTab={(tab) => {
                    setActiveTab(tab);
                    setIsMobileMenuOpen(false); // Close mobile menu when tab changes
                }}
                profile={profile}
                handleSignOut={handleSignOut}
                isMobileMenuOpen={isMobileMenuOpen}
                toggleMobileMenu={toggleMobileMenu}
            />

            <div className="flex-1 w-full max-h-screen lg:max-h-[calc(100vh-3rem)] overflow-y-auto custom-scrollbar px-4 lg:px-0 lg:pr-4 pt-20 lg:pt-0">
                <AnimatePresence mode="wait">
                    {activeTab === "workspace" && (
                        <WorkspaceTab
                            key="workspace"
                            step={step}
                            setStep={setStep}
                            context={context}
                            setContext={setContext}
                            targetUrl={targetUrl}
                            setTargetUrl={setTargetUrl}
                            pitchTemplate={pitchTemplate}
                            setPitchTemplate={setPitchTemplate}
                            pitchStyle={pitchStyle}
                            setPitchStyle={setPitchStyle}
                            handleDeploy={handleDeploy}
                            activeAgentStep={activeAgentStep}
                            result={result}
                            setResult={setResult}
                            isCopied={isCopied}
                            copyToClipboard={copyToClipboard}
                            handleDownloadPDF={() => handleDownloadPDF()}
                            handleComposeGmail={handleComposeGmail}
                            loadExample={loadExample}
                        />
                    )}

                    {activeTab === "upgrade" && (
                        <UpgradeTab
                            key="upgrade"
                            profile={profile}
                            handleCheckout={handleCheckout}
                        />
                    )}

                    {activeTab === "shop" && (
                        <ShopTab
                            key="shop"
                            handleCheckout={handleCheckout}
                        />
                    )}

                    {activeTab === "history" && (
                        <HistoryTab
                            key="history"
                            history={history}
                            isLoadingHistory={isLoadingHistory}
                            fetchHistory={fetchHistory}
                            selectedHistoryItem={selectedHistoryItem}
                            setSelectedHistoryItem={setSelectedHistoryItem}
                            handleDownloadPDF={(res) => handleDownloadPDF(res)}
                            setConfirmModal={(modal) => setConfirmModal(modal as any)}
                            setActiveTab={setActiveTab}
                        />
                    )}

                    {activeTab === "profile" && (
                        <ProfileTab
                            key="profile"
                            profile={profile}
                            setProfile={setProfile}
                            addProfile={addProfile}
                            handleDeleteProfile={handleDeleteProfile}
                            handleSaveProfile={handleSaveProfile}
                            isSavingProfile={isSavingProfile}
                            setCurrentProfileIndex={setCurrentProfileIndex}
                            setContext={setContext}
                            setActiveTab={setActiveTab}
                        />
                    )}

                    {activeTab === "settings" && (
                        <SettingsTab
                            key="settings"
                            profile={profile}
                            setActiveTab={setActiveTab}
                        />
                    )}
                </AnimatePresence>
            </div>

            <OnboardingModal
                isOpen={profile !== null && profile.has_onboarded !== true && !onboardingCompleted}
                onComplete={handleOnboardingComplete}
            />

            <ConfirmModal
                isOpen={!!confirmModal}
                type={confirmModal?.type}
                title={confirmModal?.title || ""}
                message={confirmModal?.message || ""}
                onConfirm={confirmModal?.onConfirm || (() => { })}
                onClose={() => setConfirmModal(null)}
                showCancel={confirmModal?.showCancel}
            />
        </main>
    );
}

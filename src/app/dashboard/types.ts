export type AgentStep = {
    id: number;
    text: string;
};

export const AGENT_STEPS: AgentStep[] = [
    { id: 1, text: "ROUTER: Initializing 4-agent swarm for target analysis..." },
    { id: 2, text: "SCRAPER: Bypassing bot detection and extracting business KPIs..." },
    { id: 3, text: "ANALYST: Processing source context against target pain points..." },
    { id: 4, text: "STRATEGIST: Formulating persuasive value proposition hooks..." },
    { id: 5, text: "COPYWRITER: Drafting professional cold email & proposal draft..." },
    { id: 6, text: "FINALIZER: Polishing and sanity-checking result..." },
];

export const TEMPLATES = [
    { id: "cold_email", label: "🎯 Cold Email", hint: "Write a concise, direct cold email focused on pain points and ROI." },
    { id: "partnership", label: "🤝 Partnership", hint: "Write a warm partnership proposal highlighting mutual benefits and synergies." },
    { id: "job_inquiry", label: "💼 Job Inquiry", hint: "Write a compelling job inquiry email showcasing unique skills and cultural fit." },
    { id: "pr_pitch", label: "📣 PR / Media", hint: "Write a media pitch email with a newsworthy angle and clear story hook." },
] as const;

export type TemplateId = typeof TEMPLATES[number]["id"];

export type DashboardTab = "workspace" | "upgrade" | "shop" | "history" | "profile";

export type PitchHistoryItem = {
    id: string;
    target_url: string;
    pitch_text: string;
    insights: string[];
    context: string;
    created_at: string;
};

export type ProfileContext = {
    name: string;
    content: string;
};

export type Profile = {
    credits: number;
    is_pro: boolean;
    subscription_plan: string;
    email: string;
    contexts: ProfileContext[];
};

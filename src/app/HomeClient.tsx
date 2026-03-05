"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Zap,
  ChevronRight,
  Search,
  Cpu,
  Mail,
  Users,
  Layout,
  Award,
  Quote,
  PenTool,
  Brain,
  Target,
  Shield,
  Star
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[5%] w-[55%] h-[50%] rounded-full bg-indigo-600/8 blur-[160px]" />
        <div className="absolute bottom-[-5%] right-[0%] w-[45%] h-[45%] rounded-full bg-violet-600/8 blur-[140px]" />
        <div className="absolute top-[40%] left-[-10%] w-[35%] h-[35%] rounded-full bg-indigo-500/5 blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight">PitchAgent Pro</span>
        </div>
        <div className="flex items-center gap-1">
          <Link
            href="#how-it-works"
            className="hidden md:block text-sm text-slate-500 hover:text-slate-200 px-4 py-2 rounded-lg transition-colors"
          >
            How it works
          </Link>
          <Link
            href="#pricing"
            className="hidden md:block text-sm text-slate-500 hover:text-slate-200 px-4 py-2 rounded-lg transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/dashboard"
            className="text-sm px-4 py-2 rounded-lg border border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200 transition-all ml-2"
          >
            Sign in
          </Link>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center px-4 pb-32 max-w-6xl mx-auto">
        {/* ─── Hero Section ─── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col items-center text-center max-w-3xl pt-28"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/25 badge-shimmer text-indigo-300 mb-8 text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Multi-agent AI · Built for closers
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-[68px] font-extrabold tracking-tight leading-[1.08] mb-6">
            Close $10k clients with{" "}
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 text-glow">
              AI-crafted pitches.
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="text-[17px] text-slate-400 mb-10 max-w-xl leading-relaxed">
            Paste a target URL. 4 specialized AI agents analyze their business,<br className="hidden md:block" />
            find the perfect angle, and write a hyper-personalized pitch in under 3 minutes.
          </p>

          {/* CTA group */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-[15px] transition-all hover:opacity-90 btn-glow"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <Link
              href="#demo"
              className="text-[14px] text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 py-3.5"
            >
              See a live example <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-700">No credit card required. Cancel anytime.</p>
        </motion.div>

        {/* ─── Divider bar ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-20 flex flex-wrap items-center justify-center gap-x-12 gap-y-5 py-7 w-full max-w-2xl border-y border-slate-800/40 bg-slate-900/10 backdrop-blur-sm"
        >
          {[
            { value: "3 min", label: "avg. generation" },
            { value: "4 agents", label: "working in parallel" },
            { value: "1,200+", label: "emails generated" },
          ].map(({ value, label }, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <span className="text-xl font-bold text-white tracking-tight">{value}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* ─── Social Proof: Logos ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 w-full flex flex-col items-center gap-8"
        >
          <p className="text-[11px] font-bold text-slate-700 uppercase tracking-[0.2em]">Trusted by hyper-growth teams</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            <div className="flex items-center gap-2 font-bold text-lg text-slate-400">
              <div className="w-5 h-5 rounded bg-slate-700" /> VERCEL
            </div>
            <div className="flex items-center gap-2 font-bold text-lg text-slate-400">
              <div className="w-5 h-5 rounded-full bg-slate-700" /> NOTION
            </div>
            <div className="flex items-center gap-2 font-bold text-lg text-slate-400">
              <div className="w-5 h-5 rotate-45 bg-slate-700" /> PADDLE
            </div>
            <div className="flex items-center gap-2 font-bold text-lg text-slate-400">
              <div className="w-5 h-5 rounded-sm bg-slate-700" /> LINEAR
            </div>
            <div className="flex items-center gap-2 font-bold text-lg text-slate-400">
              <div className="w-5 h-5 rounded-full border-2 border-slate-700" /> FRAMER
            </div>
          </div>
        </motion.div>

        {/* ─── Social Proof: Testimonials ─── */}
        <div className="mt-32 grid md:grid-cols-3 gap-6 w-full max-w-6xl">
          {[
            {
              text: "The first tool that actually writes like a human who did their homework. 40% response rate increase.",
              author: "Alex Rivera",
              role: "Head of Growth, SaaS flow",
              stars: 5
            },
            {
              text: "I used to spend 2 hours researching one client. Now I do it in 3 minutes while drinking coffee. Game changer.",
              author: "Sarah Chen",
              role: "Independent Agency Owner",
              stars: 5
            },
            {
              text: "PitchAgent Pro doesn't just fill templates. It actually strategies. I closed a $12k retainer in week one.",
              author: "Jameson P.",
              role: "B2B Sales Consultant",
              stars: 5
            }
          ].map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card/40 border border-border p-8 rounded-[32px] flex flex-col justify-between hover:bg-card/60 transition-colors"
            >
              <div className="space-y-4">
                <div className="flex gap-0.5">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-slate-300 font-medium italic leading-relaxed text-[15px]">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>
              <div className="mt-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-xs">
                  {t.author[0]}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">{t.author}</h4>
                  <p className="text-slate-600 text-[11px] font-medium">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ─── How It Works ─── */}
        <motion.div
          id="how-it-works"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mt-48 w-full max-w-6xl"
        >
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.3em] text-indigo-400 uppercase mb-4">
              Agent Workflow
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              The 4-Agent Collective
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
              When you paste a URL, we don&apos;t just call a chatbot. We deploy an entire sales department in parallel.
            </p>
          </div>

          <div className="relative">
            {/* Connection line for desktop */}
            <div className="hidden lg:block absolute top-[120px] left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent z-0" />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {[
                {
                  Icon: Search,
                  name: "Scraper Agent",
                  role: "The Researcher",
                  desc: "Analyzes the target's source code, metadata, and site architecture to extract actual business pain points.",
                  color: "indigo"
                },
                {
                  Icon: Brain,
                  name: "Analyst Agent",
                  role: "The Psychologist",
                  desc: "Maps your portfolio against the target's needs to find the highest-impact 'Value Hook'.",
                  color: "violet"
                },
                {
                  Icon: Target,
                  name: "Strategist Agent",
                  role: "The Architect",
                  desc: "Formulates a persuasive pattern-interrupt strategy based on modern enterprise sales psychology.",
                  color: "purple"
                },
                {
                  Icon: PenTool,
                  name: "Copywriter Agent",
                  role: "The Wordsmith",
                  desc: "Crafts the final pitch. No fluff, no ChatGPT-isms. Just high-conversion, punchy professional prose.",
                  color: "emerald"
                }
              ].map(({ Icon, name, role, desc, color }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-slate-900/40 border border-slate-800/80 p-8 rounded-[40px] relative group hover:border-indigo-500/30 transition-all duration-500"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 text-${color}-400`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{name}</h3>
                    <p className={`text-[10px] uppercase tracking-widest font-bold text-${color}-500/80 mb-4`}>{role}</p>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      {desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ─── Demo Section ─── */}
        <motion.div
          id="demo"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mt-32 w-full max-w-5xl"
        >
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest text-indigo-400 uppercase mb-3">
              Live example
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              See what it actually generates
            </h2>
            <p className="text-slate-500 mt-3 text-[15px]">
              A UI/UX designer pitching to Notion. Real output, no editing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 items-stretch">
            {/* Input Side */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-7 backdrop-blur-sm flex flex-col gap-5">
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-mono font-bold text-slate-600 tracking-widest px-2 py-1 rounded-md border border-slate-800 bg-slate-950">
                  INPUT
                </span>
              </div>

              <div className="space-y-4 flex-grow">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2 block">
                    Target Client URL
                  </label>
                  <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 text-sm text-slate-400 font-mono flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/70 shrink-0" />
                    https://www.notion.so/about
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2 block">
                    Your Portfolio Context
                  </label>
                  <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 text-sm text-slate-300 leading-relaxed">
                    I am a UI/UX designer with 10 years of experience in B2B SaaS. I specialize in simplifying complex dashboards to improve user retention. Most recently, I successfully increased user retention by 30% for a major client.
                  </div>
                </div>
              </div>
            </div>

            {/* Output Side */}
            <div className="relative rounded-2xl border border-indigo-500/20 overflow-hidden flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 via-transparent to-violet-600/8 pointer-events-none" />
              <div className="p-6 md:p-7 relative z-10 flex flex-col gap-5 h-full">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-mono font-bold text-indigo-400/80 tracking-widest px-2 py-1 rounded-md border border-indigo-500/20 bg-indigo-500/10">
                    OUTPUT
                  </span>
                </div>

                {/* Generated email */}
                <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 text-sm leading-relaxed text-slate-200 flex-grow">
                  <p className="mb-3 pb-3 border-b border-slate-800 text-xs font-mono text-slate-400">
                    <span className="text-indigo-400">Subject:</span>{" "}
                    A thought on optimizing Notion&apos;s UI/UX complexity
                  </p>
                  <div className="space-y-2.5 text-[13px] text-slate-300 leading-relaxed">
                    <p>Hi [Name],</p>
                    <p>
                      It has been incredibly impressive watching Notion seamlessly integrate vast AI capabilities into a single workspace. However, as the platform becomes more powerful, I noticed that{" "}
                      <span className="bg-indigo-500/15 text-indigo-200 px-1 rounded">
                        the onboarding experience for new users
                      </span>{" "}
                      might become the next key bottleneck due to the increased feature density.
                    </p>
                    <p>
                      Over the past 10 years, I&apos;ve specialized in{" "}
                      <span className="bg-violet-500/15 text-violet-200 px-1 rounded">
                        simplifying B2B SaaS dashboards, recently improving user retention by 30%
                      </span>{" "}
                      for a similar client by flattening their learning curve.
                    </p>
                    <p>
                      I&apos;ve mapped out a few specific areas where Notion could quickly reduce visual friction. Would you be open to a{" "}
                      <span className="border-b border-indigo-400/40 text-white">
                        brief 2-minute video
                      </span>{" "}
                      explaining how?
                    </p>
                  </div>
                </div>

                {/* Insights */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
                  <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-indigo-400" />
                    Why this pitch works
                  </h4>
                  <ul className="space-y-2">
                    {[
                      [
                        "Hyper-personalized hook",
                        "mentions Notion's actual AI expansion strategy",
                      ],
                      ["Quantified social proof", "10 years + 30% retention improvement"],
                      ["Low-friction CTA", "asks for 2 min video, not a call"],
                    ].map(([title, desc], i) => (
                      <li key={i} className="flex items-start gap-2 text-[12px]">
                        <span className="text-indigo-400 shrink-0 mt-0.5">→</span>
                        <span className="text-slate-400 leading-snug">
                          <strong className="text-slate-300">{title}</strong> — {desc}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Benefits Section ─── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-40 w-full max-w-5xl"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Why PitchAgent Pro is different
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Generic AI templates get ignored. PitchAgent researches the client, forms a strategy, then crafts the pitch.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {[
                {
                  title: "Deep Research",
                  desc: "Not just name-swapping. We analyze the target's latest news, business model, and competitive landscape to inform every sentence.",
                  color: "indigo"
                },
                {
                  title: "Sales Psychology",
                  desc: "The key to cold email success is making it about them, not you. We identify the exact pain point and build the pitch around solving it.",
                  color: "violet"
                },
                {
                  title: "Time Revolution",
                  desc: "What a sales rep spends 2 hours researching, 4 AI agents handle in 180 seconds — with better output.",
                  color: "purple"
                }
              ].map((benefit, i) => (
                <div key={i} className="flex gap-4">
                  <div className={`w-10 h-10 rounded-full bg-${benefit.color}-500/10 flex items-center justify-center shrink-0`}>
                    <CheckCircle2 className={`w-5 h-5 text-${benefit.color}-400`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{benefit.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-br from-indigo-500/5 to-violet-500/5 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px] group-hover:bg-indigo-500/20 transition-all" />
              <div className="relative z-10">
                <div className="text-4xl font-black mb-4 text-indigo-400">92%</div>
                <p className="text-slate-300 font-medium mb-6">Users report 92% faster pitch creation compared to manual research.</p>
                <div className="space-y-3">
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: "92%" }} transition={{ duration: 1.5 }} className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-600">
                    <span>TRADITIONAL RESEARCH (120 min)</span>
                    <span className="text-indigo-400">PITCHAGENT (3 min)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div
          id="pricing"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mt-40 w-full max-w-md"
        >
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest text-indigo-400 uppercase mb-3">
              Pricing
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              One plan. No fluff.
            </h2>
            <p className="text-slate-500 text-[15px]">For professionals who close.</p>
          </div>

          <div className="relative rounded-2xl border border-indigo-500/25 bg-slate-900/60 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/6 via-transparent to-violet-600/6 pointer-events-none" />
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

            <div className="p-8 relative z-10">
              <div className="flex items-start justify-between mb-7">
                <div>
                  <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest mb-2">
                    Pro Tier
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">$100</span>
                    <span className="text-slate-500 text-sm">/month</span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">or $1,000/year — save $200</div>
                </div>
                <div className="text-right text-sm">
                  <div className="text-white font-semibold">7-day free trial</div>
                  <div className="text-slate-600 text-xs mt-0.5">no card needed</div>
                </div>
              </div>

              <ul className="space-y-3.5 mb-8">
                {[
                  "Unlimited AI-generated pitches",
                  "Custom portfolio vectorization",
                  "Deep-dive target company analysis",
                  "4 specialized AI agents in sequence",
                  "1-click export to PDF or email",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href="/login">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-[15px] hover:opacity-92 transition-opacity btn-glow"
                >
                  Start Free Trial
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ─── Footer ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-32 text-center space-y-2"
        >
          <div className="flex items-center justify-center gap-1.5 mb-4">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-medium text-slate-500">PitchAgent Pro</span>
          </div>
          <p className="text-xs text-slate-700">
            © 2025 PitchAgent Pro. Built for closers.
          </p>
          <div className="flex items-center justify-center gap-6 mt-4">
            <Link href="/dashboard" className="text-xs text-slate-700 hover:text-slate-500 transition-colors">
              Sign in
            </Link>
            <Link href="/terms" className="text-xs text-slate-700 hover:text-slate-500 transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-xs text-slate-700 hover:text-slate-500 transition-colors">
              Privacy
            </Link>
            <Link href="/refund" className="text-xs text-slate-700 hover:text-slate-500 transition-colors">
              Refund
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

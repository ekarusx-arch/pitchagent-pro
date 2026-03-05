import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { scrapeWebsiteContent } from "@/lib/scraper";

// Force structured JSON from AI by specifying the schema.
const pitchSchema = z.object({
    pitch: z.string().describe("The highly personalized generated cold email pitch."),
    insights: z.array(z.string()).describe("A list of 3-4 bullet points explaining why this pitch is effective and its psychological triggers."),
});

// Allow longer execution for Vercel/Hobby limits
export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { context, targetUrl, templateHint, pitchStyle = "Professional" } = body;

        // Environment variable fail-safe
        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY === "your_api_key_here") {
            console.warn("GOOGLE_GENERATIVE_AI_API_KEY is not configured. Falling back to simulation for MVP preview.");

            await new Promise(resolve => setTimeout(resolve, 2000));
            return NextResponse.json({
                success: true,
                data: {
                    pitch: "Subject: Strategic growth for [Target Company]?\n\nHi [Name],\n\nI was analyzing [Target URL] and noticed your current approach to user acquisition is missing a key optimization in technical SEO that your competitors are leveraging.\n\nI specialize in programmatic SEO for B2B SaaS. We recently helped a client achieve a 30% boost in organic retention by restructuring their documentation hub.\n\nWould you be open to a 2-minute video where I walk through the specific opportunities I spotted on your site?\n\nBest,\n[Your Name]",
                    insights: [
                        "🎯 Personalization: Highlighting a specific technical SEO gap creates immediate relevance.",
                        "🔥 Proof of Work: Citing a 30% retention boost builds instant authority.",
                        "⚡ Zero Friction: A 2-minute video is a much lower commitment than a discovery call."
                    ]
                }
            });
        }

        // 1. Scraping Target URL (Agentic Search Phase)
        let scrapedContent = "No website content available.";
        if (targetUrl) {
            scrapedContent = await scrapeWebsiteContent(targetUrl);
        }

        // 1.5. [PRE-CHECK] Check credits before calling expensive AI
        const { createClient } = await import("@/utils/supabase/server");
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
        }

        let { data: profile } = await supabase
            .from("profiles")
            .select("credits, is_pro")
            .eq("id", user.id)
            .single();

        if (!profile) {
            // [SELF-HEALING] Create profile if missing
            const { error: insertError } = await supabase
                .from("profiles")
                .insert({
                    id: user.id,
                    email: user.email,
                    credits: 100,
                    context: JSON.stringify([{ name: "Default", content: "" }])
                });

            if (!insertError) {
                profile = { credits: 100, is_pro: false };
            }
        }

        if (!profile?.is_pro && (!profile || (profile.credits || 0) < 10)) {
            return NextResponse.json({
                success: false,
                error: (profile ? "Insufficient credits. You need at least 10 credits to generate a pitch." : "Profile initialization failed. Please try again.")
            }, { status: 403 });
        }

        // Style specific instructions
        let styleInstruction = "";
        if (pitchStyle === "Concise") {
            styleInstruction = "TONE: Extremely brief. No fluff. Use short sentences or bullet points. Avoid all pleasantries.";
        } else if (pitchStyle === "Bold") {
            styleInstruction = "TONE: High energy. Make strong, authoritative claims. Use provocative (but polite) pattern-interrupt hooks.";
        } else {
            styleInstruction = "TONE: Balanced and professional. Use sophisticated vocabulary and a calm, authoritative voice.";
        }

        // 2. Prepare System Prompt (Multi-agent Persona)
        const systemPrompt = `
    You are an elite B2B sales strategist and multi-agent AI system called "PitchAgent Pro".
    Your objective is to draft a short, highly-converting, and hyper-personalized pitch email.
    Target Audience: High-ticket agency owners, software buyers, and executives.

    Pitch Style Instruction: ${templateHint || "Write a concise, direct cold email focused on pain points and ROI."}
    ${styleInstruction}
    
    Guidelines for the Pitch Email:
    1. Hook the reader immediately (pattern interrupt). State an observation about their company/website based on their REAL context.
    2. Keep it under 150 words. Punchy, professional, and no fluff.
    3. Seamlessly weave in the "User Portfolio/Context". Frame it as the solution to their unstated problem.
    4. Provide a low-friction Call to Action (CTA) like asking permission to send a 2-minute video.
    5. Avoid typical salesy language ("I hope this finds you well", "synergy", "unique").

    Insights guideline:
    Explain *why* you drafted the email this way. List 3-4 bullet points outlining the sales psychology (e.g., pain-point targeting, brevity, social proof).
    `;

        // 3. AI Generation call
        const { object } = await generateObject({
            model: google("gemini-2.0-flash"), // Use the latest Gemini 2.0 Flash for superior performance and reasoning
            schema: pitchSchema,
            system: systemPrompt,
            prompt: `
      User Context/Portfolio: 
      "${context}"
      
      Target Client URL: 
      "${targetUrl}"
      
      ------- TARGET CLIENT WEBSITE SCRAPED CONTENT -------
      ${scrapedContent}
      -----------------------------------------------------

      Based on the above precise Website Context and the User Portfolio, generate the final email Draft and your Strategic Insights.
      `,
        });

        // 4. Record history and deduct credits
        try {
            // [HISTORY SAVE] Save to 'pitches' table
            const { error: insertError } = await supabase.from("pitches").insert({
                user_id: user.id,
                target_url: targetUrl,
                context: context,
                pitch_text: object.pitch,
                insights: object.insights
            });
            if (insertError) throw insertError;

            // [CREDIT DEDUCTION] Deduct 10 credits only for non-pro users
            if (!profile?.is_pro) {
                const { error: updateError } = await supabase
                    .from("profiles")
                    .update({ credits: (profile?.credits || 0) - 10 })
                    .eq("id", user.id);
                if (updateError) throw updateError;
            }

        } catch (dbError) {
            console.error("Critical Post-Generation Error (DB/Credits):", dbError);
            // We still return the object because the generation was successful
        }

        return NextResponse.json({
            success: true,
            data: object,
        });

    } catch (error: any) {
        console.error("AI Generation Failed:", error);
        return NextResponse.json(
            { success: false, error: "Failed to generate pitch. Please check if your API key is valid." },
            { status: 500 }
        );
    }
}

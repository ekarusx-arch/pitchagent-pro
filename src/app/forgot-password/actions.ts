"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

export async function resetPassword(formData: FormData) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn("[Mock Mode] 가상으로 이메일 전송을 성공 처리합니다.");
        redirect("/forgot-password?message=Mock email sent. In real app, check your email.");
    }

    const email = formData.get("email") as string;
    const supabase = await createClient();
    const headersList = await headers();
    const origin = headersList.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?next=/update-password`,
    });

    if (error) {
        redirect(`/forgot-password?error=${error.message}`);
    }

    redirect("/forgot-password?message=Check your email for the password reset link");
}

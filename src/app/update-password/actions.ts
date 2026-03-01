"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function updatePassword(formData: FormData) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        redirect("/login?message=Password updated successfully (Mock). Please log in again.");
    }

    const password = formData.get("password") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
        password: password,
    });

    if (error) {
        redirect(`/update-password?error=${error.message}`);
    }

    await supabase.auth.signOut();
    redirect("/login?message=Password updated successfully. Please log in again.");
}

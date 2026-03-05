"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
    // Mock mode for local UI testing
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn("[Mock Mode] Supabase URL/Key missing. Simulating successful login for UI testing.");
        redirect("/dashboard");
    }

    const supabase = await createClient();

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        redirect(`/login?error=${encodeURIComponent(error.message)}`);
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
}

export async function signup(formData: FormData) {
    // Mock mode for local UI testing
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn("[Mock Mode] Supabase URL/Key missing. Simulating successful signup for UI testing.");
        redirect("/dashboard");
    }

    const supabase = await createClient();

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const { data: authData, error } = await supabase.auth.signUp(data);
    const user = authData?.user;

    if (error) {
        redirect(`/login?error=${encodeURIComponent(error.message)}`);
    }

    // [PROFILE CREATION] Create a profile record for the new user
    if (user) {
        const { error: profileError } = await supabase
            .from("profiles")
            .insert({
                id: user.id,
                email: user.email,
                credits: 100, // Welcome bonus
                subscription_plan: "Free",
                context: [{ name: "Default", content: "" }]
            });

        if (profileError) {
            console.error("Failed to create profile:", profileError);
            // We might not want to block signup completely if profile fails, 
            // but for PitchAgent it's critical.
        }
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
}

export async function logout() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        redirect("/login");
    }

    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
}

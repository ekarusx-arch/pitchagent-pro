import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Fallback logic when environment variables are missing
    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn("Supabase environment variables missing. Bypassing auth middleware.");
        return supabaseResponse;
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // IMPORTANT: use getUser() instead of getSession() to keep server session up to date.
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const isDashboardPath = request.nextUrl.pathname.startsWith("/dashboard");

    // Redirect to login if accessing protected routes without auth.
    if (!user && isDashboardPath) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    // Redirect to dashboard if logged in user accesses login page.
    const isAuthPath = request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/checkout";
    if (user && isAuthPath) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}

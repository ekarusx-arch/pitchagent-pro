import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // 환경변수가 셋업되지 않은 경우 (개발 초기 단계 방어 로직)
    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn("Supabase 환경 변수가 누락되어 인증 미들웨어를 우회합니다.");
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
                setAll(cookiesToSet) {
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

    // 중요: getAuth() 대신 getUser()를 사용하여 현재 서버 세션을 최신 상태로 유지합니다.
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const isDashboardPath = request.nextUrl.pathname.startsWith("/dashboard");

    // 사용자가 없고, 접속하려는 경로가 대시보드(/dashboard)인 경우 로그인 페이지로 리다이렉트합니다.
    if (!user && isDashboardPath) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    // 사용자가 로그인된 상태이면서 /login 페이지를 접근하려 하면 대시보드로 리다이렉트
    const isAuthPath = request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/checkout";
    if (user && isAuthPath) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}

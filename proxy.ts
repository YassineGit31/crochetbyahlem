import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { requireSupabaseSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (!isSupabaseConfigured()) {
    const demoSession = request.cookies.get("demo_admin_session");
    if (demoSession?.value !== "granted") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return requireSupabaseSession(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};

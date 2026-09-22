import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export async function POST(req: NextRequest) {
  if (isSupabaseConfigured()) {
    return NextResponse.json({ error: "Utilisez la connexion Supabase." }, { status: 400 });
  }
  const { password } = await req.json().catch(() => ({ password: "" }));
  const expected = process.env.DEMO_ADMIN_PASSWORD || "ahlem-demo";

  if (password !== expected) {
    return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("demo_admin_session", "granted", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8h
  });
  return res;
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export function AdminLoginForm() {
  const router = useRouter();
  const configured = isSupabaseConfigured();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (configured) {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) {
          setError("Identifiants incorrects.");
          setLoading(false);
          return;
        }
      } else {
        const res = await fetch("/api/admin/demo-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error ?? "Mot de passe incorrect.");
          setLoading(false);
          return;
        }
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Une erreur est survenue.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo-mark.svg" alt="" width={48} height={48} className="rounded-full mb-3" />
          <h1 className="font-display text-2xl text-ink">Espace admin</h1>
          <p className="text-sm text-ink-light">Crochet by Ahlem</p>
        </div>

        {!configured && (
          <p className="mb-4 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
            Mode démo : Supabase n&apos;est pas configuré. Utilisez le mot de passe défini par
            <code className="mx-1 px-1 rounded bg-rose-100">DEMO_ADMIN_PASSWORD</code>
            (par défaut <code className="px-1 rounded bg-rose-100">ahlem-demo</code>).
          </p>
        )}

        <form onSubmit={handleSubmit} className="rounded-[var(--radius-card)] bg-ivory border border-rose-100 p-6 space-y-4">
          {configured && (
            <div>
              <label className="text-sm font-medium text-ink mb-1.5 block">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="ahlem@example.com"
              />
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-ink mb-1.5 block">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <Button type="submit" className="w-full gap-2" disabled={loading}>
            <Lock className="h-4 w-4" />
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </div>
    </div>
  );
}

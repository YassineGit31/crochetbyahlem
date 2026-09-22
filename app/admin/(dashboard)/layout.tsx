import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";
import { isSupabaseConfigured } from "@/lib/supabase/client";

async function assertIsAdmin() {
  if (!isSupabaseConfigured()) return; // demo mode: middleware cookie check already ran
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/admin/login");

  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("user_id", userData.user!.id)
    .maybeSingle();

  if (!admin) {
    await supabase.auth.signOut();
    redirect("/admin/login");
  }
}

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertIsAdmin();
  const demoMode = !isSupabaseConfigured();

  return (
    <div className="flex min-h-screen bg-[#FAF6F2]">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <AdminMobileNav />
        {demoMode && (
          <div className="bg-amber-100 text-amber-900 text-xs sm:text-sm text-center py-2 px-4">
            Mode démo — connectez Supabase pour enregistrer vos modifications de façon permanente
            (voir le README).
          </div>
        )}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

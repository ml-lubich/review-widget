import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Star, LayoutDashboard, Plus } from "lucide-react";
import { LogoutButton } from "./LogoutButton";
import { MobileSidebar } from "./MobileSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-surface border-r border-surface-border flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <Star className="w-6 h-6 text-gold-500 fill-gold-500" />
            <span className="text-lg font-bold">ReviewBoost</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-surface-light transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 text-muted" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/widgets/new"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-surface-light transition-colors"
          >
            <Plus className="w-4 h-4 text-muted" />
            New Widget
          </Link>
        </nav>

        <div className="p-3 border-t border-surface-border">
          <div className="px-3 py-2 text-sm text-muted truncate mb-1">
            {user.email}
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Mobile Header */}
      <MobileSidebar email={user.email || ""} />

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-4 pt-16 md:pt-8 md:p-8">{children}</div>
      </main>
    </div>
  );
}

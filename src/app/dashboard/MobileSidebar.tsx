"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, LayoutDashboard, Plus, Menu, X } from "lucide-react";
import { LogoutButton } from "./LogoutButton";

export function MobileSidebar({ email }: { email: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-surface border-b border-surface-border flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Star className="w-5 h-5 text-gold-500 fill-gold-500" />
          <span className="font-bold">ReviewBoost</span>
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="p-1.5 rounded-lg hover:bg-surface-light transition-colors"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {open && (
        <div className="md:hidden fixed top-[52px] left-0 right-0 z-30 bg-surface border-b border-surface-border shadow-lg">
          <nav className="px-3 py-2 space-y-1">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-surface-light transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-muted" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/widgets/new"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-surface-light transition-colors"
            >
              <Plus className="w-4 h-4 text-muted" />
              New Widget
            </Link>
          </nav>
          <div className="px-3 py-2 border-t border-surface-border">
            <div className="px-3 py-2 text-sm text-muted truncate">{email}</div>
            <LogoutButton />
          </div>
        </div>
      )}
    </>
  );
}

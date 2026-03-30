import { Star } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-gold-500 fill-gold-500" />
            <span className="font-bold">ReviewBoost</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted">
            <Link href="/pricing" className="hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/auth/login" className="hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link href="/auth/signup" className="hover:text-foreground transition-colors">
              Get Started
            </Link>
          </div>
        </div>
        <p className="text-center text-xs text-muted mt-8">
          &copy; {new Date().getFullYear()} ReviewBoost. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

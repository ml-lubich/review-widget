import Link from "next/link";
import { Star } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b border-surface-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Star className="w-6 h-6 text-gold-500 fill-gold-500" />
          <span className="text-lg font-bold">ReviewBoost</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/pricing"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/auth/login"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="px-4 py-2 bg-gold-500 hover:bg-gold-600 text-black font-semibold rounded-lg transition-colors text-sm"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

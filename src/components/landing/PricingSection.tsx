import { PRICING_TIERS } from "@/lib/constants";
import { Check } from "lucide-react";
import Link from "next/link";

export function PricingSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            Choose the plan that fits your business. Upgrade or cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl p-8 border transition-all ${
                tier.highlighted
                  ? "border-gold-500 bg-gold-500/5 scale-105 shadow-lg shadow-gold-500/10"
                  : "border-surface-border bg-surface"
              }`}
            >
              {tier.highlighted && (
                <span className="inline-block px-3 py-1 bg-gold-500 text-black text-xs font-bold rounded-full mb-4">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold">{tier.name}</h3>
              <p className="text-muted text-sm mt-1">{tier.description}</p>
              <div className="mt-6 mb-8">
                <span className="text-4xl font-bold">${tier.price}</span>
                <span className="text-muted">/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        tier.highlighted ? "text-gold-500" : "text-muted"
                      }`}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/signup"
                className={`block text-center py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                  tier.highlighted
                    ? "bg-gold-500 hover:bg-gold-600 text-black"
                    : "bg-surface-light hover:bg-surface-border text-foreground"
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

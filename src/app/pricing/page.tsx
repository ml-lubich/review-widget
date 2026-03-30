import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { PricingSection } from "@/components/landing/PricingSection";

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="pt-12">
        <PricingSection />
      </div>

      {/* FAQ */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "Can I try ReviewBoost before purchasing?",
                a: "Yes! Sign up for a free account and create your first widget. You can test all widget styles and see exactly how they look before choosing a plan.",
              },
              {
                q: "How do I add the widget to my website?",
                a: "Simply copy the embed code from your dashboard and paste it into your website's HTML. It works with any website builder including WordPress, Wix, Squarespace, and Shopify.",
              },
              {
                q: "Will the widget slow down my website?",
                a: "Not at all. Our embed script is lightweight and loads asynchronously, meaning it won't block your page from loading. It uses Shadow DOM for style isolation.",
              },
              {
                q: "Can I customize the widget colors?",
                a: "Yes! Every plan includes color customization. You can match the accent color, background, and text color to your brand. Pro and Agency plans also support custom CSS.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Absolutely. There are no long-term contracts. You can upgrade, downgrade, or cancel your subscription at any time.",
              },
              {
                q: "What's the difference between Pro and Agency?",
                a: "The Agency plan is designed for marketing agencies and web developers managing multiple client sites. It includes white-label branding, API access, and bulk management tools.",
              },
            ].map((item) => (
              <div
                key={item.q}
                className="bg-background border border-surface-border rounded-xl p-6"
              >
                <h3 className="font-semibold mb-2">{item.q}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

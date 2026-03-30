import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { DemoWidget } from "@/components/landing/DemoWidget";
import { PricingSection } from "@/components/landing/PricingSection";
import Link from "next/link";
import {
  Star,
  Palette,
  Code,
  BarChart3,
  Zap,
  Shield,
  Globe,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 border border-gold-500/20 rounded-full text-sm text-gold-400 mb-6">
            <Star className="w-4 h-4 fill-current" />
            Trusted by 1,000+ local businesses
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Show Your{" "}
            <span className="text-gold-500">5-Star Reviews</span>
            <br />
            On Your Website
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto mb-10">
            Beautiful, embeddable review widgets that build trust and convert
            visitors into customers. Set up in under 5 minutes.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="px-8 py-3.5 bg-gold-500 hover:bg-gold-600 text-black font-bold rounded-xl transition-colors text-lg"
            >
              Start Free Trial
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-3.5 bg-surface-light hover:bg-surface-border text-foreground font-semibold rounded-xl transition-colors text-lg"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Widget */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-surface border border-surface-border rounded-2xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-sm font-semibold text-gold-500 uppercase tracking-wider mb-2">
                Live Preview
              </h2>
              <p className="text-muted">
                Toggle between widget styles to see how they look
              </p>
            </div>
            <DemoWidget />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Everything You Need to Showcase Reviews
            </h2>
            <p className="text-muted text-lg max-w-xl mx-auto">
              Powerful tools to display your best reviews and boost conversions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Palette,
                title: "4 Beautiful Styles",
                desc: "Testimonial cards, review carousel, review wall, and star badge. Pick the one that fits your site.",
              },
              {
                icon: Code,
                title: "Easy Embed",
                desc: "Just copy and paste a single line of code. Works with any website, CMS, or page builder.",
              },
              {
                icon: BarChart3,
                title: "Impression Tracking",
                desc: "See how many visitors view your reviews. Track performance over time from your dashboard.",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                desc: "Lightweight script that loads asynchronously. Zero impact on your site's performance.",
              },
              {
                icon: Shield,
                title: "Shadow DOM Isolation",
                desc: "Your widget styles never conflict with your website. Guaranteed pixel-perfect rendering.",
              },
              {
                icon: Globe,
                title: "Works Everywhere",
                desc: "WordPress, Wix, Squarespace, Shopify, or custom sites. If it has HTML, it works.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-background border border-surface-border rounded-xl p-6 hover:border-gold-500/30 transition-colors"
              >
                <feature.icon className="w-8 h-8 text-gold-500 mb-4" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Up and Running in Minutes</h2>
            <p className="text-muted text-lg">Three simple steps to showcase your reviews</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create Your Widget",
                desc: "Choose a style, customize colors, and preview your widget in real-time.",
              },
              {
                step: "2",
                title: "Add Your Reviews",
                desc: "Enter your best reviews or import them from Google. Curate what visitors see.",
              },
              {
                step: "3",
                title: "Embed on Your Site",
                desc: "Copy one line of code and paste it into your website. That's it.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-500 font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Boost Your Conversions?
          </h2>
          <p className="text-muted text-lg mb-8">
            Join thousands of local businesses showing their best reviews.
            Start your free trial today.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-3.5 bg-gold-500 hover:bg-gold-600 text-black font-bold rounded-xl transition-colors text-lg"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      <PricingSection />
      <Footer />
    </div>
  );
}

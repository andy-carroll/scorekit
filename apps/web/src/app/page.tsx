import Link from "next/link";
import Image from "next/image";
import { getActiveTemplateContent } from "@/lib/active-template";

// Accent colour → CSS variable mapping for value-prop cards
const ACCENT_VAR: Record<string, string> = {
  teal: "var(--color-accent-teal)",
  primary: "var(--color-primary)",
  pink: "var(--color-accent-pink)",
  green: "var(--color-accent-green)",
};

function accentColor(accent?: string): string {
  return accent ? (ACCENT_VAR[accent] ?? "var(--color-primary)") : "var(--color-primary)";
}

export default function Home() {
  const content = getActiveTemplateContent();
  const { landing, brand } = content;
  const logoPath = brand?.logoPath ?? brand?.logo?.light ?? "/logos/accelerator.svg";
  const brandName = brand?.name ?? "ScoreKit";
  const valueProps = landing.valueProps ?? [];
  const timeEstimate = landing.timeEstimate;
  const trustLine = landing.trustLine;

  return (
    <main className="min-h-screen">
      {/* White sticky header — matches main website style */}
      <header className="sticky top-0 z-50 border-b border-surface bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center px-4 py-4 md:px-6">
          <Image
            src={logoPath}
            alt={brandName}
            width={140}
            height={32}
            priority
          />
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-dark min-h-[80vh] flex flex-col">
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-display text-7xl mb-6">
              {landing.headline.includes("ready for AI") ? (
                <>
                  Is your organisation{" "}
                  <span className="text-highlight">ready for AI?</span>
                </>
              ) : (
                landing.headline
              )}
            </h1>
            <p
              className="text-lg md:text-xl mb-10 max-w-2xl mx-auto"
              style={{ color: "var(--color-text-on-dark-muted)" }}
            >
              {landing.subheadline}
            </p>
            <Link href="/quiz" className="btn-primary">
              {landing.ctaText}
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            {timeEstimate && (
              <p className="mt-6 text-sm" style={{ color: "var(--color-text-on-dark-muted)" }}>
                {timeEstimate} • Personalised insights • Actionable recommendations
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Value Props Section */}
      {valueProps.length > 0 && (
        <section className="py-20 px-6" style={{ backgroundColor: "var(--color-bg-light)" }}>
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-display text-3xl md:text-4xl text-center mb-4"
              style={{ color: "var(--color-text-on-light)" }}
            >
              What you&apos;ll discover
            </h2>
            <p
              className="text-center mb-12 max-w-2xl mx-auto"
              style={{ color: "var(--color-text-on-light-secondary)" }}
            >
              Our assessment evaluates your organisation across key dimensions to give you a complete picture.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {valueProps.map((prop) => {
                const color = accentColor(prop.accent);
                return (
                  <div key={prop.title} className="card-accent" style={{ borderLeftColor: color }}>
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                      style={{ backgroundColor: color }}
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg mb-2" style={{ color: "var(--color-text-on-light)" }}>
                      {prop.title}
                    </h3>
                    <p className="text-sm" style={{ color: "var(--color-text-on-light-secondary)" }}>
                      {prop.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA Section */}
      <section className="py-16 px-6 text-center" style={{ backgroundColor: "var(--color-bg-muted)" }}>
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-display text-2xl md:text-3xl mb-4"
            style={{ color: "var(--color-text-on-light)" }}
          >
            Ready to discover your AI readiness?
          </h2>
          {trustLine && (
            <p className="mb-8" style={{ color: "var(--color-text-on-light-secondary)" }}>
              {trustLine}
            </p>
          )}
          <Link href="/quiz" className="btn-secondary">
            {landing.ctaText}
          </Link>
        </div>
      </section>
    </main>
  );
}

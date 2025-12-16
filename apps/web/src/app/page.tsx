import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section - Dark background like Accelerator website */}
      <section className="hero-dark min-h-[80vh] flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 md:px-12">
          <Image
            src="/logos/accelerator.svg"
            alt="Accelerator Solutions"
            width={140}
            height={32}
            priority
          />
        </header>

        {/* Hero Content */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-display text-7xl mb-6">
              Is your organisation{" "}
              <span className="text-highlight">ready for AI?</span>
            </h1>
            <p
              className="text-lg md:text-xl mb-10 max-w-2xl mx-auto"
              style={{ color: "var(--color-text-on-dark-muted)" }}
            >
              Discover where you stand, uncover hidden gaps, and get a clear
              roadmap for AI transformation—tailored to your business.
            </p>
            <Link
              href="/quiz"
              className="inline-flex items-center px-6 py-3 font-semibold text-base rounded-sm transition-all duration-200"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-bg-dark)",
              }}
            >
              Take the Assessment
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <p
              className="mt-6 text-sm"
              style={{ color: "var(--color-text-on-dark-muted)" }}
            >
              10 minutes • Personalised insights • Actionable recommendations
            </p>
          </div>
        </div>
      </section>

      {/* Features Section - Light background */}
      <section
        className="py-20 px-6"
        style={{ backgroundColor: "var(--color-bg-light)" }}
      >
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
            Our AI Readiness Assessment evaluates your organisation across key
            dimensions to give you a complete picture.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 - Teal accent */}
            <div
              className="card-accent"
              style={{ borderLeftColor: "var(--color-accent-teal)" }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: "var(--color-accent-teal)" }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3
                className="font-semibold text-lg mb-2"
                style={{ color: "var(--color-text-on-light)" }}
              >
                Your AI Readiness Score
              </h3>
              <p
                className="text-sm"
                style={{ color: "var(--color-text-on-light-secondary)" }}
              >
                See how your organisation compares across strategy, data,
                technology, people, and governance.
              </p>
            </div>

            {/* Card 2 - Orange accent */}
            <div
              className="card-accent"
              style={{ borderLeftColor: "var(--color-primary)" }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3
                className="font-semibold text-lg mb-2"
                style={{ color: "var(--color-text-on-light)" }}
              >
                Personalised Insights
              </h3>
              <p
                className="text-sm"
                style={{ color: "var(--color-text-on-light-secondary)" }}
              >
                Understand your specific strengths and the gaps holding you back
                from AI success.
              </p>
            </div>

            {/* Card 3 - Pink accent */}
            <div
              className="card-accent"
              style={{ borderLeftColor: "var(--color-accent-pink)" }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: "var(--color-accent-pink)" }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <h3
                className="font-semibold text-lg mb-2"
                style={{ color: "var(--color-text-on-light)" }}
              >
                Clear Next Steps
              </h3>
              <p
                className="text-sm"
                style={{ color: "var(--color-text-on-light-secondary)" }}
              >
                Get actionable recommendations prioritised for your current
                stage and resources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-16 px-6 text-center"
        style={{ backgroundColor: "var(--color-bg-muted)" }}
      >
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-display text-2xl md:text-3xl mb-4"
            style={{ color: "var(--color-text-on-light)" }}
          >
            Ready to discover your AI readiness?
          </h2>
          <p
            className="mb-8"
            style={{ color: "var(--color-text-on-light-secondary)" }}
          >
            Join hundreds of organisations who have used this assessment to
            accelerate their AI journey.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center px-6 py-3 font-semibold text-base rounded-sm transition-all duration-200"
            style={{
              backgroundColor: "var(--color-bg-dark)",
              color: "var(--color-text-on-dark)",
            }}
          >
            Start Your Assessment
          </Link>
        </div>
      </section>
    </main>
  );
}

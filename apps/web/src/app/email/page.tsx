"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function EmailGatePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasResult = useMemo(() => {
    if (typeof window === "undefined") return false;
    return !!sessionStorage.getItem("scorekit_result");
  }, []);

  if (!hasResult && typeof window !== "undefined") {
    router.push("/quiz");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Generate a simple report ID (in production, this would be from the backend)
    const reportId = `rpt_${Date.now().toString(36)}`;

    // Store email data in sessionStorage (in production, send to backend + GHL)
    sessionStorage.setItem(
      "scorekit_lead",
      JSON.stringify({ email, name, company, reportId })
    );

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    router.push(`/report/${reportId}`);
  };

  if (!hasResult) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--color-bg-light)" }}>
        <div className="animate-pulse muted-text">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-12 px-4" style={{ backgroundColor: "var(--color-bg-light)" }}>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: "var(--color-primary)", opacity: 0.2 }}>
            <svg
              className="w-8 h-8"
              style={{ color: "var(--color-primary)" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="section-heading text-2xl mb-2">
            Your results are ready!
          </h1>
          <p className="body-text">
            Enter your details to unlock your personalised AI Readiness Report.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-1" style={{ color: "var(--color-text-on-light)" }}
            >
              Your name
            </label>
            <input
              type="text"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 transition-colors placeholder:text-[var(--color-text-on-light-muted)]" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-surface)", color: "var(--color-text-on-light)" }}
              placeholder="Jane Smith"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1" style={{ color: "var(--color-text-on-light)" }}
            >
              Work email
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 transition-colors placeholder:text-[var(--color-text-on-light-muted)]" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-surface)", color: "var(--color-text-on-light)" }}
              placeholder="jane@company.com"
            />
          </div>

          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium mb-1" style={{ color: "var(--color-text-on-light)" }}
            >
              Company
            </label>
            <input
              type="text"
              id="company"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 transition-colors placeholder:text-[var(--color-text-on-light-muted)]" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-surface)", color: "var(--color-text-on-light)" }}
              placeholder="Acme Inc"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-4"
          >
            {isSubmitting ? "Generating report..." : "Get My Free Report"}
          </button>

          <p className="muted-text text-center">
            We&apos;ll also send a PDF copy to your inbox. No spam, ever.
          </p>
        </form>
      </div>
    </main>
  );
}

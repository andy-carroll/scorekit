"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getReportStore } from "@/lib/report-store";
import type { ScoreResult } from "@/lib/report-store/types";

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

    const storedAnswers = sessionStorage.getItem("scorekit_answers");
    const storedResult = sessionStorage.getItem("scorekit_result");

    if (!storedResult) {
      setIsSubmitting(false);
      router.push("/quiz");
      return;
    }

    const answers = storedAnswers ? (JSON.parse(storedAnswers) as Record<string, unknown>) : {};
    const result = JSON.parse(storedResult) as ScoreResult;

    const store = getReportStore();
    const { token } = await store.createReport({
      templateId: "ai-readiness",
      answers,
      result,
      lead: { email, name, company },
    });

    // Get the full report record for email delivery
    const reportRecord = await store.getReport(token);
    
    // Trigger email delivery asynchronously (don't wait for it)
    if (reportRecord) {
      fetch("/api/report/email", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, report: reportRecord }),
      }).catch((error) => {
        console.error("Failed to trigger email delivery:", error);
        // Don't block the user journey if email fails
      });
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    router.push(`/report/${token}`);
  };

  if (!hasResult) {
    return (
      <main className="page-bg min-h-screen flex items-center justify-center">
        <div className="animate-pulse muted-text">Loading...</div>
      </main>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="page-bg flow-shell">
      <div className="flow-panel flow-panel-sm">
        <div className="flow-panel-header">
          <div className="text-center">
            <div className="icon-badge mb-3">
              <svg
                className="w-8 h-8"
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
            <h1 className="section-heading text-2xl mb-1">Your results are ready!</h1>
            <p className="body-text">
              Enter your details to unlock your personalised AI Readiness Report.
            </p>
          </div>
        </div>

        <div className="flow-panel-body">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="form-label">
                Your name
              </label>
              <input
                type="text"
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                placeholder="Jane Smith"
              />
            </div>

            <div>
              <label htmlFor="email" className="form-label">
                Work email
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="jane@company.com"
              />
            </div>

            <div>
              <label htmlFor="company" className="form-label">
                Company
              </label>
              <input
                type="text"
                id="company"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="form-input"
                placeholder="Acme Inc"
              />
            </div>

            <p className="muted-text text-center mt-4">
              We&apos;ll also send a PDF copy to your inbox. No spam, ever.
            </p>
          </div>
        </div>

        <div className="flow-panel-footer">
          <div className="flow-panel-footer-inner">
            <div className="flow-actions" />
            <div className="flow-actions">
              <button type="submit" disabled={isSubmitting} className="btn-primary">
                {isSubmitting ? "Generating report..." : "Get My Free Report"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

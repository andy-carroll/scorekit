"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { type ScoreLevel, mapAnswersToPillars, type Template } from "@scorekit/core";
import { sections, getQuestionsForSection } from "@/lib/questions";
import { useReport } from "@/lib/report-store/useReport";
import type { ReportRecord, ScoreResult } from "@/lib/report-store/types";
import type { TemplateContent } from "@/lib/active-template";

interface ReportViewProps {
  token: string;
  /** Pre-fetched server-side (Upstash). Null in local-dev (falls back to useReport/localStorage). */
  initialReport: ReportRecord | null;
  content: TemplateContent;
}

function getScoreLevel(score: number): ScoreLevel {
  if (score <= 2) return "low";
  if (score <= 3.5) return "medium";
  return "high";
}

export function ReportView({ token, initialReport, content }: ReportViewProps) {
  const router = useRouter();
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // useReport fetches from localStorage when Upstash is not configured (dev only).
  // When initialReport is provided (Upstash/production path), this hook is effectively idle.
  const { report: hookReport, isLoading } = useReport(initialReport ? undefined : token);
  const report: ReportRecord | null = initialReport ?? hookReport;

  const { bandIntros, pillarLabels, pillarInsights, nextSteps, cta } = content;
  const sectionHeadings = content.report?.sectionHeadings ?? {};
  const reportTitle = content.meta.reportTitle ?? content.meta.templateName;

  const mappedAnswersByPillar = useMemo(() => {
    if (!report) return null;

    const pseudoTemplate: Template = {
      id: content.meta.templateId,
      version: content.meta.version,
      name: content.meta.templateName,
      description: `${content.meta.templateName} (web)`,
      estimatedMinutes: 15,
      pillars: sections.map((section, index) => ({
        id: section.id,
        name: section.name,
        description: section.description,
        order: index + 1,
      })) as Template["pillars"],
      questions: sections
        .flatMap((section) =>
          getQuestionsForSection(section.id).map((q, index) => ({
            ...q,
            category: "diagnostic",
            questionType: "maturity",
            pillarId: section.id,
            order: index + 1,
          })),
        ) as Template["questions"],
      recommendations: [],
      copy: {
        landing: {
          headline: content.landing.headline,
          subheadline: content.landing.subheadline,
          valueProps: [],
          timeEstimate: content.landing.timeEstimate ?? "15 minutes",
          ctaText: content.landing.ctaText,
        },
        report: {
          title: reportTitle,
          openingInsightTemplates: {},
          pillarDescriptions: {},
          roadmapIntro: "",
          businessCaseIntro: "",
          ctaHeadline: cta.headline,
          ctaText: cta.body,
        },
      },
    };

    const answers = report.answers as Record<string, number | string | string[]>;
    return mapAnswersToPillars({ template: pseudoTemplate, answers });
  }, [report, content, reportTitle, cta]);

  if (isLoading) {
    return (
      <main className="page-bg min-h-screen flex items-center justify-center">
        <div className="animate-pulse muted-text">Loading your report...</div>
      </main>
    );
  }

  if (!report) {
    return (
      <main className="page-bg min-h-screen flex items-center justify-center px-4">
        <div className="card max-w-md w-full text-center">
          <h1 className="section-heading mb-2">This report link isn&apos;t valid</h1>
          <p className="body-text mb-6">
            It may have expired, or it may have been created in a different browser.
          </p>
          <button onClick={() => router.push("/quiz")} className="btn-primary">
            Start the assessment again
          </button>
        </div>
      </main>
    );
  }

  const result: ScoreResult = report.result;
  const lead = report.lead;

  const handleDownloadPdf = async () => {
    if (isDownloadingPdf) return;
    setIsDownloadingPdf(true);
    setPdfError(null);

    try {
      const res = await fetch("/api/report/pdf", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token: report.token, report }),
      });

      if (!res.ok) {
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          try {
            const data = (await res.json()) as { error?: string; message?: string };
            setPdfError(data.message || data.error || "Failed to generate PDF");
          } catch {
            setPdfError("Failed to generate PDF");
          }
        } else {
          setPdfError("Failed to generate PDF");
        }
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `scorekit-report-${report.token}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const band = bandIntros[result.band] || bandIntros.Starting;

  const sortedPillars = Object.entries(result.pillarScores).sort(([, a], [, b]) => a - b);
  const priorityPillars = sortedPillars.slice(0, 3);
  const strongestPillar = sortedPillars[sortedPillars.length - 1];

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--color-bg-light)" }}>
      {/* Hero Section */}
      <div className="hero-dark">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-sm font-medium uppercase tracking-wide mb-2"
            style={{ color: "var(--color-text-on-dark-muted)" }}>
            {reportTitle}
          </div>
          <h1 className="text-display text-3xl md:text-4xl mb-4 leading-tight">
            {band.headline}
          </h1>
          <p className="text-lg mb-8 leading-relaxed" style={{ color: "var(--color-text-on-dark-muted)" }}>
            {band.intro}
          </p>
          <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur rounded-sm px-6 py-4">
            <div>
              <div className="text-sm" style={{ color: "var(--color-text-on-dark-muted)" }}>Your Score</div>
              <div className="text-4xl font-bold">{result.percentage}%</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div>
              <div className="text-sm" style={{ color: "var(--color-text-on-dark-muted)" }}>Maturity Band</div>
              <div className="text-2xl font-semibold" style={{ color: "var(--color-primary)" }}>
                {result.band}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Pillar Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {sectionHeadings.pillarScores ?? "Your Readiness by Pillar"}
          </h2>
          <div className="grid gap-4">
            {Object.entries(result.pillarScores).map(([pillarId, score]) => {
              const percentage = (score / 5) * 100;
              const level = getScoreLevel(score);
              const colors = { low: "bg-red-500", medium: "bg-amber-500", high: "bg-emerald-500" };
              return (
                <div key={pillarId} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">{pillarLabels[pillarId] || pillarId}</span>
                    <span className="text-sm font-medium text-gray-600">{score.toFixed(1)} / 5</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${colors[level]} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Key Insights */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {sectionHeadings.keyInsights ?? "Key Insights"}
          </h2>
          <div className="space-y-6">
            {priorityPillars.map(([pillarId, score]) => {
              const level = getScoreLevel(score);
              const insight = pillarInsights[pillarId]?.[level];
              if (!insight) return null;
              const borderColors = { low: "border-l-red-500", medium: "border-l-amber-500", high: "border-l-emerald-500" };
              return (
                <div key={pillarId}
                  className={`bg-white rounded-lg border border-gray-200 border-l-4 ${borderColors[level]} p-6`}>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    {pillarLabels[pillarId] || pillarId}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{insight.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{insight.insight}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Strength Callout */}
        {strongestPillar && getScoreLevel(strongestPillar[1]) !== "low" && (
          <section className="mb-12">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-900 mb-1">
                    Your Strongest Area: {pillarLabels[strongestPillar[0]] || strongestPillar[0]}
                  </h3>
                  <p className="text-emerald-700">
                    {pillarInsights[strongestPillar[0]]?.[getScoreLevel(strongestPillar[1])]?.insight}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* How we calculated your scores */}
        {mappedAnswersByPillar && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {sectionHeadings.howWeScore ?? "How we calculated your scores"}
            </h2>
            <p className="text-gray-600 mb-6">
              Below is a summary of the answers you gave, grouped by pillar.
            </p>
            <div className="space-y-8">
              {Object.values(mappedAnswersByPillar).map((pillar) => (
                <div key={pillar.pillarId} className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {pillarLabels[pillar.pillarId] || pillar.pillarName}
                  </h3>
                  <dl className="space-y-3">
                    {pillar.answers.map((answer) => (
                      <div key={answer.questionId} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                        <dt className="text-sm font-medium text-gray-700 mb-1">{answer.questionText}</dt>
                        <dd className="text-sm text-gray-900">{answer.displayAnswer}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Next Steps */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {sectionHeadings.nextSteps ?? "Your Next Steps"}
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <ol className="space-y-4">
              {nextSteps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-semibold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <div className="font-medium text-gray-900">{step.title}</div>
                    <div className="text-gray-600 text-sm">
                      {i === 1 ? (
                        <>
                          For you, that&apos;s{" "}
                          <strong>{pillarLabels[priorityPillars[0]?.[0]] || "your lowest pillar"}</strong>.{" "}
                          {step.description}
                        </>
                      ) : (
                        step.description
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-12">
          <div className="hero-dark rounded-sm p-8 text-center">
            <h2 className="text-display text-2xl mb-3">{cta.headline}</h2>
            <p className="mb-6 max-w-xl mx-auto" style={{ color: "var(--color-text-on-dark-muted)" }}>
              {cta.body}
            </p>
            {cta.url ? (
              <a href={cta.url} className="btn-primary">{cta.buttonText}</a>
            ) : (
              <button className="btn-primary">{cta.buttonText}</button>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 border-t border-gray-200 pt-8">
          <div className="mb-6 flex justify-center">
            <button type="button" onClick={handleDownloadPdf} disabled={isDownloadingPdf} className="btn-primary">
              {isDownloadingPdf ? "Preparing PDF..." : "Download PDF"}
            </button>
          </div>
          {pdfError && <p className="mb-2 text-sm text-red-600">PDF download failed: {pdfError}</p>}
          <p className="mb-2">
            Prepared for <strong>{lead.name}</strong> at <strong>{lead.company}</strong>
          </p>
          <p className="mb-4">
            Download your PDF report for future reference. A copy has been sent to your email.
          </p>
          <p className="text-xs text-gray-400">Report ID: {report.token}</p>
        </footer>
      </div>
    </main>
  );
}

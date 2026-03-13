"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { type ScoreLevel, mapAnswersToPillars, type Template } from "@scorekit/core";
import { sections, getQuestionsForSection } from "@/lib/questions";
import { useReport } from "@/lib/report-store/useReport";
import type { ReportRecord, ScoreResult } from "@/lib/report-store/types";
import type { TemplateContent } from "@/lib/active-template";
import { SiteHeader } from "@/components/SiteHeader";
import { DownloadPdfButton } from "@/components/DownloadPdfButton";

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

  const band = bandIntros[result.band] || bandIntros.Starting;

  const sortedPillars = Object.entries(result.pillarScores).sort(([, a], [, b]) => a - b);
  const priorityPillars = sortedPillars.slice(0, 3);
  const strongestPillar = sortedPillars[sortedPillars.length - 1];

  const logoPath = content.brand?.logoPath ?? content.brand?.logo?.light ?? "/logos/accelerator.svg";
  const brandName = content.brand?.name ?? "ScoreKit";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg-light)" }}>
      <SiteHeader
        logoPath={logoPath}
        brandName={brandName}
        action={<DownloadPdfButton token={token} report={report} />}
      />

      <main>
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

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Pillar Overview */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {sectionHeadings.pillarScores ?? "Your Readiness by Pillar"}
          </h2>
          <div className="grid gap-2">
            {Object.entries(result.pillarScores).map(([pillarId, score]) => {
              const percentage = (score / 5) * 100;
              const level = getScoreLevel(score);
              // low/high use semantic colours; medium uses the brand primary so it
              // inherits correctly from any template rather than hardcoding amber.
              const barColor = level === "low"
                ? "bg-red-500"
                : level === "high"
                ? "bg-emerald-500"
                : undefined;
              return (
                <div key={pillarId} className="bg-white rounded-lg border border-gray-200 px-4 py-3">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium text-gray-900">{pillarLabels[pillarId] || pillarId}</span>
                    <span className="text-xs font-medium text-gray-500">{score.toFixed(1)} / 5</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500${barColor ? ` ${barColor}` : ""}`}
                      style={{
                        width: `${percentage}%`,
                        ...(barColor ? {} : { backgroundColor: "var(--color-primary)" }),
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Key Insights */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {sectionHeadings.keyInsights ?? "Key Insights"}
          </h2>
          <div className="space-y-3">
            {priorityPillars.map(([pillarId, score]) => {
              const level = getScoreLevel(score);
              const insight = pillarInsights[pillarId]?.[level];
              if (!insight) return null;
              const borderColors = { low: "border-l-red-500", medium: "border-l-amber-500", high: "border-l-emerald-500" };
              return (
                <div key={pillarId}
                  className={`bg-white rounded-lg border border-gray-200 border-l-4 ${borderColors[level]} px-5 py-4`}>
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    {pillarLabels[pillarId] || pillarId}
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">{insight.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{insight.insight}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Strength Callout */}
        {strongestPillar && getScoreLevel(strongestPillar[1]) !== "low" && (
          <section className="mb-10">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
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
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {sectionHeadings.howWeScore ?? "How we calculated your scores"}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Your answers, grouped by pillar.
            </p>
            <div className="space-y-3">
              {Object.values(mappedAnswersByPillar).map((pillar) => (
                <div key={pillar.pillarId} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  {/* Pillar label row */}
                  <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      {pillarLabels[pillar.pillarId] || pillar.pillarName}
                    </span>
                  </div>
                  {/* Q&A rows */}
                  <dl>
                    {pillar.answers.map((answer) => (
                      <div
                        key={answer.questionId}
                        className="flex flex-col gap-0.5 sm:grid sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-x-6 px-4 py-2.5 border-b border-gray-50 last:border-b-0"
                      >
                        <dt className="text-xs text-gray-400 leading-snug">{answer.questionText}</dt>
                        <dd className="text-sm font-semibold text-gray-800 sm:text-right">{answer.displayAnswer}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Next Steps */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {sectionHeadings.nextSteps ?? "Your Next Steps"}
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 px-5 py-4">
            <ol className="space-y-3">
              {nextSteps.map((step, i) => (
                <li key={step.title} className="flex gap-3">
                  <span
                    className="shrink-0 w-7 h-7 rounded-full font-semibold text-sm flex items-center justify-center text-white"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{step.title}</div>
                    <div className="text-sm text-gray-500 leading-snug mt-0.5">
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
          <p className="mb-2">
            Prepared for <strong>{lead.name}</strong> at <strong>{lead.company}</strong>
          </p>
          <p className="mb-4">
            Your PDF report is available via the Download button above. A copy has been sent to your email.
          </p>
          <p className="text-xs text-gray-400">Report ID: {report.token}</p>
        </footer>
      </div>
      </main>
    </div>
  );
}

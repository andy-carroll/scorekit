"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

interface ScoreResult {
  total: number;
  max: number;
  percentage: number;
  pillarScores: Record<string, number>;
  band: string;
}

interface Lead {
  email: string;
  name: string;
  company: string;
  reportId: string;
}

// =============================================================================
// MOCK CONTENT - Hardcoded for design validation
// This will be templated later based on band + pillar scores
// =============================================================================

const bandContent: Record<string, { headline: string; intro: string }> = {
  Starting: {
    headline: "You're at the starting line — and that's a great place to be",
    intro: "Most organisations at your stage are overwhelmed by AI hype but unclear on where to begin. The good news? You're now armed with clarity. This report identifies exactly where to focus first, so you can make meaningful progress without wasted effort or budget.",
  },
  Emerging: {
    headline: "You've taken the first steps — now it's time to build momentum",
    intro: "Your organisation has begun its AI journey, but like many at this stage, progress may feel inconsistent. Some pockets of experimentation exist, but they're not yet connected to a coherent strategy. This report shows you how to turn scattered efforts into systematic progress.",
  },
  Progressing: {
    headline: "You're making real progress — let's accelerate it",
    intro: "Your organisation has moved beyond experimentation into genuine AI adoption. You have some foundations in place, but there are clear opportunities to deepen impact and scale what's working. This report identifies the gaps that, once closed, will unlock your next level of capability.",
  },
  Leader: {
    headline: "You're leading the pack — here's how to stay ahead",
    intro: "Congratulations. Your organisation demonstrates strong AI readiness across multiple dimensions. But leadership is never static. This report highlights opportunities to extend your advantage and avoid the complacency that catches many high performers.",
  },
};

const pillarInsights: Record<string, Record<string, { title: string; insight: string }>> = {
  leadership: {
    low: {
      title: "Leadership alignment is your biggest unlock",
      insight: "Without clear executive sponsorship and a documented AI strategy, teams struggle to prioritise and invest. The most successful AI transformations start with leadership alignment — not technology selection. Consider scheduling a leadership workshop to establish shared vision and accountability.",
    },
    medium: {
      title: "Leadership is engaged, but strategy needs sharpening",
      insight: "Your executives are interested in AI, but the strategy may lack the specificity needed to drive action. Teams need clearer priorities and success metrics. Consider documenting your AI strategy with concrete use cases and owners.",
    },
    high: {
      title: "Strong leadership foundation in place",
      insight: "Your leadership team is actively driving AI as a strategic priority. To maintain momentum, ensure regular reviews of AI initiatives against business outcomes, and keep expanding the coalition of sponsors across the organisation.",
    },
  },
  data: {
    low: {
      title: "Data foundations need urgent attention",
      insight: "AI is only as good as the data it's built on. Scattered, siloed, or poor-quality data will undermine any AI initiative. Before investing in AI tools, prioritise getting your core data assets organised, accessible, and governed. This is unglamorous but essential work.",
    },
    medium: {
      title: "Data is accessible but not yet AI-ready",
      insight: "You have some data infrastructure in place, but gaps in quality, integration, or governance may slow AI adoption. Focus on your highest-value datasets first — ensure they're clean, documented, and accessible to the teams who need them.",
    },
    high: {
      title: "Data infrastructure is a competitive advantage",
      insight: "Your data foundations are strong. You can confidently pursue more sophisticated AI use cases knowing the underlying data will support them. Consider how to extend this capability to more parts of the organisation.",
    },
  },
  people: {
    low: {
      title: "Skills gap is holding you back",
      insight: "Your team lacks the AI literacy needed to identify opportunities, evaluate tools, or work effectively with AI systems. This isn't about hiring data scientists — it's about ensuring everyone understands enough to contribute. Start with foundational AI training for key roles.",
    },
    medium: {
      title: "Pockets of expertise exist, but skills are uneven",
      insight: "Some team members are AI-capable, but knowledge isn't distributed evenly. This creates bottlenecks and single points of failure. Invest in structured training and create opportunities for knowledge sharing across teams.",
    },
    high: {
      title: "Your team is AI-capable and confident",
      insight: "Your people have the skills and confidence to work with AI tools effectively. Focus on maintaining this through continuous learning, and consider how your team can help upskill others in the organisation.",
    },
  },
  process: {
    low: {
      title: "AI isn't yet part of how you work",
      insight: "AI tools may be available, but they're not embedded in your daily workflows. This means missed opportunities for efficiency and insight. Start by identifying 2-3 high-frequency, high-value processes where AI could make an immediate difference.",
    },
    medium: {
      title: "Some AI adoption, but not yet systematic",
      insight: "Individual team members may be using AI tools, but there's no standard approach. This leads to inconsistent results and missed learning opportunities. Document what's working, standardise the best practices, and create shared resources.",
    },
    high: {
      title: "AI is embedded in your operations",
      insight: "You've moved beyond experimentation to systematic AI integration. Your processes benefit from automation and augmentation. Focus on measuring impact, sharing successes, and identifying the next wave of opportunities.",
    },
  },
  culture: {
    low: {
      title: "Culture may be blocking AI adoption",
      insight: "Even with the right strategy, data, and skills, AI initiatives fail if the culture isn't ready. Fear of failure, resistance to change, or slow decision-making will stall progress. Focus on creating psychological safety for experimentation and celebrating learning from failures.",
    },
    medium: {
      title: "Culture is open but not yet optimised for AI",
      insight: "Your organisation is willing to try new things, but the pace of experimentation could be faster. Look for ways to reduce friction in trying new AI tools, and create more opportunities to share learnings across teams.",
    },
    high: {
      title: "Culture of experimentation is a strength",
      insight: "Your organisation embraces change and learns quickly from experiments. This cultural readiness is often the hardest thing to build — protect it, celebrate it, and use it as a foundation for ambitious AI initiatives.",
    },
  },
};

const pillarLabels: Record<string, string> = {
  leadership: "Leadership & Vision",
  data: "Data & Infrastructure",
  people: "People & Skills",
  process: "Process & Operations",
  culture: "Culture & Experimentation",
};

function getScoreLevel(score: number): "low" | "medium" | "high" {
  if (score <= 2) return "low";
  if (score <= 3.5) return "medium";
  return "high";
}

export default function ReportPage() {
  const router = useRouter();

  const { result, lead } = useMemo(() => {
    if (typeof window === "undefined") {
      return { result: null, lead: null };
    }
    const storedResult = sessionStorage.getItem("scorekit_result");
    const storedLead = sessionStorage.getItem("scorekit_lead");

    if (!storedResult || !storedLead) {
      return { result: null, lead: null };
    }

    return {
      result: JSON.parse(storedResult) as ScoreResult,
      lead: JSON.parse(storedLead) as Lead,
    };
  }, []);

  if (!result || !lead) {
    if (typeof window !== "undefined") {
      router.push("/quiz");
    }
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading your report...</div>
      </main>
    );
  }

  const band = bandContent[result.band] || bandContent.Starting;
  
  // Sort pillars by score (lowest first) for recommendations
  const sortedPillars = Object.entries(result.pillarScores)
    .sort(([, a], [, b]) => a - b);
  
  // Get top 3 priority areas (lowest scores)
  const priorityPillars = sortedPillars.slice(0, 3);
  
  // Get strongest pillar
  const strongestPillar = sortedPillars[sortedPillars.length - 1];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-2">
            AI Readiness Report
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            {band.headline}
          </h1>
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            {band.intro}
          </p>
          
          {/* Score Badge */}
          <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur rounded-xl px-6 py-4">
            <div>
              <div className="text-sm text-slate-400">Your Score</div>
              <div className="text-4xl font-bold">{result.percentage}%</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div>
              <div className="text-sm text-slate-400">Maturity Band</div>
              <div className="text-2xl font-semibold text-amber-400">{result.band}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Pillar Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Your Readiness by Pillar
          </h2>
          <div className="grid gap-4">
            {Object.entries(result.pillarScores).map(([pillarId, score]) => {
              const percentage = (score / 5) * 100;
              const level = getScoreLevel(score);
              const colors = {
                low: "bg-red-500",
                medium: "bg-amber-500",
                high: "bg-emerald-500",
              };
              return (
                <div key={pillarId} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">
                      {pillarLabels[pillarId] || pillarId}
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                      {score.toFixed(1)} / 5
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colors[level]} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Key Insights */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Key Insights
          </h2>
          <div className="space-y-6">
            {priorityPillars.map(([pillarId, score]) => {
              const level = getScoreLevel(score);
              const insight = pillarInsights[pillarId]?.[level];
              if (!insight) return null;
              
              const borderColors = {
                low: "border-l-red-500",
                medium: "border-l-amber-500",
                high: "border-l-emerald-500",
              };
              
              return (
                <div 
                  key={pillarId} 
                  className={`bg-white rounded-lg border border-gray-200 border-l-4 ${borderColors[level]} p-6`}
                >
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    {pillarLabels[pillarId] || pillarId}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {insight.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {insight.insight}
                  </p>
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
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
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

        {/* What's Next */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Your Next Steps
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-semibold flex items-center justify-center">1</span>
                <div>
                  <div className="font-medium text-gray-900">Share this report with your leadership team</div>
                  <div className="text-gray-600 text-sm">Alignment starts with shared understanding. Use this as a conversation starter.</div>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-semibold flex items-center justify-center">2</span>
                <div>
                  <div className="font-medium text-gray-900">Focus on your lowest-scoring pillar first</div>
                  <div className="text-gray-600 text-sm">
                    For you, that&apos;s <strong>{pillarLabels[priorityPillars[0]?.[0]] || "Leadership"}</strong>. 
                    Small improvements here will have outsized impact.
                  </div>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-semibold flex items-center justify-center">3</span>
                <div>
                  <div className="font-medium text-gray-900">Book a strategy session to build your roadmap</div>
                  <div className="text-gray-600 text-sm">Get personalised guidance on turning these insights into action.</div>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">
              Ready to accelerate your AI journey?
            </h2>
            <p className="text-indigo-100 mb-6 max-w-xl mx-auto">
              Book a free 30-minute strategy session. We&apos;ll review your results together and map out your first 90 days.
            </p>
            <button className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors shadow-lg">
              Book Your Free Strategy Session
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 border-t border-gray-200 pt-8">
          <p className="mb-2">
            Prepared for <strong>{lead.name}</strong> at <strong>{lead.company}</strong>
          </p>
          <p className="mb-4">
            A PDF copy of this report has been sent to {lead.email}
          </p>
          <p className="text-xs text-gray-400">
            Report ID: {lead.reportId}
          </p>
        </footer>
      </div>
    </main>
  );
}

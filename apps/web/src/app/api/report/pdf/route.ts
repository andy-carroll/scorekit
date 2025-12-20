import PDFDocument from "pdfkit";

import { aiReadinessContent, mapAnswersToPillars, type Template } from "@scorekit/core";
import { sections, getQuestionsForSection } from "@/lib/questions";
import type { ReportRecord } from "@/lib/report-store/types";

type PdfRequestBody = {
  token: string;
  report?: ReportRecord;
};

export const runtime = "nodejs";

function renderPdf(report: ReportRecord): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 48 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", (err) => reject(err));

    // -----------------------------------------------------------------------
    // Page 1 – Summary
    // -----------------------------------------------------------------------

    doc.fontSize(22).text("AI Readiness Report", { align: "left" });
    doc.moveDown(0.5);

    doc
      .fontSize(12)
      .fillColor("#444444")
      .text(`Prepared for: ${report.lead.name} (${report.lead.email})`);
    doc.text(`Company: ${report.lead.company}`);
    doc.text(`Created: ${new Date(report.createdAt).toLocaleString()}`);
    doc.moveDown(1);

    doc.fillColor("#111111").fontSize(16).text("Summary");
    doc.moveDown(0.25);
    doc
      .fontSize(12)
      .fillColor("#111111")
      .text(`Overall score: ${report.result.percentage}%`);
    doc.text(`Maturity band: ${report.result.band}`);
    doc.moveDown(1);

    doc.fontSize(16).text("Pillar scores");
    doc.moveDown(0.25);

    // Use human-friendly pillar labels from template content where available
    const { pillarLabels } = aiReadinessContent;

    for (const [pillarId, score] of Object.entries(report.result.pillarScores)) {
      doc
        .fontSize(12)
        .fillColor("#111111")
        .text(`${pillarLabels[pillarId] || pillarId}: ${score.toFixed(1)} / 5`);
    }

    doc.moveDown(1);
    doc
      .fontSize(10)
      .fillColor("#666666")
      .text(`Report token: ${report.token}`);

    // -----------------------------------------------------------------------
    // Page 2 – Answer Appendix (grouped by pillar)
    // -----------------------------------------------------------------------

    // Build a minimal Template-shaped object from quiz sections/questions so we
    // can reuse the shared mapAnswersToPillars helper from @scorekit/core.
    const pseudoTemplate: Template = {
      id: aiReadinessContent.meta.templateId,
      version: aiReadinessContent.meta.version,
      name: aiReadinessContent.meta.templateName,
      description: "AI Readiness assessment (PDF)",
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
          headline: aiReadinessContent.landing.headline,
          subheadline: aiReadinessContent.landing.subheadline,
          valueProps: [],
          timeEstimate: "15 minutes",
          ctaText: aiReadinessContent.landing.ctaText,
        },
        report: {
          title: "AI Readiness Report",
          openingInsightTemplates: {},
          pillarDescriptions: {},
          roadmapIntro: "",
          businessCaseIntro: "",
          ctaHeadline: aiReadinessContent.cta.headline,
          ctaText: aiReadinessContent.cta.body,
        },
      },
    };

    const answers = report.answers as Record<string, number | string | string[]>;
    const mappedAnswersByPillar = mapAnswersToPillars({ template: pseudoTemplate, answers });

    if (Object.keys(mappedAnswersByPillar).length > 0) {
      doc.addPage();

      doc
        .fontSize(18)
        .fillColor("#111111")
        .text("Your answers by pillar", { align: "left" });
      doc.moveDown(0.5);

      doc
        .fontSize(10)
        .fillColor("#555555")
        .text(
          "This appendix shows the answers you provided for each question, grouped by pillar. These responses are the raw input used to calculate your readiness scores.",
          { align: "left" },
        );

      doc.moveDown(1);

      const pillarEntries = Object.values(mappedAnswersByPillar);

      for (const pillar of pillarEntries) {
        doc
          .fontSize(14)
          .fillColor("#111111")
          .text(pillarLabels[pillar.pillarId] || pillar.pillarName, { underline: false });
        doc.moveDown(0.25);

        for (const answer of pillar.answers) {
          doc
            .fontSize(11)
            .fillColor("#111111")
            .text(`• ${answer.questionText}`);
          doc
            .moveDown(0.1)
            .fontSize(10)
            .fillColor("#444444")
            .text(`  Answer: ${answer.displayAnswer}`);
          doc.moveDown(0.4);
        }

        doc.moveDown(0.8);
      }
    }

    doc.end();
  });
}

export async function POST(req: Request): Promise<Response> {
  let body: PdfRequestBody;

  try {
    body = (await req.json()) as PdfRequestBody;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body?.token) {
    return Response.json({ error: "Missing token" }, { status: 400 });
  }

  if (!body.report) {
    return Response.json(
      { error: "Missing report payload (Stage 0 requires report in request body)" },
      { status: 400 },
    );
  }

  if (body.report.token !== body.token) {
    return Response.json({ error: "Token mismatch" }, { status: 400 });
  }

  try {
    const pdfBuffer = await renderPdf(body.report);
    const pdfBytes = new Uint8Array(pdfBuffer);

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename=scorekit-report-${body.token}.pdf`,
        "cache-control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;

    console.error("Failed to generate PDF", err);

    return Response.json(
      {
        error: "Failed to generate PDF",
        message,
        ...(process.env.NODE_ENV === "development" ? { stack } : {}),
      },
      { status: 500 },
    );
  }
}

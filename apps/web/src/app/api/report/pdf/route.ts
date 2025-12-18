import PDFDocument from "pdfkit";

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

    for (const [pillarId, score] of Object.entries(report.result.pillarScores)) {
      doc
        .fontSize(12)
        .fillColor("#111111")
        .text(`${pillarId}: ${score.toFixed(1)} / 5`);
    }

    doc.moveDown(1);
    doc
      .fontSize(10)
      .fillColor("#666666")
      .text(`Report token: ${report.token}`);

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
}

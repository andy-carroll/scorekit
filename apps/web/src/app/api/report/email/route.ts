import { renderPdf } from "../pdf/route";
import { ghlClient } from "@/lib/ghl";
import type { ReportRecord } from "@/lib/report-store/types";

type EmailRequestBody = {
  token: string;
  report?: ReportRecord;
};

export const runtime = "nodejs";

export async function POST(req: Request): Promise<Response> {
  let body: EmailRequestBody;

  try {
    body = (await req.json()) as EmailRequestBody;
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
    // Step 1: Generate PDF
    const pdfBuffer = await renderPdf(body.report);
    
    // Step 2: Upload PDF to GHL
    const pdfUrl = await ghlClient.uploadFile(
      pdfBuffer,
      `scorekit-report-${body.token}.pdf`,
      "application/pdf"
    );

    // Step 3: Calculate primary constraint (lowest scoring pillar)
    const pillarEntries = Object.entries(body.report.result.pillarScores);
    const lowestPillar = pillarEntries.reduce((min, [pillarId, score]) => 
      score < min.score ? { pillarId, score } : min, 
      { pillarId: pillarEntries[0][0], score: pillarEntries[0][1] }
    );
    const primaryConstraint = lowestPillar.pillarId;

    // Step 4: Upsert contact with assessment data
    const contactData = {
      contact: {
        email: body.report.lead.email,
        name: body.report.lead.name,
        company: body.report.lead.company,
      },
      tags: [
        `score-band-${body.report.result.band.toLowerCase()}`,
        `primary-constraint-${primaryConstraint}`,
        "scorekit-assessment-completed",
      ],
      customFields: {
        scorekit_template_id: "ai-readiness",
        scorekit_overall_score: body.report.result.percentage,
        scorekit_band: body.report.result.band,
        scorekit_primary_constraint: primaryConstraint,
        scorekit_pillar_scores: JSON.stringify(body.report.result.pillarScores),
        scorekit_report_token: body.report.token,
        scorekit_pdf_url: pdfUrl,
        completed_at: new Date().toISOString(),
      },
    };

    const { contact, created } = await ghlClient.upsertContact(contactData);

    // Step 5: Trigger email workflow
    await ghlClient.triggerWorkflow(contact.id);

    // Step 6: Log success
    console.log(`[PDF-EMAIL] ${created ? 'Created' : 'Updated'} contact ${contact.id}, triggered email workflow`);

    return Response.json({
      success: true,
      contactId: contact.id,
      pdfUrl,
      workflowTriggered: true,
    });

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;

    console.error("Failed to send PDF via email", err);

    // Return success to user even if GHL fails (report still works)
    // but log the error for monitoring
    return Response.json({
      success: false,
      error: "Failed to send PDF via email",
      message,
      ...(process.env.NODE_ENV === "development" ? { stack } : {}),
    }, { 
      status: 500, // Still return 500 for monitoring, but frontend should handle gracefully
    });
  }
}

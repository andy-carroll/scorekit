import { NextRequest, NextResponse } from "next/server";
import { renderPdf } from "../pdf/route";
import { getEmailProvider } from "@/lib/email-provider";
import { getActiveTemplateContent } from "@/lib/active-template";
import type { ReportRecord } from "@/lib/report-store/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: { token: string; report: ReportRecord };

  try {
    body = (await req.json()) as { token: string; report: ReportRecord };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body?.token || !body?.report) {
    return NextResponse.json({ error: "Missing token or report" }, { status: 400 });
  }

  if (body.report.token !== body.token) {
    return NextResponse.json({ error: "Token mismatch" }, { status: 400 });
  }

  try {
    // Step 1: Generate PDF
    const pdfBuffer = await renderPdf(body.report);
    const pdfBase64 = pdfBuffer.toString("base64");

    // Step 2: Send email with PDF attachment via configured provider
    const emailProvider = getEmailProvider();
    const template = getActiveTemplateContent();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const reportUrl = `${appUrl}/report/${body.token}`;

    await emailProvider.sendEmail({
      to: { email: body.report.lead.email, name: body.report.lead.name },
      subject: `Your ${template.meta.templateName} is ready`,
      htmlBody: buildEmailHtml(body.report, reportUrl, template),
      attachments: [
        {
          name: `${template.meta.templateId}-report-${body.token.slice(0, 8)}.pdf`,
          content: pdfBase64,
          contentType: "application/pdf",
        },
      ],
    });

    console.log(`[EMAIL] Sent report ${body.token} to ${body.report.lead.email}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[EMAIL] Delivery failed:", err);
    return NextResponse.json(
      {
        error: "Email delivery failed",
        message,
        ...(process.env.NODE_ENV === "development"
          ? { stack: err instanceof Error ? err.stack : undefined }
          : {}),
      },
      { status: 500 }
    );
  }
}

function buildEmailHtml(report: ReportRecord, reportUrl: string, template: import("@scorekit/core").TemplateContent): string {
  const primaryColor = template.brand?.colors?.primary ?? "#0aadce";
  const quizName = template.meta.templateName;

  const pillarRows = Object.entries(report.result.pillarScores ?? {})
    .map(([pillarId, score]) => {
      const label = template.pillarLabels[pillarId] ?? pillarId;
      const pct = Math.round((score / 5) * 100);
      return `
        <tr>
          <td style="padding: 6px 0; color: #374151;">${escapeHtml(label)}</td>
          <td style="padding: 6px 0; text-align: right; font-weight: 600; color: ${primaryColor};">${pct}%</td>
        </tr>`;
    })
    .join("");

  return `
<!DOCTYPE html>
<html>
<body style="font-family: Inter, Arial, sans-serif; color: #111827; max-width: 600px; margin: 0 auto; padding: 0;">

  <div style="background: ${primaryColor}; padding: 24px 32px;">
    <p style="margin: 0; color: #fff; font-size: 18px; font-weight: 700;">${escapeHtml(quizName)}</p>
  </div>

  <div style="padding: 32px;">
    <h2 style="color: #111827; margin-top: 0;">Hi ${escapeHtml(report.lead.name)},</h2>
    <p style="color: #374151;">Your report is ready. Here's a summary of your results:</p>

    <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid ${primaryColor};">
      <p style="margin: 0 0 4px; font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Overall Score</p>
      <p style="margin: 0; font-size: 32px; font-weight: 700; color: ${primaryColor};">${report.result.percentage}%</p>
      <p style="margin: 8px 0 0; font-size: 15px; color: #374151;"><strong>Maturity Band:</strong> ${escapeHtml(report.result.band)}</p>
    </div>

    ${pillarRows ? `
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <thead>
        <tr><th colspan="2" style="text-align: left; padding-bottom: 8px; font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e5e7eb;">Your scores by area</th></tr>
      </thead>
      <tbody>${pillarRows}</tbody>
    </table>` : ""}

    <p style="margin: 28px 0 16px;">
      <a href="${reportUrl}" style="display: inline-block; background: ${primaryColor}; color: #fff; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 15px;">
        View Your Full Report
      </a>
    </p>
    <p style="color: #374151; font-size: 14px;">Your PDF report is also attached to this email for future reference.</p>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 28px 0;" />
    <p style="font-size: 12px; color: #9ca3af; margin: 0;">
      Prepared for ${escapeHtml(report.lead.name)} at ${escapeHtml(report.lead.company)}
    </p>
  </div>

</body>
</html>
  `.trim();
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

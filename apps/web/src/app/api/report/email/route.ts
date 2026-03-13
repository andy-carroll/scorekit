import { NextRequest, NextResponse } from "next/server";
import { renderPdf } from "../pdf/route";
import { getEmailProvider } from "@/lib/email-provider";
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
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const reportUrl = `${appUrl}/report/${body.token}`;

    await emailProvider.sendEmail({
      to: { email: body.report.lead.email, name: body.report.lead.name },
      subject: "Your AI Readiness Report",
      htmlBody: buildEmailHtml(body.report, reportUrl),
      attachments: [
        {
          name: `ai-readiness-report-${body.token.slice(0, 8)}.pdf`,
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

function buildEmailHtml(report: ReportRecord, reportUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<body style="font-family: Inter, sans-serif; color: #111827; max-width: 600px; margin: 0 auto; padding: 24px;">
  <h2 style="color: #111827;">Hi ${escapeHtml(report.lead.name)},</h2>
  <p>Your AI Readiness Report is ready. Here's your summary:</p>
  <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 16px 0;">
    <p style="margin: 0;"><strong>Overall Score:</strong> ${report.result.percentage}%</p>
    <p style="margin: 8px 0 0;"><strong>Maturity Band:</strong> ${escapeHtml(report.result.band)}</p>
  </div>
  <p>
    <a href="${reportUrl}" style="display: inline-block; background: #0aadce; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">
      View Your Full Report
    </a>
  </p>
  <p>Your PDF report is attached to this email for future reference.</p>
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
  <p style="font-size: 12px; color: #6b7280;">
    Prepared for ${escapeHtml(report.lead.name)} at ${escapeHtml(report.lead.company)}
  </p>
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

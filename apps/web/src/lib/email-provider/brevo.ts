import type { EmailProvider, SendEmailInput } from "./types";

export function createBrevoEmailProvider(): EmailProvider {
  const apiKey = process.env.BREVO_API_KEY!;
  const defaultFromEmail = process.env.EMAIL_FROM;
  const defaultFromName = process.env.EMAIL_FROM_NAME ?? "ScoreKit";

  return {
    async sendEmail(input: SendEmailInput) {
      const payload = {
        sender: {
          email: input.senderEmail ?? defaultFromEmail,
          name: input.senderName ?? defaultFromName,
        },
        to: [input.to],
        subject: input.subject,
        htmlContent: input.htmlBody,
        textContent: input.textBody,
        attachment: input.attachments?.map((a) => ({
          name: a.name,
          content: a.content,
        })),
      };

      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": apiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Brevo error ${res.status}: ${body}`);
      }
    },
  };
}

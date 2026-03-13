import type { EmailProvider } from "./types";

export function getEmailProvider(): EmailProvider {
  const provider = process.env.EMAIL_PROVIDER ?? "brevo";

  if (provider === "brevo") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createBrevoEmailProvider } = require("./brevo") as typeof import("./brevo");
    return createBrevoEmailProvider();
  }

  throw new Error(
    `Unknown EMAIL_PROVIDER: "${provider}". Supported: brevo`
  );
}

export type { EmailProvider, SendEmailInput, EmailAttachment } from "./types";

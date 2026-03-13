export interface EmailAttachment {
  name: string;
  /** Base64-encoded file content */
  content: string;
  contentType: string;
}

export interface SendEmailInput {
  to: { email: string; name: string };
  subject: string;
  htmlBody: string;
  textBody?: string;
  attachments?: EmailAttachment[];
  /** Override default sender name */
  senderName?: string;
  /** Override default sender email */
  senderEmail?: string;
}

export interface EmailProvider {
  sendEmail(input: SendEmailInput): Promise<void>;
}

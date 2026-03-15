import { getActiveTemplateContent } from "@/lib/active-template";
import { EmailGatePage } from "./EmailGatePage";

export default function EmailPage() {
  const content = getActiveTemplateContent();
  const templateId = process.env.SCOREKIT_TEMPLATE_ID ?? "ai-readiness";

  return (
    <EmailGatePage
      heading="Your results are ready!"
      subheading={`Enter your details to unlock your personalised ${content.meta.templateName}.`}
      ctaText="Get My Free Report"
      templateId={templateId}
      privacyPolicyUrl={content.legal.privacyPolicyUrl}
      consentText={content.legal.consentText}
    />
  );
}

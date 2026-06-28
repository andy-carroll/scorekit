import { describe, it, expect, afterEach, vi } from "vitest";
import { getActiveTemplateContent } from "./active-template";

describe("getActiveTemplateContent — template env resolution", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("defaults to ai-readiness when neither env var is set", () => {
    vi.stubEnv("SCOREKIT_TEMPLATE_ID", "");
    vi.stubEnv("NEXT_PUBLIC_SCOREKIT_TEMPLATE_ID", "");
    // empty string is falsy → falls back to the default
    expect(getActiveTemplateContent().meta.templateId).toBe("ai-readiness");
  });

  it("returns the active template when both env vars agree", () => {
    vi.stubEnv("SCOREKIT_TEMPLATE_ID", "ai-capability");
    vi.stubEnv("NEXT_PUBLIC_SCOREKIT_TEMPLATE_ID", "ai-capability");
    expect(getActiveTemplateContent().meta.templateId).toBe("ai-capability");
  });

  it("allows server set + client unset only when the server is the default", () => {
    vi.stubEnv("SCOREKIT_TEMPLATE_ID", "ai-readiness");
    vi.stubEnv("NEXT_PUBLIC_SCOREKIT_TEMPLATE_ID", "");
    expect(getActiveTemplateContent().meta.templateId).toBe("ai-readiness");
  });

  it("throws when the two env vars name different templates", () => {
    vi.stubEnv("SCOREKIT_TEMPLATE_ID", "ai-capability");
    vi.stubEnv("NEXT_PUBLIC_SCOREKIT_TEMPLATE_ID", "ai-readiness");
    expect(() => getActiveTemplateContent()).toThrow(/must be set to the same template/);
  });

  it("throws when the server var is set but its client twin is left unset", () => {
    vi.stubEnv("SCOREKIT_TEMPLATE_ID", "ai-capability");
    vi.stubEnv("NEXT_PUBLIC_SCOREKIT_TEMPLATE_ID", "");
    // client falls back to ai-readiness → diverges from the server → throws
    expect(() => getActiveTemplateContent()).toThrow(/Template misconfiguration/);
  });

  it("throws a clear error for an unknown template id", () => {
    vi.stubEnv("SCOREKIT_TEMPLATE_ID", "does-not-exist");
    vi.stubEnv("NEXT_PUBLIC_SCOREKIT_TEMPLATE_ID", "does-not-exist");
    expect(() => getActiveTemplateContent()).toThrow(/Unknown SCOREKIT_TEMPLATE_ID/);
  });
});

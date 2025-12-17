import type { CreateReportInput, ReportRecord, ReportStore, ReportToken } from "./types";

const STORAGE_KEY_PREFIX = "scorekit_report_";

function getStorageKey(token: ReportToken): string {
  return `${STORAGE_KEY_PREFIX}${token}`;
}

function generateToken(): ReportToken {
  const cryptoObj = globalThis.crypto;
  if (cryptoObj && "randomUUID" in cryptoObj) {
    return (cryptoObj as Crypto).randomUUID();
  }
  return `rpt_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
}

export function createLocalReportStore(): ReportStore {
  return {
    async createReport(input: CreateReportInput) {
      const token = generateToken();
      const record: ReportRecord = {
        token,
        createdAt: new Date().toISOString(),
        templateId: input.templateId,
        answers: input.answers,
        result: input.result,
        lead: input.lead,
      };

      localStorage.setItem(getStorageKey(token), JSON.stringify(record));
      return { token };
    },
    async getReport(token: ReportToken): Promise<ReportRecord | null> {
      const raw = localStorage.getItem(getStorageKey(token));
      if (!raw) return null;

      try {
        return JSON.parse(raw) as ReportRecord;
      } catch {
        return null;
      }
    },
  };
}

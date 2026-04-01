import { Redis } from "@upstash/redis";
import type { CreateReportInput, ReportRecord, ReportStore, ReportToken } from "./types";

const KEY_PREFIX = "scorekit:report:";
const TTL_SECONDS = 60 * 60 * 24 * 365; // 1 year

function generateToken(): ReportToken {
  return crypto.randomUUID();
}

export function createUpstashReportStore(): ReportStore {
  const redis = new Redis({
    url: (process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL)!,
    token: (process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN)!,
  });

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
      await redis.set(`${KEY_PREFIX}${token}`, JSON.stringify(record), {
        ex: TTL_SECONDS,
      });
      return { token };
    },

    async getReport(token: ReportToken): Promise<ReportRecord | null> {
      const raw = await redis.get<string>(`${KEY_PREFIX}${token}`);
      if (!raw) return null;
      try {
        return typeof raw === "string" ? JSON.parse(raw) : (raw as ReportRecord);
      } catch {
        return null;
      }
    },
  };
}

import type { ReportStore } from "./types";
import { createLocalReportStore } from "./local";

export function getReportStore(): ReportStore {
  // Support both manually-set var names and the names Vercel's KV integration auto-creates
  const url =
    process.env.UPSTASH_REDIS_REST_URL ??
    process.env.UPSTASH_REDIS_REST_KV_REST_API_URL ??
    process.env.KV_REST_API_URL ??
    process.env.REDIS_URL;
  if (url) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createUpstashReportStore } = require("./upstash") as typeof import("./upstash");
    return createUpstashReportStore();
  }
  return createLocalReportStore();
}

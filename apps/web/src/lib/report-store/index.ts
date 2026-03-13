import type { ReportStore } from "./types";
import { createLocalReportStore } from "./local";

export function getReportStore(): ReportStore {
  if (process.env.UPSTASH_REDIS_REST_URL) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createUpstashReportStore } = require("./upstash") as typeof import("./upstash");
    return createUpstashReportStore();
  }
  return createLocalReportStore();
}

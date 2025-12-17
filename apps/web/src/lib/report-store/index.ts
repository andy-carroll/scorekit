import type { ReportStore } from "./types";
import { createLocalReportStore } from "./local";

export function getReportStore(): ReportStore {
  return createLocalReportStore();
}

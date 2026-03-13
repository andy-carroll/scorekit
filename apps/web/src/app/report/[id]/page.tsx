import { getReportStore } from "@/lib/report-store";
import { getActiveTemplateContent } from "@/lib/active-template";
import { ReportView } from "./ReportView";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Server-side fetch (works when Upstash is configured).
  // Falls back to null in local dev (localStorage not available server-side).
  const store = getReportStore();
  const initialReport = await store.getReport(id).catch(() => null);

  const content = getActiveTemplateContent();

  return <ReportView token={id} initialReport={initialReport} content={content} />;
}

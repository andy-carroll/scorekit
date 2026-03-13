"use client";

import { useState } from "react";
import type { ReportRecord } from "@/lib/report-store/types";

interface DownloadPdfButtonProps {
  token: string;
  report: ReportRecord;
}

/**
 * Outline-style button that triggers server-side PDF generation and
 * streams the result as a file download.
 *
 * Uses `.btn-outline` — inherits the active template's --color-primary
 * automatically. Intentionally not `.btn-primary` (pink) so it reads as
 * a secondary document action rather than a conversion CTA.
 *
 * Responsive: shows icon + full label on md+, icon + "PDF" on small screens.
 */
export function DownloadPdfButton({ token, report }: DownloadPdfButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setError(null);

    try {
      const res = await fetch("/api/report/pdf", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, report }),
      });

      if (!res.ok) {
        const contentType = res.headers.get("content-type") ?? "";
        if (contentType.includes("application/json")) {
          const data = (await res.json()) as { error?: string; message?: string };
          setError(data.message ?? data.error ?? "Failed to generate PDF");
        } else {
          setError("Failed to generate PDF");
        }
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${token.slice(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleDownload}
        disabled={isDownloading}
        className="btn-outline"
        aria-label="Download PDF report"
      >
        {/* Download icon */}
        <svg
          className="w-4 h-4 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        {/* Responsive label: "Download PDF" on md+, "PDF" on mobile */}
        <span className="hidden md:inline">
          {isDownloading ? "Preparing…" : "Download PDF"}
        </span>
        <span className="md:hidden">
          {isDownloading ? "…" : "PDF"}
        </span>
      </button>
      {error && (
        <p className="text-xs text-red-600 max-w-[160px] text-right">{error}</p>
      )}
    </div>
  );
}

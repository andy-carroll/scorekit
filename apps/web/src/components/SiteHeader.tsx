import Image from "next/image";
import type { ReactNode } from "react";

interface SiteHeaderProps {
  logoPath: string;
  brandName: string;
  /**
   * Optional content rendered on the right side of the header.
   * Use this for page-level actions (e.g. a Download PDF button on the report page).
   * Leave empty for marketing/landing pages.
   *
   * @example
   * <SiteHeader
   *   logoPath="/logos/brand.svg"
   *   brandName="Brand"
   *   action={<DownloadPdfButton token={token} report={report} />}
   * />
   */
  action?: ReactNode;
}

/**
 * Sticky white top navigation bar, shared across all ScoreKit pages.
 *
 * Renders the brand logo on the left and an optional action slot on the right.
 * Padding and max-width mirror the main website's header treatment.
 *
 * Theming: background is always white (not a CSS var) so it works correctly
 * with Tailwind's opacity modifier and stays legible over any hero section.
 */
export function SiteHeader({ logoPath, brandName, action }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-surface bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <Image
          src={logoPath}
          alt={brandName}
          width={140}
          height={32}
          priority
        />
        {action && (
          <div className="flex items-center">
            {action}
          </div>
        )}
      </div>
    </header>
  );
}

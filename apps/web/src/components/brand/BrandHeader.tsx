/**
 * BrandHeader Component
 * 
 * Displays the brand logo with optional navigation.
 * Logo is configurable via theme (props override for flexibility).
 */

import Image from "next/image";
import Link from "next/link";

interface BrandHeaderProps {
  logoSrc?: string;
  logoAlt?: string;
  logoHeight?: number;
  showBackLink?: boolean;
  className?: string;
}

export function BrandHeader({
  logoSrc = "/logos/accelerator.svg",
  logoAlt = "Accelerator Solutions",
  logoHeight = 32,
  showBackLink = false,
  className = "",
}: BrandHeaderProps) {
  return (
    <header
      className={`flex items-center justify-between py-4 px-6 ${className}`}
    >
      <div className="flex items-center gap-4">
        {showBackLink && (
          <Link
            href="/"
            className="text-sm opacity-70 hover:opacity-100 transition-opacity"
            style={{ color: "var(--color-text-on-light-secondary)" }}
          >
            ← Back
          </Link>
        )}
        <Image
          src={logoSrc}
          alt={logoAlt}
          height={logoHeight}
          width={logoHeight * 4}
          className="h-auto"
          style={{ height: `${logoHeight}px`, width: "auto" }}
          priority
        />
      </div>
    </header>
  );
}

export default BrandHeader;

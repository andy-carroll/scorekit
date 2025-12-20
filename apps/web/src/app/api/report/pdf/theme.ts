import { aiReadinessContent } from "@scorekit/core";

export type PdfTheme = {
  colors: {
    pageBg: string;
    headerBg: string;
    headerText: string;
    primary: string;
    text: string;
    mutedText: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    surface: string;
  };
  logo?: {
    src?: string;
    width?: number;
    height?: number;
  };
  typography?: {
    displayFont?: string;
    bodyFont?: string;
  };
};

const defaultColors = {
  primary: "#4f46e5",
  secondary: "#0f172a",
  accent: "#22c55e",
  text: "#111827",
  mutedText: "#6b7280",
  background: "#ffffff",
  surface: "#f9fafb",
} as const;

export function buildPdfTheme(): PdfTheme {
  const brand = aiReadinessContent.brand;
  const colors = brand?.colors ?? defaultColors;

  return {
    colors: {
      pageBg: colors.background,
      headerBg: colors.secondary ?? colors.primary,
      headerText: "#e5e7eb",
      primary: colors.primary,
      text: colors.text,
      mutedText: colors.mutedText,
      border: "#e5e7eb",
      badgeBg: colors.secondary ?? colors.primary,
      badgeText: "#f9fafb",
      surface: colors.surface,
    },
    logo: {
      src: brand?.logo?.light ?? brand?.logo?.dark,
    },
    typography: brand?.typography,
  };
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getActiveTemplateContent } from "@/lib/active-template";

/**
 * Aptos — self-hosted font (Microsoft / Office 365 default, not on Google Fonts).
 * Source files: apps/web/public/fonts/Aptos*.woff2
 * Copied from: accelerator-x-website/assets/fonts/
 *
 * The CSS variable --font-aptos is injected into <html> via the className below,
 * then referenced by --font-display and --font-body in accelerator.css.
 */
const aptos = localFont({
  src: [
    {
      path: "../../public/fonts/Aptos.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Aptos-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/Aptos-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Aptos-SemiBold-Italic.woff2",
      weight: "600",
      style: "italic",
    },
    {
      path: "../../public/fonts/Aptos-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Aptos-Bold-Italic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-aptos",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const content = getActiveTemplateContent();
  const brand = content.brand;

  return {
    title: content.meta.pageTitle ?? content.meta.templateName,
    description: content.meta.description,
    ...(brand?.faviconPath && {
      icons: { icon: brand.faviconPath },
    }),
    ...(brand?.ogImageUrl && {
      openGraph: {
        images: [{ url: brand.ogImageUrl }],
        title: content.meta.pageTitle ?? content.meta.templateName,
        description: content.meta.description,
      },
      twitter: {
        card: "summary_large_image",
        images: [brand.ogImageUrl],
      },
    }),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = getActiveTemplateContent();
  const colors = content.brand?.colors;

  /**
   * Runtime CSS custom property overrides.
   *
   * This <style> tag is injected into <head> by the server component on every
   * request. It overrides the default values in accelerator.css with the
   * active template's brand config — enabling multi-tenant theming without
   * switching CSS files.
   *
   * How to add a new brand token:
   * 1. Add it to TemplateContent['brand']['colors'] in content.ts
   * 2. Add a corresponding override line here
   * 3. Add the CSS var default to accelerator.css :root
   */
  const brandStyle = colors
    ? `:root {
  --color-primary: ${colors.primary};
  ${colors.primaryHover ? `--color-primary-hover: ${colors.primaryHover};` : ""}
  ${colors.highlight ? `--color-highlight: ${colors.highlight};` : ""}
  ${colors.accentTeal ? `--color-accent-teal: ${colors.accentTeal};` : ""}
  ${colors.accentPink ? `--color-accent-pink: ${colors.accentPink};` : ""}
  ${colors.bgDark ? `--color-bg-dark: ${colors.bgDark};` : ""}
  --font-display: var(--font-aptos), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-body: var(--font-aptos), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}`
    : null;

  return (
    <html lang="en">
      <head>{brandStyle && <style dangerouslySetInnerHTML={{ __html: brandStyle }} />}</head>
      <body className={`${aptos.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

import { buildPdfTheme } from "./theme";
import PDFDocument from "pdfkit";
import fs from "node:fs";
import path from "node:path";

// TODO (Part 2 — post-launch): Replace direct aiReadinessContent import with
//   getActiveTemplateContent() from "@/lib/active-template"
//   so the PDF renderer is template-agnostic. Both this file and theme.ts need
//   the same change. Safe to do here (server-only route) but deferred until the
//   broader "questions into template" architecture work lands.
//   See docs/05-open-source/PDF-RENDERER.md for full details.
import { aiReadinessContent, mapAnswersToPillars, type Template } from "@scorekit/core";
import { sections, getQuestionsForSection } from "@/lib/questions";
import type { ReportRecord } from "@/lib/report-store/types";

type PdfRequestBody = {
  token: string;
  report?: ReportRecord;
};

export const runtime = "nodejs";

// ---------------------------------------------------------------------------
// Shared helpers (module-level so all page renderers can use them)
// ---------------------------------------------------------------------------

/**
 * Semantic bar/chip colour — mirrors the HTML report's colour logic.
 * low (≤ 2.2): red-500, medium (≤ 3.6): brand primary, high (> 3.6): emerald-500
 */
function scoreColor(score: number, primary: string): string {
  if (score <= 2.2) return "#ef4444";
  if (score <= 3.6) return primary;
  return "#10b981";
}

function toLevel(score: number): "low" | "medium" | "high" {
  if (score <= 2.2) return "low";
  if (score <= 3.6) return "medium";
  return "high";
}

function levelLabel(l: "low" | "medium" | "high"): string {
  if (l === "low") return "Needs focus";
  if (l === "medium") return "Building";
  return "Strong";
}

// ---------------------------------------------------------------------------

function buildPseudoTemplate(): Template {
  return {
    id: aiReadinessContent.meta.templateId,
    version: aiReadinessContent.meta.version,
    name: aiReadinessContent.meta.templateName,
    description: "AI Readiness assessment (PDF)",
    estimatedMinutes: 15,
    pillars: sections.map((section, index) => ({
      id: section.id,
      name: section.name,
      description: section.description,
      order: index + 1,
    })) as Template["pillars"],
    questions: sections
      .flatMap((section) =>
        getQuestionsForSection(section.id).map((q, index) => ({
          ...q,
          category: "diagnostic",
          questionType: "maturity",
          pillarId: section.id,
          order: index + 1,
        })),
      ) as Template["questions"],
    recommendations: [],
    copy: {
      landing: {
        headline: aiReadinessContent.landing.headline,
        subheadline: aiReadinessContent.landing.subheadline,
        valueProps: [],
        timeEstimate: "15 minutes",
        ctaText: aiReadinessContent.landing.ctaText,
      },
      report: {
        title: "AI Readiness Report",
        openingInsightTemplates: {},
        pillarDescriptions: {},
        roadmapIntro: "",
        businessCaseIntro: "",
        ctaHeadline: aiReadinessContent.cta.headline,
        ctaText: aiReadinessContent.cta.body,
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Page 1 — Executive Snapshot
// ---------------------------------------------------------------------------

function renderPage1ExecutiveSnapshot(
  doc: PDFKit.PDFDocument,
  report: ReportRecord,
  theme: ReturnType<typeof buildPdfTheme>,
  reportUrl: string,
) {
  const { colors } = theme;
  const { pillarLabels, bandIntros, nextSteps, cta } = aiReadinessContent;

  const pageW = doc.page.width;
  const pageH = doc.page.height;
  const pageX = doc.page.margins.left;
  const contentW = pageW - doc.page.margins.left - doc.page.margins.right;

  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
  // shorten() is kept only for UI copy that has hard layout constraints (button labels,
  // CTA headline). Narrative content (band intro, step descriptions, insights) is shown in full.
  const shorten = (s: string, maxLen: number) => (s.length <= maxLen ? s : `${s.slice(0, maxLen - 1).trimEnd()}…`);
  const fitTextToWidth = (text: string, maxWidth: number, minChars = 10) => {
    if (doc.widthOfString(text) <= maxWidth) return text;
    for (let n = text.length; n > minChars; n--) {
      const candidate = `${text.slice(0, n - 1).trimEnd()}…`;
      if (doc.widthOfString(candidate) <= maxWidth) return candidate;
    }
    return `${text.slice(0, minChars - 1).trimEnd()}…`;
  };

  const headerH = 150;
  const heroY = headerH - 52;

  doc.save().rect(0, 0, pageW, pageH).fill(colors.pageBg).restore();
  doc.save().rect(0, 0, pageW, headerH).fill(colors.headerBg).restore();

  doc
    .save()
    .fillColor(colors.primary)
    .fillOpacity(0.14)
    .moveTo(pageW - 180, 0)
    .lineTo(pageW, 0)
    .lineTo(pageW, 180)
    .closePath()
    .fill()
    .restore();

  let logoRendered = false;
  if (theme.logo?.src) {
    const rawSrc = theme.logo.src;
    const rawRelPath = rawSrc.replace(/^\//, "");

    const relCandidates: string[] = [];
    const pushRel = (rel: string | undefined) => {
      if (!rel) return;
      if (!relCandidates.includes(rel)) relCandidates.push(rel);
    };

    // Prefer a raster logo for PDFKit, even if the configured src is SVG.
    if (/\.svg$/i.test(rawRelPath)) {
      pushRel(rawRelPath.replace(/\.svg$/i, ".png"));
    }
    pushRel(rawRelPath);

    // Back-compat: if template uses /brands/{id}/logo-*.png, also try /logos/{id}.png
    const parts = rawRelPath.split("/");
    if (parts[0] === "brands" && parts.length >= 3) {
      const brandId = parts[1];
      pushRel(`logos/${brandId}.png`);
    }

    const cwd = process.cwd();
    const baseDirs = [
      path.join(cwd, "public"),
      path.join(cwd, "apps/web/public"),
      path.join(cwd, "..", "public"),
      path.join(cwd, "..", "apps/web/public"),
    ];

    for (const relPath of relCandidates) {
      for (const baseDir of baseDirs) {
        const absPath = path.join(baseDir, relPath);
        try {
          if (!fs.existsSync(absPath)) continue;
          doc.image(absPath, pageX, 28, { height: 22 });
          logoRendered = true;
          break;
        } catch {
          // ignore logo issues
        }
      }
      if (logoRendered) break;
    }

    if (!logoRendered) {
      console.warn(`[pdf] Logo not rendered. src=${rawSrc}`);
    }
  }

  const headerTextX = pageX;
  const headerTextY = logoRendered ? 58 : 34;

  doc
    .font("Helvetica-Bold")
    .fontSize(22)
    .fillColor(colors.headerText)
    .text(aiReadinessContent.meta.templateName, headerTextX, headerTextY, { width: contentW });

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor(colors.headerText)
    .text(`${report.lead.name} · ${report.lead.company}`, headerTextX, headerTextY + 28, { width: contentW });

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor(colors.headerText)
    .text("Executive snapshot", headerTextX, headerTextY + 46, { width: contentW });

  const heroX = pageX;
  const heroW = contentW;

  const leftW = 188;
  const heroPad = 18;
  const leftX = heroX + heroPad;
  const rightX = heroX + heroPad + leftW + 18;
  const rightW = heroW - (rightX - heroX) - heroPad;

  const bandLabel = report.result.band;
  const bandCopy = bandIntros[bandLabel];
  const bandHeadline = bandCopy?.headline ?? "Your AI readiness in context";
  // Full band intro — not truncated. Authored text should appear as written.
  const bandIntroText = bandCopy?.intro ?? "";

  const heroHeadlineText = shorten(bandHeadline, 110);

  // Measure hero height based on actual wrapped text
  const heroHeadlineY = heroY + 20;
  doc.font("Helvetica-Bold").fontSize(14);
  const heroHeadlineH = doc.heightOfString(heroHeadlineText, { width: rightW });

  const heroIntroY = heroHeadlineY + heroHeadlineH + 6;
  doc.font("Helvetica").fontSize(10);
  const introH = doc.heightOfString(bandIntroText, { width: rightW, lineGap: 2 });

  // Max increased to 220 to accommodate full authored intro text without clipping.
  const computedHeroH = clamp(Math.ceil(20 + heroHeadlineH + 6 + introH + 28), 140, 220);

  doc
    .save()
    .roundedRect(heroX, heroY, heroW, computedHeroH, 14)
    .fillAndStroke(colors.surface, colors.border)
    .restore();

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor(colors.mutedText)
    .text("OVERALL READINESS", leftX, heroY + 18);

  doc
    .font("Helvetica-Bold")
    .fontSize(44)
    .fillColor(colors.text)
    .text(`${report.result.percentage}%`, leftX, heroY + 34);

  doc.font("Helvetica-Bold").fontSize(10);
  const pillPadX = 10;
  const pillPadY = 6;
  const pillW = clamp(doc.widthOfString(bandLabel) + pillPadX * 2, 80, leftW);
  const pillH = 10 + pillPadY * 2;
  const pillX = leftX;
  const pillY = heroY + computedHeroH - pillH - 16;

  doc.save().roundedRect(pillX, pillY, pillW, pillH, 999).fill(colors.headerBg).restore();
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor(colors.headerText)
    .text(bandLabel, pillX + pillPadX, pillY + 6);

  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .fillColor(colors.text)
    .text(heroHeadlineText, rightX, heroHeadlineY, { width: rightW });

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor(colors.mutedText)
    .text(bandIntroText, rightX, heroIntroY, { width: rightW, lineGap: 2 });

  const gridTopY = heroY + computedHeroH + 26;
  const gutter = 24;
  const colW = (contentW - gutter) / 2;
  const col1X = pageX;
  const col2X = pageX + colW + gutter;

  const pillLabelFor = (pillarId: string) => pillarLabels[pillarId] || pillarId;
  const pillarEntries = Object.entries(report.result.pillarScores).map(([pillarId, score]) => ({ pillarId, score }));
  pillarEntries.sort((a, b) => a.score - b.score);
  const weakest = pillarEntries[0];
  const strongest = pillarEntries[pillarEntries.length - 1];

  const drawSectionLabel = (x: number, y: number, label: string) => {
    doc.font("Helvetica-Bold").fontSize(10).fillColor(colors.mutedText).text(label.toUpperCase(), x, y);
  };

  const drawDivider = (y: number) => {
    doc.save().moveTo(pageX, y).lineTo(pageX + contentW, y).lineWidth(1).stroke(colors.border).restore();
  };

  drawSectionLabel(col1X, gridTopY, "Next steps");

  let leftY = gridTopY + 18;

  if (strongest && weakest) {
    doc.font("Helvetica").fontSize(10).fillColor(colors.text);
    const strengthText = `Strength: ${pillLabelFor(strongest.pillarId)} (${strongest.score.toFixed(1)}/5)`;
    const oppText = `Opportunity: ${pillLabelFor(weakest.pillarId)} (${weakest.score.toFixed(1)}/5)`;

    const strengthH = doc.heightOfString(strengthText, { width: colW });
    doc.text(strengthText, col1X, leftY, { width: colW });
    leftY += strengthH + 4;

    const oppH = doc.heightOfString(oppText, { width: colW });
    doc.text(oppText, col1X, leftY, { width: colW });
    leftY += oppH + 10;
  }

  // Show all next steps (HTML parity — no arbitrary slice).
  for (let i = 0; i < nextSteps.length; i++) {
    const step = nextSteps[i];

    const textX = col1X + 28;
    const textW = colW - 28;
    const titleY = leftY + 2;

    doc.font("Helvetica-Bold").fontSize(11);
    const titleH = doc.heightOfString(step.title, { width: textW, lineGap: 2 });

    // Step 2 (index 1): inject the weakest pillar name to personalise the description,
    // matching the HTML report's dynamic text ("For you, that's [pillar]. ...").
    const descText =
      i === 1 && weakest
        ? `For you, that's ${pillLabelFor(weakest.pillarId)}. ${step.description}`
        : step.description;

    doc.font("Helvetica").fontSize(10);
    const descY = titleY + titleH + 4;
    const descH = doc.heightOfString(descText, { width: textW, lineGap: 2 });

    const blockH = Math.max(24, titleH + 4 + descH);

    doc.save().circle(col1X + 10, leftY + 10, 10).fill(colors.accent).restore();
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(colors.badgeText)
      .text(String(i + 1), col1X + 7.5, leftY + 6.5);

    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor(colors.text)
      .text(step.title, textX, titleY, { width: textW, lineGap: 2 });

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(colors.mutedText)
      .text(descText, textX, descY, { width: textW, lineGap: 2 });

    leftY += blockH + 14;
  }

  drawSectionLabel(col2X, gridTopY, "Readiness by pillar");
  let rightY = gridTopY + 18;

  const orderedPillars = Object.keys(pillarLabels);
  const barW = colW;
  const barH = 8;

  // Colour-coded bars matching the HTML report: red (low), primary (medium), emerald (high).
  for (const pillarId of orderedPillars) {
    const score = report.result.pillarScores[pillarId] ?? 0;
    const barColor = scoreColor(score, colors.primary);

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(colors.text)
      .text(pillLabelFor(pillarId), col2X, rightY, { width: colW - 60 });
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(colors.mutedText)
      .text(`${score.toFixed(1)}/5`, col2X + colW - 56, rightY, { width: 56, align: "right" });

    const barY = rightY + 16;
    doc.save().roundedRect(col2X, barY, barW, barH, 4).fill(colors.pageBg).stroke(colors.border).restore();
    doc.save().roundedRect(col2X, barY, barW * clamp(score / 5, 0, 1), barH, 4).fill(barColor).restore();

    rightY += 34;
  }

  const bodyBottomY = Math.max(leftY, rightY) + 16;
  drawDivider(bodyBottomY);

  const bottomY = pageH - doc.page.margins.bottom;
  drawCtaCard(doc, theme, bodyBottomY + 18, bottomY, () => {});

  // Footer is now drawn globally across all pages — see drawGlobalFooters().
}

// ---------------------------------------------------------------------------
// Shared CTA card — used on both the insights page and the final appendix page
// ---------------------------------------------------------------------------

/**
 * Draws a CTA card: headline + body text, then a centred square-edged button.
 * Handles pagination — adds a new page if there isn't enough room.
 * Returns the Y position immediately after the card.
 */
function drawCtaCard(
  doc: PDFKit.PDFDocument,
  theme: ReturnType<typeof buildPdfTheme>,
  cursorY: number,
  bottomY: number,
  onNewPage: () => void,
): number {
  const { colors } = theme;
  const { cta } = aiReadinessContent;
  const pageX = doc.page.margins.left;
  const contentW = doc.page.width - doc.page.margins.left - doc.page.margins.right;

  const ctaPad = 20;
  const innerW = contentW - ctaPad * 2;
  const buttonW = 240;
  const buttonH = 32;

  doc.font("Helvetica-Bold").fontSize(15);
  const headlineH = doc.heightOfString(cta.headline, { width: innerW });

  doc.font("Helvetica").fontSize(10);
  const bodyH = doc.heightOfString(cta.body, { width: innerW, lineGap: 2 });

  const ctaH = Math.ceil(ctaPad + headlineH + 8 + bodyH + 16 + buttonH + ctaPad);

  let y = cursorY;
  if (y + ctaH > bottomY) {
    doc.addPage();
    onNewPage();
    y = doc.page.margins.top + 20;
  }

  // Background card
  doc.save().roundedRect(pageX, y, contentW, ctaH, 14).fill(colors.headerBg).restore();

  // Headline
  doc
    .font("Helvetica-Bold")
    .fontSize(15)
    .fillColor(colors.headerText)
    .text(cta.headline, pageX + ctaPad, y + ctaPad, { width: innerW });

  // Body
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor(colors.headerText)
    .text(cta.body, pageX + ctaPad, y + ctaPad + headlineH + 8, { width: innerW, lineGap: 2 });

  // Centred square-edged button
  const buttonX = pageX + Math.floor((contentW - buttonW) / 2);
  const buttonY = y + ctaH - ctaPad - buttonH;

  doc.save().roundedRect(buttonX, buttonY, buttonW, buttonH, 6).fill(colors.primary).restore();
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor(colors.badgeText)
    .text(cta.buttonText, buttonX + 12, buttonY + 10, { width: buttonW - 24, align: "center" });

  if (cta.url) {
    doc.link(pageX, y, contentW, ctaH, cta.url);
  }

  return y + ctaH;
}

// ---------------------------------------------------------------------------
// Page 2 — Insights & Recommendations
// ---------------------------------------------------------------------------

function renderPage2InsightsAndRecommendations(
  doc: PDFKit.PDFDocument,
  report: ReportRecord,
  theme: ReturnType<typeof buildPdfTheme>,
  reportUrl: string,
) {
  const { colors } = theme;
  const { pillarLabels, pillarInsights, recommendations, cta } = aiReadinessContent;

  const pageW = doc.page.width;
  const pageH = doc.page.height;
  const pageX = doc.page.margins.left;
  const contentW = pageW - doc.page.margins.left - doc.page.margins.right;
  const bottomMarginY = pageH - doc.page.margins.bottom;

  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
  const shorten = (s: string, maxLen: number) => (s.length <= maxLen ? s : `${s.slice(0, maxLen - 1).trimEnd()}…`);
  const pillLabelFor = (pillarId: string) => pillarLabels[pillarId] || pillarId;

  const pillarEntries = Object.entries(report.result.pillarScores).map(([pillarId, score]) => ({ pillarId, score }));
  pillarEntries.sort((a, b) => a.score - b.score);
  // Show the bottom 3 focus pillars (HTML parity — was 2 previously).
  const focus = pillarEntries.slice(0, 3);
  const strongest = pillarEntries[pillarEntries.length - 1];

  const drawPageHeader = () => {
    doc.save().rect(0, 0, pageW, 120).fill(colors.headerBg).restore();
    doc
      .save()
      .fillColor(colors.primary)
      .fillOpacity(0.14)
      .moveTo(pageW - 160, 0)
      .lineTo(pageW, 0)
      .lineTo(pageW, 160)
      .closePath()
      .fill()
      .restore();
    doc
      .font("Helvetica-Bold")
      .fontSize(20)
      .fillColor(colors.headerText)
      .text("Insights & Recommendations", pageX, 44, { width: contentW });
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(colors.headerText)
      .text("The most valuable actions to take in the next 30–90 days", pageX, 72, { width: contentW });
  };

  doc.addPage();
  drawPageHeader();

  let cursorY = 140;

  // Strength callout — expanded to include insight text and score chip (HTML parity).
  if (strongest) {
    const level = toLevel(strongest.score);
    const strengthInsightText = pillarInsights[strongest.pillarId]?.[level]?.insight ?? "";

    const innerX = pageX + 18;
    const innerW = contentW - 36;

    // Score chip (same style as focus cards for visual consistency)
    const strongChipText = `${strongest.score.toFixed(1)}/5 · ${levelLabel(level)}`;
    doc.font("Helvetica-Bold").fontSize(10);
    const strongChipW = clamp(doc.widthOfString(strongChipText) + 20, 90, 150);

    doc.font("Helvetica-Bold").fontSize(14);
    const strongTitleH = doc.heightOfString(pillLabelFor(strongest.pillarId), {
      width: innerW - (strongChipW + 12),
    });

    doc.font("Helvetica").fontSize(10);
    const insightH = strengthInsightText
      ? doc.heightOfString(strengthInsightText, { width: innerW, lineGap: 2 })
      : 0;

    // Dynamic height: label + title + optional insight + padding
    const strengthCardH = Math.ceil(16 + 14 + strongTitleH + 6 + (insightH > 0 ? insightH + 14 : 10));

    doc
      .save()
      .roundedRect(pageX, cursorY, contentW, strengthCardH, 14)
      .fillAndStroke(colors.surface, colors.border)
      .restore();
    // Accent left stripe (matches HTML's emerald callout styling).
    doc.save().roundedRect(pageX, cursorY, 8, strengthCardH, 14).fill("#10b981").restore();

    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(colors.mutedText)
      .text("STRENGTH", innerX, cursorY + 16);

    const strongTitleY = cursorY + 32;
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor(colors.text)
      .text(pillLabelFor(strongest.pillarId), innerX, strongTitleY, {
        width: innerW - (strongChipW + 12),
      });

    // Score chip — top-right of the card, aligned with the label row
    const strongChipH = 22;
    const strongChipX = pageX + contentW - strongChipW - 18;
    const strongChipY = cursorY + 14;
    doc
      .save()
      .strokeOpacity(0.16)
      .lineWidth(1)
      .roundedRect(strongChipX, strongChipY, strongChipW, strongChipH, 999)
      .fillAndStroke(colors.pageBg, colors.secondary)
      .restore();
    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor(colors.mutedText)
      .text(strongChipText, strongChipX + 10, strongChipY + 6, {
        width: strongChipW - 20,
        align: "center",
      });

    if (strengthInsightText) {
      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor(colors.mutedText)
        .text(strengthInsightText, innerX, strongTitleY + strongTitleH + 6, {
          width: innerW,
          lineGap: 2,
        });
    }

    cursorY += strengthCardH + 18;
  }

  // Focus area cards — one per bottom-3 pillar, with pagination if needed.
  // IMPORTANT: We compute RELATIVE offsets first (independent of position),
  // then check pagination, then compute ABSOLUTE y-positions from the FINAL
  // cursorY. This avoids the bug where y-positions computed from a pre-pagination
  // cursorY become invalid after a page break resets cursorY.
  for (const p of focus) {
    const level = toLevel(p.score);
    const insight = pillarInsights[p.pillarId]?.[level];
    const rec = recommendations[p.pillarId];

    const innerX = pageX + 18;
    const innerW = contentW - 36;
    const titleText = pillLabelFor(p.pillarId);
    const insightTitleText = insight?.title ?? "";
    const insightBodyText = insight?.insight ?? "";

    const chipText = `${p.score.toFixed(1)}/5 · ${levelLabel(level)}`;
    doc.font("Helvetica-Bold").fontSize(10);
    const chipW = clamp(doc.widthOfString(chipText) + 20, 90, 150);

    // --- Step 1: Measure text heights (position-independent) ---
    doc.font("Helvetica-Bold").fontSize(14);
    const titleH = doc.heightOfString(titleText, { width: innerW - (chipW + 12) });

    doc.font("Helvetica").fontSize(10);
    const insightTitleH = doc.heightOfString(insightTitleText, { width: innerW });

    doc.font("Helvetica").fontSize(10);
    const insightBodyH = doc.heightOfString(insightBodyText, { width: innerW, lineGap: 2 });

    // --- Step 2: Compute RELATIVE offsets from card top ---
    // No progress bar — the score chip + accent stripe already communicate level.
    const relLabel = 16;
    const relTitle = relLabel + 16;
    const relInsightTitle = relTitle + titleH + 6;
    const relInsightBody = relInsightTitle + insightTitleH + 6;
    const relRec = relInsightBody + insightBodyH + 12;
    const cardH = Math.ceil(relRec + 40);

    // --- Step 3: Pagination check (may reset cursorY) ---
    if (cursorY + cardH > bottomMarginY - 8) {
      doc.addPage();
      drawPageHeader();
      cursorY = 140;
    }

    // --- Step 4: Compute ABSOLUTE positions from FINAL cursorY ---
    const yLabel = cursorY + relLabel;
    const yTitle = cursorY + relTitle;
    const yInsightTitle = cursorY + relInsightTitle;
    const yInsightBody = cursorY + relInsightBody;
    const yRec = cursorY + relRec;

    const accentColor = scoreColor(p.score, colors.primary);

    doc.save().roundedRect(pageX, cursorY, contentW, cardH, 14).fillAndStroke(colors.surface, colors.border).restore();
    doc.save().roundedRect(pageX, cursorY, 8, cardH, 14).fill(accentColor).restore();

    doc.font("Helvetica-Bold").fontSize(10).fillColor(colors.mutedText).text("FOCUS AREA", innerX, yLabel);

    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor(colors.text)
      .text(titleText, innerX, yTitle, { width: innerW - (chipW + 12), lineGap: 2 });

    const chipH = 22;
    const chipX = pageX + contentW - chipW - 18;
    const chipY = yLabel - 2; // Align with the label row, not the title
    doc
      .save()
      .strokeOpacity(0.16)
      .lineWidth(1)
      .roundedRect(chipX, chipY, chipW, chipH, 999)
      .fillAndStroke(colors.pageBg, colors.secondary)
      .restore();
    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor(colors.mutedText)
      .text(chipText, chipX + 10, chipY + 6, { width: chipW - 20, align: "center" });

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(colors.mutedText)
      .text(insightTitleText, innerX, yInsightTitle, { width: innerW });

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(colors.text)
      .text(insightBodyText, innerX, yInsightBody, { width: innerW, lineGap: 2 });

    doc
      .save()
      .strokeOpacity(0.12)
      .lineWidth(1)
      .roundedRect(innerX, yRec, innerW, 30, 10)
      .fillAndStroke(colors.pageBg, colors.secondary)
      .restore();
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(colors.text)
      .text(rec?.headline ?? "Recommendation", innerX + 12, yRec + 9, { width: innerW - 24 });
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(colors.mutedText)
      .text(rec?.action ?? "", innerX + 12, yRec + 20, { width: innerW - 24 });

    cursorY += cardH + 18;
  }

  // CTA — shared design via drawCtaCard
  drawCtaCard(doc, theme, cursorY, bottomMarginY, () => { drawPageHeader(); });
}

// ---------------------------------------------------------------------------
// Page 3+ — Answer Appendix
// ---------------------------------------------------------------------------

/**
 * Renders the answer appendix pages and returns the final cursorY position
 * so the caller can append a CTA block after the last pillar group.
 */
function renderPage3AnswerAppendix(
  doc: PDFKit.PDFDocument,
  theme: ReturnType<typeof buildPdfTheme>,
  mappedAnswersByPillar: ReturnType<typeof mapAnswersToPillars>,
  pillarScores?: Record<string, number>,
): number {
  const { colors } = theme;
  const { pillarLabels } = aiReadinessContent;

  if (Object.keys(mappedAnswersByPillar).length === 0) {
    return 140;
  }

  const pageW = doc.page.width;
  const pageH = doc.page.height;
  const pageX = doc.page.margins.left;
  const contentW = pageW - doc.page.margins.left - doc.page.margins.right;
  const bottomY = pageH - doc.page.margins.bottom;

  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

  const drawHeader = (subtitle: string) => {
    doc.save().rect(0, 0, pageW, 120).fill(colors.headerBg).restore();
    doc
      .save()
      .fillColor(colors.primary)
      .fillOpacity(0.14)
      .moveTo(pageW - 160, 0)
      .lineTo(pageW, 0)
      .lineTo(pageW, 160)
      .closePath()
      .fill()
      .restore();

    doc
      .font("Helvetica-Bold")
      .fontSize(20)
      .fillColor(colors.headerText)
      .text("Answer Appendix", pageX, 44, { width: contentW });

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(colors.headerText)
      .text(subtitle, pageX, 72, { width: contentW });
  };

  const ensureSpace = (neededHeight: number, cursorY: number, sectionSubtitle: string) => {
    if (cursorY + neededHeight <= bottomY - 12) return cursorY;
    doc.addPage();
    drawHeader(sectionSubtitle);
    return 140;
  };

  // Split pillars into scored (diagnostic) and unscored (context/profile) groups.
  const allPillars = Object.values(mappedAnswersByPillar);
  const scoredPillars = allPillars.filter((p) => pillarScores && p.pillarId in pillarScores);
  const contextPillars = allPillars.filter((p) => !pillarScores || !(p.pillarId in pillarScores));

  // Compact table-row layout: one card per pillar containing all Q&A rows with thin
  // dividers — matches the HTML report's dense, scannable format.
  const renderPillarGroup = (pillars: typeof allPillars, isScored: boolean, sectionSubtitle: string, cursorY: number) => {
    let y = cursorY;

    for (const pillar of pillars) {
      const pillarTitle = pillarLabels[pillar.pillarId] || pillar.pillarName;
      const score = isScored ? pillarScores?.[pillar.pillarId] : undefined;
      const scoreText = typeof score === "number" ? `${score.toFixed(1)} / 5` : undefined;
      const accentColor = isScored && typeof score === "number" ? scoreColor(score, colors.primary) : colors.accent;

      // --- Pillar header bar ---
      y = ensureSpace(40, y, sectionSubtitle);
      const headerH = 32;
      doc
        .save()
        .roundedRect(pageX, y, contentW, headerH, 8)
        .fill(colors.surface)
        .restore();
      doc.save().rect(pageX, y, 6, headerH).fill(accentColor).restore();

      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor(colors.text)
        .text(pillarTitle, pageX + 16, y + 10, { width: contentW - 120 });

      if (scoreText) {
        doc
          .font("Helvetica")
          .fontSize(9)
          .fillColor(colors.mutedText)
          .text(scoreText, pageX + contentW - 80, y + 10, { width: 68, align: "right" });
      }

      y += headerH + 2;

      // --- Q&A rows (compact, tight spacing) ---
      for (let qi = 0; qi < pillar.answers.length; qi++) {
        const answer = pillar.answers[qi];
        const qText = answer.questionText;
        const aText = answer.displayAnswer;

        doc.font("Helvetica").fontSize(9);
        const qH = doc.heightOfString(qText, { width: contentW - 32 });
        doc.font("Helvetica-Bold").fontSize(9);
        const aH = doc.heightOfString(aText, { width: contentW - 32 });

        const rowH = Math.ceil(6 + qH + 2 + aH + 6);
        y = ensureSpace(rowH + 2, y, sectionSubtitle);

        // Question text (muted, small)
        doc
          .font("Helvetica")
          .fontSize(9)
          .fillColor(colors.mutedText)
          .text(qText, pageX + 16, y + 6, { width: contentW - 32 });

        // Answer text (bold, darker)
        doc
          .font("Helvetica-Bold")
          .fontSize(9)
          .fillColor(colors.text)
          .text(aText, pageX + 16, y + 6 + qH + 2, { width: contentW - 32 });

        y += rowH;

        // Thin divider between rows (except after the last row)
        if (qi < pillar.answers.length - 1) {
          doc
            .save()
            .moveTo(pageX + 16, y)
            .lineTo(pageX + contentW - 16, y)
            .lineWidth(0.5)
            .strokeOpacity(0.3)
            .stroke(colors.border)
            .restore();
          y += 1;
        }
      }

      y += 14; // gap between pillar groups
    }

    return y;
  };

  // --- Scored pillars section ---
  if (scoredPillars.length > 0) {
    const scoredSubtitle = "Your answers to the scored questions — the inputs used to calculate your readiness scores.";
    doc.addPage();
    drawHeader(scoredSubtitle);

    let y = 140;

    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor(colors.text)
      .text("How we calculated your scores", pageX, y);
    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor(colors.mutedText)
      .text(scoredSubtitle, pageX, y + 14, { width: contentW });
    y += 34;

    y = renderPillarGroup(scoredPillars, true, scoredSubtitle, y);

    // --- Context/Profile section ---
    if (contextPillars.length > 0) {
      const profileSubtitle = "The context you provided at the start of the assessment.";

      if (y + 120 > bottomY) {
        doc.addPage();
        drawHeader(profileSubtitle);
        y = 140;
      } else {
        y += 10;
      }

      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .fillColor(colors.text)
        .text("Your Profile", pageX, y);
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(colors.mutedText)
        .text(profileSubtitle, pageX, y + 14, { width: contentW });
      y += 34;

      y = renderPillarGroup(contextPillars, false, profileSubtitle, y);
    }

    return y;
  } else {
    const subtitle = "Your answers, grouped by pillar.";
    doc.addPage();
    drawHeader(subtitle);
    return renderPillarGroup(allPillars, false, subtitle, 140);
  }
}

// ---------------------------------------------------------------------------
// Main renderer
// ---------------------------------------------------------------------------

/**
 * Draws the CTA block at the end of the answer appendix — a compelling
 * "book a call" prompt so the PDF doesn't just trail off after raw answers.
 */
function renderFinalCta(
  doc: PDFKit.PDFDocument,
  theme: ReturnType<typeof buildPdfTheme>,
  cursorY: number,
) {
  const pageH = doc.page.height;
  const bottomY = pageH - doc.page.margins.bottom;
  drawCtaCard(doc, theme, cursorY + 10, bottomY, () => {});
}

/**
 * Draws a consistent footer bar on every page: report URL link + page number.
 * Called once after all content is rendered — iterates over the buffered pages
 * using pdfkit's page switching API.
 */
function drawGlobalFooters(
  doc: PDFKit.PDFDocument,
  theme: ReturnType<typeof buildPdfTheme>,
  report: ReportRecord,
  reportUrl: string,
) {
  const { colors } = theme;
  const totalPages = doc.bufferedPageRange().count;

  for (let i = 0; i < totalPages; i++) {
    doc.switchToPage(i);

    const pageW = doc.page.width;
    const pageH = doc.page.height;
    const pageX = doc.page.margins.left;
    const contentW = pageW - doc.page.margins.left - doc.page.margins.right;

    // Draw the footer IN the bottom margin area (below the content boundary).
    // pdfkit auto-flows text to a new page when y >= (pageH - bottomMargin),
    // so we temporarily zero the bottom margin while drawing the footer, then
    // restore it. This keeps footer rendering completely independent of content.
    const savedBottomMargin = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;
    const footerY = pageH - 30;

    // Thin divider line above the footer
    doc
      .save()
      .moveTo(pageX, footerY - 4)
      .lineTo(pageX + contentW, footerY - 4)
      .lineWidth(0.5)
      .strokeOpacity(0.3)
      .stroke(colors.border)
      .restore();

    // Left side: two-part footer — prefix in muted grey, link in primary colour.
    // Rendered as two separate .text() calls at explicit x positions to avoid
    // `continued` (spawns overflow pages) and `widthOfString` (returns NaN)
    // after switchToPage(). Positions are estimated from font metrics at 7.5pt.
    // IMPORTANT: All text calls use lineBreak: false to prevent pdfkit from
    // creating overflow pages when drawing on buffered pages via switchToPage().
    const footerPrefix = `Prepared for ${report.lead.name}, ${report.lead.company}  ·  `;
    const footerLink = "View full report online  >";
    // At Helvetica 7.5pt, average char width ≈ 3.6pt. Estimate prefix width:
    const estPrefixW = footerPrefix.length * 3.6;
    const estLinkW = footerLink.length * 3.6;
    doc
      .font("Helvetica")
      .fontSize(7.5)
      .fillColor(colors.mutedText)
      .text(footerPrefix, pageX, footerY, { lineBreak: false });
    doc
      .font("Helvetica")
      .fontSize(7.5)
      .fillColor(colors.primary)
      .text(footerLink, pageX + estPrefixW, footerY, { lineBreak: false });

    // Clickable hyperlink overlay covering the "View full report online ↗" text
    doc.link(pageX + estPrefixW, footerY - 2, estLinkW + 10, 14, reportUrl);

    // Right side: page number
    const pageLabel = `${i + 1} / ${totalPages}`;
    doc
      .font("Helvetica")
      .fontSize(7.5)
      .fillColor(colors.mutedText)
      .text(pageLabel, pageX + contentW - 50, footerY, {
        width: 50,
        align: "right",
        lineBreak: false,
      });

    // Restore the bottom margin so future operations (if any) see original margins.
    doc.page.margins.bottom = savedBottomMargin;
  }
}

export async function renderPdf(report: ReportRecord): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    // bufferPages: true enables page switching after all content is rendered,
    // which is required for drawing footers on every page.
    const doc = new PDFDocument({ size: "A4", margin: 48, bufferPages: true });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", (err) => reject(err));

    const theme = buildPdfTheme();

    // Compute the shareable URL for this report. Used in footer and CTA hyperlinks.
    const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
    const reportUrl = `${appUrl}/report/${report.token}`;

    // Page 1 — Executive snapshot
    renderPage1ExecutiveSnapshot(doc, report, theme, reportUrl);

    // Page 2 — Insights & recommendations (may overflow to page 3 with 3 focus cards)
    renderPage2InsightsAndRecommendations(doc, report, theme, reportUrl);

    // Answer appendix — scored Q&A then context/profile, with automatic pagination
    const pseudoTemplate: Template = buildPseudoTemplate();
    const answers = report.answers as Record<string, number | string | string[]>;
    const mappedAnswersByPillar = mapAnswersToPillars({ template: pseudoTemplate, answers });

    const finalY = renderPage3AnswerAppendix(doc, theme, mappedAnswersByPillar, report.result.pillarScores);

    // Final CTA — compelling "book a call" prompt at the end of the document.
    // Ensures the PDF doesn't trail off after raw answers with no call to action.
    renderFinalCta(doc, theme, finalY);

    // Global footers — report URL link + page numbers on every page.
    // Must be called after all content pages are created (uses page switching).
    drawGlobalFooters(doc, theme, report, reportUrl);

    doc.end();
  });
}

// ---------------------------------------------------------------------------
// HTTP handler
// ---------------------------------------------------------------------------

export async function POST(req: Request): Promise<Response> {
  let body: PdfRequestBody;

  try {
    body = (await req.json()) as PdfRequestBody;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body?.token) {
    return Response.json({ error: "Missing token" }, { status: 400 });
  }

  if (!body.report) {
    return Response.json(
      { error: "Missing report payload (Stage 0 requires report in request body)" },
      { status: 400 },
    );
  }

  if (body.report.token !== body.token) {
    return Response.json({ error: "Token mismatch" }, { status: 400 });
  }

  try {
    const pdfBuffer = await renderPdf(body.report);
    const pdfBytes = new Uint8Array(pdfBuffer);

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename=scorekit-report-${body.token}.pdf`,
        "cache-control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;

    console.error("Failed to generate PDF", err);

    return Response.json(
      {
        error: "Failed to generate PDF",
        message,
        ...(process.env.NODE_ENV === "development" ? { stack } : {}),
      },
      { status: 500 },
    );
  }
}

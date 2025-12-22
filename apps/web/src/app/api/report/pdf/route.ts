import { buildPdfTheme } from "./theme";
import PDFDocument from "pdfkit";
import fs from "node:fs";
import path from "node:path";

import { aiReadinessContent, mapAnswersToPillars, type Template } from "@scorekit/core";
import { sections, getQuestionsForSection } from "@/lib/questions";
import type { ReportRecord } from "@/lib/report-store/types";

type PdfRequestBody = {
  token: string;
  report?: ReportRecord;
};

export const runtime = "nodejs";

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

function renderPage1ExecutiveSnapshot(
  doc: PDFKit.PDFDocument,
  report: ReportRecord,
  theme: ReturnType<typeof buildPdfTheme>,
) {
  const { colors } = theme;
  const { pillarLabels, bandIntros, nextSteps, cta } = aiReadinessContent;

  const pageW = doc.page.width;
  const pageH = doc.page.height;
  const pageX = doc.page.margins.left;
  const contentW = pageW - doc.page.margins.left - doc.page.margins.right;

  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
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
          // ignore logo issues for now
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
  const bandIntro = bandCopy?.intro ?? "";

  const heroHeadlineText = shorten(bandHeadline, 110);
  const heroIntroText = shorten(bandIntro, 340);

  // Measure hero height based on actual wrapped text
  const heroHeadlineY = heroY + 20;
  doc.font("Helvetica-Bold").fontSize(14);
  const heroHeadlineH = doc.heightOfString(heroHeadlineText, { width: rightW });

  const heroIntroY = heroHeadlineY + heroHeadlineH + 6;
  doc.font("Helvetica").fontSize(10);
  const introH = doc.heightOfString(heroIntroText, { width: rightW, lineGap: 2 });

  const computedHeroH = clamp(Math.ceil(20 + heroHeadlineH + 6 + introH + 28), 140, 200);

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
    .text(heroIntroText, rightX, heroIntroY, { width: rightW, lineGap: 2 });

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

  const steps = nextSteps.slice(0, 3);
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];

    const textX = col1X + 28;
    const textW = colW - 28;
    const titleY = leftY + 2;

    doc.font("Helvetica-Bold").fontSize(11);
    const titleH = doc.heightOfString(step.title, { width: textW, lineGap: 2 });

    doc.font("Helvetica").fontSize(10);
    const descText = shorten(step.description, 140);
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

  for (const pillarId of orderedPillars) {
    const score = report.result.pillarScores[pillarId] ?? 0;
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
    doc.save().roundedRect(col2X, barY, barW * clamp(score / 5, 0, 1), barH, 4).fill(colors.primary).restore();

    rightY += 34;
  }

  const bodyBottomY = Math.max(leftY, rightY) + 16;
  drawDivider(bodyBottomY);

  const ctaY = bodyBottomY + 18;
  const footerY = pageH - doc.page.margins.bottom - 18;
  const ctaH = clamp(Math.min(120, footerY - ctaY - 10), 76, 120);

  doc.save().roundedRect(pageX, ctaY, contentW, ctaH, 14).fill(colors.headerBg).restore();
  const ctaPad = 18;
  const buttonW = 220;
  const buttonH = 34;
  const buttonX = pageX + contentW - buttonW - ctaPad;
  const buttonY = ctaY + Math.max(12, Math.floor((ctaH - buttonH) / 2));

  const ctaTextX = pageX + ctaPad;
  const ctaTextW = contentW - buttonW - ctaPad * 3;
  const ctaHeadlineY = ctaY + 16;

  doc.font("Helvetica-Bold").fontSize(14).fillColor(colors.headerText);
  const headlineText = shorten(cta.headline, 70);
  const ctaHeadlineH = doc.heightOfString(headlineText, { width: ctaTextW });
  doc.text(headlineText, ctaTextX, ctaHeadlineY, { width: ctaTextW });

  const ctaBodyY = ctaHeadlineY + ctaHeadlineH + 6;
  doc.font("Helvetica").fontSize(10).fillColor(colors.headerText);
  const bodyText = shorten(cta.body, 150);
  doc.text(bodyText, ctaTextX, ctaBodyY, { width: ctaTextW, lineGap: 2 });

  doc.save().roundedRect(buttonX, buttonY, buttonW, buttonH, 999).fill(colors.primary).restore();
  doc.font("Helvetica-Bold").fontSize(9);
  const buttonLabel = fitTextToWidth(cta.buttonText, buttonW - 20, 14);
  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor(colors.badgeText)
    .text(buttonLabel, buttonX + 10, buttonY + 11, { width: buttonW - 20, align: "center" });

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor(colors.mutedText)
    .text(
      `Prepared for ${report.lead.name}, ${report.lead.company} • Report token: ${report.token}`,
      pageX,
      pageH - doc.page.margins.bottom - 18,
      { width: contentW },
    );
}

function renderPage2InsightsAndRecommendations(
  doc: PDFKit.PDFDocument,
  report: ReportRecord,
  theme: ReturnType<typeof buildPdfTheme>,
) {
  const { colors } = theme;
  const { pillarLabels, pillarInsights, recommendations, cta } = aiReadinessContent;

  const pageW = doc.page.width;
  const pageH = doc.page.height;
  const pageX = doc.page.margins.left;
  const contentW = pageW - doc.page.margins.left - doc.page.margins.right;

  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
  const shorten = (s: string, maxLen: number) => (s.length <= maxLen ? s : `${s.slice(0, maxLen - 1).trimEnd()}…`);
  const pillLabelFor = (pillarId: string) => pillarLabels[pillarId] || pillarId;

  const toLevel = (score: number): "low" | "medium" | "high" => {
    if (score <= 2.2) return "low";
    if (score <= 3.6) return "medium";
    return "high";
  };

  const levelLabel = (l: "low" | "medium" | "high") => {
    if (l === "low") return "Needs focus";
    if (l === "medium") return "Building";
    return "Strong";
  };

  const pillarEntries = Object.entries(report.result.pillarScores).map(([pillarId, score]) => ({ pillarId, score }));
  pillarEntries.sort((a, b) => a.score - b.score);
  const focus = pillarEntries.slice(0, 2);
  const strongest = pillarEntries[pillarEntries.length - 1];

  doc.addPage();

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

  const startY = 140;

  if (strongest) {
    const y = startY;
    doc
      .save()
      .roundedRect(pageX, y, contentW, 68, 14)
      .fillAndStroke(colors.surface, colors.border)
      .restore();

    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(colors.mutedText)
      .text("STRENGTH", pageX + 18, y + 16);
    doc
      .font("Helvetica-Bold")
      .fontSize(13)
      .fillColor(colors.text)
      .text(`${pillLabelFor(strongest.pillarId)} (${strongest.score.toFixed(1)}/5)`, pageX + 18, y + 32, {
        width: contentW - 36,
      });
  }

  let cursorY = startY + 86;

  for (const p of focus) {
    const level = toLevel(p.score);
    const insight = pillarInsights[p.pillarId]?.[level];
    const rec = recommendations[p.pillarId];

    const innerX = pageX + 18;
    const innerW = contentW - 36;
    const titleText = `${pillLabelFor(p.pillarId)}`;
    const insightTitleText = shorten(insight?.title ?? "", 90);
    const insightBodyText = shorten(insight?.insight ?? "", 420);

    const chipText = `${p.score.toFixed(1)}/5 · ${levelLabel(level)}`;
    doc.font("Helvetica-Bold").fontSize(10);
    const chipW = clamp(doc.widthOfString(chipText) + 20, 90, 150);

    doc.font("Helvetica-Bold").fontSize(14);
    const titleH = doc.heightOfString(titleText, { width: innerW - (chipW + 12) });

    doc.font("Helvetica").fontSize(10);
    const insightTitleH = doc.heightOfString(insightTitleText, { width: innerW });

    doc.font("Helvetica").fontSize(10);
    const insightBodyH = doc.heightOfString(insightBodyText, { width: innerW, lineGap: 2 });

    const topPad = 16;
    const yLabel = cursorY + topPad;
    const yTitle = yLabel + 16;
    const yInsightTitle = yTitle + titleH + 6;
    const yInsightBody = yInsightTitle + insightTitleH + 6;
    const yScoreBar = yInsightBody + insightBodyH + 12;
    const yRec = yScoreBar + 14;
    const cardH = clamp(Math.ceil(yRec + 40 - cursorY), 170, 230);

    doc.save().roundedRect(pageX, cursorY, contentW, cardH, 14).fillAndStroke(colors.surface, colors.border).restore();
    doc.save().roundedRect(pageX, cursorY, 8, cardH, 14).fill(colors.primary).restore();

    doc.font("Helvetica-Bold").fontSize(10).fillColor(colors.mutedText).text("FOCUS AREA", innerX, yLabel);

    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor(colors.text)
      .text(titleText, innerX, yTitle, { width: innerW - (chipW + 12), lineGap: 2 });

    const chipH = 22;
    const chipX = pageX + contentW - chipW - 18;
    const chipY = yTitle + 2;
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
      .strokeOpacity(0.14)
      .lineWidth(1)
      .roundedRect(innerX, yScoreBar, innerW, 8, 6)
      .fillAndStroke(colors.pageBg, colors.secondary)
      .restore();
    doc.save().roundedRect(innerX, yScoreBar, innerW * clamp(p.score / 5, 0, 1), 8, 6).fill(colors.primary).restore();

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
      .text(shorten(rec?.headline ?? "Recommendation", 70), innerX + 12, yRec + 9, { width: innerW - 24 });
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(colors.mutedText)
      .text(shorten(rec?.action ?? "", 130), innerX + 12, yRec + 20, { width: innerW - 24 });

    cursorY += cardH + 18;
  }

  const ctaH = 86;
  const ctaY = clamp(pageH - doc.page.margins.bottom - ctaH - 12, cursorY, pageH - doc.page.margins.bottom - ctaH - 12);
  doc.save().roundedRect(pageX, ctaY, contentW, ctaH, 14).fill(colors.headerBg).restore();
  doc
    .font("Helvetica-Bold")
    .fontSize(13)
    .fillColor(colors.headerText)
    .text(shorten(cta.headline, 70), pageX + 18, ctaY + 16, { width: contentW - 36 });
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor(colors.headerText)
    .text(shorten(cta.body, 150), pageX + 18, ctaY + 36, { width: contentW - 36, lineGap: 2 });
}

function renderPage3AnswerAppendix(
  doc: PDFKit.PDFDocument,
  theme: ReturnType<typeof buildPdfTheme>,
  mappedAnswersByPillar: ReturnType<typeof mapAnswersToPillars>,
  pillarScores?: Record<string, number>,
) {
  const { colors } = theme;
  const { pillarLabels } = aiReadinessContent;

  if (Object.keys(mappedAnswersByPillar).length === 0) {
    return;
  }

  const pageW = doc.page.width;
  const pageH = doc.page.height;
  const pageX = doc.page.margins.left;
  const contentW = pageW - doc.page.margins.left - doc.page.margins.right;
  const bottomY = pageH - doc.page.margins.bottom;

  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

  const drawHeader = () => {
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
      .text(
        "Your answers, grouped by pillar. These are the raw inputs used to calculate your readiness scores.",
        pageX,
        72,
        { width: contentW },
      );
  };

  const ensureSpace = (neededHeight: number, cursorY: number) => {
    if (cursorY + neededHeight <= bottomY - 12) return cursorY;
    doc.addPage();
    drawHeader();
    return 140;
  };

  const drawScoreChip = (x: number, y: number, text: string) => {
    doc.font("Helvetica-Bold").fontSize(10);
    const chipW = clamp(doc.widthOfString(text) + 20, 72, 120);
    const chipH = 22;
    const chipX = x - chipW;

    doc
      .save()
      .strokeOpacity(0.16)
      .lineWidth(1)
      .roundedRect(chipX, y, chipW, chipH, 999)
      .fillAndStroke(colors.pageBg, colors.secondary)
      .restore();
    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor(colors.mutedText)
      .text(text, chipX + 10, y + 6, { width: chipW - 20, align: "center" });
  };

  doc.addPage();
  drawHeader();

  let y = 140;
  const pillarEntries = Object.values(mappedAnswersByPillar);

  for (const pillar of pillarEntries) {
    const pillarTitle = pillarLabels[pillar.pillarId] || pillar.pillarName;
    const score = pillarScores?.[pillar.pillarId];
    const scoreText = typeof score === "number" ? `${score.toFixed(1)}/5` : undefined;

    y = ensureSpace(56, y);

    doc.save().roundedRect(pageX, y, contentW, 46, 14).fillAndStroke(colors.surface, colors.border).restore();
    doc.save().roundedRect(pageX, y, 8, 46, 14).fill(colors.accent).restore();

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor(colors.text)
      .text(pillarTitle, pageX + 18, y + 14, { width: contentW - 36 - 120 });

    if (scoreText) {
      drawScoreChip(pageX + contentW - 18, y + 12, scoreText);
    }

    y += 58;

    for (const answer of pillar.answers) {
      const qText = answer.questionText;
      const aText = `Answer: ${answer.displayAnswer}`;

      doc.font("Helvetica-Bold").fontSize(10);
      const qH = doc.heightOfString(qText, { width: contentW - 64, lineGap: 2 });
      doc.font("Helvetica").fontSize(10);
      const aH = doc.heightOfString(aText, { width: contentW - 64, lineGap: 2 });

      const cardH = clamp(Math.ceil(14 + qH + 6 + aH + 12), 52, 120);
      y = ensureSpace(cardH + 8, y);

      doc.save().roundedRect(pageX, y, contentW, cardH, 12).fillAndStroke(colors.pageBg, colors.border).restore();
      doc.save().roundedRect(pageX, y, 4, cardH, 12).fill(colors.primary).restore();

      const innerX = pageX + 14;
      const innerY = y + 12;
      const innerW = contentW - 28;

      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor(colors.text)
        .text(qText, innerX, innerY, { width: innerW, lineGap: 2 });

      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor(colors.mutedText)
        .text(aText, innerX, innerY + qH + 6, { width: innerW, lineGap: 2 });

      y += cardH + 10;
    }

    y += 6;
  }
}

function renderPdf(report: ReportRecord): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 48 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", (err) => reject(err));

    const theme = buildPdfTheme();

    // Page 1 – Executive snapshot
    renderPage1ExecutiveSnapshot(doc, report, theme);

    renderPage2InsightsAndRecommendations(doc, report, theme);

    // Page 2 – Answer Appendix (grouped by pillar)

    // Build a minimal Template-shaped object from quiz sections/questions so we
    // can reuse the shared mapAnswersToPillars helper from @scorekit/core.
    const pseudoTemplate: Template = buildPseudoTemplate();

    const answers = report.answers as Record<string, number | string | string[]>;
    const mappedAnswersByPillar = mapAnswersToPillars({ template: pseudoTemplate, answers });

    renderPage3AnswerAppendix(doc, theme, mappedAnswersByPillar, report.result.pillarScores);

    doc.end();
  });
}

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

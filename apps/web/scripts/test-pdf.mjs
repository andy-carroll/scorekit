#!/usr/bin/env node
/**
 * PDF dev test script
 *
 * Generates a PDF from the test fixture without needing to complete the quiz.
 * Requires the Next.js dev server to be running (pnpm dev).
 *
 * Usage:
 *   node scripts/test-pdf.mjs
 *   PORT=3001 node scripts/test-pdf.mjs                              # different port
 *   FIXTURE=test-fixtures/report-ai-capability.json node scripts/test-pdf.mjs  # another template
 *
 * The dev server must run with SCOREKIT_TEMPLATE_ID (and its NEXT_PUBLIC_ twin)
 * matching the template the fixture targets, so the PDF renders that template's
 * copy and question set.
 *
 * Output: apps/web/test-output.pdf  (git-ignored)
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname, isAbsolute, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT ?? 3000;
const BASE_URL = `http://localhost:${PORT}`;

// FIXTURE may be absolute or relative to apps/web (the package root).
const fixturePath = process.env.FIXTURE
  ? isAbsolute(process.env.FIXTURE)
    ? process.env.FIXTURE
    : resolve(__dirname, "..", process.env.FIXTURE)
  : join(__dirname, "../test-fixtures/report.json");
const fixture = JSON.parse(readFileSync(fixturePath, "utf8"));

// Strip the _comment key — not part of the schema
delete fixture._comment;

console.log(`\n⏳  Generating PDF`);
console.log(`    Token : ${fixture.token}`);
console.log(`    Lead  : ${fixture.lead.name} · ${fixture.lead.company}`);
console.log(`    Score : ${fixture.result.percentage}% (${fixture.result.band})`);
console.log(`    URL   : ${BASE_URL}/api/report/pdf\n`);

let res;
try {
  res = await fetch(`${BASE_URL}/api/report/pdf`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ token: fixture.token, report: fixture }),
  });
} catch (err) {
  console.error(`❌  Could not connect to ${BASE_URL}`);
  console.error(`    Is the dev server running? (pnpm dev)\n`);
  process.exit(1);
}

if (!res.ok) {
  let body = "";
  try {
    body = await res.text();
  } catch {
    // ignore
  }
  console.error(`❌  PDF generation failed (HTTP ${res.status})`);
  if (body) console.error(`    ${body}`);
  process.exit(1);
}

const outPath = join(__dirname, "../test-output.pdf");
const buf = Buffer.from(await res.arrayBuffer());
writeFileSync(outPath, buf);

console.log(`✅  Saved: ${outPath}`);
console.log(`    Size : ${(buf.length / 1024).toFixed(1)} KB\n`);

// Open the PDF (macOS Preview / default PDF viewer). Safe to ignore on other platforms.
try {
  execSync(`open "${outPath}"`);
} catch {
  // Not macOS or no default viewer — just skip silently.
}

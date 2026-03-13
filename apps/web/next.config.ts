import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NEXT_PUBLIC_BASE_PATH lets each Vercel project serve from a subpath.
  // e.g. NEXT_PUBLIC_BASE_PATH=/quiz/aireadiness for accelerator-x.ai/quiz/aireadiness
  // Leave unset (empty string) for standalone subdomain deployments.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  reactCompiler: true,
  serverExternalPackages: ["pdfkit"],
};

export default nextConfig;

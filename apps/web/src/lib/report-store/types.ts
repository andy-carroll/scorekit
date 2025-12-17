export type ReportToken = string;

export interface ScoreResult {
  total: number;
  max: number;
  percentage: number;
  pillarScores: Record<string, number>;
  band: string;
}

export interface Lead {
  email: string;
  name: string;
  company: string;
}

export interface ReportRecord {
  token: ReportToken;
  createdAt: string;
  templateId: string;
  answers: Record<string, unknown>;
  result: ScoreResult;
  lead: Lead;
}

export interface CreateReportInput {
  templateId: string;
  answers: Record<string, unknown>;
  result: ScoreResult;
  lead: Lead;
}

export interface ReportStore {
  createReport(input: CreateReportInput): Promise<{ token: ReportToken }>;
  getReport(token: ReportToken): Promise<ReportRecord | null>;
}

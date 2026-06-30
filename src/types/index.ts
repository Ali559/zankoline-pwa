// ─── Types ────────────────────────────────────────────────────────────────────

import type { EligibleDepartment } from "@/db/queries";

export interface Program {
  id: number;
  university: string;
  faculty: string;
  department: string;
  governorate: string;
  minGrade: number;
  eveningGrade?: number;
  parallelGrade?: number;
}

export interface HistorySession {
  id: string;
  date: string;
  grade: number;
  choicesCount: number;
  choices: EligibleDepartment[];
}

export type View = "home" | "shortlist" | "history";

export type GradeStatus = "qualified" | "borderline" | "unlikely" | "unknown";

export type Language = "en" | "ckb";

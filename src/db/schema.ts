import Dexie, { type EntityTable } from "dexie";
import type { EligibleDepartment } from "./queries";

// ---------- Reference data (seeded from JSON, shipped with the app) ----------

export type Governorate = "erbil" | "sul" | "duhok" | "halabja";

export interface University {
  id: number;
  name: string;
  governorate: Governorate;
}

export interface Faculty {
  id: number;
  universityId: number;
  name: string;
}

export interface Department {
  id: number;
  facultyId: number;
  name: string;
}

export interface Threshold {
  id: number;
  departmentId: number;
  academicYear: string; // e.g. "2024-2025"
  gradeGeneral: number | null;
  gradeParallel: number | null;
  gradeEvening: number | null;
}

// ---------- User data (created on-device, never touched by reference seeding) ----------

export interface ApplicationForm {
  id?: number;
  studentName: string;
  studentGrade: number;
  label?: string; // e.g. "If I get 95%" — lets users distinguish saved scenarios
  createdAt: Date;
  choices: EligibleDepartment[];
}

export interface UpdateApplicationForm {
  studentName?: string;
  studentGrade?: number;
  label?: string;
  createdAt?: Date;
  choices?: EligibleDepartment[];
}

export interface FormChoice {
  id?: number;
  formId: number;
  thresholdId: number;
  choiceRank: number; // 1–50, unique per form
}

// ---------- Database ----------

class ZankolineDB extends Dexie {
  universities!: EntityTable<University, "id">;
  faculties!: EntityTable<Faculty, "id">;
  departments!: EntityTable<Department, "id">;
  thresholds!: EntityTable<Threshold, "id">;
  applicationForms!: EntityTable<ApplicationForm, "id">;
  formChoices!: EntityTable<FormChoice, "id">;

  constructor() {
    super("zankoline");

    this.version(1).stores({
      // Reference tables — bulk-seeded, effectively read-only from the app's perspective
      universities: "id, governorate, name",
      faculties: "id, universityId, name",
      departments: "id, facultyId, name",
      // Compound index mirrors the SQL UNIQUE(department_id, academic_year) constraint
      thresholds: "id, departmentId, academicYear, [departmentId+academicYear]",

      // User tables — created/edited on-device, never overwritten by reference seeding
      applicationForms: "++id, createdAt",
      // Compound index mirrors SQL UNIQUE(form_id, choice_rank)
      formChoices: "++id, formId, thresholdId, [formId+choiceRank]",
    });
  }
}

export const db = new ZankolineDB();

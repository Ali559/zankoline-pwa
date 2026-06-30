import { db } from "./schema";
import type {
  ApplicationForm,
  FormChoice,
  Governorate,
  UpdateApplicationForm,
} from "./schema";

export type Track = "general" | "parallel" | "evening";

export interface EligibleDepartment {
  thresholdId: number;
  departmentId: number;
  departmentName: string;
  facultyId: number;
  facultyName: string;
  universityId: number;
  universityName: string;
  governorate: Governorate;
  academicYear: string;
  track: Track;
  cutoffGeneral?: number;
  cutoffParallel?: number;
  cutoffEvening?: number;
}

/**
 * Returns every department whose cutoff for the given track and academic
 * year is at or below the student's grade — i.e. departments they would
 * have been admitted to.
 */
export async function getAllDepartmentsWithThresholds(
  academicYear: string,
  governorate?: Governorate,
): Promise<EligibleDepartment[]> {
  // Get ALL thresholds for the academic year (no grade filter)
  const thresholds = await db.thresholds
    .where("academicYear")
    .equals(academicYear)
    .toArray();

  if (thresholds.length === 0) return [];

  const departmentIds = [...new Set(thresholds.map((t) => t.departmentId))];
  const departments = await db.departments
    .where("id")
    .anyOf(departmentIds)
    .toArray();
  const departmentById = new Map(departments.map((d) => [d.id, d]));

  const facultyIds = [...new Set(departments.map((d) => d.facultyId))];
  const faculties = await db.faculties.where("id").anyOf(facultyIds).toArray();
  const facultyById = new Map(faculties.map((f) => [f.id, f]));

  const universityIds = [...new Set(faculties.map((f) => f.universityId))];
  const universities = await db.universities
    .where("id")
    .anyOf(universityIds)
    .toArray();
  const universityById = new Map(universities.map((u) => [u.id, u]));

  const results: EligibleDepartment[] = [];

  for (const t of thresholds) {
    const department = departmentById.get(t.departmentId);
    if (!department) continue;

    const faculty = facultyById.get(department.facultyId);
    if (!faculty) continue;

    const university = universityById.get(faculty.universityId);
    if (!university) continue;

    if (governorate && university.governorate !== governorate) continue;

    results.push({
      thresholdId: t.id,
      departmentId: department.id,
      departmentName: department.name,
      facultyId: faculty.id,
      facultyName: faculty.name,
      universityId: university.id,
      universityName: university.name,
      governorate: university.governorate,
      academicYear: t.academicYear,
      // Include ALL cutoff values for filtering later
      cutoffGeneral: t.gradeGeneral ?? undefined,
      cutoffParallel: t.gradeParallel ?? undefined,
      cutoffEvening: t.gradeEvening ?? undefined,
      track: "general" as Track, // Deprecated
    });
  }

  return results;
}

export async function listAcademicYears(): Promise<string[]> {
  const years = await db.thresholds.orderBy("academicYear").uniqueKeys();
  return years as string[];
}

// ---------- Application forms (shortlists) ----------

export async function createApplicationForm(
  studentName: string,
  studentGrade: number,
  choices: EligibleDepartment[],
  label?: string,
): Promise<number | undefined> {
  return db.applicationForms.add({
    studentName,
    studentGrade,
    label,
    choices,
    createdAt: new Date(),
  } satisfies ApplicationForm);
}

export async function updateApplicationForm(
  id: number,
  edit: UpdateApplicationForm,
) {
  return db.applicationForms.update(id, {
    choices: edit.choices,
    label: edit.label,
  });
}

export async function listApplicationForms(): Promise<ApplicationForm[]> {
  return db.applicationForms.orderBy("createdAt").reverse().toArray();
}

export async function deleteApplicationForm(formId: number): Promise<void> {
  await db.transaction(
    "rw",
    [db.applicationForms, db.formChoices],
    async () => {
      await db.formChoices.where("formId").equals(formId).delete();
      await db.applicationForms.delete(formId);
    },
  );
}

export async function getFormChoices(formId: number): Promise<FormChoice[]> {
  return db.formChoices.where("formId").equals(formId).sortBy("choiceRank");
}

/**
 * Sets a department's rank (1-50) within a form's shortlist. If the
 * threshold is already ranked elsewhere in the same form, its rank is
 * updated rather than creating a duplicate entry.
 */
export async function setFormChoice(
  formId: number,
  thresholdId: number,
  choiceRank: number,
): Promise<void> {
  if (choiceRank < 1 || choiceRank > 50) {
    throw new Error("choiceRank must be between 1 and 50");
  }

  await db.transaction("rw", db.formChoices, async () => {
    const existing = await db.formChoices
      .where("formId")
      .equals(formId)
      .and((c) => c.thresholdId === thresholdId)
      .first();

    if (existing) {
      await db.formChoices.update(existing.id!, { choiceRank });
    } else {
      await db.formChoices.add({ formId, thresholdId, choiceRank });
    }
  });
}

export async function removeFormChoice(
  formId: number,
  thresholdId: number,
): Promise<void> {
  await db.formChoices
    .where("formId")
    .equals(formId)
    .and((c) => c.thresholdId === thresholdId)
    .delete();
}

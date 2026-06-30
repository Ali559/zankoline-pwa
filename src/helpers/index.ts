import type { GradeStatus, Language } from "../types";

export function gradeStatus(
  minGrade: number,
  userGrade: number | null,
): GradeStatus {
  if (userGrade === null) return "unknown";
  const diff = userGrade - minGrade;
  if (diff >= 0) return "qualified";
  if (diff >= -2) return "borderline";
  return "unlikely";
}

export const statusStyles: Record<GradeStatus, string> = {
  qualified: "bg-emerald-50 text-emerald-700 border-emerald-200",
  borderline: "bg-amber-50 text-amber-700 border-amber-200",
  unlikely: "bg-red-50 text-red-600 border-red-200",
  unknown: "bg-zinc-100 text-zinc-500 border-zinc-200",
};

export const statusConfig: Record<GradeStatus, { label: string; cls: string }> =
  {
    qualified: {
      label: "Qualified",
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    borderline: {
      label: "Borderline",
      cls: "bg-amber-50 text-amber-700 border-amber-200",
    },
    unlikely: {
      label: "Unlikely",
      cls: "bg-red-50 text-red-600 border-red-200",
    },
    unknown: {
      label: "—",
      cls: "bg-zinc-100 text-zinc-500 border-zinc-200",
    },
  };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function formatDate(iso: string, _language: Language = "en"): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

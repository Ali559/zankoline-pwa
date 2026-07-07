import type { GradeStatus, Language } from "../types";
import type { Governorate } from "../db/schema";
import type { TranslationKey } from "./translations";

const GOVERNORATE_KEYS: Record<Governorate, TranslationKey> = {
  duhok: "govDuhok",
  sul: "govSul",
  erbil: "govErbil",
  halabja: "govHalabja",
};

export function governorateLabel(
  governorate: Governorate,
  t: (key: TranslationKey) => string,
): string {
  return t(GOVERNORATE_KEYS[governorate]);
}

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
  qualified:
    "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  borderline:
    "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
  unlikely:
    "bg-rose-50 text-rose-700 border-rose-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800",
  unknown:
    "bg-slate-100 text-slate-600 border-slate-200 dark:bg-zinc-800/60 dark:text-zinc-400 dark:border-zinc-700",
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

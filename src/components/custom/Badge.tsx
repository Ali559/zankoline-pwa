import { gradeStatus, statusStyles } from "@/helpers";
import { useLanguage } from "@/components/custom/LanguageContext";

// ─── Badge ────────────────────────────────────────────────────────────────────

export const STATUS_KEY = {
  qualified: "statusQualified",
  borderline: "statusBorderline",
  unlikely: "statusUnlikely",
  unknown: "statusUnknown",
} as const;

export function Badge({ status }: { status: ReturnType<typeof gradeStatus> }) {
  const { t } = useLanguage();
  const cls = statusStyles[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${cls}`}
    >
      {t(STATUS_KEY[status])}
    </span>
  );
}

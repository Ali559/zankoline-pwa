import { History, Eye, Trash2 } from "lucide-react";
import { formatDate } from "@/helpers";
import { useLanguage } from "@/components/custom/LanguageContext";
import {
  deleteApplicationForm,
  listApplicationForms,
  type EligibleDepartment,
} from "@/db/queries";
import { useEffect, useState } from "react";
import type { ApplicationForm } from "@/db/schema";
import { toast } from "sonner";

// ─── History View ─────────────────────────────────────────────────────────────

export function HistoryView({
  grade,
  onViewSession,
  clearSelection,
}: {
  name: string;
  grade: number;
  onViewSession: (deps: EligibleDepartment[], fId: number) => void;
  clearSelection: () => void;
}) {
  const { t, language } = useLanguage();
  const [forms, setForms] = useState<ApplicationForm[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    listApplicationForms()
      .then((data) => {
        if (isMounted) {
          setForms(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Dexie fetch failed:", err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [grade]);

  const onDeleteSession = async (formId: number) => {
    try {
      await deleteApplicationForm(formId);
      toast.success(t("deletionMessage"), {
        position: "top-center",
        className: "bg-background",
      });
      setForms(forms.filter((f) => f.id !== formId));
      clearSelection();
    } catch (error) {
      toast.error(t("generalError"), { position: "top-center" });
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-card px-4 md:px-6 py-4 shrink-0">
        <h1 className="text-lg font-semibold text-foreground">
          {t("historyTitle")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("historySubtitle")}</p>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        {!forms.length ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <History size={36} className="mb-3 opacity-30" />
            <p className="text-sm font-medium">{t("noHistoryYet")}</p>
            <p className="text-xs mt-1">{t("noHistoryHint")}</p>
          </div>
        ) : (
          <div className="space-y-3 max-w-2xl">
            {forms.map((s) => (
              <div
                key={s.id}
                className="bg-card border border-border rounded-xl p-4 shadow-sm hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
                      <History size={16} className="text-accent-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {formatDate(s.createdAt.toISOString(), language)}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-muted-foreground">
                          {t("gradeLabel")}{" "}
                          <span className="font-semibold text-foreground">
                            {s.studentGrade.toFixed(1)}%
                          </span>
                        </span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">
                          <span className="font-semibold text-foreground">
                            {s.choices.length}
                          </span>{" "}
                          {t("facultiesChosen")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onViewSession(s.choices, s.id ?? 0)}
                      className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border bg-secondary text-xs font-medium text-foreground hover:bg-accent hover:border-primary/30 hover:text-accent-foreground transition-colors shrink-0"
                    >
                      <Eye size={12} />
                      {t("viewDetails")}
                    </button>
                    <button
                      onClick={() => onDeleteSession(s.id ?? 0)}
                      className="flex items-center gap-1.5 h-8 px-3 font-medium text-foreground hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {/* Program mini-list */}
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex flex-wrap gap-1.5">
                    {s.choices.slice(0, 5).map((p) => {
                      return (
                        <span
                          key={p.thresholdId}
                          className="text-xs px-2 py-0.5 rounded-md bg-secondary text-muted-foreground border border-border"
                        >
                          {p.facultyName} · {p.universityName.split(" ")[0]}
                        </span>
                      );
                    })}
                    {s.choices.length > 5 && (
                      <span className="text-xs px-2 py-0.5 rounded-md bg-secondary text-muted-foreground border border-border">
                        {t("moreCount", { count: s.choices.length - 5 })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

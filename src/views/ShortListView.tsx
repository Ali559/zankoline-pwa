import { useCallback, useEffect, useRef, useState } from "react";
import { gradeStatus, governorateLabel } from "@/helpers";
import { Badge, STATUS_KEY } from "@/components/custom/Badge";
import { useLanguage } from "@/components/custom/LanguageContext";
import { BookMarked, Printer, GripVertical, Trash2, Save } from "lucide-react";
import { createApplicationForm, type EligibleDepartment } from "@/db/queries";
import type { ApplicationForm } from "@/db/schema";
import { PopupDialog } from "@/components/custom/PopupDialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// ─── Shortlist View ───────────────────────────────────────────────────────────

export function ShortlistView({
  name,
  selected,
  grade,
  onDelete,
  onReorder,
  onFormSaved,
  editMode,
}: {
  name: string;
  selected: EligibleDepartment[];
  grade: number;
  onDelete: (id: number) => void;
  onReorder: (deps: EligibleDepartment[]) => void;
  onFormSaved: () => void;
  editMode?: boolean;
  formId?: number; // ID of the existing form to update
}) {
  const { t, dir, language } = useLanguage();
  const choices = selected;
  const printDate = new Date().toLocaleDateString(
    language === "ckb" ? "ar-IQ" : "en-GB",
    { day: "numeric", month: "long", year: "numeric" },
  );

  // Drag state
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  rowRefs.current.length = choices.length;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState<Partial<ApplicationForm>>({});

  // When you want to save a form
  const handleSaveClick = async () => {
    setCurrentForm({
      studentName: name,
      studentGrade: grade,
      choices: selected,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async (form: ApplicationForm) => {
    try {
      await createApplicationForm(
        form.studentName,
        form.studentGrade,
        form.choices,
        form.label,
      );
      toast.success(t("formCreated"), { position: "top-center" });
      onFormSaved();
    } catch (error) {
      console.error(`error detected: ${error}`);
      toast.error(t("generalError"), { position: "top-center" });
    }
  };

  // Modified reorder handler for edit mode
  const handleReorder = useCallback(
    async (next: EligibleDepartment[]) => {
      onReorder(next);
    },
    [onReorder],
  );

  // Modified delete handler for edit mode
  const handleDelete = useCallback(
    (id: number) => {
      onDelete(id);
    },

    [onDelete],
  );

  const draggingIndexRef = useRef<number | null>(null);
  const dragOverIndexRef = useRef<number | null>(null);

  const getRowIndexFromY = useCallback((clientY: number) => {
    for (let i = 0; i < rowRefs.current.length; i++) {
      const el = rowRefs.current[i];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (clientY >= rect.top && clientY <= rect.bottom) {
        return i;
      }
      if (i === 0 && clientY < rect.top) return 0;
      if (i === rowRefs.current.length - 1 && clientY > rect.bottom) {
        return i;
      }
    }
    return null;
  }, []);

  const endDrag = useCallback(
    (commit: boolean) => {
      const from = draggingIndexRef.current;
      const to = dragOverIndexRef.current;
      if (commit && from !== null && to !== null && from !== to) {
        const next = [...selected];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        handleReorder(next);
      }
      draggingIndexRef.current = null;
      dragOverIndexRef.current = null;
      setDraggingIndex(null);
      setDragOverIndex(null);
    },
    [selected, handleReorder],
  );

  // Window-level listeners are attached only while a drag is in progress,
  // so normal scrolling/clicking elsewhere is unaffected.
  useEffect(() => {
    if (draggingIndex === null) return;

    const handlePointerMove = (e: PointerEvent) => {
      const idx = getRowIndexFromY(e.clientY);
      if (idx !== null && idx !== dragOverIndexRef.current) {
        dragOverIndexRef.current = idx;
        setDragOverIndex(idx);
      }
    };

    const handlePointerUp = () => {
      endDrag(true);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") endDrag(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [draggingIndex, getRowIndexFromY, endDrag]);

  const handlePointerDownOnHandle = (
    e: React.PointerEvent<HTMLSpanElement>,
    i: number,
  ) => {
    // Only respond to the primary mouse button / primary touch contact.
    if (e.button !== 0) return;
    e.preventDefault();
    draggingIndexRef.current = i;
    dragOverIndexRef.current = i;
    setDraggingIndex(i);
    setDragOverIndex(i);
  };

  return (
    <>
      <PopupDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        existingForm={currentForm}
        editMode={editMode} // Pass editMode to dialog to show appropriate title/button
      />
      <div className="page-shell">
        <div className="page-header no-print">
          <div className="page-header-row">
            <div className="min-w-0">
              <h1 className="page-title">{t("myChoicesTitle")}</h1>
              <p className="page-subtitle">
                {t("myChoicesSummary", {
                  count: choices.length,
                  grade: grade.toFixed(1),
                })}
              </p>
            </div>
            {selected.length > 0 && (
              <div className="page-actions">
                <Button
                  variant="outline"
                  className="page-action-btn"
                  onClick={() => window.print()}
                >
                  <Printer size={15} />
                  {t("printForm")}
                </Button>
                {!editMode && (
                  <Button
                    variant="default"
                    className="page-action-btn"
                    onClick={handleSaveClick}
                  >
                    <Save size={15} />
                    {t("saveForLater")}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        <div id="print-area" dir={dir} lang={language} className="page-content">
          <div className="print-document">
            <header className="print-header print-only">
              <div className="print-header-top">
                <div>
                  <h1 className="print-brand-title">{t("appName")}</h1>
                  <p className="print-brand-subtitle">{t("printFormTitle")}</p>
                </div>
                <p className="print-academic-year">{t("printAcademicYear")}</p>
              </div>
              <div className="print-meta-grid">
                <div className="print-meta-item">
                  <span className="print-meta-label">{t("printStudentLabel")}</span>
                  <span className="print-meta-value">{name}</span>
                </div>
                <div className="print-meta-item">
                  <span className="print-meta-label">{t("printGradeLabel")}</span>
                  <span className="print-meta-value">{grade.toFixed(1)}%</span>
                </div>
                <div className="print-meta-item">
                  <span className="print-meta-label">{t("printDateLabel")}</span>
                  <span className="print-meta-value">{printDate}</span>
                </div>
              </div>
            </header>

          {choices.length === 0 ? (
            <div className="empty-state no-print">
              <BookMarked size={36} className="mb-3 opacity-30" />
              <p className="text-sm font-medium">{t("noProgramsSelected")}</p>
              <p className="text-xs mt-1">{t("noProgramsSelectedHint")}</p>
            </div>
          ) : (
            <>
              <div className="data-table-card print-table-wrap">
              <table
                className="data-table print-table min-w-[48rem]"
                role="table"
                dir={dir}
                lang={language}
                aria-label={t("myChoicesTitle")}
              >
                <thead>
                  <tr>
                    <th className="w-10 no-print" />
                    <th className="col-priority w-12">#</th>
                    <th>{t("colUniversity")}</th>
                    <th>{t("colFaculty")}</th>
                    <th>{t("colDepartment")}</th>
                    <th className="col-governorate">{t("colGovernorate")}</th>
                    <th className="col-grade">{t("colMinGrade")}</th>
                    <th className="col-status">{t("colStatus")}</th>
                    <th className="w-10 no-print" />
                  </tr>
                </thead>
                <tbody>
                  {choices.map((p, i) => {
                    const status = gradeStatus(p.cutoffGeneral ?? 0, grade);
                    const isDragOver = dragOverIndex === i && draggingIndex !== i;
                    const isDragging = draggingIndex === i;
                    return (
                      <tr
                        key={p.thresholdId}
                        ref={(el) => {
                          rowRefs.current[i] = el;
                        }}
                        className={`group ${isDragOver ? "data-table-row-selected border-t-2 border-t-foreground/30" : ""} ${isDragging ? "opacity-50" : ""}`}
                      >
                        <td className="no-print">
                          <div className="flex justify-center">
                            <span
                              onPointerDown={(e) => handlePointerDownOnHandle(e, i)}
                              className="cursor-grab active:cursor-grabbing text-muted-foreground/40 group-hover:text-muted-foreground transition-colors flex items-center touch-none"
                              style={{ touchAction: "none" }}
                            >
                              <GripVertical size={14} />
                            </span>
                          </div>
                        </td>
                        <td className="col-priority text-muted-foreground tabular-nums font-medium">
                          {i + 1}
                        </td>
                        <td className="font-medium text-foreground">{p.universityName}</td>
                        <td className="text-foreground">{p.facultyName}</td>
                        <td className="text-muted-foreground">{p.departmentName}</td>
                        <td className="col-governorate text-muted-foreground">
                          {governorateLabel(p.governorate, t)}
                        </td>
                        <td className="col-grade font-medium tabular-nums">
                          {(p.cutoffGeneral ?? 0).toFixed(1)}%
                        </td>
                        <td className="col-status">
                          <span className="no-print inline-flex justify-center">
                            <Badge status={status} />
                          </span>
                          <span className="print-only font-medium">
                            {t(STATUS_KEY[status])}
                          </span>
                        </td>
                        <td className="no-print">
                          <div className="flex justify-center">
                            <button
                              onClick={() => handleDelete(p.thresholdId)}
                              className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                              title={t("removeProgram")}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

              <footer className="print-footer print-only">
                {t("appName")} · {t("loginFooter")}
              </footer>
            </>
          )}
          </div>
        </div>
      </div>
    </>
  );
}

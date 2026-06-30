import { useCallback, useEffect, useRef, useState } from "react";
import { gradeStatus } from "@/helpers";
import { Badge } from "@/components/custom/Badge";
import { useLanguage } from "@/components/custom/LanguageContext";
import { BookMarked, Printer, GripVertical, Trash2, Save } from "lucide-react";
import { createApplicationForm, type EligibleDepartment } from "@/db/queries";
import type { ApplicationForm } from "@/db/schema";
import { PopupDialog } from "@/components/custom/PopupDialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// ─── Shortlist View ───────────────────────────────────────────────────────────

const GRID_TEMPLATE =
  "2.25rem 2.5rem minmax(140px,1.3fr) minmax(110px,1fr) minmax(140px,1.4fr) minmax(100px,0.9fr) 90px 100px 2.5rem";

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

  // Drag state
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
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
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area { position: absolute; top: 0; inset-inline-start: 0; width: 100%; }
          .no-print { display: none !important; }
          .print-grid { border: 1px solid #ccc; }
          .print-row { border-bottom: 1px solid #ccc; }
          .print-cell { padding: 6px 10px; font-size: 12px; }
          .print-head { background: #f4f4f5; font-weight: 600; }
        }
      `}</style>

      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b border-border bg-card px-4 md:px-6 py-4 flex items-center justify-between shrink-0 no-print">
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              {t("myChoicesTitle")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("myChoicesSummary", {
                count: choices.length,
                grade: grade.toFixed(1),
              })}
            </p>
          </div>
          {selected.length > 0 && (
            <div className="flex items-center gap-4 max-w-1/2 px-2">
              <Button variant={"secondary"} onClick={() => window.print()}>
                <Printer size={14} />
                {t("printForm")}
              </Button>
              {!editMode && (
                <Button variant={"default"} onClick={handleSaveClick}>
                  <Save size={14} />
                  {t("saveForLater")}
                </Button>
              )}
            </div>
          )}
        </div>

        <div
          id="print-area"
          dir={dir}
          className="flex-1 overflow-auto p-4 md:p-6"
        >
          {/* Print header */}
          <div className="hidden print:block mb-6">
            <h1 className="text-xl font-bold">
              {t("appName")} — {t("appTagline")}
            </h1>
            <p className="text-sm text-gray-600">
              {t("printHeaderSubtitle", {
                grade: grade.toFixed(1),
                date: new Date().toLocaleDateString("en-GB"),
              })}
            </p>
            <hr className="my-3" />
          </div>

          {choices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground no-print">
              <BookMarked size={36} className="mb-3 opacity-30" />
              <p className="text-sm font-medium">{t("noProgramsSelected")}</p>
              <p className="text-xs mt-1">{t("noProgramsSelectedHint")}</p>
            </div>
          ) : (
            <div
              role="table"
              aria-label={t("myChoicesTitle")}
              className="bg-card border border-border rounded-xl overflow-hidden shadow-sm min-w-160 print-grid select-none"
            >
              {/* Header row */}
              <div
                role="row"
                className="grid bg-secondary border-b border-border print-row print-head"
                style={{ gridTemplateColumns: GRID_TEMPLATE }}
              >
                <div role="columnheader" className="no-print" />
                <div
                  role="columnheader"
                  className="px-4 py-3 text-start text-sm font-medium text-muted-foreground print-cell"
                >
                  #
                </div>
                <div
                  role="columnheader"
                  className="px-4 py-3 text-start text-sm font-medium text-muted-foreground print-cell"
                >
                  {t("colUniversity")}
                </div>
                <div
                  role="columnheader"
                  className="px-4 py-3 text-start text-sm font-medium text-muted-foreground print-cell"
                >
                  {t("colFaculty")}
                </div>
                <div
                  role="columnheader"
                  className="px-4 py-3 text-start text-sm font-medium text-muted-foreground print-cell"
                >
                  {t("colDepartment")}
                </div>
                <div
                  role="columnheader"
                  className="px-4 py-3 text-start text-sm font-medium text-muted-foreground print-cell"
                >
                  {t("colGovernorate")}
                </div>
                <div
                  role="columnheader"
                  className="px-4 py-3 text-start text-sm font-medium text-muted-foreground print-cell"
                >
                  {t("colMinGrade")}
                </div>
                <div
                  role="columnheader"
                  className="px-4 py-3 text-start text-sm font-medium text-muted-foreground no-print"
                >
                  {t("colStatus")}
                </div>
                <div role="columnheader" className="no-print" />
              </div>

              {/* Data rows */}
              <div
                role="rowgroup"
                className={`${language === "ckb" ? "" : "text-xl"}`}
              >
                {choices.map((p, i) => {
                  const status = gradeStatus(p.cutoffGeneral ?? 0, grade);
                  const isDragOver = dragOverIndex === i && draggingIndex !== i;
                  const isDragging = draggingIndex === i;
                  return (
                    <div
                      key={p.thresholdId}
                      ref={(el) => {
                        rowRefs.current[i] = el;
                      }}
                      role="row"
                      className={`
                        grid items-center border-b border-border last:border-b-0 transition-colors group print-row
                        ${isDragOver ? "bg-accent/60 border-t-2 border-t-primary" : "hover:bg-secondary/40"}
                        ${isDragging ? "opacity-50 bg-accent/30" : "opacity-100"}
                      `}
                      style={{ gridTemplateColumns: GRID_TEMPLATE }}
                    >
                      {/* Drag handle */}
                      <div
                        role="cell"
                        className="ps-3 pe-1 py-3 no-print flex items-center"
                      >
                        <span
                          onPointerDown={(e) => handlePointerDownOnHandle(e, i)}
                          className="cursor-grab active:cursor-grabbing text-muted-foreground/40 group-hover:text-muted-foreground transition-colors flex items-center touch-none"
                          style={{ touchAction: "none" }}
                        >
                          <GripVertical size={14} />
                        </span>
                      </div>
                      <div
                        role="cell"
                        className="px-4 py-3 text-sm text-muted-foreground tabular-nums font-medium print-cell"
                      >
                        {i + 1}
                      </div>
                      <div
                        role="cell"
                        className="px-4 py-3 text-sm font-medium text-foreground whitespace-nowrap overflow-hidden text-ellipsis print-cell"
                      >
                        {p.universityName}
                      </div>
                      <div
                        role="cell"
                        className="px-4 py-3 text-sm text-foreground overflow-hidden text-ellipsis print-cell"
                      >
                        {p.facultyName}
                      </div>
                      <div
                        role="cell"
                        className="px-4 py-3 text-sm text-muted-foreground overflow-hidden text-ellipsis print-cell"
                      >
                        {p.departmentName}
                      </div>
                      <div
                        role="cell"
                        className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis print-cell"
                      >
                        {p.governorate}
                      </div>
                      <div
                        role="cell"
                        className="px-4 py-3 font-mono text-sm font-medium tabular-nums print-cell"
                      >
                        {(p.cutoffGeneral ?? 0).toFixed(1)}%
                      </div>
                      <div role="cell" className="px-4 py-3 no-print">
                        <Badge status={status} />
                      </div>
                      {/* Delete */}
                      <div
                        role="cell"
                        className="pe-3 ps-1 py-3 no-print flex items-center"
                      >
                        <button
                          onClick={() => handleDelete(p.thresholdId)}
                          className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground/40 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                          title={t("removeProgram")}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

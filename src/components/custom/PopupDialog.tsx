import { useState, useEffect } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import type { ApplicationForm } from "@/db/schema";
import { useLanguage } from "./LanguageContext";
import { Button } from "@/components/ui/button";

interface PopupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (form: ApplicationForm) => void;
  existingForm?: Partial<ApplicationForm>;
  initialLabel?: string;
  editMode?: boolean;
}

export const PopupDialog = ({
  isOpen,
  onClose,
  onSave,
  existingForm,
  initialLabel = "",
  editMode,
}: PopupDialogProps) => {
  const { t, language } = useLanguage();
  const [label, setLabel] = useState(initialLabel);
  const [error, setError] = useState("");

  useEffect(() => {
    setLabel(initialLabel);
    setError("");
  }, [initialLabel, isOpen]);

  const handleSave = () => {
    if (!label.trim()) {
      if (language === "en") {
        setError(
          "Please enter a label for this form shorter than 50 characters",
        );
        return;
      }
      setError("تکایە پێناسێک بۆ فۆڕمەکەت بنوسە لە ٥٠ پیت کەمتربێت");
      return;
    }

    const form: ApplicationForm = {
      ...(existingForm as ApplicationForm),
      label: label.trim(),
      createdAt: existingForm?.createdAt || new Date(),
    };

    onSave(form);
    handleClose();
  };

  const handleClose = () => {
    setLabel("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative bg-card border border-border rounded-xl shadow-lg w-full max-w-md animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between gap-3 p-5 border-b border-border">
          <div className="flex items-center gap-2.5 min-w-0">
            <Save className="w-4 h-4 shrink-0 text-primary" />
            <h2 className="text-base font-semibold text-foreground truncate">
              {editMode ? t("headerTextUpdate") : t("headerText")}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {existingForm?.studentName && (
            <div className="rounded-lg bg-accent/60 px-3 py-3 space-y-1">
              <div className="text-sm text-muted-foreground">
                {t("studentName")}
                {": "}
                <span className="font-medium text-foreground">
                  {existingForm.studentName}
                </span>
              </div>
              {existingForm.studentGrade && (
                <div className="text-sm text-muted-foreground">
                  {t("studentGrade")}
                  {": "}
                  <span className="font-medium text-foreground tabular-nums">
                    {existingForm.studentGrade}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="form-field">
            <label htmlFor="form-label" className="form-label">
              {t("formDescription")}
            </label>
            <input
              maxLength={50}
              id="form-label"
              type="text"
              value={label}
              onChange={(e) => {
                setLabel(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
              }}
              placeholder={t("inputPlaceholder")}
              className="form-input"
              autoFocus
            />
            <p className="text-xs text-muted-foreground">{t("labelText")}</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-destructive bg-destructive/10 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 p-5 border-t border-border">
          <Button type="button" variant="outline" onClick={handleClose}>
            {t("cancelText")}
          </Button>
          <Button type="button" onClick={handleSave}>
            {t("buttonText")}
          </Button>
        </div>
      </div>
    </div>
  );
};

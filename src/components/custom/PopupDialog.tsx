import { useState, useEffect } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import type { ApplicationForm } from "@/db/schema";
import { useLanguage } from "./LanguageContext";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Save className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {editMode ? t("headerTextUpdate") : t("headerText")}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Student Info Display */}
            {existingForm?.studentName && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t("studentName")}
                  {": "}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {existingForm.studentName}
                  </span>
                </div>
                {existingForm.studentGrade && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {t("studentGrade")}
                    {": "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {existingForm.studentGrade}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Label Input */}
            <div>
              <label
                htmlFor="form-label"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
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
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         placeholder-gray-400 dark:placeholder-gray-500
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200"
                autoFocus
              />
              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                {t("labelText")}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleClose}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 
                     hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {t("cancelText")}
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 
                     hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 
                     rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     dark:focus:ring-offset-gray-800"
          >
            {t("buttonText")}
          </button>
        </div>
      </div>
    </div>
  );
};

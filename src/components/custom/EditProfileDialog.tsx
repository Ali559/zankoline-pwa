import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  grade: number;
  onSave: (name: string, grade: number) => void;
}

export function EditProfileDialog({
  open,
  onOpenChange,
  name,
  grade,
  onSave,
}: EditProfileDialogProps) {
  const { t } = useLanguage();
  const [nameInput, setNameInput] = useState(name);
  const [gradeInput, setGradeInput] = useState(String(grade));
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setNameInput(name);
      setGradeInput(String(grade));
      setError("");
    }
  }, [open, name, grade]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(gradeInput);
    if (isNaN(val) || val < 50 || val > 100) {
      setError(t("loginError"));
      return;
    }
    if (!nameInput.trim()) {
      setError(t("loginNameError"));
      return;
    }
    onSave(nameInput.trim(), val);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-5 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("editProfileTitle")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="form-field">
            <label htmlFor="profile-name" className="form-label">
              {t("loginNameLabel")}
            </label>
            <input
              id="profile-name"
              type="text"
              maxLength={50}
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                setError("");
              }}
              className="form-input"
            />
          </div>

          <div className="form-field">
            <label htmlFor="profile-grade" className="form-label">
              {t("loginGradeLabel")}
            </label>
            <input
              id="profile-grade"
              type="number"
              step="0.1"
              min="50"
              max="100"
              value={gradeInput}
              onChange={(e) => {
                setGradeInput(e.target.value);
                setError("");
              }}
              className="form-input"
            />
            {error && <p className="form-error">{error}</p>}
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("cancelText")}
            </Button>
            <Button type="submit">{t("saveProfile")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

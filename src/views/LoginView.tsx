import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { LanguageSwitcher } from "@/components/custom/LangugeSwitcher";
import { useLanguage } from "@/components/custom/LanguageContext";
import { Button } from "@/components/ui/button";

export function LoginView({
  onLogin,
}: {
  onLogin: (grade: number, name: string) => void;
}) {
  const { t } = useLanguage();
  const [input, setInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(input);
    if (isNaN(val) || val < 50 || val > 100) {
      setError(t("loginError"));
      return;
    }
    if (!nameInput.trim()) {
      setError(t("loginNameError"));
      return;
    }
    onLogin(val, nameInput);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <div className="absolute top-4 inset-e-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4 shadow-sm">
            <GraduationCap size={24} className="text-foreground" />
          </div>
          <h1 className="text-foreground">{t("appName")}</h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            {t("appTagline")}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-foreground mb-1">{t("loginTitle")}</h2>
          <p className="text-sm text-muted-foreground mb-6">
            {t("loginSubtitle")}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-field">
              <label htmlFor="login-name" className="form-label">
                {t("loginNameLabel")}
              </label>
              <input
                id="login-name"
                type="text"
                maxLength={50}
                placeholder={t("loginNamePlaceholder")}
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  setError("");
                }}
                className="form-input"
              />
            </div>

            <div className="form-field">
              <label htmlFor="login-grade" className="form-label">
                {t("loginGradeLabel")}
              </label>
              <input
                id="login-grade"
                type="number"
                step="0.1"
                min="50"
                max="100"
                placeholder={t("loginGradePlaceholder")}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setError("");
                }}
                className="form-input"
              />
              {error && <p className="form-error">{error}</p>}
            </div>

            <Button type="submit" className="w-full h-10">
              {t("loginSubmit")}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 leading-relaxed">
          {t("loginFooter")}
        </p>
      </div>
    </div>
  );
}

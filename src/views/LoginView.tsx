import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { LanguageSwitcher } from "@/components/custom/LangugeSwitcher";
import { useLanguage } from "@/components/custom/LanguageContext";

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
      {/* Language switcher, top corner */}
      <div className="absolute top-4 inset-e-4 px-24">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4 shadow-sm">
            <GraduationCap size={24} className="text-foreground" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            {t("appName")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("appTagline")}
          </p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-foreground mb-1">
            {t("loginTitle")}
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            {t("loginSubtitle")}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground my-1.5">
                {t("loginNameLabel")}
              </label>
              <input
                type="text"
                step="0.1"
                maxLength={50}
                placeholder={t("loginNamePlaceholder")}
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  setError("");
                }}
                className="w-full h-10 px-3 rounded-lg border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
              />
              <label className="block text-sm font-medium text-foreground my-1.5">
                {t("loginGradeLabel")}
              </label>
              <input
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
                className="w-full h-10 px-3 rounded-lg border border-border  text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
              />
              {error && (
                <p className="mt-1.5 text-xs text-destructive">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium "
            >
              {t("loginSubmit")}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          {t("loginFooter")}
        </p>
      </div>
    </div>
  );
}

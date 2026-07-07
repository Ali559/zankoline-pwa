import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "./LanguageContext";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === "dark";

  return (
    <div className="flex w-full rounded-lg border border-input bg-input-background p-0.5 gap-0.5">
      <button
        type="button"
        onClick={() => setTheme("light")}
        title={t("themeLight")}
        className={`flex flex-1 items-center justify-center gap-1.5 h-8 rounded-md text-xs font-medium transition-colors ${
          !isDark
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Sun size={14} />
        {!compact && <span>{t("themeLight")}</span>}
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        title={t("themeDark")}
        className={`flex flex-1 items-center justify-center gap-1.5 h-8 rounded-md text-xs font-medium transition-colors ${
          isDark
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Moon size={14} />
        {!compact && <span>{t("themeDark")}</span>}
      </button>
    </div>
  );
}

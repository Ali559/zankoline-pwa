import { useEffect, useRef, useState } from "react";
import { Languages, Check } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import type { Language } from "../../types";

// ─── Language Switcher ─────────────────────────────────────────────────────────

const LANGUAGE_OPTIONS: { code: Language; nativeLabel: string }[] = [
  { code: "en", nativeLabel: "English" },
  { code: "ckb", nativeLabel: "کوردی" },
];

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const current = LANGUAGE_OPTIONS.find((o) => o.code === language);

  return (
    <div className="relative w-full" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        title={t("language")}
        className={`w-full flex items-center justify-center gap-1.5 h-8 rounded-md text-xs font-medium text-muted-foreground border bg-background dark:bg-input/30 hover:bg-accent hover:text-foreground transition-colors ${
          compact ? "w-8 justify-center" : "px-2.5"
        }`}
      >
        <Languages size={14} />
        {!compact && <span>{current?.nativeLabel}</span>}
      </button>

      {open && (
        <div
          className={`absolute inset-e-0 top-full mt-1.5 rounded-lg border border-border bg-card shadow-lg py-1 z-50 ${language !== "en" ? "right-0" : "left-0"}`}
        >
          {LANGUAGE_OPTIONS.map((opt) => (
            <button
              key={opt.code}
              onClick={() => {
                setLanguage(opt.code);
                setOpen(false);
              }}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary transition-colors text-start"
            >
              <span>
                {opt.code === "en"
                  ? t("languageEnglish")
                  : t("languageKurdish")}
              </span>
              {language === opt.code && (
                <Check size={14} className="text-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

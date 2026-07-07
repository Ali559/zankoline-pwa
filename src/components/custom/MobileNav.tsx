import { Search, BookMarked, History } from "lucide-react";
import type { View } from "@/types";
import { useLanguage } from "./LanguageContext";

// ─── Mobile Bottom Nav ────────────────────────────────────────────────────────

export function MobileNav({
  view,
  setView,
  shortlistCount,
}: {
  view: View;
  setView: (v: View) => void;
  shortlistCount: number;
}) {
  const { t } = useLanguage();
  const nav = [
    { id: "home" as View, icon: Search, label: t("navSearchShort") },
    { id: "shortlist" as View, icon: BookMarked, label: t("navChoicesShort") },
    { id: "history" as View, icon: History, label: t("navHistoryShort") },
  ];
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-card/95 backdrop-blur-sm border-t border-border flex z-50 pb-[env(safe-area-inset-bottom)]">
      {nav.map(({ id, icon: Icon, label }) => {
        const isActive = view === id;
        return (
          <button
            key={id}
            onClick={() => setView(id)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-sm font-medium transition-colors relative ${isActive ? "text-primary" : "text-muted-foreground"}`}
          >
            <Icon size={20} />
            <span className="text-xs">{label}</span>
            {id === "shortlist" && shortlistCount > 0 && (
              <span className="absolute top-1.5 inset-e-[calc(50%-12px)] w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-semibold flex items-center justify-center">
                {shortlistCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

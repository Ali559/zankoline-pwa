import {
  Search,
  BookMarked,
  History,
  LogOut,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import type { View } from "@/types";
import { LanguageSwitcher } from "./LangugeSwitcher";
import { useLanguage } from "./LanguageContext";
import { ThemeToggle } from "./ThemeToggle";

// ─── Sidebar ──────────────────────────────────────────────────────────────────

interface SidebarProps {
  view: View;
  setView: (v: View) => void;
  grade: number;
  shortlistCount: number;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  onSignOut: () => void;
}

export function Sidebar({
  view,
  setView,
  grade,
  shortlistCount,
  collapsed,
  setCollapsed,
  onSignOut,
}: SidebarProps) {
  const { t, dir } = useLanguage();
  const isRtl = dir === "rtl";

  // The collapse chevron should point toward the edge it collapses to.
  // In LTR the sidebar is on the left, so "collapse" points left (←).
  // In RTL the sidebar is on the right, so "collapse" points right (→).
  const CollapseIcon = isRtl
    ? collapsed
      ? ChevronLeft
      : ChevronRight
    : collapsed
      ? ChevronRight
      : ChevronLeft;

  const nav = [
    { id: "home" as View, icon: Search, label: t("navSearch") },
    { id: "shortlist" as View, icon: BookMarked, label: t("navChoices") },
    { id: "history" as View, icon: History, label: t("navHistory") },
  ];

  return (
    <aside
      className={`
        hidden md:flex flex-col border-e border-border bg-sidebar transition-all duration-200 ease-in-out
        ${collapsed ? "w-15" : "w-55"}
        min-h-screen shrink-0
      `}
    >
      {/* Header */}
      <div
        className={`flex items-center border-b border-border h-14 shrink-0 ${collapsed ? "justify-center px-0" : "px-4 justify-between"}`}
      >
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg  bg-accent flex items-center justify-center">
              <GraduationCap size={14} />
            </div>
            <span className="text-sm font-semibold text-foreground">
              {t("appName")}
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <CollapseIcon size={14} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5">
        {nav.map(({ id, icon: Icon, label }) => {
          const isActive = view === id;
          return (
            <button
              key={id}
              onClick={() => setView(id)}
              title={collapsed ? label : undefined}
              className={`
                w-full flex items-center gap-2.5 rounded-lg px-2.5 h-9 text-sm font-medium transition-colors relative
                ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }
                ${collapsed ? "justify-center" : ""}
              `}
            >
              <Icon size={16} className="shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
              {id === "shortlist" && shortlistCount > 0 && (
                <span
                  className={`
                  ms-auto shrink-0 h-4 min-w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center px-1
                  ${collapsed ? "absolute top-1 inset-e-1" : ""}
                `}
                >
                  {shortlistCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom: language, grade + sign out */}
      <div className="px-2 pb-3 space-y-2 border-t border-border pt-3">
        <div className="w-full">
          <ThemeToggle />
        </div>
        <div className={collapsed ? "w-full" : " w-full"}>
          <LanguageSwitcher compact={collapsed} />
        </div>

        {!collapsed && (
          <div className="rounded-lg bg-accent px-3 py-2.5">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
              {t("yourGrade")}
            </p>
            <p className="text-xl font-semibold text-accent-foreground">
              {grade.toFixed(1)}%
            </p>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-[9px] font-bold text-accent-foreground">
                {Math.round(grade)}
              </span>
            </div>
          </div>
        )}
        <button
          onClick={onSignOut}
          title={collapsed ? t("signOut") : undefined}
          className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 h-9 text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut size={16} className="shrink-0" />
          {!collapsed && <span>{t("signOut")}</span>}
        </button>
      </div>
    </aside>
  );
}

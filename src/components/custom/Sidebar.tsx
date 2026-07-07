import {
  Search,
  BookMarked,
  History,
  LogOut,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Pencil,
} from "lucide-react";
import type { View } from "@/types";
import { LanguageSwitcher } from "./LangugeSwitcher";
import { useLanguage } from "./LanguageContext";
import { ThemeToggle } from "./ThemeToggle";

// ─── Sidebar ──────────────────────────────────────────────────────────────────

interface SidebarProps {
  view: View;
  setView: (v: View) => void;
  name: string;
  grade: number;
  shortlistCount: number;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  onSignOut: () => void;
  onEditProfile: () => void;
}

export function Sidebar({
  view,
  setView,
  name,
  grade,
  shortlistCount,
  collapsed,
  setCollapsed,
  onSignOut,
  onEditProfile,
}: SidebarProps) {
  const { t, dir } = useLanguage();
  const isRtl = dir === "rtl";

  const CollapseIcon = isRtl
    ? collapsed
      ? ChevronRight
      : ChevronLeft
    : collapsed
      ? ChevronLeft
      : ChevronRight;

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
          <ThemeToggle compact={collapsed} />
        </div>
        <div className={collapsed ? "w-full" : " w-full"}>
          <LanguageSwitcher compact={collapsed} />
        </div>

        {!collapsed && (
          <button
            type="button"
            onClick={onEditProfile}
            className="w-full rounded-lg bg-accent px-3 py-3 text-start hover:bg-accent/80 transition-colors"
          >
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1">
              {t("yourName")}
            </p>
            <p className="text-sm font-semibold text-accent-foreground truncate mb-3">
              {name}
            </p>
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  {t("yourGrade")}
                </p>
                <p className="text-lg font-semibold text-accent-foreground tabular-nums">
                  {grade.toFixed(1)}%
                </p>
              </div>
              <Pencil size={14} className="shrink-0 text-muted-foreground" />
            </div>
          </button>
        )}
        {collapsed && (
          <button
            type="button"
            onClick={onEditProfile}
            title={t("editProfile")}
            className="flex justify-center w-full"
          >
            <div className="w-full h-8 rounded-lg bg-accent flex items-center justify-center hover:bg-accent/80 transition-colors">
              <span className="font-bold text-accent-foreground">
                {Math.round(grade)}
              </span>
            </div>
          </button>
        )}
        <button
          onClick={onSignOut}
          title={collapsed ? t("signOut") : undefined}
          className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 h-9 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut size={16} className="shrink-0" />
          {!collapsed && <span>{t("signOut")}</span>}
        </button>
      </div>
    </aside>
  );
}

import { useEffect, useState } from "react";
import { GraduationCap, LogOut } from "lucide-react";
import { LoginView } from "@/views/LoginView";
import { Sidebar } from "@/components/custom/Sidebar";
import { MobileNav } from "@/components/custom/MobileNav";
import { HomeView } from "@/views/HomeView";
import { ShortlistView } from "@/views/ShortListView";
import { HistoryView } from "@/views/HistoryView";
import type { View } from "./types";
import {
  LanguageProvider,
  useLanguage,
} from "@/components/custom/LanguageContext";
import { LanguageSwitcher } from "@/components/custom/LangugeSwitcher";
import { seedDatabase } from "./db/seed";
import { updateApplicationForm, type EligibleDepartment } from "./db/queries";
import { toast, Toaster } from "sonner";
import { useTheme } from "next-themes";
import type { UpdateApplicationForm } from "./db/schema";

// ─── App Shell ────────────────────────────────────────────────────────────────

function AppShell() {
  const { t, dir, language } = useLanguage();
  const [loggedIn, setLoggedIn] = useState(false);
  const [grade, setGrade] = useState(0);
  const [name, setName] = useState("");
  const [view, setView] = useState<View>("home");
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<EligibleDepartment[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [formId, setFormId] = useState(0);
  const [isSeeding, setIsSeeding] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    // Seed the database when the app starts
    const initDb = async () => {
      try {
        await seedDatabase();
        setIsSeeding(false);
      } catch (err) {
        console.error("Failed to initialize database:", err);
        setError("Failed to load application data. Please refresh the page.");
        setIsSeeding(false);
      }
    };

    initDb();
  }, []);

  // Keep <html dir="..." lang="..."> in sync so native browser behavior
  // (scrollbars, text selection, form controls) follows the chosen language.
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [dir, language]);

  const handleLogin = (g: number, name: string) => {
    setGrade(g);
    setName(name);
    setLoggedIn(true);
  };

  const handleSignOut = () => {
    setLoggedIn(false);
    setGrade(0);
    setSelected([]);
    setView("home");
  };

  const handleFormUpdate = async (id: number, edit: UpdateApplicationForm) => {
    try {
      await updateApplicationForm(id, edit);
      toast.success(t("formUpdated"), { position: "top-center" });
    } catch (error) {
      console.error(`error detected: ${error}`);
      toast.error(t("generalError"), { position: "top-center" });
    }
  };
  const handleViewSession = (deps: EligibleDepartment[], fId: number) => {
    setFormId(fId);
    setEditMode(true);
    setSelected(deps);
    setView("shortlist");
  };
  const onFormSaved = () => {
    setSelected([]);
  };

  if (!loggedIn) {
    return <LoginView onLogin={handleLogin} />;
  }

  if (isSeeding) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      dir={dir}
      className="flex h-screen overflow-hidden bg-background font-[Inter,sans-serif]"
    >
      <Sidebar
        view={view}
        setView={setView}
        grade={grade}
        shortlistCount={selected.length}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onSignOut={handleSignOut}
      />

      <main className="flex-1 overflow-hidden flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between border-b border-border bg-card px-4 h-14 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              {t("appName")}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-muted-foreground bg-accent px-2 py-1 rounded-md">
              {grade.toFixed(1)}%
            </span>
            <LanguageSwitcher compact />
            <button
              onClick={handleSignOut}
              className="p-1.5 rounded-md text-muted-foreground hover:text-red-500 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden pb-16 md:pb-0">
          {view === "home" && (
            <HomeView
              name={name}
              grade={grade}
              selected={selected}
              setSelected={setSelected}
            />
          )}
          {view === "shortlist" && (
            <ShortlistView
              name={name}
              selected={selected}
              grade={grade}
              onDelete={async (id) => {
                setSelected(selected.filter((x) => x.thresholdId !== id));
                await handleFormUpdate(formId, {
                  choices: selected.filter((x) => x.thresholdId !== id),
                });
              }}
              onFormSaved={onFormSaved}
              onReorder={async (newSelected) => {
                setSelected(newSelected);
                await handleFormUpdate(formId, {
                  choices: newSelected,
                });
              }}
              editMode={editMode}
            />
          )}
          {view === "history" && (
            <HistoryView
              name={name}
              grade={grade}
              onViewSession={handleViewSession}
              clearSelection={() => setSelected([])}
            />
          )}
        </div>
      </main>

      <MobileNav
        view={view}
        setView={setView}
        shortlistCount={selected.length}
      />
    </div>
  );
}

export default function App() {
  const { theme = "system" } = useTheme();
  return (
    <LanguageProvider>
      <AppShell />
      <Toaster theme={theme as "light" | "dark" | "system"} />
    </LanguageProvider>
  );
}

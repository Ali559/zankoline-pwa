import { useEffect, useMemo, useState } from "react";
import { Search, Filter, X, CheckSquare, Square } from "lucide-react";
import { gradeStatus } from "@/helpers";
import { Badge } from "@/components/custom/Badge";
import { useLanguage } from "@/components/custom/LanguageContext";
import {
  getAllDepartmentsWithThresholds,
  type EligibleDepartment,
} from "@/db/queries";
import { governorates } from "@/data/static";
// ─── Home / Search View ───────────────────────────────────────────────────────

export function HomeView({
  // name,
  grade,
  selected,
  setSelected,
}: {
  name: string;
  grade: number;
  selected: EligibleDepartment[];
  setSelected: (s: EligibleDepartment[]) => void;
}) {
  const { t, language } = useLanguage();
  const [search, setSearch] = useState("");
  const [filterGov, setFilterGov] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [faculties, setFaculties] = useState<EligibleDepartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const govs = governorates.sort();
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getAllDepartmentsWithThresholds("2024-2025")
      .then((data) => {
        if (isMounted) {
          setFaculties(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Dexie fetch failed:", err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [grade]);

  const selectedField = (id: number): boolean =>
    selected.some((s) => s.thresholdId === id);

  const filtered = useMemo(() => {
    return faculties.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        p.universityName.toLowerCase().includes(q) ||
        p.facultyName.toLowerCase().includes(q) ||
        p.departmentName.toLowerCase().includes(q) ||
        p.governorate.toLowerCase().includes(q);
      const matchGov = !filterGov || p.governorate === filterGov;
      const status = gradeStatus(p.cutoffGeneral ?? 0, grade);
      const matchStatus = !filterStatus || status === filterStatus;
      return matchSearch && matchGov && matchStatus;
    });
  }, [search, filterGov, filterStatus, grade, faculties]);

  const allPageSelected =
    filtered.length > 0 &&
    filtered.every((p) =>
      selected.some((s) => s.thresholdId === p.thresholdId),
    );

  const toggleAll = () => {
    if (allPageSelected) {
      setSelected(
        selected.filter(
          (s) => !filtered.some((p) => p.thresholdId === s.thresholdId),
        ),
      );
    } else {
      const toAdd = filtered.filter(
        (p) => !selected.some((s) => s.thresholdId === p.thresholdId),
      );
      setSelected([...selected, ...toAdd]);
    }
  };

  const toggleRow = (id: number) => {
    if (selectedField(id)) {
      setSelected(selected.filter((x) => x.thresholdId !== id));
    } else {
      const newField = faculties.find((s) => s.thresholdId === id);
      if (!newField?.thresholdId) return;
      setSelected([...selected, newField]);
    }
  };

  const hasFilters = search || filterGov || filterStatus;
  const clearFilters = () => {
    setSearch("");
    setFilterGov("");
    setFilterStatus("");
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border bg-card px-4 md:px-6 py-4 space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              {t("searchProgramsTitle")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("searchProgramsSummary", {
                count: filtered.length,
                selected: selected.length,
              })}
            </p>
          </div>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute inset-s-3 top-1/2 -translate-y-1/2 text-muted-foreground mx-1"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full h-9 ps-8 pe-3 rounded-lg border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
            />
          </div>
          <select
            value={filterGov}
            onChange={(e) => setFilterGov(e.target.value)}
            className="h-9 px-3 rounded-lg border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition min-w-32.5"
          >
            <option value="">{t("allGovernorates")}</option>
            {govs.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-9 px-3 rounded-lg border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition min-w-30"
          >
            <option value="">{t("allStatuses")}</option>
            <option value="qualified">{t("statusQualified")}</option>
            <option value="borderline">{t("statusBorderline")}</option>
            <option value="unlikely">{t("statusUnlikely")}</option>
          </select>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="h-9 px-3 rounded-lg border border-border bg-card text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex items-center gap-1.5"
            >
              <X size={13} /> {t("clear")}
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm min-w-175">
          <thead className="sticky top-0 bg-secondary z-10">
            <tr className="border-b border-border">
              <th className="w-10 px-4 py-3 text-start cursor-pointer">
                <button
                  onClick={toggleAll}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {allPageSelected ? (
                    <CheckSquare size={15} className="text-primary" />
                  ) : (
                    <Square size={15} />
                  )}
                </button>
              </th>
              <th className="px-3 py-3 text-start font-medium text-muted-foreground whitespace-nowrap">
                #
              </th>
              <th className="px-3 py-3 text-start font-medium text-muted-foreground">
                {t("colUniversity")}
              </th>
              <th className="px-3 py-3 text-start font-medium text-muted-foreground">
                {t("colFaculty")}
              </th>
              <th className="px-3 py-3 text-start font-medium text-muted-foreground">
                {t("colDepartment")}
              </th>
              <th className="px-3 py-3 text-start font-medium text-muted-foreground whitespace-nowrap">
                {t("colGovernorate")}
              </th>
              <th className="px-3 py-3 text-start font-medium text-muted-foreground whitespace-nowrap">
                {t("colMinGrade")}
              </th>
              <th className="px-3 py-3 text-start font-medium text-muted-foreground whitespace-nowrap">
                {t("colEvening")}
              </th>
              <th className="px-3 py-3 text-start font-medium text-muted-foreground whitespace-nowrap">
                {t("colParallel")}
              </th>
              <th className="px-3 py-3 text-start font-medium text-muted-foreground">
                {t("colStatus")}
              </th>
            </tr>
          </thead>
          <tbody
            className={`divide-y divide-border ${language === "ckb" ? "" : "text-xl"}`}
          >
            {filtered.map((p, i) => {
              const isSelected = selectedField(p.thresholdId);
              const status = gradeStatus(p.cutoffGeneral ?? 0, grade);
              return (
                <tr
                  key={p.departmentId}
                  onClick={() => toggleRow(p.thresholdId)}
                  className={`cursor-pointer transition-colors ${isSelected ? "bg-accent/40" : "hover:bg-secondary/60"}`}
                >
                  <td className="px-4 py-3 cursor-pointer">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRow(p.thresholdId);
                      }}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {isSelected ? (
                        <CheckSquare size={15} className="text-primary" />
                      ) : (
                        <Square size={15} />
                      )}
                    </button>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground tabular-nums">
                    {i + 1}
                  </td>
                  <td className="px-3 py-3 font-medium text-foreground whitespace-nowrap">
                    {p.universityName}
                  </td>
                  <td className="px-3 py-3 text-foreground">{p.facultyName}</td>
                  <td className="px-3 py-3 text-muted-foreground">
                    {p.departmentName}
                  </td>
                  <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">
                    {p.governorate}
                  </td>
                  <td className="px-3 py-3 font-mono text-sm font-medium text-foreground tabular-nums">
                    {(p.cutoffGeneral ?? 0).toFixed(1)}%
                  </td>
                  <td className="px-3 py-3 font-mono text-sm font-medium text-foreground tabular-nums">
                    {(p.cutoffEvening ?? 0).toFixed(1)}%
                  </td>
                  <td className="px-3 py-3 font-mono text-sm font-medium text-foreground tabular-nums">
                    {(p.cutoffParallel ?? 0).toFixed(1)}%
                  </td>
                  <td className="px-3 py-3">
                    <Badge status={status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Filter size={32} className="mb-3 opacity-40" />
            <p className="text-sm font-medium">{t("noProgramsMatch")}</p>
            <button
              onClick={clearFilters}
              className="mt-2 text-sm text-primary hover:underline"
            >
              {t("clearFilters")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

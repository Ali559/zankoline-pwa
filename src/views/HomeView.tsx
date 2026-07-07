import { useEffect, useMemo, useState } from "react";
import { Search, Filter, X, CheckSquare, Square } from "lucide-react";
import { gradeStatus, governorateLabel } from "@/helpers";
import { Badge } from "@/components/custom/Badge";
import { useLanguage } from "@/components/custom/LanguageContext";
import {
  getAllDepartmentsWithThresholds,
  type EligibleDepartment,
} from "@/db/queries";
import { governorates } from "@/data/static";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function HomeView({
  grade,
  selected,
  setSelected,
}: {
  name: string;
  grade: number;
  selected: EligibleDepartment[];
  setSelected: (s: EligibleDepartment[]) => void;
}) {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [filterGov, setFilterGov] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
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
        p.governorate.toLowerCase().includes(q) ||
        governorateLabel(p.governorate, t).toLowerCase().includes(q);
      const matchGov =
        !filterGov ||
        filterGov === "all" ||
        p.governorate === filterGov;
      const status = gradeStatus(p.cutoffGeneral ?? 0, grade);
      const matchStatus =
        !filterStatus || filterStatus === "all" || status === filterStatus;
      return matchSearch && matchGov && matchStatus;
    });
  }, [search, filterGov, filterStatus, grade, faculties, t]);

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

  const hasFilters =
    search || (filterGov && filterGov !== "all") || (filterStatus && filterStatus !== "all");
  const clearFilters = () => {
    setSearch("");
    setFilterGov("all");
    setFilterStatus("all");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading application data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t("searchProgramsTitle")}</h1>
          <p className="page-subtitle">
            {t("searchProgramsSummary", {
              count: filtered.length,
              selected: selected.length,
            })}
          </p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-[300px] md:shrink-0">
            <Search
              size={16}
              className="absolute inset-s-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="search-input"
            />
          </div>

          <div className="flex flex-col gap-2 w-full md:flex-row md:items-center md:w-auto md:shrink-0">
            <Select value={filterGov} onValueChange={setFilterGov}>
              <SelectTrigger className="filter-select md:w-44">
                <SelectValue placeholder={t("allGovernorates")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allGovernorates")}</SelectItem>
                {govs.map((g) => (
                  <SelectItem key={g} value={g}>
                    {governorateLabel(g, t)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="filter-select md:w-40">
                <SelectValue placeholder={t("allStatuses")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allStatuses")}</SelectItem>
                <SelectItem value="qualified">{t("statusQualified")}</SelectItem>
                <SelectItem value="borderline">
                  {t("statusBorderline")}
                </SelectItem>
                <SelectItem value="unlikely">{t("statusUnlikely")}</SelectItem>
              </SelectContent>
            </Select>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="h-10 px-4 rounded-lg border border-input bg-input-background text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex items-center justify-center gap-1.5 w-full md:w-auto"
              >
                <X size={14} />
                {t("clear")}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="page-content">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <Filter size={32} className="mb-3 opacity-40" />
            <p className="text-sm font-medium">{t("noProgramsMatch")}</p>
            <button
              onClick={clearFilters}
              className="mt-3 text-sm text-foreground underline-offset-2 hover:underline"
            >
              {t("clearFilters")}
            </button>
          </div>
        ) : (
          <div className="data-table-card">
            <table className="data-table min-w-[56rem]">
              <thead>
                <tr>
                  <th className="w-12">
                    <div className="flex justify-center">
                      <button
                        onClick={toggleAll}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Toggle all"
                      >
                        {allPageSelected ? (
                          <CheckSquare size={16} className="text-primary" />
                        ) : (
                          <Square size={16} />
                        )}
                      </button>
                    </div>
                  </th>
                  <th className="w-12">#</th>
                  <th>{t("colUniversity")}</th>
                  <th>{t("colFaculty")}</th>
                  <th>{t("colDepartment")}</th>
                  <th>{t("colGovernorate")}</th>
                  <th>{t("colMinGrade")}</th>
                  <th>{t("colEvening")}</th>
                  <th>{t("colParallel")}</th>
                  <th>{t("colStatus")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => {
                  const isSelected = selectedField(p.thresholdId);
                  const status = gradeStatus(p.cutoffGeneral ?? 0, grade);
                  return (
                    <tr
                      key={p.departmentId}
                      onClick={() => toggleRow(p.thresholdId)}
                      className={`cursor-pointer ${isSelected ? "data-table-row-selected" : ""}`}
                    >
                      <td>
                        <div className="flex justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRow(p.thresholdId);
                            }}
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            {isSelected ? (
                              <CheckSquare size={16} className="text-primary" />
                            ) : (
                              <Square size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="text-muted-foreground tabular-nums">{i + 1}</td>
                      <td className="font-medium text-foreground">{p.universityName}</td>
                      <td className="text-foreground">{p.facultyName}</td>
                      <td className="text-muted-foreground">{p.departmentName}</td>
                      <td className="text-muted-foreground">
                        {governorateLabel(p.governorate, t)}
                      </td>
                      <td className="font-medium text-foreground tabular-nums">
                        {(p.cutoffGeneral ?? 0).toFixed(1)}%
                      </td>
                      <td className="font-medium text-foreground tabular-nums">
                        {(p.cutoffEvening ?? 0).toFixed(1)}%
                      </td>
                      <td className="font-medium text-foreground tabular-nums">
                        {(p.cutoffParallel ?? 0).toFixed(1)}%
                      </td>
                      <td>
                        <div className="flex justify-center">
                          <Badge status={status} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

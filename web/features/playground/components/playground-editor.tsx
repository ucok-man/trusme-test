"use client";

import { useState } from "react";
import { Play, Code, Database, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

const SOAL_1_QUERY = `WITH cleaned_data AS (
    SELECT 
        karyawan AS nama,
        kpi AS jenis_kpi,
        2::numeric AS target_task,
        COUNT(aktual) AS jumlah_aktual,
        COUNT(CASE WHEN aktual > deadline THEN 1 END) AS jumlah_late
    FROM table_kpi_marketing
    WHERE kpi IN ('Sales', 'Report')
    GROUP BY karyawan, kpi
),
kpi_kalkulasi AS (
    SELECT
        nama,
        jenis_kpi,
        target_task,
        jumlah_aktual,
        (jumlah_aktual / target_task) * 100 AS pencapaian_persen,
        (jumlah_aktual / target_task) * 50 AS bobot_didapat,
        CASE 
            WHEN jenis_kpi = 'Sales' THEN jumlah_late * 7
            WHEN jenis_kpi = 'Report' THEN jumlah_late * 5
            ELSE 0 
        END AS late_penalti
    FROM cleaned_data
),
kpi_final AS (
    SELECT *, (bobot_didapat - late_penalti) AS total_bobot
    FROM kpi_kalkulasi
),
sales AS (SELECT * FROM kpi_final WHERE jenis_kpi = 'Sales'),
report AS (SELECT * FROM kpi_final WHERE jenis_kpi = 'Report'),
karyawan AS (SELECT DISTINCT karyawan AS nama FROM table_kpi_marketing)

SELECT 
    k.nama,
    COALESCE(s.target_task, 2)::int AS sales_target,
    COALESCE(s.jumlah_aktual, 0)::int AS sales_actual,
    ROUND(COALESCE(s.pencapaian_persen, 0), 0)::text || '%' AS sales_pencapaian,
    ROUND(COALESCE(s.bobot_didapat, 0), 0)::text || '%' AS bobot_sales,
    '-' || ROUND(COALESCE(s.late_penalti, 0), 0)::text || '%' AS late_sales,
    ROUND(COALESCE(s.total_bobot, 0), 0)::text || '%' AS total_bobot_sales,
    
    COALESCE(r.target_task, 2)::int AS report_target,
    COALESCE(r.jumlah_aktual, 0)::int AS report_actual,
    ROUND(COALESCE(r.pencapaian_persen, 0), 0)::text || '%' AS report_pencapaian,
    ROUND(COALESCE(r.bobot_didapat, 0), 0)::text || '%' AS actual_bobot_report,
    '-' || ROUND(COALESCE(r.late_penalti, 0), 0)::text || '%' AS late_report,
    ROUND(COALESCE(r.total_bobot, 0), 0)::text || '%' AS total_bobot_report,
    
    ROUND(COALESCE(s.total_bobot, 0) + COALESCE(r.total_bobot, 0), 0)::text || '%' AS final_kpi
FROM karyawan k
LEFT JOIN sales s ON k.nama = s.nama
LEFT JOIN report r ON k.nama = r.nama
ORDER BY k.nama;`;

const SOAL_2_QUERY = `WITH task_status AS (
    SELECT 
        COUNT(id) AS total_task,
        COUNT(id) FILTER (WHERE aktual <= deadline) AS ontime_count,
        COUNT(id) FILTER (WHERE aktual > deadline) AS late_count
    FROM table_kpi_marketing
)
SELECT 
    ontime_count::int AS jumlah_ontime,
    late_count::int AS jumlah_late,
    ROUND((ontime_count::numeric / total_task) * 100, 1)::text || '%' AS persentase_ontime,
    ROUND((late_count::numeric / total_task) * 100, 1)::text || '%' AS persentase_late,
    total_task::int AS total_task
FROM task_status;`;

export function PlaygroundEditor() {
  const [query, setQuery] = useState(SOAL_1_QUERY);
  const [activeTab, setActiveTab] = useState("soal1");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ fields: string[], data: any[], rowCount: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/playground/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const json = await res.json();
      
      if (!res.ok) throw new Error(json.error || "Gagal mengeksekusi query.");
      setResult(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const setTab = (tab: string) => {
    setActiveTab(tab);
    if (tab === "soal1") setQuery(SOAL_1_QUERY);
    if (tab === "soal2") setQuery(SOAL_2_QUERY);
    if (tab === "custom") setQuery("SELECT * FROM table_kpi_marketing;");
    if (tab === "sandbox") setQuery("-- Area ini menggunakan schema 'sandbox_db'\n-- Anda memiliki akses CREATE TABLE di skema ini.\nCREATE TABLE sandbox_db.tes (id SERIAL PRIMARY KEY, nama TEXT);\n-- INSERT INTO sandbox_db.tes (nama) VALUES ('Trusmi');\n-- SELECT * FROM sandbox_db.tes;");
  };

  return (
    <div className="flex flex-col h-full rounded-xl border border-white/10 bg-background/50 backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* Header Tabs */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2">
        <div className="flex items-center space-x-1">
          <button onClick={() => setTab("soal1")} className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${activeTab === "soal1" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-white/5"}`}>Soal 1</button>
          <button onClick={() => setTab("soal2")} className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${activeTab === "soal2" ? "bg-blue-500/20 text-blue-400" : "text-muted-foreground hover:bg-white/5"}`}>Soal 2</button>
          <button onClick={() => setTab("custom")} className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${activeTab === "custom" ? "bg-emerald-500/20 text-emerald-400" : "text-muted-foreground hover:bg-white/5"}`}>Custom Query</button>
          <button onClick={() => setTab("sandbox")} className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${activeTab === "sandbox" ? "bg-orange-500/20 text-orange-400" : "text-muted-foreground hover:bg-white/5"}`}>Sandbox Schema</button>
        </div>
        <Button onClick={handleRun} disabled={loading} size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
          {loading ? "Running..." : <><Play weight="fill" className="mr-2" /> Run Query</>}
        </Button>
      </div>

      {/* Editor Area */}
      <div className="relative h-[400px] w-full border-b border-white/10">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-full bg-[#0d1117] text-[#e6edf3] font-mono p-4 text-sm resize-none focus:outline-none"
          spellCheck={false}
        />
        <div className="absolute bottom-2 right-4 flex items-center space-x-2 text-xs text-muted-foreground opacity-50 pointer-events-none">
          <Code /> <span>PostgreSQL 15</span>
        </div>
      </div>

      {/* Results Area */}
      <div className="flex-1 bg-[#0f1115] overflow-auto min-h-[300px] p-4">
        {error ? (
          <div className="flex items-start space-x-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
            <WarningCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="font-mono text-sm break-all">{error}</div>
          </div>
        ) : result ? (
          <div className="space-y-3">
            <div className="flex items-center text-xs text-emerald-400">
              <Database weight="fill" className="mr-1.5" /> Query OK. Returned {result.rowCount} rows.
            </div>
            {result.data.length > 0 ? (
              <div className="rounded-md border border-white/10 overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-white/5 text-muted-foreground font-semibold border-b border-white/10">
                    <tr>
                      {result.fields.map((field) => (
                        <th key={field} className="px-4 py-2 whitespace-nowrap">{field}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.data.map((row, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        {result.fields.map((field) => (
                          <td key={field} className="px-4 py-2 font-mono text-white whitespace-nowrap">
                            {row[field] !== null ? String(row[field]) : <span className="text-muted-foreground italic">null</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-muted-foreground text-sm italic">No data returned.</div>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Tekan "Run Query" untuk mengeksekusi SQL
          </div>
        )}
      </div>
    </div>
  );
}

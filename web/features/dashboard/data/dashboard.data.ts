import db from '@/lib/db';

export type KPIData = {
  nama: string;
  sales_target: number;
  sales_actual: number;
  sales_pencapaian: string;
  bobot_sales: string;
  late_sales: string;
  total_bobot_sales: string;
  report_target: number;
  report_actual: number;
  report_pencapaian: string;
  actual_bobot_report: string;
  late_report: string;
  total_bobot_report: string;
  final_kpi: string;
};

export type LeadtimeData = {
  jumlah_ontime: number;
  jumlah_late: number;
  persentase_ontime: string;
  persentase_late: string;
  total_task: number;
};

export async function getKPIData(): Promise<KPIData[]> {
  // Menggunakan Raw SQL dari Soal 1
  const result = await db.$queryRaw<KPIData[]>`
    WITH cleaned_data AS (
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
    ORDER BY k.nama;
  `;
  return result;
}

export async function getLeadtimeData(): Promise<LeadtimeData> {
  // Menggunakan Raw SQL dari Soal 2
  const result = await db.$queryRaw<any[]>`
    WITH task_status AS (
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
    FROM task_status;
  `;
  return result[0] as LeadtimeData;
}

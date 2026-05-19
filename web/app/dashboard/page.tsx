import { getKPIData, getLeadtimeData } from '@/features/dashboard/data/dashboard.data';
import { KPITable } from '@/features/dashboard/components/kpi-table';
import { KPIChart } from '@/features/dashboard/components/kpi-chart';
import { LeadtimeChart } from '@/features/dashboard/components/leadtime-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [kpiData, leadtimeData] = await Promise.all([
    getKPIData(),
    getLeadtimeData(),
  ]);

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/" className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Marketing KPI Dashboard</h2>
          <p className="text-muted-foreground">Jawaban Soal Nomor 3 dan 4</p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-background/50 backdrop-blur border-white/10 shadow-xl">
          <CardHeader>
            <CardTitle>Pencapaian KPI per Karyawan</CardTitle>
            <CardDescription>
              Soal 3: Visualisasi persentase bobot Final KPI tiap Karyawan
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <KPIChart data={kpiData} />
          </CardContent>
        </Card>
        
        <Card className="col-span-3 bg-background/50 backdrop-blur border-white/10 shadow-xl">
          <CardHeader>
            <CardTitle>Rasio Ontime vs Late</CardTitle>
            <CardDescription>
              Soal 4: Status Leadtime dari Total {leadtimeData.total_task} Task
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <LeadtimeChart data={leadtimeData} />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-background/50 backdrop-blur border-white/10 shadow-xl mt-6 overflow-hidden">
        <CardHeader>
          <CardTitle>Data Detail (Hasil Pivot Soal 1)</CardTitle>
          <CardDescription>
            Rekapitulasi lengkap berdasarkan perhitungan bobot dan penalti *late*.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-0">
          <KPITable data={kpiData} />
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { KPIData } from "../data/dashboard.data";

export function KPITable({ data }: { data: KPIData[] }) {
  return (
    <div className="rounded-md border border-white/10 w-full overflow-x-auto">
      <Table className="min-w-max">
        <TableHeader className="bg-white/5 whitespace-nowrap">
          <TableRow>
            <TableHead className="font-semibold sticky left-0 bg-[#0f1115] z-10">Nama</TableHead>
            <TableHead>Sales Target</TableHead>
            <TableHead>Sales Actual</TableHead>
            <TableHead>Sales Pencapaian</TableHead>
            <TableHead>Bobot Sales</TableHead>
            <TableHead className="text-red-400">Late Sales</TableHead>
            <TableHead className="font-semibold text-primary">Total Bobot</TableHead>
            
            <TableHead>Report Target</TableHead>
            <TableHead>Report Actual</TableHead>
            <TableHead>Report Pencapaian</TableHead>
            <TableHead>Bobot Report</TableHead>
            <TableHead className="text-red-400">Late Report</TableHead>
            <TableHead className="font-semibold text-blue-400">Total Bobot</TableHead>
            
            <TableHead className="text-right font-bold text-white text-lg">Final KPI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.nama}>
              <TableCell className="font-medium text-white sticky left-0 bg-[#0f1115] z-10">{row.nama}</TableCell>
              <TableCell>{row.sales_target}</TableCell>
              <TableCell>{row.sales_actual}</TableCell>
              <TableCell>{row.sales_pencapaian}</TableCell>
              <TableCell>{row.bobot_sales}</TableCell>
              <TableCell className="text-red-400">{row.late_sales}</TableCell>
              <TableCell className="font-semibold text-primary">{row.total_bobot_sales}</TableCell>
              
              <TableCell>{row.report_target}</TableCell>
              <TableCell>{row.report_actual}</TableCell>
              <TableCell>{row.report_pencapaian}</TableCell>
              <TableCell>{row.actual_bobot_report}</TableCell>
              <TableCell className="text-red-400">{row.late_report}</TableCell>
              <TableCell className="font-semibold text-blue-400">{row.total_bobot_report}</TableCell>
              
              <TableCell className="text-right font-bold text-white text-lg">{row.final_kpi}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

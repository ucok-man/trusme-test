"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { KPIData } from "../data/dashboard.data";

export function KPIChart({ data }: { data: KPIData[] }) {
  // Parse numeric values from string percentages for Recharts
  const chartData = data.map(item => ({
    name: item.nama,
    "KPI Sales": parseInt(item.total_bobot_sales.replace('%', '') || '0'),
    "KPI Report": parseInt(item.total_bobot_report.replace('%', '') || '0'),
    "Total KPI": parseInt(item.final_kpi.replace('%', '') || '0'),
  }));

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
            itemStyle={{ color: '#fff' }}
            formatter={(value) => [`${value}%`, undefined]}
          />
          <Legend />
          <Bar dataKey="KPI Sales" stackId="a" fill="#8b5cf6" radius={[0, 0, 4, 4]} />
          <Bar dataKey="KPI Report" stackId="a" fill="#60a5fa" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

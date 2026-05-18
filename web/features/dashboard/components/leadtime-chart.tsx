"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { LeadtimeData } from "../data/dashboard.data";

export function LeadtimeChart({ data }: { data: LeadtimeData }) {
  const chartData = [
    { name: 'Ontime', value: data.jumlah_ontime, color: '#10b981' }, // Emerald 500
    { name: 'Late', value: data.jumlah_late, color: '#ef4444' }, // Red 500
  ];

  return (
    <div className="h-[300px] w-full max-w-sm flex flex-col items-center">
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
            itemStyle={{ color: '#fff' }}
            formatter={(value) => [`${value} Tasks`, undefined]}
          />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
      
      <div className="text-center mt-2 text-sm text-muted-foreground bg-white/5 px-4 py-2 rounded-full border border-white/10">
        Total Diselesaikan: <strong className="text-white ml-1">{data.total_task} Task</strong>
      </div>
    </div>
  );
}

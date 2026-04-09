"use client";
import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ASAForm } from "@/src/types/types";

type Props = {
  tableData: ASAForm[];
};

const ASAESGPieChart: React.FC<Props> = ({ tableData }) => {
  const chartData = useMemo(() => {
    const buckets = {
      Excellent: 0,
      Good: 0,
      Satisfactory: 0,
      Critical: 0,
    };

    tableData.forEach((item) => {
      const val = parseFloat(String(item.total_esg_score || item.total_count || "0"));
      if (val >= 90) buckets.Excellent += val;
      else if (val >= 70) buckets.Good += val;
      else if (val >= 40) buckets.Satisfactory += val;
      else buckets.Critical += val;
    });

    return [
      { name: "Excellent (90-100)", value: buckets.Excellent, color: "#10b981" },
      { name: "Good (70-89)", value: buckets.Good, color: "#3b82f6" },
      { name: "Satisfactory (40-69)", value: buckets.Satisfactory, color: "#f59e0b" },
      { name: "Critical (< 40)", value: buckets.Critical, color: "#ef4444" },
    ].filter(d => d.value > 0);
  }, [tableData]);

  if (tableData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-400 italic bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
        No ESG score data available for charting
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800">ESG Performance Distribution</h2>
          <p className="text-xs text-gray-500 font-medium">Visualization of vendor scores across categories</p>
        </div>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
              label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
            />
            <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', fontWeight: '600', color: '#6b7280', paddingTop: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ASAESGPieChart;

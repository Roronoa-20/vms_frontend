"use client";
import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { ASAForm } from "@/src/types/types";

type Props = {
  tableData: ASAForm[];
};

const ASAVendorMonthWiseChart: React.FC<Props> = ({ tableData }) => {
  const chartData = useMemo(() => {
    const monthMap: Record<string, number> = {};

    tableData.forEach((item) => {
      if (!item.creation) return;
      const date = new Date(item.creation);
      if (isNaN(date.getTime())) return;
      const monthYear = date.toLocaleString("default", { month: "short", year: "numeric" });
      monthMap[monthYear] = (monthMap[monthYear] || 0) + 1;
    });

    return Object.entries(monthMap)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => {
        // Sort by date order
        const [aMonth, aYear] = a.month.split(" ");
        const [bMonth, bYear] = b.month.split(" ");
        return new Date(`${aMonth} 1, ${aYear}`).getTime() - new Date(`${bMonth} 1, ${bYear}`).getTime();
      });
  }, [tableData]);

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">ASA Forms Created (Month-wise)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#2568EF" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ASAVendorMonthWiseChart;

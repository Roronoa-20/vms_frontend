"use client";
import React, { useMemo } from "react";
import { ASAForm } from "@/src/types/types";
import { TrendingUp, AlertTriangle, CheckCircle2, ShieldCheck, Landmark } from "lucide-react";

type Props = {
  tableData: ASAForm[];
};

const ASAESGDashboardStats: React.FC<Props> = ({ tableData }) => {
  const stats = useMemo(() => {
    const buckets = {
      Excellent: { count: 0, label: "Excellent", score: "90-100", color: "emerald", icon: ShieldCheck },
      Good: { count: 0, label: "Good", score: "70-89", color: "blue", icon: CheckCircle2 },
      Satisfactory: { count: 0, label: "Satisfactory", score: "40-69", color: "amber", icon: TrendingUp },
      Critical: { count: 0, label: "Critical", score: "< 40", color: "rose", icon: AlertTriangle },
    };

    tableData.forEach((item) => {
      const val = parseFloat(String(item.total_esg_score || item.total_count || "0"));
      if (val >= 90) buckets.Excellent.count++;
      else if (val >= 70) buckets.Good.count++;
      else if (val >= 40) buckets.Satisfactory.count++;
      else buckets.Critical.count++;
    });

    return Object.values(buckets);
  }, [tableData]);

  const colorStyles: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100/50",
    blue: "bg-blue-50 text-blue-600 border-blue-100 shadow-blue-100/50",
    amber: "bg-amber-50 text-amber-600 border-amber-100 shadow-amber-100/50",
    rose: "bg-rose-50 text-rose-600 border-rose-100 shadow-rose-100/50",
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, idx) => (
        <div 
          key={idx}
          className={`relative overflow-hidden group p-4 rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
        >
          {/* Decorative background element */}
          <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 transition-transform duration-500 group-hover:scale-110 ${colorStyles[stat.color].split(' ')[0]}`} />
          
          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-gray-900 leading-none">{stat.count}</h3>
              <p className="text-[11px] font-medium text-gray-500 mt-1">Score: {stat.score}</p>
            </div>
            <div className={`p-2.5 rounded-xl border transition-all duration-300 group-hover:scale-110 shadow-sm ${colorStyles[stat.color]}`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-2 relative z-10">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all duration-1000 ease-out ${stat.color === 'emerald' ? 'bg-emerald-500' : stat.color === 'blue' ? 'bg-blue-500' : stat.color === 'amber' ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${tableData.length > 0 ? (stat.count / tableData.length) * 100 : 0}%` }}
                />
            </div>
            <span className="text-[10px] font-bold text-gray-400 leading-none">
                {tableData.length > 0 ? Math.round((stat.count / tableData.length) * 100) : 0}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ASAESGDashboardStats;

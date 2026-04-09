'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ASAFormTabs } from '@/src/constants/asaformtabs';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { useASAForm } from "@/src/hooks/useASAForm";
import { useASAFormContext } from "@/src/context/ASAFormContext";


export default function ASAFormTab() {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const currentTab = (params.get('tabtype') || '').toLowerCase();
  const vmsRefNo = params.get('vms_ref_no') || '';
  const [openTab, setOpenTab] = useState<string | null>(null);
  const { designation, asaResponsibleUser } = useAuth();
  console.log("Designation of the user---->", designation);

  const isVendor = designation?.toLowerCase() === "vendor";
  const isASA = designation?.toLowerCase() === "asa";
  const { asaFormSubmitData } = useASAForm();
  const { formProgress } = useASAFormContext();
  const isverified = asaFormSubmitData.form_is_submitted || 0;
  const isVendorLocked = isVendor && isverified === 0;
  const totalScore = asaFormSubmitData?.total_esg_score;
  const status = asaFormSubmitData?.status?.toLowerCase();
  
  const isInternal = asaResponsibleUser === 1 || isASA;
  const shouldShowScore = isInternal && totalScore !== null && totalScore !== undefined;
  console.log("Checking score rendering------->", shouldShowScore, totalScore);
  useEffect(() => {
    const parentTab = ASAFormTabs.find(tab => tab.children.some(child => child.key === currentTab));
    if (parentTab) {
      setOpenTab(parentTab.key);
    } else {
      const isMain = ASAFormTabs.find(tab => tab.key === currentTab);
      if (isMain && isMain.children.length > 0) {
        setOpenTab(currentTab);
      }
    }
  }, [currentTab]);

  const handleTabClick = (mainKey: string, subKey?: string) => {
    const tab = subKey || mainKey;
    const basePath = pathname === '/view-asa-form' ? '/view-asa-form' : '/asa-form';
    router.push(`${basePath}?tabtype=${encodeURIComponent(tab)}&vms_ref_no=${vmsRefNo}`);
  };

  const numericScore = Number(totalScore || 0);
  const getScoreColor = (score: number) => {
    if (score < 40) return {
      text: "text-red-600",
      bg: "from-red-50 to-red-100",
      stroke: "#DC2626"
    };
    if (score <= 70) return {
      text: "text-yellow-600",
      bg: "from-yellow-50 to-yellow-100",
      stroke: "#CA8A04"
    };
    return {
      text: "text-green-600",
      bg: "from-green-50 to-green-100",
      stroke: "#16A34A"
    };
  };
  const scoreTheme = getScoreColor(numericScore);
  const CircularScore = ({ score }: { score: number }) => {
    const radius = 45;
    const stroke = 8;
    const normalizedRadius = radius - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const progress = (score / 100) * circumference;
    const offset = circumference - progress;

    return (
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#E5E7EB"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={scoreTheme.stroke}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset: offset, transition: "stroke-dashoffset 0.6s ease" }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="text-sm font-bold fill-current"
        >
          {score.toFixed(0)}%
        </text>
      </svg>
    );
  };

  const getStatusUI = () => {
    if (status === "verified") {
      return {
        label: "Verified",
        icon: "✔",
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-700"
      };
    }

    return {
      label: "To be Verified",
      icon: "?",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700"
    };
  };

  const statusUI = getStatusUI();

  const overallProgress = Object.values(formProgress || {}).length
    ? Math.round(
      Object.values(formProgress as Record<string, number>).reduce((a: number, b: number) => a + Number(b), 0) /
      Object.values(formProgress as Record<string, number>).length
    )
    : 0;


  return (
    <div className="flex flex-col gap-6">
      <div className="p-3 bg-white rounded-xl shadow-sm flex flex-col gap-2">
        {ASAFormTabs.map((tab, i) => {
          const isOpen = openTab === tab.key;
          const isGovernance = tab.children.length === 0;

          return (
            <div key={i}>
              <div
                className={`flex items-center justify-between cursor-${isVendorLocked ? 'not-allowed' : 'pointer'} p-2 rounded-lg font-medium transition-all duration-150 ${currentTab === tab.key ? 'bg-[#0C72F5] text-white' : 'bg-[#E8F0F7] text-[#0C72F5] hover:bg-[#d1e3f8]'
                  }`}
                onClick={() => {
                  if (isVendorLocked) return;
                  if (isGovernance) {
                    handleTabClick(tab.key);
                  } else {
                    setOpenTab(openTab === tab.key ? null : tab.key);
                  }
                }}
              >
                {/* <span>{tab.label}</span> */}
                <div className="flex items-center justify-between w-full">
                  <span>{tab.label}</span>

                  {formProgress[tab.key] !== undefined && (
                    <span className="text-[10px] font-medium bg-blue-300 text-black px-1 py-0.5 rounded-[20px]">
                      {formProgress[tab.key as keyof typeof formProgress]}%
                    </span>
                  )}
                </div>

                {!isGovernance &&
                  (isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />)}
              </div>

              {isOpen && tab.children.length > 0 && (
                <div className="pl-4 mt-1 flex flex-col gap-2">
                  {tab.children.map((child, ci) => (
                    <div
                      key={ci}
                      onClick={() => {
                        if (isVendorLocked) return;
                        handleTabClick(tab.key, child.key);
                      }}
                      className={`cursor-${isVendorLocked ? 'not-allowed' : 'pointer'} px-3 py-1 text-wrap rounded text-sm font-medium transition ${currentTab === child.key
                        ? 'bg-[#0C72F5] text-white'
                        : 'text-[#0C72F5] hover:bg-[#d1e3f8]'
                        }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{child.label}</span>

                        {formProgress?.[child.key as keyof typeof formProgress] !== undefined && (
                          <span className="text-[10px] font-medium bg-blue-300 text-black px-1 py-0.5 rounded-[10px]">
                            {formProgress[child.key as keyof typeof formProgress]}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {shouldShowScore && (
        <div
          className={`p-5 rounded-2xl bg-gradient-to-r ${scoreTheme.bg} border shadow-sm`}
        >
          <div className="flex items-center justify-between">

            {/* Left Side - Label + Badge */}
            <div className="flex flex-col gap-2">
              <div className="text-xs uppercase tracking-wider font-semibold text-gray-600">
                Final ESG Evaluation Score
              </div>

              <div className={`text-2xl font-bold ${scoreTheme.text}`}>
                {numericScore.toFixed(2)}
              </div>

              <span className={`inline-flex items-center gap-1 w-fit px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${statusUI.bg} ${statusUI.border} ${statusUI.text}`}>
                {statusUI.icon} {statusUI.label}
              </span>

            </div>

            {/* Right Side - Circular Ring */}
            <div className="p-2">
              <CircularScore score={numericScore} />
            </div>

          </div>
        </div>
      )}
      {/* Vendor Summary */}
      {isVendor && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100 border shadow-sm">
          <div className="flex items-center justify-between">

            <div className="flex flex-col gap-2">
              <div className="text-xs uppercase tracking-wider font-semibold text-gray-600">
                Form Completion
              </div>

              <div className="text-2xl font-bold text-blue-700">
                {overallProgress}%
              </div>

              {isverified === 1 ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-green-50 border border-green-200 text-green-700">
                  ✔ Submitted
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700">
                  ⏳ In Progress
                </span>
              )}
            </div>

            <div className="p-2">
              <CircularScore score={overallProgress} />
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

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
  const { designation } = useAuth();

  const isVendor = designation?.toLowerCase() === "vendor";
  const { asaFormSubmitData } = useASAForm();
  const { formProgress } = useASAFormContext();
  const isverified = asaFormSubmitData.form_is_submitted || 0;
  const isVendorLocked = isVendor && isverified === 0;

  useEffect(() => {
    const parentTab = ASAFormTabs.find(tab =>
      tab.children.some(child => child.key === currentTab)
    );
    if (parentTab) {
      setOpenTab(parentTab.key);
    } else {
      const isMain = ASAFormTabs.find(tab => tab.key === currentTab);
      if (isMain && isMain.children.length > 0) {
        setOpenTab(currentTab);
      }
    }
  }, [currentTab]);


  // const handleTabClick = (mainKey: string, subKey?: string) => {
  //   const tab = subKey || mainKey;
  //   router.push(`/asa-form?tabtype=${encodeURIComponent(tab)}&vms_ref_no=${vmsRefNo}`);
  // };

  const handleTabClick = (mainKey: string, subKey?: string) => {
    const tab = subKey || mainKey;
    const basePath = pathname === '/view-asa-form' ? '/view-asa-form' : '/asa-form';
    router.push(`${basePath}?tabtype=${encodeURIComponent(tab)}&vms_ref_no=${vmsRefNo}`);
  };
  console.log("Sidebar progress:", formProgress);

  return (
    <div className="p-3 flex flex-col bg-white rounded-xl gap-3">
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

                {formProgress?.[tab.key as keyof typeof formProgress] !== undefined && (
                  <span className="text-xs font-semibold bg-red-800 px-2 py-0.5 rounded">
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
                    className={`cursor-${isVendorLocked ? 'not-allowed' : 'pointer'} px-3 py-1 rounded text-sm font-medium transition ${currentTab === child.key
                      ? 'bg-[#0C72F5] text-white'
                      : 'text-[#0C72F5] hover:bg-[#d1e3f8]'
                      }`}
                  >
                    {child.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

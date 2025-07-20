'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { QMSFormTabs } from '@/src/constants/vendorDetailSidebarTab';

export default function QMSFormTab() {
  const router = useRouter();
  const params = useSearchParams();

  const vendor_onboarding = params.get('vendor_onboarding') || '';
  const currentTab = (params.get('tabtype') || 'Vendor Information').toLowerCase();

  const handleTabClick = (key: string) => {
    router.push(`/qms-form?tabtype=${encodeURIComponent(key)}&vendor_onboarding=${vendor_onboarding}`);
  };

  return (
    <div className="p-3 flex flex-col bg-white rounded-xl gap-3 h-fit max-h-[80vh] overflow-y-scroll no-scrollbar">
      {QMSFormTabs.map(({ label, key }, index) => {
        const isActive = currentTab === key.toLowerCase();
        return (
          <div
            key={index}
            onClick={() => handleTabClick(key)}
            className={`cursor-pointer p-2 text-wrap rounded-lg font-medium transition-all duration-150 ${
              isActive
                ? 'bg-[#0C72F5] text-white'
                : 'bg-[#E8F0F7] text-[#0C72F5] hover:bg-[#d1e3f8]'
            }`}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
}

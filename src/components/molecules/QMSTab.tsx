'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { QMSFormTabs } from '@/src/constants/vendorDetailSidebarTab';

export default function QMSFormTab() {
    const router = useRouter();
    const params = useSearchParams();

    const vendor_onboarding = params.get('vendor_onboarding') || '';
    const ref_no = params.get('ref_no') || '';
    const company_code = params.get('company_code') || '';
    const currentTab = (params.get('tabtype') || 'vendor_information').toLowerCase();
    const companyCodes = company_code.split(',').map(code => code.trim());
    const is7000 = companyCodes.includes('7000');

    // const visibleTabs = QMSFormTabs.filter(tab => {
    //     if (is7000 && tab.key.toLowerCase() === 'quality_agreement') return false;
    //     return true;
    // });

    const handleTabClick = (key: string) => {
        router.push(`/qms-form?tabtype=${encodeURIComponent(key)}&vendor_onboarding=${vendor_onboarding}&ref_no=${ref_no}&company_code=${company_code}`);
    };

    return (
        <div className="p-3 flex flex-col bg-white rounded-xl gap-3">
            {QMSFormTabs.map(({ label, key }, index) => {
                const isActive = currentTab === key.toLowerCase();
                return (
                    <div
                        key={index}
                        onClick={() => handleTabClick(key)}
                        className={`cursor-pointer p-2 text-wrap rounded-lg font-medium transition-all duration-150 ${isActive
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

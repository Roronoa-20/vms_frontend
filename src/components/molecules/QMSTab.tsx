'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { QMSFormTabs } from '@/src/constants/vendorDetailSidebarTab';
import { useAuth } from '@/src/context/AuthContext';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";


export default function QMSFormTab() {
    const router = useRouter();
    const params = useSearchParams();

    const vendor_onboarding = params.get('vendor_onboarding') || '';
    const ref_no = params.get('ref_no') || '';
    const company_code = params.get('company_code') || '';
    const currentTab = (params.get('tabtype') || 'vendor_information').toLowerCase();
    const companyCodes = company_code.split(',').map(code => code.trim());
    const is7000 = companyCodes.includes('7000');
    const { designation } = useAuth();

    // const visibleTabs = QMSFormTabs.filter(tab => {
    //     if (is7000 && tab.key.toLowerCase() === 'quality_agreement') return false;
    //     return true;
    // });
    const handleTabClick = (key: string) => {
        router.push(`/qms-form?tabtype=${encodeURIComponent(key)}&vendor_onboarding=${vendor_onboarding}&ref_no=${ref_no}&company_code=${company_code}`);
    };

    const normalTabs = QMSFormTabs.filter(t => t.key !== "quality_agreement");
    const qaTab = QMSFormTabs.find(t => t.key === "quality_agreement");
    const accordionValue = currentTab === "quality_agreement" ? "" : "tabs";

    return (
        <div className="p-2 flex flex-col gap-3 bg-transparent">

            {/* ---------- ACCORDION GROUP ---------- */}
            <Accordion
                type="single"
                collapsible
                value={accordionValue}
                onValueChange={() => { }}
            >
                <AccordionItem value="tabs" className="border-none">

                    <AccordionTrigger className="bg-white rounded-xl p-3 shadow-sm text-left font-medium">
                        QMS Assessment Sections
                    </AccordionTrigger>

                    <AccordionContent className='pb-0'>
                        <div className="flex flex-col bg-white rounded-xl p-2 mt-2 gap-2 shadow-sm">
                            {normalTabs.map(({ label, key }, index) => {
                                const isActive = currentTab === key.toLowerCase();
                                return (
                                    <div
                                        key={index}
                                        onClick={() => handleTabClick(key)}
                                        className={`cursor-pointer p-2 rounded-lg font-medium transition-all duration-150
                                        ${isActive
                                                ? 'bg-[#0C72F5] text-white'
                                                : 'bg-[#E8F0F7] text-[#0C72F5] hover:bg-[#d1e3f8]'}`}
                                    >
                                        {label}
                                    </div>
                                );
                            })}
                        </div>
                    </AccordionContent>

                </AccordionItem>
            </Accordion>

            {/* ---------- QUALITY AGREEMENT SEPARATED ---------- */}
            {qaTab && (
                <div className="flex flex-col bg-white rounded-xl p-2 shadow-sm">
                    <div
                        onClick={() => handleTabClick(qaTab.key)}
                        className={`cursor-pointer p-2 rounded-lg font-medium transition-all duration-150
                        ${currentTab === qaTab.key.toLowerCase()
                                ? 'bg-[#0C72F5] text-white'
                                : 'bg-[#E8F0F7] text-[#0C72F5] hover:bg-[#d1e3f8]'}`}
                    >
                        {qaTab.label}
                    </div>
                </div>
            )}
        </div>
    );
}
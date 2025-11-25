'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import VMSLogo from '../atoms/vms-logo';
import QMSFormTab from '../molecules/QMSTab';
import { VendorInfoForm } from '@/src/components/templates/qms-form/vendor-info-form';
import { QASForm } from '@/src/components/templates/qms-form/qas-form';
import { OrganizationalForm } from '@/src/components/templates/qms-form/organizational-form';
import { BuildingForm } from '@/src/components/templates/qms-form/building-form';
import { MaterialForm } from '@/src/components/templates/qms-form/material-form';
import { QualityForm } from '@/src/components/templates/qms-form/quality-form';
import { ProductionForm } from '@/src/components/templates/qms-form/production-form';
import { ComplaintForm } from '@/src/components/templates/qms-form/complaint-form';
import { SupplementForm } from '@/src/components/templates/qms-form/supplement-form';
import { MLSPLQualityAgreementForm } from '@/src/components/templates/qms-form/mlspl-quality-agreement-form';
import { MDPLQualityAgreementForm } from '@/src/components/templates/qms-form/mdpl-quality-agreement-form';

export default function QMSForm() {
    const params = useSearchParams();
    const tabType = (params.get('tabtype') || 'vendor information').toLowerCase();
    const vendor_onboarding = params.get('vendor_onboarding') || '';
    const ref_no = params.get('ref_no') || '';
    const company_code = params.get('company_code') || '';
    const companyCodes = company_code.split(',').map((code) => code.trim());
    const is2000 = companyCodes.includes('2000');
    const is7000 = companyCodes.includes('7000');

    const renderFormComponent = () => {
        switch (tabType) {
            case 'vendor_information':
                return <VendorInfoForm vendor_onboarding={vendor_onboarding} ref_no={ref_no} company_code={company_code} />;
            case 'qas':
                return <QASForm vendor_onboarding={vendor_onboarding} ref_no={ref_no} />;
            case 'organizational':
                return <OrganizationalForm vendor_onboarding={vendor_onboarding} />;
            case 'building':
                return <BuildingForm vendor_onboarding={vendor_onboarding} />;
            case 'material':
                return <MaterialForm vendor_onboarding={vendor_onboarding} />;
            case 'quality':
                return <QualityForm vendor_onboarding={vendor_onboarding} />;
            case 'production':
                return <ProductionForm vendor_onboarding={vendor_onboarding} />;
            case 'complaint':
                return <ComplaintForm vendor_onboarding={vendor_onboarding} />;
            case 'supplement':
                return <SupplementForm vendor_onboarding={vendor_onboarding} ref_no={ref_no} company_code={company_code} />;
            case 'quality_agreement':
                return (
                    <>
                        {is2000 && (
                            <MLSPLQualityAgreementForm vendor_onboarding={vendor_onboarding} ref_no={ref_no} company_code={company_code}/>
                        )}
                        {is7000 && (
                            <MDPLQualityAgreementForm vendor_onboarding={vendor_onboarding} ref_no={ref_no} company_code={company_code}/>
                        )}
                    </>
                );
            default:
                return (
                    <div className="text-red-600 font-semibold">
                        Invalid tab selected: <span className="uppercase">{tabType}</span>
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col bg-gray-100">
            <div className="bg-white py-1 px-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
                <div>
                    <VMSLogo />
                </div>
                <h1 className="text-[24px] font-semibold text-gray-800">QMS Questionnaire</h1>
            </div>

            <div className="flex px-10 gap-6 py-6 min-h-screen">
                <div className="w-1/4 border-r pr-4">
                    <div className="sticky top-[100px] max-h-[80vh] overflow-y-auto no-scrollbar">
                        <QMSFormTab />
                    </div>
                </div>
                <div className="w-3/4 pt-2">
                    {renderFormComponent()}
                </div>
            </div>
        </div>
    );
}

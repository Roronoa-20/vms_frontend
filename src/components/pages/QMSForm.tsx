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
// import { QualityAgreementForm } from '@/src/components/templates/qms-form/quality-agreement-form';

export default function QMSForm() {
  const params = useSearchParams();
  const tabType = (params.get('tabtype') || 'vendor information').toLowerCase();
  const vendor_onboarding = params.get('vendor_onboarding') || '';

  const renderFormComponent = () => {
    switch (tabType) {
      case 'vendor information':
        return <VendorInfoForm vendor_onboarding={vendor_onboarding} />;
      case 'qas':
        return <QASForm vendor_onboarding={vendor_onboarding} />;
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
        return <SupplementForm vendor_onboarding={vendor_onboarding} />;
      // case 'quality agreement':
      //   return <QualityAgreementForm vendor_onboarding={vendor_onboarding} />;
      default:
        return (
          <div className="text-red-600 font-semibold">
            Invalid tab selected: <span className="uppercase">{tabType}</span>
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <div className="bg-white py-4 px-10 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <div className="w-6">
          <VMSLogo />
        </div>
        <h1 className="text-[24px] font-semibold text-gray-800">QMS Questionnaire</h1>
      </div>

      <div className="flex px-10 gap-6 py-6">
        <div className="w-1/4 border-r pr-4">
          <QMSFormTab />
        </div>

        <div className="w-3/4">
          {renderFormComponent()}
        </div>
      </div>
    </div>
  );
}

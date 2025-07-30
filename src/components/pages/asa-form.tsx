'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import VMSLogo from '../atoms/vms-logo';
import ASAFormTab from '../molecules/asa-form-tabs';
import CompanyInformationForm from '@/src/components/templates/asa-form/company-information-form';
import GeneralDisclosureSubForm from '@/src/components/templates/asa-form/general-disclosure-sub-form';
import EMSForm from '@/src/components/templates/asa-form/ems-form';
import ECMForm from '@/src/components/templates/asa-form/ece-form';
import WCMForm from '@/src/components/templates/asa-form/wcm-form';
import WasteManagementForm from '@/src/components/templates/asa-form/waste-management-form';
import GreenProductsForm from '@/src/components/templates/asa-form/green-products-form';
import BiodiversityForm from '@/src/components/templates/asa-form/biodiversity-form';
import LabourRightsForm from '@/src/components/templates/asa-form/labor-rights-form';
import GrievanceMechanismForm from '@/src/components/templates/asa-form/grievance-mechanism-form';
import EmployeeWellbeingForm from '@/src/components/templates/asa-form/employee-well-being-form';
import HealthSafetyForm from '@/src/components/templates/asa-form/health-safety-form';
import EmployeeSatisfactionForm from '@/src/components/templates/asa-form/employee-satisfaction-form';
import GovernanceForm from '@/src/components/templates/asa-form/governance-form';


export default function ASAForm() {
    const params = useSearchParams();
    const tabType = (params.get('tabtype') || 'vendor information').toLowerCase();

    const renderFormComponent = () => {
        switch (tabType) {
            case 'company_information':
                return <CompanyInformationForm />;
            case 'general_disclosures_sub':
                return <GeneralDisclosureSubForm />;
            case 'ems':
                return <EMSForm />;
            case 'ecm':
                return <ECMForm />;
            case 'wcm':
                return <WCMForm />;
            case 'water_management':
                return <WasteManagementForm />;
            case 'green_products':
                return <GreenProductsForm />;
            case 'biodiversity':
                return <BiodiversityForm />;
            case 'labour_rights':
                return <LabourRightsForm />;
            case 'grievance_mechanism':
                return <GrievanceMechanismForm />;
            case 'employee_wellbeing':
                return <EmployeeWellbeingForm />;
            case 'health_safety':
                return <HealthSafetyForm />;
            case 'employee_satisfaction':
                return <EmployeeSatisfactionForm />;
            case 'governance':
                return <GovernanceForm />;
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
            <div className="bg-white py-4 px-10 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
                <div className="w-6">
                    <VMSLogo />
                </div>
                <h1 className="text-[24px] font-semibold text-gray-800">Annual Supplier Assessment Questionnaire</h1>
            </div>

            <div className="flex px-10 gap-6 py-6">
                <div className="w-1/4 border-r pr-4">
                    <div className="sticky top-[100px] max-h-[80vh] overflow-y-auto no-scrollbar">
                        <ASAFormTab />
                    </div>
                </div>
                <div className="w-3/4">
                    {renderFormComponent()}
                </div>
            </div>
        </div>
    );
}

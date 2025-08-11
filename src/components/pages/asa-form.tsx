'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import VMSLogo from '../atoms/vms-logo';
import ASAFormTab from '../molecules/asa-form-tabs';
import CompanyInformationForm from '@/src/components/templates/asa-form/company-information-form';
import GeneralDisclosureSubForm from '@/src/components/templates/asa-form/general-disclosure-sub-form';
import EMSForm from '@/src/components/templates/asa-form/ems-form';
import ECEForm from '@/src/components/templates/asa-form/ece-form';
import WCMForm from '@/src/components/templates/asa-form/wcm-form';
import WasteManagementForm from '@/src/components/templates/asa-form/waste-management-form';
import GreenProductsForm from '@/src/components/templates/asa-form/green-products-form';
import BiodiversityForm from '@/src/components/templates/asa-form/biodiversity-form';
import LaborRightsForm from '@/src/components/templates/asa-form/labor-rights-form';
import GrievanceMechanismForm from '@/src/components/templates/asa-form/grievance-mechanism-form';
import EmployeeWellbeingForm from '@/src/components/templates/asa-form/employee-well-being-form';
import HealthSafetyForm from '@/src/components/templates/asa-form/health-safety-form';
import EmployeeSatisfactionForm from '@/src/components/templates/asa-form/employee-satisfaction-form';
import GovernanceForm from '@/src/components/templates/asa-form/governance-form';


export default function ASAForm() {
    const params = useSearchParams();
    const tabType = (params.get('tabtype') || 'company_information').toLowerCase();

    const renderFormComponent = () => {
        switch (tabType) {
            case 'company_information':
                return <CompanyInformationForm />;
            case 'general_disclosures_sub':
                return <GeneralDisclosureSubForm />;
            case 'ems':
                return <EMSForm />;
            case 'ece':
                return <ECEForm />;
            case 'wcm':
                return <WCMForm />;
            case 'waste_management':
                return <WasteManagementForm />;
            case 'green_products':
                return <GreenProductsForm />;
            case 'biodiversity':
                return <BiodiversityForm />;
            case 'labor_rights':
                return <LaborRightsForm />;
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
        <div className="flex flex-col bg-gray-200">
            <div className="min-h-screen flex px-2 gap-4 py-2">
                <div className="w-1/4 border-r border-gray-400 pr-3">
                    <div className="sticky top-[75px] overflow-y-auto no-scrollbar">
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

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import RequestorInformation from "@/src/components/molecules/material-onboarding/requestor-information";
import MaterialInformation from "@/src/components/molecules/material-onboarding/material-information";
import { MaterialRegistrationFormData } from "@/src/types/MaterialCodeRequestFormTypes";
import { MaterialCode } from '@/src/types/PurchaseRequestType';

interface DropdownData {
    material_code: MaterialCode[];
}

interface MastersData {
    companyMaster: any[];
    plantMaster: any[];
    divisionMaster: any[];
    industryMaster: any[];
    uomMaster: any[];
    mrpTypeMaster: any[];
    valuationClassMaster: any[];
    procurementTypeMaster: any[];
    valuationCategoryMaster: any[];
    materialGroupMaster: any[];
    profitCenterMaster: any[];
    priceControlMaster: any[];
    availabilityCheckMaster: any[];
    materialTypeMaster: any[];
    mrpControllerMaster: any[];
    storageLocationMaster: any[];
    classTypeMaster: any[];
    serialNumberMaster: any[];
    inspectionTypeMaster: any[];
    materialCategoryMaster: any[];
}

interface MaterialOnboardingFormProps {
    form: UseFormReturn<MaterialRegistrationFormData>;
    onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onUpdate: (e: React.MouseEvent<HTMLButtonElement>) => void;
    UserDetailsJSON: any;
    EmployeeDetailsJSON: any;
    masters: MastersData;
    AllMaterialCodes: MaterialCode[];
    showAlert: any;
    isLoading: any;
    isButtonDisabled: any
}

const MaterialOnboardingForm: React.FC<MaterialOnboardingFormProps> = ({ form, onCancel, onSubmit, onUpdate, UserDetailsJSON, EmployeeDetailsJSON, masters, AllMaterialCodes }) => {
    console.log("Masters----->", AllMaterialCodes);

    const basicMasters = {
        companyMaster: masters.companyMaster,
        plantMaster: masters.plantMaster,
        materialCategoryMaster: masters.materialCategoryMaster,
        materialTypeMaster: masters.materialTypeMaster,
        uomMaster: masters.uomMaster,
    };

    const advancedMasters = {
        mrpTypeMaster: masters.mrpTypeMaster,
        valuationClassMaster: masters.valuationClassMaster,
        procurementTypeMaster: masters.procurementTypeMaster,
        valuationCategoryMaster: masters.valuationCategoryMaster,
        materialGroupMaster: masters.materialGroupMaster,
        profitCenterMaster: masters.profitCenterMaster,
        priceControlMaster: masters.priceControlMaster,
        availabilityCheckMaster: masters.availabilityCheckMaster,
        mrpControllerMaster: masters.mrpControllerMaster,
        storageLocationMaster: masters.storageLocationMaster,
        classTypeMaster: masters.classTypeMaster,
        serialNumberMaster: masters.serialNumberMaster,
        inspectionTypeMaster: masters.inspectionTypeMaster,
        divisionMaster: masters.divisionMaster,
        industryMaster: masters.industryMaster,
    };

    return (
        <form onSubmit={onSubmit} className="bg-white p-4 rounded shadow space-y-4">
            <div className="space-y-1">
                <RequestorInformation
                    form={form}
                    UserDetails={UserDetailsJSON}
                    EmployeeDetails={EmployeeDetailsJSON}
                />

                <MaterialInformation
                    form={form}
                    basicMasters={basicMasters}
                    advancedMasters={advancedMasters}
                    AllMaterialCodes={AllMaterialCodes}
                />
            </div>

            <div className="flex justify-end space-x-5 items-center">
                <Button variant="backbtn" size="backbtnsize" onClick={onCancel}>
                    Cancel
                </Button>

                {/* Uncomment & fix these if you implement conditional Submit/Update logic */}
                <Button variant="nextbtn" size="nextbtnsize" type="submit">
                    Submit
                </Button>

                <Button variant="nextbtn" size="nextbtnsize" type="button" onClick={onUpdate}>
                    Update
                </Button>
            </div>
        </form>
    );
};

export default MaterialOnboardingForm;
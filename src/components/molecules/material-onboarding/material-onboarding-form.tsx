import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import RequestorInformation from "@/src/components/molecules/material-onboarding/requestor-information";
import MaterialInformation from "@/src/components/molecules/material-onboarding/material-information";
import { MaterialRegistrationFormData } from "@/src/types/MaterialCodeRequestFormTypes";
import { MaterialCode } from '@/src/types/PurchaseRequestType';
import AlertBox from "../../common/vendor-onboarding-alertbox";

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
    MaterialOnboardinDetails: any[];
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

const MaterialOnboardingForm: React.FC<MaterialOnboardingFormProps> = ({ form, onCancel, onSubmit, onUpdate, UserDetailsJSON, EmployeeDetailsJSON, masters, AllMaterialCodes, isLoading, showAlert }) => {
    console.log("Masters----->", masters);

    const MaterialOnboarding = {
        ...masters.MaterialOnboardinDetails[0],
    }

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

    console.log("MaterialOnboarding Details----->", MaterialOnboarding);    

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
                <Button
                    variant="backbtn"
                    size="backbtnsize"
                    onClick={onCancel}
                >
                    Cancel
                </Button>

                {/* {(MaterialOnboarding?.approval_status === "" ||
                    MaterialOnboarding?.approval_status === undefined) && ( */}
                        <Button
                            variant="nextbtn"
                            size="nextbtnsize"
                            type="submit"
                        >
                            {isLoading ? "Processing..." : "Submit"}
                        </Button>
                    {/* )} */}

                {MaterialOnboarding?.approval_status === "Re-Opened by CP" && (
                    <Button
                        variant="nextbtn"
                        size="nextbtnsize"
                        type="button"
                        onClick={onUpdate}
                    >
                        {isLoading ? "Processing..." : "Update"}
                    </Button>
                )}

                {showAlert && (
                    <AlertBox
                        content={"Your Details have been submitted successfully!"}
                        submit={showAlert}
                        url="new-material-code-request-table"
                    />
                )}
            </div>
        </form>
    );
};

export default MaterialOnboardingForm;
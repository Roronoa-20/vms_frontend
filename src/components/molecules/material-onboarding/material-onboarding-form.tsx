import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import RequestorInformation from "@/src/components/molecules/material-onboarding/requestor-information";
import MaterialInformation from "@/src/components/molecules/material-onboarding/material-information";
import { MaterialRegistrationFormData } from "@/src/types/MaterialCodeRequestFormTypes";
import { MaterialCode } from '@/src/types/PurchaseRequestType';
import AlertBox from "../../common/vendor-onboarding-alertbox";
import { EmployeeDetail, Company, UOMMaster, MaterialCategory } from "@/src/types/MaterialCodeRequestFormTypes";

interface DropdownData {
    material_code: MaterialCode[];
}

interface MastersData {
    companyMaster: Company[];
    uomMaster: UOMMaster[];
    materialCategoryMaster: MaterialCategory[];
}

interface MaterialOnboardingFormProps {
    form: UseFormReturn<MaterialRegistrationFormData>;
    onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onSubmit: (data: MaterialRegistrationFormData) => void;
    onUpdate: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onError: (errors: any) => void;
    masters: MastersData;
    showAlert: any;
    isLoading: any;
    isButtonDisabled: any;
    materialRequestList: MaterialRegistrationFormData;
    EmployeeDetailsJSON: EmployeeDetail | null;
}

const MaterialOnboardingForm: React.FC<MaterialOnboardingFormProps> = ({ form, onCancel, onSubmit, onUpdate, onError, materialRequestList, masters, isLoading, showAlert, EmployeeDetailsJSON }) => {

    const basicMasters = {
        companyMaster: masters.companyMaster,
        materialCategoryMaster: masters.materialCategoryMaster,
        uomMaster: masters.uomMaster,
    };

    return (
        // <form onSubmit={onSubmit} className="bg-white p-4 rounded shadow">
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="bg-white p-4 rounded shadow">
            <div className="space-y-4">
                <RequestorInformation
                    form={form}
                    MaterialOnboarding={materialRequestList}
                    EmployeeDetails={EmployeeDetailsJSON || {} as EmployeeDetail}
                />

                <MaterialInformation
                    form={form}
                    basicMasters={basicMasters}
                    MaterialOnboarding={materialRequestList}
                />
            </div>

            <div className="mt-12">
                <div className="flex justify-end space-x-6 items-center">
                    <Button
                        variant="backbtn"
                        size="backbtnsize"
                        className="py-2.5"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>

                    {(materialRequestList?.approval_status === "" ||
                        materialRequestList?.approval_status === undefined) && (
                            <Button
                                variant="nextbtn"
                                size="nextbtnsize"
                                type="submit"
                                className="py-2.5"
                            >
                                {isLoading ? "Processing..." : "Submit"}
                            </Button>
                        )}

                    {materialRequestList?.approval_status === "Re-Opened by CP" && (
                        <Button
                            variant="nextbtn"
                            size="nextbtnsize"
                            type="button"
                            className="py-2.5"
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
            </div>
        </form>
    );
};

export default MaterialOnboardingForm;
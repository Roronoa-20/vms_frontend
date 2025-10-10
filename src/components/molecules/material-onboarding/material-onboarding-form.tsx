import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import Alertbox from "@/src/components/common/vendor-onboarding-alertbox";
import MaterialInformation from "@/src/components/molecules/material-onboarding/material-information";
import RequestorInformation from "@/src/components/molecules/material-onboarding/requestor-information";


export default function MaterialOnboardingForm({
    form, onCancel, onSubmit, companyName, isLoading, showAlert, plantcode, UserDetails, EmployeeDetails, DivisionDetails, role,
    IndustryDetails, UnitOfMeasure, MRPType, ValuationClass, ProcurementType, ValuationCategory, MaterialGroup, companyInfo, lineItemFiles, setLineItemFiles, ProfitCenter, PriceControl, AvailabilityCheck, MaterialType, MRPController, StorageLocation, ClassType, PurchaseGroup, SerialProfile, InspectionType, MaterialDetails, materialRequestList, setMaterialRequestList, materialCompanyCode, setMaterialCompanyCode, MaterialCategory, FullName, AllMaterialCodes, MaterialOnboardingDetails, AllMaterialDetails, onUpdate
}) {

    console.log("MaterialOnboardingForm props:", MaterialOnboardingDetails)

    return (
        <Form {...form}>
            <form onSubmit={onSubmit}>
                <div className="bg-[#F4F4F6]">
                    <div className="space-y-[32px] flex flex-col justify-between p-4 bg-white rounded-[8px]">
                        <div className="space-y-1">
                            <div>
                                <RequestorInformation role={role} form={form} UserDetails={UserDetails} EmployeeDetails={EmployeeDetails} companyInfo={companyInfo} />
                            </div>

                            <div>
                                <MaterialInformation lineItemFiles={lineItemFiles} MaterialCategory={MaterialCategory}
                                    setLineItemFiles={setLineItemFiles} MRPType={MRPType} form={form} UnitOfMeasure={UnitOfMeasure} IndustryDetails={IndustryDetails} plantcode={plantcode} role={role} companyName={companyName} UserDetails={UserDetails} DivisionDetails={DivisionDetails} ValuationClass={ValuationClass} ValuationCategory={ValuationCategory} MaterialGroup={MaterialGroup} EmployeeDetails={EmployeeDetails} companyInfo={companyInfo} ProfitCenter={ProfitCenter} PriceControl={PriceControl} AvailabilityCheck={AvailabilityCheck} MaterialType={MaterialType} MRPController={MRPController} StorageLocation={StorageLocation} ClassType={ClassType} PurchaseGroup={PurchaseGroup} SerialProfile={SerialProfile} InspectionType={InspectionType} MaterialDetails={MaterialDetails} materialRequestList={materialRequestList} setMaterialRequestList={setMaterialRequestList} materialCompanyCode={materialCompanyCode} setMaterialCompanyCode={setMaterialCompanyCode} AllMaterialCodes={AllMaterialCodes} MaterialOnboardingDetails={MaterialOnboardingDetails} AllMaterialDetails={AllMaterialDetails} />
                            </div>
                        </div>


                        <div className="flex justify-end space-x-5 items-center">
                            <Button
                                variant="backbtn"
                                size="backbtnsize"
                                onClick={onCancel}
                            >
                                Cancel
                            </Button>

                            {(MaterialOnboardingDetails?.approval_status === "" ||
                                MaterialOnboardingDetails?.approval_status === undefined) && (
                                    <Button
                                        variant="nextbtn"
                                        size="nextbtnsize"
                                        type="submit"
                                    >
                                        {isLoading ? "Processing..." : "Submit"}
                                    </Button>
                                )}

                            {MaterialOnboardingDetails?.approval_status === "Re-Opened by CP" && (
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
                                <Alertbox
                                    content={"Your Details have been submitted successfully!"}
                                    submit={showAlert}
                                    url="/material-onboarding-table"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    );
}
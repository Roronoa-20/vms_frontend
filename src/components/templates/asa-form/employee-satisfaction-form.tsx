import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import YesNoNA from "@/src/components/common/YesNoNAwithFile";
import { EmployeeSatisfaction, HealthAndSafety } from "@/src/types/asatypes";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useASAForm } from "@/src/hooks/useASAForm";
import { useBackNavigation } from "@/src/hooks/useBackNavigationASAForm";


export default function Employee_Satisfaction() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const vmsRefNo = searchParams.get("vms_ref_no") || "";
    const { EmpSatisfactionForm, updateEmpSatisactionForm, refreshFormData, submitSocialForm, updateHealthSafetyForm, asaFormSubmitData } = useASAForm();
    const isverified = asaFormSubmitData.form_is_submitted || 0;

    console.log("Emp Satisfaction Form Data:", EmpSatisfactionForm);

    const isValid = Object.values(EmpSatisfactionForm).every((item) => {
        if (!item.selection) return false;
        if (item.selection === "Yes" && !item.comment.trim()) return false;
        return true;
    });

    const handleSelectionChange = (name: string, selection: "Yes" | "No" | "NA" | "") => {
        updateEmpSatisactionForm({
            ...EmpSatisfactionForm,
            [name]: {
                ...EmpSatisfactionForm[name as keyof EmployeeSatisfaction],
                selection,
            },
        });
    };

    const handleCommentChange = (name: string, comment: string) => {
        updateEmpSatisactionForm({
            ...EmpSatisfactionForm,
            [name]: {
                ...EmpSatisfactionForm[name as keyof EmployeeSatisfaction],
                comment,
            },
        });
    };

    const handleFileChange = (name: string, file: File | null) => {
        updateEmpSatisactionForm({
            ...EmpSatisfactionForm,
            [name]: {
                ...EmpSatisfactionForm[name as keyof EmployeeSatisfaction],
                file,
            },
        });
    };

    const handleSubmit = async () => {
        await submitSocialForm();
        refreshFormData();
    };

    const handleBack = useBackNavigation<HealthAndSafety>(
        "HealthSafetyForm",
        updateHealthSafetyForm,
        "health_safety",
        vmsRefNo
    );


    return (
        <div className="h-full">
            <div className="p-3 bg-white shadow-md rounded-xl">
                <div className="text-2xl font-bold text-gray-800 mb-2">Employee Satisfaction</div>
                <div className="border-b border-gray-400"></div>
                <div className="space-y-6 p-3">

                    <YesNoNA
                        name="conduct_esat"
                        label="1. Do you conduct employee satisfaction survey (ESAT)? If yes, provide the ESAT score."
                        helperText="If Yes, provide the ESAT score, and provide the details of the paramerters covered in the employee satisfaction survey."
                        value={EmpSatisfactionForm.conduct_esat}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                        required={true}
                        disabled={isverified === 1}
                        options={["Yes", "No"]}
                    />

                    {isverified !== 1 && (
                        <div className="space-x-4 flex justify-end">
                            <Button
                                className="py-2.5"
                                variant="backbtn"
                                size="backbtnsize"
                                onClick={handleBack}
                            >
                                Back
                            </Button>
                            <Button
                                className="py-2.5"
                                variant="nextbtn"
                                size="nextbtnsize"
                                onClick={handleSubmit}
                                disabled={!isValid}
                            >
                                Submit & Next
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
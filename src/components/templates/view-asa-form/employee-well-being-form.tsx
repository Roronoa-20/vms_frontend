import React, { useState, useEffect } from "react";
import YesNoNA from "@/src/components/common/YesNoNAwithFile";
import { Button } from "@/components/ui/button";
import { EmployeeWellBeing, GrievanceMechanism } from "@/src/types/asatypes";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useASAForm } from "@/src/hooks/useASAForm";
import { useBackNavigation } from "@/src/hooks/useBackNavigationASAForm";


export default function Employee_Wellbeing() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const vmsRefNo = searchParams.get("vms_ref_no") || "";
    const { refreshFormData, updateGrievnaceMechForm, EmpWellBeingForm, updateEmpWellBeingForm } = useASAForm();
    console.log("General Disclosure Form Data:", EmpWellBeingForm);

    const base64ToBlob = (base64: string): Blob => {
        const arr = base64.split(",");
        const mime = arr[0].match(/:(.*?);/)?.[1] || "";
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        return new Blob([u8arr], { type: mime });
    };


    useEffect(() => {
        const stored = localStorage.getItem("EmpWellBeingForm");
        if (stored) {
            const parsed = JSON.parse(stored);

            for (const key in parsed) {
                const entry = parsed[key];
                if (entry.file?.base64) {
                    const blob = base64ToBlob(entry.file.base64);
                    entry.file = new File([blob], entry.file.name, { type: blob.type });
                }
            }
            updateEmpWellBeingForm(parsed);
            refreshFormData();
        }
    }, []);

    const handleSelectionChange = (name: string, selection: "Yes" | "No" | "NA" | "") => {
        updateEmpWellBeingForm({
            ...EmpWellBeingForm,
            [name]: {
                ...EmpWellBeingForm[name as keyof EmployeeWellBeing],
                selection,
            },
        });
    };

    const handleCommentChange = (name: string, comment: string) => {
        updateEmpWellBeingForm({
            ...EmpWellBeingForm,
            [name]: {
                ...EmpWellBeingForm[name as keyof EmployeeWellBeing],
                comment,
            },
        });
    };

    const handleFileChange = (name: string, file: File | null) => {
        updateEmpWellBeingForm({
            ...EmpWellBeingForm,
            [name]: {
                ...EmpWellBeingForm[name as keyof EmployeeWellBeing],
                file,
            },
        });
    };

    const handleNext = () => {
        router.push(`/view-asa-form?tabtype=health_safety&vms_ref_no=${vmsRefNo}`);
    };

    const handleBack = () => {
        router.push(`/view-asa-form?tabtype=grievance_mechanism&vms_ref_no=${vmsRefNo}`);
    };

    return (
        <div className="h-full">
            <div className="p-3 bg-white shadow-md rounded-xl">
                <div className="text-2xl font-bold text-gray-800 mb-2">Employee Well-Being</div>
                <div className="border-b border-gray-400"></div>
                <div className="sapce-y-6 p-3">

                    <YesNoNA
                        name="any_emp_well_being_initiative"
                        label="1. Are there employee well-being initiatives in place? If Yes, provide the details of the initiatives."
                        helperText="If Yes, provide the details of the initiatives taken."
                        value={EmpWellBeingForm.any_emp_well_being_initiative}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                        disabled={true}
                        required={true}
                        options={["Yes", "No"]}
                    />
                    {/* <div className="space-x-4 flex justify-end">
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
                            onClick={handleNext}
                        >
                            Next
                        </Button>
                    </div> */}
                </div>
            </div>
        </div>
    )
}
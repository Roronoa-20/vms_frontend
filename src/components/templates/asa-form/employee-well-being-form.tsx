import React, { useState, useEffect } from "react";
import YesNoNA from "@/src/components/common/YesNoNAwithFile";
import { Button } from "@/components/ui/button";
import { EmployeeWellBeing, GrievanceMechanism } from "@/src/types/asatypes";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useASAForm } from "@/src/hooks/useASAForm";
import { useBackNavigation } from "@/src/hooks/useBackNavigationASAForm";
import { isValid } from "zod";


export default function Employee_Wellbeing() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const vmsRefNo = searchParams.get("vms_ref_no") || "";
    const { refreshFormData, updateGrievnaceMechForm, EmpWellBeingForm, updateEmpWellBeingForm, asaFormSubmitData } = useASAForm();
    const isverified = asaFormSubmitData.verify_by_asa_team || 0;

    console.log("General Disclosure Form Data:", EmpWellBeingForm);

    const isValid = Object.values(EmpWellBeingForm).every((item) => {
        if (!item.selection) return false;
        if (item.selection === "Yes" && !item.comment.trim()) return false;
        return true;
    });

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

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };


    const handleNext = async () => {
        console.log("Submitting Labor Rights Form and navigating to next tab:", EmpWellBeingForm);
        const EmpWellBeingFormCopy = { ...EmpWellBeingForm };

        for (const key in EmpWellBeingFormCopy) {
            const entry = EmpWellBeingFormCopy[key as keyof EmployeeWellBeing];
            if (entry.file instanceof File) {
                const base64 = await fileToBase64(entry.file);
                entry.file = {
                    url: "",
                    name: entry.file.name,
                    base64,
                };
            }
        }
        updateEmpWellBeingForm(EmpWellBeingFormCopy);
        localStorage.setItem("EmpWellBeingForm", JSON.stringify(EmpWellBeingFormCopy));
        router.push(`asa-form?tabtype=health_safety&vms_ref_no=${vmsRefNo}`);
    };

    const handleBack = useBackNavigation<GrievanceMechanism>(
        "GrievanceMechForm",
        updateGrievnaceMechForm,
        "grievance_mechanism",
        vmsRefNo
    );



    return (
        <div className="h-full">
            <div className="p-3 bg-white shadow-md rounded-xl">
                <div className="text-2xl font-bold text-gray-800 mb-2">Employee Well-Being</div>
                <div className="border-b border-gray-400"></div>
                <div className="sapce-y-6 p-3">

                    <YesNoNA
                        name="any_emp_well_being_initiative"
                        label="1. Are there employee well-being initiatives in place? If Yes, provide the details of the initiatives."
                        value={EmpWellBeingForm.any_emp_well_being_initiative}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                        required={true}
                        disabled={isverified === 1}
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
                                onClick={handleNext}
                                disabled={!isValid}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
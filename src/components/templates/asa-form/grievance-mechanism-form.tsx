import React, { useState, useEffect } from "react";
import YesNoNA from "@/src/components/common/YesNoNAwithFile";
import { Button } from "@/components/ui/button";
import { GrievanceMechanism, LaborRightsAndWorkingConditions } from "@/src/types/asatypes";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useASAForm } from "@/src/hooks/useASAForm";
import { useBackNavigation } from "@/src/hooks/useBackNavigationASAForm";

export default function Grievance_Mechanism() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const vmsRefNo = searchParams.get("vms_ref_no") || "";
    const { GrievanceMechForm, updateGrievnaceMechForm, refreshFormData, updateLaborRightsForm } = useASAForm();
    console.log("General Disclosure Form Data:", GrievanceMechForm);

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
        const stored = localStorage.getItem("GrievnaceMechForm");
        if (stored) {
            const parsed = JSON.parse(stored);

            for (const key in parsed) {
                const entry = parsed[key];
                if (entry.file?.base64) {
                    const blob = base64ToBlob(entry.file.base64);
                    entry.file = new File([blob], entry.file.name, { type: blob.type });
                }
            }
            updateGrievnaceMechForm(parsed);
            refreshFormData();
        }
    }, []);

    const handleSelectionChange = (name: string, selection: "Yes" | "No" | "NA" | "") => {
        updateGrievnaceMechForm({
            ...GrievanceMechForm,
            [name]: {
                ...GrievanceMechForm[name as keyof GrievanceMechanism],
                selection,
            },
        });
    };

    const handleCommentChange = (name: string, comment: string) => {
        updateGrievnaceMechForm({
            ...GrievanceMechForm,
            [name]: {
                ...GrievanceMechForm[name as keyof GrievanceMechanism],
                comment,
            },
        });
    };

    const handleFileChange = (name: string, file: File | null) => {
        updateGrievnaceMechForm({
            ...GrievanceMechForm,
            [name]: {
                ...GrievanceMechForm[name as keyof GrievanceMechanism],
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
        console.log("Submitting Labor Rights Form and navigating to next tab:", GrievanceMechForm);
        const GrievanceMechFormCopy = { ...GrievanceMechForm };

        for (const key in GrievanceMechFormCopy) {
            const entry = GrievanceMechFormCopy[key as keyof GrievanceMechanism];
            if (entry.file instanceof File) {
                const base64 = await fileToBase64(entry.file);
                entry.file = {
                    url: "",
                    name: entry.file.name,
                    base64,
                };
            }
        }
        updateGrievnaceMechForm(GrievanceMechFormCopy);
        localStorage.setItem("GrivanceMechForm", JSON.stringify(GrievanceMechFormCopy));
        router.push(`asa-form?tabtype=employee_wellbeing&vms_ref_no=${vmsRefNo}`);
    };

    const handleBack = useBackNavigation<LaborRightsAndWorkingConditions>(
        "LaborRightsForm",
        updateLaborRightsForm,
        "labor_rights",
        vmsRefNo
    );


    return (
        <div className="h-full">
            <div className="p-3 bg-white shadow-md rounded-xl">
                <div className="text-2xl font-bold text-gray-800 mb-2">Grievance Mechanism</div>
                <div className="border-b border-gray-400"></div>
                <div className="space-y-6 p-3">

                    <YesNoNA
                        name="have_grievance_mechanism"
                        label="1. Do you have a grievance mechanism in place which is accessible to both internal and external stakeholders, in a language which they understand?"
                        value={GrievanceMechForm.have_grievance_mechanism}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <div className="space-x-4 flex justify-end">
                        <Button
                            className="py-2.5"
                            variant="backbtn"
                            size="backbtnsize"
                            onClick={handleBack}
                        >
                            Next
                        </Button>
                        <Button
                            className="py-2.5"
                            variant="nextbtn"
                            size="nextbtnsize"
                            onClick={handleNext}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
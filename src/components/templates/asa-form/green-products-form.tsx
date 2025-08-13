import React, { useState, useEffect } from "react";
import YesNoNA from "@/src/components/common/YesNoNAwithFile";
import { Button } from "@/components/ui/button";
import { GreenProducts, WasteManagement } from "@/src/types/asatypes";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useASAForm } from "@/src/hooks/useASAForm";
import { useBackNavigation } from "@/src/hooks/useBackNavigationASAForm";


export default function Green_Products() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const vmsRefNo = searchParams.get("vms_ref_no") || "";
    const { greenProductsForm, updateGreenProductsForm, refreshFormData, updateWasteManagementForm } = useASAForm();
    console.log("Green Products Form Data:", greenProductsForm);

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
        const stored = localStorage.getItem("GreenProductsForm");
        console.log("Update Local Storage--->", stored);
        if (stored) {
            const parsed = JSON.parse(stored);

            for (const key in parsed) {
                const entry = parsed[key];
                if (entry.file?.base64) {
                    const blob = base64ToBlob(entry.file.base64);
                    entry.file = new File([blob], entry.file.name, { type: blob.type });
                }
            }
            updateGreenProductsForm(parsed);
            refreshFormData();
        }
    }, []);

    const handleSelectionChange = (name: string, selection: "Yes" | "No" | "NA" | "") => {
        updateGreenProductsForm({
            ...greenProductsForm,
            [name]: {
                ...greenProductsForm[name as keyof GreenProducts],
                selection,
            },
        });
    };

    const handleCommentChange = (name: string, comment: string) => {
        updateGreenProductsForm({
            ...greenProductsForm,
            [name]: {
                ...greenProductsForm[name as keyof GreenProducts],
                comment,
            },
        });
    };

    const handleFileChange = (name: string, file: File | null) => {
        updateGreenProductsForm({
            ...greenProductsForm,
            [name]: {
                ...greenProductsForm[name as keyof GreenProducts],
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
        console.log("Submitting WCM Form and navigating to next tab:", greenProductsForm);
        const GreenProductsCopy = { ...greenProductsForm };

        for (const key in GreenProductsCopy) {
            const entry = GreenProductsCopy[key as keyof GreenProducts];
            if (entry.file instanceof File) {
                const base64 = await fileToBase64(entry.file);
                entry.file = {
                    url: "",
                    name: entry.file.name,
                    base64,
                };
            }
        }
        updateGreenProductsForm(GreenProductsCopy);
        localStorage.setItem("GreenProductsForm", JSON.stringify(GreenProductsCopy));
        router.push(`asa-form?tabtype=biodiversity&vms_ref_no=${vmsRefNo}`);
    };

    const handleBack = useBackNavigation<WasteManagement>(
        "WasteManagementForm",
        updateWasteManagementForm,
        "waste_management",
        vmsRefNo
    );

    return (
        <div className="">
            <div className="p-3 bg-white shadow-md rounded-xl">
                <div className="text-2xl font-bold text-gray-800 mb-2">Green Products</div>
                <div className="border-b border-gray-400"></div>
                <div className="space-y-6 p-3">

                    <YesNoNA
                        name="certified_green_projects"
                        label="1. Do you have any products that has been certified as Green by the certification bodies like Green Label, Forest Stewardship Council (FSC), etc.?"
                        value={greenProductsForm.certified_green_projects}
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
                    </div>
                </div>
            </div>
        </div>
    )
}
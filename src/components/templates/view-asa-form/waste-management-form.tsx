import YesNoNA from "@/src/components/common/YesNoNAwithFile";
import { Button } from "@/components/ui/button";
import { WasteManagement, WaterConsumptionAndManagement } from "@/src/types/asatypes";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useASAForm } from "@/src/hooks/useASAForm";
import { useBackNavigation } from "@/src/hooks/useBackNavigationASAForm";



export default function Waste_Management() {
    const searchParams = useSearchParams();
    const vmsRefNo = searchParams.get("vms_ref_no") || "";
    const router = useRouter();
    const { wastemanagementForm, updateWasteManagementForm, updateWcmForm, refreshFormData } = useASAForm();

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
        const stored = localStorage.getItem("WasteManagementForm");
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
            updateWasteManagementForm(parsed);
            refreshFormData();
        }
    }, []);

    const handleSelectionChange = (name: string, selection: "Yes" | "No" | "NA" | "") => {
        updateWasteManagementForm({
            ...wastemanagementForm,
            [name]: {
                ...wastemanagementForm[name as keyof WasteManagement],
                selection,
            },
        });
    };

    const handleCommentChange = (name: string, comment: string) => {
        updateWasteManagementForm({
            ...wastemanagementForm,
            [name]: {
                ...wastemanagementForm[name as keyof WasteManagement],
                comment,
            },
        });
    };

    const handleFileChange = (name: string, file: File | null) => {
        updateWasteManagementForm({
            ...wastemanagementForm,
            [name]: {
                ...wastemanagementForm[name as keyof WasteManagement],
                file,
            },
        });
    };

    // const fileToBase64 = (file: File): Promise<string> => {
    //     return new Promise((resolve, reject) => {
    //         const reader = new FileReader();
    //         reader.readAsDataURL(file);
    //         reader.onload = () => resolve(reader.result as string);
    //         reader.onerror = (error) => reject(error);
    //     });
    // };

    // const handleNext = async () => {
    //     console.log("Submitting WCM Form and navigating to next tab:", wastemanagementForm);
    //     const WasteManagementCopy = { ...wastemanagementForm };

    //     for (const key in WasteManagementCopy) {
    //         const entry = WasteManagementCopy[key as keyof WasteManagement];
    //         if (entry.file instanceof File) {
    //             const base64 = await fileToBase64(entry.file);
    //             entry.file = {
    //                 url: "",
    //                 name: entry.file.name,
    //                 base64,
    //             };
    //         }
    //     }
    //     updateWasteManagementForm(WasteManagementCopy);
    //     localStorage.setItem("WasteManagementForm", JSON.stringify(WasteManagementCopy));
    //     router.push(`asa-form?tabtype=green_products&vms_ref_no=${vmsRefNo}`);
    // };

    // const handleBack = useBackNavigation<WaterConsumptionAndManagement>(
    //     "WCMForm",
    //     updateWcmForm,
    //     "wcm",
    //     vmsRefNo
    // );

    const handleNext = () => {
        router.push(`/view-asa-form?tabtype=green_products&vms_ref_no=${vmsRefNo}`);
    };

    const handleBack = () => {
        router.push(`/view-asa-form?tabtype=wcm&vms_ref_no=${vmsRefNo}`);
    };


    return (
        <div className="h-full">
            <div className="p-3 bg-white shadow-md rounded-xl">
                <div className="text-2xl font-bold text-gray-800 mb-2">Waste Management</div>
                <div className="border-b border-gray-400"></div>
                <div className="space-y-6 p-3">

                    <YesNoNA
                        name="track_waste_generation"
                        label="1. Does the company track the waste generation and keep the record different categories of waste?"
                        value={wastemanagementForm.track_waste_generation}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                        disabled={true}

                    />

                    <YesNoNA
                        name="handover_waste_to_authorized_vendor"
                        label="2. Does the company handover the waste to the authorized vendors?"
                        value={wastemanagementForm.handover_waste_to_authorized_vendor}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                        disabled={true}

                    />

                    <YesNoNA
                        name="vendor_audits_for_waste_management"
                        label="3. Does the company conduct vendor audits for waste management?"
                        value={wastemanagementForm.vendor_audits_for_waste_management}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                        disabled={true}

                    />

                    <YesNoNA
                        name="have_epr_for_waste_management"
                        label="4. Does your company have an Extended Producer Responsibility (EPR) program in place for plastic waste management?"
                        value={wastemanagementForm.have_epr_for_waste_management}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                        disabled={true}

                    />

                    <YesNoNA
                        name="have_goals_to_reduce_waste"
                        label="5. Does the company have goals, initiatives, and targets to reduce, recycle, and reuse waste, including hazardous waste? If yes, provide the initiative details."
                        value={wastemanagementForm.have_goals_to_reduce_waste}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                        disabled={true}

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
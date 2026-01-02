import YesNoNA from "@/src/components/common/YesNoNAwithFile";
import { Button } from "@/components/ui/button";
import { WaterConsumptionAndManagement, EnergyConsumptionAndEmission } from "@/src/types/asatypes";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useASAForm } from "@/src/hooks/useASAForm";
import { useSearchParams } from "next/navigation";
import { useBackNavigation } from "@/src/hooks/useBackNavigationASAForm";


export default function Water_Consumption_And_Management() {
    const searchParams = useSearchParams();
    const vmsRefNo = searchParams.get("vms_ref_no") || "";
    const router = useRouter();
    const { wcmform, updateWcmForm, refreshFormData, updateEceForm } = useASAForm();
    console.log("Energy Consumption and Emission Form Data:", wcmform);

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
        const stored = localStorage.getItem("WCMForm");
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
            updateWcmForm(parsed);
            refreshFormData();
        }
    }, []);

    const handleSelectionChange = (name: string, selection: "Yes" | "No" | "NA" | "") => {
        updateWcmForm({
            ...wcmform,
            [name]: {
                ...wcmform[name as keyof WaterConsumptionAndManagement],
                selection,
            },
        });
    };

    const handleCommentChange = (name: string, comment: string) => {
        updateWcmForm({
            ...wcmform,
            [name]: {
                ...wcmform[name as keyof WaterConsumptionAndManagement],
                comment,
            },
        });
    };

    const handleFileChange = (name: string, file: File | null) => {
        updateWcmForm({
            ...wcmform,
            [name]: {
                ...wcmform[name as keyof WaterConsumptionAndManagement],
                file,
            },
        });
    };

    const handleNext = () => {
        router.push(`/view-asa-form?tabtype=waste_management&vms_ref_no=${vmsRefNo}`);
    };

    const handleBack = () => {
        router.push(`/view-asa-form?tabtype=ece&vms_ref_no=${vmsRefNo}`);
    };



    return (
        <div className="h-full">
            <div className="p-3 bg-white shadow-md rounded-xl">
                <div className="text-2xl font-bold text-gray-800 mb-2">Water Consumption and Management</div>
                <div className="border-b border-gray-400"></div>
                <div className="spave-y-6 p-3">

                    <YesNoNA
                        name="water_source_tracking"
                        label="1. Whether the company tracks and identifies the sources of its water (e.g. groundwater, municipal water sourced from the local water body, harvested rainwater, etc.)?"
                        helperText="If Yes, provide the details of water sources being used and the quantity of water consumed from each water source."
                        value={wcmform.water_source_tracking}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                        disabled={true}
                        required={true}
                        options={["Yes", "No"]}
                    />

                    <YesNoNA
                        name="have_permission_for_groundwater"
                        label="2. Do you have the permission for groundwater withdrawal, if applicable?"
                        helperText="If Yes, upload the copy of the permission."
                        value={wcmform.have_permission_for_groundwater}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                        disabled={true}
                        required={true}
                        fileRequired={true}
                    />

                    <YesNoNA
                        name="has_system_to_track_water_withdrawals"
                        label="3. Whether the company has a system in place to track and measure water withdrawals, consumption, and disposal?"
                        helperText="If Yes, provide the details about the sytems in place to track and measure the water withdrawals, consumption, and disposal."
                        value={wcmform.has_system_to_track_water_withdrawals}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                        disabled={true}
                        required={true}
                        options={["Yes", "No"]}

                    />

                    <YesNoNA
                        name="have_facility_to_recycle_wastewater"
                        label="4. Do you have a facility (Effluent Treatment Plan/Sewage Treatment Plant) to recycle wastewater generated?"
                        helperText="If Yes, provide the quantity of waste water recycled during the year."
                        value={wcmform.have_facility_to_recycle_wastewater}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                        disabled={true}
                        required={true}
                        options={["Yes", "No"]}

                    />

                    <YesNoNA
                        name="have_zld_strategy"
                        label="5. Does your company have a Zero Liquid Discharge (ZLD) strategy in place to minimize or eliminate wastewater discharge?"
                        helperText="If Yes, provide the details about the initiatives taken to implement ZLD strategy."
                        value={wcmform.have_zld_strategy}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                        disabled={true}
                        required={true}
                        options={["Yes", "No"]}

                    />

                    <YesNoNA
                        name="have_initiatives_to_increase_water_efficiency"
                        label="6. Does the company have initiatives in place to increase water use efficiency? If yes, provide the initiative details."
                        helperText="If Yes, provide the details about the initiatives taken to increase the efficiency of water use."
                        value={wcmform.have_initiatives_to_increase_water_efficiency}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                        disabled={true}
                        required={true}
                        options={["Yes", "No"]}

                    />

                    <YesNoNA
                        name="have_targets_to_reduce_water_consumption"
                        label="7. Do you have any targets to reduce freshwater consumption or waste water recycling? If yes, mention the targets."
                        helperText="If Yes, provide the details of the target taken and the target year."
                        value={wcmform.have_targets_to_reduce_water_consumption}
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
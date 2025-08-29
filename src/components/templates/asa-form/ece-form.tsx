import React, { useEffect } from "react";
import YesNoNA from "@/src/components/common/YesNoNAwithFile";
import { Button } from "@/components/ui/button";
import { EnergyConsumptionAndEmission, EnvironmentalManagementSystem } from "@/src/types/asatypes";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useASAForm } from "@/src/hooks/useASAForm";
import { useBackNavigation } from "@/src/hooks/useBackNavigationASAForm";

export default function Energy_Consumption_And_Emission() {
    const searchParams = useSearchParams();
    const vmsRefNo = searchParams.get("vms_ref_no") || "";
    const router = useRouter();
    const { eceform, updateEceForm, updateEmsForm, refreshFormData } = useASAForm();
    console.log("Energy Consumption and Emission Form Data:", eceform);

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
        const stored = localStorage.getItem("ECEForm");
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
            updateEceForm(parsed);
            refreshFormData();
        }
    }, []);

    const handleSelectionChange = (name: string, selection: "Yes" | "No" | "NA" | "") => {
        updateEceForm({
            ...eceform,
            [name]: {
                ...eceform[name as keyof EnergyConsumptionAndEmission],
                selection,
            },
        });
    };

    const handleCommentChange = (name: string, comment: string) => {
        updateEceForm({
            ...eceform,
            [name]: {
                ...eceform[name as keyof EnergyConsumptionAndEmission],
                comment,
            },
        });
    };

    const handleFileChange = (name: string, file: File | null) => {
        updateEceForm({
            ...eceform,
            [name]: {
                ...eceform[name as keyof EnergyConsumptionAndEmission],
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
        console.log("Submitting ECE Form and navigating to next tab:", eceform);
        const eceCopy = { ...eceform };

        for (const key in eceCopy) {
            const entry = eceCopy[key as keyof EnergyConsumptionAndEmission];
            if (entry.file instanceof File) {
                const base64 = await fileToBase64(entry.file);
                entry.file = {
                    url: "",
                    name: entry.file.name,
                    base64,
                };
            }
        }
        updateEceForm(eceCopy);
        localStorage.setItem("ECEForm", JSON.stringify(eceCopy));
        router.push(`asa-form?tabtype=wcm&vms_ref_no=${vmsRefNo}`);
    };

    const handleBack = useBackNavigation<EnvironmentalManagementSystem>(
        "EMSForm",
        updateEmsForm,
        "ems",
        vmsRefNo
    );

    return (
        <div className="h-full">
            <div className="p-3 bg-white shadow-md rounded-xl">
                <div className="text-2xl font-bold text-gray-800 mb-2">Energy Consumption and Emission</div>
                <div className="border-b border-gray-400"></div>
                <div className="p-3 space-y-6">
                    <YesNoNA
                        name="energy_consumption_tracking"
                        label="1. Does your company track energy consumption? If yes, provide the total energy consmed."
                        value={eceform.energy_consumption_tracking}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />

                    <YesNoNA
                        name="company_track_greenhouse_gas"
                        label="2. Does your company track greenhouse gas emissions? If yes, provide the scope 1, 2 and 3 GHG emissions. Provide the Scope emissions category wise."
                        value={eceform.company_track_greenhouse_gas}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />

                    <YesNoNA
                        name="consume_renewable_energy"
                        label="3. Do you consume renewable energy? If yes, provide % of total electricity consumption coming from renewable sources."
                        value={eceform.consume_renewable_energy}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />

                    <YesNoNA
                        name="have_system_to_control_air_emission"
                        label="4.Does your company have systems in place to control air emissions? If yes, provide the details."
                        value={eceform.have_system_to_control_air_emission}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />

                    <YesNoNA
                        name="have_target_for_increase_renewable_share"
                        label="5. Do you have a target in place to increase the renewable energy share? If yes, mention the target."
                        value={eceform.have_target_for_increase_renewable_share}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />

                    <YesNoNA
                        name="have_target_to_reduce_energy_consumption"
                        label="6. Do you have a target in place to reduce the energy consumption? If yes, mention the target."
                        value={eceform.have_target_to_reduce_energy_consumption}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />

                    <YesNoNA
                        name="have_plan_to_improve_energy_efficiency"
                        label="7. Do you have a plan to improve energy efficiency of process and assets? If yes, list down the initiatives."
                        value={eceform.have_plan_to_improve_energy_efficiency}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />

                    <YesNoNA
                        name="have_targets_to_reduce_emission"
                        label="8. Do you have initiatives and targets in place to reduce emission? If yes, provide the target details."
                        value={eceform.have_targets_to_reduce_emission}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />

                    <YesNoNA
                        name="pcf_conducted"
                        label="9. Do you do PFC (Product Carbon Footprinting) of your products?"
                        value={eceform.pcf_conducted}
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
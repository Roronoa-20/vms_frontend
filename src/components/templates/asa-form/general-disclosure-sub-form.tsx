import React from "react";
import { Button } from "@/components/ui/button";
import YesNoNA from "@/src/components/common/YesNoNAwithFile";
import { useRouter, useSearchParams } from "next/navigation";
import { GeneralDisclosureData, CompanyInformation } from "@/src/types/asatypes";
import { useASAForm } from "@/src/hooks/useASAForm";
import { useBackNavigation } from "@/src/hooks/useBackNavigationASAForm";

export default function General_Disclosure_Form() {
    const router = useRouter();
    const params = useSearchParams();
    const vmsRefNo = params.get("vms_ref_no") || "";
    const { generalDisclosure, updateGeneralDisclosure, submitForm, refreshFormData, updateCompanyInfo } = useASAForm();
    console.log("General Disclosure Form Data:", generalDisclosure);

    const handleSelectionChange = (name: string, selection: "Yes" | "No" | "NA" | "") => {
        updateGeneralDisclosure({
            ...generalDisclosure,
            [name]: {
                ...generalDisclosure[name as keyof GeneralDisclosureData],
                selection,
            },
        });
    };

    const handleCommentChange = (name: string, comment: string) => {
        updateGeneralDisclosure({
            ...generalDisclosure,
            [name]: {
                ...generalDisclosure[name as keyof GeneralDisclosureData],
                comment,
            },
        });
    };

    const handleFileChange = (name: string, file: File | null) => {
        updateGeneralDisclosure({
            ...generalDisclosure,
            [name]: {
                ...generalDisclosure[name as keyof GeneralDisclosureData],
                file,
            },
        });
    };

    const handleSubmit = async () => {
        await submitForm();
        refreshFormData();
    };

    const handleBack = useBackNavigation<CompanyInformation>(
        "companyInfo",
        updateCompanyInfo,
        "company_information",
        vmsRefNo
    );

    return (
        <div className="h-full">
            <div className="p-3 bg-white shadow-md rounded-xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">General Disclosure</h2>
                <div className="border-b border-gray-300 dark:border-gray-700 mb-2" />

                <div className="space-y-6 p-2">
                    <YesNoNA
                        name="valid_consent_from_pollution_control"
                        label="1. Does the company hold valid Consent to Operate (CTO) from the Pollution Control Board? If yes, provide the expiry date of the Consent."
                        value={generalDisclosure.valid_consent_from_pollution_control}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                        customYesInputType="date"
                    />

                    <YesNoNA
                        name="recycle_plastic_package_material"
                        label="2. Do you use recycled plastic/paper in the packaging materials?"
                        value={generalDisclosure.recycle_plastic_package_material}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />

                    <YesNoNA
                        name="plans_for_recycle_materials"
                        label="3. Do you have plans/strategy in place to increase the use of recycled materials in the packaging materials?"
                        value={generalDisclosure.plans_for_recycle_materials}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />

                    <div className="flex justify-end gap-4">
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
                        >
                            Submit & Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

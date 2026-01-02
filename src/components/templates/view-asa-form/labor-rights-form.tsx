import React, { useState, useEffect } from "react";
import YesNoNA from "@/src/components/common/YesNoNAwithFile";
import { Button } from "@/components/ui/button";
import { LaborRightsAndWorkingConditions } from "@/src/types/asatypes";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useASAForm } from "@/src/hooks/useASAForm";
import { useBackNavigation } from "@/src/hooks/useBackNavigationASAForm";

export default function Labor_Rights_And_Working_Conditions() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const vmsRefNo = searchParams.get("vms_ref_no") || "";
    const { LaborRightsForm, updateLaborRightsForm, refreshFormData } = useASAForm();
    console.log("General Disclosure Form Data:", LaborRightsForm);

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
        const stored = localStorage.getItem("LaborRightsForm");
        if (stored) {
            const parsed = JSON.parse(stored);

            for (const key in parsed) {
                const entry = parsed[key];
                if (entry.file?.base64) {
                    const blob = base64ToBlob(entry.file.base64);
                    entry.file = new File([blob], entry.file.name, { type: blob.type });
                }
            }
            updateLaborRightsForm(parsed);
            refreshFormData();
        }
    }, []);

    const handleSelectionChange = (name: string, selection: "Yes" | "No" | "NA" | "") => {
        updateLaborRightsForm({
            ...LaborRightsForm,
            [name]: {
                ...LaborRightsForm[name as keyof LaborRightsAndWorkingConditions],
                selection,
            },
        });
    };

    const handleCommentChange = (name: string, comment: string) => {
        updateLaborRightsForm({
            ...LaborRightsForm,
            [name]: {
                ...LaborRightsForm[name as keyof LaborRightsAndWorkingConditions],
                comment,
            },
        });
    };

    const handleFileChange = (name: string, file: File | null) => {
        updateLaborRightsForm({
            ...LaborRightsForm,
            [name]: {
                ...LaborRightsForm[name as keyof LaborRightsAndWorkingConditions],
                file,
            },
        });
    };

    const handleNext = () => {
        router.push(`/view-asa-form?tabtype=grievance_mechanism&vms_ref_no=${vmsRefNo}`);
    };

    const handleBack = () => {
        router.push(`/view-asa-form?tabtype=biodiversity&vms_ref_no=${vmsRefNo}`);
    };

    return (
        <div className="h-full">
            <div className="p-3 bg-white shadow-md rounded-xl">
                <div className="text-2xl font-bold text-gray-800 mb-2">Labor Rights and Working Conditions</div>
                <div className="border-b border-gray-400"></div>
                <div className="spacce-y-6 p-3">

                    <YesNoNA
                        name="have_prohibition_policy_of_child_labor"
                        label="1. Does the company have a policy on prohibition of child labor and forced labor?"
                        helperText="If Yes, attach the policy."
                        value={LaborRightsForm.have_prohibition_policy_of_child_labor}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                        disabled={true}
                        required={true}
                        fileRequired={true}
                        options={["Yes", "No"]}
                    />

                    <YesNoNA
                        name="age_verification_before_hiring"
                        label="2. Does the company obtain proof of Age documentation from all potential employees and workers and review the documents for authenticity prior to hiring?"
                        helperText="If Yes, provide details of the hiring process."
                        value={LaborRightsForm.age_verification_before_hiring}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                        disabled={true}
                        required={true}
                        options={["Yes", "No"]}

                    />

                    <YesNoNA
                        name="ensure_modern_slavery_labor_policy"
                        label="3. Does the company ensure that no forced, bonded, indentured or involuntary prison labor, human trafficking, or any form of modern slavery takes place in their operations and their supply chain?"
                        helperText="If Yes, provide the details of the practices to ensure the same."
                        value={LaborRightsForm.ensure_modern_slavery_labor_policy}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                        disabled={true}
                        required={true}
                        options={["Yes", "No"]}
                        
                    />


                    <YesNoNA
                        name="have_non_discrimination_policy"
                        label="4. Does the company have a non-discrimination policy communicated to all employees and workers?"
                        helperText="If Yes, attach the policy."
                        value={LaborRightsForm.have_non_discrimination_policy}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                        required={true}
                        fileRequired={true}
                        disabled={true}
                        options={["Yes", "No"]}
                    />

                    <YesNoNA
                        name="has_setup_safety_report_incidents"
                        label="5. Has the company established a procedure, accessible and known to all employees and workers, where workers can safely report incidents of workplace discrimination?"
                        helperText="If Yes, provide details about the procedures in place."
                        value={LaborRightsForm.has_setup_safety_report_incidents}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                        disabled={true}
                        required={true}
                        options={["Yes", "No"]}
                    />

                    <YesNoNA
                        name="pending_legal_cases_workplace_harassment"
                        label="6. Are there any legal cases pending regarding workplace harassment? If yes, provide details."
                        helperText="If Yes, provide the details of the pending cases."
                        value={LaborRightsForm.pending_legal_cases_workplace_harassment}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                        disabled={true}
                        required={true}
                        options={["Yes", "No"]}
                    />

                    <YesNoNA
                        name="comply_minimum_wage_law_regulation"
                        label="7. Does your company comply with all applicable minimum wage laws and regulations in the countries where you operate?"
                        helperText="If Yes, provide the details how you ensure to provide the minimum wages."
                        value={LaborRightsForm.comply_minimum_wage_law_regulation}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                        disabled={true}
                        required={true}
                        options={["Yes", "No"]}
                    />

                    <YesNoNA
                        name="legal_working_hours"
                        label="8. Are working hours within the legal limit (9 hours pr day, 48 hours per week)?"
                        helperText="If Yes, provide the policy document where the working hours are specified."
                        value={LaborRightsForm.legal_working_hours}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                        disabled={true}
                        required={true}
                        options={["Yes", "No"]}

                    />

                    <YesNoNA
                        name="work_hrs_track_by_company"
                        label="9. Are working hours and attendance tracked by the company and authenticated by employees and workers?"
                        helperText="If Yes, provide details of the procedures in place to track working hours and attendance."
                        value={LaborRightsForm.work_hrs_track_by_company}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                        disabled={true}
                        required={true}
                        options={["Yes", "No"]}
                    />

                    <YesNoNA
                        name="has_diversity_inclusion_policy"
                        label="10. Whether the company has a Diversity and inclusion policy covering anti-discrimination and anti-harassment, equal opportunity, etc?"
                        helperText="If Yes, attach the copy of the policy."
                        value={LaborRightsForm.has_diversity_inclusion_policy}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                        disabled={true}
                        required={true}
                        fileRequired={true}
                        options={["Yes", "No"]}

                    />

                    <YesNoNA
                        name="have_target_to_promote_diversity"
                        label="11. Do you have initiatives and targets in place to promote diversity and inclusion? If Yes, provide the details."
                        helperText="If Yes, provide the details of the target taken and the target year."
                        value={LaborRightsForm.have_target_to_promote_diversity}
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
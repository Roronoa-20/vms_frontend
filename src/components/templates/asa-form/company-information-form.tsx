
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import Form_Input from "@/src/components/common/FormInput";
import Textarea_Input from "@/src/components/common/TextareaWithLabel";
import { useRouter } from "next/navigation";
import { useAuth } from '@/src/context/AuthContext';
import { useASAForm } from "@/src/hooks/useASAForm";


export default function Company_Information_Form() {
    const router = useRouter();
    const params = useSearchParams();
    const vmsRefNo = params.get("vms_ref_no") || "";
    const { companyInfo, updateCompanyInfo, asaFormSubmitData } = useASAForm();
    const { name } = useAuth();
    const isverified = asaFormSubmitData.form_is_submitted || 0;

    const isFormValid = Boolean(
        companyInfo.name_of_the_company?.selection?.trim() &&
        companyInfo.location?.selection?.trim() &&
        companyInfo.name_of_product?.selection?.trim()
    );


    useEffect(() => {
        if (!name) return;

        if (!companyInfo.name_of_the_company?.selection?.trim()) {
            updateCompanyInfo({
                ...companyInfo,
                name_of_the_company: {
                    ...companyInfo.name_of_the_company,
                    selection: name,
                },
            });
        }
    }, [name]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "name_of_the_company" || name === "location" || name === "name_of_product") {
            updateCompanyInfo({
                ...companyInfo,
                [name]: {
                    ...companyInfo[name],
                    selection: value,
                },
            });
            return;
        }

        updateCompanyInfo({
            ...companyInfo,
            [name]: value,
        });
    };


    const handleNext = () => {
        console.log("Submitting Company Info and navigating to next tab:", companyInfo);
        updateCompanyInfo(companyInfo);
        localStorage.setItem("companyInfo", JSON.stringify(companyInfo));
        router.push(`asa-form?tabtype=general_disclosures_sub&vms_ref_no=${vmsRefNo}`);
    };


    return (
        <div className="mt-1 p-2 bg-white rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Company Information</h2>

            <div className="border-b border-gray-300 dark:border-gray-700 mb-2" />
            <div className="space-y-6 p-2">
                <Form_Input
                    name="name_of_the_company"
                    value={companyInfo.name_of_the_company?.selection || ""}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    label="1. Name of the Company"
                    required={true}
                    disabled={isverified === 1 || Boolean(name)}
                />

                <Textarea_Input
                    name="location"
                    label="2. Location (Full Address)"
                    value={companyInfo.location?.selection || ""}
                    onChange={handleChange}
                    placeholder="Enter full address"
                    disabled={isverified === 1}
                    required={true}
                />

                <Form_Input
                    name="name_of_product"
                    value={companyInfo.name_of_product?.selection || ""}
                    onChange={handleChange}
                    placeholder="e.g., Medical devices, logistics services"
                    label="3. Name of the product/products/services supplied/provided to Meril"
                    disabled={isverified === 1}
                    required={true}
                />
                {isverified !== 1 && (
                    <div className="flex justify-end">
                        <Button
                            className="py-2.5"
                            variant="nextbtn"
                            size="nextbtnsize"
                            onClick={handleNext}
                            disabled={!isFormValid}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
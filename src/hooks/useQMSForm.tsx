
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from "next/navigation";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { VendorQMSForm } from '@/src/types/qmstypes';
import { QMSFormTabs } from "@/src/constants/vendorDetailSidebarTab";
import SignatureCanvas from 'react-signature-canvas';


export const useQMSForm = (vendor_onboarding: string, currentTab: string) => {
    const [formData, setFormData] = useState<VendorQMSForm>({} as VendorQMSForm);
    const sigCanvas = useRef<SignatureCanvas | null>(null);
    const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
    const router = useRouter();
    const params = useSearchParams();
    const ref_no = params.get("ref_no") || "";

    const childTableMappings: Partial<Record<keyof VendorQMSForm, string>> = {
        have_documentsprocedure: "procedure_doc_name",
        quality_control_system: "quality_control_system",
        if_yes_for_prior_notification: "qms_prior_notification",
        inspection_reports: "qms_inspection_report",
        details_of_batch_records: "qms_batch_record"
    };


    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const response = await requestWrapper({
                    url: API_END_POINTS.qmsformdetails,
                    method: 'GET',
                    params: { vendor_onboarding },
                });

                const data = response?.data?.message?.qms_details || {};
                const hydratedForm: any = { ...data };

                for (const [fieldKey, childField] of Object.entries(childTableMappings)) {
                    if (Array.isArray(hydratedForm[fieldKey])) {
                        hydratedForm[fieldKey] = hydratedForm[fieldKey].map(item => item[childField] || "");
                    }
                }
                console.log('Fetched QMS Form Data:', hydratedForm);
                setFormData(hydratedForm);
            } catch (error) {
                console.error('Error fetching QMS form data:', error);
            }
        };

        fetchFormData();
    }, [vendor_onboarding]);

    const handleApproval = async () => {
        try {
            const {
                name,
                conclusion_by_meril,
                assessment_outcome,
                performer_name,
                performer_title,
                performent_date,
                vendor_signature
            } = formData;

            const payload = {
                name,
                conclusion_by_meril,
                assessment_outcome,
                performer_name,
                performer_title,
                performent_date,
                performer_esignature: vendor_signature,
                qms_form_status: "Approved"
            };
            console.log("QMS Form Approval Payload:", payload);
            const response = await requestWrapper({
                url: API_END_POINTS.qmsformapproval,
                method: 'POST',
                data: {
                    data: payload
                }
            });
            // console.log("QMS Form Approval Response:", response);
            if (response?.data?.message?.status === "success") {
                alert("QMS Form Approved Successfully!");
            } else {
                alert("Approval failed. Please try again.");
            }

            console.log("QMS Form Approval Response:", response?.data);
        } catch (error) {
            console.error("Error during QMS form approval:", error);
            alert("Something went wrong while approving.");
        }
    };

    const handleSaveSignature = () => {
        if (sigCanvas.current?.isEmpty()) {
            alert("Please provide a signature before saving.");
            return;
        }
        const dataUrl = sigCanvas.current?.toDataURL();
        setSignaturePreview(dataUrl || null);
        setFormData((prev) => ({ ...prev, vendor_signature: dataUrl || "" }));
    };

    const handleClearSignature = () => {
        sigCanvas.current?.clear();
        setSignaturePreview(null);
        setFormData((prev) => ({ ...prev, vendor_signature: "" }));
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof VendorQMSForm) => {
        const { value } = e.target;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSingleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof VendorQMSForm) => {
        const { value, checked } = e.target;
        setFormData((prev) => ({ ...prev, [field]: checked ? value : '' }));
    };

    const handleMultipleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof VendorQMSForm) => {
        const { value, checked } = e.target;
        setFormData((prev) => {
            const existing = Array.isArray(prev[field]) ? [...(prev[field] as string[])] : [];
            return {
                ...prev,
                [field]: checked
                    ? [...existing, value]
                    : existing.filter((v) => v !== value),
            };
        });
    };

    function handleNewMultipleCheckboxChange(values: string[], field: string) {
        setFormData((prev) => ({
            ...prev,
            [field]: values[0] || "", // Store as a single string
        }));
    }

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof formData) => {
        const { value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [field]: checked ? value : "",
        }));
    };

    const handleSubmit = async () => {
        try {
            const transformedFormData = { ...formData };

            for (const [fieldKey, childField] of Object.entries(childTableMappings)) {
                const value = (formData as any)[fieldKey];
                if (Array.isArray(value)) {
                    (transformedFormData as any)[fieldKey] = value.map((v: string) => ({
                        [childField]: v,
                    }));
                }
            }


            const payload = {
                vendor_onboarding,
                ref_no,
                data: transformedFormData,
            };

            console.log("🚀 Final Payload to Submit:", payload);

            const res = await fetch(API_END_POINTS?.qmsformsubmit, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await res.json();
            console.log("📥 API Response:", result);

            if (result?.message?.status === "success") {
                const currentIndex = QMSFormTabs.findIndex((tab) =>
                    tab.key.toLowerCase() === currentTab.toLowerCase()
                );
                const nextTab = QMSFormTabs[currentIndex + 1]?.key;

                if (nextTab) {
                    router.push(
                        `/qms-form?vendor_onboarding=${vendor_onboarding}&ref_no=${ref_no}&tabtype=${encodeURIComponent(nextTab)}`
                    );
                } else {
                    alert("All forms completed! 🏁");
                }
            } else {
                console.error("🛑 API Failure:", result);
            }
        } catch (error) {
            console.error("❌ Submission Error:", error);
        }
    };


    const handleBack = () => {
        const currentIndex = QMSFormTabs.findIndex(tab => tab.key.toLowerCase() === currentTab.toLowerCase());
        const backTab = QMSFormTabs[currentIndex - 1]?.key;

        if (backTab) {
            router.push(`/qms-form?vendor_onboarding=${vendor_onboarding}&ref_no=${ref_no}&tabtype=${encodeURIComponent(backTab)}`);
        } else {
            alert('You’re at the first tab.');
        }
    };


    const handleSignatureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setSignaturePreview(base64String);
            setFormData((prev) => ({ ...prev, vendor_signature: base64String }));
        };
        reader.readAsDataURL(file);
    };


    return {
        formData,
        setFormData,
        handleTextareaChange,
        handleSingleCheckboxChange,
        handleMultipleCheckboxChange,
        handleRadioboxChange: handleSingleCheckboxChange,
        handleSubmit,
        handleBack,
        handleCheckboxChange,
        handleSaveSignature,
        handleClearSignature,
        handleSignatureUpload,
        signaturePreview,
        sigCanvas,
        handleApproval,
        handleNewMultipleCheckboxChange
    };
};


import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { QMSForm } from '@/src/types/qmstypes';
import { QMSFormTabs } from "@/src/constants/vendorDetailSidebarTab";
import SignatureCanvas from 'react-signature-canvas';


export const useQMSForm = (vendor_onboarding: string, currentTab: string) => {
    const [formData, setFormData] = useState<QMSForm>({} as QMSForm);
    const sigCanvas = useRef<SignatureCanvas | null>(null);
    const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const response = await requestWrapper({
                    url: API_END_POINTS.qmsformdetails,
                    method: 'GET',
                    params: { vendor_onboarding },
                });

                const data = response?.data?.message?.qms_details || {};
                console.log('Fetched QMS Form Data:', data);
                setFormData(data);
            } catch (error) {
                console.error('Error fetching QMS form data:', error);
            }
        };

        fetchFormData();
    }, [vendor_onboarding]);

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

    const handleTextareaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,field: keyof QMSForm) => {
        const { value } = e.target;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };


    const handleSingleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof QMSForm) => {
        const { value, checked } = e.target;
        setFormData((prev) => ({ ...prev, [field]: checked ? value : '' }));
    };

    const handleMultipleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof QMSForm) => {
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

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof formData) => {
        const { value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [field]: checked ? value : "",
        }));
    };

    const handleSubmit = () => {
        const currentIndex = QMSFormTabs.findIndex((tab) => tab.toLowerCase() === currentTab);
        const nextTab = QMSFormTabs[currentIndex + 1];
        if (nextTab) {
            router.push(`/qms-details?vendor_onboarding=${vendor_onboarding}&tabtype=${encodeURIComponent(nextTab)}`);
        } else {
            alert('You’ve reached the last tab.');
        }
    };

    const handleBack = () => {
        const currentIndex = QMSFormTabs.findIndex((tab) => tab.toLowerCase() === currentTab);
        const backTab = QMSFormTabs[currentIndex - 1];
        if (backTab) {
            router.push(`/qms-details?vendor_onboarding=${vendor_onboarding}&tabtype=${encodeURIComponent(backTab)}`);
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
    reader.readAsDataURL(file); // base64 conversion
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
        sigCanvas
    };
};

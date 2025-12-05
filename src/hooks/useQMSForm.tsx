
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from "next/navigation";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { VendorQMSForm, VendorQualityAgreementForm } from '@/src/types/qmstypes';
import { QMSFormTabs } from "@/src/constants/vendorDetailSidebarTab";
import { ViewQMSFormTabs } from "@/src/constants/vendorDetailSidebarTab";
import SignatureCanvas from 'react-signature-canvas';
import { useAuth } from '../context/AuthContext';

export const useQMSForm = (vendor_onboarding: string, currentTab: string) => {
    const formRef = useRef<HTMLInputElement | null>(null);
    const [formData, setFormData] = useState<VendorQMSForm>({} as VendorQMSForm);
    const [qualityagreementData, setQualityAgreementData] = useState<VendorQualityAgreementForm>({} as VendorQualityAgreementForm);
    const sigCanvas = useRef<SignatureCanvas | null>(null);
    const sigRefs = {
        vendor_signature: useRef<SignatureCanvas>(null),
        person_signature: useRef<SignatureCanvas>(null),
        performer_esignature: useRef<SignatureCanvas>(null),
        ssignature: useRef<SignatureCanvas>(null),
        meril_signature: useRef<SignatureCanvas | null>(null),
        performer_signature: useRef<SignatureCanvas | null>(null),
    };
    const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
    const [signaturePreviews, setSignaturePreviews] = useState<{ [key: string]: string }>({});

    const router = useRouter();
    const { designation } = useAuth();
    const params = useSearchParams();
    const ref_no = params.get("ref_no") || "";
    const company_code = params.get("company_code") || "";
    const [documentTypes, setDocumentTypes] = useState<{ name: string; sample_document: any }[]>([]);
    const [selectedDocumentType, setSelectedDocumentType] = useState<string>("");
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [fileSelected, setFileSelected] = useState(false);
    const [fileName, setFileName] = useState<string>("");
    const [tableData, setTableData] = useState<any[]>([]);
    const [approvalRemark, setApprovalRemark] = useState("");
    const [savedFormsData, setSavedFormsData] = useState<Record<string, any>>({});
    const formDataRef = useRef<VendorQMSForm>({} as VendorQMSForm);
    const companyCodes = company_code.split(',').map((code) => code.trim());

    const is2000 = companyCodes.includes('2000');
    const is7000 = companyCodes.includes('7000');
    const visibleTabs = ViewQMSFormTabs.filter(tab => {
        if (is7000 && tab.key.toLowerCase() === 'quality_agreement') return false;
        return true;
    });

    useEffect(() => {
        formDataRef.current = formData;
    }, [formData]);

    useEffect(() => {
        const fetchDocumentTypes = async () => {
            try {
                const response = await requestWrapper({
                    url: API_END_POINTS.qmsqadocumenttypelist,
                    method: "GET",
                });

                const types = response?.data?.message?.data || [];
                setDocumentTypes(types);
            } catch (error) {
                console.error("Failed to fetch document types:", error);
            }
        };

        fetchDocumentTypes();
    }, []);


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
                setFormData(prev => ({
                    ...prev,
                    ...data,
                }));
            } catch (error) {
                console.error('Error fetching QMS form data:', error);
            }
        };

        fetchFormData();
    }, [vendor_onboarding]);

    useEffect(() => {
        const fetchQualityAgreementData = async () => {
            try {
                const response = await requestWrapper({
                    url: API_END_POINTS.getqualityagreementdetails,
                    method: 'GET',
                    params: { vendor_onboarding },
                });

                const data = response?.data?.message || {};
                console.log('Fetched QMS Form Data:', data);
                setQualityAgreementData(prev => ({
                    ...prev,
                    ...data,
                }));
            } catch (error) {
                console.error('Error fetching QMS form data:', error);
            }
        };

        fetchQualityAgreementData();
    }, [vendor_onboarding]);

    useEffect(() => {
        if (savedFormsData[currentTab]) {
            setFormData(savedFormsData[currentTab]);
            console.log(`Hydrated form data from savedFormsData for tab: ${currentTab}`);
        }
    }, [currentTab]);


    useEffect(() => {
        if (Array.isArray(formData?.mlspl_qa_list)) {
            const normalized = formData.mlspl_qa_list.map((item) => ({
                document_type: item.document_type || item.option || "",
                fileURL: item.qa_attachment || item.document_template || "",
                fileName: (item.qa_attachment || item.document_template || "").split("/").pop(),
            }));
            setTableData(normalized);
        } else {
            setTableData([]);
        }
    }, [formData?.mlspl_qa_list]);

    const handleDateChange = (key: keyof VendorQMSForm, value: string) => {
        setFormData((prev) => {
            const updated = { ...prev, [key]: value };
            formDataRef.current = updated;
            return updated;
        });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field?: keyof VendorQMSForm) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            setUploadedFile(file);
            setFileSelected(true);

            if (field === "quality_manual") {
                setFormData((prev) => ({
                    ...prev,
                    quality_manual: file,
                }));
            }
        }
    };

    const handleRemoveFile = (fieldName: keyof VendorQMSForm) => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: "",
        }));
    };

    const clearFileSelection = () => {
        if (formRef.current) formRef.current.value = "";
        setFileSelected(false);
        setFileName("");
    };

    const handleAdd = () => {
        if (!selectedDocumentType || !fileName || !uploadedFile) {
            alert("Please select a document type and upload a file before adding.");
            return;
        }
        const fileURL = URL.createObjectURL(uploadedFile);
        setTableData([
            ...tableData,
            {
                document_type: selectedDocumentType,
                fileName,
                fileURL,
            },
        ]);
        clearFileSelection();
        setUploadedFile(null);
    };

    const handleDelete = (index: number) => {
        const updated = [...tableData];
        updated.splice(index, 1);
        setTableData(updated);
    };

    const saveFormDataLocally = (tabName: string, data: Record<string, any>) => {
        setSavedFormsData(prev => ({
            ...prev,
            [tabName]: {
                ...(prev[tabName] || {}),
                ...data,
            },
        }));
    };

    const handleApproval = async () => {
        try {
            const { name, conclusion_by_meril, assessment_outcome, performer_name, performer_title, performent_date, performer_esignature } = formData;

            const basepayload = { name, conclusion_by_meril, assessment_outcome, performer_name, performer_title, performent_date, performer_esignature: performer_esignature, qms_form_status: "Approved" };
            console.log("QMS Form Approval Payload:", basepayload);

            let approvalFlag: Record<string, number> = {};

            if (designation === "Purchase Team") {
                approvalFlag = { purchase_team_approved: 1 };
            } else if (designation === "QA Team") {
                approvalFlag = { qa_team_approved: 1 };
            } else if (designation === "QA Head") {
                approvalFlag = { qa_head_approved: 1 };
            }

            const payload = {
                ...basepayload,
                ...approvalFlag,
            };
            console.log("QMS Form Approval Payload:", payload);

            const response = await requestWrapper({
                url: API_END_POINTS.qmsformapproval,
                method: 'POST',
                data: {
                    data: payload
                }
            });
            if (response?.data?.message?.status === "success") {
                handleApporvalMatrix()
            } else {
                alert("Approval failed. Please try again.");
            }

            console.log("QMS Form Approval Response:", response?.data);
        } catch (error) {
            console.error("Error during QMS form approval:", error);
            alert("Something went wrong while approving.");
        }
    };

    const handleApporvalMatrix = async () => {
        try {

            const payload = {
                qms_id: formData.name,
                remark: approvalRemark,
                action: "Approved"
            };
            console.log("QMS Form Approval Payload:", payload);

            const response = await requestWrapper({
                url: API_END_POINTS.qmsformapprovalmatrix,
                method: 'POST',
                data: payload
            });
            // console.log("QMS Form Approval Response:", response);
            if (response?.data?.message?.status === "Approved") {
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


    const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSignaturePreviews((prev) => ({
                    ...prev,
                    [fieldName]: reader.result as string
                }));
            };
            reader.readAsDataURL(file);
        } else {
            setSignaturePreviews((prev) => ({
                ...prev,
                [fieldName]: "PDF_UPLOADED"
            }));
        }
        // setFormData((prev: any) => ({
        //     ...prev,
        //     vendor_sign_attachment: file,
        //     signature: file,
        //     vendor_signature: file,
        //     attach_person_signature: file,
        //     attach_meril_signature: file,
        // }));
        setFormData((prev: any) => ({
            ...prev,
            [fieldName]: file,   // only update the field that was actually uploaded
        }));

    };


    const handleClearSignature = (field: string) => {
        setSignaturePreviews((prev) => ({
            ...prev,
            [field]: "",
        }));

        setFormData((prev) => ({
            ...prev,
            vendor_sign_attachment: "",
            signature: "",
            vendor_signature: "",
            [field]: "",
        }));
    };

    const handleTextareaChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: keyof VendorQMSForm
    ) => {
        const { value } = e.target;
        setFormData((prev) => {
            const updated = { ...prev, [field]: value };
            formDataRef.current = updated;
            return updated;
        });
    };

    const handleChange = (field: string, value: string) => {
        setFormData((prev: any) => ({
            ...prev,
            [field]: value,
        }));
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
            [field]: values[0] || "",
        }));
    }

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof formData) => {
        const { value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [field]: checked ? value : "",
        }));
    };


    const handleNext = () => {
        saveFormDataLocally(currentTab, formData);
        const currentIndex = QMSFormTabs.findIndex((tab) => tab.key.toLowerCase() === currentTab.toLowerCase());
        const nextTab = QMSFormTabs[currentIndex + 1]?.key;

        if (nextTab) {
            router.push(`/qms-form?tabtype=${encodeURIComponent(nextTab)}&vendor_onboarding=${vendor_onboarding}&ref_no=${ref_no}&company_code=${company_code}`);
        }
    };

    const handleBack = () => {
        saveFormDataLocally(currentTab, formData);
        const currentIndex = QMSFormTabs.findIndex(tab => tab.key.toLowerCase() === currentTab.toLowerCase());
        const backTab = QMSFormTabs[currentIndex - 1]?.key;

        if (backTab) {
            router.push(`/qms-form?tabtype=${encodeURIComponent(backTab)}&vendor_onboarding=${vendor_onboarding}&ref_no=${ref_no}&company_code=${company_code}`);
        } else {
            alert('You’re at the first tab.');
        }
    };

    const handleNextTab = () => {
        saveFormDataLocally(currentTab, formData);
        const currentIndex = visibleTabs.findIndex((tab) => tab.key.toLowerCase() === currentTab.toLowerCase());
        const nextTab = visibleTabs[currentIndex + 1]?.key;

        if (nextTab) {
            router.push(`/qms-form-details?tabtype=${encodeURIComponent(nextTab)}&vendor_onboarding=${vendor_onboarding}&company_code=${company_code}`);
        }
    };

    const handleBacktab = () => {
        saveFormDataLocally(currentTab, formData);
        const currentIndex = visibleTabs.findIndex(tab => tab.key.toLowerCase() === currentTab.toLowerCase());
        const backTab = visibleTabs[currentIndex - 1]?.key;

        if (backTab) {
            router.push(`/qms-form-details?tabtype=${encodeURIComponent(backTab)}&vendor_onboarding=${vendor_onboarding}&company_code=${company_code}`);
        } else {
            alert('You’re at the first tab.');
        }
    };

    const handleDocumentTypeChange = (value: string) => {
        setSelectedDocumentType(value);
        const selected = documentTypes.find((doc) => doc.name === value);
        if (selected && selected.sample_document?.url) {
            const link = document.createElement("a");
            link.href = selected.sample_document.url;
            link.download = selected.sample_document.file_name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            console.log("Example format downloaded. Please upload the filled file.");
            alert("Example format document downloaded. Upload the file in that format only.");
        }
    };

    return {
        formData, setFormData, handleTextareaChange, handleSingleCheckboxChange, handleMultipleCheckboxChange, handleRadioboxChange: handleSingleCheckboxChange, handleBack, handleCheckboxChange, handleClearSignature, handleSignatureUpload, signaturePreview, sigRefs, handleApproval, handleNewMultipleCheckboxChange, setSignaturePreview, documentTypes, selectedDocumentType, setSelectedDocumentType, handleDocumentTypeChange, handleAdd, clearFileSelection, handleFileUpload, handleDelete, tableData, fileSelected, fileName, handleRemoveFile, signaturePreviews, setSignaturePreviews, handleNext, savedFormsData, setSavedFormsData, saveFormDataLocally, handleDateChange, sigCanvas, handleNextTab, handleBacktab, handleChange, approvalRemark, setApprovalRemark, handleApporvalMatrix, setQualityAgreementData, qualityagreementData
    };
};
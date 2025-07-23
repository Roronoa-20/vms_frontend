
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from "next/navigation";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { VendorQMSForm } from '@/src/types/qmstypes';
import { QMSFormTabs } from "@/src/constants/vendorDetailSidebarTab";
import SignatureCanvas from 'react-signature-canvas';


export const useQMSForm = (vendor_onboarding: string, currentTab: string) => {
    const formRef = useRef<HTMLInputElement | null>(null);
    const [formData, setFormData] = useState<VendorQMSForm>({} as VendorQMSForm);
    // const sigCanvas = useRef<SignatureCanvas | null>(null);
    const sigRefs = {
        vendor_signature: useRef<SignatureCanvas>(null),
        person_signature: useRef<SignatureCanvas>(null),
        performer_esignature: useRef<SignatureCanvas>(null),
        ssignature: useRef<SignatureCanvas>(null),
        meril_signature: useRef<SignatureCanvas | null>(null),
        performer_signature: useRef<SignatureCanvas | null>(null),
    };
    const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
    const [signaturePreviews, setSignaturePreviews] = useState<{
        [key: string]: string;
    }>({});

    const router = useRouter();
    const params = useSearchParams();
    const ref_no = params.get("ref_no") || "";
    const company_code = params.get("company_code") || "";
    const [documentTypes, setDocumentTypes] = useState<{ name: string; sample_document: any }[]>([]);
    const [selectedDocumentType, setSelectedDocumentType] = useState<string>("");
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [fileSelected, setFileSelected] = useState(false);
    const [fileName, setFileName] = useState<string>("");
    const [tableData, setTableData] = useState<any[]>([]);
    const [savedFormsData, setSavedFormsData] = useState<Record<string, any>>({});
    const formDataRef = useRef<VendorQMSForm>({} as VendorQMSForm);
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
                setFormData(data);
            } catch (error) {
                console.error('Error fetching QMS form data:', error);
            }
        };

        fetchFormData();
    }, [vendor_onboarding]);

    useEffect(() => {
        if (Array.isArray(formData?.mlspl_qa_list) && formData.mlspl_qa_list.length) {
            setTableData(formData.mlspl_qa_list);
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
                option: selectedDocumentType,
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

            const payload = { name, conclusion_by_meril, assessment_outcome, performer_name, performer_title, performent_date, performer_esignature: performer_esignature, qms_form_status: "Approved" };
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

    // const handleSaveSignature = (field: keyof typeof sigRefs) => {
    //     const canvasRef = sigRefs[field];
    //     if (canvasRef.current) {
    //         const trimmedCanvas = canvasRef.current.getTrimmedCanvas();
    //         const signatureData = trimmedCanvas.toDataURL('image/png');

    //         setFormData((prev) => ({
    //             ...prev,
    //             signatures: {
    //                 ...(prev.signatures || {}),
    //                 [field]: {
    //                     signature_data: signatureData,
    //                 },
    //             },
    //         }));

    //         setSignaturePreviews((prev) => ({
    //             ...prev,
    //             [field]: signatureData,
    //         }));
    //     }
    // };


    const handleSaveSignature = (
        field: "performer_signature" | "performer_esignature" | "vendor_signature" | "person_signature" | "ssignature" | "meril_signature"
    ) => {
        const canvasRef = sigRefs[field];
        if (canvasRef.current) {
            const trimmedCanvas = canvasRef.current.getTrimmedCanvas();
            const signatureData = trimmedCanvas.toDataURL('image/png');

            setSignaturePreviews((prev) => ({
                ...prev,
                [field]: signatureData,
            }));

            setFormData((prev) => {
                const newFormData = { ...prev };

                if (field === "performer_signature") {
                    newFormData.attachments = {
                        ...(prev.attachments || {}),
                        [field]: signatureData,
                    };
                } else if (field === "performer_esignature") {
                    newFormData.signatures = {
                        ...(prev.signatures || {}),
                        [field]: signatureData,
                    };
                } else if (field === "ssignature") {
                    newFormData.signatures = {
                        ...(prev.signatures || {}),
                        [field]: {
                            content: signatureData,
                        },
                    };
                } else {
                    newFormData.signatures = {
                        ...(prev.signatures || {}),
                        [field]: {
                            signature_data: signatureData,
                        },
                    };
                }
                // saveFormDataLocally(currentTab, newFormData);
                formDataRef.current = newFormData
                return newFormData;
            });
        }
    };

    const handleClearSignature = (field: keyof typeof sigRefs) => {
        const canvasRef = sigRefs[field];
        if (canvasRef.current) {
            canvasRef.current.clear();
            setFormData((prev) => ({
                ...prev,
                signatures: {
                    ...(prev.signatures || {}),
                    [field]: {
                        signature_data: '',
                    },
                },
            }));
        }
    };

    // const handleTextareaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof VendorQMSForm) => {
    //     const { value } = e.target;
    //     setFormData((prev) => ({ ...prev, [field]: value }));
    // };

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

    const convertToBase64 = (file: File | Blob): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (err) => reject(err);
        });

    const handleSubmit = async () => {
        // return
        try {
            let qualityManualPayload = null;
            let qualityManualFile: File | null = null;

            if (
                formData.quality_manual &&
                typeof formData.quality_manual !== "string"
            ) {
                qualityManualFile = formData.quality_manual as File;
            }

            if (qualityManualFile) {
                const base64 = await convertToBase64(qualityManualFile);
                qualityManualPayload = {
                    content: base64.split(",")[1],
                    filename: qualityManualFile.name,
                    content_type: qualityManualFile.type,
                };
            }

            const qaList = await Promise.all(
                tableData.map(async (item) => {
                    const response = await fetch(item.fileURL);
                    const blob = await response.blob();
                    const base64 = await convertToBase64(blob);

                    return {
                        document_type: item.option,
                        qa_attachment: {
                            content: base64.split(",")[1],
                            filename: item.fileName,
                            content_type: blob.type,
                        },
                    };
                })
            );

            const companyCodes = company_code.split(",").map(code => code.trim());
            const companyPayload: Record<string, string> = {};

            if (companyCodes.includes("2000")) {
                companyPayload.for_company_2000 = "1";
            }

            if (companyCodes.includes("7000")) {
                companyPayload.for_company_7000 = "1";
            }

            const isLastTab = QMSFormTabs[QMSFormTabs.length - 1].key.toLowerCase() === currentTab.toLowerCase();
            if (isLastTab) {
                companyPayload.form_fully_submitted = "1";
            }

            const payload = {
                vendor_onboarding,
                ref_no,
                data: {
                    ...formData,
                    ...companyPayload,
                    // ...formDataRef.current,
                    mdpl_qa_date: formData.date,
                    quality_manual: qualityManualFile?.name || "",
                    mlspl_qa_list: qaList,
                    products_in_qa: formData.materials_supplied || [],
                },
                // signatures: formData.signatures || {},
                signatures: Object.entries(formData.signatures || {}).reduce((acc, [key, value]) => {
                    if (typeof value === 'string') {
                        acc[key] = value;
                    } else if (value?.signature_data) {
                        acc[key] = value.signature_data;
                    } else if (value?.content) {
                        acc[key] = value.content;
                    }
                    return acc;
                }, {} as Record<string, string>),
            };

            console.log("Final Payload to backend:", payload);
            // return
            const res = await fetch(API_END_POINTS.qmsformsubmit, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await res.json();
            console.log("REsult of API--->", result)

            if (result?.message?.status === "success") {
                if (isLastTab) {
                    alert("This is the last tab and your QMS Form is fully submitted.");
                }
                handleNext();
            } else {
                alert("Something went wrong.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Unexpected error occurred.");
        }
    };

    // const handleSubmit = async () => {
    //     console.log("All Saved Forms Data:", savedFormsData);
    //     // saveFormDataLocally(currentTab, formData);
    //     try {
    //         const updatedFormsData = {
    //             ...savedFormsData,
    //             [currentTab]: formData,
    //         };
    //         const mergedData = Object.values(updatedFormsData).reduce(
    //             (acc, tabData) => {
    //                 const { signatures, ...rest } = tabData;
    //                 return {
    //                     ...acc,
    //                     ...rest,
    //                     signatures: {
    //                         ...acc.signatures,
    //                         ...signatures,
    //                     },
    //                 };
    //             },
    //             { signatures: {} }
    //         );
    //         console.log("Merged Signatures", Object.keys(mergedData.signatures || {}));
    //         const companyCodes = company_code.split(",").map(code => code.trim());
    //         const companyPayload: Record<string, string> = {};

    //         if (companyCodes.includes("2000")) companyPayload.for_company_2000 = "1";
    //         if (companyCodes.includes("7000")) companyPayload.for_company_7000 = "1";

    //         const isLastTab = QMSFormTabs[QMSFormTabs.length - 1].key.toLowerCase() === currentTab.toLowerCase();
    //         if (isLastTab) companyPayload.form_fully_submitted = "1";
    //         const qaList = await Promise.all(
    //             tableData.map(async (item) => {
    //                 const response = await fetch(item.fileURL);
    //                 const blob = await response.blob();
    //                 const base64 = await convertToBase64(blob);

    //                 return {
    //                     document_type: item.option,
    //                     file: {
    //                         // content: base64.split(",")[1],
    //                         filename: item.fileName,
    //                         // content_type: blob.type,
    //                     },
    //                 };
    //             })
    //         );

    //         const finalPayload = {
    //             vendor_onboarding,
    //             ref_no,
    //             data: {
    //                 ...mergedData,
    //                 ...companyPayload,
    //                 mlspl_qa_list: qaList,
    //                 signatures: mergedData.signatures || {},
    //             },
    //         };
    //         console.log("Signatures in final payload:", finalPayload.data.signatures || mergedData.signatures);
    //         console.log("Final Payload before API", finalPayload);
    //         // return
    //         const res = await fetch(API_END_POINTS.qmsformsubmit, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(finalPayload),
    //         });

    //         const result = await res.json();
    //         console.log("Result of API-->", result)

    //         if (result?.message?.status === "success") {
    //             console.log("QMS Form submitted successfully");
    //             alert("QMS Form submitted successfully");
    //             handleNext();

    //         } else {
    //             console.error("Error submitting form:", res.statusText);
    //         }

    //     } catch (error) {
    //         console.error("Submission Error:", error);
    //     }
    // };

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
        formData, setFormData, handleTextareaChange, handleSingleCheckboxChange, handleMultipleCheckboxChange, handleRadioboxChange: handleSingleCheckboxChange, handleSubmit, handleBack, handleCheckboxChange, handleSaveSignature, handleClearSignature, handleSignatureUpload, signaturePreview, sigRefs, handleApproval, handleNewMultipleCheckboxChange, setSignaturePreview, documentTypes, selectedDocumentType, setSelectedDocumentType, handleDocumentTypeChange, handleAdd, clearFileSelection, handleFileUpload, handleDelete, tableData, fileSelected, fileName, handleRemoveFile, signaturePreviews, setSignaturePreviews, handleNext, savedFormsData, setSavedFormsData, saveFormDataLocally, handleDateChange
    };
};
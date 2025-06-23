'use client'
import React, { FormEvent, useEffect, useState, useRef } from "react";
import { Input } from "../../atoms/input";
import { Button } from "../../atoms/button";
import { Label } from "../../atoms/label";
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { QMSFormTabs } from "@/src/constants/vendorDetailSidebarTab";
import { QMSForm } from '@/src/types/qmstypes';
import SignatureCanvas from 'react-signature-canvas';


export const VendorInfoForm = ({ vendor_onboarding }: { vendor_onboarding: string }) => {

    const { designation } = useAuth();
    const router = useRouter();
    const params = useSearchParams();
    const currentTab = params.get("tabtype")?.toLowerCase() || "vendorinfo";
    const [formData, setFormData] = useState<Partial<QMSForm>>({
        vendor_name1: "",
        date1: "",
        vendor_signature: "",
        name_of_parent_company: "",
    });

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const response = await requestWrapper({
                    url: API_END_POINTS.qmsformdetails,
                    method: "GET",
                    params: { vendor_onboarding },
                });

                const data = response?.data?.message?.qms_details;
                console.log("Data of qms form---->", data);
                setFormData((prev) => ({
                    ...prev,
                    quality_control_system: data?.quality_control_system?.split(',') || [],
                }));
            } catch (error) {
                console.error("Error fetching QMS form data:", error);
            }
        };

        fetchFormData();
    }, [vendor_onboarding]);

    const sigCanvas = useRef<SignatureCanvas | null>(null);
    const [signaturePreview, setSignaturePreview] = useState<string | null>(null);

    const handleTextareaChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: keyof QMSForm
    ) => {
        const { value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSaveSignature = () => {
        if (sigCanvas.current?.isEmpty()) {
            alert("Please provide a signature before saving.");
            return;
        }

        const dataUrl = sigCanvas.current?.toDataURL();
        setSignaturePreview(dataUrl || null);
        setFormData((prev) => ({
            ...prev,
            vendor_signature: dataUrl || "",
        }));
    };

    const handleClearSignature = () => {
        sigCanvas.current?.clear();
        setSignaturePreview(null);
        setFormData((prev) => ({
            ...prev,
            vendor_signature: "",
        }));
    };

    const handleSubmit = () => {
        const currentIndex = QMSFormTabs.findIndex(tab => tab.toLowerCase() === currentTab);
        const nextTab = QMSFormTabs[currentIndex + 1];

        if (nextTab) {
            router.push(
                `/qms-details?vendor_onboarding=${vendor_onboarding}&tabtype=${encodeURIComponent(nextTab)}`
            );
        } else {
            alert("You’ve reached the last tab");
        }
    };

    return (
        <div>
            <div className='bg-white p-2 rounded-[8px]'>
                <h2 className="text-lg font-bold bg-gray-200 border border-gray-300 p-3">
                    SECTION – I: VENDOR INFORMATION
                </h2>
                <div className='grid grid-cols-2 gap-x-4 gap-y-2 p-2 border border-gray-300'>
                    <div className='grid grid-cols-1 relative'>
                        <div className='col-span-1 space-y-[5px] absolute w-full'>
                            <Label className="text-[13px]" htmlFor="vendor_name1">Name</Label>
                            <Input
                                type="text"
                                placeholder="Enter the name here"
                                name="vendor_name1"
                                value={formData.vendor_name1}
                                onChange={(e) => handleTextareaChange(e, 'vendor_name1')}
                            />
                        </div>
                        <div className='col-span-1 space-y-[5px] absolute top-20 w-full'>
                            <Label className="text-[13px]" htmlFor="sign">Date</Label>
                            <Input
                                type="date"
                                name="date"
                                value={formData.date1}
                                onChange={(e) => handleTextareaChange(e, 'date1')}
                            />
                        </div>
                    </div>

                    <div className='col-span-2 space-y-[5px]'>
                        <div className="flex flex-col mt-4">
                            {!signaturePreview && (
                                <SignatureCanvas
                                    ref={sigCanvas}
                                    penColor="black"
                                    canvasProps={{ width: 400, height: 150, className: 'border border-gray-300' }}
                                />
                            )}

                            {!signaturePreview && (
                                <div className="mt-2 space-x-2">
                                    <Button variant="esignbtn" size="esignsize" onClick={handleSaveSignature} className="py-2">
                                        Save Signature
                                    </Button>
                                    <Button
                                        variant="clearesignbtn"
                                        size="clearesignsize"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleClearSignature();
                                        }}
                                        className="py-2">
                                        Clear Signature
                                    </Button>
                                </div>
                            )}

                            {signaturePreview && (
                                <div className="w-[400px] h-[150px] relative flex items-center mt-2">
                                    <img src={signaturePreview} alt="Signature Preview" className="w-40 h-20 object-contain" />
                                    <Button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleClearSignature();
                                        }}
                                        className="ml-2 text-red-500 cursor-pointer">
                                        &#x2715;
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='col-span-3 space-y-[5px]'>
                        <Label htmlFor="name_of_parent_company" className="font-semibold text-[16px] leading-[19px] text-[#03111F]">If a division of a subsidiary, please provide name and address of parent company</Label>
                        <div className="border-b border-gray-300 mt-2">
                            <textarea
                                className="w-full border border-gray-300 p-2"
                                rows={4}
                                placeholder='Enter the details'
                                value={formData.name_of_parent_company}
                                onChange={(e) => handleTextareaChange(e, 'name_of_parent_company')}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <Button
                    className="bg-blue-400 hover:bg-blue-400"
                    onClick={handleSubmit}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

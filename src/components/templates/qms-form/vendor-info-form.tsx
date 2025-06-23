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
import { useQMSForm } from '@/src/hooks/useQMSForm';

export const VendorInfoForm = ({ vendor_onboarding }: { vendor_onboarding: string; }) => {
    const params = useSearchParams();
    const currentTab = params.get("tabtype")?.toLowerCase() || "vendor information";
    const {
        formData,
        sigCanvas,
        signaturePreview,
        handleTextareaChange,
        handleSaveSignature,
        handleClearSignature,
        handleSubmit
    } = useQMSForm(vendor_onboarding, currentTab);

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
                            <Label className="text-[13px]" htmlFor="date">Date</Label>
                            <Input
                                type="date"
                                name="date"
                                value={formData.date1}
                                onChange={(e) => handleTextareaChange(e, 'date1')}
                            />
                        </div>
                    </div>

                    <div className="col-span-2 space-y-[5px]">
                        <div className="flex flex-col mt-4">
                            {formData.vendor_signature ? (
                                <div className="w-[400px] h-[150px] relative flex items-center mt-2">
                                    <img
                                        src={formData.vendor_signature}
                                        alt="Vendor Signature"
                                        className="w-400 h-200 object-contain border border-gray-300"
                                    />
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No signature available.</p>
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

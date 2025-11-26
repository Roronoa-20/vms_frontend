'use client'
import React, { useEffect } from "react";
import { Input } from "../../atoms/input";
import { Button } from "../../atoms/button";
import { Label } from "../../atoms/label";
import { useSearchParams } from "next/navigation";
import { useQMSForm } from '@/src/hooks/useQMSForm';
import SignatureCanvas from "react-signature-canvas";
import { Paperclip } from "lucide-react";

export const VendorInfoForm = ({ vendor_onboarding, ref_no, company_code }: { vendor_onboarding: string; ref_no: string; company_code: string; }) => {
    const params = useSearchParams();
    const currentTab = params.get("tabtype")?.toLowerCase() || "vendor information";
    const { formData, handleTextareaChange, handleSubmit, handleClearSignature, setSignaturePreviews, signaturePreviews, saveFormDataLocally, handleSignatureUpload } = useQMSForm(vendor_onboarding, currentTab);

    useEffect(() => {
        if (!signaturePreviews && formData?.vendor_signature) {
            setSignaturePreviews({ signatures: formData?.vendor_signature });
        }
    }, [formData, signaturePreviews]);

    const companyCodes = company_code.split(',').map((code) => code.trim());
    const is2000 = companyCodes.includes('2000');
    const is7000 = companyCodes.includes('7000');


    return (
        <div>
            <div className="bg-white p-2 rounded-[8px]">
                <h2 className="text-lg font-bold bg-gray-200 border border-gray-300 p-3">
                    SECTION – I: VENDOR INFORMATION
                </h2>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 p-2 border border-gray-300">
                    {is7000 && (
                        <>
                            {/* Vendor Name */}
                            <div className="grid grid-cols-1 relative">
                                <div className="col-span-1 space-y-[5px]">
                                    <Label className="text-[13px]" htmlFor="vendor_name1">
                                        Name
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="Enter the name here"
                                        name="vendor_name1"
                                        value={formData.vendor_name1 || ''}
                                        onChange={(e) => handleTextareaChange(e, 'vendor_name1')}
                                    />
                                </div>

                                <div className="col-span-1 space-y-[5px] mt-4">
                                    <Label className="text-[13px]" htmlFor="date">
                                        Date
                                    </Label>
                                    <Input
                                        type="date"
                                        name="date"
                                        value={formData.date1 || ''}
                                        onChange={(e) => handleTextareaChange(e, 'date1')}
                                    />
                                </div>
                            </div>

                            {/* Signature Upload */}
                            <div className="col-span-2 space-y-[5px]">
                                <Label className="text-[13px]">Vendor Signature</Label>

                                {signaturePreviews["vendor_signature"] ? (
                                    <div className="relative w-fit">
                                        <img
                                            src={signaturePreviews["vendor_signature"]}
                                            alt="Signature Preview"
                                            className="w-[400px] h-[170px] object-contain border border-gray-300 rounded-md"
                                        />

                                        {/* Cross Icon */}
                                        <button
                                            onClick={() => handleClearSignature("vendor_signature")}
                                            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow text-red-600"
                                        >
                                            ✖
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-[450px] h-[170px] border-2 border-dashed border-gray-400 rounded-md cursor-pointer hover:bg-gray-50">
                                        <div className="flex flex-col items-center text-gray-600">
                                            📎
                                            <p className="text-xs mt-1">Attach Signature (PDF/PNG/JPG/JPEG)</p>
                                        </div>

                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg, image/jpg, application/pdf"
                                            className="hidden"
                                            onChange={(e) => handleSignatureUpload(e, "vendor_signature")}
                                        />
                                    </label>
                                )}
                            </div>
                        </>
                    )}

                    {(is2000 || is7000) && (
                        <div className="col-span-3 space-y-[5px]">
                            <Label htmlFor="name_of_parent_company" className="font-semibold text-[16px] text-[#03111F]">
                                If a division of a subsidiary, please provide name and address of parent company
                            </Label>
                            <div className="border-b border-gray-300 mt-2">
                                <textarea
                                    className="w-full border border-gray-300 p-2"
                                    rows={4}
                                    placeholder="Enter the details"
                                    value={formData.name_of_parent_company || ''}
                                    onChange={(e) => handleTextareaChange(e, 'name_of_parent_company')}
                                />
                            </div>
                        </div>
                    )}

                    {is2000 && (
                        <div className="col-span-3 space-y-[5px]">
                            <Label
                                htmlFor="name_of_manufacturer_of_supplied_material"
                                className="font-semibold text-[16px] text-[#03111F]"
                            >
                                If supplier is a distributor, please provide name and address of the manufacturer of supplied material
                            </Label>
                            <div className="border-b border-gray-300 mt-2">
                                <textarea
                                    className="w-full border border-gray-300 p-2"
                                    rows={4}
                                    placeholder="Enter the details"
                                    value={formData.name_of_manufacturer_of_supplied_material || ''}
                                    onChange={(e) => handleTextareaChange(e, 'name_of_manufacturer_of_supplied_material')}
                                />
                            </div>
                        </div>
                    )}
                    <div className="col-span-2 flex justify-end">
                        <Button variant="nextbtn" size="nextbtnsize" className="py-2.5"
                            // onClick={() => {
                            //     console.log('Saving form data locally for vendor info tab:', currentTab, 'formData:', formData);
                            //     saveFormDataLocally(currentTab, formData);
                            //     handleNext();
                            // }}>
                            onClick={handleSubmit}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
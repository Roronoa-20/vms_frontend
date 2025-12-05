'use client'
import React, { useEffect } from "react";
import { Input } from "../../atoms/input";
import { Button } from "../../atoms/button";
import { Label } from "../../atoms/label";
import { useSearchParams } from "next/navigation";
import { useQMSForm } from '@/src/hooks/useQMSForm';
import { Paperclip } from "lucide-react";
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";

export const VendorInfoForm = ({ vendor_onboarding, ref_no, company_code }: { vendor_onboarding: string; ref_no: string; company_code: string; }) => {

    const params = useSearchParams();
    const currentTab = params.get("tabtype")?.toLowerCase() || "vendor information";
    const { formData, handleTextareaChange, handleClearSignature, setSignaturePreviews, signaturePreviews, handleSignatureUpload, handleNext } = useQMSForm(vendor_onboarding, currentTab);

    const isQATeamApproved = formData?.qa_team_approved === 1;

    useEffect(() => {
        const sign = formData?.vendor_sign_attachment;

        if (!sign) {
            setSignaturePreviews(prev => ({
                ...prev,
                vendor_signature: ""
            }));
            return;
        }

        if (signaturePreviews["vendor_signature"]) return;

        if (typeof sign === "string") {
            setSignaturePreviews(prev => ({
                ...prev,
                vendor_signature: sign.startsWith("/files")
                    ? `${process.env.NEXT_PUBLIC_BACKEND_END}${sign}`
                    : sign
            }));
            return;
        }

        if (sign instanceof File) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const res = reader.result;
                const vendorSignature = typeof res === 'string' ? res : res ? String(res) : '';
                setSignaturePreviews(prev => ({
                    ...prev,
                    vendor_signature: vendorSignature
                }));
            };
            reader.readAsDataURL(sign);
        }
    }, [formData]);

    const companyCodes = company_code.split(',').map((code) => code.trim());
    const is2000 = companyCodes.includes('2000');
    const is7000 = companyCodes.includes('7000');

    const handleSubmit = async () => {
        try {
            if (isQATeamApproved) {
                console.log("QA already approved → skipping API");
                handleNext();
                return;
            }
            const form = new FormData();
            const payload = {
                vendor_onboarding,
                company_code,
                qms_form: formData?.name,
                ...formData,
            };
            form.append("data", JSON.stringify(payload));
            if (formData?.vendor_sign_attachment instanceof File) {
                form.append("vendor_sign_attachment", formData.vendor_sign_attachment);
            }
            console.log("Submitting FormData bfeofre---->", payload)
            const response = await requestWrapper({
                url: API_END_POINTS.CreateQMSvendorInfoForm,
                method: "POST",
                data: form,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("API response:", response);
            if (response?.status === 200) {
                handleNext();
            }
        } catch (error) {
            console.error("Submit error:", error);
        }
    };

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
                                        disabled={isQATeamApproved}
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
                                        disabled={isQATeamApproved}
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
                                            disabled={isQATeamApproved}
                                        >
                                            ✖
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-[450px] h-[170px] border-2 border-dashed border-gray-400 rounded-md cursor-pointer hover:bg-gray-50">
                                        <div className="flex flex-col items-center text-gray-600">
                                            <Paperclip className="w-8 h-8 mb-2" />
                                            <p className="text-xs mt-1">Attach Signature (PDF/PNG/JPG/JPEG)</p>
                                        </div>

                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg, image/jpg, application/pdf"
                                            className="hidden"
                                            onChange={(e) => handleSignatureUpload(e, "vendor_signature")}
                                            disabled={isQATeamApproved}

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
                                    disabled={isQATeamApproved}
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
                                    disabled={isQATeamApproved}
                                />
                            </div>
                        </div>
                    )}
                    <div className="col-span-2 flex justify-end">
                        <Button
                            variant="nextbtn"
                            size="nextbtnsize"
                            className="py-2.5"
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
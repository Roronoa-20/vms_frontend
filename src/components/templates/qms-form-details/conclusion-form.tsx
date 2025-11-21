'use client';

import React, { useState } from "react";
import { Label } from "../../atoms/label";
import { Button } from "../../atoms/button";
import { Input } from "../../atoms/input";
import { useSearchParams } from "next/navigation";
import { useQMSForm } from "@/src/hooks/useQMSForm";
import { X } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import Cookies from "js-cookie";

export const ConclusionForm = ({ vendor_onboarding }: { vendor_onboarding: string; }) => {
    const { designation } = useAuth();
    const isDisabled = designation === "Purchase Team";

    const params = useSearchParams();
    const currentTab = params.get("tabtype")?.toLowerCase() || "conclusion";
    const user = Cookies?.get("user_id");

    const { formData, setFormData, handleCheckboxChange, handleTextareaChange, handleBacktab, handleApproval } = useQMSForm(vendor_onboarding, currentTab);

    const [showEsignModal, setShowEsignModal] = useState(false);
    const [esignPasskey, setEsignPasskey] = useState("");

    const updateSignature = (value: string) => {
        setFormData((prev: any) => ({
            ...prev,
            performer_signature: value,
        }));
    };

    const handleGetUserSignature = async () => {
        try {
            const res = await requestWrapper({
                method: "POST",
                url: API_END_POINTS.getusersignature,
                params: {
                    esign_passkey: esignPasskey,
                    user_id: user,
                },
            });

            const signature = res?.data?.signature;

            if (!signature) {
                alert("Signature not found.");
                return;
            }

            updateSignature(signature);
            setShowEsignModal(false);

        } catch (err) {
            console.error("E-signature fetch failed:", err);
            alert("Invalid passkey or signature fetch failed.");
        }
    };

    return (
        <div className="bg-white pt-4 rounded-[8px]">
            <h2 className="text-lg font-bold bg-gray-200 border border-gray-300 p-3">
                SECTION – X: Outcome of Supplier Assessment
            </h2>

            {/* Remarks */}
            <div>
                <Label
                    htmlFor="conclusion_by_meril"
                    className="font-semibold text-[16px] text-[#03111F]"
                >
                    Assessment remarks:
                </Label>

                <textarea
                    disabled={isDisabled}
                    className="w-full mt-2 border border-gray-300 p-2 rounded-md text-[14px]"
                    rows={2}
                    placeholder="Enter your remarks here"
                    value={formData.conclusion_by_meril || ""}
                    onChange={(e) =>
                        handleTextareaChange(e, "conclusion_by_meril")
                    }
                />
            </div>

            {/* Outcome */}
            <div className="inline-flex items-center space-x-16 pb-3 mt-4">
                <Label className="font-semibold text-[16px] text-[#03111F]">
                    Assessment outcome
                </Label>

                <div className="inline-flex gap-6 items-center">
                    {/* Satisfactory */}
                    <div className="flex items-center space-x-2">
                        <Input
                            type="checkbox"
                            disabled={isDisabled}
                            className="w-4 h-4"
                            value="Satisfactory"
                            checked={
                                formData.assessment_outcome === "Satisfactory"
                            }
                            onChange={(e) =>
                                handleCheckboxChange(e, "assessment_outcome")
                            }
                        />
                        <Label className="text-[14px] font-normal">
                            Satisfactory
                        </Label>
                    </div>

                    {/* Not Satisfactory */}
                    <div className="flex items-center space-x-2">
                        <Input
                            type="checkbox"
                            disabled={isDisabled}
                            className="w-4 h-4"
                            value="Not Satisfactory"
                            checked={
                                formData.assessment_outcome ===
                                "Not Satisfactory"
                            }
                            onChange={(e) =>
                                handleCheckboxChange(e, "assessment_outcome")
                            }
                        />
                        <Label className="text-[14px] font-normal">
                            Not Satisfactory
                        </Label>
                    </div>
                </div>
            </div>

            {/* Performer Section */}
            <div className="pb-6">
                <h3 className="text-[18px] underline font-semibold text-[#03111F] pb-2 mb-4">
                    Assessment performed by
                </h3>

                <div className="grid grid-cols-2 gap-8">
                    {/* Performer Name */}
                    <div className="flex flex-col">
                        <Input
                            type="text"
                            disabled={isDisabled}
                            className="w-3/4 border-0 border-b-2 border-black focus:ring-0"
                            placeholder="Enter the name here"
                            value={formData.performer_name || ""}
                            onChange={(e) =>
                                handleTextareaChange(e, "performer_name")
                            }
                        />
                        <span className="text-[14px] mt-2">Name</span>
                    </div>

                    {/* Performer Title */}
                    <div className="flex flex-col">
                        <Input
                            type="text"
                            disabled={isDisabled}
                            className="w-3/4 border-0 border-b-2 border-black focus:ring-0"
                            placeholder="Enter the authorized title here"
                            value={formData.performer_title || ""}
                            onChange={(e) =>
                                handleTextareaChange(e, "performer_title")
                            }
                        />
                        <span className="text-[14px] mt-2">Title</span>
                    </div>
                </div>

                {/* Signature */}
                <div className="flex flex-col mt-5">
                    <Label className="text-[16px] text-black mb-2">Signature</Label>

                    {formData.performer_signature ? (
                        <div className="relative w-fit">
                            <img
                                src={formData.performer_signature}
                                alt="Signature"
                                className="w-[400px] h-[200px] object-contain border border-gray-300"
                            />

                            {/* Clear Signature */}
                            <Button
                                onClick={() => updateSignature("")}
                                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                            >
                                <X size={18} className="text-red-500" />
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="nextbtn"
                            className="!w-[160px] py-2.5"
                            size="nextbtnsize"
                            onClick={() => setShowEsignModal(true)}
                        >
                            Attach Signature
                        </Button>
                    )}

                    <div className="flex flex-col">
                        <Input
                            type="date"
                            name="performent_date"
                            value={formData.performent_date || ""}
                            onChange={(e) => handleTextareaChange(e, 'performent_date')}
                            className="w-3/4 border-0 border-b-2 border-black focus:ring-0 focus:outline-none"
                        />
                        <span className="text-[14px] mt-2">Date</span>
                    </div>

                    {/* E-Sign Popup */}
                    {showEsignModal && (
                        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg w-[350px] relative shadow-lg">
                                <button
                                    className="absolute top-2 right-2"
                                    onClick={() => setShowEsignModal(false)}
                                >
                                    <X className="text-red-600" />
                                </button>

                                <h2 className="text-lg font-semibold mb-4">
                                    Enter E-Sign Passkey
                                </h2>

                                <Input
                                    type="password"
                                    placeholder="Enter passkey"
                                    value={esignPasskey}
                                    onChange={(e) =>
                                        setEsignPasskey(e.target.value)
                                    }
                                    className="w-full mb-4"
                                />

                                <Button
                                    variant="nextbtn"
                                    size="nextbtnsize"
                                    className="w-full"
                                    onClick={handleGetUserSignature}
                                >
                                    Submit
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end space-x-5 items-center">
                <Button
                    variant="backbtn"
                    size="backbtnsize"
                    onClick={handleBacktab}
                >
                    Back
                </Button>

                <Button
                    variant="nextbtn"
                    size="nextbtnsize"
                    onClick={handleApproval}
                >
                    Approve
                </Button>
            </div>
        </div>
    );
};

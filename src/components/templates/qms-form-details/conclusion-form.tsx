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
import { decryptImage } from "@/src/app/utils/decryptSignature";

export const ConclusionForm = ({ vendor_onboarding }: { vendor_onboarding: string; }) => {
    const { designation } = useAuth();
    const isDisabled = designation === "Purchase Team";
    const params = useSearchParams();
    const currentTab = params.get("tabtype")?.toLowerCase() || "conclusion";
    const user = Cookies?.get("user_id");
    const { formData, setFormData, handleCheckboxChange, handleTextareaChange, handleBacktab, handleApproval, approvalRemark, setApprovalRemark } = useQMSForm(vendor_onboarding, currentTab);
    const [showEsignModal, setShowEsignModal] = useState(false);
    const [esignPasskey, setEsignPasskey] = useState("");
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const isQATeamApproved = formData.qa_team_approved === 1;

    React.useEffect(() => {
        if (!formData.performent_date) {
            const today = new Date().toISOString().split("T")[0];
            setFormData((prev: any) => ({
                ...prev,
                performent_date: today,
            }));
        }
    }, [formData.performent_date]);

    const handleApproveClick = () => {
        setShowApprovalModal(true);
    };

    const updateSignature = (value: string) => {
        setFormData((prev: any) => ({
            ...prev,
            performer_signature: value,
        }));
    };

    const handleSubmitApproval = () => {
        const updatedData = {
            ...formData,
            approval_remark: approvalRemark,
        };
        handleApproval();
        setApprovalRemark("");
        setShowApprovalModal(false);
    };

    const handleGetUserSignature = async () => {
        try {
            const res = await requestWrapper({
                method: "GET",
                url: API_END_POINTS.getusersignature,
                params: {
                    esign_passkey: esignPasskey,
                    user_id: user,
                },
            });

            const encrypted = res?.data?.message?.encrypted_image;
            const key = res?.data?.message?.token_key;

            const decryptedImage = await decryptImage(encrypted, key);
            if (!decryptedImage) {
                alert("Failed to decrypt signature");
                return;
            }

            updateSignature(decryptedImage);
            setShowEsignModal(false);

        } catch (err) {
            console.error("E-signature fetch failed:", err);
            alert("Invalid passkey or signature fetch failed.");
        }
    };


    return (
        <div className="bg-white pt-4 p-2 rounded-[8px]">
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
                <h3 className="text-[18px] underline font-semibold text-[#03111F] pb-2 mb-6">
                    Assessment Performed By
                </h3>

                <div className="grid grid-cols-2 gap-6">

                    {/* Performer Name */}
                    <div className="flex flex-col space-y-2">
                        <Label className="text-[15px] font-medium text-[#03111F]">Name</Label>
                        <Input
                            type="text"
                            disabled={isDisabled}
                            className="border border-gray-300 rounded-md px-3 py-2 text-[14px] focus:ring-1 focus:ring-black"
                            placeholder="Enter the name"
                            value={formData.performer_name || ""}
                            onChange={(e) => handleTextareaChange(e, "performer_name")}
                        />
                    </div>

                    {/* Performer Title */}
                    <div className="flex flex-col space-y-2">
                        <Label className="text-[15px] font-medium text-[#03111F]">Title</Label>
                        <Input
                            type="text"
                            disabled={isDisabled}
                            className="border border-gray-300 rounded-md px-3 py-2 text-[14px] focus:ring-1 focus:ring-black"
                            placeholder="Enter authorized title"
                            value={formData.performer_title || ""}
                            onChange={(e) => handleTextareaChange(e, "performer_title")}
                        />
                    </div>

                    {/* Signature + Date */}
                    <div className="col-span-2 mt-4">
                        <div className="grid grid-cols-2 gap-6">

                            {/* Signature */}
                            <div className="flex flex-col space-y-2">
                                <Label className="text-[15px] font-medium text-[#03111F]">
                                    Signature
                                </Label>

                                {formData.performer_signature ? (
                                    <div className="relative w-[350px]">
                                        <div className="border border-gray-300 rounded-md p-2 bg-white shadow-sm">
                                            <img
                                                src={formData.performer_signature}
                                                alt="Signature"
                                                className="w-full h-[150px] object-contain"
                                            />
                                        </div>

                                        <Button
                                            onClick={() => updateSignature("")}
                                            className="absolute -top-3 -right-3 bg-white border border-gray-300 rounded-full p-1 shadow-sm"
                                        >
                                            <X size={16} className="text-red-500" />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        variant="nextbtn"
                                        size="nextbtnsize"
                                        className="py-2.5 w-[180px]"
                                        onClick={() => setShowEsignModal(true)}
                                    >
                                        Attach Signature
                                    </Button>
                                )}
                            </div>

                            {/* Date */}
                            <div className="flex flex-col space-y-2">
                                <Label className="text-[15px] font-medium text-[#03111F]">
                                    Date
                                </Label>

                                <Input
                                    type="date"
                                    name="performent_date"
                                    value={formData.performent_date ?? ""}
                                    onChange={(e) => handleTextareaChange(e, "performent_date")}
                                    className="border border-gray-300 rounded-md px-3 py-2 text-[14px] focus:ring-1 focus:ring-black w-[200px]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* E-Sign Modal */}
                    {showEsignModal && (
                        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg w-[350px] relative shadow-xl">
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
                                    onChange={(e) => setEsignPasskey(e.target.value)}
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
            {!isQATeamApproved && (
                < div className="flex justify-end space-x-5 items-center" >
                    <Button
                        variant="backbtn"
                        size="backbtnsize"
                        className="py-2.5"
                        onClick={handleBacktab}
                    >
                        Back
                    </Button>

                    <Button
                        variant="nextbtn"
                        size="nextbtnsize"
                        className="py-2.5"
                        onClick={handleApproveClick}
                    >
                        Approve
                    </Button>
                </div>
            )}
            {showApprovalModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-[400px] relative shadow-xl">
                        <button
                            className="absolute top-2 right-2"
                            onClick={() => setShowApprovalModal(false)}
                        >
                            <X className="text-red-600" />
                        </button>

                        <h2 className="text-lg font-semibold mb-4">
                            Add Remark for Approval
                        </h2>

                        <textarea
                            className="w-full border border-gray-300 rounded-md p-2 mb-4 text-[14px]"
                            rows={4}
                            placeholder="Enter your remark here..."
                            value={approvalRemark}
                            onChange={(e) => setApprovalRemark(e.target.value)}
                        />

                        <div className="flex justify-end space-x-3">
                            <Button
                                variant="backbtn"
                                size="backbtnsize"
                                onClick={() => setShowApprovalModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="nextbtn"
                                size="nextbtnsize"
                                onClick={handleSubmitApproval}
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

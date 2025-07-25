'use client'
import React from "react";
import { useState, useRef } from "react";
import { Label } from "../../atoms/label";
import { Button } from "../../atoms/button";
import { Input } from "../../atoms/input";
import { useSearchParams } from "next/navigation";
import { useQMSForm } from '@/src/hooks/useQMSForm';
import SignatureCanvas from 'react-signature-canvas';


export const ConclusionForm = ({ vendor_onboarding, ref_no, company_code }: { vendor_onboarding: string; ref_no:string; company_code:string }) => {
    const params = useSearchParams();
    const currentTab = params.get("tabtype")?.toLowerCase() || "conclusion";
    const [showSignatureCanvas, setShowSignatureCanvas] = useState(true);
    const { formData, handleCheckboxChange, sigRefs, signaturePreview, handleTextareaChange, handleSaveSignature, handleSignatureUpload, handleClearSignature, handleBack, handleApproval
    } = useQMSForm(vendor_onboarding, currentTab);


    return (
        <div className="bg-whtie">
            <div className="pb-3">
                <h2 className="border-b border-slate-500 text-[20px] font-semibold text-[#03111F]">
                    SECTION – X: Outcome of Supplier Assessment
                </h2>
                <div>
                    <Label htmlFor="conclusion_by_meril" className="font-semibold text-[16px] text-[#03111F]">
                        Assessment remarks:
                    </Label>
                    <textarea
                        className="w-full mt-2 border border-gray-300 p-2 rounded-md text-[14px]"
                        rows={2}
                        placeholder="Enter your remarks here"
                        value={formData.conclusion_by_meril || ""}
                        onChange={(e) => handleTextareaChange(e, 'conclusion_by_meril')}
                    />
                </div>
            </div>

            {/* Section 2 */}
            <div className="inline-flex items-center space-x-16 pb-3">
                <Label htmlFor="assessment_outcome" className="font-semibold text-[16px] text-[#03111F]">
                    Assessment outcome
                </Label>
                <div className="inline-flex sapce-x-4 gap-6 items-center">
                    <div className="flex items-center space-x-2">
                        <Input
                            type="checkbox"
                            className="w-4 h-4"
                            value="Satisfactory"
                            checked={formData.assessment_outcome === 'Satisfactory'}
                            onChange={(e) => handleCheckboxChange(e, 'assessment_outcome')}
                        />
                        <Label className="text-[14px] font-normal text-[#03111F]">
                            Satisfactory
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Input
                            type="checkbox"
                            className="w-4 h-4"
                            value="Not Satisfactory"
                            checked={formData.assessment_outcome === 'Not Satisfactory'}
                            onChange={(e) => handleCheckboxChange(e, 'assessment_outcome')}
                        />
                        <Label className="text-[14px] font-normal text-[#03111F]">
                            Not Satisfactory
                        </Label>
                    </div>
                </div>
            </div>

            {/* Section 3 */}
            <div className="pb-6">
                <h3 className="text-[18px] underline font-semibold text-[#03111F] pb-2 mb-4">
                    Assessment performed by
                </h3>
                <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col">
                        <Input
                            type="text"
                            className="w-3/4 border-0 border-b-2 border-black focus:ring-0 focus:outline-none"
                            placeholder="Enter the name here"
                            name="performer_name"
                            value={formData.performer_name || ""}
                            onChange={(e) => handleTextareaChange(e, 'performer_name')}
                        />
                        <span className="text-[14px] mt-2">Name</span>
                    </div>

                    <div className="flex flex-col">
                        <Input
                            type="text"
                            className="w-3/4 border-0 border-b-2 border-black focus:ring-0 focus:outline-none"
                            placeholder="Enter the authorized title here"
                            name="performer_title"
                            value={formData.performer_title || ""}
                            onChange={(e) => handleTextareaChange(e, 'performer_title')}
                        />
                        <span className="text-[14px] mt-2">Title</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mt-4">
                    <div className="flex flex-col mt-5">
                        <Label className="text-[14px] mb-2">Signature</Label>

                        {showSignatureCanvas ? (
                            <div className="border border-gray-300 rounded w-[300px] h-[120px] overflow-hidden">
                                <SignatureCanvas
                                    ref={sigRefs.performer_esignature}
                                    penColor="black"
                                    canvasProps={{ className: "w-full h-full" }}
                                />
                            </div>
                        ) : (
                            signaturePreview && (
                                <img
                                    src={signaturePreview}
                                    alt="Signature Preview"
                                    className="w-60 h-30 object-contain border border-gray-300"
                                />
                            )
                        )}

                        <div className="mt-2 space-x-2">
                            <Button
                                variant="nextbtn"
                                size="nextbtnsize"
                                onClick={(e) => {
                                    handleSaveSignature(e,("performer_esignature"));
                                    setShowSignatureCanvas(false);
                                }}
                            >
                                Save Signature
                            </Button>

                            <Button
                                variant="backbtn"
                                size="backbtnsize"
                                onClick={() => {
                                    handleClearSignature("performer_esignature");
                                    setShowSignatureCanvas(true);
                                }}
                            >
                                Clear
                            </Button>
                        </div>
                    </div>

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
                </div>
            </div>

            {/* Submit and Back Buttons */}
            <div className="flex justify-end space-x-5 items-center">
                <Button
                    variant="backbtn"
                    size="backbtnsize"
                    className=""
                    onClick={handleBack}
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
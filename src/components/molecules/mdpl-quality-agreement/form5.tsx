import React, { useEffect, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import Header from "@/src/components/molecules/mdpl-quality-agreement/header";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useQMSForm } from '@/src/hooks/useQMSForm';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import { Paperclip } from 'lucide-react';

export const Form5 = ({ vendor_onboarding }: { vendor_onboarding: string }) => {
  const params = useSearchParams();
  const currentTab = params.get("tabtype")?.toLowerCase() || "vendor_information";
  const { qualityagreementData, formData, handleClearSignature, signaturePreviews, handleTextareaChange, handleDateChange, handleSignatureUpload } = useQMSForm(vendor_onboarding, currentTab);

  const form5Data = qualityagreementData.mdpl_quality_agreement || "";
  const vendorNameInputValue = formData.mdpl_qa_vendor_name || formData.vendor_name1 || '';

  const { designation } = useAuth();

  const isQATeamApproved = formData?.qa_team_approved === 1;

  console.log("Form 5 quality Agreement Data--->", form5Data);

  useEffect(() => {
    const dataToSave = {
      name_of_person: formData.name_of_person,
      designation_of_person: formData.designation_of_person,
      signed_date: formData.signed_date,
      // meril_signed_date: formData.meril_signed_date,
      vendor_name: vendorNameInputValue,
      // attach_vendor_signature: signaturePreviews["attach_vendor_signature"]
    };

    localStorage.setItem("Form5Data", JSON.stringify(dataToSave));
  }, [formData]);



  return (
    <div className="space-y-[32px] flex flex-col justify-between min-h-[80vh]">
      <div style={{ boxShadow: '0px 0px 5px 5px rgba(0, 0, 0, 0.05)' }} className='space-y-10'>
        <div className="bg-white text-black px-4 pb-8 pt-4 mx-auto border border-gray-300">
          <Header />
          <section className='ml-8 space-y-2 z-[50] text-justify text-[16px]'>
            <h1 className='font-bold border-b border-black w-fit'>Authorization</h1>
            <div className='space-y-2 text-justify pr-16'>
              <p>
                It is agreed and warranted by the parties that the individuals signing this document on behalf of the
                respective parties are duly authorized to execute such an Agreement. No further proof of authorization is
                or shall be required. A pdf or electronic scan of this agreement shall have the same force and effect as
                an original.
              </p>
              <p>IN WITNESS WHEREOF, the parties hereto have caused these presents to be executed as of the date hereof.</p>
              <div className='grid grid-cols-2 mt-5 border-[1px] border-black font-semibold'>
                {/* Vendor Info */}
                <div className="border-b-[1px] border-black p-1 flex flex-col">
                  <span className='font-normal text-[14px]'>Signed for and on behalf of</span>
                  <input
                    type='text'
                    name='vendor_name'
                    placeholder='Vendor name'
                    className='outline-none'
                    value={vendorNameInputValue}
                    readOnly
                  />
                </div>
                <div className="border-b-[1px] border-l-[1px] border-black p-1 flex flex-col">
                  <span className='font-normal text-[14px]'>Signed for and on behalf of</span>
                  <input
                    type='text'
                    name='supplier_company_name'
                    className='outline-none'
                    value="Meril Diagnostics Private Limited"
                    readOnly
                  />
                </div>

                {/* Name */}
                <div className="border-b-[1px] border-black p-1 flex space-x-2 items-center">
                  <Label className="text-[14px]">Name:</Label>
                  <Input
                    type="text"
                    name="name_of_person"
                    className='w-full min-h-auto outline-none'
                    value={form5Data.name_of_person ?? ''}
                    onChange={(e) => handleTextareaChange(e, ("name_of_person"))}
                  />
                </div>
                <div className="border-b-[1px] border-l-[1px] border-black p-1 flex space-x-2 items-center">
                  <Label className="text-[14px]">Name:</Label>
                  <input
                    type="text"
                    className='w-full min-h-auto outline-none font-semibold'
                    value={'Mr. Ram Kanoje'}
                    readOnly
                  />
                </div>

                {/* Designation */}
                <div className="border-b-[1px] border-black p-1 flex space-x-2">
                  <Label className="text-[14px]">Designation:</Label>
                  <Input
                    type="text"
                    name="designation_of_person"
                    className='w-full min-h-auto outline-none'
                    value={form5Data.designation_of_person ?? ''}
                    onChange={(e) => handleTextareaChange(e, ("designation_of_person"))}
                  />
                </div>
                <div className="border-b-[1px] border-l-[1px] border-black p-1 flex space-x-2">
                  <Label className="text-[14px]">Designation:</Label>
                  <textarea
                    className='w-full min-h-auto outline-none'
                    readOnly
                    value={'Additional General Manager –\n(Quality Assurance)'}
                  />
                </div>

                {/* Signatures */}
                {/* Vendor Signature Upload */}
                <div className="border-b-[1px] border-black p-1 flex flex-col">
                  <Label className="text-[13px]">Vendor Signature</Label>

                  {signaturePreviews["attach_person_signature"] ? (
                    <div className="relative w-fit">
                      <img
                        src={signaturePreviews["attach_person_signature"]}
                        alt="Signature Preview"
                        className="w-[400px] h-[170px] object-contain border border-gray-300 rounded-md"
                      />

                      {/* Cross Icon */}
                      <button
                        onClick={() => handleClearSignature("attach_person_signature")}
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
                        onChange={(e) => handleSignatureUpload(e, "attach_person_signature")}
                        disabled={isQATeamApproved}

                      />
                    </label>
                  )}
                </div>

                <div className="border-b-[1px] border-l-[1px] border-black p-1 flex flex-col">
                  {designation === "QA Head" && (
                    <>
                      <Label className="text-[13px]">Meril Signature</Label>

                      {signaturePreviews["meril_signature"] ? (
                        <div className="relative w-fit">
                          <img
                            src={signaturePreviews["meril_signature"]}
                            alt="Signature Preview"
                            className="w-[400px] h-[170px] object-contain border border-gray-300 rounded-md"
                          />

                          {/* Cross Icon */}
                          <button
                            onClick={() => handleClearSignature("meril_signature")}
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
                            onChange={(e) => handleSignatureUpload(e, "meril_signature")}
                            disabled={isQATeamApproved}

                          />
                        </label>
                      )}
                    </>
                  )}

                </div>

                {/* Dates */}
                <div className="border-black p-1 flex space-x-2 items-center">
                  <Label>Date:</Label>
                  <Input
                    type="date"
                    name="signed_date"
                    className='w-full min-h-auto outline-none'
                    value={form5Data.signed_date ?? ''}
                    onChange={(e) => handleDateChange("signed_date", e.target.value)}
                  />
                </div>
                <div className="border-l-[1px] border-black p-1 flex space-x-2 items-center">
                  {designation === "QA Head" && (
                    <>
                      <Label>Date:</Label>
                      <Input
                        type="date"
                        name="meril_signed_date"
                        className='w-full min-h-auto outline-none'
                        value={form5Data.meril_signed_date ?? ''}
                        onChange={(e) => handleDateChange("meril_signed_date", e.target.value)}
                      />
                    </>
                  )}
                </div>

              </div>
            </div>
          </section>
          <section className="items-center">
            <div className="text-center text-lg font-semibold mt-[400px]">Page 5 of 7</div>
          </section>
        </div>
      </div>
    </div>
  );
};

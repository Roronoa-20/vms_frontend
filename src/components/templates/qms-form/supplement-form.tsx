'use client'
import React from "react";
import { Label } from "../../atoms/label";
import { useSearchParams } from "next/navigation";
import TextareaWithLabel from '@/src/components/common/TextareaWithLabel';
import { useQMSForm } from '@/src/hooks/useQMSForm';
import { Button } from "../../atoms/button";
import { Input } from "@/components/ui/input";
import SignatureCanvas from "react-signature-canvas";


export const SupplementForm = ({ vendor_onboarding, ref_no, company_code }: { vendor_onboarding: string; ref_no: string; company_code: string; }) => {
  const params = useSearchParams();
  const currentTab = params.get("tabtype")?.toLowerCase() || "supplement";
  const { formData, handleBack, handleNext, saveFormDataLocally, handleTextareaChange, signaturePreviews, sigRefs, handleClearSignature, handleSaveSignature, handleFileUpload, fileName, handleRemoveFile, handleSubmit } = useQMSForm(vendor_onboarding, currentTab);

  const companyCodes = company_code.split(',').map((code) => code.trim());
  const is2000 = companyCodes.includes('2000');
  const is7000 = companyCodes.includes('7000');

  const getFileURL = (fileOrUrl?: string | File): string => {
    if (!fileOrUrl) return "";
    if (typeof fileOrUrl === "string") return fileOrUrl;
    return URL.createObjectURL(fileOrUrl);
  };

  const getFileName = (fileOrUrl?: string | File): string => {
    if (!fileOrUrl) return "";
    if (typeof fileOrUrl === "string") {
      const parts = fileOrUrl.split("/");
      return parts[parts.length - 1];
    }
    return fileOrUrl.name;
  };

  return (
    <div className="bg-white">
      <h2 className="text-lg font-bold bg-gray-200 border border-gray-300 p-3">
        SECTION – IX: SUPPLEMENTAL INFORMATION (Attach separate sheet if required.)
      </h2>
      <div className="border border-gray-300 p-3 mb-6 rounded-md">
        <TextareaWithLabel
          name="additional_or_supplement_information"
          label="You are invited to include any additional or supplemental information which would be pertinent to this application and the evaluation of your capabilities."
          value={formData?.additional_or_supplement_information ?? ""}
          onChange={(e) => { handleTextareaChange(e, "additional_or_supplement_information") }}
          rows={2}
        />
        {is7000 && (
          <div className="mt-4">
            <Label className="block mb-2 text-sm font-medium text-gray-700">
              Upload Quality Manual:
            </Label>

            <div className="relative flex items-center border rounded px-3 py-2 bg-white">
              {!formData.quality_manual ? (
                <Input
                  type="file"
                  name="quality_manual"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e, "quality_manual")}
                  className="flex-1"
                />
              ) : (
                <>
                  <a
                    href={getFileURL(formData.quality_manual)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-700 font-semibold text-sm hover:underline truncate"
                  >
                    {getFileName(formData.quality_manual)}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile("quality_manual")}
                    className="text-red-600 text-xl font-bold ml-3 hover:text-red-800"
                    title="Remove File"
                  >
                    &times;
                  </button>
                </>
              )}
            </div>

            {!formData.quality_manual && (
              <span className="text-sm text-gray-500 mt-2 block">
                No file uploaded yet.
              </span>
            )}
          </div>
        )}

        {is2000 && (
          <div className="">
            <div className="mt-4">
              <Label htmlFor="area_of_facility" className="font-semibold text-[16px] leading-[19px] text-[#03111F]">
                I, the undersigned, hereby declare that the details given by me are genuine and correct to the best of my knowledge and can be used by Meril for supplier assessment and selection process.
              </Label>
            </div>
            <div className='grid grid-cols-2 gap-8 mt-2'>
              {/* Name Input */}
              <div className='flex flex-col'>
                <Input
                  type="text"
                  className=" w-3/4 border-0 border-b-2 border-black focus:ring-0 focus:outline-none"
                  placeholder="Enter the name here"
                  name="name1"
                  value={formData?.name1 ?? ""}
                  onChange={(e) => handleTextareaChange(e, 'name1')}

                />
                <span className='text-left text-[14px] mt-2'>Name</span>
              </div>

              {/* Title Input */}
              <div className='flex flex-col'>
                <Input
                  type="text"
                  className="w-3/4 border-0 border-b-2 border-black focus:ring-0 focus:outline-none"
                  placeholder="Enter the authorized title here"
                  name="title"
                  value={formData?.title ?? ""}
                  onChange={(e) => handleTextareaChange(e, 'title')}

                />
                <span className='text-left text-[14px] mt-2'>Title</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-2">
              <div className="flex flex-col mt-4">
                {!signaturePreviews["ssignature"] && (
                  <SignatureCanvas
                    ref={sigRefs.ssignature} 
                    penColor="black"
                    canvasProps={{ width: 400, height: 150, className: 'border border-gray-300' }}
                  />
                )}

                {!signaturePreviews["ssignature"] && (
                  <div className="mt-2 space-x-2">
                    <Button variant="esignbtn" size="esignsize" onClick={(e) => handleSaveSignature(e,("ssignature"))} className="py-2">
                      Save Signature
                    </Button>
                    <Button variant="clearesignbtn" size="clearesignsize"
                      onClick={(e) => {
                        e.preventDefault();
                        handleClearSignature("ssignature");
                      }}
                      className="py-2">
                      Clear Signature
                    </Button>
                  </div>
                )}

                {signaturePreviews["ssignature"] && (
                  <div className="flex items-center mt-2">
                    <img src={signaturePreviews["ssignature"]} alt="Signature Preview" className="w-40 h-20 object-contain" />
                    <Button onClick={() => handleClearSignature("ssignature")} className="ml-2 text-red-500 cursor-pointer">
                      &#x2715;
                    </Button>
                  </div>
                )}
              </div>

              {/* Date Input with Calendar */}
              <div className='flex flex-col'>
                <Input
                  type="date"
                  name="date"
                  value={formData?.date ?? ""}
                  onChange={(e) => handleTextareaChange(e, 'date')}
                  className="w-3/4 border-0 border-b-2 border-black focus:ring-0 focus:outline-none cursor-pointer"
                />
                <span className='text-left text-[14px] mt-2'>Date</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-5 items-center">
        <Button
          variant="backbtn"
          size="backbtnsize"
          className="py-2"
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          variant="nextbtn"
          size="nextbtnsize"
          className="py-2.5"
          // onClick={() => {
          //   console.log('Saving form data locally for Supplement tab:', currentTab, 'formData:', formData);
          //   saveFormDataLocally(currentTab, formData);
          //   handleNext();
          // }}
          onClick={handleSubmit}
          >
          Next
        </Button>
      </div>
    </div>
  );
};

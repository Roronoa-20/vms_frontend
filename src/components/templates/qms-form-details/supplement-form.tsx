'use client'
import React from "react";
import { Label } from "../../atoms/label";
import { useSearchParams } from "next/navigation";
import TextareaWithLabel from '@/src/components/common/TextareaWithLabel';
import { useQMSForm } from '@/src/hooks/useQMSForm';
import { Button } from "../../atoms/button";
import { Input } from "../../atoms/input";


export const SupplementForm = ({ vendor_onboarding, company_code }: { vendor_onboarding: string; company_code: string }) => {
  const params = useSearchParams();
  const currentTab = params.get("tabtype")?.toLowerCase() || "supplement";
  const { formData, handleBacktab, handleNextTab, handleTextareaChange } = useQMSForm(vendor_onboarding, currentTab);
  const companyCodes = company_code.split(',').map((code) => code.trim());
  const is2000 = companyCodes.includes('2000');
  const is7000 = companyCodes.includes('7000');

  return (
    <div className='bg-white pt-4 rounded-[8px]'>
      <h2 className="text-lg font-bold bg-gray-200 border border-gray-300 p-3">
        SECTION – IX: SUPPLEMENTAL INFORMATION (Attach separate sheet if required.)
      </h2>

      <TextareaWithLabel
        name="additional_or_supplement_information"
        label="You are invited to include any additional or supplemental information which would be pertinent to this application and the evaluation of your capabilities."
        value={formData.additional_or_supplement_information || ""}
        onChange={() => { }}
        // readOnly
        rows={2}
      />

      {is7000 && formData.quality_manual && (
        <div className="mt-4">
          <Label className="block mb-2 text-sm font-medium text-gray-700">Uploaded Quality Manual:</Label>

          <a
            href={`/api/method/frappe.utils.file_manager.download_file?file_url=${formData.quality_manual}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline text-sm hover:text-blue-800"
          >
            View Quality Manual
          </a>
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
                className="w-3/4 border-0 border-b-2 border-black focus:ring-0 focus:outline-none"
                placeholder="Enter the name here"
                name="name1"
                value={formData?.name1 ?? ""}
                readOnly
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
                readOnly
                onChange={(e) => handleTextareaChange(e, 'title')}
              />
              <span className='text-left text-[14px] mt-2'>Title</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mt-2">
            <div className="">
              {formData.ssignature ? (
                <div className="w-[600px] h-[200px] relative flex items-center">
                  <img
                    src={formData.ssignature || ""}
                    alt="Vendor Signature"
                    className="w-[400px] h-[200px] object-contain border border-gray-300"
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-500">No signature available.</p>
              )}
            </div>

            {/* Date Input with Calendar */}
            <div className='flex flex-col'>
              <Input
                type="date"
                name="date"
                value={formData?.date ?? ""}
                onChange={(e) => handleTextareaChange(e, 'date')}
                readOnly
                className="w-3/4 border-0 border-b-2 border-black focus:ring-0 focus:outline-none cursor-pointer"
              />
              <span className='text-left text-[14px] mt-2'>Date</span>
            </div>
          </div>
        </div>
      )}

      {/* <div className="flex justify-end space-x-5 items-center">
        <Button
          variant="backbtn"
          size="backbtnsize"
          className="py-2"
          onClick={handleBacktab}
        >
          Back
        </Button>
        <Button
          variant="nextbtn"
          size="nextbtnsize"
          className="py-2.5"
          onClick={handleNextTab}
        >
          Next
        </Button>
      </div> */}
    </div>
  );
};

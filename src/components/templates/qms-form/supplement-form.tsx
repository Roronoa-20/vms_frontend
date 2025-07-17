'use client'
import React from "react";
import { Label } from "../../atoms/label";
import { useSearchParams } from "next/navigation";
import TextareaWithLabel from '@/src/components/common/TextareaWithLabel';
import { useQMSForm } from '@/src/hooks/useQMSForm';
import { Button } from "../../atoms/button";


export const SupplementForm = ({ vendor_onboarding }: { vendor_onboarding: string; }) => {
  const params = useSearchParams();
  const currentTab = params.get("tabtype")?.toLowerCase() || "supplement";
  const {
    formData,
    handleCheckboxChange,
    handleBack,
    handleSubmit
  } = useQMSForm(vendor_onboarding, currentTab);

  return (
    <div>
      <h2 className="text-lg font-bold bg-gray-200 border border-gray-300 p-3">
        SECTION – IX: SUPPLEMENTAL INFORMATION (Attach separate sheet if required.)
      </h2>

      <TextareaWithLabel
        name="additional_or_supplement_information"
        label="You are invited to include any additional or supplemental information which would be pertinent to this application and the evaluation of your capabilities."
        value={formData.additional_or_supplement_information || ""}
        onChange={() => { }}
        rows={2}
      />

      {formData.quality_manual && (
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
          onClick={handleSubmit}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

'use client'
import React from "react";
import { Button } from "../../atoms/button";
import { useSearchParams } from "next/navigation";
import YesNoNAGroup from '@/src/components/common/YesNoNAGroup';
import MultiCheckboxGroup from '@/src/components/common/MultiCheckboxGroup';
import { useQMSForm } from '@/src/hooks/useQMSForm';

export const MaterialForm = ({ vendor_onboarding }: { vendor_onboarding: string; }) => {
  const params = useSearchParams();
  const currentTab = params.get("tabtype")?.toLowerCase() || "material";
  const {
    formData,
    handleMultipleCheckboxChange,
    handleCheckboxChange,
    handleBack,
    handleSubmit
  } = useQMSForm(vendor_onboarding, currentTab);

  return (
    <div>
      <h2 className="text-lg font-bold bg-gray-200 border border-gray-300 p-3">
        SECTION – V: MATERIAL CONTROL
      </h2>

      <div className="border border-gray-300 p-3 mb-6 rounded-md">

        <YesNoNAGroup
          name="approved_supplierlist"
          label="1. Do you have an approved supplier list?"
          value={formData.approved_supplierlist || ""}
          // onChange={(e) => handleCheckboxChange(e, 'approved_supplierlist')}
          onChange={() => { }}

        />

        <YesNoNAGroup
          name="agreements"
          label="2. Do you have agreements in place with all critical raw materail suppliers that are required to notify you regarding any change in raw material or the manufacturing process of the material supplied?"
          value={formData.agreements || ""}
          // onChange={(e) => handleCheckboxChange(e, 'agreements')}
          onChange={() => { }}

        />

        <YesNoNAGroup
          name="control_and_inspection"
          label="3. Do you have procedure for incoming raw material control and inspection?"
          value={formData.control_and_inspection || ""}
          // onChange={(e) => handleCheckboxChange(e, 'control_and_inspection')}
          onChange={() => { }}

        />

        <YesNoNAGroup
          name="defined_areas"
          label="4. Do you have defined areas for Receipt, identification, Sampling and Quarantine of incoming materials?"
          value={formData.defined_areas || ""}
          // onChange={(e) => handleCheckboxChange(e, 'defined_areas')}
          onChange={() => { }}

        />

        <MultiCheckboxGroup
          name="inspection_reports"
          label="5. Which of the following information is included in your raw material inspection reports?"
          options={[
            'In-house lot Identity',
            'Suppliers Lot No',
            'Date of Receipt',
            'Suppliers Name',
            'Quantity',
            'Shelf life Test Results',
            'Details whether the lot is Accepted / Rejected',
          ]}
          selected={Array.isArray(formData.inspection_reports) ? formData.inspection_reports : formData.inspection_reports ? [formData.inspection_reports] : []}
          // onChange={(e) => handleMultipleCheckboxChange(e, 'inspection_reports')}
          onChange={() => { }}

        />
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
          onClick={handleSubmit}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

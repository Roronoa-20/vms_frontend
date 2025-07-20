'use client'
import React from "react";
import { Button } from "../../atoms/button";
import { useSearchParams } from "next/navigation";
import YesNoNAGroup from '@/src/components/common/YesNoNAGroup';
import { useQMSForm } from '@/src/hooks/useQMSForm';

export const QualityForm = ({ vendor_onboarding }: { vendor_onboarding: string; }) => {
  const params = useSearchParams();
  const currentTab = params.get("tabtype")?.toLowerCase() || "quality";
  const {
    formData,
    handleCheckboxChange,
    handleBack,
    handleSubmit
  } = useQMSForm(vendor_onboarding, currentTab);


  return (
    <div>
      <h2 className="text-lg font-bold bg-gray-200 border border-gray-300 p-3">
        SECTION – VI: QUALITY CONTROL
      </h2>

      <div className="border border-gray-300 p-3 mb-6 rounded-md">
        <YesNoNAGroup
          name="qc_independent_of_production"
          label="1. Is Quality Control (QC) independent of Production?"
          value={formData.qc_independent_of_production || ""}
          // onChange={(e) => handleCheckboxChange(e, 'qc_independent_of_production')}
          onChange={() => { }}

        />

        <YesNoNAGroup
          name="analytical_methods_validated"
          label="2. Are Analytical methods validated?"
          value={formData.analytical_methods_validated || ""}
          // onChange={(e) => handleCheckboxChange(e, 'analytical_methods_validated')}
          onChange={() => { }}

        />

        <YesNoNAGroup
          name="testing_laboratories"
          label="3. Have you qualified / evaluated any contract / private testing laboratories?"
          value={formData.testing_laboratories || ""}
          // onChange={(e) => handleCheckboxChange(e, 'testing_laboratories')}
          onChange={() => { }}

        />

        <YesNoNAGroup
          name="failure_investigation"
          label="4. Do you perform a failure investigation in case of a reject?"
          value={formData.failure_investigation || ""}
          // onChange={(e) => handleCheckboxChange(e, 'failure_investigation')}
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

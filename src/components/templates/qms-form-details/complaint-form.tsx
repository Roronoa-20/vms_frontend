'use client'
import React from "react";
import { Button } from "../../atoms/button";
import { useSearchParams } from "next/navigation";
import YesNoNAGroup from '@/src/components/common/YesNoNAGroup';
import { useQMSForm } from '@/src/hooks/useQMSForm';

export const ComplaintForm = ({ vendor_onboarding }: { vendor_onboarding: string; }) => {
  const params = useSearchParams();
  const currentTab = params.get("tabtype")?.toLowerCase() || "complaint";
  const {
    formData,
    handleCheckboxChange,
    handleBack,
    handleSubmit
  } = useQMSForm(vendor_onboarding, currentTab);

  return (
    <div>
      <h2 className="text-lg font-bold bg-gray-200 border border-gray-300 p-3">
        SECTION – VIII: COMPLAINT AND RECALLS
      </h2>
      <div className="border border-gray-300 p-3 mb-6 rounded-md">
        <YesNoNAGroup
          name="customer_complaints"
          label="1. Do you have procedure for handling and investigation of customer complaints?"
          value={formData.customer_complaints || ""}
          // onChange={(e) => handleCheckboxChange(e, 'customer_complaints')}
          onChange={() => { }}

        />
        <YesNoNAGroup
          name="retain_complaints_records"
          label="2. Do you retain customer complaints records?"
          value={formData.retain_complaints_records || ""}
          // onChange={(e) => handleCheckboxChange(e, 'retain_complaints_records')}
          onChange={() => { }}

        />
        <YesNoNAGroup
          name="reviews_customer_complaints"
          label="3. Does management reviews customer complaints?"
          value={formData.reviews_customer_complaints || ""}
          // onChange={(e) => handleCheckboxChange(e, 'reviews_customer_complaints')}
          onChange={() => { }}

        />
        <YesNoNAGroup
          name="any_recalls"
          label="4. Have there been any recalls in the last two years?"
          value={formData.any_recalls || ""}
          // onChange={(e) => handleCheckboxChange(e, 'any_recalls')}
          onChange={() => { }}

        />
        <YesNoNAGroup
          name="reporting_environmental_accident"
          label="5. Any reporting accident including environmental accident occured in the last 2 years?<br />If yes, investigated and CAPA taken?"
          value={formData.reporting_environmental_accident || ""}
          // onChange={(e) => handleCheckboxChange(e, 'reporting_environmental_accident')}
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

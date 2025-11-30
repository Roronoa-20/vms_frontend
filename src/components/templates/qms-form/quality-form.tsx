'use client'
import React from "react";
import { Button } from "../../atoms/button";
import { useSearchParams } from "next/navigation";
import YesNoNAGroup from '@/src/components/common/YesNoNAGroup';
import { useQMSForm } from '@/src/hooks/useQMSForm';
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";

export const QualityForm = ({ vendor_onboarding }: { vendor_onboarding: string; }) => {
  const params = useSearchParams();
  const currentTab = params.get("tabtype")?.toLowerCase() || "quality";
  const { formData, handleCheckboxChange, handleBack, handleNext } = useQMSForm(vendor_onboarding, currentTab);

  const isQATeamApproved = formData?.qa_team_approved === 1;

  const handleSubmit = async () => {
    try {
      if (isQATeamApproved) {
        console.log("QA already approved → skipping API");
        handleNext();
        return;
      }
      const form = new FormData();
      const payload = {
        vendor_onboarding,
        qms_form: formData?.name,
        ...formData,
      };
      form.append("data", JSON.stringify(payload));
      console.log("Submitting FormData bfeofre---->", payload)
      const response = await requestWrapper({
        url: API_END_POINTS.updateQualityForm,
        method: "POST",
        data: form,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("API response:", response);
      if (response?.status === 200) {
        handleNext();
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  };


  return (
    <div className="bg-white">
      <h2 className="text-lg font-bold bg-gray-200 border border-gray-300 p-3">
        SECTION – VI: QUALITY CONTROL
      </h2>

      <div className="border border-gray-300 p-3 mb-6 rounded-md">
        <YesNoNAGroup
          name="qc_independent_of_production"
          label="1. Is Quality Control (QC) independent of Production?"
          value={formData.qc_independent_of_production || ""}
          onChange={(e) => handleCheckboxChange(e, 'qc_independent_of_production')}
          disabled={isQATeamApproved}

        />

        <YesNoNAGroup
          name="analytical_methods_validated"
          label="2. Are Analytical methods validated?"
          value={formData.analytical_methods_validated || ""}
          onChange={(e) => handleCheckboxChange(e, 'analytical_methods_validated')}
          disabled={isQATeamApproved}


        />

        <YesNoNAGroup
          name="testing_laboratories"
          label="3. Have you qualified / evaluated any contract / private testing laboratories?"
          value={formData.testing_laboratories || ""}
          onChange={(e) => handleCheckboxChange(e, 'testing_laboratories')}
          disabled={isQATeamApproved}


        />

        <YesNoNAGroup
          name="failure_investigation"
          label="4. Do you perform a failure investigation in case of a reject?"
          value={formData.failure_investigation || ""}
          onChange={(e) => handleCheckboxChange(e, 'failure_investigation')}
          disabled={isQATeamApproved}

        />

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
    </div>
  );
};

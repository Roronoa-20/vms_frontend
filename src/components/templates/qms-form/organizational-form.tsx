'use client'
import React, { FormEvent, useEffect, useState } from "react";
import { Input } from "../../atoms/input";
import { Button } from "../../atoms/button";
import { useRouter, useSearchParams } from "next/navigation";
import YesNoNAGroup from '@/src/components/common/YesNoNAGroup';
import { useQMSForm } from '@/src/hooks/useQMSForm';
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";

export const OrganizationalForm = ({ vendor_onboarding }: { vendor_onboarding: string; }) => {
  const params = useSearchParams();
  const currentTab = params.get("tabtype")?.toLowerCase() || "organizational";
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
        url: API_END_POINTS.updateOrganizationForm,
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
        SECTION – III: ORGANIZATIONAL STRUCTURE & TRAINING
      </h2>
      <div className="border border-gray-300 p-3 mb-6 rounded-md">

        <YesNoNAGroup
          name="organizational_chart"
          label="1. Do you have an organizational chart?"
          value={formData.organizational_chart || ""}
          onChange={(e) => handleCheckboxChange(e, 'organizational_chart')}
          disabled={isQATeamApproved}

        />

        <YesNoNAGroup
          name="procedure_for_training"
          label="2. Do you have prodecure for training?"
          value={formData.procedure_for_training || ""}
          onChange={(e) => handleCheckboxChange(e, 'procedure_for_training')}
          disabled={isQATeamApproved}

        />

        <YesNoNAGroup
          name="maintain_training_records"
          label=" 3. Do you maintain training records?"
          value={formData.maintain_training_records || ""}
          onChange={(e) => handleCheckboxChange(e, 'maintain_training_records')}
          disabled={isQATeamApproved}

        />

        <YesNoNAGroup
          name="effectiveness_of_training"
          label="4. Do you check the effectiveness of training?"
          value={formData.effectiveness_of_training || ""}
          onChange={(e) => handleCheckboxChange(e, 'effectiveness_of_training')}
          disabled={isQATeamApproved}

        />

        <YesNoNAGroup
          name="written_authority"
          label="5. Do you have written job descriptions / responsibility and authority for all personnel?"
          value={formData.written_authority || ""}
          onChange={(e) => handleCheckboxChange(e, 'written_authority')}
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
            // onClick={() => {
            //   console.log('Saving form data locally for Organizational tab:', currentTab, 'formData:', formData);
            //   saveFormDataLocally(currentTab, formData);
            //   handleNext();
            // }}
            onClick={handleSubmit}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

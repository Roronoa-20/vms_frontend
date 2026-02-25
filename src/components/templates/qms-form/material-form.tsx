'use client'
import React from "react";
import { Button } from "../../atoms/button";
import { useSearchParams } from "next/navigation";
import YesNoNAGroup from '@/src/components/common/YesNoNAGroup';
import MultiCheckboxGroup from '@/src/components/common/MultiCheckboxGroup';
import { useQMSForm } from '@/src/hooks/useQMSForm';
import { useMultiSelectOptions } from "@/src/hooks/useMultiSelectOptions";
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";


export const MaterialForm = ({ vendor_onboarding }: { vendor_onboarding: string; }) => {
  const params = useSearchParams();
  const currentTab = params.get("tabtype")?.toLowerCase() || "material";
  const { formData, handleMultipleCheckboxChange, handleCheckboxChange, handleBack, handleNext } = useQMSForm(vendor_onboarding, currentTab);
  const multiSelectOptions = useMultiSelectOptions(vendor_onboarding);

  const isQATeamApproved = formData?.qa_team_approved === 1;
  const requiredFields = ["approved_supplierlist", "agreements", "control_and_inspection", "defined_areas"];

  const isFormValid = () => {
    if (!formData) return false;

    const basicFieldsValid = requiredFields.every((field) => {
      const value = formData[field as keyof typeof formData];

      if (value === null || value === undefined) return false;
      if (typeof value === "string") {
        return value.trim() !== "";
      }
      return true;
    });

    const inspectionReportsValid =
      Array.isArray(formData.inspection_reports) &&
      formData.inspection_reports.length > 0;

    return basicFieldsValid && inspectionReportsValid;
  };

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
        url: API_END_POINTS.updateMaterialForm,
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
        SECTION – V: MATERIAL CONTROL
      </h2>

      <div className="border border-gray-300 p-3 mb-6 rounded-md">

        <YesNoNAGroup
          name="approved_supplierlist"
          label="1. Do you have an approved supplier list?"
          value={formData.approved_supplierlist || ""}
          onChange={(e) => handleCheckboxChange(e, 'approved_supplierlist')}
          disabled={isQATeamApproved}
          required={true}
        />

        <YesNoNAGroup
          name="agreements"
          label="2. Do you have agreements in place with all critical raw materail suppliers that are required to notify you regarding any change in raw material or the manufacturing process of the material supplied?"
          value={formData.agreements || ""}
          onChange={(e) => handleCheckboxChange(e, 'agreements')}
          required={true}
          disabled={isQATeamApproved}
        />

        <YesNoNAGroup
          name="control_and_inspection"
          label="3. Do you have procedure for incoming raw material control and inspection?"
          value={formData.control_and_inspection || ""}
          onChange={(e) => handleCheckboxChange(e, 'control_and_inspection')}
          required={true}
          disabled={isQATeamApproved}
        />

        <YesNoNAGroup
          name="defined_areas"
          label="4. Do you have defined areas for Receipt, identification, Sampling and Quarantine of incoming materials?"
          value={formData.defined_areas || ""}
          onChange={(e) => handleCheckboxChange(e, 'defined_areas')}
          required={true}
          disabled={isQATeamApproved}
        />

        <MultiCheckboxGroup
          name="inspection_reports"
          label="5. Which of the following information is included in your raw material inspection reports?"
          options={multiSelectOptions.inspection_reports}
          // selected={
          //   Array.isArray(formData.have_documentsprocedure)
          //     ? formData.have_documentsprocedure
          //     : formData.have_documentsprocedure
          //       ? [formData.have_documentsprocedure]
          //       : []
          // }
          selected={
            Array.isArray(formData.inspection_reports)
              ? formData.inspection_reports.map((item: any) =>
                typeof item === "object" ? item.qms_inspection_report : item
              )
              : []
          }
          onChange={(e) => {handleMultipleCheckboxChange(e, "inspection_reports") }}
          columns={3}
          required={true}
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
            disabled={!isFormValid() || isQATeamApproved}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

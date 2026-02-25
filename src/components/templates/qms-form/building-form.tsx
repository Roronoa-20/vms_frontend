'use client'
import React from "react";
import { Button } from "../../atoms/button";
import { useSearchParams } from "next/navigation";
import YesNoNAGroup from '@/src/components/common/YesNoNAGroup';
import TextareaWithLabel from '@/src/components/common/TextareaWithLabel';
import { useQMSForm } from '@/src/hooks/useQMSForm';
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";

export const BuildingForm = ({ vendor_onboarding }: { vendor_onboarding: string; }) => {
  const params = useSearchParams();
  const currentTab = params.get("tabtype")?.toLowerCase() || "building";
  const { formData, handleTextareaChange, handleCheckboxChange, handleBack, handleNext } = useQMSForm(vendor_onboarding, currentTab);

  const isQATeamApproved = formData?.qa_team_approved === 1;
  const requiredFields = ["area_of_facility", "no_of_employees", "valid_license", "air_handling_unit", "humidity", "pest_control", "adequate_sizes", "clean_rooms", "water_disposal", "safety_committee"];

  const isFormValid = () => {
    if (!formData) return false;

    return requiredFields.every((field) => {
      const value = formData[field as keyof typeof formData];
      if (value === null || value === undefined) return false;
      if (typeof value === "string") {
        return value.trim() !== "";
      }
      return true;
    });
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
        url: API_END_POINTS.updateBuildingForm,
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
        SECTION – IV: BUILDING & FACILITY
      </h2>
      <div className="border border-gray-300 p-3 mb-6 rounded-md space-y-6">
        <TextareaWithLabel
          name="area_of_facility"
          label="1. What is the approximate area of your facility? (Sq. meter / Sq. feet)"
          value={formData.area_of_facility || ""}
          rows={1}
          onChange={(e) => handleTextareaChange(e, 'area_of_facility')}
          disabled={isQATeamApproved}
          required={true}
        />

        <TextareaWithLabel
          name="no_of_employees"
          label="2. Please provide the approximate number of employees in your organization"
          value={formData.no_of_employees || ""}
          rows={1}
          disabled={isQATeamApproved}
          onChange={(e) => handleTextareaChange(e, 'no_of_employees')}
          required={true}

        />

        <TextareaWithLabel
          name="valid_license"
          label="3. Does the Organization have valid license / registrations available? (e.g., Factory license, PCB consents, etc.)"
          value={formData.valid_license || ""}
          rows={1}
          onChange={(e) => handleTextareaChange(e, 'valid_license')}
          disabled={isQATeamApproved}
          required={true}

        />

        <YesNoNAGroup
          name="air_handling_unit"
          label="4. Do you have an Air Handling Unit?"
          value={formData.air_handling_unit || ""}
          onChange={(e) => handleCheckboxChange(e, 'air_handling_unit')}
          required={true}
          disabled={isQATeamApproved}
        />

        <YesNoNAGroup
          name="humidity"
          label="5. Do you control and monitor temperature and relative humidity?"
          value={formData.humidity || ""}
          onChange={(e) => handleCheckboxChange(e, 'humidity')}
          required={true}
          disabled={isQATeamApproved}
        />

        <YesNoNAGroup
          name="pest_control"
          label="6. Do you have procedure for pest control?"
          value={formData.pest_control || ""}
          onChange={(e) => handleCheckboxChange(e, 'pest_control')}
          required={true}
          disabled={isQATeamApproved}
        />

        <YesNoNAGroup
          name="adequate_sizes"
          label="7. Are your working areas of adequate size, well illuminated, air-conditioned and designed to avoid (cross) contamination?"
          value={formData.adequate_sizes || ""}
          onChange={(e) => handleCheckboxChange(e, 'adequate_sizes')}
          required={true}
          disabled={isQATeamApproved}
        />

        <YesNoNAGroup
          name="clean_rooms"
          label="8. Do you have clean rooms?"
          value={formData.clean_rooms || ""}
          onChange={(e) => handleCheckboxChange(e, 'clean_rooms')}
          required={true}
          disabled={isQATeamApproved}
        />

        <YesNoNAGroup
          name="water_disposal"
          label="9. Do you have procedure for waste disposal?"
          value={formData.water_disposal || ""}
          onChange={(e) => handleCheckboxChange(e, 'water_disposal')}
          required={true}
          disabled={isQATeamApproved}

        />

        <YesNoNAGroup
          name="safety_committee"
          label="10. Does the factory have a safety committee?"
          value={formData.safety_committee || ""}
          onChange={(e) => handleCheckboxChange(e, 'safety_committee')}
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

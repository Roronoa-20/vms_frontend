'use client'
import React from "react";
import { Button } from "../../atoms/button";
import { useSearchParams } from "next/navigation";
import YesNoNAGroup from '@/src/components/common/YesNoNAGroup';
import TextareaWithLabel from '@/src/components/common/TextareaWithLabel';
import { useQMSForm } from '@/src/hooks/useQMSForm';

export const BuildingForm = ({ vendor_onboarding }: { vendor_onboarding: string; }) => {
  const params = useSearchParams();
  const currentTab = params.get("tabtype")?.toLowerCase() || "building";
  const { formData, handleTextareaChange, handleCheckboxChange, handleBack, handleNext, saveFormDataLocally, handleSubmit } = useQMSForm(vendor_onboarding, currentTab);

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

        />

        <TextareaWithLabel
          name="no_of_employees"
          label="2. Please provide the approximate number of employees in your organization"
          value={formData.no_of_employees || ""}
          rows={1}
          onChange={(e) => handleTextareaChange(e, 'no_of_employees')}

        />

        <TextareaWithLabel
          name="valid_license"
          label="3. Does the Organization have valid license / registrations available? (e.g., Factory license, PCB consents, etc.)"
          value={formData.valid_license || ""}
          rows={1}
          onChange={(e) => handleTextareaChange(e, 'valid_license')}

        />

        <YesNoNAGroup
          name="air_handling_unit"
          label="4. Do you have an Air Handling Unit?"
          value={formData.air_handling_unit || ""}
          onChange={(e) => handleCheckboxChange(e, 'air_handling_unit')}

        />

        <YesNoNAGroup
          name="humidity"
          label="5. Do you control and monitor temperature and relative humidity?"
          value={formData.humidity || ""}
          onChange={(e) => handleCheckboxChange(e, 'humidity')}

        />

        <YesNoNAGroup
          name="pest_control"
          label="6. Do you have procedure for pest control?"
          value={formData.pest_control || ""}
          onChange={(e) => handleCheckboxChange(e, 'pest_control')}

        />

        <YesNoNAGroup
          name="adequate_sizes"
          label="7. Are your working areas of adequate size, well illuminated, air-conditioned and designed to avoid (cross) contamination?"
          value={formData.adequate_sizes || ""}
          onChange={(e) => handleCheckboxChange(e, 'adequate_sizes')}

        />

        <YesNoNAGroup
          name="clean_rooms"
          label="8. Do you have clean rooms?"
          value={formData.clean_rooms || ""}
          onChange={(e) => handleCheckboxChange(e, 'clean_rooms')}

        />

        <YesNoNAGroup
          name="water_disposal"
          label="9. Do you have procedure for waste disposal?"
          value={formData.water_disposal || ""}
          onChange={(e) => handleCheckboxChange(e, 'water_disposal')}

        />

        <YesNoNAGroup
          name="safety_committee"
          label="10. Does the factory have a safety committee?"
          value={formData.safety_committee || ""}
          onChange={(e) => handleCheckboxChange(e, 'safety_committee')}

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
            //   console.log('Saving form data locally for Building tab:', currentTab, 'formData:', formData);
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

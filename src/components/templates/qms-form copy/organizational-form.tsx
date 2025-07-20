'use client'
import React, { FormEvent, useEffect, useState } from "react";
import { Input } from "../../atoms/input";
import { Button } from "../../atoms/button";
import { useRouter, useSearchParams } from "next/navigation";
import YesNoNAGroup from '@/src/components/common/YesNoNAGroup';
import { useQMSForm } from '@/src/hooks/useQMSForm';

export const OrganizationalForm = ({ vendor_onboarding }: { vendor_onboarding: string; }) => {
  const params = useSearchParams();
  const currentTab = params.get("tabtype")?.toLowerCase() || "organizational";
  const {
    formData,
    handleCheckboxChange,
    handleBack,
    handleSubmit
  } = useQMSForm(vendor_onboarding, currentTab);

  return (
    <div>
      <h2 className="text-lg font-bold bg-gray-200 border border-gray-300 p-3">
        SECTION – III: ORGANIZATIONAL STRUCTURE & TRAINING
      </h2>
      <div className="border border-gray-300 p-3 mb-6 rounded-md">

        <YesNoNAGroup
          name="organizational_chart"
          label="1. Do you have an organizational chart?"
          value={formData.organizational_chart || ""}
          // onChange={(e) => handleCheckboxChange(e, 'organizational_chart')}
          onChange={() => { }}
          
        />

        <YesNoNAGroup
          name="procedure_for_training"
          label="2. Do you have prodecure for training?"
          value={formData.procedure_for_training || ""}
          // onChange={(e) => handleCheckboxChange(e, 'procedure_for_training')}
          onChange={() => { }}

        />

        <YesNoNAGroup
          name="maintain_training_records"
          label=" 3. Do you maintain training records?"
          value={formData.maintain_training_records || ""}
          // onChange={(e) => handleCheckboxChange(e, 'maintain_training_records')}
          onChange={() => { }}

        />

        <YesNoNAGroup
          name="effectiveness_of_training"
          label="4. Do you check the effectiveness of training?"
          value={formData.effectiveness_of_training || ""}
          // onChange={(e) => handleCheckboxChange(e, 'effectiveness_of_training')}
          onChange={() => { }}

        />

        <YesNoNAGroup
          name="written_authority"
          label="5. Do you have written job descriptions / responsibility and authority for all personnel?"
          value={formData.written_authority || ""}
          // onChange={(e) => handleCheckboxChange(e, 'written_authority')}
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

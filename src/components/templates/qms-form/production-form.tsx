'use client'
import React from "react";
import { Button } from "../../atoms/button";
import { Label } from "../../atoms/label";
import { useSearchParams } from "next/navigation";
import YesNoNAGroup from '@/src/components/common/YesNoNAGroup';
import TextareaWithLabel from '@/src/components/common/TextareaWithLabel';
import MultiCheckboxGroup from '@/src/components/common/MultiCheckboxGroup';
import { useQMSForm } from '@/src/hooks/useQMSForm';
import YesNoNAOptions from "../../common/YesNoNAOptions";

export const ProductionForm = ({ vendor_onboarding }: { vendor_onboarding: string; }) => {
  const params = useSearchParams();
  const currentTab = params.get("tabtype")?.toLowerCase() || "production";
  const {
    formData,
    handleCheckboxChange,
    handleBack,
    handleSubmit
  } = useQMSForm(vendor_onboarding, currentTab);

  return (
    <div>
      <h2 className="text-lg font-bold bg-gray-200 border border-gray-300 p-3">
        SECTION – VII: PRODUCTION AND PROCESS CONTROL
      </h2>

      <div className="border border-gray-300 p-3 mb-6 rounded-md">
        <YesNoNAGroup
          name="manufactruing_process_validate"
          label="1. Are the manufacturing process validated?"
          value={formData.manufactruing_process_validate || ""}
          onChange={(e) => handleCheckboxChange(e, 'manufactruing_process_validate')}
        />

        <YesNoNAGroup
          name="nonconforming_materials_removed"
          label="2. Are nonconforming materials removed from the production areas and prominently identified or destroyed to preclude further usage?"
          value={formData.nonconforming_materials_removed || ""}
          onChange={(e) => handleCheckboxChange(e, 'nonconforming_materials_removed')}
        />

        <div className="mb-3 border-b border-gray-300 pb-4">
          <Label className="font-semibold text-[16px] leading-[19px] text-[#03111F]">
            3. Are there separate areas for:
          </Label>

          <div className="space-y-4 mt-3">
            {[
              { name: 'handling_of_start_materials', label: 'A. Handling of starting materials' },
              { name: 'manufacturing', label: 'B. Manufacturing' },
              { name: 'quarantined_finish_products', label: 'C. Quarantined finished products or are other control systems in place' },
              { name: 'storage_of_approved_finished_products', label: 'D. Storage of approved finished products' },
            ].map((item) => (
              <div key={item.name} className="flex items-center space-x-16">
                <Label
                  htmlFor={item.name}
                  className="font-semibold text-[16px] leading-[19px] text-[#03111F] w-1/2 pl-4"
                >
                  {item.label}
                </Label>
                <YesNoNAOptions
                  name={item.name}
                  value={
                    Array.isArray(formData[item.name as keyof typeof formData])
                      ? (formData[item.name as keyof typeof formData] as string[])[0] || ''
                      : (formData[item.name as keyof typeof formData] as string) || ''
                  }
                  onChange={() => { }}
                />
              </div>
            ))}
          </div>
        </div>

        <YesNoNAGroup
          name="identification_number"
          label=" 4. Does each lot /batch have an identification number?"
          value={formData.identification_number ?? ""}
          onChange={() => { }}
        />

        <YesNoNAGroup
          name="product_identifiable"
          label="5. Is the product identifiable throughout the manufacturing process?"
          value={formData.product_identifiable || ""}
          onChange={() => { }}
        />

        <YesNoNAGroup
          name="traceability"
          label="6. Is traceability of all raw materials sed, maintained throughout manfacturing?"
          value={formData.traceability || ""}
          onChange={(e) => handleCheckboxChange(e, 'traceability')}
        />

        <YesNoNAGroup
          name="prevent_cross_contamination"
          label="7. Is there a procedure in place to prevent cross-contamination?"
          value={formData.prevent_cross_contamination || ""}
          onChange={(e) => handleCheckboxChange(e, 'prevent_cross_contamination')}
        />

        <YesNoNAGroup
          name="testing_or_inspection"
          label="8. Is testing or inspection performed between processes or manufacturing stages?"
          value={formData.testing_or_inspection || ""}
          onChange={(e) => handleCheckboxChange(e, 'testing_or_inspection')}
        />

        <div className="mb-3 border-b border-gray-300 pb-4">
          <YesNoNAGroup
            name="batch_record"
            label="9. Do you have a batch record for each batch / lot manufactured?"
            value={formData.batch_record ?? ""}
            onChange={() => { }}
          />
          {formData.batch_record === "Yes" && (
            <MultiCheckboxGroup
              name="details_of_batch_records"
              label="If yes, which of the following details are included in the batch records:"
              options={[
                "Description, Lot Number & Quantities of Material used",
                "Processing Conditions - Temperature, Time etc.",
                "The identification of the personnel who performed the particular step",
                "Results of any In-process tests",
                "Details of deviations from standard conditions",
              ]}
              selected={Array.isArray(formData.details_of_batch_records) ? formData.details_of_batch_records : []}
              onChange={() => { }}
              columns={2}
            />
          )}
        </div>

        <TextareaWithLabel
          name="duration_of_batch_records"
          label="10. For how long do you keep the batch records? (Year / Month)"
          value={formData.duration_of_batch_records || ""}
          onChange={() => { }}
          rows={1}
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

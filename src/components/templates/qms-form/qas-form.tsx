'use client'
import React, { useEffect, useState } from "react";
import { Button } from "../../atoms/button";
import { useSearchParams } from "next/navigation";
import YesNoNAGroup from '@/src/components/common/YesNoNAGroup';
import ConditionalTextareaGroup from '@/src/components/common/ConditionalTextareaGroup';
import MultiCheckboxGroup from '@/src/components/common/MultiCheckboxGroup';
import { useQMSForm } from '@/src/hooks/useQMSForm';
import SingleCheckboxGroup from '@/src/components/common/SingleCheckboxGroup';
import { useMultiSelectOptions } from "@/src/hooks/useMultiSelectOptions";


export const QASForm = ({ vendor_onboarding, ref_no }: { vendor_onboarding: string; ref_no: string; }) => {
  const params = useSearchParams();
  const currentTab = params.get("tabtype")?.toLowerCase() || "qas";
  const { formData, handleBack, handleNext, saveFormDataLocally, handleMultipleCheckboxChange, handleTextareaChange, handleSingleCheckboxChange, handleSubmit } = useQMSForm(vendor_onboarding, currentTab);
  const multiSelectOptions = useMultiSelectOptions(vendor_onboarding);

  return (
    <div className="bg-white">
      <h2 className="text-lg font-bold bg-gray-100 border border-gray-300 p-3">
        SECTION – II: QUALITY ASSURANCE SYSTEMS AND PROCEDURES
      </h2>

      <div className="border border-gray-300 p-3 mb-6 rounded-md">

        <MultiCheckboxGroup
          name="quality_control_system"
          label="1. The Quality Control System is derived to comply with the following(s):"
          options={multiSelectOptions.quality_control_system}
          // selected={
          //   Array.isArray(formData.quality_control_system)
          //     ? formData.quality_control_system
          //     : formData.quality_control_system
          //       ? [formData.quality_control_system]
          //       : []
          // }
          selected={
            Array.isArray(formData.quality_control_system)
              ? formData.quality_control_system.map((item: any) =>
                typeof item === "object" ? item.qms_quality_control : item
              )
              : []
          }
          onChange={(e) => { handleMultipleCheckboxChange(e, "quality_control_system") }}
          columns={3}
        />

        <ConditionalTextareaGroup
          name="others_certificates"
          label=""
          value={formData.others_certificates || ""}
          condition={
            Array.isArray(formData.quality_control_system)
              ? formData.quality_control_system.some((item: any) =>
                typeof item === "object"
                  ? item.qms_quality_control === "Others"
                  : item === "Others"
              )
              : false
          }
          placeholder="Enter the Other Certificates details here"
          onChange={(e) => { handleTextareaChange(e, "others_certificates") }}
        />

        <SingleCheckboxGroup
          name="sites_inspected_by"
          label="2. Is your site inspected by:"
          options={["Local health authorities", "Others"]}
          value={formData.sites_inspected_by || ""}
          onChange={(e) => { handleSingleCheckboxChange(e, "sites_inspected_by") }}
        />

        <ConditionalTextareaGroup
          name="inspected_by_others"
          label=""
          value={formData.inspected_by_others || ""}
          condition={
            Array.isArray(formData.sites_inspected_by)
              ? formData.sites_inspected_by.includes("Others")
              : formData.sites_inspected_by === "Others"
          }
          placeholder="Enter the details here"
          onChange={(e) => { handleTextareaChange(e, "inspected_by_others") }}
        />

        <MultiCheckboxGroup
          name="have_documentsprocedure"
          label="3. Do you have the following documents/procedures in place:"
          options={multiSelectOptions.have_documentsprocedure}
          // selected={
          //   Array.isArray(formData.have_documentsprocedure)
          //     ? formData.have_documentsprocedure
          //     : formData.have_documentsprocedure
          //       ? [formData.have_documentsprocedure]
          //       : []
          // }
          selected={
            Array.isArray(formData.have_documentsprocedure)
              ? formData.have_documentsprocedure.map((item: any) =>
                typeof item === "object" ? item.qms_procedure_doc : item
              )
              : []
          }
          onChange={(e) => { handleMultipleCheckboxChange(e, "have_documentsprocedure") }}
          columns={3}
        />

        <YesNoNAGroup
          name="prior_notification"
          label="4. Do you agree to provide prior notification before any of the major changes are implemented in the system?"
          onChange={(e) => { handleSingleCheckboxChange(e, "prior_notification") }}
          value={formData.prior_notification || ""}
        />

        {formData.prior_notification === "Yes" && (
          <MultiCheckboxGroup
            name="if_yes_for_prior_notification"
            label="If Yes, tick the particulars in which you agree to provide prior notification:"
            options={multiSelectOptions.if_yes_for_prior_notification}
            // selected={
            //   Array.isArray(formData.if_yes_for_prior_notification)
            //     ? formData.if_yes_for_prior_notification
            //     : formData.if_yes_for_prior_notification
            //       ? [formData.if_yes_for_prior_notification]
            //       : []
            // }
            selected={
              Array.isArray(formData.if_yes_for_prior_notification)
                ? formData.if_yes_for_prior_notification.map((item: any) =>
                  typeof item === "object" ? item.qms_prior_notification : item
                )
                : []
            }
            onChange={(e) => { handleMultipleCheckboxChange(e, "if_yes_for_prior_notification") }}
            columns={2}
          />
        )}

        <YesNoNAGroup
          name="calibrations_performed"
          label="5. Are calibrations performed as per the procedure and is the calibration schedule in place?"
          value={formData.calibrations_performed || ""}
          onChange={(e) => { handleSingleCheckboxChange(e, "calibrations_performed") }}
        />

        <YesNoNAGroup
          name="regular_review_of_quality_system"
          label="6. Do you undertake regular review of the Quality System?"
          value={formData.regular_review_of_quality_system || ""}
          onChange={(e) => { handleSingleCheckboxChange(e, "regular_review_of_quality_system") }}
        />
        
        <ConditionalTextareaGroup
          name="review_frequency"
          label="If yes, please provide the frequency of review and what is the agenda of the review:"
          value={formData.review_frequency ?? ""}
          condition={formData.regular_review_of_quality_system === "Yes"}
          placeholder="Enter the details"
          onChange={(e) => { handleTextareaChange(e, "review_frequency") }}
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
            //   console.log('Saving form data locally for qas tab:', currentTab, 'formData:', formData);
            //   saveFormDataLocally(currentTab, formData);
            //   handleNext();
            // }}
            onClick={handleSubmit}
          >
            Next
          </Button>
        </div>
      </div>
    </div >
  );
};

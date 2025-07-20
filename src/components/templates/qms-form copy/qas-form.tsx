'use client'
import React from "react";
import { Button } from "../../atoms/button";
import { useSearchParams } from "next/navigation";
import YesNoNAGroup from '@/src/components/common/YesNoNAGroup';
import ConditionalTextareaGroup from '@/src/components/common/ConditionalTextareaGroup';
import MultiCheckboxGroup from '@/src/components/common/MultiCheckboxGroup';
import { useQMSForm } from '@/src/hooks/useQMSForm';

export const QASForm = ({ vendor_onboarding }: { vendor_onboarding: string; }) => {
  const params = useSearchParams();
  const currentTab = params.get("tabtype")?.toLowerCase() || "qas";
  const {formData, handleBack, handleSubmit} = useQMSForm(vendor_onboarding, currentTab);

  return (
    <div>
      <h2 className="text-lg font-bold bg-gray-200 border border-gray-300 p-3">
        SECTION – II: QUALITY ASSURANCE SYSTEMS AND PROCEDURES
      </h2>

      <div className="border border-gray-300 p-3 mb-6 rounded-md">

        <MultiCheckboxGroup
          name="quality_control_system"
          label="1. The Quality Control System is derived to comply with the following(s):"
          options={["ISO 9001", "ISO 13485", "GMP", "ISO/IEC 17025:2005", "ISO 14001", "ISO 45001", "Others",
          ]}
          selected={Array.isArray(formData.quality_control_system) ? formData.quality_control_system.map(item => item.qms_quality_control) : []}
          onChange={() => { }}
          columns={3}
        />
        <ConditionalTextareaGroup
          name="others_certificates"
          label=""
          value={formData.others_certificates || ""}
          condition={Array.isArray(formData.quality_control_system) ? formData.quality_control_system.map(item => item.qms_quality_control).includes("Others") : false
          } onChange={() => { }}
        />

        <MultiCheckboxGroup
          name="sites_inspected_by"
          label="2. Is your site inspected by:"
          options={["Local health authorities", "Others:"]}
          selected={formData.sites_inspected_by ? [formData.sites_inspected_by] : []}
          onChange={() => { }}
          columns={2}
        />
        <ConditionalTextareaGroup
          name="inspected_by_others"
          label=""
          value={formData.inspected_by_others || ""}
          condition={formData.sites_inspected_by === "Others:"}
          placeholder="Enter the details here"
          onChange={() => { }}
        />

        <MultiCheckboxGroup
          name="have_documentsprocedure"
          label="3. Do you have the following documents/procedures in place:"
          options={["Quality Management Manual", "Internal Quality Audit", "Change Control", "Corrective and Preventive Action", "Environmental Monitoring", "Risk Management", "Calibration", "Emergency Mitigation Plan",]}
          selected={Array.isArray(formData.have_documentsprocedure) ? formData.have_documentsprocedure.map(item => item.qms_procedure_doc) : []}
          onChange={() => { }}
          columns={3}
        />

        <MultiCheckboxGroup
          name="prior_notification"
          label="4. Do you agree to provide prior notification before any of the major changes are implemented in the system?"
          options={["Yes", "No"]}
          selected={formData.prior_notification ? [formData.prior_notification] : []}
          onChange={() => { }}
          columns={2}
        />
        {formData.prior_notification === "Yes" && (
          <MultiCheckboxGroup
            name="if_yes_for_prior_notification"
            label="If Yes, tick the particulars in which you agree to provide prior notification:"
            options={[
              "Change in the method of manufacturing",
              "Change in the manufacturing site",
              "Change in the registration / licensing status of the site",
              "Change in the Raw Material specification",
            ]}
            selected={Array.isArray(formData.if_yes_for_prior_notification) ? formData.if_yes_for_prior_notification.map(item => item.qms_prior_notification) : []}
            onChange={() => { }}
            columns={2}
          />
        )}

        <YesNoNAGroup
          name="calibrations_performed"
          label="5. Are calibrations performed as per the procedure and is the calibration schedule in place?"
          value={formData.calibrations_performed || ""}
          onChange={() => { }}
        // disabled={true}
        />

        <MultiCheckboxGroup
          name="regular_review_of_quality_system"
          label="6. Do you undertake regular review of the Quality System?"
          options={["Yes", "No", "N/A"]}
          selected={formData.regular_review_of_quality_system ? [formData.regular_review_of_quality_system] : []}
          onChange={() => { }}
          columns={3}
        />
        <ConditionalTextareaGroup
          name="review_frequency"
          label="If yes, please provide the frequency of review and what is the agenda of the review:"
          value={formData.review_frequency ?? ""}
          condition={formData.regular_review_of_quality_system === "Yes"}
          placeholder="Enter the details"
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
    </div >
  );
};

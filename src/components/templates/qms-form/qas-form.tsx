'use client'
import React, { FormEvent, useEffect, useState } from "react";
import { Input } from "../../atoms/input";
import { Button } from "../../atoms/button";
import { Label } from "../../atoms/label";
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { QMSFormTabs } from "@/src/constants/vendorDetailSidebarTab";
import { QMSForm } from '@/src/types/qmstypes';

interface QASFormProps {
  vendor_onboarding: string;
}

export const QASForm: React.FC<QASFormProps> = ({ vendor_onboarding }) => {
  const { designation } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const currentTab = params.get("tabtype")?.toLowerCase();

  const [formData, setFormData] = useState<QMSForm>({
    name: "",
    creation: "",
    owner: "",
    ref_no: "",
    quality_control_system: [],
    if_yes_for_prior_notification: [],
    others_certificates: "",
    sites_inspected_by: "",
    inspected_by_others: "",
    prior_notification: "",
    have_documentsprocedure: [],
    calibrations_performed: "",
    regular_review_of_quality_system: "",
    review_frequency: ""
  });

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await requestWrapper({
          url: API_END_POINTS.qmsformdetails,
          method: "GET",
          params: { vendor_onboarding },
        });

        const data = response?.data?.message?.qms_details;
        console.log("Data of qms form---->", data);
        setFormData((prev) => ({
          ...prev,
          quality_control_system: data?.quality_control_system?.split(',') || [],
          others_certificates: data?.others_certificates || "",
          if_yes_for_prior_notification: data?.if_yes_for_prior_notification?.split(',') || [],
          sites_inspected_by: data?.sites_inspected_by || "",
          inspected_by_others: data?.inspected_by_others || "",
          prior_notification: data?.prior_notification || "",
          have_documentsprocedure: data?.have_documentsprocedure?.split(',') || [],
          calibrations_performed: data?.calibrations_performed || "",
          regular_review_of_quality_system: data?.regular_review_of_quality_system || "",
          review_frequency: data?.review_frequency


        }));
      } catch (error) {
        console.error("Error fetching QMS form data:", error);
      }
    };

    fetchFormData();
  }, [vendor_onboarding]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>,
    field: keyof QMSForm
  ) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSingleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof QMSForm
  ) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: checked ? value : "",
    }));
  };

  const handleRadioboxChange = handleSingleCheckboxChange;

  const handleMultipleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof QMSForm
  ) => {
    const { value, checked } = e.target;

    setFormData((prev) => {
      const existing = Array.isArray(prev[field]) ? [...(prev[field] as string[])] : [];
      return {
        ...prev,
        [field]: checked
          ? [...existing, value]
          : existing.filter((v) => v !== value),
      };
    });
  };

  const handleSubmit = () => {
    const currentIndex = QMSFormTabs.findIndex(
      (tab) => tab.toLowerCase() === currentTab
    );
    const nextTab = QMSFormTabs[currentIndex + 1];

    if (nextTab) {
      router.push(
        `/qms-details?vendor_onboarding=${vendor_onboarding}&tabtype=${encodeURIComponent(nextTab)}`
      );
    } else {
      alert("You’ve reached the last tab");
    }
  };

  const handleBack = () => {
    const currentIndex = QMSFormTabs.findIndex(
      (tab) => tab.toLowerCase() === currentTab);
    const backtab = QMSFormTabs[currentIndex - 1];

    if (backtab) {
      router.push(
        `/qms-details?vendor_onboarding=${vendor_onboarding}&tabtype=${encodeURIComponent(backtab)}`
      );
    } else {
      alert("You’ve reached the last tab");
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold bg-gray-200 border border-gray-300 p-3">
        SECTION – II: QUALITY ASSURANCE SYSTEMS AND PROCEDURES
      </h2>

      <div className="border border-gray-300 p-3 mb-6 rounded-md">
        <div className="mb-3 border-b border-gray-300 pb-2">
          <Label
            htmlFor="quality_control_system"
            className="font-semibold text-[16px] leading-[19px] text-[#03111F]"
          >
            1. The Quality Control System is derived to comply with the following(s):
          </Label>
          <div className="grid grid-cols-3 mt-2 gap-2">
            {["ISO 9001", "ISO 13485", "GMP", "ISO/IEC 17025:2005", "ISO 14001", "ISO 45001", "Others:"].map(option => (
              <Label className="inline-flex items-center space-x-2" key={option}>
                <Input
                  type="checkbox"
                  name="quality_control_system"
                  className={`w-4 h-4 cursor-not-allowed accent-blue-500 disabled:opacity-100 disabled:bg-white disabled:border-blue-500 disabled:checked:accent-blue-500`}
                  value={option}
                  disabled
                  checked={formData.quality_control_system?.includes(option)}
                  onChange={(e) => handleMultipleCheckboxChange(e, 'quality_control_system')}
                />
                <span className="text-[14px]">{option}</span>
              </Label>
            ))}
          </div>
          <div className="mt-1">
            {formData.quality_control_system?.includes('Others:') && (
              <textarea
                className="border rounded p-2 w-full h-full"
                name="quality_control_system"
                placeholder="Enter for other Certifications"
                value={formData.others_certificates}
                disabled
                onChange={(e) => handleTextareaChange(e, 'others_certificates')}
              />
            )}
          </div>
        </div>
        <div className="mb-3 border-b border-gray-300 pb-2">
          <Label htmlFor="sites_inspected_by" className="font-semibold text-[16px] leading-[19px] text-[#03111F]">
            2. Is your site inspected by:
          </Label>

          <div className="space-x-16 mt-2">
            {["Local health authorities", "Others:"].map((option) => (
              <Label key={option} className="inline-flex items-center space-x-2">
                <Input
                  type="checkbox"
                  name="sites_inspected_by"
                  className="w-4 h-4"
                  value={option}
                  disabled
                  checked={formData.sites_inspected_by === option}
                  onChange={(e) => handleRadioboxChange(e, 'sites_inspected_by')}
                />
                <span className="text-[14px]">{option}</span>
              </Label>
            ))}
          </div>

          {formData.sites_inspected_by === 'Others:' && (
            <textarea
              className="border rounded p-2 w-full mt-2"
              name="inspected_by_others"
              placeholder="Enter the details here"
              value={formData.inspected_by_others}
              disabled
              onChange={(e) => handleTextareaChange(e, 'inspected_by_others')}
            />
          )}
        </div>
        <div className="mb-3 border-b border-gray-300 pb-4">
          <Label htmlFor="have_documentsprocedure" className="font-semibold text-[16px] leading-[19px] text-[#03111F]">
            3. Do you have the following documents/procedures in place:
          </Label>

          <div className="grid grid-cols-3 gap-y-3 mt-2">
            {[
              "Quality Management Manual",
              "Internal Quality Audit",
              "Change Control",
              "Corrective and Preventive Action",
              "Environmental Monitoring",
              "Risk Management",
              "Calibration",
              "Emergency Mitigation Plan",
            ].map((item) => (
              <Label key={item} className="inline-flex items-center space-x-2">
                <Input
                  type="checkbox"
                  name="have_documentsprocedure"
                  className="w-4 h-4"
                  value={item}
                  disabled
                  checked={formData.have_documentsprocedure?.includes(item)}
                  onChange={(e) => handleMultipleCheckboxChange(e, 'have_documentsprocedure')}
                />
                <span className="text-[14px]">{item}</span>
              </Label>
            ))}
          </div>
        </div>
        <div className="mb-3 border-b border-gray-300 pb-4">
          <Label htmlFor="prior_notification" className="font-semibold text-[16px] leading-[19px] text-[#03111F]">
            4. Do you agree to provide prior notification before any of the major changes are implemented in the system?
          </Label>

          <div className="space-x-16 mt-2">
            {["Yes", "No"].map((val) => (
              <Label key={val} className="inline-flex items-center space-x-2">
                <Input
                  type="checkbox"
                  name="prior_notification"
                  className="w-4 h-4"
                  value={val}
                  disabled
                  checked={formData.prior_notification === val}
                  onChange={(e) => handleSingleCheckboxChange(e, 'prior_notification')}
                />
                <span className="text-[14px]">{val}</span>
              </Label>
            ))}
          </div>
          {formData.prior_notification === "Yes" && (
            <div className="mt-3">
              <Label htmlFor="if_yes_for_prior_notification" className="font-semibold text-[16px] leading-[19px] text-[#03111F]">
                If Yes, tick the particulars in which you agree to provide prior notification:
              </Label>
              <div className="grid grid-cols-2 gap-y-3 mt-2">
                {[
                  "Change in the method of manufacturing",
                  "Change in the manufacturing site",
                  "Change in the registration / licensing status of the site",
                  "Change in the Raw Material specification",
                ].map((item) => (
                  <Label key={item} className="inline-flex items-center space-x-2">
                    <Input
                      type="checkbox"
                      name="if_yes_for_prior_notification"
                      className="w-4 h-4"
                      value={item}
                      disabled
                      checked={formData.if_yes_for_prior_notification?.includes(item)}
                      onChange={(e) => handleMultipleCheckboxChange(e, 'if_yes_for_prior_notification')}
                    />
                    <span className="text-[14px]">{item}</span>
                  </Label>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="mb-3 border-b border-gray-300 pb-4">
          <Label htmlFor="calibrations_performed" className="font-semibold text-[16px] leading-[19px] text-[#03111F]">
            5. Are calibrations performed as per the procedure and is the calibration schedule in place?
          </Label>

          <div className="space-x-16 mt-2">
            {["Yes", "No", "N/A"].map((val) => (
              <Label key={val} className="inline-flex items-center space-x-2">
                <Input
                  type="checkbox"
                  name="calibrations_performed"
                  className="w-4 h-4"
                  value={val}
                  disabled
                  checked={formData.calibrations_performed === val}
                  onChange={(e) => handleSingleCheckboxChange(e, 'calibrations_performed')}
                />
                <span className="text-[14px]">{val}</span>
              </Label>
            ))}
          </div>
        </div>
        <div className="mb-1">
          <Label htmlFor="regular_review_of_quality_system" className="font-semibold text-[16px] leading-[19px] text-[#03111F]">
            6. Do you undertake regular review of the Quality System?
          </Label>

          <div className="space-x-16 mt-2">
            {["Yes", "No", "N/A"].map((val) => (
              <Label key={val} className="inline-flex items-center space-x-2">
                <Input
                  type="checkbox"
                  name="regular_review_of_quality_system"
                  className="w-4 h-4"
                  value={val}
                  disabled
                  checked={formData.regular_review_of_quality_system === val}
                  onChange={(e) => handleSingleCheckboxChange(e, 'regular_review_of_quality_system')}
                />
                <span className="text-[14px]">{val}</span>
              </Label>
            ))}
          </div>

          <div className="mt-2">
            <p className="font-semibold">
              If yes, please provide the frequency of review and what is the agenda of the review:
            </p>
            <textarea
              name="review_frequency"
              placeholder="Enter the details"
              className="w-full border border-gray-300 p-2 mt-2"
              rows={4}
              disabled
              value={formData.review_frequency}
              onChange={(e) => handleTextareaChange(e, 'review_frequency')}
            />
          </div>
        </div>
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

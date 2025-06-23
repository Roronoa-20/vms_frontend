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

export const OrganizationalForm: React.FC<QASFormProps> = ({ vendor_onboarding }) => {

  const { designation } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const currentTab = params.get("tabtype")?.toLowerCase();

  const [formData, setFormData] = useState<QMSForm>({
    name: "",
    creation: "",
    owner: "",
    ref_no: "",
    organizational_chart: "",
    procedure_for_training: "",
    maintain_training_records: "",
    effectiveness_of_training: "",
    written_authority: "",
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
        setFormData({
          name: data?.name || "",
          creation: data?.creation || "",
          owner: data?.owner || "",
          ref_no: data?.ref_no || "",
          organizational_chart: data?.organizational_chart || "",
          procedure_for_training: data?.procedure_for_training || "",
          maintain_training_records: data?.maintain_training_records || "",
          effectiveness_of_training: data?.effectiveness_of_training || "",
          written_authority: data?.written_authority || "",
        });
      } catch (error) {
        console.error("Error fetching QMS form data:", error);
      }
    };

    fetchFormData();
  }, [vendor_onboarding]);

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof formData
  ) => {
    const { value, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [field]: checked ? value : "",
    }));
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
        SECTION – III: ORGANIZATIONAL STRUCTURE & TRAINING
      </h2>
      <div className="border border-gray-300 p-3 mb-6 rounded-md">
        <div className="mb-3 border-b border-gray-300 pb-4">
          <Label htmlFor="organizational_chart" className="font-semibold text-[16px] leading-[19px] text-[#03111F]">
            1. Do you have an organizational chart?
          </Label>
          <div className="flex gap-10 mt-2">
            {["Yes", "No", "N/A"].map((val) => (
              <Label key={val} className="inline-flex items-center space-x-2">
                <Input
                  type="checkbox"
                  name="organizational_chart"
                  className="w-4 h-4"
                  value={val}
                  checked={formData.organizational_chart === val}
                  onChange={(e) => handleCheckboxChange(e, 'organizational_chart')}
                />
                <span className="text-[14px]">{val}</span>
              </Label>
            ))}
          </div>
        </div>
        <div className="mb-3 border-b border-gray-300 pb-4">
          <Label htmlFor="procedure_for_training" className="font-semibold text-[16px] leading-[19px] text-[#03111F]">
            2. Do you have prodecure for training?
          </Label>
          <div className="flex gap-10 mt-2">
            {["Yes", "No", "N/A"].map((val) => (
              <Label key={val} className="inline-flex items-center space-x-2">
                <Input
                  type="checkbox"
                  name="procedure_for_training"
                  className="w-4 h-4"
                  value={val}
                  checked={formData.procedure_for_training === val}
                  onChange={(e) => handleCheckboxChange(e, 'procedure_for_training')}
                />
                <span className="text-[14px]">{val}</span>
              </Label>
            ))}
          </div>
        </div>
        <div className="mb-3 border-b border-gray-300 pb-4">
          <Label htmlFor="maintain_training_records" className="font-semibold text-[16px] leading-[19px] text-[#03111F]">
            3. Do you maintain training records?
          </Label>
          <div className="flex gap-10 mt-2">
            {["Yes", "No", "N/A"].map((val) => (
              <Label key={val} className="inline-flex items-center space-x-2">
                <Input
                  type="checkbox"
                  name="maintain_training_records"
                  className="w-4 h-4"
                  value={val}
                  checked={formData.maintain_training_records === val}
                  onChange={(e) => handleCheckboxChange(e, 'maintain_training_records')}
                />
                <span className="text-[14px]">{val}</span>
              </Label>
            ))}
          </div>
        </div>
        <div className="mb-3 border-b border-gray-300 pb-4">
          <Label htmlFor="effectiveness_of_training" className="font-semibold text-[16px] leading-[19px] text-[#03111F]">
            4. Do you check the effectiveness of training?
          </Label>
          <div className="flex gap-10 mt-2">
            {["Yes", "No", "N/A"].map((val) => (
              <Label key={val} className="inline-flex items-center space-x-2">
                <Input
                  type="checkbox"
                  name="effectiveness_of_training"
                  className="w-4 h-4"
                  value={val}
                  checked={formData.effectiveness_of_training === val}
                  onChange={(e) => handleCheckboxChange(e, 'effectiveness_of_training')}
                />
                <span className="text-[14px]">{val}</span>
              </Label>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="written_authority" className="font-semibold text-[16px] leading-[19px] text-[#03111F]">
            5. Do you have written job descriptions / responsibility and authority for all personnel?
          </Label>
          <div className="flex gap-10 mt-2">
            {["Yes", "No", "N/A"].map((val) => (
              <Label key={val} className="inline-flex items-center space-x-2">
                <Input
                  type="checkbox"
                  name="written_authority"
                  className="w-4 h-4"
                  value={val}
                  checked={formData.written_authority === val}
                  onChange={(e) => handleCheckboxChange(e, 'written_authority')}
                />
                <span className="text-[14px]">{val}</span>
              </Label>
            ))}
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
    </div>
  );
};

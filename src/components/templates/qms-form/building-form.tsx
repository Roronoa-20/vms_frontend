'use client'
import React, { FormEvent, useEffect, useState } from "react";
import { Input } from "../../atoms/input";
import { Label } from "../../atoms/label";
import { Button } from "../../atoms/button";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { QMSFormTabs } from "@/src/constants/vendorDetailSidebarTab";
import { QMSForm } from '@/src/types/qmstypes';

interface QASFormProps {
  vendor_onboarding: string;
}

export const BuildingForm: React.FC<QASFormProps> = ({ vendor_onboarding }) => {

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

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>,
      field: keyof QMSForm
    ) => {
      const { value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

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
        SECTION – IV: BUILDING & FACILITY
      </h2>

      <div className="border border-gray-300 p-3 mb-6 rounded-md">
        {/* Question 1 */}
        <div className="mb-3 border-b border-gray-300 pb-4">
          <Label htmlFor="area_of_facility" className="font-semibold text-[16px] leading-[19px] text-[#03111F]">
            1. What is the approximate area of your facility? <span className='text-[12px]'>(Sq. meter / Sq. feet)</span>
          </Label>
          <div className="">
            <textarea name="area_of_facility" placeholder="Enter the Area" className="w-full border border-gray-300 p-2 mt-2" rows={1} value={formData.area_of_facility} onChange={(e) => handleTextareaChange(e, 'area_of_facility')} />
          </div>
        </div>
        {/* Question 2 */}
        <div className="mb-3 border-b border-gray-300 pb-4">
          <Label htmlFor="no_of_employees" className="font-semibold text-[16px] leading-[19px] text-[#03111F]">
            2. Please provide the approximate numbers of employees in your organization?
          </Label>
          <div className="">
            <textarea name="no_of_employees" placeholder="Enter the no. of employees" className="w-full border border-gray-300 p-2 mt-2" rows={1} value={formData.no_of_employees} onChange={(e) => handleTextareaChange(e, 'no_of_employees')} />
          </div>
        </div>
        {/* Question 3 */}
        <div className="mb-3 border-b border-gray-300 pb-4">
          <Label htmlFor="valid_license" className="font-semibold text-[16px] leading-[19px] text-[#03111F]">
            3. Does Organization have valid license / registrations available?<br />
            i.e. Factory license, PCB consents, Other applicable Acts/Rules.
          </Label>
          <div className="">
            <textarea name="valid_license" placeholder="Enter the Valid License or Registration" className="w-full border border-gray-300 p-2 mt-2" rows={1} value={formData.valid_license} onChange={(e) => handleTextareaChange(e, 'valid_license')} />
          </div>
          {/* <div className="mt-4">
            <Label className="font-semibold text-[16px] leading-[19px] text-[#03111F]">
              Upload Valid License/Registration Document:
            </Label>
            <Input
              type="file"
              className="block p-2 mt-1"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx"
              onChange={handleFileUpload}
              ref={fileInputRef}
            />
            {lineItemFiles.license_registrations_attach && (
              <div className="mt-2 flex items-center">
                <p className="mt-2 text-sm text-green-500">
                  File Selected: {lineItemFiles.license_registrations_attach.name}
                </p>
                <Button
                  type="button"
                  className="ml-2 text-red-500 hover:text-red-700 mt-2"
                  onClick={clearUploadedFile}  // Clear file handler
                >
                  &#x2715;
                </Button>
              </div>
            )}
          </div> */}

        </div>
        {/* Question 4 */}
        <div className="mb-3 border-b border-gray-300 pb-4">
          <Label htmlFor="air_handling_unit" className="font-semibold text-[16px] leading-[19px] text-[#03111F]">
            4. Do you have an Air Handling Unit?
          </Label>
          <div className="space-x-16 mt-2">
            <Label className="inline-flex items-center space-x-2">
              <Input type="checkbox" name="air_handling_unit" className="w-4 h-4" value="Yes" checked={formData.air_handling_unit === 'Yes'} onChange={(e) => handleCheckboxChange(e, 'air_handling_unit')} />
              <span className='text-[14px]'>Yes</span>
            </Label>
            <Label className="inline-flex items-center space-x-2">
              <Input type="checkbox" name="air_handling_unit" className="w-4 h-4" value="No" checked={formData.air_handling_unit === 'No'} onChange={(e) => handleCheckboxChange(e, 'air_handling_unit')} />
              <span className='text-[14px]'>No</span>
            </Label>
            <Label className="inline-flex items-center space-x-2">
              <Input type="checkbox" name="air_handling_unit" className="w-4 h-4" value="N/A" checked={formData.air_handling_unit === 'N/A'} onChange={(e) => handleCheckboxChange(e, 'air_handling_unit')} />
              <span className='text-[14px]'>N/A</span>
            </Label>
          </div>
        </div>
        {/* Question 5 */}
        <div className="mb-3 border-b border-gray-300 pb-4">
          <Label htmlFor="humidity" className="font-semibold text-[16px] leading-[19px] text-[#03111F]">
            5. Do you control and monitor temperature and relative humidity?
          </Label>
          <div className="space-x-16 mt-2">
            <Label className="inline-flex items-center space-x-2">
              <Input type="checkbox" name="humidity" className="w-4 h-4" value="Yes" checked={formData.humidity === 'Yes'} onChange={(e) => handleCheckboxChange(e, 'humidity')} />
              <span className='text-[14px]'>Yes</span>
            </Label>
            <Label className="inline-flex items-center space-x-2">
              <Input type="checkbox" name="humidity" className="w-4 h-4" value="No" checked={formData.humidity === 'No'} onChange={(e) => handleCheckboxChange(e, 'humidity')} />
              <span className='text-[14px]'>No</span>
            </Label>
            <Label className="inline-flex items-center space-x-2">
              <Input type="checkbox" name="humidity" className="w-4 h-4" value="N/A" checked={formData.humidity === 'N/A'} onChange={(e) => handleCheckboxChange(e, 'humidity')} />
              <span className='text-[14px]'>N/A</span>
            </Label>
          </div>
        </div>
        {/* Question 6 */}
        <div className="mb-3 border-b border-gray-300 pb-4">
          <Label htmlFor="pest_control" className="font-semibold text-[16px] leading-[19px] text-[#03111F]">
            6. Do you have procedure for pest control?
          </Label>
          <div className="space-x-16 mt-2">
            <Label className="inline-flex items-center space-x-2">
              <Input type="checkbox" name="pest_control" className="w-4 h-4" value="Yes" checked={formData.pest_control === 'Yes'} onChange={(e) => handleCheckboxChange(e, 'pest_control')} />
              <span className='text-[14px]'>Yes</span>
            </Label>
            <Label className="inline-flex items-center space-x-2">
              <Input type="checkbox" name="pest_control" className="w-4 h-4" value="No" checked={formData.pest_control === 'No'} onChange={(e) => handleCheckboxChange(e, 'pest_control')} />
              <span className='text-[14px]'>No</span>
            </Label>
            <Label className="inline-flex items-center space-x-2">
              <Input type="checkbox" name="pest_control" className="w-4 h-4" value="N/A" checked={formData.pest_control === 'N/A'} onChange={(e) => handleCheckboxChange(e, 'pest_control')} />
              <span className='text-[14px]'>N/A</span>
            </Label>
          </div>
        </div>
        {/* Question 7 */}
        <div className="mb-3 border-b border-gray-300 pb-4">
          <Label htmlFor="adequate_sizes" className="font-semibold text-[16px] leading-[19px] text-[#03111F]">
            7. Are your working-areas of adequate sizes for the intended functions, well illuminated, air-conditioned and designed to avoid (cross) contamination?
          </Label>
          <div className="space-x-16 mt-2">
            <Label className="inline-flex items-center space-x-2">
              <Input type="checkbox" name="adequate_sizes" className="w-4 h-4" value="Yes" checked={formData.adequate_sizes === 'Yes'} onChange={(e) => handleCheckboxChange(e, 'adequate_sizes')} />
              <span className='text-[14px]'>Yes</span>
            </Label>
            <Label className="inline-flex items-center space-x-2">
              <Input type="checkbox" name="adequate_sizes" className="w-4 h-4" value="No" checked={formData.adequate_sizes === 'No'} onChange={(e) => handleCheckboxChange(e, 'adequate_sizes')} />
              <span className='text-[14px]'>No</span>
            </Label>
            <Label className="inline-flex items-center space-x-2">
              <Input type="checkbox" name="adequate_sizes" className="w-4 h-4" value="N/A" checked={formData.adequate_sizes === 'N/A'} onChange={(e) => handleCheckboxChange(e, 'adequate_sizes')} />
              <span className='text-[14px]'>N/A</span>
            </Label>
          </div>
        </div>
        {/* Question 8 */}
        <div className="mb-3 border-b border-gray-300 pb-4">
          <Label htmlFor="clean_rooms" className="font-semibold text-[16px] leading-[19px] text-[#03111F]">
            8. Do you have clean rooms?
          </Label>
          <div className="space-x-16 mt-2">
            <Label className="inline-flex items-center space-x-2">
              <Input type="checkbox" name="clean_rooms" className="w-4 h-4" value="Yes" checked={formData.clean_rooms === 'Yes'} onChange={(e) => handleCheckboxChange(e, 'clean_rooms')} />
              <span className='text-[14px]'>Yes</span>
            </Label>
            <Label className="inline-flex items-center space-x-2">
              <Input type="checkbox" name="clean_rooms" className="w-4 h-4" value="No" checked={formData.clean_rooms === 'No'} onChange={(e) => handleCheckboxChange(e, 'clean_rooms')} />
              <span className='text-[14px]'>No</span>
            </Label>
            <Label className="inline-flex items-center space-x-2">
              <Input type="checkbox" name="clean_rooms" className="w-4 h-4" value="N/A" checked={formData.clean_rooms === 'N/A'} onChange={(e) => handleCheckboxChange(e, 'clean_rooms')} />
              <span className='text-[14px]'>N/A</span>
            </Label>
          </div>
        </div>
        {/* Question 9 */}
        <div className="mb-3 border-b border-gray-300 pb-4">
          <Label htmlFor="water_disposal" className="font-semibold text-[16px] leading-[19px] text-[#03111F]">
            9. Do you have procedure for waste disposal?
          </Label>
          <div className="space-x-16 mt-2">
            <Label className="inline-flex items-center space-x-2">
              <Input type="checkbox" name="water_disposal" className="w-4 h-4" value="Yes" checked={formData.water_disposal === 'Yes'} onChange={(e) => handleCheckboxChange(e, 'water_disposal')} />
              <span className='text-[14px]'>Yes</span>
            </Label>
            <Label className="inline-flex items-center space-x-2">
              <Input type="checkbox" name="water_disposal" className="w-4 h-4" value="No" checked={formData.water_disposal === 'No'} onChange={(e) => handleCheckboxChange(e, 'water_disposal')} />
              <span className='text-[14px]'>No</span>
            </Label>
            <Label className="inline-flex items-center space-x-2">
              <Input type="checkbox" name="water_disposal" className="w-4 h-4" value="N/A" checked={formData.water_disposal === 'N/A'} onChange={(e) => handleCheckboxChange(e, 'water_disposal')} />
              <span className='text-[14px]'>N/A</span>
            </Label>
          </div>
        </div>
        {/* Question 10 */}
        <div className="">
          <Label htmlFor="safety_committee" className="font-semibold text-[16px] leading-[19px] text-[#03111F]">
            10. Does the factory have safety committee?
          </Label>
          <div className="space-x-16 mt-2">
            <Label className="inline-flex items-center space-x-2">
              <Input type="checkbox" name="safety_committee" className="w-4 h-4" value="Yes" checked={formData.safety_committee === 'Yes'} onChange={(e) => handleCheckboxChange(e, 'safety_committee')} />
              <span className='text-[14px]'>Yes</span>
            </Label>
            <Label className="inline-flex items-center space-x-2">
              <Input type="checkbox" name="safety_committee" className="w-4 h-4" value="No" checked={formData.safety_committee === 'No'} onChange={(e) => handleCheckboxChange(e, 'safety_committee')} />
              <span className='text-[14px]'>No</span>
            </Label>
            <Label className="inline-flex items-center space-x-2">
              <Input type="checkbox" name="safety_committee" className="w-4 h-4" value="N/A" checked={formData.safety_committee === 'N/A'} onChange={(e) => handleCheckboxChange(e, 'safety_committee')} />
              <span className='text-[14px]'>N/A</span>
            </Label>
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

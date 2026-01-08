"use client";
import React, { useState } from "react";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../atoms/select";
import { Input } from "../../atoms/input";
import { SelectContent } from "../../atoms/select";
import { Button } from "../../atoms/button";
import { useManufacturingDetailStore } from "@/src/store/ManufacturingDetail";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import { VendorOnboardingResponse } from "@/src/types/types";
import Link from "next/link";
import { X } from "lucide-react";

type Props = {
  ref_no: string;
  onboarding_ref_no: string;
  OnboardingDetail: VendorOnboardingResponse["message"]["manufacturing_details_tab"];
  isAccountsTeam?: number,
  VendorType?: string[],
  onNextTab?: () => void;
  onBackTab?: () => void;
};

const ManufacturingDetail = ({ ref_no, onboarding_ref_no, OnboardingDetail, isAccountsTeam, VendorType, onNextTab, onBackTab }: Props) => {
  const { ManufacturingDetail, updateManufacturingDetail } = useManufacturingDetailStore();
  const [manufacturedFile, setManufacturedFile] = useState<FileList | null>(null);
  const [brochure_proof, setBrochure_proof] = useState<FileList | null>(null);
  const [organisation_structure_document, setOrganisation_structure_document] = useState<FileList | null>(null);
  const [isManufacturedFilePreview, setIsManufacturedFilePreview] = useState<boolean>(true);
  const [isBrochureFilePreview, setIsBrochureFilePreview] = useState<boolean>(true);
  const [isStructureFilePreview, setIsStructureFilePreview] = useState<boolean>(true);
  const [materialsTable, setMaterialsTable] = useState<any[]>([]);

  const handleSubmit = async () => {
    const manufacturingUrl = API_END_POINTS?.manufacturingDetailSubmit;

    const formData = new FormData();

    materialsTable.forEach((item, index) => {
      if (item.material_images) {
        formData.append(`material_images_${index}`, item.material_images);
      }
    });
    if (brochure_proof) {
      formData.append("brochure_proof", brochure_proof[0]);
    }
    if (organisation_structure_document) {
      formData.append(
        "organisation_structure_document",
        organisation_structure_document[0]
      );
    }
    const manufacturingDetailResponse: AxiosResponse = await requestWrapper({
      url: manufacturingUrl,
      data: formData,
      method: "POST",
    });
    if (manufacturingDetailResponse?.status == 200)
      alert("Saved successfully ✅");
    onNextTab?.();
  };


  return (
    <div className="flex flex-col bg-white rounded-lg px-4 pb-4 max-h-[80vh] overflow-y-scroll w-full">
      <h1 className="border-b-2 pb-2 mb-4 sticky top-0 bg-white py-4 text-lg">
        Manufacturing Detail
      </h1>
      <div className="grid grid-cols-3 gap-6 p-2">
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Total Godown Area (Sq. ft.)
          </h1>
          <Input
            placeholder=""
            value={
              ManufacturingDetail?.total_godown ??
              OnboardingDetail?.total_godown ??
              ""
            }
            onChange={(e) => {
              updateManufacturingDetail("total_godown", e.target.value);
            }}
          />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Storage Capacity, (Sq. ft.)
          </h1>
          <Input
            placeholder=""
            value={
              ManufacturingDetail?.storage_capacity ??
              OnboardingDetail?.storage_capacity ??
              ""
            }
            onChange={(e) => {
              updateManufacturingDetail("storage_capacity", e.target.value);
            }}
          />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Spare Capacity(Sq. ft.)
          </h1>
          <Input
            placeholder=""
            value={
              ManufacturingDetail?.spare_capacity ??
              OnboardingDetail?.spare_capacity ??
              ""
            }
            onChange={(e) => {
              updateManufacturingDetail("spare_capacity", e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Type Of Premises
          </h1>
          <Select
            onValueChange={(value) => {
              updateManufacturingDetail("type_of_premises", value);
            }}
            value={
              ManufacturingDetail?.type_of_premises ??
              OnboardingDetail?.type_of_premises ??
              ""
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Lease">Lease</SelectItem>
                <SelectItem value="Rented">Rented</SelectItem>
                <SelectItem value="Owned">Owned</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Working Hours
          </h1>
          <Input
            placeholder=""
            value={
              ManufacturingDetail?.working_hours ??
              OnboardingDetail?.working_hours ??
              ""
            }
            onChange={(e) => {
              updateManufacturingDetail("working_hours", e.target.value);
            }}
          />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Weekly Holidays
          </h1>
          <Input
            placeholder=""
            value={
              ManufacturingDetail?.weekly_holidays ??
              OnboardingDetail?.weekly_holidays ??
              ""
            }
            onChange={(e) => {
              updateManufacturingDetail("weekly_holidays", e.target.value);
            }}
          />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            No. of Manpower/Strength
          </h1>
          <Input
            placeholder=""
            value={
              ManufacturingDetail?.number_of_manpower ??
              OnboardingDetail?.number_of_manpower ??
              ""
            }
            onChange={(e) => {
              updateManufacturingDetail("number_of_manpower", e.target.value);
            }}
          />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Annual Revenue
          </h1>
          <Input
            placeholder=""
            value={
              ManufacturingDetail?.annual_revenue ??
              OnboardingDetail?.annual_revenue ??
              ""
            }
            onChange={(e) => {
              updateManufacturingDetail("annual_revenue", e.target.value);
            }}
          />
        </div>
        <div className="col-span-1 flex justify-start items-end gap-4">
          <h1 className="text-[16px] font-medium text-[#626973] pb-2">
            Cold Storage
          </h1>
          <Input
            type="checkbox"
            placeholder=""
            className="w-4 py-0 items-end"
            onChange={(e) => {
              updateManufacturingDetail("cold_storage", e.target.checked);
            }}
            checked={
              (ManufacturingDetail?.cold_storage ??
                OnboardingDetail?.cold_storage) == 1
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-2">
        <div className="col-span-1">
          <h1 className="text-[16px] font-normal text-[#626973] pb-3">
            Upload your Material Brochure (PDF)
          </h1>
          <div className="flex gap-4">
            <Input
              placeholder=""
              type="file"
              onChange={(e) => {
                setBrochure_proof(e.target.files);
              }}
            />
            {/* file preview */}
            {isBrochureFilePreview &&
              !brochure_proof &&
              OnboardingDetail?.brochure_proof?.url && (
                <div className="flex gap-2">
                  <Link
                    target="blank"
                    href={OnboardingDetail?.brochure_proof?.url}
                    className="underline text-blue-300 max-w-44 truncate"
                  >
                    <span>{OnboardingDetail?.brochure_proof?.file_name}</span>
                  </Link>
                  <X
                    className="cursor-pointer"
                    onClick={() => {
                      setIsBrochureFilePreview((prev) => !prev);
                    }}
                  />
                </div>
              )}
          </div>
        </div>
        <div className="col-span-1">
          <h1 className="text-[16px] font-normal text-[#626973] pb-3">
            Organization Structure Document
          </h1>
          <div className="flex gap-4">
            <Input
              placeholder=""
              type="file"
              onChange={(e) => {
                setOrganisation_structure_document(e.target.files);
              }}
            />
            {/* file preview */}
            {isStructureFilePreview &&
              !organisation_structure_document &&
              OnboardingDetail?.organisation_structure_document?.url && (
                <div className="flex gap-2">
                  <Link
                    target="blank"
                    href={
                      OnboardingDetail?.organisation_structure_document?.url
                    }
                    className="underline text-blue-300 max-w-44 truncate"
                  >
                    <span>
                      {
                        OnboardingDetail?.organisation_structure_document
                          ?.file_name
                      }
                    </span>
                  </Link>
                  <X
                    className="cursor-pointer"
                    onClick={() => {
                      setIsStructureFilePreview((prev) => !prev);
                    }}
                  />
                </div>
              )}
          </div>
        </div>
      </div>
      <div className="flex justify-end items-center space-x-3 mt-3">
        <Button onClick={onBackTab} variant="backbtn" size="backbtnsize">
          Back
        </Button>

        <Button onClick={handleSubmit} variant="nextbtn" size="nextbtnsize">
          Next
        </Button>
      </div>
    </div>
  );
};

export default ManufacturingDetail;

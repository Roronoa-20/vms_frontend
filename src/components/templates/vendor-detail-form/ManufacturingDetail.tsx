"use client";
import React, { useState } from "react";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../atoms/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../atoms/table";
import { Input } from "../../atoms/input";
import { SelectContent } from "../../atoms/select";
import { Button } from "../../atoms/button";
import { useManufacturingDetailStore } from "@/src/store/ManufacturingDetail";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import { VendorOnboardingResponse } from "@/src/types/types";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";

type Props = {
  ref_no: string;
  onboarding_ref_no: string;
  OnboardingDetail: VendorOnboardingResponse["message"]["manufacturing_details_tab"];
  isAccountsTeam?:number,
  VendorType?:string[]
};

const ManufacturingDetail = ({
  ref_no,
  onboarding_ref_no,
  OnboardingDetail,
  isAccountsTeam,
  VendorType
}: Props) => {
  const { ManufacturingDetail, updateManufacturingDetail } =
    useManufacturingDetailStore();
  const [manufacturedFile, setManufacturedFile] = useState<FileList | null>(
    null
  );
  const [brochure_proof, setBrochure_proof] = useState<FileList | null>(null);
  const [organisation_structure_document, setOrganisation_structure_document] =
    useState<FileList | null>(null);
  const [isManufacturedFilePreview, setIsManufacturedFilePreview] =
    useState<boolean>(true);
  const [isBrochureFilePreview, setIsBrochureFilePreview] =
    useState<boolean>(true);
  const [isStructureFilePreview, setIsStructureFilePreview] =
    useState<boolean>(true);
  const [materialsTable, setMaterialsTable] = useState<any[]>([]);

  const handleAddMaterial = () => {
    if (
      !ManufacturingDetail.material_description ||
      !ManufacturingDetail.hsnsac_code ||
      !ManufacturingDetail.annual_capacity ||
      !manufacturedFile
    ) {
      alert(
        "Please fill in all fields and upload a product image before adding."
      );
      return;
    }
    const newEntry = {
      material_description: ManufacturingDetail.material_description,
      hsnsac_code: ManufacturingDetail.hsnsac_code,
      annual_capacity: ManufacturingDetail.annual_capacity,
      material_images: manufacturedFile[0],
    };
    setMaterialsTable((prev) => [...prev, newEntry]);
    updateManufacturingDetail("material_description", "");
    updateManufacturingDetail("hsnsac_code", "");
    updateManufacturingDetail("annual_capacity", "");
    setManufacturedFile(null);
  };

  const handleDeleteMaterial = (index: number) => {
    const updated = [...materialsTable];
    updated.splice(index, 1);
    setMaterialsTable(updated);
  };

  const router = useRouter();

  const handleSubmit = async () => {
    const manufacturingUrl = API_END_POINTS?.manufacturingDetailSubmit;
    // const updatedData = { ...ManufacturingDetail, materials_supplied: [{ hsnsac_code: ManufacturingDetail?.hsnsac_code, annual_capacity: ManufacturingDetail?.annual_capacity, material_description: ManufacturingDetail?.material_description }], ref_no: ref_no, vendor_onboarding: onboarding_ref_no }
    // const formData = new FormData();
    // formData.append("data", JSON.stringify(updatedData));
    // if (manufacturedFile) {
    //   formData.append("material_images", manufacturedFile[0]);
    // }
    const updatedData = {
      ...ManufacturingDetail,
      materials_supplied: materialsTable.map((item) => ({
        material_description: item.material_description,
        hsnsac_code: item.hsnsac_code,
        annual_capacity: item.annual_capacity,
      })),
      ref_no: ref_no,
      vendor_onboarding: onboarding_ref_no,
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(updatedData));

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
      if(isAccountsTeam == 1){
        router.push(`/vendor-details-form?Reputed%20Partners&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`)
      }else if(VendorType && !VendorType.includes("Material Vendor")){
        router.push(
          `/vendor-details-form?tabtype=Reputed%20Partners&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`
        );
      }else{
        router.push(
          `/vendor-details-form?tabtype=Employee%20Detail&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`
        );
      }
  };

  const handleBack = () => {
    router.push(
      `/vendor-details-form?tabtype=Contact%20Detail&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`
    );
  };

  return (
    <div className="flex flex-col bg-white rounded-lg px-4 pb-4 max-h-[80vh] overflow-y-scroll w-full">
      <h1 className="border-b-2 pb-1 font-semibold sticky top-0 bg-white py-2 text-lg">
        Manufacturing Detail
      </h1>
      <div className="grid grid-cols-3 gap-4 p-1">
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
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
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
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
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
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
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
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
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
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
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
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
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
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
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
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
      <h1 className="border-b-2 pb-1 sticky top-0 bg-white py-4 text-lg">
        Products Details
      </h1>
      <div className="grid grid-cols-3 gap-4 p-1">
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
            Product Manufactured
          </h1>
          <Input
            placeholder=""
            value={
              ManufacturingDetail?.material_description ??
              OnboardingDetail?.materials_supplied[0]?.material_description ??
              ""
            }
            onChange={(e) => {
              updateManufacturingDetail("material_description", e.target.value);
            }}
          />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
            HSN/SAC Code
          </h1>
          <Input
            placeholder=""
            value={
              ManufacturingDetail?.hsnsac_code ??
              OnboardingDetail?.materials_supplied[0]?.hsnsac_code ??
              ""
            }
            onChange={(e) => {
              updateManufacturingDetail("hsnsac_code", e.target.value);
            }}
          />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
            Annual Capacity
          </h1>
          <Input
            placeholder=""
            value={
              ManufacturingDetail?.annual_capacity ??
              OnboardingDetail?.materials_supplied[0]?.annual_capacity ??
              ""
            }
            onChange={(e) => {
              updateManufacturingDetail("annual_capacity", e.target.value);
            }}
          />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
            Upload manufactured product image
          </h1>
          <div className="flex gap-4">
            <Input
              placeholder=""
              type="file"
              onChange={(e) => {
                setManufacturedFile(e.target.files);
              }}
            />
            {/* file preview */}
            {isManufacturedFilePreview &&
              !manufacturedFile &&
              OnboardingDetail?.materials_supplied?.[0]?.material_images
                ?.url && (
                <div className="flex gap-2">
                  <Link
                    target="blank"
                    href={
                      OnboardingDetail?.materials_supplied?.[0]?.material_images
                        ?.url
                    }
                    className="underline text-blue-300 max-w-44 truncate"
                  >
                    <span>
                      {
                        OnboardingDetail?.materials_supplied?.[0]
                          ?.material_images?.file_name
                      }
                    </span>
                  </Link>
                  <X
                    className="cursor-pointer"
                    onClick={() => {
                      setIsManufacturedFilePreview((prev) => !prev);
                    }}
                  />
                </div>
              )}
          </div>
        </div>
        <div className="col-span-1 flex items-end">
          <Button
            onClick={handleAddMaterial}
            className="py-2"
            variant="nextbtn"
            size="nextbtnsize"
          >
            Add
          </Button>
        </div>
      </div>
      {materialsTable?.length > 0 && (
        <div className="shadow- bg-[#f6f6f7] p-4 mb-4 mt-4 rounded-2xl">
          <div className="flex w-full justify-between pb-4">
            <h1 className="text-[20px] text-[#03111F] font-semibold">
              Multiple Product List Detail
            </h1>
          </div>
          <div className="col-span-3 mt-4">
            <Table className="max-h-40 overflow-y-scroll">
              <TableHeader className="text-center">
                <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
                  <TableHead>Sr.No.</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>HSN/SAC Code</TableHead>
                  <TableHead>Annual Capacity</TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materialsTable.map((material, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{material.material_description}</TableCell>
                    <TableCell>{material.hsnsac_code}</TableCell>
                    <TableCell>{material.annual_capacity}</TableCell>
                    <TableCell>
                      {material?.material_images?.name ?? "-"}
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => handleDeleteMaterial(index)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 p-2">
        <div className="col-span-1">
          <h1 className="text-[16px] font-normal text-[#626973] pb-2">
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
          <h1 className="text-[16px] font-normal text-[#626973] pb-2">
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
        <Button onClick={handleBack} variant="backbtn" size="backbtnsize">
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

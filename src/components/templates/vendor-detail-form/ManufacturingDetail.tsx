'use client'
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

type Props = {
  ref_no:string,
  onboarding_ref_no:string
}


const ManufacturingDetail = ({ref_no,onboarding_ref_no}:Props) => {
  const {ManufacturingDetail,updateManufacturingDetail} = useManufacturingDetailStore()

  const [manufacturedFile,setManufacturedFile] = useState<FileList | null>(null)
  const [brochure_proof,setBrochure_proof] = useState<FileList | null>(null)
  const [organisation_structure_document,setOrganisation_structure_document] = useState<FileList | null>(null)
  console.log(manufacturedFile,"this file")
  const handleSubmit = async()=>{
    const manufacturingUrl = API_END_POINTS?.manufacturingDetailSubmit;
    const updatedData = {...ManufacturingDetail,ref_no:ref_no,vendor_onboarding:onboarding_ref_no}
    const formData = new FormData();
    formData.append("data",JSON.stringify(updatedData));
    if(manufacturedFile){
      formData.append("material_images",manufacturedFile[0]);
    }
    if(brochure_proof){
      formData.append("brochure_proof",brochure_proof[0]);
    }
    if(organisation_structure_document){
      formData.append("organisation_structure_document",organisation_structure_document[0]);
    }
    const manufacturingDetailResponse:AxiosResponse = await requestWrapper({url:manufacturingUrl,data:formData,method:"POST"});
    if(manufacturingDetailResponse?.status == 200){
      console.log("successfully submitted")
    }
  }
  return (
    <div className="flex flex-col bg-white rounded-lg px-4 pb-4 max-h-[80vh] overflow-y-scroll w-full">
      <h1 className="border-b-2 pb-2 mb-4 sticky top-0 bg-white py-4 text-lg">
        Manufacturing Detail
      </h1>
      <div className="grid grid-cols-3 gap-6 p-5">
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Total Godown Area (Sq. ft.)
          </h1>
          <Input placeholder="" onChange={(e)=>{updateManufacturingDetail("total_godown",e.target.value)}} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Storage Capacity, (Sq. ft.)
          </h1>
          <Input placeholder="" onChange={(e)=>{updateManufacturingDetail("storage_capacity",e.target.value)}} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Spare Capacity(Sq. ft.)
          </h1>
          <Input placeholder="" onChange={(e)=>{updateManufacturingDetail("spare_capacity",e.target.value)}}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Type of Premises
          </h1>
          <Input placeholder="" onChange={(e)=>{updateManufacturingDetail("spare_capacity",e.target.value)}} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Working Hours
          </h1>
          <Input placeholder="" onChange={(e)=>{updateManufacturingDetail("working_hours",e.target.value)}}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Weekly Holidays
          </h1>
          <Input placeholder="" onChange={(e)=>{updateManufacturingDetail("weekly_holiday",e.target.value)}}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            No. of Manpower/Strength
          </h1>
          <Input placeholder="" onChange={(e)=>{updateManufacturingDetail("number_of_manpower",e.target.value)}}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Annual Revenue
          </h1>
          <Input placeholder="" onChange={(e)=>{updateManufacturingDetail("annual_revenue",e.target.value)}}/>
        </div>
        <div className="col-span-1 flex justify-start items-end gap-4">
          <h1 className="text-[16px] font-medium text-[#626973] pb-2">
            Cold Storage
          </h1>
          <Input
            type="checkbox"
            placeholder=""
            className="w-4 py-0 items-end"
            onChange={(e)=>{updateManufacturingDetail("cold_storage",e.target.checked)}}
          />
        </div>
      </div>
      <h1 className="border-b-2 pb-2 mb-4 sticky top-0 bg-white py-4 text-lg">
        Products Details
      </h1>
      <div className="grid grid-cols-3 gap-6 p-5">
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Product Manufactured
          </h1>
          <Input placeholder="" onChange={(e)=>{updateManufacturingDetail("details_of_product_manufactured",e.target.value)}}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            HSN/SAC Code
          </h1>
          <Input placeholder="" onChange={(e)=>{updateManufacturingDetail("hsnsac_code",e.target.value)}}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Annual Capacity
          </h1>
          <Input placeholder="" onChange={(e)=>{updateManufacturingDetail("annual_capacity",e.target.value)}}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Upload manufactured product image
          </h1>
          <Input placeholder="" type="file" onChange={(e)=>{setManufacturedFile(e.target.files)}}/>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 pl-5 pb-6">
        <div className="col-span-1">
          <h1 className="text-[16px] font-normal text-[#626973] pb-3">
            Upload your Material Brochure (PDF)
          </h1>
          <Input placeholder="" type="file" onChange={(e)=>{setBrochure_proof(e.target.files)}}/>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 pl-5">
        <div className="col-span-1">
          <h1 className="text-[16px] font-normal text-[#626973] pb-3">
            Organization Structure Document
          </h1>
          <Input placeholder="" type="file" onChange={(e)=>{setOrganisation_structure_document(e.target.files)}} />
        </div>
      </div>
      <div className="flex justify-end pr-4"><Button className="bg-blue-400 hover:bg-blue-400" onClick={()=>{handleSubmit()}}>Next</Button></div>
    </div>
  );
};

export default ManufacturingDetail;

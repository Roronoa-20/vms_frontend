'use client'
import React, { useEffect, useState } from "react";
import { Input } from "../../atoms/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../atoms/select";
import { TcompanyDetailDropdown, TCompanyDetailForm, TvendorOnboardingDetail } from "@/src/types/types";
import { useCompanyDetailFormStore } from "@/src/store/companyDetailStore";
import { Button } from "../../atoms/button";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import { useRouter } from "next/navigation";

interface Props {
  vendor_master:TvendorOnboardingDetail["message"]["data"]["vendor_master"]
  vendor_onboarding:TvendorOnboardingDetail["message"]["data"]["vendor_onboarding"]
  vendor_company_details:TvendorOnboardingDetail["message"]["data"]["vendor_company_details"]
  companyDetailDropdown:TcompanyDetailDropdown["message"]["data"]
  onboarding_refno?:string
  refno?:string
}

const CompanyDetailForm = ({vendor_master,vendor_onboarding,companyDetailDropdown,onboarding_refno,refno,vendor_company_details}:Props) => {
  const {data,updateField,resetForm} = useCompanyDetailFormStore(); 
  const router = useRouter();

  const handleSubmit = async()=>{
    const companyDetailSubmitUrl = API_END_POINTS?.companyDetailSubmit
    const updatedData:TCompanyDetailForm | {} = {...data,vendor_onboarding:onboarding_refno as string,ref_no:refno as string}
    try {
      const resposne:AxiosResponse = await requestWrapper({url:companyDetailSubmitUrl,method:"POST",data:{data:updatedData}});
      if(resposne?.status == 200) router.push(`/vendor-details-form?tabtype=Company%20Address&vendor_onboarding=${onboarding_refno}&refno=${refno}`);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col bg-white rounded-lg p-4 w-full">
      <h1 className="border-b-2 pb-2">Company Detail</h1>
      <div className="grid grid-cols-3 gap-6 p-5 overflow-y-scroll max-h-[70vh]">
        <div>
          <div className="grid grid-cols-4 gap-1">
            <div className="flex flex-col col-span-1">
              <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                Vendor Title
              </h1>
              <Input className="col-span-2" placeholder="Enter Company Name" defaultValue={vendor_master?.vendor_title} disabled={true} />
            </div>
            <div className="col-span-3">
              <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                Company Name
              </h1>
              <Input className="col-span-2" placeholder="Enter Company Name" defaultValue={vendor_master?.vendor_name} disabled={true} />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Type Of Business (Please select any one)
          </h1>
          <Select onValueChange={(value)=>{updateField('type_of_business',value)}} defaultValue={vendor_company_details[0]?.type_of_business as string}>
            <SelectTrigger>
              <SelectValue placeholder="Select Vendor Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  companyDetailDropdown?.type_of_business?.map((item,index)=>(
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Size of Company
          </h1>
          <Select onValueChange={(value)=>{updateField("size_of_company",value)}} defaultValue={vendor_company_details[0]?.size_of_company as string}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="apple">50-100</SelectItem>
                <SelectItem value="banana">100-200</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Website
          </h1>
          <Input placeholder="" onChange={(e)=>{updateField("website",e.target.value)}} defaultValue={vendor_company_details[0]?.website as string}/>
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Reg No.
          </h1>
          <Input placeholder="Enter Reg No." onChange={(e)=>{updateField("registered_office_number",e.target.value)}} defaultValue={vendor_company_details[0]?.registered_office_number as string}/>
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Mobile Number
          </h1>
          <Input placeholder="Enter Mobile Number" onChange={(e)=>{updateField("telephone_number",e.target.value)}} defaultValue={vendor_company_details[0]?.telephone_number as string}/>
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            WhatsApp Number (If applicable)
          </h1>
          <Input placeholder="" onChange={(e)=>{updateField("whatsapp_number",e.target.value)}} defaultValue={vendor_company_details[0]?.whatsapp_number as string}/>
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Established Year
          </h1>
          <Input placeholder="" onChange={(e)=>{updateField("established_year",e.target.value)}} defaultValue={vendor_company_details[0]?.established_year as string}/>
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Office Email Primary
          </h1>
          <Input placeholder="" onChange={(e)=>{updateField("office_email_primary",e.target.value)}} defaultValue={vendor_company_details[0]?.office_email_primary as string}/>
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Office Email (Secondary)
          </h1>
          <Input placeholder="" onChange={(e)=>{updateField("office_email_secondary",e.target.value)}} defaultValue={vendor_company_details[0]?.office_email_secondary as string}/>
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Corporate Identification No.(CIN No.)
          </h1>
          <Input placeholder="" onChange={(e)=>{updateField("corporate_identification_number",e.target.value)}} defaultValue={vendor_company_details[0]?.corporate_identification_number as string}/>
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Date
          </h1>
          <Input type="date" placeholder="Enter Mobile Number" onChange={(e)=>{updateField("cin_date",e.target.value)}} defaultValue={vendor_company_details[0]?.cin_date as string}/>
        </div>
        <div className="flex flex-col">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Nature of Company(Please select anyone)
          </h1>
          <Select onValueChange={(value)=>{updateField('nature_of_company',value)}} defaultValue={vendor_company_details[0]?.nature_of_company as string}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  companyDetailDropdown?.company_nature_master?.map((item,index)=>(
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Nature of Business (Please Select anyone)
          </h1>
          <Select onValueChange={(value)=>{updateField('nature_of_business',value)}} defaultValue={vendor_company_details[0]?.nature_of_business as string}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  companyDetailDropdown?.business_nature_master?.map((item,index)=>(
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Vendor Type
          </h1>
          <Input placeholder="" defaultValue={vendor_onboarding?.vendor_types?.map((item)=>(item?.vendor_type))} disabled={true} />
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Meril Associated Companies
          </h1>
          <Input placeholder="" defaultValue={vendor_onboarding?.company_name} disabled={true}/>
        </div>
      </div>
      <div className="flex justify-end pr-6">
      <Button className="bg-blue-400 hover:bg-blue-400" onClick={()=>handleSubmit()}>Next</Button>
      </div>
    </div>
  );
};

export default CompanyDetailForm;

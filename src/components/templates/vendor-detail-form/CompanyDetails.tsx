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
import { TcompanyDetailDropdown, TCompanyDetailForm, TvendorOnboardingDetail, VendorOnboardingResponse } from "@/src/types/types";
import { useCompanyDetailFormStore } from "@/src/store/companyDetailStore";
import { Button } from "../../atoms/button";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import { useRouter } from "next/navigation";

interface Props {
  companyDetailDropdown:TcompanyDetailDropdown["message"]["data"]
  onboarding_refno?:string
  refno?:string,
  OnboardingDetail:VendorOnboardingResponse["message"]["company_details_tab"]
}

const CompanyDetailForm = ({companyDetailDropdown,onboarding_refno,refno,OnboardingDetail}:Props) => {
console.log(OnboardingDetail,"this is detail")
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
              <Input className="col-span-2" placeholder="Enter Company Name" defaultValue={OnboardingDetail?.vendor_title ?? ""} disabled={true} />
            </div>
            <div className="col-span-3">
              <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                Company Name
              </h1>
              <Input className="col-span-2" placeholder="Enter Company Name" defaultValue={OnboardingDetail?.vendor_name ?? ""} disabled={true} />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Type Of Business (Please select any one)
          </h1>
          <Select onValueChange={(value)=>{updateField('type_of_business',value)}} value={data?.type_of_business ?? OnboardingDetail?.type_of_business}>
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
          <Select onValueChange={(value)=>{updateField("size_of_company",value)}} value={data?.size_of_company ?? OnboardingDetail?.size_of_company}>
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
          <Input placeholder="" onChange={(e)=>{updateField("website",e.target.value)}} value={data?.website ?? OnboardingDetail?.website}/>
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Reg No.
          </h1>
          <Input placeholder="Enter Reg No." onChange={(e)=>{updateField("registered_office_number",e.target.value)}} value={data?.registered_office_number ?? OnboardingDetail?.registered_office_number}/>
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Mobile Number
          </h1>
          <Input placeholder="Enter Mobile Number" onChange={(e)=>{updateField("telephone_number",e.target.value)}} value={data?.telephone_number ?? OnboardingDetail?.telephone_number}/>
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            WhatsApp Number (If applicable)
          </h1>
          <Input placeholder="" onChange={(e)=>{updateField("whatsapp_number",e.target.value)}} value={data?.whatsapp_number ?? OnboardingDetail?.whatsapp_number}/>
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Established Year
          </h1>
          <Input placeholder="" onChange={(e)=>{updateField("established_year",e.target.value)}} value={data?.established_year ?? OnboardingDetail?.established_year}/>
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Office Email Primary
          </h1>
          <Input placeholder="" onChange={(e)=>{updateField("office_email_primary",e.target.value)}} value={data?.office_email_primary ?? OnboardingDetail?.office_email_primary}/>
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Office Email (Secondary)
          </h1>
          <Input placeholder="" onChange={(e)=>{updateField("office_email_secondary",e.target.value)}} value={data?.office_email_secondary ?? OnboardingDetail?.office_email_secondary}/>
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Corporate Identification No.(CIN No.)
          </h1>
          <Input placeholder="" onChange={(e)=>{updateField("corporate_identification_number",e.target.value)}} value={data?.corporate_identification_number ?? OnboardingDetail?.corporate_identification_number}/>
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Date
          </h1>
          <Input type="date" placeholder="Enter Mobile Number" onChange={(e)=>{updateField("cin_date",e.target.value)}} value={data?.cin_date ?? OnboardingDetail?.cin_date}/>
        </div>
        <div className="flex flex-col">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Nature of Company(Please select anyone)
          </h1>
          <Select onValueChange={(value)=>{updateField('nature_of_company',value)}} value={data?.nature_of_company ?? OnboardingDetail?.nature_of_company}>
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
          <Select onValueChange={(value)=>{updateField('nature_of_business',value)}} value={data?.nature_of_business ?? OnboardingDetail?.nature_of_business}>
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
          <Input placeholder="" defaultValue={OnboardingDetail?.vendor_types?.map((item)=>(item))} disabled={true} />
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Meril Associated Companies
          </h1>
          <Input placeholder="" defaultValue={OnboardingDetail?.company_name ?? ""} disabled={true}/>
        </div>
      </div>
      <div className="flex justify-end pr-6">
      <Button className="bg-blue-400 hover:bg-blue-400" onClick={()=>handleSubmit()}>Next</Button>
      </div>
    </div>
  );
};

export default CompanyDetailForm;

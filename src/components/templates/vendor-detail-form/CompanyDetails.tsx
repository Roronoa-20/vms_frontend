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
import { TcompanyDetailDropdown, TvendorOnboardingDetail } from "@/src/types/types";

interface Props {
  vendor_master:TvendorOnboardingDetail["message"]["data"]["vendor_master"]
  vendor_onboarding:TvendorOnboardingDetail["message"]["data"]["vendor_onboarding"]
  companyDetailDropdown:TcompanyDetailDropdown["message"]["data"]
}

const CompanyDetailForm = ({vendor_master,vendor_onboarding,companyDetailDropdown}:Props) => {
  return (
    <div className="flex flex-col bg-white rounded-lg p-4 w-full">
      <h1 className="border-b-2 pb-2">Company Detail</h1>
      <div className="grid grid-cols-3 gap-6 p-5 overflow-y-scroll max-h-[75vh]">
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
          <Select>
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
          <Select>
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
          <Input placeholder="" />
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Reg No.
          </h1>
          <Input placeholder="Enter Reg No." />
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Mobile Number
          </h1>
          <Input placeholder="Enter Mobile Number" />
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            WhatsApp Number (If applicable)
          </h1>
          <Input placeholder="" />
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Established Year
          </h1>
          <Input placeholder="" />
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Office Email Primary
          </h1>
          <Input placeholder="" />
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Office Email (Secondary)
          </h1>
          <Input placeholder="" />
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Corporate Identification No.(CIN No.)
          </h1>
          <Input placeholder="" />
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Mobile Number
          </h1>
          <Input type="date" placeholder="Enter Mobile Number" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Nature of Company(Please select anyone)
          </h1>
          <Select>
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
          <Select>
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
    </div>
  );
};

export default CompanyDetailForm;

'use client'
import { Input } from "@/components/ui/input";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../atoms/select";
import MultiSelect from 'react-select'
import { TvendorRegistrationDropdown, VendorRegistrationData } from "@/src/types/types";
import { useEffect } from "react";
import { useState } from "react";
import { useVendorStore } from '../../../store/VendorRegistrationStore';

interface Props {
  vendorTypeDropdown:TvendorRegistrationDropdown["message"]["data"]["vendor_type"]
  vendorTitleDropdown:TvendorRegistrationDropdown["message"]["data"]["vendor_title"]
  countryDropdown:TvendorRegistrationDropdown["message"]["data"]["country_master"]
  formData:Partial<VendorRegistrationData>
  handlefieldChange:(e:React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>)=>void
      handleSelectChange:(value:any,name:string)=>void
      setMultiVendor:(data:any)=>void;

}

import { MultiValue } from 'react-select';
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";

type OptionType = {
  value: string;
  label: string;
};

const VendorRegistration1 = ({vendorTypeDropdown,vendorTitleDropdown,countryDropdown,formData,handlefieldChange,handleSelectChange,setMultiVendor}:Props) => {
  // const { data, updateField,updateVendorTypes, resetForm } = useVendorStore();
  const [isQa,setIsQa] = useState<boolean>(false);
  const [newVendorTypeDropdown,setNewVendorTypeDropdown] = useState<MultiValue<OptionType>>([]);
  const [countryMobileCode,setCountryMobileCode] = useState<string>("");
  useEffect(()=>{
    const newVendorType = vendorTypeDropdown?.map((item,index)=>{
      return (
        {label:item?.name,value:item?.name}
      )
    })
    setNewVendorTypeDropdown(()=>([...newVendorType]))
  },[])

  const handleVendorTypeChange = async(value:MultiValue<OptionType>)=>{
    const newArray = await Promise.all(
      value?.map((item)=>{
        return (
          item?.value
        )
      })
      )
    const newArray2 = await Promise.all(
      value?.map((item)=>{
        return ({
          vendor_type:
          item?.value
        }
        )
      })
    )
    // updateVendorTypes(newArray2)
    handleSelectChange(newArray2,"vendor_types");
    setMultiVendor(newArray)
    if(newArray?.includes("Material Vendor")){
      setIsQa(true);
    }else{
      setIsQa(false);
    }
  }

  const fetchCountryCode = async(value:string)=>{
    const url = API_END_POINTS?.mobileCodeBasedOnCountry;
    const countryCodeApi:AxiosResponse = await requestWrapper({url:url,data:{data:{country:value}},method:"POST"});
    if(countryCodeApi?.status == 200){
      setCountryMobileCode(countryCodeApi?.data?.message);
    }
  }

  return (
    <div>
      <h1 className="text-[20px] font-medium pb-1 leading-[24px] text-[#03111F] border-b border-slate-500">
        Vendor Details
      </h1>
      <div className="grid grid-cols-3 gap-6 p-5">
        <div className="flex flex-col">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Vendor Type
          </h1>
          <MultiSelect onChange={(value)=>{handleVendorTypeChange(value)}} instanceId="multiselect" options={newVendorTypeDropdown} isMulti required={true}/>
        </div>
        {
              isQa &&
              <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
          QA Required
          </h1>
          <Select onValueChange={(value)=>{handleSelectChange(value,'qms_required')}} value={formData?.qms_required ?? ""}>
            <SelectTrigger>
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
              <SelectItem value={"Yes"}>Yes</SelectItem>
              <SelectItem value={"No"}>No</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
            }
        <div>
          <div className="grid grid-cols-4 gap-1">
            <div className="flex flex-col col-span-1">
              <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                Vendor Title
              </h1>
              <Select onValueChange={(value)=>{handleSelectChange(value,'vendor_title')}} value={formData?.vendor_title ?? ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {
                      vendorTitleDropdown ?
                      vendorTitleDropdown?.map((item)=>(
                        <SelectItem value={item?.name} key={item?.name}>{item?.name}</SelectItem>
                      )):
                      <div className="text-center">No Value</div>
                    }
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-3">
              <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                Vendor Name
              </h1>
              <Input className="col-span-2" required placeholder="Enter Vendor Name" name="vendor_name" value={formData?.vendor_name ?? ""}  onChange={(e) => handlefieldChange(e)}/>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">Email</h1>
          <Input required onChange={(e)=>{handlefieldChange(e)}} value={formData?.office_email_primary ?? ""} name="office_email_primary" placeholder="Enter Email Address" />
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Country
          </h1>
          <Select required value={formData?.country ?? ""} onValueChange={(value)=>{handleSelectChange(value,'country'),fetchCountryCode(value)}}>
            <SelectTrigger>
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  countryDropdown ? 
                  countryDropdown?.map((item)=>(
                    <SelectItem value={item?.name} key={item?.name}>{item?.name}</SelectItem>
                  )):
                  <div className="text-center">No Value</div>
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <div className="grid grid-cols-4 gap-3">
            <div className="flex flex-col col-span-1">
              <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                Mobile No.
              </h1>
              <Input placeholder="+91" value={countryMobileCode ?? ""} disabled/>
            </div>
            <div className="col-span-3 flex flex-col justify-end">
              {/* <h1 className="text-[12px] font-normal text-[#626973] pb-3">Mobile No.</h1> */}
              <Input placeholder="Enter Mobile Number" name="mobile_number" required value={formData?.mobile_number ?? ""}  onChange={(e) => handlefieldChange(e)}/>
            </div>
          </div>
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Search Terms
          </h1>
          <Input placeholder="Enter Search Terms" name="search_term" value={formData?.search_term ?? ""}  required onChange={(e) => handlefieldChange(e)}/>
        </div>
      </div>
    </div>
  );
};

export default VendorRegistration1;

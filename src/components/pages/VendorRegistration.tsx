"use client"
import React, { useState } from "react";
import VendorRegistration1 from "../templates/vendorRegistration/VendorRegistrationForm1";
import VendorRegistration2 from "../templates/vendorRegistration/VendorRegistrationForm2";
import { TvendorRegistrationDropdown, VendorRegistrationData } from "@/src/types/types";
import { handleSubmit } from "../templates/vendorRegistration/utility";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import { useVendorStore } from "@/src/store/VendorRegistrationStore";
import { useRouter } from "next/navigation";

interface Props {
  vendorTitleDropdown:TvendorRegistrationDropdown["message"]["data"]["vendor_title"]
  vendorTypeDropdown:TvendorRegistrationDropdown["message"]["data"]["vendor_type"]
  countryDropdown:TvendorRegistrationDropdown["message"]["data"]["country_master"]
  companyDropdown:TvendorRegistrationDropdown["message"]["data"]["company_master"]
  incoTermsDropdown:TvendorRegistrationDropdown["message"]["data"]["incoterm_master"]
  currencyDropdown:TvendorRegistrationDropdown["message"]["data"]["currency_master"]
}

const VendorRegistration = ({...Props}:Props) => {

const [formData,setFormData] = useState<Partial<VendorRegistrationData>>({})
  const handlefieldChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value } as VendorRegistrationData));
  };
  const handleSelectChange = (value: any, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value } as VendorRegistrationData));
  };


  const vendorTitleDropdown = Props?.vendorTitleDropdown;
  const vendorTypeDropdown = Props?.vendorTypeDropdown;
  const countryDropdown = Props?.countryDropdown;
  const companyDropdown = Props?.companyDropdown;
  const incoTermsDropdown = Props?.incoTermsDropdown;
  const currencyDropdown = Props?.currencyDropdown;
  // const {data,resetForm} = useVendorStore()
  const router = useRouter();
   const handleSubmit = async(e:React.FormEvent)=>{
    e.preventDefault()
    const url = API_END_POINTS?.vendorRegistrationSubmit
    const response:AxiosResponse = await requestWrapper({
      url:url,
      method:"POST",
      data:{data:formData}
    });
  
    if(response?.status == 500){
      console.log("error in submitting this form");
      return;
    }
  
    if(response?.status == 200){
      // resetForm();
      console.log("handle submit successfully");
      alert("Submit Successfully");
      router.push("/dashboard");
      return;
    }
  }



  return (
    <div className="p-6">
      <form onSubmit={(e)=>{handleSubmit(e)}}>
      <VendorRegistration1
        vendorTitleDropdown={vendorTitleDropdown}
        vendorTypeDropdown={vendorTypeDropdown}
        countryDropdown={countryDropdown}
        formData={formData}
        handlefieldChange={handlefieldChange}
        handleSelectChange={handleSelectChange}
        />
      <VendorRegistration2 
        companyDropdown = {companyDropdown}
        incoTermsDropdown = {incoTermsDropdown}
        currencyDropdown={currencyDropdown}
        formData={formData}
        handlefieldChange={handlefieldChange}
        handleSelectChange={handleSelectChange}
        />
        </form>
    </div>
  );
};

export default VendorRegistration;

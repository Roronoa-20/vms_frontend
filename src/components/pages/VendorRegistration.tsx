"use client"
import React from "react";
import VendorRegistration1 from "../templates/vendorRegistration/VendorRegistrationForm1";
import VendorRegistration2 from "../templates/vendorRegistration/VendorRegistrationForm2";
import { TvendorRegistrationDropdown } from "@/src/types/types";
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

  const vendorTitleDropdown = Props?.vendorTitleDropdown;
  const vendorTypeDropdown = Props?.vendorTypeDropdown;
  const countryDropdown = Props?.countryDropdown;
  const companyDropdown = Props?.companyDropdown;
  const incoTermsDropdown = Props?.incoTermsDropdown;
  const currencyDropdown = Props?.currencyDropdown;


  const {data,resetForm} = useVendorStore()
  const router = useRouter();
   const handleSubmit = async(e:React.FormEvent)=>{
    e.preventDefault()
    const url = API_END_POINTS?.vendorRegistrationSubmit
    const response:AxiosResponse = await requestWrapper({
      url:url,
      method:"POST",
      data:{data:data}
    });
  
    if(response?.status == 500){
      console.log("error in submitting this form");
      return;
    }
  
    if(response?.status == 200){
      resetForm();
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
        />
      <VendorRegistration2 
        companyDropdown = {companyDropdown}
        incoTermsDropdown = {incoTermsDropdown}
        currencyDropdown={currencyDropdown}
        />
        </form>
    </div>
  );
};

export default VendorRegistration;

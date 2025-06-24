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

export type TtableData = {
  company_name:string,
  purchase_organization:string,
  account_group:string,
  purchase_group:string,
  terms_of_payment:string,
  order_currency:string,
  incoterms:string,
  reconciliation_account:string
}

const VendorRegistration = ({...Props}:Props) => {

const [formData,setFormData] = useState<Partial<VendorRegistrationData>>({})
const [multiVendor,setMultiVendor] = useState();
const [tableData,setTableData] = useState<TtableData[]>([]);
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
   const handleSubmit = async()=>{
    const url = API_END_POINTS?.vendorRegistrationSubmit;
    let updateFormData;
    if(tableData?.length > 1){
      updateFormData = {...formData,
        purchase_details:tableData,
        // reconciliation_account:tableData?.[0]?.reconciliation_account,
        // incoterms:tableData?.[0]?.incoterms,
        for_multiple_company:1
      }
    }else{
       updateFormData = {...formData,
        company_name:tableData?.[0]?.company_name,
        purchase_organization:tableData?.[0]?.purchase_organization,
        account_group:tableData?.[0]?.account_group,
        terms_of_payment:tableData?.[0]?.terms_of_payment,
        purchase_group:tableData?.[0]?.purchase_group,
        order_currency:tableData?.[0]?.order_currency,
        reconciliation_account:tableData?.[0]?.reconciliation_account,
        incoterms:tableData?.[0]?.incoterms,
        for_multiple_company:0
       }
    }
    const response:AxiosResponse = await requestWrapper({
      url:url,
      method:"POST",
      data:{data:updateFormData}
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
      {/* <form onSubmit={(e)=>{handleSubmit(e)}}> */}
      <VendorRegistration1
        vendorTitleDropdown={vendorTitleDropdown}
        vendorTypeDropdown={vendorTypeDropdown}
        countryDropdown={countryDropdown}
        formData={formData}
        handlefieldChange={handlefieldChange}
        handleSelectChange={handleSelectChange}
        setMultiVendor={setMultiVendor}
        />
      <VendorRegistration2 
        companyDropdown = {companyDropdown}
        incoTermsDropdown = {incoTermsDropdown}
        currencyDropdown={currencyDropdown}
        formData={formData}
        handlefieldChange={handlefieldChange}
        handleSelectChange={handleSelectChange}
        tableData={tableData}
        setTableData={setTableData}
        handleSubmit={handleSubmit}
        multiVendor={multiVendor}
        />
        {/* </form> */}
    </div>
  );
};

export default VendorRegistration;

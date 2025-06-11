import VendorRegistration from "@/src/components/pages/VendorRegistration";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { TvendorRegistrationDropdown } from "@/src/types/types";
import { AxiosResponse } from "axios";
import React from "react";

const page = async() => {

  const dropdownUrl = API_END_POINTS?.vendorRegistrationDropdown;
  const dropDownApi: AxiosResponse = await requestWrapper({
    url: dropdownUrl,
    method: "GET",
  });
  const dropdownData: TvendorRegistrationDropdown["message"]["data"] =
    dropDownApi?.status == 200 ? dropDownApi?.data?.message?.data : "";
    console.log(dropdownData,"this is dropdown")

  const vendorTitleDropdown = dropdownData?.vendor_title;
  const vendorTypeDropdown = dropdownData?.vendor_type;
  const countryDropdown = dropdownData?.country_master;
  const companyDropdown = dropdownData?.company_master;
  const incoTermsDropdown = dropdownData?.incoterm_master;
  const currencyDropdown = dropdownData?.currency_master;

  

  return <VendorRegistration 
  vendorTitleDropdown={vendorTitleDropdown}
  vendorTypeDropdown={vendorTypeDropdown}
  countryDropdown={countryDropdown}
  companyDropdown={companyDropdown}
  incoTermsDropdown={incoTermsDropdown}
  currencyDropdown={currencyDropdown}
  />;
};

export default page;

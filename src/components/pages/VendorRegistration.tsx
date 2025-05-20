import React from "react";
import VendorRegistration1 from "../templates/vendorRegistration/VendorRegistrationForm1";
import VendorRegistration2 from "../templates/vendorRegistration/VendorRegistrationForm2";
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import { TvendorRegistrationDropdown } from "@/src/types/types";
import { Button } from "../atoms/button";
import { useVendorStore } from "@/src/store/VendorRegistrationStore";

const VendorRegistration = async () => {
  const dropdownUrl = API_END_POINTS?.vendorRegistrationDropdown;
  const dropDownApi: AxiosResponse = await requestWrapper({
    url: dropdownUrl,
    method: "GET",
  });
  const dropdownData: TvendorRegistrationDropdown["message"]["data"] =
    dropDownApi?.status == 200 ? dropDownApi?.data?.message?.data : "";

  const vendorTitleDropdown = dropdownData?.vendor_title;
  const vendorTypeDropdown = dropdownData?.vendor_type;
  const countryDropdown = dropdownData?.country_master;
  const companyDropdown = dropdownData?.company_master;
  const incoTermsDropdown = dropdownData?.incoterm_master;
  const currencyDropdown = dropdownData?.currency_master;

  return (
    <div className="p-6">
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
    </div>
  );
};

export default VendorRegistration;

import React from "react";
import MaterialOnboarding from "@/src/components/pages/view-material-code-request";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";

const Page = async () => {
  const dropdownUrl = API_END_POINTS.vendorRegistrationDropdown;
  const dropDownApi = await requestWrapper({
    url: dropdownUrl,
    method: "GET",
  });

  const dropdownData = dropDownApi?.status === 200 ? dropDownApi.data?.message?.data : null;
  const companyDropdown = dropdownData?.company_master || [];

  return <MaterialOnboarding companyDropdown={companyDropdown} />;
};

export default Page;

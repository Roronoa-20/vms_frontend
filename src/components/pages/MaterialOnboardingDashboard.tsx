import React from "react";
import DashboardCard from "@/src/components/molecules/MaterialOnboardingDashbordCards";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import { TvendorRegistrationDropdown } from "@/src/types/types";
import { cookies } from "next/headers";

export type cardCount = {
  total_count:number,
  approved:number,
  pending:number,
}


const MaterialOnboardingDashBoard = async () => {
  const cookieStore = await cookies();
  const user = cookieStore.get("user_id")?.value
  const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");
  const dashboardCardApi: AxiosResponse = await requestWrapper({
    url: `${API_END_POINTS?.materialonboardingdashboard}`,
    method: "GET",
    headers: {
      cookie: cookieHeaderString
    }
  });
  const CardData =
    dashboardCardApi?.status == 200 ? dashboardCardApi?.data?.message?.data : "";
  
  const dropdownUrl = API_END_POINTS?.vendorRegistrationDropdown;
  const dropDownApi: AxiosResponse = await requestWrapper({
    url: dropdownUrl,
    method: "GET",
    headers: {
      cookie: cookieHeaderString
    }
  });
  const dropdownData: TvendorRegistrationDropdown["message"]["data"] =
    dropDownApi?.status == 200 ? dropDownApi?.data?.message?.data : "";
  const companyDropdown = dropdownData?.company_master
 


  return (
    <div className="p-4">
      {/* Cards */}
      <DashboardCard
        cardData={CardData}
        companyDropdown={companyDropdown}
      />
    </div>
  );
};

export default MaterialOnboardingDashBoard;

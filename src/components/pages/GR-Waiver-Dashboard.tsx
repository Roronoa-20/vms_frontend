import React from "react";
import DashboardCard from "../molecules/GRWaiverDashboardCards";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import { TvendorRegistrationDropdown } from "@/src/types/types";
import { cookies } from "next/headers";

export interface CompanyInfo {
  name: string;
  company_name: string;
  count: number;
  short_name: string;
}


export type CompanyCountKey =
  | "1000_count"
  | "1012_count"
  | "1022_count"
  | "1025_count"
  | "1030_count"
  | "2000_count"
  | "3000_count"
  | "7000_count"
  | "8000_count"
  | "9000_count";

export type cardCount = {
  total_count: number | string;
} & {
  [K in CompanyCountKey]?: CompanyInfo;
};


const GRWaiverDashboard = async () => {
  const cookieStore = await cookies();
  const user = cookieStore.get("user_id")?.value
  const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");

  const dashboardCardApi: AxiosResponse = await requestWrapper({
    url: `${API_END_POINTS?.GRWaiverDashboard}`,
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

export default GRWaiverDashboard;

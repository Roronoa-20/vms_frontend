import React from "react";
import DashboardCard from "../molecules/GateentryDashboardCards";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import { DashboardPOTableData, dashboardCardData, DashboardTableType, TvendorRegistrationDropdown, TPRInquiryTable, PurchaseRequisition, RFQTable } from "@/src/types/types";
import { cookies } from "next/headers";

type data = {
  name:string,
  count:number,
  company_name:string
}

export type cardCount = {
  "1022-Meril Medical Innovation Pvt. Ltd.":data,
  "1012-Micro Life Sciences Pvt. Ltd.":data,
  "1030-Meril Corporation I Pvt Ltd":data,
  "1025-Merai Newage Pvt. Ltd.":data,
  "7000-Meril Diagnostics Private Limited":data,
  "9000-Meril Healthcare Private Limited":data,
  "1000-Bilakhia Holdings Private Limited":data,
  "3000-Meril Life Sciences India Private Limited":data,
  "2000-Meril Life Sciences Private Limited":data,
  "8000-Meril Endo Surgery Private Limited":data,
  total_count:number,
  gate_received_count:number,
  received_at_store_count:number,
  handover_count:number

}


const GateEntryDashboard = async () => {
  // const cookie = await cookies()
  const cookieStore = await cookies();
  const user = cookieStore.get("user_id")?.value
  console.log(user, "user")
  const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");
  //card data
  const dashboardCardApi: AxiosResponse = await requestWrapper({
    url: `${API_END_POINTS?.GateEntryDashboardCardCount}`,
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

console.log(CardData,"this is new count")
 


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

export default GateEntryDashboard;

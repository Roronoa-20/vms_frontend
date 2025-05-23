import React from "react";
import DashboardCardCounter from "../molecules/Dashboard-Card-Count";
import DashboardTable from "../molecules/Dashboard-Table";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import { TvendorRegistrationDropdown, dashboardCardData } from "@/src/types/types";
import { cookies } from "next/headers";
const Dashboard = async () => {
  const cookie = await cookies()
  const cookieStore = await cookies();
  const user = cookie.get("user_id")?.value
  const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");
  const dashboardCardApi: AxiosResponse = await requestWrapper({
    url: `${API_END_POINTS?.dashboardCardURL}?usr=${user}`,
    method: "GET",
    headers: {
      cookie: cookieHeaderString
    }
  });
  const CardData: dashboardCardData["message"] =
    dashboardCardApi?.status == 200 ? dashboardCardApi?.data?.message : "";


  const dashboardTableDataApi: AxiosResponse = await requestWrapper({
    url:`${API_END_POINTS?.dashboardTableURL}?usr=${user}`,
    method: "GET",
    headers: {
      cookie: cookieHeaderString
    }
  });
  const dashboardTableData: dashboardCardData["message"] =
    dashboardTableDataApi?.status == 200 ? dashboardTableDataApi?.data?.message : "";

  console.log("dashboardCardData", dashboardTableData)
  return (
    <div className="p-8">
      {/* Cards */}
      <DashboardCardCounter cardData={CardData} />
      <DashboardTable dashboardTableData={dashboardTableData}/>
    </div>
  );
};

export default Dashboard;

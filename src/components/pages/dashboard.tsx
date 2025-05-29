import React from "react";
import DashboardCardCounter from "../molecules/Dashboard-Card-Count";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import { DashboardPOTableData, dashboardCardData,DashboardTableType } from "@/src/types/types";
import { cookies } from "next/headers";
const Dashboard = async () => {
  // const cookie = await cookies()
  const cookieStore = await cookies();
  const user = cookieStore.get("user_id")?.value
  console.log(user, "user")
  const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");
  //card data
  const dashboardCardApi: AxiosResponse = await requestWrapper({
    url: `${API_END_POINTS?.dashboardCardURL}?usr=${user}`,
    method: "GET",
    headers: {
      cookie: cookieHeaderString
    }
  });
  const CardData: dashboardCardData =
    dashboardCardApi?.status == 200 ? dashboardCardApi?.data?.message : "";

  //po table 
  const dashboardPOTableDataApi: AxiosResponse = await requestWrapper({
    url: `${API_END_POINTS?.dashboardPOTableURL}`,
    method: "GET",
    headers: {
      cookie: cookieHeaderString
    }
  });
  const dashboardPOTableData: DashboardPOTableData =
    dashboardPOTableDataApi?.status == 200 ? dashboardPOTableDataApi?.data?.message : "";

  console.log(dashboardPOTableData, "dashboardPOTableData-------------------------")

  //total vendor table
  const dashboardTotalVendorTableDataApi: AxiosResponse = await requestWrapper({
    url: `${API_END_POINTS?.dashboardTotalVendorTableURL}?usr=${user}`,
    method: "GET",
    headers: {
      cookie: cookieHeaderString
    }
  });
  const dashboardTotalVendorTableData: DashboardTableType =
  dashboardTotalVendorTableDataApi?.status == 200 ? dashboardTotalVendorTableDataApi?.data?.message : "";

// pending vendor table
  const dashboardPendingVendorTableDataApi: AxiosResponse = await requestWrapper({
    url: `${API_END_POINTS?.dashboardPendingVendorTableURL}?usr=${user}`,
    method: "GET",
    headers: {
      cookie: cookieHeaderString
    }
  });
  const dashboardPendingVendorTableData: DashboardTableType =
  dashboardPendingVendorTableDataApi?.status == 200 ? dashboardPendingVendorTableDataApi?.data?.message : "";

// approved vendor table
  const dashboardApprovedVendorTableDataApi: AxiosResponse = await requestWrapper({
    url: `${API_END_POINTS?.dashboardApprovedVendorTableURL}?usr=${user}`,
    method: "GET",
    headers: {
      cookie: cookieHeaderString
    }
  });
  const dashboardApprovedVendorTableData: DashboardTableType =
  dashboardApprovedVendorTableDataApi?.status == 200 ? dashboardApprovedVendorTableDataApi?.data?.message : "";

  // rejected vendor table
  const dashboardRejectedVendorTableDataApi: AxiosResponse = await requestWrapper({
    url: `${API_END_POINTS?.dashboardRejectedVendorTableURL}?usr=${user}`,
    method: "GET",
    headers: {
      cookie: cookieHeaderString
    }
  });
  const dashboardRejectedVendorTableData: DashboardTableType =
  dashboardRejectedVendorTableDataApi?.status == 200 ? dashboardRejectedVendorTableDataApi?.data?.message : "";
  // const dashboardTableDataApi: AxiosResponse = await requestWrapper({
  //   url: `${API_END_POINTS?.dashboardTableURL}?usr=${user}`,
  //   method: "GET",
  //   headers: {
  //     cookie: cookieHeaderString
  //   }
  // });
  // const dashboardTableData: dashboardCardData["message"] =
  //   dashboardTableDataApi?.status == 200 ? dashboardTableDataApi?.data?.message : "";
  // console.log(dashboardTableData, "dashboardTableData")

  console.log(dashboardTotalVendorTableDataApi,"-----------------========","=pending---","=-09876543333333333333333333333333")
  return (
    <div className="p-8">
      {/* Cards */}
      <DashboardCardCounter
        cardData={CardData}
        // dashboardPOTableData={dashboardPOTableData}
        // dashboardDispatchVendorTableData={dashboardTotalVendorTableData}
        dashboardTotalVendorTableData={dashboardTotalVendorTableData} 
        dashboardPendingVendorTableData={dashboardPendingVendorTableData}
        dashboardApprovedVendorTableData={dashboardApprovedVendorTableData}
        dashboardRejectedVendorTableData={dashboardRejectedVendorTableData}
        />
    </div>
  );
};

export default Dashboard;

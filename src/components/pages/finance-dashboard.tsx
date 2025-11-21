import React from "react";
import DashboardCardCounter from "../molecules/Finance-Dashboard-Card-Count";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import { DashboardPOTableData, dashboardCardData, DashboardTableType, TvendorRegistrationDropdown, TuserRegistrationDropdown, TPRInquiryTable, PurchaseRequisition, RFQTable } from "@/src/types/types";
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

  console.log(CardData, "CardData-------------------------")

  //po table 
  const dashboardPOTableDataApi: AxiosResponse = await requestWrapper({
    url: `${API_END_POINTS?.poTable}`,
    method: "GET",
    headers: {
      cookie: cookieHeaderString
    }
  });
  const dashboardPOTableData: DashboardPOTableData["message"] =
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
  console.log(dashboardTotalVendorTableData, "lkshklsdzlkjsdflksd.jfvbh")


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


  const RegisteredByURL = API_END_POINTS?.UserRegistrationDropdown;
  const RegisteredByApi: AxiosResponse = await requestWrapper({
    url: RegisteredByURL,
    method: "GET",
    headers: {
      cookie: cookieHeaderString
    }
  });
  console.log("YYYYYYYYY---->", RegisteredByApi)

  const RegisteredByData: TuserRegistrationDropdown["message"]["data"] =
    RegisteredByApi?.status == 200 ? RegisteredByApi?.data?.message : "";
  const filterregisteredby = RegisteredByData?.users_list

  console.log("YYYYYYYYY---->", RegisteredByData)


  const prInquiryDashboardUrl = API_END_POINTS?.prInquiryDashboardTable;
  const prInquiryApi: AxiosResponse = await requestWrapper({
    url: prInquiryDashboardUrl,
    method: "GET",
    headers: {
      cookie: cookieHeaderString
    }
  });
  const prInquiryData: TPRInquiryTable =
    prInquiryApi?.status == 200 ? prInquiryApi?.data?.message : "";

  const prDashboardUrl = API_END_POINTS?.prTableData;
  const prApi: AxiosResponse = await requestWrapper({ url: prDashboardUrl, method: "GET", headers: { cookie: cookieHeaderString } });
  const prData: PurchaseRequisition[] = prApi?.status == 200 ? prApi?.data?.message?.data : "";

  const dashboardOnboardedVendorAccounts: AxiosResponse = await requestWrapper({
    url: API_END_POINTS?.dashboardOnboardedVendorsAccounts,
    method: "GET",
    headers: {
      cookie: cookieHeaderString
    }
  })

  const dashboardAccountsOnboarded = dashboardOnboardedVendorAccounts?.status == 200 ? dashboardOnboardedVendorAccounts?.data?.message : ""

  console.log(filterregisteredby, "prData");

  return (
    <div className="p-4">
      {/* Cards */}
      <DashboardCardCounter
        cardData={CardData}
        companyDropdown={companyDropdown}
        filterregisteredby={filterregisteredby}
        dashboardPOTableData={dashboardPOTableData}
        dashboardTotalVendorTableData={dashboardTotalVendorTableData}
        dashboardApprovedVendorTableData={dashboardApprovedVendorTableData}
        prInquiryData={prInquiryData}
        prData={prData}
        dashboardAccountsOnboarded={dashboardAccountsOnboarded}
      />
    </div>
  );
};

export default Dashboard;

import React from "react";
import DashboardCardCounter from "../molecules/Dashboard-Card-Count";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import { DashboardPOTableData, dashboardCardData, DashboardTableType, TvendorRegistrationDropdown, TPRInquiryTable, PurchaseRequisition, RFQTable } from "@/src/types/types";
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
  const dashboardRejectedVendorTableData: DashboardTableType["rejected_vendor_onboarding"] =
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


  // const companyDropdownUrl = API_END_POINTS?.companyDropdown
  //             const companyDropdownResponse:AxiosResponse = await requestWrapper({url:companyDropdownUrl,method:"GET"});
  //             const companyDropdown:{name:string}[] =  companyDropdownResponse?.status == 200?companyDropdownResponse?.data?.data : ""; 
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

  const rfqDashboardUrl = API_END_POINTS?.rfqTableData;
  const rfqApi: AxiosResponse = await requestWrapper({ url: rfqDashboardUrl, method: "GET", headers: { cookie: cookieHeaderString } });
  const rfqData: RFQTable = rfqApi?.status == 200 ? rfqApi?.data?.message : "";
  console.log(rfqData, "this is rfqData");


  const dashboardASAFormTableDataApi: AxiosResponse = await requestWrapper({
    url: API_END_POINTS?.asavendorListdashboard,
    method: "GET",
    headers: {
      cookie: cookieHeaderString
    }
  });
  const dashboardASAFormTableData: DashboardTableType["asa_form_data"] =
    dashboardASAFormTableDataApi?.status == 200 ? dashboardASAFormTableDataApi?.data?.message : "";

  const dashboardPendingASAFormTableDataApi: AxiosResponse = await requestWrapper({
    url: API_END_POINTS?.asavendorListdashboard,
    method: "GET",
    headers: {
      cookie: cookieHeaderString
    }
  });
  const dashboardPendingASAFormTableData: DashboardTableType["asa_form_data"] =
    dashboardPendingASAFormTableDataApi?.status == 200 ? dashboardPendingASAFormTableDataApi?.data?.message : "";

  const dashboardASAPendingVendorListTableDataApi: AxiosResponse = await requestWrapper({
    url: API_END_POINTS?.asapendingVendorList,
    method: "GET",
    headers: {
      cookie: cookieHeaderString
    }
  });
  const dashboardASAPendingVendorListTableData: DashboardTableType["asa_form_data"] = 
  dashboardASAPendingVendorListTableDataApi?.status == 200 ? dashboardASAPendingVendorListTableDataApi?.data?.message : "";

  const ASAdashboardApprovedVendorCountTableDataApi: AxiosResponse = await requestWrapper({
    url: API_END_POINTS?.asaapprovedvendorcount,
    method: "GET",
    headers: {
      cookie: cookieHeaderString
    }
  });
  const ASAdashboardApprovedVendorcountTableData: DashboardTableType["asa_form_data"] = 
  ASAdashboardApprovedVendorCountTableDataApi?.status == 200 ? ASAdashboardApprovedVendorCountTableDataApi?.data?.message : "";

  const dashboardSAPErrorTable: AxiosResponse = await requestWrapper({
    url: API_END_POINTS?.sapApiDashboardDetails,
    method: "GET",
    headers: {
      cookie: cookieHeaderString
    }
  })

  const sapErrorDashboardData = dashboardSAPErrorTable?.status == 200 ? dashboardSAPErrorTable?.data?.message?.sap_error_vendor_onboarding : ""


  return (
    <div className="p-4">
      {/* Cards */}
      <DashboardCardCounter
        cardData={CardData}
        companyDropdown={companyDropdown}
        dashboardPOTableData={dashboardPOTableData}
        // dashboardDispatchVendorTableData={dashboardTotalVendorTableData}
        dashboardTotalVendorTableData={dashboardTotalVendorTableData}
        dashboardPendingVendorTableData={dashboardPendingVendorTableData}
        dashboardApprovedVendorTableData={dashboardApprovedVendorTableData}
        dashboardRejectedVendorTableData={dashboardRejectedVendorTableData}
        prInquiryData={prInquiryData}
        prData={prData}
        rfqData={rfqData}
        dashboardASAFormTableData={dashboardASAFormTableData}
        dashboardPendingASAFormTableData={dashboardPendingASAFormTableData}
        ASAdashboardApprovedVendorcountTableData={ASAdashboardApprovedVendorcountTableData}
        dashboardASAPendingVendorListTableData={dashboardASAPendingVendorListTableData}
        sapErrorDashboardData={sapErrorDashboardData}
      />
    </div>
  );
};

export default Dashboard;

import React from "react";
import VendorDashboardClient from "./VendorDashboardClient";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import {
  dashboardCardData,
  TvendorRegistrationDropdown,
  VendorDashboardPOTableData,
  RFQTable
} from "@/src/types/types";
import { cookies } from "next/headers";

const VendorDashboard = async () => {
  try {
    const cookieStore = await cookies();
    const cookieHeaderString = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join("; ");

    const dashboardCardApi: AxiosResponse = await requestWrapper({
      url: API_END_POINTS?.VendorCodeBasedCardCount,
      method: "GET",
      headers: { cookie: cookieHeaderString },
    });
    const cardData: dashboardCardData =
      dashboardCardApi?.status === 200 ? dashboardCardApi?.data?.message : [];

    const dashboardPOTableApi: AxiosResponse = await requestWrapper({
      url: API_END_POINTS?.vendorPOTable,
      method: "GET",
      headers: { cookie: cookieHeaderString },
    });
    const dashboardPOTableData: VendorDashboardPOTableData["message"] =
      dashboardPOTableApi?.status === 200
        ? dashboardPOTableApi?.data?.message
        : [];

    const dropDownApi: AxiosResponse = await requestWrapper({
      url: API_END_POINTS?.vendorRegistrationDropdown,
      method: "GET",
    });
    const dropdownData: TvendorRegistrationDropdown["message"]["data"] =
      dropDownApi?.status === 200 ? dropDownApi?.data?.message?.data : {};
    const companyDropdown = dropdownData?.company_master || [];

    const dispatchTableApi: AxiosResponse = await requestWrapper({
      url: API_END_POINTS?.dispatchTable,
      method: "GET",
      headers: { cookie: cookieHeaderString },
    });
    const dispatchTableData =
      dispatchTableApi?.status === 200
        ? dispatchTableApi?.data?.message?.dispatches
        : [];
    const dispatchCardCount =
      dispatchTableApi?.status === 200
        ? dispatchTableApi?.data?.message?.card_count
        : 0;

    const rfqDashboardUrl = API_END_POINTS?.rfqTableData;
    const rfqApi: AxiosResponse = await requestWrapper({
      url: rfqDashboardUrl,
      method: "GET",
      headers: { cookie: cookieHeaderString },
    });
    const rfqData: RFQTable =
      rfqApi?.status == 200 ? rfqApi?.data?.message : "";
    console.log(rfqData, "this is rfqData");

    return (
      <VendorDashboardClient
        companyDropdown={companyDropdown}
        cardData={cardData}
        dashboardPOTableData={dashboardPOTableData}
        dispatchTableData={dispatchTableData}
        dispatchCardCount={dispatchCardCount}
        rfqData={rfqData}
      />
    );
  } catch (error) {
    console.error("VendorDashboard fetch error:", error);
    return (
      <div className="p-4 text-red-600">Error loading Vendor Dashboard</div>
    );
  }
};

export default VendorDashboard;

// "use client";

// import React from 'react'
// import VendorDashboardCardCounter from "../molecules/Vendor-Dashboard-Card-Count";
// import { AxiosResponse } from 'axios';
// import requestWrapper from '@/src/services/apiCall';
// import API_END_POINTS from '@/src/services/apiEndPoints';
// import { dashboardCardData, DashboardPOTableData, DashboardTableType, TvendorRegistrationDropdown, VendorDashboardPOTableData } from '@/src/types/types';
// import { cookies } from 'next/headers';

// const VendorDashboard = async() => {

//     const cookieStore = await cookies();
//       const user = cookieStore.get("user_id")?.value
//       const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");

//     const dashboardCardApi: AxiosResponse = await requestWrapper({
//         url: `${API_END_POINTS?.VendorCodeBasedCardCount}`,
//         method: "GET",
//         headers: {
//           cookie: cookieHeaderString
//         }
//       });
//       const CardData: dashboardCardData =
//         dashboardCardApi?.status == 200 ? dashboardCardApi?.data?.message : "";
//           let POUrl = "";
//             POUrl = `${API_END_POINTS?.vendorPOTable}`
//           const dashboardPOTableDataApi: AxiosResponse = await requestWrapper({
//             url: POUrl,
//             method: "GET",
//             headers: {
//               cookie: cookieHeaderString
//             }
//           });

//            const dashboardPOTableData: VendorDashboardPOTableData["message"] =
//               dashboardPOTableDataApi?.status == 200 ? dashboardPOTableDataApi?.data?.message : "";

//               // const companyDropdownUrl = API_END_POINTS?.companyDropdown
//               // const companyDropdownResponse:AxiosResponse = await requestWrapper({url:companyDropdownUrl,method:"GET"});
//               // const companyDropdown:{name:string,description:string}[] =  companyDropdownResponse?.status == 200?companyDropdownResponse?.data?.data : "";

//                 const dropdownUrl = API_END_POINTS?.vendorRegistrationDropdown;
//                 const dropDownApi: AxiosResponse = await requestWrapper({
//                   url: dropdownUrl,
//                   method: "GET",
//                 });

//                   const dropdownData: TvendorRegistrationDropdown["message"]["data"] =
//                     dropDownApi?.status == 200 ? dropDownApi?.data?.message?.data : "";
//                   const companyDropdown = dropdownData?.company_master

//                 const dispatchTableUrl = API_END_POINTS?.dispatchTable;
//                 const dispatchTableApi: AxiosResponse = await requestWrapper({
//                   url: dispatchTableUrl,
//                   method: "GET",
//                   headers:{
//                     cookie: cookieHeaderString
//                   }
//                 });

//                   const dispatchTableData =
//                     dispatchTableApi?.status == 200 ? dispatchTableApi?.data?.message?.dispatches : "";
//                     const dispatchCardCount =
//                     dispatchTableApi?.status == 200 ? dispatchTableApi?.data?.message?.card_count : "";

//   return (
//     <div className="p-4">
//       {/* Cards */}
//       <VendorDashboardCardCounter
//       companyDropdown={companyDropdown}
//         cardData={CardData}
//         dashboardPOTableData={dashboardPOTableData}
//         dispatchTableData={dispatchTableData}
//         dispatchCardCount={dispatchCardCount}
//         />
//     </div>
//   )
// }

// export default VendorDashboard

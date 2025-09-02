import React from 'react'
import VendorDashboardCardCounter from "../molecules/Vendor-Dashboard-Card-Count";
import { AxiosResponse } from 'axios';
import requestWrapper from '@/src/services/apiCall';
import API_END_POINTS from '@/src/services/apiEndPoints';
import { dashboardCardData, DashboardPOTableData, DashboardTableType, TvendorRegistrationDropdown, VendorDashboardPOTableData } from '@/src/types/types';
import { cookies } from 'next/headers';

const VendorDashboard = async() => {


    const cookieStore = await cookies();
      const user = cookieStore.get("user_id")?.value
      const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");

    const dashboardCardApi: AxiosResponse = await requestWrapper({
        url: `${API_END_POINTS?.VendorCodeBasedCardCount}`,
        method: "GET",
        headers: {
          cookie: cookieHeaderString
        }
      });
      const CardData: dashboardCardData =
        dashboardCardApi?.status == 200 ? dashboardCardApi?.data?.message : "";
          let POUrl = "";
            POUrl = `${API_END_POINTS?.vendorPOTable}`
          const dashboardPOTableDataApi: AxiosResponse = await requestWrapper({
            url: POUrl,
            method: "GET",
            headers: {
              cookie: cookieHeaderString
            }
          });

           const dashboardPOTableData: VendorDashboardPOTableData["message"] =
              dashboardPOTableDataApi?.status == 200 ? dashboardPOTableDataApi?.data?.message : "";
          

              // const companyDropdownUrl = API_END_POINTS?.companyDropdown
              // const companyDropdownResponse:AxiosResponse = await requestWrapper({url:companyDropdownUrl,method:"GET"});
              // const companyDropdown:{name:string,description:string}[] =  companyDropdownResponse?.status == 200?companyDropdownResponse?.data?.data : ""; 

                const dropdownUrl = API_END_POINTS?.vendorRegistrationDropdown;
                const dropDownApi: AxiosResponse = await requestWrapper({
                  url: dropdownUrl,
                  method: "GET",
                });

                  const dropdownData: TvendorRegistrationDropdown["message"]["data"] =
                    dropDownApi?.status == 200 ? dropDownApi?.data?.message?.data : "";
                  const companyDropdown = dropdownData?.company_master

                const dispatchTableUrl = API_END_POINTS?.dispatchTable;
                const dispatchTableApi: AxiosResponse = await requestWrapper({
                  url: dispatchTableUrl,
                  method: "GET",
                  headers:{
                    cookie: cookieHeaderString
                  }
                });

                  const dispatchTableData =
                    dispatchTableApi?.status == 200 ? dispatchTableApi?.data?.message?.dispatches : "";
                    const dispatchCardCount =
                    dispatchTableApi?.status == 200 ? dispatchTableApi?.data?.message?.card_count : "";

          
  return (
    <div className="p-4">
      {/* Cards */}
      <VendorDashboardCardCounter
      companyDropdown={companyDropdown}
        cardData={CardData}
        dashboardPOTableData={dashboardPOTableData}
        dispatchTableData={dispatchTableData}
        dispatchCardCount={dispatchCardCount}
        />
    </div>
  )
}

export default VendorDashboard
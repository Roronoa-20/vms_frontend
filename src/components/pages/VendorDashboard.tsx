import React from 'react'
import DashboardCardCounter from "../molecules/Dashboard-Card-Count";
import { AxiosResponse } from 'axios';
import requestWrapper from '@/src/services/apiCall';
import API_END_POINTS from '@/src/services/apiEndPoints';
import { dashboardCardData, DashboardPOTableData, DashboardTableType } from '@/src/types/types';
import { cookies } from 'next/headers';

const VendorDashboard = async() => {


    const cookieStore = await cookies();
      const user = cookieStore.get("user_id")?.value
      const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");
      const designation = cookieStore.get("designation")?.value

    const dashboardCardApi: AxiosResponse = await requestWrapper({
        url: `${API_END_POINTS?.dashboardCardURL}?usr=${user}`,
        method: "GET",
        headers: {
          cookie: cookieHeaderString
        }
      });
      const CardData: dashboardCardData =
        dashboardCardApi?.status == 200 ? dashboardCardApi?.data?.message : "";

        const dashboardTotalVendorTableDataApi: AxiosResponse = await requestWrapper({
            url: `${API_END_POINTS?.dashboardTotalVendorTableURL}?usr=${user}`,
            method: "GET",
            headers: {
              cookie: cookieHeaderString
            }
          });
          const dashboardTotalVendorTableData: DashboardTableType =
          dashboardTotalVendorTableDataApi?.status == 200 ? dashboardTotalVendorTableDataApi?.data?.message : "";

          let POUrl = "";
          if(designation == "Vendor"){
            POUrl = `${API_END_POINTS?.vendorPOTable}`
          }else{
            POUrl = `${API_END_POINTS?.dashboardPOTableURL}`
          }
          const dashboardPOTableDataApi: AxiosResponse = await requestWrapper({
            url: POUrl,
            method: "GET",
            headers: {
              cookie: cookieHeaderString
            }
          });

           const dashboardPOTableData: DashboardPOTableData =
              dashboardPOTableDataApi?.status == 200 ? dashboardPOTableDataApi?.data?.message : "";
          

              const companyDropdownUrl = API_END_POINTS?.companyDropdown
              const companyDropdownResponse:AxiosResponse = await requestWrapper({url:companyDropdownUrl,method:"GET"});
              const companyDropdown:{name:string}[] =  companyDropdownResponse?.status == 200?companyDropdownResponse?.data?.data : ""; 
          
  return (
    <div className="p-8">
      {/* Cards */}
      <DashboardCardCounter
      companyDropdown={companyDropdown}
        cardData={CardData}
        dashboardPOTableData={dashboardPOTableData}
        // dashboardDispatchVendorTableData={dashboardTotalVendorTableData}
        dashboardTotalVendorTableData={dashboardTotalVendorTableData} 
        // dashboardPendingVendorTableData={dashboardPendingVendorTableData}
        // dashboardApprovedVendorTableData={dashboardApprovedVendorTableData}
        // dashboardRejectedVendorTableData={dashboardRejectedVendorTableData}
        />
    </div>
  )
}

export default VendorDashboard
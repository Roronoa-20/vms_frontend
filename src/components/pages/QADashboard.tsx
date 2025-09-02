import React from "react";
import QADashboardCardCounter from "../molecules/QA-Dashboard-Card-Count";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { TvendorRegistrationDropdown } from "@/src/types/types";
import {
  TotalQMSOnboardingResponse,
  PendingQMSOnboardingResponse,
  ApprovedSupplierQMSResponse,
  RejectedSupplierQMSResponse,
  FullyFilledSupplierQMSResponse,
  BaseQMSResponse
} from "@/src/types/QAdashboardtypes";
import { cookies } from "next/headers";

const QADashboard = async () => {
  const cookieStore = await cookies();
  const cookieHeaderString = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const dashboardCardApi: AxiosResponse<TotalQMSOnboardingResponse> =
    await requestWrapper({
      url: `${API_END_POINTS?.TotalQMSDocs}`,
      method: "GET",
      headers: { cookie: cookieHeaderString },
    });
  const CardData: TotalQMSOnboardingResponse["message"] | null  = dashboardCardApi?.status === 200 ? dashboardCardApi.data.message : null;

  const dashboardFilledQMSTableDataApi: AxiosResponse<FullyFilledSupplierQMSResponse> =
    await requestWrapper({
      url: `${API_END_POINTS?.FullyFilledQMSDocs}`,
      method: "GET",
      headers: { cookie: cookieHeaderString },
    });
  const dashboardFilledQMSTableData: FullyFilledSupplierQMSResponse["message"] | null = 
    dashboardFilledQMSTableDataApi?.status === 200
      ? dashboardFilledQMSTableDataApi.data.message
      : null;

  const dashboardPendingTableDataApi: AxiosResponse<PendingQMSOnboardingResponse> =
    await requestWrapper({
      url: `${API_END_POINTS?.PendingQMDocs}`,
      method: "GET",
      headers: { cookie: cookieHeaderString },
    });
  const dashboardPendingTableData : PendingQMSOnboardingResponse["message"] | null =
    dashboardPendingTableDataApi?.status === 200
      ? dashboardPendingTableDataApi.data.message
      : null;

  const dashboardApprovedTableApi: AxiosResponse<ApprovedSupplierQMSResponse> =
    await requestWrapper({
      url: `${API_END_POINTS?.ApprovedQMSDocs}`,
      method: "GET",
      headers: { cookie: cookieHeaderString },
    });
  const dashboardApprovedTableData : ApprovedSupplierQMSResponse["message"] | null = 
    dashboardApprovedTableApi?.status === 200
      ? dashboardApprovedTableApi.data.message
      : null;

  const dashboardRejectedTableApi: AxiosResponse<RejectedSupplierQMSResponse> =
    await requestWrapper({
      url: `${API_END_POINTS?.RejectedQMSDocs}`,
      method: "GET",
      headers: { cookie: cookieHeaderString },
    });
  const dashboardRejectedTableData : RejectedSupplierQMSResponse["message"] | null =
    dashboardRejectedTableApi?.status === 200
      ? dashboardRejectedTableApi.data.message
      : null;

  const dropdownUrl = API_END_POINTS?.vendorRegistrationDropdown;
  const dropDownApi: AxiosResponse<TvendorRegistrationDropdown> = await requestWrapper({
    url: dropdownUrl,
    method: "GET",
  });

  const dropdownData =
    dropDownApi?.status === 200 ? dropDownApi?.data?.message?.data : null;
  const companyDropdown = dropdownData?.company_master ?? [];


  return (
    <div className="p-4">
      <QADashboardCardCounter
        companyDropdown={companyDropdown}
        cardData={CardData}
        dashboardFilledQMSTableData={dashboardFilledQMSTableData}
        dashboardPendingTableData={dashboardPendingTableData}
        dashboardApprovedTableData={dashboardApprovedTableData}
        dashboardRejectedTableData={dashboardRejectedTableData}
      />
    </div>
  );
};

export default QADashboard;
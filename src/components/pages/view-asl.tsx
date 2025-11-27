import React from "react";
// import ASLTable from "@/src/components/molecules/view-asl-table";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { TvendorRegistrationDropdown } from "@/src/types/types";
import { TotalQMSOnboardingResponse, PendingQMSOnboardingResponse, ApprovedSupplierQMSResponse, RejectedSupplierQMSResponse, FullyFilledSupplierQMSResponse, BaseQMSResponse } from "@/src/types/QAdashboardtypes";
import { cookies } from "next/headers";

const AllQMSForm = async () => {
  const cookieStore = await cookies();
  const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");


  const dashboardApprovedTableApi: AxiosResponse<ApprovedSupplierQMSResponse> =
    await requestWrapper({
      url: `${API_END_POINTS?.ApprovedQMSDocs}`,
      method: "GET",
      headers: { cookie: cookieHeaderString },
    });
  const dashboardApprovedTableData: ApprovedSupplierQMSResponse["message"] | null =
    dashboardApprovedTableApi?.status === 200
      ? dashboardApprovedTableApi.data.message
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
      {/* <ASLTable /> */}
    </div>
  );
};

export default AllQMSForm;
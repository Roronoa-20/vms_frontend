import { cookies } from "next/headers";
import ViewPRTable from "@/src/components/templates/ViewPRTable";
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import { TvendorRegistrationDropdown } from "@/src/types/types";

export default async function ViewPurchaseRequisitionPage() {

  const cookieStore = await cookies();
  const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");

  const dropdownUrl = API_END_POINTS.vendorRegistrationDropdown;
  const dropDownApi: AxiosResponse = await requestWrapper({
    url: dropdownUrl,
    method: "GET",
    headers: {
      cookie: cookieHeaderString,
    },
  });

  const dropdownData: TvendorRegistrationDropdown["message"]["data"] =
    dropDownApi?.status === 200 ? dropDownApi?.data?.message?.data : "";

  const companyDropdown = dropdownData?.company_master || [];

  const prResponse = await requestWrapper({
    url: `${API_END_POINTS.sapprcreated}`,
    method: "GET",
    headers: {
      cookie: cookieHeaderString,
    },
  });

  const msg = prResponse?.status === 200 ? prResponse?.data?.message : {};
  const prData = msg?.data || [];

  return (
    <div className="p-4">
      <ViewPRTable
        data={prData}
        loading={false}
        companyDropdown={companyDropdown}
      />
    </div>
  );
}
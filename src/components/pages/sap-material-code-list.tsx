import { cookies } from "next/headers";
import ViewSAPMaterialCodeTable from "@/src/components/templates/SAPMaterialCodeTable";
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import { TvendorRegistrationDropdown } from "@/src/types/types";

export default async function SAPMaterialCodeView() {

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

  const MaterialCodeResponse = await requestWrapper({
    url: `${API_END_POINTS.MaterialCodeSearchApi}`,
    method: "GET",
    headers: {
      cookie: cookieHeaderString,
    },
  });
  console.log("Material Code response----->",MaterialCodeResponse)
  const msg = MaterialCodeResponse?.status === 200 ? MaterialCodeResponse?.data?.message : {};
  const MaterialCodeData = msg?.data || [];

  return (
    <div className="p-4">
      <ViewSAPMaterialCodeTable
        data={MaterialCodeData}
        loading={false}
        companyDropdown={companyDropdown}
      />
    </div>
  );
}
import { cookies } from "next/headers";
import ViewSAPMaterialCodeTable from "@/src/components/templates/SAPMaterialCodeTable";
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import { TvendorRegistrationDropdown } from "@/src/types/types";

export default async function SAPMaterialCodeView() {

  const cookieStore = await cookies();
  const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");
  const userEmail = cookieStore.get("user_id")?.value

  let companyCodes: string[] = [];
  let isMaterialUser = false;

  if (userEmail) {
    const employeeRes: AxiosResponse = await requestWrapper({
      url: API_END_POINTS.getEmployeeDetails,
      method: "GET",
      params: { user: userEmail },
      headers: {
        cookie: cookieHeaderString,
      },
    });
    console.log("Employee API response for Material Code List---->", employeeRes);

    if (employeeRes?.status === 200 && employeeRes?.data?.message?.message === "Success") {
      const employee = employeeRes.data.message.data;

      isMaterialUser = employee?.designation === "Material User";

      if (isMaterialUser && Array.isArray(employee?.company)) {
        companyCodes = employee.company
          .map((c: any) => c.company_code)
          .filter(Boolean);
      }
    }
  }

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

  let materialFilters = {};

  if (isMaterialUser && companyCodes.length > 0) {
    materialFilters = {
      company: ["in", companyCodes],
    };
  }

  const MaterialCodeResponse = await requestWrapper({
    url: API_END_POINTS.MaterialCodeSearchApi,
    method: "GET",
    params: Object.keys(materialFilters).length ? { filters: JSON.stringify(materialFilters) } : {},
    headers: {
      cookie: cookieHeaderString,
    },
  });
  console.log("Material Code response----->", MaterialCodeResponse)
  const msg = MaterialCodeResponse?.status === 200 ? MaterialCodeResponse?.data?.message : {};
  const MaterialCodeData = msg?.data || [];

  return (
    <div className="p-4">
      <ViewSAPMaterialCodeTable
        data={MaterialCodeData}
        loading={false}
        companyDropdown={companyDropdown}
        allowedCompanyCodes={companyCodes}
        isMaterialUser={isMaterialUser}
      />
    </div>
  );
}
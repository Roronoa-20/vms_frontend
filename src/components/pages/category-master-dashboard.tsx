import React from "react";
import CategoryDashboardCardCounter from "../molecules/Category-Dashboard-Card-Count ";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import { CategoryPRCount, TvendorRegistrationDropdown, PurchaseRequisition } from "@/src/types/types";
import { cookies } from "next/headers";

const Dashboard = async () => {
  const cookieStore = await cookies();
  const user = cookieStore.get("user_id")?.value
  console.log(user, "user")
  const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");

  //card data
  const dashboardCardApi: AxiosResponse = await requestWrapper({
    url: `${API_END_POINTS?.CategoryMasterDashboardAPI}?usr=${user}`,
    method: "GET",
    headers: { cookie: cookieHeaderString }
  });
  const CardData = dashboardCardApi?.status == 200 ? dashboardCardApi?.data?.message : "";
  
  const UserCategory = CardData.assigned_categories || "";
  const categoryType = UserCategory.join(",");

  const dropdownUrl = API_END_POINTS?.vendorRegistrationDropdown;
  const dropDownApi: AxiosResponse = await requestWrapper({
    url: dropdownUrl,
    method: "GET",
    headers: { cookie: cookieHeaderString }
  });
  const dropdownData: TvendorRegistrationDropdown["message"]["data"] = dropDownApi?.status == 200 ? dropDownApi?.data?.message?.data : "";
  const companyDropdown = dropdownData?.company_master

  const prDashboardUrl = `${API_END_POINTS?.prTableData}?category_type=${encodeURIComponent(categoryType)}`;
  const prApi: AxiosResponse = await requestWrapper({
    url: prDashboardUrl,
    method: "GET",
    headers: { cookie: cookieHeaderString }
  });
  const prCount: CategoryPRCount = prApi?.status == 200 ? prApi?.data?.message : "";
  const prData: PurchaseRequisition[] = prApi?.status == 200 ? prApi?.data?.message?.data : "";


  return (
    <div className="p-4">
      {/* Cards */}
      <CategoryDashboardCardCounter
        cardData={CardData}
        companyDropdown={companyDropdown}
        prData={prData}
        prcount={prCount}
        UserCategory={UserCategory}
      />
    </div>
  );
};

export default Dashboard;

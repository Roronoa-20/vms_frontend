// src/services/dashboardData.ts
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import {
  DashboardPOTableData,
  dashboardCardData,
  DashboardTableType,
  TvendorRegistrationDropdown,
  TuserRegistrationDropdown,
  TPRInquiryTable,
  PurchaseRequisition,
  RFQTable,
} from "@/src/types/types";
import { cookies } from "next/headers";

async function getUserAndCookieHeader() {
  const cookieStore = await cookies();
  const user = cookieStore.get("user_id")?.value ?? "";
  const cookieHeaderString = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  return { user, cookieHeaderString };
}

async function getMessage<T>(url: string, cookie: string): Promise<T> {
  const res = await requestWrapper({
    url,
    method: "GET",
    headers: { cookie },
  });

  if(res.status !== 200){
    // console.error(res?.data);
    console.log(res?.data)
  }

  return res.data?.message as T
}

export async function fetchDashboardData() {
  const { user, cookieHeaderString } = await getUserAndCookieHeader();

  // --- build URLs once ---
  const cardUrl = `${API_END_POINTS.dashboardCardURL}?usr=${user}`;
  const poUrl = API_END_POINTS.poTable;
  const totalVendorUrl = `${API_END_POINTS.dashboardTotalVendorTableURL}?usr=${user}`;
  const pendingVendorUrl = `${API_END_POINTS.dashboardPendingVendorTableURL}?usr=${user}`;
  const approvedVendorUrl = `${API_END_POINTS.dashboardApprovedVendorTableURL}?usr=${user}`;
  const rejectedVendorUrl = `${API_END_POINTS.dashboardRejectedVendorTableURL}?usr=${user}`;

  const vendorDropdownUrl = API_END_POINTS.vendorRegistrationDropdown;
  const userDropdownUrl = API_END_POINTS.UserRegistrationDropdown;

  const prInquiryUrl = API_END_POINTS.prInquiryDashboardTable;
  const prUrl = API_END_POINTS.prTableData;
  const rfqUrl = API_END_POINTS.rfqTableData;

  const asaVendorListUrl = API_END_POINTS.asavendorListdashboard;
  const asaPendingVendorUrl = API_END_POINTS.asapendingVendorList;
  const asaOnboardedVendorUrl = API_END_POINTS.asaonboardedvendorlist;

  const sapErrorUrl = API_END_POINTS.sapApiDashboardDetails;

  const accountsPendingUrl = API_END_POINTS.dashboardPendingVendorsAccounts;
  const accountsOnboardedUrl = API_END_POINTS.dashboardOnboardedVendorsAccounts;
  const accountsRejectedUrl = API_END_POINTS.dashboardRejectedVendorsAccounts;
  const accountsSapErrorUrl = API_END_POINTS.dashboardSapErrorAcounts;

  // --- run EVERYTHING in parallel ---
  const [
    cardData,
    poTableData,
    totalVendorTable,
    pendingVendorTable,
    approvedVendorTable,
    rejectedVendorTable,
    vendorDropdown,
    userDropdown,
    prInquiryData,
    prApiRes,
    rfqData,
    asaFormData,
    asaPendingList,
    asaOnboardedList,
    sapErrorDashboardDataRes,
    accountsPending,
    accountsOnboarded,
    accountsRejected,
    accountsSapErrors,
  ] = await Promise.all([
    getMessage<dashboardCardData>(cardUrl, cookieHeaderString),
    getMessage<DashboardPOTableData["message"]>(poUrl, cookieHeaderString),
    getMessage<DashboardTableType>(totalVendorUrl, cookieHeaderString),
    getMessage<DashboardTableType>(pendingVendorUrl, cookieHeaderString),
    getMessage<DashboardTableType>(approvedVendorUrl, cookieHeaderString),
    getMessage<DashboardTableType["rejected_vendor_onboarding"]>(
      rejectedVendorUrl,
      cookieHeaderString
    ),
    getMessage<TvendorRegistrationDropdown["message"]>(
      vendorDropdownUrl,
      cookieHeaderString
    ),
    getMessage<TuserRegistrationDropdown["message"]>(
      userDropdownUrl,
      cookieHeaderString
    ),
    getMessage<TPRInquiryTable>(prInquiryUrl, cookieHeaderString),
    // pr & rfq have slightly different shapes, so call raw and handle below
    requestWrapper({
      url: prUrl,
      method: "GET",
      headers: { cookie: cookieHeaderString },
    }),
    getMessage<RFQTable>(rfqUrl, cookieHeaderString),
    getMessage<DashboardTableType["asa_form_data"]>(
      asaVendorListUrl,
      cookieHeaderString
    ),
    getMessage<DashboardTableType["asa_form_data"]>(
      asaPendingVendorUrl,
      cookieHeaderString
    ),
    getMessage<DashboardTableType["asa_form_data"]>(
      asaOnboardedVendorUrl,
      cookieHeaderString
    ),
    requestWrapper({
      url: sapErrorUrl,
      method: "GET",
      headers: { cookie: cookieHeaderString },
    }),
    getMessage(API_END_POINTS.dashboardPendingVendorsAccounts, cookieHeaderString),
    getMessage(API_END_POINTS.dashboardOnboardedVendorsAccounts, cookieHeaderString),
    getMessage(API_END_POINTS.dashboardRejectedVendorsAccounts, cookieHeaderString),
    getMessage(API_END_POINTS.dashboardSapErrorAcounts, cookieHeaderString),
  ]);

  const prData: PurchaseRequisition[] =
    prApiRes?.status === 200 ? prApiRes.data?.message?.data : "";

  const sapErrorDashboardData =
    sapErrorDashboardDataRes?.status === 200
      ? sapErrorDashboardDataRes.data?.message?.sap_error_vendor_onboarding
      : "";

  const companyDropdown =  vendorDropdown.data?.company_master ;
  const filterregisteredby = userDropdown.data?.users_list;

  return {
    cardData,
    poTableData,
    totalVendorTable,
    pendingVendorTable,
    approvedVendorTable,
    rejectedVendorTable,
    companyDropdown,
    filterregisteredby,
    prInquiryData,
    prData,
    rfqData,
    asaFormData,
    asaPendingList,
    asaOnboardedList,
    sapErrorDashboardData,
    accountsPending,
    accountsOnboarded,
    accountsRejected,
    accountsSapErrors,
  };
}

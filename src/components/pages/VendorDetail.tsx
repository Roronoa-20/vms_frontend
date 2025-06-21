import React from "react";
import CompanyDetailForm from "../templates/vendor-detail-form/CompanyDetails";
import VMSLogo from "../atoms/vms-logo";
import CompanyAddress from "../templates/vendor-detail-form/CompanyAddress";
import DocumentDetails from "../templates/vendor-detail-form/DocumentDetails";
import OnboardingSidebar from "../molecules/OnboardingSidebar";
import PaymentDetail from "../templates/vendor-detail-form/PaymentDetail";
import ContactDetail from "../templates/vendor-detail-form/ContactDetail";
import ManufacturingDetail from "../templates/vendor-detail-form/ManufacturingDetail";
import EmployeeDetail from "../templates/vendor-detail-form/EmployeeDetail";
import MachineryDetail from "../templates/vendor-detail-form/MachineryDetail";
import TestingFacility from "../templates/vendor-detail-form/TestingFacility";
import ReputedPartners from "../templates/vendor-detail-form/ReputedPartners";
import Certificate from "../templates/vendor-detail-form/Certificate";
import { cookies } from "next/headers";
import {
  TbankNameDropdown,
  TcertificateCodeDropdown,
  TCompanyAddressDropdown,
  TcompanyDetailDropdown,
  TCurrencyDropdown,
  TdocumentDetailDropdown,
  TvendorOnboardingDetail,
  VendorOnboardingResponse,

} from "@/src/types/types";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import { AuthProvider, useAuth } from "@/src/context/AuthContext";

interface Props {
  vendor_onboarding: string;
  tabtype: string;
  refno: string;
}

const VendorDetail = async ({ vendor_onboarding, tabtype, refno }: Props) => {
  const cookie = await cookies()
  const cookieStore = await cookies();
  const user = cookie.get("user_id")?.value
  const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");

  const vendorOnboardingRefno = vendor_onboarding;
  const tabType = tabtype;

  const companyDetailDropdownUrl = API_END_POINTS?.companyDetailDropdown;
  const companyDetailresponse: AxiosResponse = await requestWrapper({
    url: `${companyDetailDropdownUrl}`,
    method: "GET",
  });
  const companyDetailDropdown: TcompanyDetailDropdown["message"]["data"] =
    companyDetailresponse?.status == 200
      ? companyDetailresponse?.data?.message?.data
      : "";

  const companyAddressDropdownUrl = API_END_POINTS?.companyAddressDropdown;
  const companyAddressDropdownResponse:AxiosResponse = await requestWrapper({
    url:`${companyAddressDropdownUrl}`,
    method:"GET"
  })
  const companyAddressDropdown:TCompanyAddressDropdown["message"]["data"] = companyAddressDropdownResponse?.status == 200 ? companyAddressDropdownResponse?.data?.message?.data:"";

  const certificateUrl = API_END_POINTS?.certifcateCodeDropdown;
  const certificateResponse:AxiosResponse = await requestWrapper({
    url:certificateUrl,
    method:"GET"
  })
  const certificateCodeDropdown:TcertificateCodeDropdown["message"]["data"] = certificateResponse?.status == 200?certificateResponse?.data?.message?.data : "";

  const gst_vendor_type_dropdown_url =API_END_POINTS?.documentDetail_dropdown;
  const documentDetailDropdownApi:AxiosResponse = await requestWrapper({url:gst_vendor_type_dropdown_url,method:"GET"});
  const documentDetailDropdown:TdocumentDetailDropdown["message"]["data"] =  documentDetailDropdownApi?.status == 200?documentDetailDropdownApi?.data?.message?.data:"";

  const fetchOnboardingDetailUrl = `${API_END_POINTS?.fetchDetails}?ref_no=${refno}&vendor_onboarding=${vendorOnboardingRefno}`;
  const fetchOnboardingDetailResponse:AxiosResponse = await requestWrapper({url:fetchOnboardingDetailUrl,method:"GET"});
  const OnboardingDetail:VendorOnboardingResponse["message"] = fetchOnboardingDetailResponse?.status == 200 ?fetchOnboardingDetailResponse?.data?.message : "";
  console.log(OnboardingDetail?.manufacturing_details_tab?.materials_supplied?.[0],"this is data")
  return (
    <AuthProvider>

    <div className="h-screen flex flex-col bg-gray-200 relative">
      {/* navbar */}
      <div className="bg-white py-4 px-10 flex gap-5 items-center mb-6 sticky top-0">
        <div className="w-6">
          <VMSLogo />
        </div>
        <h1 className="text-[24px] font-semibold">Vendor Onboarding</h1>
      </div>
      <div className="flex px-10 justify-between gap-5">
        {/* sidebar */}
        <OnboardingSidebar onboarding_refno={vendorOnboardingRefno} refno={refno} />
        {/* form */}
        {tabType == "Company Detail" ? (
          <CompanyDetailForm
          companyDetailDropdown={companyDetailDropdown}
          onboarding_refno={vendorOnboardingRefno}
          refno={refno}
          OnboardingDetail={OnboardingDetail?.company_details_tab}
          multipleCompany={OnboardingDetail?.multi_company_data}
          ismulticompany={OnboardingDetail?.is_multi_company}
          />
        ) : tabType == "Company Address" ? (
          <CompanyAddress companyAddressDropdown={companyAddressDropdown} ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.company_address_tab}/>
        ) : tabType == "Document Detail" ? (
          <DocumentDetails ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.document_details_tab} documentDetailDropdown={documentDetailDropdown} />
        ) : tabType?.includes("Payment Detail") ? ( 
          <PaymentDetail ref_no={refno} company_name={OnboardingDetail?.company_details_tab?.company_name} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.payment_details_tab}/>
        ) : tabType?.includes("Contact Detail") ? (
          <ContactDetail ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.contact_details_tab}/>
        ) : tabType == "Manufacturing Detail" ? (
          <ManufacturingDetail ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.manufacturing_details_tab}/>
        ) : tabType == "Employee Detail" ? (
          <EmployeeDetail ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.employee_details_tab}/>
        ) : tabType == "Machinery Detail" ? (
          <MachineryDetail ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.machinery_details_tab}/>
        ) : tabType == "Testing Facility" ? (
          <TestingFacility ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.testing_details_tab}/>
        ) : tabType == "Reputed Partners" ? (
          <ReputedPartners ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.reputed_partners_details_tab}/>
        ) : tabType == "Certificate" ? (
          <Certificate certificateCodeDropdown={certificateCodeDropdown?.certificate_names} ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.certificate_details_tab}/>
        ) : (
          ""
        )}
      </div>
    </div>
        </AuthProvider>
  );
};

export default VendorDetail;

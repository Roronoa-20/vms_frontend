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
import {
  TCompanyAddressDropdown,
  TcompanyDetailDropdown,
  TvendorOnboardingDetail,
} from "@/src/types/types";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";

interface Props {
  vendor_onboarding: string;
  tabtype: string;
  refno: string;
}

const VendorDetail = async ({ vendor_onboarding, tabtype, refno }: Props) => {
  const vendorOnboardingRefno = vendor_onboarding;
  const tabType = tabtype;
  const onboardingDetailUrl = API_END_POINTS?.vendorOnboardingDetail;
  const response: AxiosResponse = await requestWrapper({
    url: `${onboardingDetailUrl}?vendor_onboarding=${vendorOnboardingRefno}`,
    method: "GET",
  });
  const Data: TvendorOnboardingDetail["message"]["data"] =
    response?.status == 200 ? response?.data?.message?.data : "";

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
  console.log(Data,"this is dropdwon")
  return (
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
            vendor_master={Data?.vendor_master}
            vendor_onboarding={Data?.vendor_onboarding}
            companyDetailDropdown={companyDetailDropdown}
            onboarding_refno={vendorOnboardingRefno}
            vendor_company_details={Data?.vendor_company_details}
            refno={refno}
          />
        ) : tabType == "Company Address" ? (
          <CompanyAddress companyAddressDropdown={companyAddressDropdown} ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} onboarding_data={Data}/>
        ) : tabType == "Document Detail" ? (
          <DocumentDetails />
        ) : tabType?.includes("Payment Detail") ? (
          <PaymentDetail />
        ) : tabType?.includes("Contact Detail") ? (
          <ContactDetail ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} />
        ) : tabType == "Manufacturing Detail" ? (
          <ManufacturingDetail ref_no={refno} onboarding_ref_no={vendorOnboardingRefno}/>
        ) : tabType == "Employee Detail" ? (
          <EmployeeDetail ref_no={refno} onboarding_ref_no={vendorOnboardingRefno}/>
        ) : tabType == "Machinery Detail" ? (
          <MachineryDetail ref_no={refno} onboarding_ref_no={vendorOnboardingRefno}/>
        ) : tabType == "Testing Facility" ? (
          <TestingFacility ref_no={refno} onboarding_ref_no={vendorOnboardingRefno}/>
        ) : tabType == "Reputed Partners" ? (
          <ReputedPartners ref_no={refno} onboarding_ref_no={vendorOnboardingRefno}/>
        ) : tabType == "Certificate" ? (
          <Certificate />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default VendorDetail;

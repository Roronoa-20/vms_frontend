"use client";

import React, { useEffect, useState } from "react";
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
  TbankNameDropdown,
  TcertificateCodeDropdown,
  TCompanyAddressDropdown,
  TcompanyDetailDropdown,
  TCurrencyDropdown,
  TdocumentDetailDropdown,
  VendorOnboardingResponse,
} from "@/src/types/types";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import { AuthProvider } from "@/src/context/AuthContext";
import InternationalDocumentDetails from "../templates/vendor-detail-form/InternationalDocumentDetails";
import InternationalPaymentDetail from "../templates/vendor-detail-form/InternationalPaymentDetail";
import { Button } from "../atoms/button";
import { RotateCcw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


interface Props {
  vendor_onboarding: string;
  tabtype: string;
  refno: string;
  company: string;
  onChangeCompany: () => void;
}

const ViewProfile = ({ vendor_onboarding, tabtype, refno, company, onChangeCompany }: Props) => {
  const [loading, setLoading] = useState(true);

  const [companyDetailDropdown, setCompanyDetailDropdown] =
    useState<TcompanyDetailDropdown["message"]["data"]>({
      type_of_business: [],
      company_nature_master: [],
      business_nature_master: [],
    });
  const [companyAddressDropdown, setCompanyAddressDropdown] =
    useState<TCompanyAddressDropdown["message"]["data"]>({
      city_master: [],
      district_master: [],
      state_master: [],
      country_master: [],
    });
  const [certificateCodeDropdown, setCertificateCodeDropdown] =
    useState<TcertificateCodeDropdown["message"]["data"]>({
      certificate_names: [],
    });
  const [documentDetailDropdown, setDocumentDetailDropdown] =
    useState<TdocumentDetailDropdown["message"]["data"]>({
      gst_vendor_type: [],
      state_master: [],
    });
  const [onboardingDetail, setOnboardingDetail] =
    useState<VendorOnboardingResponse["message"] | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // company detail
        const companyDetailresponse: AxiosResponse = await requestWrapper({
          url: API_END_POINTS?.companyDetailDropdown,
          method: "GET",
        });
        setCompanyDetailDropdown(
          companyDetailresponse?.status == 200
            ? companyDetailresponse?.data?.message?.data
            : []
        );

        // company address
        const companyAddressDropdownResponse: AxiosResponse =
          await requestWrapper({
            url: API_END_POINTS?.companyAddressDropdown,
            method: "GET",
          });
        setCompanyAddressDropdown(
          companyAddressDropdownResponse?.status == 200
            ? companyAddressDropdownResponse?.data?.message?.data
            : []
        );

        // certificate
        const certificateResponse: AxiosResponse = await requestWrapper({
          url: API_END_POINTS?.certifcateCodeDropdown,
          method: "GET",
        });
        setCertificateCodeDropdown(
          certificateResponse?.status == 200
            ? certificateResponse?.data?.message?.data
            : []
        );

        // document details
        const documentDetailDropdownApi: AxiosResponse =
          await requestWrapper({
            url: API_END_POINTS?.documentDetail_dropdown,
            method: "GET",
          });
        setDocumentDetailDropdown(
          documentDetailDropdownApi?.status == 200
            ? documentDetailDropdownApi?.data?.message?.data
            : []
        );

        // onboarding detail
        const fetchOnboardingDetailUrl = `${API_END_POINTS?.fetchDetails}?ref_no=${refno}&vendor_onboarding=${vendor_onboarding}`;
        const fetchOnboardingDetailResponse: AxiosResponse =
          await requestWrapper({ url: fetchOnboardingDetailUrl, method: "GET" });
        setOnboardingDetail(
          fetchOnboardingDetailResponse?.status == 200
            ? fetchOnboardingDetailResponse?.data?.message
            : null
        );
      } catch (err) {
        console.error("Error fetching data in ViewProfile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [refno, vendor_onboarding]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">Loading...</div>
    );
  }

  if (!onboardingDetail) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Failed to load onboarding details
      </div>
    );
  }

  const tabType = tabtype || "Company Detail";

  return (
    <AuthProvider>
      <div className="h-screen flex flex-col bg-gray-200 relative">
        <div className="flex px-4 gap-5 pt-5">
          {/* Sidebar column */}
          <div className="flex flex-col items-start relative">
            {/* Onboarding Sidebar */}
            <OnboardingSidebar
              onboarding_refno={vendor_onboarding}
              refno={refno}
            />

            {/* Change Company Icon with Tooltip - outside & sticky */}
            <div className="mt-6 flex justify-center w-full relative">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={onChangeCompany}
                      className="p-3 rounded-full border border-red-400 bg-red-50 text-red-600 
                       hover:bg-red-100 hover:text-red-700 transition shadow-md"
                    >
                      <RotateCcw className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="text-sm">
                    Change Company
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1">
            {tabType == "Company Detail" ? (
              <CompanyDetailForm
                companyDetailDropdown={companyDetailDropdown}
                onboarding_refno={vendor_onboarding}
                refno={refno}
                OnboardingDetail={onboardingDetail?.company_details_tab}
                multipleCompany={onboardingDetail?.multi_company_data}
                ismulticompany={onboardingDetail?.is_multi_company}
              />
            ) : tabType == "Company Address" ? (
              <CompanyAddress
                companyAddressDropdown={companyAddressDropdown}
                ref_no={refno}
                onboarding_ref_no={vendor_onboarding}
                OnboardingDetail={onboardingDetail?.company_address_tab}
              />
            ) : tabType == "Document Detail" ? (
              <DocumentDetails
                ref_no={refno}
                onboarding_ref_no={vendor_onboarding}
                OnboardingDetail={onboardingDetail?.document_details_tab}
                documentDetailDropdown={documentDetailDropdown}
              />
            ) : tabType?.includes("Payment Detail") &&
              onboardingDetail?.payment_details_tab?.address?.country !== "India" ? (
              <InternationalPaymentDetail
                ref_no={refno}
                company_name={onboardingDetail?.company_details_tab?.company_name}
                onboarding_ref_no={vendor_onboarding}
                OnboardingDetail={onboardingDetail?.payment_details_tab}
              />
            ) : tabType?.includes("Payment Detail") ? (
              <PaymentDetail
                ref_no={refno}
                company_name={onboardingDetail?.company_details_tab?.company_name}
                onboarding_ref_no={vendor_onboarding}
                OnboardingDetail={onboardingDetail?.payment_details_tab}
              />
            ) : tabType?.includes("Contact Detail") ? (
              <ContactDetail
                ref_no={refno}
                onboarding_ref_no={vendor_onboarding}
                OnboardingDetail={onboardingDetail?.contact_details_tab}
              />
            ) : tabType == "Manufacturing Detail" ? (
              <ManufacturingDetail
                ref_no={refno}
                onboarding_ref_no={vendor_onboarding}
                OnboardingDetail={onboardingDetail?.manufacturing_details_tab}
              />
            ) : tabType == "Employee Detail" ? (
              <EmployeeDetail
                ref_no={refno}
                onboarding_ref_no={vendor_onboarding}
                OnboardingDetail={onboardingDetail?.employee_details_tab}
              />
            ) : tabType == "Machinery Detail" ? (
              <MachineryDetail
                ref_no={refno}
                onboarding_ref_no={vendor_onboarding}
                OnboardingDetail={onboardingDetail?.machinery_details_tab}
              />
            ) : tabType == "Testing Facility" ? (
              <TestingFacility
                ref_no={refno}
                onboarding_ref_no={vendor_onboarding}
                OnboardingDetail={onboardingDetail?.testing_details_tab}
              />
            ) : tabType == "Reputed Partners" ? (
              <ReputedPartners
                ref_no={refno}
                onboarding_ref_no={vendor_onboarding}
                OnboardingDetail={onboardingDetail?.reputed_partners_details_tab}
              />
            ) : tabType == "Certificate" ? (
              <Certificate
                certificateCodeDropdown={certificateCodeDropdown?.certificate_names}
                ref_no={refno}
                onboarding_ref_no={vendor_onboarding}
                OnboardingDetail={onboardingDetail?.certificate_details_tab}
              />
            ) : null}
          </div>
        </div>
      </div>
    </AuthProvider >
  );
};

export default ViewProfile;

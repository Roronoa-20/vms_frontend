"use client";

import React, { useEffect, useState } from "react";
import CompanyDetailForm from "../templates/vendor-profile-tabs/CompanyDetails";
import CompanyAddress from "../templates/vendor-profile-tabs/CompanyAddress";
import DocumentDetails from "../templates/vendor-profile-tabs/DocumentDetails";
import OnboardingSidebar from "../molecules/OnboardingSidebar";
import PaymentDetail from "../templates/vendor-profile-tabs/PaymentDetail";
import ContactDetail from "../templates/vendor-profile-tabs/ContactDetail";
import ManufacturingDetail from "../templates/vendor-profile-tabs/ManufacturingDetail";
import EmployeeDetail from "../templates/vendor-profile-tabs/EmployeeDetail";
import MachineryDetail from "../templates/vendor-profile-tabs/MachineryDetail";
import TestingFacility from "../templates/vendor-profile-tabs/TestingFacility";
import ReputedPartners from "../templates/vendor-profile-tabs/ReputedPartners";
import Certificate from "../templates/vendor-profile-tabs/Certificate";
import { TcertificateCodeDropdown, TCompanyAddressDropdown, TcompanyDetailDropdown, TdocumentDetailDropdown, VendorOnboardingResponse } from "@/src/types/types";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import { AuthProvider } from "@/src/context/AuthContext";
import InternationalDocumentDetails from "../templates/vendor-profile-tabs/InternationalDocumentDetails";
import InternationalPaymentDetail from "../templates/vendor-profile-tabs/InternationalPaymentDetail";
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
  const [activeTab, setActiveTab] = useState(tabtype || "Company Detail");
  const [loading, setLoading] = useState(true);
  const [companyDetailDropdown, setCompanyDetailDropdown] = useState<TcompanyDetailDropdown["message"]["data"]>({
    type_of_business: [],
    company_nature_master: [],
    business_nature_master: [],
  });
  const [companyAddressDropdown, setCompanyAddressDropdown] = useState<TCompanyAddressDropdown["message"]["data"]>({
    city_master: [],
    district_master: [],
    state_master: [],
    country_master: [],
  });
  const [certificateCodeDropdown, setCertificateCodeDropdown] = useState<TcertificateCodeDropdown["message"]["data"]>({
    certificate_names: [],
  });
  const [documentDetailDropdown, setDocumentDetailDropdown] = useState<TdocumentDetailDropdown["message"]["data"]>({
    gst_vendor_type: [],
    state_master: [],
  });
  const [onboardingDetail, setOnboardingDetail] = useState<VendorOnboardingResponse["message"] | null>(null);

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

  return (
    <AuthProvider>
      <div className="h-screen flex flex-col bg-gray-200 relative">
        <div className="flex px-4 gap-5 pt-5">
          <div className="flex flex-col items-start relative">
            <OnboardingSidebar
            nature_of_business=""
              onboarding_refno={vendor_onboarding}
              refno={refno}
            />

            <div className="mt-2 w-full relative">
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

          <div className="flex-1">
            {activeTab == "Company Detail" ? (
              <CompanyDetailForm
                companyDetailDropdown={companyDetailDropdown}
                onboarding_refno={vendor_onboarding}
                refno={refno}
                OnboardingDetail={onboardingDetail?.company_details_tab}
                multipleCompany={onboardingDetail?.multi_company_data}
                ismulticompany={onboardingDetail?.is_multi_company}
                onNextTab={() => setActiveTab("Company Address")}
              />
            ) : activeTab == "Company Address" ? (
              <CompanyAddress
                companyAddressDropdown={companyAddressDropdown}
                ref_no={refno}
                onboarding_ref_no={vendor_onboarding}
                OnboardingDetail={onboardingDetail?.company_address_tab}
                onNextTab={() => setActiveTab("Document Detail")}
                onBackTab={() => setActiveTab("Company Detail")}

              />
            ) : activeTab?.includes("Document Detail") &&
              onboardingDetail?.payment_details_tab?.address?.country !== "India" ? (
              <InternationalDocumentDetails
                ref_no={refno}
                onboarding_ref_no={vendor_onboarding}
                company_name={onboardingDetail?.company_details_tab?.company_name}
                OnboardingDetail={onboardingDetail?.document_details_tab}
                documentDetailDropdown={documentDetailDropdown}
                onNextTab={() => setActiveTab("Payment Detail")}
                onBackTab={() => setActiveTab("Company Address")}
              />
            ) : activeTab == "Document Detail" ? (
              <DocumentDetails
                ref_no={refno}
                onboarding_ref_no={vendor_onboarding}
                OnboardingDetail={onboardingDetail?.document_details_tab}
                documentDetailDropdown={documentDetailDropdown}
                onNextTab={() => setActiveTab("Payment Detail")}
                onBackTab={() => setActiveTab("Company Address")}
              />
            ) : activeTab?.includes("Payment Detail") &&
              onboardingDetail?.payment_details_tab?.address?.country !== "India" ? (
              <InternationalPaymentDetail
                ref_no={refno}
                company_name={onboardingDetail?.company_details_tab?.company_name}
                onboarding_ref_no={vendor_onboarding}
                OnboardingDetail={onboardingDetail?.payment_details_tab}
                onNextTab={() => setActiveTab("Contact Detail")}
                onBackTab={() => setActiveTab("Payment Detail")}
              />
            ) : activeTab?.includes("Payment Detail") ? (
              <PaymentDetail
                ref_no={refno}
                company_name={onboardingDetail?.company_details_tab?.company_name}
                onboarding_ref_no={vendor_onboarding}
                OnboardingDetail={onboardingDetail?.payment_details_tab}
                onNextTab={() => setActiveTab("Contact Detail")}
                onBackTab={() => setActiveTab("Payment Detail")}
              />
            ) : activeTab?.includes("Contact Detail") ? (
              <ContactDetail
                ref_no={refno}
                onboarding_ref_no={vendor_onboarding}
                OnboardingDetail={onboardingDetail?.contact_details_tab}
                onNextTab={() => setActiveTab("Manufacturing Detail")}
                onBackTab={() => setActiveTab("Payment Detail")}
              />
            ) : activeTab == "Manufacturing Detail" ? (
              <ManufacturingDetail
                ref_no={refno}
                onboarding_ref_no={vendor_onboarding}
                OnboardingDetail={onboardingDetail?.manufacturing_details_tab}
                onNextTab={() => setActiveTab("Employee Detail")}
                onBackTab={() => setActiveTab("Contact Detail")}
              />
            ) : activeTab == "Employee Detail" ? (
              <EmployeeDetail
                ref_no={refno}
                onboarding_ref_no={vendor_onboarding}
                OnboardingDetail={onboardingDetail?.employee_details_tab}
                onNextTab={() => setActiveTab("Testing Facility")}
                onBackTab={() => setActiveTab("Manufacturing Detail")}
              />
            ) : activeTab == "Machinery Detail" ? (
              <MachineryDetail
                ref_no={refno}
                onboarding_ref_no={vendor_onboarding}
                OnboardingDetail={onboardingDetail?.machinery_details_tab}
                onNextTab={() => setActiveTab("Testing Facility")}
                onBackTab={() => setActiveTab("Employee Detail")}
              />
            ) : activeTab == "Testing Facility" ? (
              <TestingFacility
                ref_no={refno}
                onboarding_ref_no={vendor_onboarding}
                OnboardingDetail={onboardingDetail?.testing_details_tab}
                onNextTab={() => setActiveTab("Reputed Partners")}
                onBackTab={() => setActiveTab("Machinery Detail")}
                
              />
            ) : activeTab == "Reputed Partners" ? (
              <ReputedPartners
                ref_no={refno}
                onboarding_ref_no={vendor_onboarding}
                OnboardingDetail={onboardingDetail?.reputed_partners_details_tab}
                onNextTab={() => setActiveTab("Certificate")}
                onBackTab={() => setActiveTab("Testing Facility")}
              />
            ) : activeTab == "Certificate" ? (
              <Certificate
                certificateCodeDropdown={certificateCodeDropdown?.certificate_names}
                ref_no={refno}
                onboarding_ref_no={vendor_onboarding}
                OnboardingDetail={onboardingDetail?.certificate_details_tab}
                // onNextTab={() => setActiveTab("Document Detail")}
                onBackTab={() => setActiveTab("Reputed Partners")}
              />
            ) : null}
          </div>
        </div>
      </div>
    </AuthProvider >
  );
};

export default ViewProfile;

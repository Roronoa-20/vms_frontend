"use client";
import React from "react";
import CompanyDetailForm from "../templates/vendor-detail-form/CompanyDetails";
import VMSLogo from "../atoms/vms-logo";
import { sidebarTabs } from "@/src/constants/vendorDetailSidebarTab";
import { useSearchParams } from "next/navigation";
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
const VendorDetail = () => {
  const param = useSearchParams();
  const tabType = param?.get("tabtype");
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
        <OnboardingSidebar />
        {/* form */}
        {tabType == "Company Detail" ? (
          <CompanyDetailForm />
        ) : tabType == "Company Address" ? (
          <CompanyAddress />
        ) : tabType == "Document Detail" ? (
          <DocumentDetails />
        ) : tabType?.includes("Payment Detail") ? (
          <PaymentDetail />
        ) : tabType?.includes("Contact Detail") ? (
          <ContactDetail />
        ) : tabType == "Manufacturing Detail" ? (
          <ManufacturingDetail />
        ) : tabType == "Employee Detail" ? (
          <EmployeeDetail />
        ) : tabType == "Machinery Detail" ? (
          <MachineryDetail />
        ) : tabType == "Testing Facility" ? (
          <TestingFacility />
        ) : tabType == "Reputed Partners" ? (
          <ReputedPartners />
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

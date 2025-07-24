"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { ViewQMSFormTabs } from "@/src/constants/vendorDetailSidebarTab";

interface Props {
  vendor_onboarding: string;
}

const ViewQMSFormDetails = ({ vendor_onboarding }: Props) => {
  const { designation } = useAuth();
  const router = useRouter();
  const param = useSearchParams();
  const tabType = param?.get("tabtype");
  const company_code = param?.get("company_code")

  if (designation === "Accounts Team") return null;

  return (
    <div className="fixed top-16 z-30 bg-[#DDE8FE] shadow-md w-[calc(100%-7rem)]">
        <div className="flex overflow-x-auto gap-3 text-md">
          {ViewQMSFormTabs?.map((item, index) => (
  <div
    key={index}
    className={`cursor-pointer p-2 rounded-lg whitespace-nowrap ${item.key === tabType ? "bg-[#0C72F5] text-white" : "text-[#0C72F5]"}`}
    onClick={() =>
      router.push(
        `/qms-form-details?vendor_onboarding=${encodeURIComponent(vendor_onboarding)}&tabtype=${encodeURIComponent(item.key)}&company_code=${company_code}`
      )
    }
  >
    {item.label}
  </div>
))}

        </div>
    </div>
  );
};

export default ViewQMSFormDetails;

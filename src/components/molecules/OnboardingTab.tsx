"use client"
import { sidebarAccountsTabs, sidebarTabs, TreasuryTabs } from "@/src/constants/vendorDetailSidebarTab";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

interface Props {
  onboarding_refno: string,
  refno: string;
  company: number | String;
}

const OnboardingTab = ({ onboarding_refno, refno, company }: Props) => {
  const { designation } = useAuth();
  const param = useSearchParams();
  const tabType = param?.get("tabtype");
  const viaDataImport = param?.get("via_data_import");
  const router = useRouter();
  const data = designation == "Accounts Team" || designation == "Accounts Head" ? sidebarAccountsTabs : designation == "Treasury" ? TreasuryTabs : sidebarTabs;

  return (
    <div className="p-2 flex overflow-x-scroll bg-[#DDE8FE] rounded-xl gap-3 h-fit max-h-[80vh] text-sm">
      {data?.map((item, index) => {
        const baseUrl = `/view-onboarding-details?tabtype=${encodeURIComponent(item)}`;
        const companyParam = company != null ? company.toString() : "";

        const url =
          viaDataImport === "1"
            ? `${baseUrl}&refno=${encodeURIComponent(refno)}&company=${encodeURIComponent(companyParam)}&via_data_import=1`
            : `${baseUrl}&vendor_onboarding=${encodeURIComponent(onboarding_refno)}&refno=${encodeURIComponent(refno)}`;

        return (
          <div
            // onClick={() => {
            //   router.push(
            //     `/view-onboarding-details?tabtype=${encodeURIComponent(item)}&vendor_onboarding=${encodeURIComponent(onboarding_refno)}&refno=${encodeURIComponent(refno)}`,
            //   );
            // }}
            onClick={() => router.push(url)}
            className={`cursor-pointer p-2 ${item == tabType ? "bg-[#0C72F5] text-white" : "text-[#0C72F5]"} text-nowrap rounded-lg`}
            key={index}
          >
            {item}
          </div>
        )
      }
      )}
    </div>
  );
};

export default OnboardingTab;

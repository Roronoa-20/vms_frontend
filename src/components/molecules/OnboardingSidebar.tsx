'use client'
import { AccountsTeamOnboardingSidebar, OnboardingTabs, sidebarTabs, sidebarTabsWithoutMaterialType } from "@/src/constants/vendorDetailSidebarTab";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import OnboardingTab from "./OnboardingTab";

interface Props {
  onboarding_refno?: string,
  refno: string,
  isAccountsTeam?: number,
  vendor_type?: string[]
  nature_of_business: string
}


const OnboardingSidebar = ({ onboarding_refno, refno, isAccountsTeam, vendor_type, nature_of_business }: Props) => {
  const param = useSearchParams();
  const tabType = param?.get("tabtype");
  const router = useRouter();
  const isMaterialType = vendor_type && vendor_type.includes("Material Vendor") && nature_of_business == "Material" ? true : false;
  console.log(vendor_type , "hfkjsdhkfkjsdhfkusdhd");
  let tabs;
  if (isAccountsTeam == 1) {
    tabs = AccountsTeamOnboardingSidebar;
  } else {
    tabs = !isMaterialType ? sidebarTabsWithoutMaterialType : OnboardingTabs
  }
  return (
    <div className="p-3 flex flex-col bg-white rounded-xl gap-3 h-fit max-h-[80vh] w-1/4 overflow-y-scroll no-scrollbar">
      {tabs?.map((item, index) => (
        <div
          // onClick={() => {
          //   router.push(
          //     `/vendor-details-form?tabtype=${encodeURIComponent(item)}&vendor_onboarding=${onboarding_refno}&refno=${refno}`,
          //   );
          // }}
          className={`p-2 ${item.includes(tabType as string) ? "bg-[#0C72F5] text-white" : "bg-[#E8F0F7]  text-[#0C72F5]"} text-wrap rounded-lg`}
          key={index}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default OnboardingSidebar;

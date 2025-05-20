"use client"
import { sidebarTabs } from "@/src/constants/vendorDetailSidebarTab";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const OnboardingTab = () => {
  const param = useSearchParams();
  const tabType = param?.get("tabtype");
  const router = useRouter();
  return (
    <div className="p-3 flex overflow-x-scroll bg-[#DDE8FE] rounded-xl gap-3 h-fit max-h-[80vh] mx-5 text-sm">
      {sidebarTabs?.map((item, index) => (
        <div
          onClick={() => {
            router.push(
              `/view-onboarding-details?tabtype=${encodeURIComponent(item)}`,
            );
          }}
          className={`cursor-pointer p-2 ${item == tabType ? "bg-[#0C72F5] text-white" : "text-[#0C72F5]"} text-nowrap rounded-lg`}
          key={index}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default OnboardingTab;

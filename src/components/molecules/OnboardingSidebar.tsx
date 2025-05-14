import { sidebarTabs } from "@/src/constants/vendorDetailSidebarTab";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const OnboardingSidebar = () => {
  const param = useSearchParams();
  const tabType = param?.get("tabtype");
  const router = useRouter();
  return (
    <div className="p-3 flex flex-col bg-white rounded-xl gap-3 h-fit max-h-[80vh]">
      {sidebarTabs?.map((item, index) => (
        <div
          onClick={() => {
            router.push(
              `/vendor-details-form?tabtype=${encodeURIComponent(item)}`
            );
          }}
          className={`cursor-pointer p-2 ${item == tabType ? "bg-[#0C72F5] text-white" : "bg-[#E8F0F7]  text-[#0C72F5]"} text-nowrap rounded-lg`}
          key={index}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default OnboardingSidebar;

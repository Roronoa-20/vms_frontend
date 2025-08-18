"use client"
import React from "react";
import Logo from "@/src/components/atoms/vms-logo";
import { sidebarMenu, VendorsidebarMenu, EnquirysidebarMenu,ASASideBarMenu,AccountSideBarMenu } from "@/src/constants/sidebarMenu";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
const Sidebar = () => {
  const router = useRouter();
  const { designation } = useAuth();
  const { vendorRef } = useAuth();

  const sideBar = designation === "Vendor" ? VendorsidebarMenu : designation === "Enquirer" ? EnquirysidebarMenu : designation === "ASA" ? ASASideBarMenu : designation == "Accounts Team" || designation == "Accounts Head"?AccountSideBarMenu: sidebarMenu;

  return (
    <div className="w-[110px] bg-[#0C2741] flex flex-col items-center gap-4 overflow-y-scroll no-scrollbar sticky left-0">
      <div className="w-3 h-3 pb-6 pt-5">
        <Logo />
      </div>
      {sideBar?.map((item, index) => (
        <button
          key={index}
          className="px-2 py-2 rounded-lg hover:bg-[#2C567E] text-sm flex flex-col justify-center items-center gap-1 text-white"
          onClick={() => {
            if (item.name === "ASA Form") {
              router.push(`/asa-form?tabtype=company_information&vms_ref_no=${vendorRef}`);
            } else {
              router.push(item.href);
            }
          }}

        >
          <Image src={item?.logo} alt="" width={25} height={20} />
          <h1>{item?.name}</h1>
        </button>
      ))}
    </div>
  );
};

export default Sidebar;

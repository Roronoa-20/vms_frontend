"use client"
import React, { useState, useRef, useEffect } from "react";
import Logo from "@/src/components/atoms/vms-logo";
import { sidebarMenu, VendorsidebarMenu, EnquirysidebarMenu, ASASideBarMenu, AccountSideBarMenu, AccountHeadSideBarMenu, PurchaseHeadsidebarMenu, QASideBarMenu, SuperHeadSidebarMenu, TreasurySideBarMenu, MaterialUserSideBar, MaterialCPSideBar, FinanceSideBarMenu, CategoryMastersidebarMenu } from "@/src/constants/sidebarMenu";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { SidebarItem, SidebarChild } from "@/src/types/sidebar";


const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { designation, role } = useAuth();
  const { vendorRef } = useAuth();
  const { asaReqd } = useAuth();

  if (designation?.toLowerCase() === "security") {
    return null;
  }

  // const sideBar = designation === "Vendor" ? VendorsidebarMenu : designation === "Enquirer" ? EnquirysidebarMenu : designation === "ASA" ? ASASideBarMenu : designation === "Accounts Team" ? AccountSideBarMenu : designation === "Accounts Head" ? AccountHeadSideBarMenu : designation === "Purchase Head" ? PurchaseHeadsidebarMenu : designation === "QA Team" ? QASideBarMenu : designation === "Super Head" ? SuperHeadSidebarMenu : designation === "Treasury" ? TreasurySideBarMenu : designation === "Material User" ? MaterialUserSideBar : designation === "Material CP" ? MaterialCPSideBar : sidebarMenu;

  let sideBar = designation === "Vendor" ? VendorsidebarMenu : designation === "Enquirer" ? EnquirysidebarMenu : designation === "ASA" ? ASASideBarMenu : designation === "Accounts Team" ? AccountSideBarMenu : designation === "Accounts Head" ? AccountHeadSideBarMenu : designation === "Purchase Head" ? PurchaseHeadsidebarMenu : designation === "QA Team" ? QASideBarMenu : designation === "Super Head" ? SuperHeadSidebarMenu : designation === "Treasury" ? TreasurySideBarMenu : designation === "Material User" ? MaterialUserSideBar : designation === "Material CP" ? MaterialCPSideBar : designation === "Finance" ? FinanceSideBarMenu : designation === "Finance Head" ? FinanceSideBarMenu : designation === "Category Master" ? CategoryMastersidebarMenu : sidebarMenu;

  if (designation === "Vendor") {
    sideBar = sideBar.filter((item) => {
      if (item.name === "ASA Form") {
        return asaReqd === 1;
      }
      return true;
    });
  }

  // Show Material Onboarding only if Purchase Team + Material CP role
  if (designation === "Purchase Team") {
    sideBar = sidebarMenu.filter(item => {
      if (item.name === "Material Onboarding") {
        return role?.includes("Material CP");
      }
      return true;
    });
  }

  console.log("SIdebar ASA requeisred---->", asaReqd);

  const getSidebarWidth = (designation: string) => {
    const compactRoles = ["Vendor", "Enquirer", "ASA", "QA Team", "Material User", "Material CP", "Finance", "Finance Head"];
    return compactRoles.includes(designation) ? "w-[100px]" : "w-[115px]";
  };

  const [openMenu, setOpenMenu] = useState<SidebarItem | null>(null);
  const [submenuPos, setSubmenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const submenuRef = useRef<HTMLDivElement | null>(null);

  const handleClick = (item: SidebarItem, idx: number) => {
    if (item.children.length > 0) {
      const btn = buttonRefs.current[idx];
      const sidebar = document.querySelector(".sidebar-scroll") as HTMLElement;
      if (btn && sidebar) {
        const offset = getSidebarWidth(designation || "") === "w-[100px]" ? 0 : 0;
        const btnRect = btn.getBoundingClientRect();
        const sidebarRect = sidebar.getBoundingClientRect();

        const top = btn.offsetTop + 15 - sidebar.scrollTop;
        const left = sidebarRect.width - 10 + offset;
        setSubmenuPos({ top, left });
      }
      setOpenMenu(openMenu?.name === item.name ? null : item);
    } else {
      navigateTo(item);
    }
  };

  useEffect(() => {
    const sidebar = document.querySelector(".sidebar-scroll") as HTMLElement;
    if (!sidebar) return;

    const handleScroll = () => {
      if (openMenu) {
        const idx = sideBar.findIndex((item) => item.name === openMenu.name);
        const btn = buttonRefs.current[idx];
        if (btn) {
          const offset = getSidebarWidth(designation || "") === "w-[100px]" ? 0 : 0;
          const top = btn.offsetTop + 15 - sidebar.scrollTop;
          const left = sidebar.clientWidth + offset;

          setSubmenuPos({ top, left });
        }
      }
    };

    sidebar.addEventListener("scroll", handleScroll);
    return () => sidebar.removeEventListener("scroll", handleScroll);
  }, [openMenu]);

  const navigateTo = (item: SidebarItem | SidebarChild) => {
    if ('children' in item && item.children.length > 0) return;
    if (item.name === "ASA Form") {
      router.push(`/asa-form?tabtype=company_information&vms_ref_no=${vendorRef}`);
    } else if (item.href) {
      router.push(item.href);
    }
    setOpenMenu(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (submenuRef.current && !submenuRef.current.contains(event.target as Node) && !buttonRefs.current.some(btn => btn?.contains(event.target as Node))) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <div className="relative">
      {/* SIDEBAR */}
      <div
        className={`${getSidebarWidth(designation || "")} bg-[#0C2741] flex flex-col items-center gap-3 overflow-y-auto no-scrollbar h-screen sidebar-scroll`}
      >
        <div className="pb-3 pt-2.5">
          <Logo />
        </div>
        {sideBar?.map((item, idx) => (
          <button
            key={idx}
            ref={(el) => { buttonRefs.current[idx] = el; }}
            className={`px-2 py-2 rounded-lg text-sm flex flex-col justify-center items-center gap-1 text-white w-full 
            ${pathname === item.href ||
                item.children.some(child => child.href === pathname) ||
                (pathname === "/dashboard" && item.defaultActive)
                ? "bg-[#2C567E]"
                : "hover:bg-[#2C567E]"
              }`}
            onClick={() => handleClick(item, idx)}
          >
            <Image src={item?.logo} alt="" width={30} height={25} />
            <h1 className="text-center text-[16px] break-words">{item?.name}</h1>
          </button>
        ))}
      </div>

      {openMenu?.children && openMenu.children.length > 0 && (
        <div
          ref={submenuRef}
          style={{
            top: submenuPos.top,
            left: submenuPos.left,
          }}
          className="absolute bg-[#15395B] rounded-md shadow-lg flex flex-col gap-2 py-2 px-2 min-w-[180px] z-50"
        >
          {openMenu.children.map((child, idx) => (
            <button
              key={idx}
              className={`flex items-center gap-2 px-3 py-2 rounded text-sm text-white ${pathname === child.href ? "bg-[#2C567E]" : "hover:bg-[#2C567E]"}`}
              onClick={() => navigateTo(child)}
            >
              {child.logo && <Image src={child.logo} alt={child.name} width={18} height={18} />}
              <span>{child.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

};
export default Sidebar;
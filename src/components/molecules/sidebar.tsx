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
  const materialCpPages = [
    "/material-onboarding-dashboard",
    "/view-material-code-request",
    "/sap-material-code-list"
  ];

  const isMaterialCPSidebar = materialCpPages.includes(pathname) && designation === "Purchase Team" && role?.includes("Material CP");

  if (isMaterialCPSidebar) {
    sideBar = MaterialCPSideBar;
  }

  const forceCpCompact = isMaterialCPSidebar || designation === "Material CP";

  const getSidebarWidth = (designation: string, role: string | null | undefined, forceCompact: boolean) => {
    if (forceCompact) return "w-[100px]";
    const compactDesignations = ["Vendor", "Enquirer", "ASA", "QA Team", "Material User", "Material CP", "Finance", "Finance Head"];

    const compactRoles = ["Material CP"];

    const isCompactByDesignation = compactDesignations.includes(designation);
    const isCompactByRole = role ? compactRoles.includes(role) : false;

    return isCompactByDesignation || isCompactByRole ? "w-[100px]" : "w-[115px]";
  };

  const [openMenuName, setOpenMenuName] = useState<string | null>(null);
  const [submenuPos, setSubmenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const submenuRef = useRef<HTMLDivElement | null>(null);

  const updateSubmenuPosition = (itemName: string) => {
    const idx = sideBar.findIndex((i) => i.name === itemName);
    const btn = buttonRefs.current[idx];
    const sidebar = document.querySelector(".sidebar-scroll") as HTMLElement;

    if (!btn || !sidebar) return;

    const sidebarRect = sidebar.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    setSubmenuPos({
      top: btnRect.top - sidebarRect.top + sidebar.scrollTop,
      left: sidebar.clientWidth + 4,
    });
  };

  const handleClick = (item: SidebarItem, idx: number) => {
    if (item.children && item.children.length > 0) {
      setOpenMenuName(prev => {
        const next = prev === item.name ? null : item.name;
        if (next) {
          requestAnimationFrame(() => updateSubmenuPosition(item.name));
        }
        return next;
      });
    } else {
      navigateTo(item);
    }
  };

  const openMenu = sideBar.find(i => i.name === openMenuName);

  useEffect(() => {
    const sidebar = document.querySelector(".sidebar-scroll") as HTMLElement;
    if (!sidebar || !openMenuName) return;

    const onScroll = () => updateSubmenuPosition(openMenuName);

    sidebar.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);

    return () => {
      sidebar.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [openMenuName]);

  const hasPurchaseAndCP = designation === "Purchase Team" && role?.includes("Material CP");

  const navigateTo = (item: SidebarItem | SidebarChild) => {
    if ("children" in item && item.children.length > 0) return;

    if (item.name === "Material Onboarding" && hasPurchaseAndCP) {
      router.push("/material-onboarding-dashboard");
      return;
    }

    if (item.name === "ASA Form") {
      router.push(`/asa-form?tabtype=company_information&vms_ref_no=${vendorRef}`);
    } else if (item.href) {
      router.push(item.href);
    }

    setOpenMenuName(null);
  };


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (submenuRef.current?.contains(event.target as Node) || buttonRefs.current.some(btn => btn?.contains(event.target as Node))) {
        return;
      }
      setOpenMenuName(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    console.log("OPEN MENU:", openMenuName);
  }, [openMenuName]);



  return (
    <div className="relative">
      {/* SIDEBAR */}
      <div className={`${getSidebarWidth(designation || "", role, forceCpCompact)} bg-[#0C2741] flex flex-col h-screen sidebar-scroll relative`}>
        <div className="flex flex-col items-center gap-3 overflow-y-auto no-scrollbar relative">
          <div className="pb-3 pt-2.5">
            <Logo />
          </div>
          {sideBar?.map((item, idx) => (
            <button
              key={idx}
              ref={(el) => { buttonRefs.current[idx] = el; }}
              className={`px-2 py-2 rounded-lg text-sm flex flex-col justify-center items-center gap-1 text-white w-full 
            ${pathname === item.href ||
                  item.children?.some(child => child.href === pathname) ||
                  (pathname === "/dashboard" && item.defaultActive)
                  ? "bg-[#2C567E]"
                  : "hover:bg-[#2C567E]"
                }`}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => handleClick(item, idx)}
            >
              <Image src={item?.logo} alt="" width={30} height={25} />
              <h1 className="text-center text-[16px] break-words">{item?.name}</h1>
            </button>
          ))}
        </div>
        {isMaterialCPSidebar && (
          <div className="mt-auto pb-4 flex justify-center">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex flex-col items-center gap-1 text-white hover:bg-[#2C567E] px-2 py-2 rounded-lg w-full"
            >
              <span className="text-xl">←</span>
              <span className="text-sm">Back</span>
            </button>
          </div>
        )}

        {openMenu?.children && (
          <div
            ref={submenuRef}
            onMouseDown={(e) => e.stopPropagation()}
            style={{ top: submenuPos.top, left: submenuPos.left }}
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
    </div>
  );

};
export default Sidebar;
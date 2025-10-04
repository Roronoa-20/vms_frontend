"use client"
import React, { useState, useRef, useEffect } from "react";
import Logo from "@/src/components/atoms/vms-logo";
import { sidebarMenu, VendorsidebarMenu, EnquirysidebarMenu, ASASideBarMenu, AccountSideBarMenu, AccountHeadSideBarMenu, PurchaseHeadsidebarMenu, QASideBarMenu, SuperHeadSidebarMenu, TreasurySideBarMenu } from "@/src/constants/sidebarMenu";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { SidebarItem, SidebarChild } from "@/src/types/sidebar";
const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { designation } = useAuth();
  const { vendorRef } = useAuth();
  const sideBar = designation === "Vendor" ? VendorsidebarMenu : designation === "Enquirer" ? EnquirysidebarMenu : designation === "ASA" ? ASASideBarMenu : designation === "Accounts Team" ? AccountSideBarMenu : designation === "Accounts Head" ? AccountHeadSideBarMenu : designation === "Purchase Head" ? PurchaseHeadsidebarMenu : designation === "QA Team" ? QASideBarMenu : designation === "Super Head" ? SuperHeadSidebarMenu : designation === "Treasury" ? TreasurySideBarMenu : sidebarMenu;
  const [openMenu, setOpenMenu] = useState<SidebarItem | null>(null);
  const [submenuPos, setSubmenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const submenuRef = useRef<HTMLDivElement | null>(null);
  const handleClick = (item: SidebarItem, idx: number) => {
    if (item.children.length > 0) {
      const btn = buttonRefs.current[idx];
      if (btn) {
        const rect = btn.getBoundingClientRect();
        setSubmenuPos({ top: rect.top, left: rect.right });
      }
      setOpenMenu(openMenu?.name === item.name ? null : item);
    } else {
      navigateTo(item);
    }
  };
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
      if (
        submenuRef.current &&
        !submenuRef.current.contains(event.target as Node) &&
        !buttonRefs.current.some(btn => btn?.contains(event.target as Node))
      ) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      <div className="w-[110px] bg-[#0C2741] flex flex-col items-center gap-3 overflow-y-auto no-scrollbar sticky left-0 h-screen">
        <div className="w-3 h-3 pb-6 pt-5">
          <Logo />
        </div>
        {sideBar?.map((item, idx) => (
          <button
            key={idx}
            ref={(el) => { buttonRefs.current[idx] = el; }}
            // className={`px-2 py-2 rounded-lg text-sm flex flex-col justify-center items-center gap-1 text-white w-full ${openMenu?.name === item.name ? "bg-[#2C567E]" : "hover:bg-[#2C567E]"
            //   }`}
            className={`px-2 py-2 rounded-lg text-sm flex flex-col justify-center items-center gap-1 text-white w-full 
    ${
              // Active if current pathname matches parent or one of its children
              pathname === item.href ||
                item.children.some(child => child.href === pathname) ||
                (pathname === "/dashboard" && item.defaultActive)
                ? "bg-[#2C567E]"
                : "hover:bg-[#2C567E]"
              }`}
            onClick={() => handleClick(item, idx)}
          >
            <Image src={item?.logo} alt="" width={25} height={20} />
            <h1 className="text-center text-[14px] break-words">{item?.name}</h1>
          </button>
        ))}
      </div>
      {/* FLOATING ADJACENT SUBMENU */}
      {openMenu?.children && openMenu.children.length > 0 && (
        <div
          ref={submenuRef}
          style={{ top: submenuPos.top, left: submenuPos.left }}
          className="fixed bg-[#15395B] rounded-md shadow-lg flex flex-col gap-2 py-2 px-2 min-w-[180px] z-50"
        >
          {openMenu.children.map((child, idx) => (
            <button
              key={idx}
              className={`flex items-center gap-2 px-3 py-2 rounded text-sm text-white ${pathname === child.href ? "bg-[#2C567E]" : "hover:bg-[#2C567E]"
                }`}
              onClick={() => navigateTo(child)}
            >
              {child.logo && <Image src={child.logo} alt={child.name} width={16} height={16} />}
              <span>{child.name}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
};
export default Sidebar;
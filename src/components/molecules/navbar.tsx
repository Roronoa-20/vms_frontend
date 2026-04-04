"use client";
import Image from "next/image";
import Logo from "@/src/components/atoms/VmsLoginLogo";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import NavbarMenu from "./NavbarMenu";
import { usePathname } from "next/navigation";
import { NavbarConstant } from "@/src/constants/NavbarConstant";
import NotificationPanel from "./NotificationPanel";
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";
import { NotificationListResponse, Notification } from "@/src/types/notificationtypes";

const Navbar = () => {
  const { role, name, designation,status } = useAuth();
  const [isDialog, setIsDialog] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [vendorName, setVendorName] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const bellRef = useRef<HTMLDivElement | null>(null);
  const logoLetter = name?.charAt(0).toUpperCase();
  const pathname = usePathname();

  useEffect(() => {
    const storedVendorName = localStorage.getItem("vendor_name");
    if (storedVendorName) setVendorName(storedVendorName);
  }, []);

  const handleClose = () => {
    setIsDialog(false);
  };


  let heading = NavbarConstant[pathname] || "";
  if (pathname === "/view-asa-form" && vendorName) {
    heading += ` of ${vendorName}`;
  }

  const displayedDesignation = (() => {
    if (!role || role.length === 0) return designation || "";
    // const rolesToShow = [designation];
    // if (role.includes("Material CP") && designation !== "Material CP") {
    //   rolesToShow.push("Material CP");
    // }
    // return rolesToShow.join(",");
    return designation || "";
  })();

  return (
    <div className="bg-white w-full shadow-sm flex justify-between p-2 items-center sticky top-0 z-50 border-b border-slate-300">
      <div className="flex items-center gap-2">
        {/* Show Logo only for Security */}
        {designation?.toLowerCase() === "security" && (
          <div className="flex items-center justify-center w-44">
            <Logo />
          </div>
        )}

        <h1
          className={`${pathname === "/view-asa-form"
            ? "text-[20px] font-medium pl-1"
            : "text-[24px] font-semibold pl-1"
            } text-[#03111F]`}
        >
          {heading}
        </h1>
        {status && pathname === "/pr-request" && (
          <span className={`text-[14px] font-semibold px-3 py-1 rounded-full ${
            status.toLowerCase().includes("draft") ? "bg-gray-100 text-gray-600" :
            status.toLowerCase().includes("awaiting") ? "bg-yellow-100 text-yellow-700" :
            status.toLowerCase().includes("release") ? "bg-blue-100 text-blue-700" :
            status.toLowerCase().includes("approve") ? "bg-green-100 text-green-700" :
            status.toLowerCase().includes("reject") ? "bg-red-100 text-red-700" :
            "bg-gray-100 text-gray-600"
          }`}>
            {status}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 relative">
        {/* User Info */}
        <div className="flex flex-col justify-center items-end">
          <h1 className="text-[16px] font-semibold">{name}</h1>
          <h1 className="text-gray-500 text-[15px]">{displayedDesignation}</h1>
        </div>

        {/* Profile Icon */}
        <div
          onClick={() => {
            setIsDialog((prev) => !prev);
          }}
          className="relative cursor-pointer w-9 h-9 rounded-full bg-purple-500 flex items-center justify-center text-white text-lg font-medium"
        >
          {logoLetter || ""}
          {isDialog && <NavbarMenu handleClose={handleClose} />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
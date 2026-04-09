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

  const isPrRequest = pathname === "/pr-request";

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
    <div
      className={`bg-white w-full shadow-sm flex justify-between items-center sticky top-0 z-50 border-b border-slate-300 ${
        isPrRequest ? "px-3 py-1.5" : "p-2"
      }`}
    >
      <div
        className={`flex items-center gap-2 ${isPrRequest ? "min-w-0 flex-1 pr-2" : ""}`}
      >
        {/* Show Logo only for Security */}
        {designation?.toLowerCase() === "security" && (
          <div className="flex items-center justify-center w-44">
            <Logo />
          </div>
        )}

        <h1
          className={`pl-1 text-[#03111F] ${
            pathname === "/view-asa-form"
              ? "text-[20px] font-medium"
              : isPrRequest
                ? "text-lg font-semibold tracking-tight"
                : "text-[24px] font-semibold"
          }`}
        >
          {heading}
        </h1>
        {status && isPrRequest && (
          <span
            title={status}
            className={`inline-block max-w-[min(28rem,50vw)] truncate align-middle text-[11px] font-semibold leading-snug px-2 py-0.5 rounded-md ${
              status.toLowerCase().includes("draft")
                ? "bg-gray-100 text-gray-600"
                : status.toLowerCase().includes("awaiting")
                  ? "bg-yellow-100 text-yellow-700"
                  : status.toLowerCase().includes("release")
                    ? "bg-blue-100 text-blue-700"
                    : status.toLowerCase().includes("approve")
                      ? "bg-green-100 text-green-700"
                      : status.toLowerCase().includes("reject")
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-600"
            }`}
          >
            {status}
          </span>
        )}
      </div>

      <div
        className={`flex items-center relative shrink-0 ${isPrRequest ? "gap-2" : "gap-3"}`}
      >
        {/* Notification Bell */}
        {/* <div
          ref={bellRef}
          className="relative cursor-pointer"
          onClick={() => setIsNotifOpen((prev) => !prev)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`text-gray-700 ${isPrRequest ? "h-5 w-5" : "h-6 w-6"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 
              6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 
              6.165 6 8.388 6 11v3.159c0 .538-.214 
              1.055-.595 1.436L4 17h5m6 0v1a3 
              3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {totalCount > 0 && (
            <div className="group relative">
              <span
                className={`absolute -top-[2rem] -right-[0.5rem] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full
        ${unreadCount > 0 ? "bg-red-500" : "bg-gray-400"}`}
              >
                {totalCount}
              </span>
            </div>
          )}
        </div> */}

        {/* {isNotifOpen && (
          <NotificationPanel
            notifications={notifications}
            onClose={() => setIsNotifOpen(false)}
            anchorRef={bellRef}
            onMarkAllRead={handleMarkAllRead}
            onNotificationRead={handleNotificationRead}
            onClearUnread={handleClearUnread}
          />
        )} */}

        {/* User Info */}
        <div className="flex flex-col justify-center items-end">
          <h1
            className={`font-semibold ${isPrRequest ? "text-sm" : "text-[16px]"}`}
          >
            {name}
          </h1>
          <h1
            className={`text-gray-500 ${isPrRequest ? "text-xs" : "text-[15px]"}`}
          >
            {displayedDesignation}
          </h1>
        </div>

        {/* Profile Icon */}
        <div
          onClick={() => {
            setIsDialog((prev) => !prev);
          }}
          className={`relative cursor-pointer rounded-full bg-purple-500 flex items-center justify-center text-white font-medium ${
            isPrRequest ? "w-8 h-8 text-sm" : "w-9 h-9 text-lg"
          }`}
        >
          {logoLetter || ""}
          {isDialog && <NavbarMenu handleClose={handleClose} />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
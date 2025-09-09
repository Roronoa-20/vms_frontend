"use client";
import Image from "next/image";
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
  const { role, name, designation } = useAuth();
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

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await requestWrapper({
        url: API_END_POINTS.notificationlist,
        method: "GET",
      });

      const data: NotificationListResponse = res.data;

      if (data.message.success) {
        const allNotifs = data.message.data.notifications;
        setNotifications(allNotifs);

        const unread = allNotifs.filter((n) => !n.read).length;
        setUnreadCount(unread);

        setTotalCount(data.message.data.pagination.total_count);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const handleClose = () => {
    setIsDialog(false);
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await requestWrapper({
        url: API_END_POINTS.markallnotificationread,
        method: "POST",
      });

      const data = res.data;

      if (data.message.success) {
        // Optimistic update: mark all locally as read
        const updated = notifications.map((n) => ({ ...n, read: true }));
        setNotifications(updated);
        setUnreadCount(0);

        setTotalCount(data.message.data.total_notifications);
      }
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  const handleNotificationRead = (name: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.name === name ? { ...n, read: true } : n))
    );
  };

  const handleClearUnread = () => {
    setUnreadCount(0);
  };


  let heading = NavbarConstant[pathname] || "";
  if (pathname === "/view-asa-form" && vendorName) {
    heading += ` of ${vendorName}`;
  }

  return (
    <div className="bg-white w-full shadow-sm flex justify-between p-3 items-center sticky top-0 z-50">
      <h1
        className={`${pathname === "/view-asa-form"
          ? "text-[20px] font-medium"
          : "text-[24px] font-semibold"
          } text-[#03111F]`}
      >
        {heading}
      </h1>

      <div className="flex items-center gap-5 relative">
        {/* Notification Bell */}
        <div
          ref={bellRef}
          className="relative cursor-pointer"
          onClick={() => setIsNotifOpen((prev) => !prev)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
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

              {/* Tooltip */}
              {/* <div
                className="absolute -top-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity 
             bg-black text-white text-[10px] rounded px-2 py-1 whitespace-nowrap"
              >
                {unreadCount > 0
                  ? `${unreadCount} unread of ${totalCount}`
                  : totalCount > 0
                    ? "All caught up 🎉"
                    : "No notifications"}
              </div> */}
            </div>
          )}
        </div>

        {isNotifOpen && (
          <NotificationPanel
            notifications={notifications}
            onClose={() => setIsNotifOpen(false)}
            anchorRef={bellRef}
            onMarkAllRead={handleMarkAllRead}
            onNotificationRead={handleNotificationRead}
            onClearUnread={handleClearUnread}
          />
        )}

        {/* User Info */}
        <div className="flex flex-col gap-1 justify-center items-end">
          <h1 className="text-sm font-semibold">{name}</h1>
          <h1 className="text-gray-500 text-xs">{designation}</h1>
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
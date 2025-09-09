"use client";
import React, { useEffect, useRef, useState } from "react";
import { Notification } from "@/src/types/notificationtypes";
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";

interface Props {
  notifications: Notification[];
  onClose: () => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  onMarkAllRead: () => void;
  onNotificationRead: (name: string) => void;
  onClearUnread: () => void;
}

const NotificationPanel = ({
  notifications,
  onClose,
  anchorRef,
  onMarkAllRead,
  onNotificationRead,
  onClearUnread,
}: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null); // ✅ wrap both panels
  const [details, setDetails] = useState<{ subject: string; content: string } | null>(null);
  const [activeName, setActiveName] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, anchorRef]);

  const fetchDetails = async (name: string) => {
    try {
      const res = await requestWrapper({
        url: `${API_END_POINTS.detailednotification}?notification_name=${name}`,
        method: "POST",
      });

      const data = res.data;

      if (data?.message?.success) {
        setDetails({
          subject: data.message.data.subject,
          content: data.message.data.content?.trim() || "No content available.",
        });

        onNotificationRead(name); // ✅ mark as read in parent
      }
    } catch (err) {
      console.error("Failed to fetch notification details:", err);
    }
  };

  const handleNotificationClick = (n: Notification) => {
    setActiveName(n.name);
    fetchDetails(n.name);
  };

  return (
    <div ref={containerRef} className="absolute right-0 top-12 flex z-50">
      {/* Left detail box */}
      {details && (
        <div className="w-80 max-h-[400px] overflow-y-auto bg-white shadow-lg rounded-lg border border-gray-200 mr-1 p-4 relative">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Details</h3>
          <p className="text-sm font-bold text-gray-900">{details.subject}</p>
          <p className="text-xs text-gray-600 mt-2 whitespace-pre-line">{details.content}</p>

          {/* Arrow pointing right */}
          <div className="absolute top-6 -right-2 w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent border-l-gray-200"></div>
        </div>
      )}

      {/* Notification Panel */}
      <div
        ref={containerRef}
        className="w-80 max-h-[400px] overflow-y-auto bg-white shadow-lg rounded-lg border border-gray-200"
      >
        <div className="flex justify-between items-center p-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-800">Notifications</h2>
          <div className="flex items-center gap-3">
            <button
              className="text-xs text-green-600 hover:underline"
              onClick={() => {
                onMarkAllRead();
                notifications.forEach((n) => {
                  if (!n.read) onNotificationRead(n.name);
                });
                onClearUnread();
              }}
            >
              Mark all read
            </button>
            <button className="text-xs text-blue-600 hover:underline" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">No new notifications 🎉</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notifications.map((n) => (
              <li
                key={n.name}
                className={`p-3 flex justify-between items-center cursor-pointer ${
                  activeName === n.name ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
                onClick={() => handleNotificationClick(n)}
              >
                <div className="flex items-center">
                  {activeName === n.name && (
                    <span className="text-blue-500 mr-2">▶</span>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{n.subject}</p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(n.creation).toLocaleString()}
                    </p>
                  </div>
                </div>
                {!n.read && (
                  <span className="w-2 h-2 bg-blue-500 rounded-full ml-2"></span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
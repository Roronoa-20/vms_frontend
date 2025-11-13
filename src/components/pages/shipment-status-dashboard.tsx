"use client";

import React, { useEffect, useState } from "react";
import { CheckCircleIcon } from "lucide-react";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import API_END_POINTS from "@/src/services/apiEndPoints";
import {ShipmentCountResponse,CompanyWiseCount} from "@/src/types/shipmentstatusTypes";
import ShipmentStatusTable from "@/src/components/molecules/View-Shipment-Status-Table";

export default function Dashboard() {
  const [companyCounts, setCompanyCounts] = useState<CompanyWiseCount[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string | null>("TOTAL");

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res: AxiosResponse<ShipmentCountResponse> =
          await requestWrapper<ShipmentCountResponse>({
            url: API_END_POINTS.shipmentstatuscount,
            method: "GET",
          });

        const data = res.data.message.data;
        setTotalCount(data.total_count);

        const transformedCounts: CompanyWiseCount[] = Object.keys(data)
          .filter(
            (key) => key.endsWith("_count") && typeof data[key] === "object"
          )
          .map((key) => {
            const companyData = data[key] as CompanyWiseCount;

            return {
              name: companyData.name,
              company_code: companyData.company_code,
              company_name: companyData.company_name || "Unknown",
              count: companyData.count ?? 0,
            };
          });

        setCompanyCounts(transformedCounts);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  const handleTabClick = (tabKey: string) => {
    setActiveTab((prev) => (prev === tabKey ? null : tabKey));
  };

  const cardColors = [
    { bg: "bg-rose-100", text: "text-rose-800", hover: "hover:border-rose-400", icon: "text-rose-600" },
    { bg: "bg-green-100", text: "text-green-800", hover: "hover:border-green-400", icon: "text-green-600" },
    { bg: "bg-blue-100", text: "text-blue-800", hover: "hover:border-blue-400", icon: "text-blue-600" },
    { bg: "bg-yellow-100", text: "text-yellow-800", hover: "hover:border-yellow-400", icon: "text-yellow-600" },
    { bg: "bg-purple-100", text: "text-purple-800", hover: "hover:border-purple-400", icon: "text-purple-600" },
    { bg: "bg-pink-100", text: "text-pink-800", hover: "hover:border-pink-400", icon: "text-pink-600" },
  ];

  const cardsData = [
    {
      name: "Total Shipments",
      key: "TOTAL",
      count: totalCount,
      ...cardColors[1],
    },
    ...companyCounts.map((c, idx) => ({
      name: c.company_name,
      key: c.company_code ?? "",
      count: c.count,
      ...cardColors[idx % cardColors.length],
    })),
  ];

  return (
    <div className="p-3 bg-gray-200 min-h-screen">
      <div className="shadow bg-[#f6f6f7] p-4 rounded-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {cardsData.map((card) => (
            <div
              key={card.key}
              onClick={() => handleTabClick(card.key)}
              className={`
                group cursor-pointer w-full h-20 rounded-2xl flex flex-col p-3 justify-between border-2
                ${card.bg} ${card.text} ${card.hover}
                hover:scale-105 shadow-md transition duration-300 transform
                ${
                  activeTab === card.key
                    ? "bg-white text-black shadow-lg border-gray-300"
                    : ""
                }
              `}
            >
              <div className="flex w-full justify-between">
                <h1 className="text-[13px]">{card.name}</h1>
                <CheckCircleIcon
                  className={`w-6 h-6 ${
                    activeTab === card.key ? card.icon : card.text
                  }`}
                />
              </div>
              <div className="text-[20px] font-bold">{card.count}</div>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden mt-6 shadow bg-white p-4 rounded-2xl
                    ${
                      activeTab
                        ? "max-h-[2000px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
      >
        {activeTab && (
          <ShipmentStatusTable
            company={activeTab === "TOTAL" ? "" : activeTab}
            tableTitle={
              activeTab === "TOTAL"
                ? "Total Shipment Status"
                : companyCounts.find((c) => c.company_code === activeTab)
                    ?.company_name || "Unknown Company"
            }
          />
        )}
      </div>
    </div>
  );
}

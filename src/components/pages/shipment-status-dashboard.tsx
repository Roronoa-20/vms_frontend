"use client";

import React, { useEffect, useState } from "react";
import { CheckCircleIcon, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { ShipmentCountResponse, CompanyWiseCount } from "@/src/types/shipmentstatusTypes";
import ShipmentStatusTable from "@/src/components/molecules/View-Shipment-Status-Table";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const router = useRouter();

  const [companyCounts, setCompanyCounts] = useState<CompanyWiseCount[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedCompany, setSelectedCompany] = useState<string | null>("TOTAL");
  const [showTable, setShowTable] = useState<boolean>(true);
  const COMPANY_NAME_MAP: Record<string, string> = {
    "1000": "Meril India",
    "2000": "Meril US",
    "7000": "Meril Europe",
    "3000": "Meril UK",
    "9000": "Meril South America",
    "1012": "Meril H03",
    "8000": "Meril Endo",
  };


  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res: AxiosResponse<ShipmentCountResponse> = await requestWrapper<ShipmentCountResponse>({
          url: API_END_POINTS.shipmentstatuscount,
          method: "GET",
        });

        const data = res.data.message.data;
        setTotalCount(data.total_count);

        const transformedCounts: CompanyWiseCount[] = Object.keys(data)
          .filter((key) => key !== "total_count")
          .map((key) => {
            const companyCode = key.replace("_count", "");
            return {
              company: companyCode,
              company_name: COMPANY_NAME_MAP[companyCode] ?? companyCode,
              count: data[key as keyof typeof data] as number,
            };
          });

        setCompanyCounts(transformedCounts);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };
    fetchCounts();
  }, []);

  const getStatusIcon = (color: string) => (
    <CheckCircleIcon className={`w-6 h-6 ${color}`} />
  );

  const handleCardClick = (companyCode: string | null) => {
    if (selectedCompany === companyCode) {
      setShowTable(false);
      setTimeout(() => setSelectedCompany(null), 300);
    } else {
      setSelectedCompany(companyCode);
      setShowTable(true);
    }
  };


  const handleNewShipment = () => {
    router.push("/shipment-status");
  };

  return (
    <div className="p-3 bg-gray-200 min-h-screen">

      {/* New Shipment Status Button */}
      <div className="flex justify-end mb-4">
        <Button
          onClick={handleNewShipment}
          variant={"nextbtn"}
          size={"nextbtnsize"}
          className="py-2 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Shipment Status
        </Button>
      </div>

      {/* Dashboard Cards */}
      <div className="shadow bg-[#f6f6f7] p-4 rounded-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total Count Card */}
          <div
            className="cursor-pointer rounded-lg p-4 shadow-sm bg-green-100 text-green-800 flex items-center justify-between"
            onClick={() => handleCardClick("TOTAL")}
          >
            <div>
              <p className="text-md">Total Shipments</p>
              <h3 className="font-semibold">{totalCount}</h3>
            </div>
            <div>{getStatusIcon("text-green-600")}</div>
          </div>

          {/* Company-wise Cards */}
          {companyCounts.map((entry, idx) => (
            <div
              key={idx}
              className="cursor-pointer rounded-lg p-4 shadow-sm bg-blue-100 text-blue-800 flex items-center justify-between"
              onClick={() => handleCardClick(entry.company ?? "")}
            >
              <div>
                <p className="text-md">{entry.company_name ?? "Unknown"}</p>
                <h3 className="font-semibold">{entry.count}</h3>
              </div>
              <div>{getStatusIcon("text-blue-600")}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Table for selected company (separate box with gap) */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden mt-6 shadow bg-white p-4 rounded-2xl ${showTable ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        {selectedCompany && (
          <ShipmentStatusTable
            company={selectedCompany === "TOTAL" ? "" : selectedCompany} // <-- raw code
            tableTitle={
              selectedCompany === "TOTAL"
                ? "Total Shipment Status"
                : COMPANY_NAME_MAP[selectedCompany ?? ""] || selectedCompany
            }
          />
        )}
      </div>
    </div>
  );
}
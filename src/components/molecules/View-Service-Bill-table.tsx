"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button"; 
import Link from "next/link";
import { FileText, Plus } from "lucide-react";

import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

interface shipmentItem {
  grn_no: string;
  grn_company: string;
  grn_date: string;
  sap_booking_id: string;
  sap_status: string;
  invoice_url?: string;
}

const sampleData: shipmentItem[] = [
  {
    grn_no: "GRN123",
    grn_company: "ABC Corp",
    grn_date: "2025-09-25",
    sap_booking_id: "SAP001",
    sap_status: "Confirmed",
    invoice_url: "https://example.com/invoice1.pdf",
  },
  {
    grn_no: "GRN456",
    grn_company: "XYZ Ltd",
    grn_date: "2025-09-24",
    sap_booking_id: "SAP002",
    sap_status: "Pending",
  },
];

<ViewServiceBilltable shipmentData={sampleData} />;

interface ViewServiceBilltableProps {
  shipmentData?: shipmentItem[];
  onNewShipment?: () => void;  
}

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "--";
  }
};

type entry = {
  id: string;
  title: string;
  color: string;
  textColor?: string;
  iconColor: string;
  status?: "completed" | "in-progress" | "pending";
};

export function ViewServiceBilltable({ shipmentData = [] }: ViewServiceBilltableProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();

  
  const filteredData = useMemo(() => {
    if (!shipmentData) return [];
    if (!searchTerm.trim()) return shipmentData;

    return shipmentData.filter((item) =>
      item?.grn_no?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [shipmentData, searchTerm]);

  const onNewShipment = () => {
    router.push("/service-bill");
  };


  return (
    <div className="p-3  min-h-screen">
      <div className="shadow bg-[#f6f6f7] p-4 rounded-2xl">
        <div className="flex w-full justify-between pb-4">
          <h1 className="text-[20px] text-[#03111F] font-semibold">
            Service Bill (SB) List
          </h1>
          
          <Button
            type="button"
            variant={"nextbtn"}
            size={"nextbtnsize"}
            className="py-2 px-4"
            onClick={onNewShipment}
            >
            <Plus className="w-8 h-8" />
            New Service
          </Button>

        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-[#a4c0fb] text-[14px]">
              <TableHead className="text-black text-center" scope="col">
                Sr No.
              </TableHead>
              <TableHead className="text-black text-center" scope="col">
                Company
              </TableHead>
              <TableHead className="text-black text-center" scope="col">
                GRN No.
              </TableHead>
              <TableHead className="text-black text-center" scope="col">
                GRN Date
              </TableHead>
              <TableHead className="text-black text-center" scope="col">
                SAP Booking ID
              </TableHead>
              <TableHead className="text-black text-center" scope="col">
                SAP Status
              </TableHead>
              <TableHead className="text-black text-center" scope="col">
                View GRN
              </TableHead>
              <TableHead className="text-black text-center" scope="col">
                View Invoice
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredData && filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="text-center">{item.grn_company}</TableCell>
                  <TableCell className="text-center">{item.grn_no}</TableCell>
                  <TableCell className="text-center">{formatDate(item.grn_date)}</TableCell>
                  <TableCell className="text-center">{item.sap_booking_id}</TableCell>
                  <TableCell className="text-center">{item.sap_status}</TableCell>
                  <TableCell className="text-center">
                    <Link href={`/view-grn-details?grn_ref=${item.grn_no}`}>
                      <Button className="bg-blue-400 text-white hover:bg-white hover:text-black">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    {item.invoice_url ? (
                      <Link
                        href={item.invoice_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex justify-center text-blue-600"
                      >
                        <FileText className="w-5 h-5" />
                      </Link>
                    ) : (
                      "--"
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-500 py-4">
                  No Service Bill found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
//Home Page
export default function Home() {
  const [entries] = useState<entry[]>([
    {
      id: "142916",
      title: "Total Entry",
      color: "bg-green-100 text-green-800",
      iconColor: "text-green-600",
    },
    {
      id: "443",
      title: "MLSPL Entry",
      color: "bg-purple-100 text-purple-800",
      iconColor: "text-purple-600",
    },
    {
      id: "29447",
      title: "MLSL Entry",
      color: "bg-red-100 text-red-800",
      iconColor: "text-red-600",
    },
    {
      id: "21288",
      title: "MEPL Entry",
      color: "bg-pink-100 text-pink-800",
      iconColor: "text-pink-600",
    },
    {
      id: "25018",
      title: "MDPL Entry",
      color: "bg-yellow-100 text-yellow-800",
      iconColor: "text-yellow-600",
    },
    {
      id: "39198",
      title: "MHPL Entry",
      color: "bg-sky-100 text-sky-800",
      iconColor: "text-sky-600",
    },
    {
      id: "12827",
      title: "MCPL Entry",
      color: "bg-yellow-100 text-yellow-800",
      iconColor: "text-yellow-600",
    },
    {
      id: "6474",
      title: "MILSPL Entry",
      color: "bg-green-100 text-green-800",
      iconColor: "text-green-600",
    },
    {
      id: "7145",
      title: "MMIPL Entry",
      color: "bg-purple-100 text-purple-800",
      iconColor: "text-purple-600",
    },
    {
      id: "1035",
      title: "MNPL Entry",
      color: "bg-yellow-100 text-yellow-800",
      iconColor: "text-yellow-600",
    },
    {
      id: "34",
      title: "MCIPL Entry",
      color: "bg-pink-100 text-pink-800",
      iconColor: "text-pink-600",
    },
    {
      id: "36527",
      title: "MATERIAL RECE...",
      color: "bg-orange-100 text-orange-800",
      iconColor: "text-orange-600",
    },
    {
      id: "35792",
      title: "MATERIAL HAND...",
      color: "bg-sky-100 text-sky-800",
      iconColor: "text-sky-600",
    },
  ]);

  const [showShipmentTable, setShowShipmentTable] = useState(false);
  const getStatusIcon = (iconColor: string) => (
    <CheckCircleIcon className={`w-6 h-6 ${iconColor}`} />
  );

  return (
    <div className="p-3 bg-gray-200 min-h-screen">
      <div className="shadow bg-[#f6f6f7] p-4 rounded-2xl">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {entries.map((entry) => (
             <div
              key={entry.id}
              className={`cursor-pointer rounded-lg p-4 shadow-sm ${entry.color} flex items-center justify-between`}
              onClick={() => {
                if (entry.title === "Total Entry") {
                  setShowShipmentTable(true);
                }
                if (entry.title === "MLSPL Entry") {
                  setShowShipmentTable(true);
                }
              }}
            >
              <div>
                <p className="text-md">{entry.title}</p>
                <h3 className="font-semibold">{entry.id}</h3>
              </div>
              <div>{getStatusIcon(entry.iconColor)}</div>
            </div>
          ))}
        </div>

        {showShipmentTable && <ViewServiceBilltable shipmentData={sampleData} />}
         </div>
    </div>
  );
}

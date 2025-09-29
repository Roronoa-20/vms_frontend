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

<ShipmentStatusTable shipmentData={sampleData} />;

interface ShipmentStatusTableProps {
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

export default function ShipmentStatusTable({ shipmentData = [] }: ShipmentStatusTableProps) {
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
    router.push('/shipment-status'); 
  };

  return (
    <div className="p-3 bg-gray-200 min-h-screen">
      <div className="shadow bg-[#f6f6f7] p-4 rounded-2xl">
        <div className="flex w-full justify-between pb-4">
          <h1 className="text-[20px] text-[#03111F] font-semibold">
            Shipment Status (DSR) List
          </h1>
          
          <Button
            type="button"
            variant={"nextbtn"}
            size={"nextbtnsize"}
            className="py-2 px-4"
            onClick={onNewShipment}
          >
            <Plus />
            New Shipment
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
                  No Shipment entries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
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
import { serviceItem, ViewServiceBillRequestProps } from "@/src/types/serviceBill-Item";

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

export default function ViewServiceBillRequest({ serviceData = [] }: ViewServiceBillRequestProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const router = useRouter();

  const filteredData = useMemo(() => {
    if (!serviceData) return [];
    if (!searchTerm.trim()) return serviceData;

    return serviceData.filter((item) =>
      item?.ServiceBill_no?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [serviceData, searchTerm]);

  const onNewService = () => {
    router.push("/service-bill");
  };


  return (
    <div className="p-3 bg-gray-100 min-h-screen">
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
            onClick={onNewService}
            >
            <Plus className="w-8 h-8" />
            New Request
          </Button>

        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-[#a4c0fb] text-[14px]">
                        <TableHead className="text-black text-center">Sr No.</TableHead>
                        <TableHead className="text-black text-center">Company</TableHead>
                        <TableHead className="text-black text-center">ServiceBill No.</TableHead>
                        <TableHead className="text-black text-center">ServiceBill Date</TableHead>
                        <TableHead className="text-black text-center">SAP Booking ID</TableHead>
                        <TableHead className="text-black text-center">SAP Status</TableHead>
                        <TableHead className="text-black text-center">View ServiceBill</TableHead>
                        <TableHead className="text-black text-center">View Invoice</TableHead>
                      </TableRow>
          </TableHeader>

          <TableBody>
            {filteredData && filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="text-center">{item.ServiceBill_company}</TableCell>
                  <TableCell className="text-center">{item.ServiceBill_no}</TableCell>
                  <TableCell className="text-center">{formatDate(item.ServiceBill_date)}</TableCell>
                  <TableCell className="text-center">{item.sap_booking_id}</TableCell>
                  <TableCell className="text-center">{item.sap_status}</TableCell>
                  <TableCell className="text-center">
                    <Link href={`/view-grn-details?grn_ref=${item.ServiceBill_no}`}>
                      <Button className=" text-blue-500 hover:bg-blue-500 hover:text-white bg-white">
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
                  No Service Bill Request found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}


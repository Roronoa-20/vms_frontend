"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { ShipmentItem, ShipmentTableResponse } from "@/src/types/shipmentstatusTypes";
import Pagination from "./Pagination";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";

interface Props {
  company: string;
  tableTitle?: string;
}

export default function ShipmentStatusTable({ company, tableTitle }: Props) {
  const [data, setData] = useState<ShipmentItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const limit = 20;

  const fetchTableData = async () => {
    try {
      const res: AxiosResponse<ShipmentTableResponse> = await requestWrapper<ShipmentTableResponse>({
        url: API_END_POINTS.shipmentcompanwisetabledata,
        method: "GET",
        params: { company, page, limit },
      });
      setData(res.data.message.data);
      setTotal(res.data.message.pagination.total_count);
    } catch (err) {
      console.error("Error fetching table data", err);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, [company, page]);

  return (
    <div>
      <h1 className="text-lg font-semibold mb-4">{tableTitle || `Shipment Status Data (${company})`}</h1>
      <Table>
        <TableHeader>
          <TableRow className="bg-[#a4c0fb] text-[14px]">
            <TableHead className="text-black text-center">Sr No.</TableHead>
            <TableHead className="text-black text-center">Company</TableHead>
            <TableHead className="text-black text-center">RFQ No.</TableHead>
            <TableHead className="text-black text-center">JRN</TableHead>
            <TableHead className="text-black text-center">Shipment Status</TableHead>
            <TableHead className="text-black text-center">Consignee</TableHead>
            <TableHead className="text-black text-center">Consignor</TableHead>
            <TableHead className="text-black text-center">View</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell className="text-center">{(page - 1) * limit + idx + 1}</TableCell>
                <TableCell className="text-center">{item.company}</TableCell>
                <TableCell className="text-center">{item.rfq_number}</TableCell>
                <TableCell className="text-center">{item.jrn}</TableCell>
                <TableCell className="text-center">{item.shipment_status}</TableCell>
                <TableCell className="text-center">{item.consignee_name}</TableCell>
                <TableCell className="text-center">{item.consignor_name}</TableCell>
                <TableCell className="text-center"><Link href={`/shipment-status?name=${item.name}`}><Button className="bg-[#5291CD] hover:bg-white hover:text-[#5291CD]">View</Button></Link></TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                No data found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Pagination
        currentPage={page}
        setCurrentPage={setPage}
        total_event_list={total}
        record_per_page={limit}
      />
    </div>
  );
}

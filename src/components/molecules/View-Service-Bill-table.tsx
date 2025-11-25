"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { ServiceBillItem, ServiceBillTableResponse } from "@/src/types/ServiceBillTypes";
import Pagination from "./Pagination";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { serviceItem } from "@/src/types/serviceBill-Item";


interface Props {
  company: string;
  tableTitle?: string;
  // serviceData: serviceItem[];

}

export default function ViewServiceBillTable({ company, tableTitle }: Props) {
  const [data, setData] = useState<ServiceBillItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const router = useRouter();
  const limit = 20;

  const fetchTableData = async () => {
    try {
      const filters = company && company !== "" ? { company } : {};
      const res: AxiosResponse<ServiceBillTableResponse> = await requestWrapper<ServiceBillTableResponse>({
        url: API_END_POINTS.servicebillcompanywisetabledata,
        method: "GET",
        params: {
          filters: JSON.stringify(filters),
          page,
          limit,
        },
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

  const handleNewShipment = () => {
    router.push("/new-service-bill");
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold mb-4">{tableTitle || `Shipment Status Data (${company})`}</h1>
        <div className="flex justify-end mb-4">
          <Button
            onClick={handleNewShipment}
            variant={"nextbtn"}
            size={"nextbtnsize"}
            className="py-2 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Service Bill
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-[#a4c0fb] text-[14px]">
            <TableHead className="text-black text-center">Sr No.</TableHead>
            <TableHead className="text-black text-center">Company</TableHead>
            <TableHead className="text-black text-center">RFQ Ref No.</TableHead>
            <TableHead className="text-black text-center">RFQ Date</TableHead>
            <TableHead className="text-black text-center">Meril Job No.</TableHead>
            <TableHead className="text-black text-center">Meril Job Date</TableHead>
            <TableHead className="text-black text-center">Service Provider Name</TableHead>
            <TableHead className="text-black text-center">Submit Date</TableHead>
            <TableHead className="text-black text-center">Status</TableHead>
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
                <TableCell className="text-center">{item.rfq_date}</TableCell>
                <TableCell className="text-center">{item.meril_job}</TableCell>
                <TableCell className="text-center">{item.meril_date}</TableCell>
                <TableCell className="text-center">{item.service_provider_name}</TableCell>
                <TableCell className="text-center">{item.status}</TableCell>
                <TableCell className="text-center">{item.service_provider_name}</TableCell>
                <TableCell className="text-center"><Link href={`/new-service-bill?name=${item.name}`}><Button className="bg-[#5291CD] hover:bg-white hover:text-[#5291CD]">View</Button></Link></TableCell>
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

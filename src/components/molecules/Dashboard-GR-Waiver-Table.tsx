"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { TvendorRegistrationDropdown } from "@/src/types/types";
import { formDataType } from "@/src/types/GR-waiverIterm";
import Pagination from "./Pagination";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { Input } from "@/components/ui/input";


type Props = {
  dashboardTableData?: formDataType[];
  TableTitle?: string;
  divisionCode?: string;
};

const useDebounce = (value: any, delay: any) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const GRWaiverDashboardTable = ({ dashboardTableData = [], TableTitle, divisionCode }: Props) => {

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [table, setTable] = useState<formDataType[]>([]);
  const router = useRouter();

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '-';
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) return '-';

    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const debouncedSearchName = useDebounce(searchTerm, 300);
  const [total_event_list, settotalEventList] = useState(0);
  const [record_per_page, setRecordPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    fetchTable();
  }, [divisionCode, debouncedSearchName, currentPage]);

  const handlesearchname = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchTerm(value);
  };

  const fetchTable = async () => {
    let filter: any = {};

    if (divisionCode !== "ALL") {
      filter.division = divisionCode;
    }

    if (debouncedSearchName) {
      filter.party = debouncedSearchName;
    }

    const api = `${API_END_POINTS.GRwaiverDashboardTable}?filters=${JSON.stringify(filter)}`;

    const response: AxiosResponse = await requestWrapper({
      url: api,
      method: "GET",
    });

    if (response?.status === 200) {
      setTable(response?.data?.message?.data || []);
      settotalEventList(response?.data?.message?.Pagination?.total_count || 0);
      setRecordPerPage(10);

    }
  };

  const onNewGR = () => {
    router.push("/gr-waiver");
  };

  return (
    <>
      <div className="shadow- bg-[#f6f6f7] p-4 rounded-2xl">
        <div className="flex w-full items-center justify-between pb-4 gap-4">
          {/* Title */}
          <h1 className="text-[20px] text-[#03111F] font-semibold whitespace-nowrap">
            {TableTitle ?? "GR Waiver List"}
          </h1>

          {/* Search Bar (Center) */}
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Search by Vendor / Party..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[300px] p-2 border border-gray-300 rounded-lg"
            />

            {/* Button */}
            <Button
              type="button"
              variant={"nextbtn"}
              size={"nextbtnsize"}
              className="py-2 flex items-center gap-2"
              onClick={onNewGR}
            >
              <Plus className="w-5 h-5" />
              New GR Waiver
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
              <TableHead className="text-black text-center">Sr No.</TableHead>
              <TableHead className="text-black text-center">Company</TableHead>
              <TableHead className="text-black text-center">GR Waiver No.</TableHead>
              <TableHead className="text-black text-center">GR Waiver Date</TableHead>
              <TableHead className="text-black text-center">Vendor</TableHead>
              <TableHead className="text-black text-center">SAP Status</TableHead>
              <TableHead className="text-black text-center">View GR Waiver</TableHead>
              <TableHead className="text-black text-center">View Invoice</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {table.length > 0 ? (
              table.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center">{(currentPage - 1) * record_per_page + index + 1}</TableCell>
                  <TableCell className="text-center">{item.division}</TableCell>
                  <TableCell className="text-center">{item.name}</TableCell>
                  <TableCell className="text-center">{formatDate(item.tentative_closer_date)}</TableCell>
                  <TableCell className="text-center">{item.party}</TableCell>
                  <TableCell className="text-center">{item.status}</TableCell>

                  <TableCell className="text-center">
                    <Link href={`/gr-waiver?gr_name=${item.name}`}>
                      <Button
                        variant={"nextbtn"}
                        size={"nextbtnsize"}
                        className="py-2 rounded-[10px]"
                      >
                        View
                      </Button>
                    </Link>
                  </TableCell>

                  <TableCell className="text-center">
                    {item.declaration__letter ? (
                      <Link
                        href={
                          typeof item.declaration__letter === "string"
                            ? item.declaration__letter
                            : item.declaration__letter?.full_url ?? "#"
                        }
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
                  No GR Waiver found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination currentPage={currentPage} record_per_page={record_per_page} setCurrentPage={setCurrentPage} total_event_list={total_event_list} />
    </>
  );
}

export default GRWaiverDashboardTable;


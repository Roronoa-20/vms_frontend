"use client"
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/atoms/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/atoms/select";
import { Input } from "../atoms/input";
import { DashboardTableType, TPRInquiryTable } from "@/src/types/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useAuth } from "@/src/context/AuthContext";
import Pagination from "./Pagination";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import API_END_POINTS from "@/src/services/apiEndPoints";


type Props = {
  dashboardTableData?: TPRInquiryTable["cart_details"]
  companyDropdown: { description: string; name: string; }[]
}

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

const DashboardPurchaseInquiryVendorsTable = ({ dashboardTableData, companyDropdown }: Props) => {

  // console.log("DashboardTableData PPRRRPRR--->", dashboardTableData);
  const { designation } = useAuth();

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const [table, setTable] = useState<DashboardTableType["cart_details"]>(dashboardTableData || []);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [total_event_list, settotalEventList] = useState(0);
  const [record_per_page, setRecordPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const user = Cookies?.get("user_id");
  console.log(user, "this is user");

  const debouncedSearchName = useDebounce(search, 300);

  useEffect(() => {
    fetchTable();
  }, [debouncedSearchName, selectedCompany, currentPage])

  const fetchTable = async () => {
    const dashboardPurchaseEnquiryTableDataApi: AxiosResponse = await requestWrapper({
      url: `${API_END_POINTS?.prInquiryDashboardTable}?usr=${user}&company=${selectedCompany ?? ""}&cart_id=${debouncedSearchName ?? ""}&page_no=${currentPage}&page_length=${record_per_page}`,
      method: "GET",
    });
    if (dashboardPurchaseEnquiryTableDataApi?.status == 200) {
      setTable(dashboardPurchaseEnquiryTableDataApi?.data?.message?.cart_details);
      settotalEventList(dashboardPurchaseEnquiryTableDataApi?.data?.message?.total_count);
    }
  };

  const handleSelectChange = (
    value: string,
    setter: (val: string) => void
  ) => {
    if (value === "--Select--") {
      setter("");
    } else {
      setter(value);
    }
  };

  return (
    <>
      <div className="shadow- bg-[#f6f6f7] p-4 rounded-2xl">
        <div className="flex w-full justify-between pb-4">
          <h1 className="text-[20px] text-[#03111F] font-semibold">
            Purchase Enquiry
          </h1>
          <div className="flex gap-4">
            <Input
              placeholder="Search Cart-ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select
              value={selectedCompany}
              onValueChange={(value) => handleSelectChange(value, setSelectedCompany)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="w-full">
                  <SelectItem value="--Select--">All</SelectItem>
                  {
                    companyDropdown?.map((item, index) => (
                      <SelectItem key={index} value={item?.name}>{item?.description}</SelectItem>
                    ))
                  }
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="max-h-[110vh]">
          <Table className="">
            <TableHeader className="text-center">
              <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
                <TableHead className="text-center text-black whitespace-nowrap">Sr No.</TableHead>
                <TableHead className="text-center text-black whitespace-nowrap">Cart ID</TableHead>
                <TableHead className="text-center text-black whitespace-nowrap">Cart Date</TableHead>
                <TableHead className="text-center text-black whitespace-nowrap">Company</TableHead>
                {designation !== "Enquirer" && (
                  <TableHead className="text-center text-black whitespace-nowrap">Created By</TableHead>
                )}
                <TableHead className="text-center text-black whitespace-nowrap">View Cart</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-center text-black">
              {table ? (
                table?.map((item, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium text-center whitespace-nowrap">{(currentPage - 1) * record_per_page + index + 1}</TableCell>
                      <TableCell className="text-nowrap text-center whitespace-nowrap">{item?.name}</TableCell>
                      <TableCell className="text-nowrap text-center whitespace-nowrap">{item?.cart_date ? formatDate(new Date(item.cart_date)) : "-"}</TableCell>
                      <TableCell className="text-nowrap text-center whitespace-nowrap">{item?.company}</TableCell>
                      {designation !== "Enquirer" && (
                        <TableCell className="text-nowrap text-center whitespace-nowrap">{item?.created_by_user_name}</TableCell>
                      )}
                      <TableCell className="text-nowrap text-center whitespace-nowrap"><Link href={`${designation == "Enquirer" ? `/pr-enquiry?cart_id=${item?.name}` : `view-pr-enquiry?cart_id=${item?.name}`}`}><Button className="bg-[#5291CD] text-white hover:bg-white hover:text-black rounded-[16px]">View</Button></Link></TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-gray-500 py-4">
                    No results found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

          </Table>
        </div>
      </div>
      <Pagination currentPage={currentPage} record_per_page={record_per_page} setCurrentPage={setCurrentPage} total_event_list={total_event_list} />
    </>
  );
};

export default DashboardPurchaseInquiryVendorsTable;

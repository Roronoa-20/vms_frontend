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

const DashboardPurchaseInquiryVendorsTable = ({ dashboardTableData }: Props) => {

  console.log("DashboardTableData PPRRRPRR--->", dashboardTableData);
  const { designation } = useAuth();
  const [table, setTable] = useState<DashboardTableType["cart_details"]>(dashboardTableData || []);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [total_event_list, settotalEventList] = useState(0);
  const [record_per_page, setRecordPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedPurchaseType, setSelectedPurchaseType] = useState<string>("");
  const user = Cookies?.get("user_id");

  const debouncedSearchName = useDebounce(search, 300);

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    fetchTable();
  }, [debouncedSearchName, selectedCompany, currentPage])

  const fetchTable = async () => {
    const dashboardPurchaseEnquiryTableDataApi: AxiosResponse = await requestWrapper({
      url: `${API_END_POINTS?.prInquiryDashboardTable}?usr=${user}&company=${selectedCompany}&vendor_name=${search}&page_no=${currentPage}&page_length=${record_per_page}`,
      method: "GET",
    });
    if (dashboardPurchaseEnquiryTableDataApi?.status == 200) {
      setTable(dashboardPurchaseEnquiryTableDataApi?.data?.message?.cart_details);
      settotalEventList(dashboardPurchaseEnquiryTableDataApi?.data?.message?.total_count);
    }
  };
  const purchaseTypes = Array.from(new Set(dashboardTableData?.map(item => item.purchase_type))) || [];

  const filteredTable = table.filter(item => {
    const matchesSearch =
      item?.created_by_user_name?.toLowerCase().includes(debouncedSearchName.toLowerCase()) ||
      item?.name?.toLowerCase().includes(debouncedSearchName.toLowerCase());
    const matchesPRType =
      !selectedPurchaseType || selectedPurchaseType === "All" ? true : item.purchase_type === selectedPurchaseType;

    return matchesSearch && matchesPRType;
  });

  // 1️⃣ Calculate paginated rows from filteredTable
  const startIndex = (currentPage - 1) * record_per_page;
  const endIndex = startIndex + record_per_page;
  const paginatedTable = filteredTable.slice(startIndex, endIndex);

  // 2️⃣ Adjust total count for pagination
  const totalFilteredCount = filteredTable.length;



  return (
    <>
      <div className="shadow- bg-[#f6f6f7] p-3 rounded-2xl mb-4 flex gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <h1 className="text-[16px]">Filter by Requisition Type:</h1>
          <Select value={selectedPurchaseType} onValueChange={setSelectedPurchaseType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by PR Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="All">All</SelectItem>
                {purchaseTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Table className="">
          <TableHeader className="text-center">
            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
              <TableHead className="text-center text-black whitespace-nowrap">Sr No.</TableHead>
              <TableHead className="text-center text-black whitespace-nowrap">Ref No.</TableHead>
              <TableHead className="text-center text-black whitespace-nowrap">Cart Date</TableHead>
              {designation !== "Enquirer" && (
                <TableHead className="text-center text-black whitespace-nowrap">Created By</TableHead>
              )}
              <TableHead className="text-center text-black whitespace-nowrap">Transfer Status</TableHead>
              <TableHead className="text-center text-black whitespace-nowrap">Category Type</TableHead>
              <TableHead className="text-center text-black whitespace-nowrap">PR Type</TableHead>
              <TableHead className="text-center text-black whitespace-nowrap">Purchase Team Status</TableHead>
              <TableHead className="text-center text-black whitespace-nowrap">HOD Status</TableHead>
              <TableHead className="text-center text-black whitespace-nowrap">Additional Status</TableHead>
              <TableHead className="text-center text-black whitespace-nowrap">View Cart</TableHead>
              <TableHead className={`text-center text-black whitespace-nowrap`}>Raise PR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-center text-black">
            {paginatedTable.length > 0 ? (
              paginatedTable.map((item, index) => {
                const url = item?.asked_to_modify
                  ? `/pr-inquiry?cart_Id=${item?.name}`
                  : `/view-pr-inquiry?cart_Id=${item?.name}`;
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-center whitespace-nowrap">{(currentPage - 1) * record_per_page + index + 1}</TableCell>
                    <TableCell className="text-nowrap text-center whitespace-nowrap">{item?.name}</TableCell>
                    <TableCell className="text-nowrap text-center whitespace-nowrap">{item?.cart_date ? formatDate(new Date(item.cart_date)) : "-"}</TableCell>
                    {designation !== "Enquirer" && (
                      <TableCell className="text-nowrap text-center whitespace-nowrap">{item?.created_by_user_name}</TableCell>
                    )}
                    <TableCell className="text-center whitespace-nowrap">
                      <div
                        className={`px-2 py-3 rounded-xl uppercase ${item?.transfer_status === "Not Transferred"
                          ? "bg-yellow-100 text-yellow-800"
                          : item?.transfer_status === "Transferred"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {item?.transfer_status}
                      </div>
                    </TableCell>
                    <TableCell className="text-nowrap text-center whitespace-nowrap">{item?.category_type}</TableCell>
                    <TableCell className="text-nowrap text-center whitespace-nowrap">{item?.purchase_type}</TableCell>
                    <TableCell className="text-center whitespace-nowrap">
                      <div
                        className={`px-2 py-3 rounded-xl uppercase ${item?.purchase_team_approval_status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : item?.purchase_team_approval_status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {item?.purchase_team_approval_status}
                      </div>
                    </TableCell>
                    <TableCell className="text-center whitespace-nowrap">
                      <div
                        className={`px-2 py-3 rounded-xl uppercase ${item?.hod_approval_status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : item?.hod_approval_status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {item?.hod_approval_status}
                      </div>
                    </TableCell>
                    <TableCell className="text-center whitespace-nowrap">
                      <div
                        className={`px-2 py-3 rounded-xl uppercase ${item?.second_stage_approval_status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : item?.second_stage_approval_status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {item?.second_stage_approval_status}
                      </div>
                    </TableCell>
                    <TableCell className="text-nowrap text-center whitespace-nowrap"><Link href={url}><Button className="bg-[#5291CD] text-white hover:bg-white hover:text-black rounded-[16px]">View</Button></Link></TableCell>
                    <TableCell
                      className={`text-nowrap text-center whitespace-nowrap ${item?.pr_button_show ? "" : "hidden"
                        }`}
                    >
                      {item?.pr_created ? (
                        <Link href={`/pr-request?cart_id=${item?.name}&pur_req=${item?.pur_req}`}>
                          <Button className="bg-[#5291CD] text-white hover:bg-white hover:text-black rounded-[16px]">View PR</Button>
                        </Link>
                      ) : (
                        <Link href={`/pr-request?cart_id=${item?.name}`}>
                          <Button className="bg-[#5291CD] text-white hover:bg-white hover:text-black rounded-[16px]">PR</Button>
                        </Link>
                      )}
                    </TableCell>
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
      </div >
      <Pagination
        currentPage={currentPage}
        record_per_page={record_per_page}
        setCurrentPage={setCurrentPage}
        total_event_list={totalFilteredCount}
      />
    </>
  );
};

export default DashboardPurchaseInquiryVendorsTable;
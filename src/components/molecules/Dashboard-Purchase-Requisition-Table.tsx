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
import { DashboardTableType, PurchaseRequisition, TPRInquiryTable } from "@/src/types/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import Pagination from "./Pagination";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import API_END_POINTS from "@/src/services/apiEndPoints";

type Props = {
  dashboardTableData?: PurchaseRequisition[]
  companyDropdown: { description: string; name: string }[]
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

const DashboardPurchaseRequisitionVendorsTable = ({ dashboardTableData, companyDropdown }: Props) => {

  const [table, setTable] = useState<PurchaseRequisition[]>(dashboardTableData || []);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [total_event_list, settotalEventList] = useState(0);
  const [record_per_page, setRecordPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const user = Cookies?.get("user_id");
  console.log(user, "this is user");

  const debouncedSearchName = useDebounce(search, 300);

  useEffect(() => {
    fetchTable();
  }, [debouncedSearchName, selectedCompany, currentPage])


  const handlesearchname = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(value, "this is search name")
    setSearch(value);
  }

  const fetchTable = async () => {
    const dashboardPRTableDataApi: AxiosResponse = await requestWrapper({
      url: `${API_END_POINTS?.prTableData}?usr=${user}&company=${selectedCompany}&cart_id=${search}&page_no=${currentPage}&page_length=${record_per_page}`,
      method: "GET",
    });
    if (dashboardPRTableDataApi?.status == 200) {
      setTable(dashboardPRTableDataApi?.data?.message?.data);
      settotalEventList(dashboardPRTableDataApi?.data?.message?.total_count);
      settotalEventList(dashboardPRTableDataApi?.data?.message?.total_count);
      // setRecordPerPage(dashboardPRTableDataApi?.data?.message?.rejected_vendor_onboarding?.length);
      setRecordPerPage(5)
    }
  };

  const handleSelectChange = (
    value: string,
    setter: (val: string) => void
  ) => {
    if (value === "--Select--") {
      setter(""); // reset filter
    } else {
      setter(value);
    }
  };


  console.log(table, "this is table");

  return (
    <>
      <div className="shadow- bg-[#f6f6f7] p-4 rounded-2xl">
        <div className="flex w-full justify-between pb-4">
          <h1 className="text-[20px] text-[#03111F] font-semibold">
            Purchase Requisition Request
          </h1>
          <div className="flex gap-4">
            <Input placeholder="Search..." onChange={(e) => { handlesearchname(e) }} />
            <Select
              value={selectedCompany}
              onValueChange={(value) => handleSelectChange(value, setSelectedCompany)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="w-full">
                  <SelectItem value="--Select--">--Select--</SelectItem>
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
        <div className="max-h-[55vh]">
          <Table className="">
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader className="text-center">
              <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
                <TableHead className="text-center text-black">Sr No.</TableHead>
                <TableHead className="text-center text-black">Ref No.</TableHead>
                <TableHead className="text-center text-black">Cart</TableHead>
                <TableHead className="text-center text-black">Plant</TableHead>
                <TableHead className="text-center text-black">Company</TableHead>
                <TableHead className="text-center text-black text-nowrap">Purchase Group</TableHead>
                <TableHead className="text-center text-black">Requisitioner</TableHead>
                <TableHead className="text-center text-black text-nowrap">Purchase Head</TableHead>
                <TableHead className="text-center text-black">HOD</TableHead>
                <TableHead className="text-center text-black text-nowrap">View Cart</TableHead>
                <TableHead className="text-center text-black">View PR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-center">
              {table ? (
                table?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-center">{index + 1}</TableCell>
                    <TableCell className="text-nowrap text-center">{item?.name}</TableCell>
                    <TableCell className="text-nowrap text-center">{item?.cart_details_id}</TableCell>
                    <TableCell className="text-nowrap text-center">{item?.plant}</TableCell>
                    <TableCell className="text-nowrap text-center">{item?.company}</TableCell>
                    <TableCell className="text-nowrap text-center">{item?.purchase_group}</TableCell>
                    <TableCell className="text-nowrap text-center">{item?.requisitioner}</TableCell>
                    {/* <TableCell className="text-nowrap text-center">{item?.purchase_head_status}</TableCell> */}
                    <TableCell>
                      <div
                        className={`text-center px-2 py-3 rounded-xl ${item?.purchase_head_status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : item?.purchase_head_status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {item?.purchase_head_status || "--"}
                      </div>
                    </TableCell>
                    {/* <TableCell className="text-nowrap text-center">{item?.hod_approval_status}</TableCell> */}
                    <TableCell>
                      <div
                        className={`text-center px-2 py-3 rounded-xl ${item?.hod_approval_status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : item?.hod_approval_status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {item?.hod_approval_status || "--"}
                      </div>
                    </TableCell>
                    <TableCell className="text-nowrap text-center"><Link href={`/view-pr?pur_req=${item?.name}`}><Button className="bg-[#5291CD] text-white hover:bg-white hover:text-black rounded-[16px]" >View</Button></Link></TableCell>
                    {/* <TableCell>
                  <div
                    className={`px-2 py-3 rounded-xl ${item?.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : item?.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                  >
                    {item?.status}
                  </div>
                </TableCell> */}
                    <TableCell
                      className={`text-nowrap text-center whitespace-nowrap`}
                    >
                      <Link href={`/pr-request?cart_id=${item?.cart_details_id}&pur_req=${item?.name}`}>
                        <Button className="bg-[#5291CD] text-white hover:bg-white hover:text-black rounded-[16px]">View PR</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
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

export default DashboardPurchaseRequisitionVendorsTable;

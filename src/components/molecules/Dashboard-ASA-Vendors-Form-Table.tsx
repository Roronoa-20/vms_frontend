"use client"
import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/atoms/table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/src/components/atoms/select";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "../atoms/input";
import { ASAFormResponse, TvendorRegistrationDropdown, ASAForm } from "@/src/types/types";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import API_END_POINTS from "@/src/services/apiEndPoints";
import Pagination from "./Pagination";

type Props = {
  dashboardTableData: ASAFormResponse;
  companyDropdown: TvendorRegistrationDropdown["message"]["data"]["company_master"]
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

const DashboardASAVendorFormTable = ({ dashboardTableData, companyDropdown }: Props) => {
  console.log("Dashboard tabe ASA---->", dashboardTableData)

  const [table, setTable] = useState<ASAForm[]>(dashboardTableData?.data || []);
  const [selectedCompany, setSelectedCompany] = useState<string>("")
  const [search, setSearch] = useState<string>("");

  const [total_event_list, settotalEventList] = useState(0);
  const [record_per_page, setRecordPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);

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
    const dashboardASAOnboardedVendorTableDataApi: AxiosResponse = await requestWrapper({
      url: `${API_END_POINTS?.asavendorListdashboard}?vendor_name=${search}&page_no=${currentPage}&page_size=${record_per_page}`,
      method: "GET",
    });
    console.log("Response--------->", dashboardASAOnboardedVendorTableDataApi)
    if (dashboardASAOnboardedVendorTableDataApi?.status == 200) {
      setTable(dashboardASAOnboardedVendorTableDataApi?.data?.message?.data);
      settotalEventList(dashboardASAOnboardedVendorTableDataApi?.data?.message?.overall_total_asa)
      setRecordPerPage(5);
    }
  };


  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '-';
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) return '-';

    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();

    return `${day}-${month}-${year}`;
  };


  return (
    <>
      <div className="shadow- bg-[#f6f6f7] p-4 rounded-2xl">
        <div className="flex w-full justify-between pb-4">
          <h1 className="text-[20px] text-[#03111F] font-semibold">
            Submitted ASA Form
          </h1>
          <div className="flex gap-4">
            <Input
              placeholder="Search Vendor Name..."
              value={search}
              onChange={handlesearchname}
            />
            {/* <Select onValueChange={(value) => { setSelectedCompany(value) }}>
              <SelectTrigger className="w-96">
                <SelectValue placeholder="Select Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="w-full">
                  {
                    companyDropdown?.map((item, index) => (
                      <SelectItem key={index} value={item?.name}>{item?.description}</SelectItem>
                    ))
                  }
                </SelectGroup>
              </SelectContent>
            </Select> */}
          </div>
        </div>
        <Table>
          <TableHeader className="text-center">
            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
              <TableHead className="w-[80px]">Sr No.</TableHead>
              <TableHead className="text-center">Ref No.</TableHead>
              <TableHead className="text-center">Vendor Name</TableHead>
              <TableHead className="text-center">Vendor Ref No</TableHead>
              <TableHead className="text-center">Form Submitted On</TableHead>
              <TableHead className="text-center">View Detials</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-center">
            {table.length > 0 ? (
              table.map((item, index) => (
                <TableRow key={item.name}>
                  <TableCell>{(currentPage - 1) * record_per_page + index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.vendor_name}</TableCell>
                  <TableCell>{item.vendor_ref_no}</TableCell>
                  <TableCell className="text-center">{formatDate(item?.creation)}</TableCell>
                  <TableCell className="text-center">
                    <Link href={`/view-asa-form?tabtype=company_information&vms_ref_no=${item?.vendor_ref_no}`}
                      onClick={() => {
                        if (item?.vendor_name) {
                          localStorage.setItem("vendor_name", item.vendor_name);
                        }
                      }}>
                      <Button variant={"nextbtn"} size={"nextbtnsize"} className="py-2.5 text-white hover:bg-white hover:border hover:border-[#5291CD] hover:text-black">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination
        currentPage={currentPage}
        record_per_page={record_per_page}
        setCurrentPage={setCurrentPage}
        total_event_list={total_event_list}
      />
    </>
  );
};

export default DashboardASAVendorFormTable;

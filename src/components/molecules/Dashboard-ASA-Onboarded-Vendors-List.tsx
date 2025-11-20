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
import { DashboardTableType, TvendorRegistrationDropdown, VendorOnboarding, ASAFormResponse, ASAForm } from "@/src/types/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PopUp from "./PopUp";
import { useAuth } from "@/src/context/AuthContext";
import Cookies from "js-cookie";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import API_END_POINTS from "@/src/services/apiEndPoints";
import Pagination from "./Pagination";

type Props = {
  dashboardTableData?: DashboardTableType["asa_form_data"]
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

const DashboardApprovedVendorsTable = ({ dashboardTableData }: Props) => {
  console.log(dashboardTableData, "this is approved table onboarded")

  const handleClose = () => {
    setIsVendorCodeDialog(false);
    setSelectedVendorcodes([]);
  };

  const [isVendorCodeDialog, setIsVendorCodeDialog] = useState<boolean>();
  const [selectedVendorCodes, setSelectedVendorcodes] = useState<ASAForm["company_vendor_codes"]>([]);

  const openVendorCodes = (data: any) => {
    setSelectedVendorcodes(data);
    setIsVendorCodeDialog(true);
  };

  const [table, setTable] = useState<ASAForm[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("")
  const [search, setSearch] = useState<string>("");

  const [total_event_list, settotalEventList] = useState(0);
  const [record_per_page, setRecordPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const user = Cookies?.get("user_id");

  const debouncedSearchName = useDebounce(search, 300);

  useEffect(() => {
    fetchTable();
  }, [debouncedSearchName, selectedCompany, currentPage])


  const handlesearchname = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearch(value);
  }

  const fetchTable = async () => {
    const dashboardASAOnboardedVendorTableDataApi: AxiosResponse = await requestWrapper({
      url: `${API_END_POINTS?.asaonboardedvendorlist}?vendor_name=${search}&page_no=${currentPage}&page_size=${record_per_page}`,
      method: "GET",
    });
    if (dashboardASAOnboardedVendorTableDataApi?.status == 200) {
      setTable(dashboardASAOnboardedVendorTableDataApi?.data?.message?.approved_vendors);
      settotalEventList(dashboardASAOnboardedVendorTableDataApi?.data?.message?.overall_count)
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

  if (!dashboardTableData) { return <div>Loading...</div>; }


  return (
    <>
      <div className="shadow- bg-[#f6f6f7] p-4 rounded-2xl">
        <div className="flex w-full justify-between pb-4">
          <h1 className="text-[20px] text-[#03111F] font-semibold">
            Onboarded Vendors List
          </h1>
          <div className="flex gap-4">
            <Input placeholder="Search..." onChange={(e) => { handlesearchname(e) }} />
            {/* <Select>
              <SelectTrigger>
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
              <TableHead className="w-[100px]">Sr No.</TableHead>
              <TableHead className="text-center">Ref No.</TableHead>
              <TableHead className="text-center">Vendor Name</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-center">Vendor Code</TableHead>
              <TableHead className="text-center">Country</TableHead>
              <TableHead className="text-center">Register By</TableHead>
              <TableHead className="text-center">Register Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-center">
            {table ? (
              table?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{(currentPage - 1) * record_per_page + index + 1}</TableCell>
                  <TableCell className="text-nowrap">{item?.name}</TableCell>
                  <TableCell className="text-nowrap">{item?.vendor_name}</TableCell>
                  <TableCell className="text-nowrap">{item?.office_email_primary}</TableCell>
                  <TableCell><Button className="bg-blue-400 hover:bg-blue-300 rounded-[24px] font-semibold" onClick={() => { openVendorCodes(item?.company_vendor_codes) }}>View</Button></TableCell>
                  <TableCell>{item?.country}</TableCell>
                  <TableCell>{item?.register_by_emp}</TableCell>
                  <TableCell>{formatDate(item?.registered_date)}</TableCell>
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
      {
        isVendorCodeDialog &&
        <PopUp handleClose={handleClose}>
          <div className="max-h-[250px] overflow-y-auto mt-3 pr-2">
            <Table>
              <TableHeader className="bg-blue-200">
                <TableRow>
                  <TableHead className="text-black text-center">State</TableHead>
                  <TableHead className="text-black text-center">GST No.</TableHead>
                  <TableHead className="text-black text-center">Vendor Code</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedVendorCodes?.map((company) => (
                  <React.Fragment key={company.company_code}>
                    <TableRow className="bg-gray-700 hover:bg-gray-700 text-white font-semibold">
                      <TableCell colSpan={3}>Company Code: {company.company_code}</TableCell>
                    </TableRow>
                    {company.vendor_codes.map((vendor, vIdx) => (
                      <TableRow
                        key={vIdx}
                        className={vIdx % 2 === 0 ? "bg-gray-100" : ""}
                      >
                        <TableCell className="text-black text-center">{vendor.state}</TableCell>
                        <TableCell className="text-black text-center">{vendor.gst_no}</TableCell>
                        <TableCell className="text-black text-center">{vendor.vendor_code || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </PopUp>
      }
      <Pagination currentPage={currentPage} record_per_page={record_per_page} setCurrentPage={setCurrentPage} total_event_list={total_event_list} />
    </>
  );
};

export default DashboardApprovedVendorsTable;

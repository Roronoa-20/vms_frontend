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
import { tableData } from "@/src/constants/dashboardTableData";
import { Input } from "../atoms/input";
import { DashboardTableType, TvendorRegistrationDropdown, VendorOnboarding } from "@/src/types/types";
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
  dashboardTableData?: DashboardTableType["approved_vendor_onboarding"]
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

const DashboardApprovedVendorsTable = ({ dashboardTableData, companyDropdown }: Props) => {
  console.log(dashboardTableData, "this is approved table onboarded")

  const { designation } = useAuth();
  const isAccountsUser = designation?.toLowerCase().includes("account");
  const handleClose = () => {
    setIsVendorCodeDialog(false);
    setSelectedVendorcodes([]);
  }
  const [isVendorCodeDialog, setIsVendorCodeDialog] = useState<boolean>();
  const [selectedVendorCodes, setSelectedVendorcodes] = useState<VendorOnboarding["company_vendor_codes"]>([]);

  const openVendorCodes = (data: any) => {
    setSelectedVendorcodes(data);
    setIsVendorCodeDialog(true);
  };

  const [table, setTable] = useState<DashboardTableType["approved_vendor_onboarding"]>(dashboardTableData || []);
  const [selectedCompany, setSelectedCompany] = useState<string>("")
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
    const dashboardApprovedVendorTableDataApi: AxiosResponse = await requestWrapper({
      url: `${API_END_POINTS?.dashboardApprovedVendorTableURL}?usr=${user}&company=${selectedCompany}&refno=${search}&page_no=${currentPage}&page_size=${record_per_page}`,
      method: "GET",
    });
    if (dashboardApprovedVendorTableDataApi?.status == 200) {
      setTable(dashboardApprovedVendorTableDataApi?.data?.message?.approved_vendor_onboarding
      );
      settotalEventList(dashboardApprovedVendorTableDataApi?.data?.message?.total_count);
      settotalEventList(dashboardApprovedVendorTableDataApi?.data?.message?.total_count)
      // setRecordPerPage(dashboardApprovedVendorTableDataApi?.data?.message?.approved_vendor_onboarding?.length)
      setRecordPerPage(5);
    }
  };

  if (!dashboardTableData) { return <div>Loading...</div>; }


  return (
    <>
      <div className="shadow- bg-[#f6f6f7] p-4 rounded-2xl">
        <div className="flex w-full justify-between pb-4">
          <h1 className="text-[20px] text-[#03111F] font-semibold">
            Total OnBoarded Vendors
          </h1>
          <div className="flex gap-4">
            <Input placeholder="Search..." />
            <Select>
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
            </Select>
            {/* <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select> */}
          </div>
        </div>
        <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader className="text-center">
            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
              <TableHead className="w-[100px]">Sr No.</TableHead>
              <TableHead>Ref No.</TableHead>
              <TableHead>Vendor Name</TableHead>
              <TableHead className="text-center">Company Name</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Vendor Code</TableHead>
              <TableHead className="text-center">Country</TableHead>
              <TableHead className="text-center">Register By</TableHead>
              <TableHead className="text-center">View Details</TableHead>
              {!isAccountsUser && (
                <TableHead className="text-center">QMS Form</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody className="text-center">
            {table ? (
              table?.map((item, index) => (
                <TableRow key={index}>
                   <TableCell className="font-medium">{(currentPage - 1) * record_per_page + index + 1}</TableCell>
                  <TableCell className="text-nowrap">{item?.name}</TableCell>
                  <TableCell className="text-nowrap">{item?.vendor_name}</TableCell>
                  <TableCell className="text-nowrap">{item?.company_name}</TableCell>
                  <TableCell>
                    <div
                      className={`px-2 py-3 rounded-xl uppercase ${item?.onboarding_form_status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : item?.onboarding_form_status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                        }`}
                    >
                      {item?.onboarding_form_status}
                    </div>
                  </TableCell>
                  <TableCell><Button className="bg-blue-400 hover:bg-blue-300" onClick={() => { openVendorCodes(item?.company_vendor_codes) }}>View</Button></TableCell>
                  <TableCell>{item?.vendor_country}</TableCell>
                  <TableCell>{item?.registered_by}</TableCell>
                  <TableCell><Link href={`/view-onboarding-details?tabtype=Certificate&vendor_onboarding=${item?.name}&refno=${item?.ref_no}`}><Button className="bg-blue-400 hover:bg-blue-300">View</Button></Link></TableCell>
                  {!isAccountsUser && (
                    <TableCell><div className={`${(item?.qms_form_filled && item?.sent_qms_form_link) && (item?.company_name == "2000" || item?.company_name == "7000") ? "" : "hidden"}`}><Link href={`/qms-form-details?tabtype=vendor_information&vendor_onboarding=${item?.name}&ref_no=${item?.ref_no}&company_code=${item?.company_name}`}><Button variant={"outline"}>View</Button></Link></div></TableCell>
                  )}
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>State</TableHead>
                <TableHead>GST No</TableHead>
                <TableHead>Vendor Code</TableHead>
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
                      <TableCell>{vendor.state}</TableCell>
                      <TableCell>{vendor.gst_no}</TableCell>
                      <TableCell>{vendor.vendor_code || "-"}</TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </PopUp>
      }
      <Pagination currentPage={currentPage} record_per_page={record_per_page} setCurrentPage={setCurrentPage} total_event_list={total_event_list} />
    </>
  );
};

export default DashboardApprovedVendorsTable;

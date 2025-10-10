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
  const isTreasuryUser = designation?.toLowerCase() === "treasury";

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
      url: `${API_END_POINTS?.dashboardApprovedVendorTableURL}?usr=${user}&company=${selectedCompany}&vendor_name=${search}&page_no=${currentPage}&page_size=${record_per_page}`,
      method: "GET",
    });
    if (dashboardApprovedVendorTableDataApi?.status == 200) {
      setTable(dashboardApprovedVendorTableDataApi?.data?.message?.approved_vendor_onboarding);
      settotalEventList(dashboardApprovedVendorTableDataApi?.data?.message?.total_count)
      setRecordPerPage(5);
    }
  };

  if (!dashboardTableData) { return <div>Loading...</div>; }

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

  const formatApprovalAge = (seconds: string | number) => {
    const sec = Number(seconds);
    if (!sec || sec <= 0) return "-";

    const days = Math.floor(sec / (24 * 3600));
    let remainder = sec % (24 * 3600);
    const hours = Math.floor(remainder / 3600);
    remainder %= 3600;
    const minutes = Math.floor(remainder / 60);
    const secondsLeft = remainder % 60;

    return `${days}d ${hours}h ${minutes}m ${secondsLeft}s`;
  };

  return (
    <>
      <div className="shadow- bg-[#f6f6f7] p-4 rounded-2xl">
        <div className="flex w-full justify-between pb-4">
          <h1 className="text-[20px] text-[#03111F] font-semibold">
            Total OnBoarded Vendors
          </h1>
          <div className="flex gap-4">
            <Input placeholder="Search..." onChange={(e) => { handlesearchname(e) }} />
            <Select
              value={selectedCompany || "all"}
              onValueChange={(value) => setSelectedCompany(value === "all" ? "" : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All</SelectItem>
                  {companyDropdown?.map((item) => (
                    <SelectItem key={item.name} value={item.name}>
                      {item.description}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Table>
          <TableHeader className="text-center">
            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
              <TableHead className="text-center text-black">Sr No.</TableHead>
              <TableHead className="text-center text-black">Ref No.</TableHead>
              <TableHead className="text-center text-black">Vendor Name</TableHead>
              <TableHead className="text-center text-black">Company Code</TableHead>
              <TableHead className="text-center text-black">Status</TableHead>
              <TableHead className="text-center text-black">Aging</TableHead>
              <TableHead className="text-center text-black">Vendor Code</TableHead>
              <TableHead className="text-center text-black">Country</TableHead>
              <TableHead className="text-center text-black">Register By</TableHead>
              <TableHead className="text-center text-black">View Details</TableHead>
              {!isAccountsUser && !isTreasuryUser && (
                <TableHead className="text-center text-black">QMS Form</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody className="text-center">
            {table ? (
              table?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center font-medium">{(currentPage - 1) * record_per_page + index + 1}</TableCell>
                  <TableCell className="text-center text-nowrap">{item?.name}</TableCell>
                  <TableCell className="text-center text-nowrap">{item?.vendor_name}</TableCell>
                  <TableCell className="text-center text-nowrap">{item?.company_name}</TableCell>
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
                  <TableCell className="text-center bg-blue-100 text-blue-800 px-2 py-1 rounded-xl">
                    {formatApprovalAge(item?.approval_age)}
                  </TableCell>
                  <TableCell><Button className="bg-blue-400 hover:bg-blue-300" onClick={() => { openVendorCodes(item?.company_vendor_codes) }}>View</Button></TableCell>
                  <TableCell className="text-center">{item?.vendor_country}</TableCell>
                  <TableCell className="text-center whitespace-nowrap">{item?.registered_by_full_name}</TableCell>
                  <TableCell>
                    <Link
                      href={`/view-onboarding-details?tabtype=${isTreasuryUser ? "Document Detail" : "Company Detail"
                        }&vendor_onboarding=${item?.name}&refno=${item?.ref_no}`}
                    >
                      <Button className="bg-blue-400 hover:bg-blue-300">View</Button>
                    </Link>
                  </TableCell>
                  {/* <TableCell><Link href={`/view-onboarding-details?tabtype=Company Detail&vendor_onboarding=${item?.name}&refno=${item?.ref_no}`}><Button className="bg-blue-400 hover:bg-blue-300">View</Button></Link></TableCell> */}
                  {!isAccountsUser && !isTreasuryUser && (
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
      {isVendorCodeDialog &&
        <PopUp handleClose={handleClose} classname="overflow-y-scroll">
          <Table>
            <TableHeader>
            </TableHeader>
            <TableBody>
              {selectedVendorCodes?.map((company) => (
                <React.Fragment key={company.company_code}>
                  <TableRow className="bg-gray-700 hover:bg-gray-700 text-white font-semibold">
                    <TableCell colSpan={3}>Company Code: {company.company_code}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>State</TableHead>
                    <TableHead>GST No</TableHead>
                    <TableHead>Vendor Code</TableHead>
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

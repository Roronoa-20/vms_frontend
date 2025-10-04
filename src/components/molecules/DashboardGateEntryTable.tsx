"use client"
import React, { useEffect, useState } from "react";
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
import { DashboardTableType, TvendorRegistrationDropdown } from "@/src/types/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import API_END_POINTS from "@/src/services/apiEndPoints";
import Pagination from "./Pagination";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { TableData } from "./GateentryDashboardCards";


type Props = {
  dashboardTableData: TableData[],
  companyDropdown?: TvendorRegistrationDropdown["message"]["data"]["company_master"]
  TableTitle:string
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

const DashboardGateEntryTable = ({ dashboardTableData, companyDropdown,TableTitle }: Props) => {

  const [table, setTable] = useState<TableData[]>(dashboardTableData);
//   const [selectedCompany, setSelectedCompany] = useState<string>("")
  const [search, setSearch] = useState<string>("");

  const [total_event_list, settotalEventList] = useState(0);
  const [record_per_page, setRecordPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const router = useRouter();

  const user = Cookies?.get("user_id");
  console.log(user, "this is user");

//   const debouncedSearchName = useDebounce(search, 300);

//   useEffect(() => {
//     fetchTable();
//   }, [debouncedSearchName, currentPage])


  const handlesearchname = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(value, "this is search name")
    setSearch(value);
  }

//   const fetchTable = async () => {
//     const dashboardPendingVendorTableDataApi: AxiosResponse = await requestWrapper({
//       url: `${API_END_POINTS?.dashboardPendingVendorsAccounts}?usr=${user}&company=${selectedCompany}&vendor_name=${search}&page_no=${currentPage}`,
//       method: "GET",
//     });
//     if (dashboardPendingVendorTableDataApi?.status == 200) {
//       setTable(dashboardPendingVendorTableDataApi?.data?.message?.pending_vendor_onboarding
//       );
//       // settotalEventList(dashboardPendingVendorTableDataApi?.data?.message?.total_count);
//       settotalEventList(dashboardPendingVendorTableDataApi?.data?.message?.total_count)
//       // setRecordPerPage(dashboardPendingVendorTableDataApi?.data?.message?.pending_vendor_onboarding?.length)
//       setRecordPerPage(5);
//     }
//   };

  const handleView = async(refno:string,vendor_Onboarding:string)=>{
    router.push(`/view-onboarding-details?tabtype=Company%20Detail&vendor_onboarding=${vendor_Onboarding}&refno=${refno}`)
  }

  console.log(table, "this is table");
  const { designation } = useAuth();
  const isAccountsUser = designation?.toLowerCase().includes("account");


  return (
    <>
      <div className="shadow- bg-[#f6f6f7] p-4 rounded-2xl">
        <div className="flex w-full justify-between pb-4">
          <h1 className="text-[20px] text-[#03111F] font-semibold">
            {TableTitle}
          </h1>
          <div className="flex gap-4">
            <Input placeholder="Search..." onChange={(e) => { handlesearchname(e) }} />
            {/* <Select onValueChange={(value) => { setSelectedCompany(value) }}>
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
              <TableHead>Gate Entry No.</TableHead>
              <TableHead>Gate Entry Date</TableHead>
              <TableHead className="text-center">Supplier Name</TableHead>
              <TableHead className="text-center">Bill Date</TableHead>
              <TableHead className="text-center">Purchase No.</TableHead>
              <TableHead className="text-center">Purchase Date</TableHead>
              <TableHead className="text-center">View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-center">
            {table ? (
              table?.map((item:any, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{(currentPage - 1) * record_per_page + index + 1}</TableCell>
                  <TableCell className="text-nowrap">{item?.ref_no}</TableCell>
                  <TableCell className="text-nowrap">{item?.vendor_name}</TableCell>
                  <TableCell className="text-nowrap">{item?.company_name}</TableCell>
                  <TableCell>
                    {/* <div
                      className={`px-2 py-3 rounded-xl uppercase ${item?.onboarding_form_status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : item?.onboarding_form_status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                        }`}
                    >
                      {item?.onboarding_form_status}
                    </div> */}
                  </TableCell>
                  <TableCell>{item?.rejected_by_designation}</TableCell>
                  <TableCell>{item?.rejected_by}</TableCell>
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
      <Pagination currentPage={currentPage} record_per_page={record_per_page} setCurrentPage={setCurrentPage} total_event_list={total_event_list} />
    </>
  );
};

export default DashboardGateEntryTable;

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
import { DashboardTableType, PurchaseRequisition, RFQTable, TPRInquiryTable } from "@/src/types/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import API_END_POINTS from "@/src/services/apiEndPoints";
import Pagination from "./Pagination";
type Props = {
  dashboardTableData?: DashboardTableType["sapErrorDashboardData"]
  companyDropdown: { name: string }[]
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

const DashboardSAPErrorTable = ({ dashboardTableData, companyDropdown }: Props) => {
  const [total_event_list, settotalEventList] = useState(0);
  const [record_per_page, setRecordPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [table, setTable] = useState<DashboardTableType["sapErrorDashboardData"]["sap_error_vendor_onboarding"]>(dashboardTableData?.sap_error_vendor_onboarding || []);
  const [search, setSearch] = useState<string>("");
  const debouncedSearchName = useDebounce(search, 300);


  useEffect(() => {
    fetchTable();
  }, [debouncedSearchName,currentPage])

  const handlesearchname = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      console.log(value, "this is search name")
      setSearch(value);
    }


  const fetchTable = async () => {
    const dashboardTableDataApi: AxiosResponse = await requestWrapper({
      url: `${API_END_POINTS?.dashboardSapErrorAcounts}?page_no=${currentPage}&company_name=${search}`,
      method: "GET",
    });
    if (dashboardTableDataApi?.status == 200) {
      setTable(dashboardTableDataApi?.data?.message?.sap_error_vendor_onboarding);
      console.log(dashboardTableDataApi?.data?.message?.sap_error_vendor_onboarding,"this is data")
      settotalEventList(dashboardTableDataApi?.data?.message?.total_count);
      // setRecordPerPage(dashboardPRTableDataApi?.data?.message?.rejected_vendor_onboarding?.length);
      setRecordPerPage(5)
    }
  };


  const handleEmailSent = async(onboardingId:string)=>{
    const response:AxiosResponse = await requestWrapper({url:API_END_POINTS?.sapErrorSendEmail,method:"POST",params:{doctype:"Vendor Onboarding",docname:onboardingId}});
    if(response?.status == 200){
      alert("email sent successfully");
    }else{
      alert("failed to send email");
    }
  }

  return (
    <>

      <div className="shadow- bg-[#f6f6f7] p-4 rounded-2xl">
        <div className="flex w-full justify-between pb-4">
          <h1 className="text-[20px] text-[#03111F] font-semibold">
           Accounts SAP Error Logs
          </h1>
          <div className="flex gap-4">
            <Input placeholder="Search..." onChange={(e)=>{handlesearchname(e)}}/>
            {/* <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Company" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup className="w-full">
            {
              companyDropdown?.map((item,index)=>(
                <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
              ))
            }
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select>
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
        <div className="overflow-y-scroll max-h-[55vh]">
          <Table className="">
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader className="text-center">
              <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
                <TableHead className="">Sr No.</TableHead>
                <TableHead className="text-center">Ref No.</TableHead>
                {/* <TableHead className="text-center">Cart</TableHead> */}
                <TableHead className="text-center">Vendor Name</TableHead>
                <TableHead className="text-center">Company</TableHead>
                <TableHead className="text-center">Accounts Team Approval</TableHead>
                <TableHead className="text-center">Accounts Head Approval</TableHead>
                <TableHead className={`text-center`}>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-center">
              {table?.length > 0 ? (
                table?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-center">{index + 1}</TableCell>
                    <TableCell className="text-nowrap text-center">{item?.name}</TableCell>
                    <TableCell className="text-nowrap text-center">{item?.vendor_name}</TableCell>
                    <TableCell className="text-nowrap text-center">{item?.company_name}</TableCell>
                    <TableCell className="text-nowrap text-center">{item?.accounts_t_approval}</TableCell>
                    <TableCell className="text-nowrap text-center">{item?.accounts_head_approval}</TableCell>
                    <TableCell className="text-nowrap text-center"><Button onClick={()=>{handleEmailSent(item?.name)}}>Send Email</Button></TableCell>
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
            </TableCell>
            <TableCell>{item?.purchase_team}</TableCell>
            <TableCell>{item?.purchase_head}</TableCell>
            <TableCell>{item?.accounts_team}</TableCell>
            <TableCell><Link href={`/vendor-details-form?tabtype=Certificate&vendor_onboarding=${item?.name}&refno=${item?.ref_no}`}><Button variant={"outline"}>View</Button></Link></TableCell>
            <TableCell className="text-right">{item?.qms_form}</TableCell> */}
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

export default DashboardSAPErrorTable;

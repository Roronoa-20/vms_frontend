"use client"
import React, { useState } from "react";
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
import { DashboardTableType, PurchaseRequisition, TPRInquiryTable } from "@/src/types/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import Pagination from "./Pagination";
type Props = {
  dashboardTableData?: PurchaseRequisition[]
  companyDropdown: {name:string}[]
}

const DashboardPurchaseRequisitionVendorsTable = ({ dashboardTableData,companyDropdown }: Props) => {
  const user = Cookies?.get("user_id");
  const [total_event_list, settotalEventList] = useState(0);
    const [record_per_page, setRecordPerPage] = useState<number>(5);
    const [currentPage, setCurrentPage] = useState<number>(1);
  return (
<>
    <div className="shadow- bg-[#f6f6f7] p-4 rounded-2xl">
      <div className="flex w-full justify-between pb-4">
        <h1 className="text-[20px] text-[#03111F] font-semibold">
            Purchase Requisition
        </h1>
        <div className="flex gap-4">
          <Input placeholder="Search..." />
          <Select>
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
              {/* <SelectGroup>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup> */}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="overflow-y-scroll max-h-[55vh]">
      <Table className="">
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader className="text-center">
          <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
            <TableHead className="">Sr No.</TableHead>
            <TableHead className="text-center">Ref No.</TableHead>
            <TableHead className="text-center">Cart</TableHead>
            <TableHead className="text-center">Plant</TableHead>
            <TableHead className="text-center">Company</TableHead>
            <TableHead className="text-center">Purchase Group</TableHead>
            <TableHead className="text-center">Requisitioner</TableHead>
            <TableHead className="text-center">Purchase Head</TableHead>
            <TableHead className="text-center">HOD</TableHead>
            <TableHead className="text-center">Actions</TableHead>
            <TableHead className={`text-center`}></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-center">
          {dashboardTableData ? (
            dashboardTableData?.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium text-center">{index + 1}</TableCell>
                <TableCell className="text-nowrap text-center">{item?.name}</TableCell>
                <TableCell className="text-nowrap text-center">{item?.cart_details_id}</TableCell>
                <TableCell className="text-nowrap text-center">{item?.plant}</TableCell>
                <TableCell className="text-nowrap text-center">{item?.company}</TableCell>
                <TableCell className="text-nowrap text-center">{item?.purchase_group}</TableCell>
                <TableCell className="text-nowrap text-center">{item?.requisitioner}</TableCell>
                <TableCell className="text-nowrap text-center">{item?.purchase_head_status}</TableCell>
                <TableCell className="text-nowrap text-center">{item?.hod_approval_status}</TableCell>
                <TableCell className="text-nowrap text-center"><Link href={`/view-pr?pur_req=${item?.name}`}><Button className="bg-white text-black hover:bg-white hover:text-black">View</Button></Link></TableCell>
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
     {/* <Pagination currentPage={currentPage} record_per_page={record_per_page} setCurrentPage={setCurrentPage} total_event_list={total_event_list} /> */}
     </>
  );
};

export default DashboardPurchaseRequisitionVendorsTable;

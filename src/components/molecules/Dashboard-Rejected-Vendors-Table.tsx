"use client"
import React from "react";
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
import { DashboardTableType } from "@/src/types/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
type Props = {
  dashboardTableData: DashboardTableType["rejected_vendor_onboarding"]
  companyDropdown: {name:string}[]
}

const DashboardRejectedVendorsTable = ({ dashboardTableData,companyDropdown }: Props) => {
  console.log(dashboardTableData,'this is rejected vendor list')
  return (

    <div className="shadow- bg-[#f6f6f7] p-4 rounded-2xl">
      <div className="flex w-full justify-between pb-4">
        <h1 className="text-[20px] text-[#03111F] font-semibold">
          Total Rejected Vendors
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
              <SelectGroup>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader className="text-center">
          <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
            <TableHead>Ref No.</TableHead>
            <TableHead>Vendor Name</TableHead>
            <TableHead className="text-center">Company Name</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Purchase Team</TableHead>
            <TableHead className="text-center">Purchase Head</TableHead>
            <TableHead className="text-center">Account Team</TableHead>
            <TableHead className="text-center">View Details</TableHead>
            <TableHead className="text-center">QMS Form</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-center">
          {dashboardTableData? (
            dashboardTableData?.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="text-nowrap">{item?.name}</TableCell>
                <TableCell className="text-nowrap">{item?.vendor_name}</TableCell>
                <TableCell className="text-nowrap">{item?.company_name}</TableCell>
                <TableCell>
                  <div
                    className={`px-2 py-3 rounded-xl ${item?.onboarding_form_status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : item?.onboarding_form_status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                  >
                    {item?.onboarding_form_status}
                  </div>
                </TableCell>
                <TableCell>{item?.purchase_t_approval}</TableCell>
                <TableCell>{item?.purchase_h_approval}</TableCell>
                <TableCell>{item?.accounts_t_approval}</TableCell>
                <TableCell><Link href={`/view-onboarding-details?tabtype=Company%20Detail&vendor_onboarding=${item?.name}&refno=${item?.ref_no}`}><Button variant={"outline"}>View</Button></Link></TableCell>
                <TableCell className="text-right">{item?.qms_form}</TableCell>
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
  );
};

export default DashboardRejectedVendorsTable;

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
import { DashboardPOTableData, DashboardTableType } from "@/src/types/types";
import Link from "next/link";
import { dispatchTable } from "@/src/types/dispatchTableType";
import PopUp from "./PopUp";
import { Button } from "../atoms/button";
import { useRouter } from "next/navigation";


type Props = {
  dashboardTableData:dispatchTable["dispatches"]
}

const DashboardDispatchVendorsTable = ({ dashboardTableData }: Props) => {
  const [isPrDialog,setIsPrDialog] = useState<boolean>(false);
  const [selectedPrTable,setSelectedPRTable] = useState<string[]>();
  const router = useRouter();
  const handleClose = ()=>{
    setIsPrDialog(false);
  }

  const handlePrClick = (table:string[])=>{
    setSelectedPRTable(table);
    setIsPrDialog(true);
  }

  return (
    <>
    <div className="shadow- bg-[#f6f6f7] p-4 rounded-2xl">
      <div className="flex w-full justify-between pb-4">
        <h1 className="text-[20px] text-[#03111F] font-semibold">
          Total Dispatch Vendors
        </h1>
        {/* <div className="flex gap-4">
          <Input placeholder="Search..." />
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className="w-full">
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
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
        </div> */}
      </div>
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader className="text-center">
          <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
            <TableHead className="text-center">Ref No.</TableHead>
            <TableHead className="text-center">Owner</TableHead>
            <TableHead className="text-center">Invoice Amount</TableHead>
            <TableHead className="text-center">Invoice Date</TableHead>
            <TableHead className="text-center">Invoice Number</TableHead>
            <TableHead className="text-center">status</TableHead>
            <TableHead className="text-center">Purchase Number</TableHead>
            <TableHead className="text-center">View</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-center">
          {dashboardTableData ? (dashboardTableData ?.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item?.name}</TableCell>
                <TableCell>{item?.owner}</TableCell>
                <TableCell>{item?.invoice_amount}</TableCell>
                <TableCell>{item?.invoice_date}</TableCell>
                <TableCell>{item?.invoice_number}</TableCell>
                <TableCell>{item?.status}</TableCell>
                <TableCell><Button className="bg-blue-400 hover:bg-blue-300" onClick={()=>{handlePrClick(item?.purchase_numbers)}}>View Pr</Button></TableCell>
                <TableCell><Button onClick={()=>{router.push(`/dispatch?refno=${item?.name}`)}} className="bg-blue-400 hover:bg-blue-300" >View</Button></TableCell>
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
    {/* Below is the Multiple PR PopUp----------------------------------------------------------------------------------------------- */}
    { isPrDialog &&
      <PopUp handleClose={handleClose} headerText="PR List">
        <Table>
        <TableHeader className="text-center">
          <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
            <TableHead className="text-center">PR No.</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-center">
          {selectedPrTable ? (selectedPrTable?.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item}</TableCell>
                
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
      </PopUp>
    }
    </>
  );
};

export default DashboardDispatchVendorsTable;

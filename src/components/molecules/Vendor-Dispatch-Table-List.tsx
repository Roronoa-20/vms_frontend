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
import { useAuth } from "@/src/context/AuthContext";
import { Plus } from "lucide-react";


type Props = {
  dashboardTableData: dispatchTable["dispatches"]
}

const DashboardDispatchVendorsTable = ({ dashboardTableData }: Props) => {
  const { designation } = useAuth();
  console.log(dashboardTableData, "this is table data")
  const [isPODialog, setIsPODialog] = useState<boolean>(false);
  const [selectedPOTable, setSelectedPOTable] = useState<string[]>();
  const router = useRouter();
  const handleClose = () => {
    setIsPODialog(false);
  }

  const handlePOClick = (table: string[]) => {
    setSelectedPOTable(table);
    setIsPODialog(true);
  }

  return (
    <div className="p-3">
      <div className="shadow- bg-[#f6f6f7] p-4 rounded-2xl">
        <div className="flex w-full justify-between pb-4">
          <h1 className="text-[20px] text-[#03111F] font-semibold">
            All Dispatch Orders
          </h1>
          <Button onClick={() => { router.push("/dispatch") }} className="py-2" variant={"nextbtn"} size={"nextbtnsize"}>
            <Plus size={18} strokeWidth={2.5} />
            Create Dispatch</Button>
        </div>
        <Table>
          <TableHeader className="text-center">
            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
              <TableHead className="text-center text-black">Sr. No.</TableHead>
              <TableHead className="text-center text-black">Ref No.</TableHead>
              <TableHead className="text-center text-black">Owner</TableHead>
              <TableHead className="text-center text-black">Invoice Amount</TableHead>
              <TableHead className="text-center text-black">Invoice Date</TableHead>
              <TableHead className="text-center text-black">Invoice Number</TableHead>
              <TableHead className="text-center text-black">status</TableHead>
              <TableHead className="text-center text-black">PO Number</TableHead>
              <TableHead className="text-center text-black">View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-center">
            {dashboardTableData ? (dashboardTableData?.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="text-center font-medium">{index + 1}</TableCell>
                <TableCell className="text-center whitespace-nowrap">{item?.name}</TableCell>
                <TableCell className="text-center whitespace-nowrap">{item?.owner}</TableCell>
                <TableCell className="text-center whitespace-nowrap">{item?.invoice_amount}</TableCell>
                <TableCell className="text-center whitespace-nowrap">{item?.invoice_date}</TableCell>
                <TableCell className="text-center whitespace-nowrap">{item?.invoice_number}</TableCell>
                <TableCell className="text-center whitespace-nowrap">{item?.status}</TableCell>
                <TableCell>
                  <Button className="py-2 font-medium hover:bg-white hover:text-black" variant={"nextbtn"} size={"nextbtnsize"} onClick={() => { handlePOClick(item?.purchase_numbers) }}>
                    View PO
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant={"nextbtn"} size={"nextbtnsize"} onClick={() => { designation != "Vendor" ? router.push(`/view-dispatch?refno=${item?.name}`) : router.push(`/dispatch?refno=${item?.name}`) }} className="hover:bg-white hover:text-black font-medium">
                    View
                  </Button>
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
      {/* Below is the Multiple PR PopUp----------------------------------------------------------------------------------------------- */}
      {isPODialog &&
        <PopUp handleClose={handleClose} headerText="Purchase Order List">
          <Table>
            <TableHeader className="text-center">
              <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
                <TableHead className="text-center">PO No.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-center">
              {selectedPOTable ? (selectedPOTable?.map((item, index) => (
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
    </div>
  );
};

export default DashboardDispatchVendorsTable;

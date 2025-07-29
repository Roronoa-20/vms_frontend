import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/atoms/table";
import { Input } from "../../../components/atoms/input";
import { VendorDataRFQ, VendorSelectType } from "@/src/types/RFQtype";
import { DropdownData, newVendorTable } from "../../templates/RFQTemplates/LogisticsImportRFQ";
type Props = {
    newVendorTable:newVendorTable[] | null
}
const NewVendorTable = ({newVendorTable}:Props) => {
    console.log(newVendorTable,"this is table data")
    return (
        <div className="shadow- bg-[#f6f6f7] p-4 rounded-2xl">
            <div className="flex w-full justify-between pb-4">
                <h1 className="text-[20px] text-[#03111F] font-semibold text-nowrap">
                    New Vendors
                </h1>
            </div>
            <Table>
                <TableHeader className="text-center">
                    <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
                        <TableHead className="text-center">Vendor Name</TableHead>
                        <TableHead className="text-center">Email</TableHead>
                        <TableHead className="text-center">Mobile</TableHead>
                        <TableHead className="text-center">GST Number</TableHead>
                        <TableHead className="text-center">PAN Number</TableHead>
                        <TableHead className="text-center">Country</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="text-center text-black">
                    {newVendorTable && newVendorTable?.length > 0 ? (
                        newVendorTable.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item?.vendor_name ? item?.vendor_name : '-'}</TableCell>
                                <TableCell>{item?.office_email_primary ?? "-"}</TableCell>
                                <TableCell>{item?.mobile_number ?? "-"}</TableCell>
                                <TableCell>{item?.gst_number ?? "-"}</TableCell>
                                <TableCell>{item?.pan_number ?? "-"}</TableCell>
                                <TableCell className="text-center">{item?.country ?? "-"}</TableCell>
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
    )
}

export default NewVendorTable

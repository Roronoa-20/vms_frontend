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
type Props = {
    VendorList: VendorDataRFQ[];
    loading: boolean;
    setSelectedRows: React.Dispatch<React.SetStateAction<VendorSelectType>>;
    selectedRows: VendorSelectType
    handleVendorSearch: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
}
const SingleSelectVendorTable = ({ VendorList, loading, setSelectedRows, selectedRows, handleVendorSearch }: Props) => {
    const handleRadioChange = (item: VendorDataRFQ) => {
        setSelectedRows({
            vendors: [item], // overwrite with just the selected item
        });
    };


    return (
        <div className="shadow- bg-[#f6f6f7] p-4 rounded-2xl">
            <div className="flex w-full justify-between pb-4">
                <h1 className="text-[20px] text-[#03111F] font-semibold text-nowrap">
                    Total Vendors
                </h1>
                <div className="flex gap-4 justify-end w-full">
                    <div className="w-fit flex gap-4">
                        <Input placeholder="Search..." onChange={(e => { handleVendorSearch(e) })} />
                    </div>
                </div>
            </div>
            <Table>
                <TableHeader className="text-center">
                    <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
                        <TableHead className="w-[100px]">Select</TableHead>
                        <TableHead className="text-center">Ref No.</TableHead>
                        <TableHead className="text-center">Vendor Name</TableHead>
                        <TableHead className="text-center">Vendor Code</TableHead>
                        <TableHead className="text-center">Service Type</TableHead>
                        <TableHead className="text-center">Email</TableHead>
                        <TableHead className="text-center">Mobile</TableHead>
                        <TableHead className="text-center">Country</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="text-center text-black">
                    {VendorList?.length > 0 ? (
                        VendorList.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">
                                    <input
                                        type="radio"
                                        name="vendor-selection" // important to group radios
                                        id={`radio-${item.refno}`}
                                        checked={selectedRows?.vendors?.[0]?.refno === item.refno}
                                        onChange={() => handleRadioChange(item)}
                                        className="h-4 w-4"
                                    />
                                </TableCell>

                                <TableCell className="text-nowrap">{item?.refno ?? "-"}</TableCell>
                                <TableCell>{item?.vendor_name ? item?.vendor_name : '-'}</TableCell>
                                <TableCell>{item?.vendor_code ?? "-"}</TableCell>
                                <TableCell>{item?.service_provider_type ?? "-"}</TableCell>
                                <TableCell>{item?.office_email_primary ?? "-"}</TableCell>
                                <TableCell>{item?.mobile_number ?? "-"}</TableCell>
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

export default SingleSelectVendorTable

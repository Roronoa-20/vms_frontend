"use client";
import React, { useState, useMemo } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/atoms/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GRNForm } from "@/src/types/grntypes";
import { TvendorRegistrationDropdown } from "@/src/types/types";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/atoms/select";
import { Input } from "@/components/ui/input";
import { FileText } from "lucide-react";


type Props = {
    GRNData?: GRNForm[];
    user?: string;
    grn_ref?: string;
    companyDropdown: TvendorRegistrationDropdown["message"]["data"]["company_master"];
};

const ViewGRNEntry = ({ GRNData, companyDropdown }: Props) => {
    const [searchTerm, setSearchTerm] = useState("");

    const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return "-";
        const [year, month, day] = dateStr.split("-");
        return `${day}-${month}-${year}`;
    };

    // 🔍 Filter GRNData by grn_no
    const filteredData = useMemo(() => {
        if (!GRNData) return [];
        if (!searchTerm.trim()) return GRNData;

        return GRNData.filter((item) =>
            item?.grn_no?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [GRNData, searchTerm]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="p-3 bg-gray-300 min-h-screen">
            <div className="shadow- bg-[#f6f6f7] p-4 rounded-2xl">
                <div className="flex w-full justify-between pb-4">
                    <h1 className="text-[20px] text-[#03111F] font-semibold">
                        GRN Entries
                    </h1>
                    <div className="flex gap-4">
                        <Input
                            placeholder="Search by GRN No..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Company" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup className="w-full">
                                    {companyDropdown?.map((item, index) => (
                                        <SelectItem key={index} value={item?.name}>
                                            {item?.description}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow className="bg-[#a4c0fb] text-[14px] hover:bg-[#a4c0fb]">
                            <TableHead className="text-black text-center">Sr No.</TableHead>
                            <TableHead className="text-black text-center">Company</TableHead>
                            <TableHead className="text-black text-center">GRN No.</TableHead>
                            <TableHead className="text-black text-center">GRN Date</TableHead>
                            <TableHead className="text-black text-center">SAP Booking ID</TableHead>
                            <TableHead className="text-black text-center">SAP Status</TableHead>
                            <TableHead className="text-black text-center">View GRN</TableHead>
                            <TableHead className="text-black text-center">View Invoice</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filteredData && filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="text-center">{index + 1}</TableCell>
                                    <TableCell className="text-center">{item?.grn_company}</TableCell>
                                    <TableCell className="text-center">{item?.grn_no}</TableCell>
                                    <TableCell className="text-center">{formatDate(item?.grn_date)}</TableCell>
                                    <TableCell className="text-center">{item?.sap_booking_id}</TableCell>
                                    <TableCell className="text-center">{item?.sap_status}</TableCell>
                                    <TableCell className="text-center">
                                        <Link href={`/view-grn-details?grn_ref=${item?.grn_no}`}>
                                            <Button className="bg-blue-400 text-white hover:bg-white hover:text-black">
                                                View
                                            </Button>
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {item?.invoice_url ? (
                                            <Link
                                                href={item.invoice_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex justify-center text-blue-600"
                                            >
                                                <FileText className="w-5 h-5" />
                                            </Link>
                                        ) : (
                                            "--"
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center text-gray-500 py-4">
                                    No GRN entries found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default ViewGRNEntry;

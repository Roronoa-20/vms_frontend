"use client";
import React from "react";
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

type Props = {
    GRNData?: GRNForm[];
    user?: string;
    grn_ref?: string;
};

const ViewGRNEntry = ({ GRNData }: Props) => {
    
    const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return '-';
        const [year, month, day] = dateStr.split('-');
        return `${day}-${month}-${year}`;
    };

    return (
        <div className="bg-gray-300 min-h-screen p-6">
            <div className="shadow bg-[#f6f6f7] p-4 rounded-2xl">
                <h1 className="text-[20px] text-[#03111F] font-semibold mb-4">
                    GRN Entries
                </h1>

                <div className="overflow-y-auto max-h-[55vh]">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] text-center">
                                <TableHead className="text-center">Sr No.</TableHead>
                                <TableHead className="text-center">GRN No.</TableHead>
                                <TableHead className="text-center">GRN Date</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {GRNData && GRNData.length > 0 ? (
                                GRNData.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="text-center">{index + 1}</TableCell>
                                        <TableCell className="text-center">{item?.grn_no}</TableCell>
                                        <TableCell className="text-center">{formatDate(item?.grn_date)}</TableCell>
                                        <TableCell className="text-center">
                                            <Link href={`/view-grn-details?grn_ref=${item?.grn_no}`}>
                                                <Button className="bg-blue-400 text-white hover:bg-white hover:text-black">
                                                    View
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-gray-500 py-4">
                                        No GRN entries found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default ViewGRNEntry;

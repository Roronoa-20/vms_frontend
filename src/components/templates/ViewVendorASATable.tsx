"use client";
import React, { useState, useEffect } from "react";
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
import { ASAForm } from "@/src/types/asatypes";
import Pagination from "../molecules/Pagination";

type Props = {
    ASAData?: ASAForm[];
    user?: string;
    vms_ref?: string;
};

const ViewASAEntry = ({ ASAData }: Props) => {

    const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return '-';
        const dateObj = new Date(dateStr);
        if (isNaN(dateObj.getTime())) return '-';

        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();

        return `${day}-${month}-${year}`;
    };


    return (
        <div className="bg-gray-300 min-h-screen p-4">
            <div className="shadow bg-[#f6f6f7] p-4 rounded-2xl">
                <h1 className="text-[20px] text-[#03111F] font-semibold mb-4">
                    ASA Entries
                </h1>

                <div className="overflow-y-auto max-h-[55vh]">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] text-center">
                                <TableHead className="text-center">Sr No.</TableHead>
                                <TableHead className="text-center">Vendor Name</TableHead>
                                <TableHead className="text-center">Vendor Ref No.</TableHead>
                                <TableHead className="text-center">Date when Created</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {ASAData && ASAData.length > 0 ? (
                                ASAData.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="text-center">{index + 1}</TableCell>
                                        <TableCell className="text-center">{item?.vendor_name}</TableCell>
                                        <TableCell className="text-center">{item?.vendor_ref_no}</TableCell>
                                        <TableCell className="text-center">{formatDate(item?.creation)}</TableCell>
                                        <TableCell className="text-center">
                                            <Link href={`/view-asa-form?tabtype=company_information&vms_ref_no=${item?.vendor_ref_no}`}
                                                onClick={() => {
                                                    if (item?.vendor_name) {
                                                        localStorage.setItem("vendor_name", item.vendor_name);
                                                    }
                                                }}>
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
                                        No ASA entries found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            {/* <Pagination currentPage={currentPage} record_per_page={record_per_page} setCurrentPage={setCurrentPage} total_event_list={total_event_list} /> */}
        </div>
    );
};

export default ViewASAEntry;

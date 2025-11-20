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
import { Input } from "../atoms/input";
import { ASAForm } from "@/src/types/asatypes";
import Pagination from "../molecules/Pagination";
import { ASAFormResponse, TvendorRegistrationDropdown } from "@/src/types/types";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import API_END_POINTS from "@/src/services/apiEndPoints";


type Props = {
    ASAData?: ASAForm[];
    user?: string;
    vms_ref?: string;
};

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

const ViewASAEntry = ({ ASAData }: Props) => {

    const [table, setTable] = useState<ASAForm[]>(ASAData || []);
    const [selectedCompany, setSelectedCompany] = useState<string>("")
    const [search, setSearch] = useState<string>("");

    const [total_event_list, settotalEventList] = useState(0);
    const [record_per_page, setRecordPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const debouncedSearchName = useDebounce(search, 300);

    useEffect(() => {
        fetchTable();
    }, [debouncedSearchName, selectedCompany, currentPage]);

    const handlesearchname = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSearch(value);
    }

    const fetchTable = async () => {
        const dashboardASAOnboardedVendorTableDataApi: AxiosResponse = await requestWrapper({
            url: `${API_END_POINTS?.asavendorListdashboard}?vendor_name=${search}&page_no=${currentPage}&page_size=${record_per_page}`,
            method: "GET",
        });
        if (dashboardASAOnboardedVendorTableDataApi?.status == 200) {
            setTable(dashboardASAOnboardedVendorTableDataApi?.data?.message?.data);
            settotalEventList(dashboardASAOnboardedVendorTableDataApi?.data?.message?.total_count)
        }
    };


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
                <div className="flex justify-end w-[200px] pb-4">
                    <div className="flex gap-4">
                        <Input
                            placeholder="Search Vendor Name..."
                            value={search}
                            onChange={handlesearchname}
                        />
                        {/* <Select onValueChange={(value) => { setSelectedCompany(value) }}>
                                <SelectTrigger className="w-96">
                                    <SelectValue placeholder="Select Company" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup className="w-full">
                                    {
                                        companyDropdown?.map((item, index) => (
                                        <SelectItem key={index} value={item?.name}>{item?.description}</SelectItem>
                                        ))
                                    }
                                    </SelectGroup>
                                </SelectContent>
                            </Select> */}
                    </div>
                </div>
                <div className="overflow-y-auto max-h-[110vh]">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] text-center">
                                <TableHead className="text-black text-center">Sr No.</TableHead>
                                <TableHead className="text-black text-center">Vendor Name</TableHead>
                                <TableHead className="text-black text-center">Vendor Ref No.</TableHead>
                                <TableHead className="text-black text-center">Form Submitted On</TableHead>
                                <TableHead className="text-black text-center">View Form</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {table && table.length > 0 ? (
                                table.map((item, index) => (
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
                                                <Button variant={"nextbtn"} size={"nextbtnsize"} className="items-center hover:bg-white hover:border hover:border-[#5291CD] hover:text-black py-2.5">
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
            <Pagination currentPage={currentPage} record_per_page={record_per_page} setCurrentPage={setCurrentPage} total_event_list={total_event_list} />
        </div>
    );
};

export default ViewASAEntry;

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
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { useAuth } from "@/src/context/AuthContext";
import { Search } from "lucide-react";

type Props = {
    ASAData?: ASAForm[];
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

const VendorASATable = ({ ASAData }: Props) => {
    const { vendorRef } = useAuth();
    const [table, setTable] = useState<ASAForm[]>(ASAData || []);
    const [search, setSearch] = useState<string>("");

    const [total_event_list, settotalEventList] = useState(0);
    const [record_per_page, setRecordPerPage] = useState<number>(20);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const formatYear = (creation: string | undefined) => {
        if (!creation) return "-";

        // Try standard parsing
        const date = new Date(creation);
        if (!isNaN(date.getTime())) {
            return date.getFullYear();
        }

        // Handle DD-MM-YYYY or DD/MM/YYYY
        const parts = creation.split(/[-/]/);
        if (parts.length === 3) {
            // Usually YYYY is the last part or the first part
            const lastPart = parts[2];
            const firstPart = parts[0];

            if (lastPart.length === 4) return lastPart;
            if (firstPart.length === 4) return firstPart;
        }

        return "-";
    };

    const debouncedSearch = useDebounce(search, 300);

    useEffect(() => {
        fetchTable();
    }, [debouncedSearch, currentPage, vendorRef]);

    const handlesearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    const fetchTable = async () => {
        if (!vendorRef || vendorRef === "undefined") {
            console.warn("No valid vendorRef found in AuthContext");
            return;
        }
        console.log("Fetching ASA table for vendorRef:", vendorRef);
        try {
            // 1. Try the dashboard API first
            const response: AxiosResponse = await requestWrapper({
                url: `${API_END_POINTS?.asavendorListdashboard}?vendor_ref_no=${vendorRef}&search_term=${search}&page_no=${currentPage}&page_size=${record_per_page}`,
                method: "GET",
            });
            console.log("ASA Dashboard Response:", response);

            let fetchedData: ASAForm[] = [];
            if (response?.status == 200) {
                const message = response?.data?.message;
                fetchedData =
                    message?.data ||
                    message?.approved_vendors ||
                    message?.pending_vendors ||
                    message?.asa_form_data ||
                    (Array.isArray(message) ? message : []);
            }

            // 2. Fallback: If dashboard is empty, try to get the current/single ASA form data
            if (fetchedData.length === 0) {
                console.log("Dashboard empty, fetching single ASA record from getASAFormSubmit...");
                const singleRes: AxiosResponse = await requestWrapper({
                    url: `${API_END_POINTS?.getASAFormSubmit}?vendor_ref_no=${vendorRef}`,
                    method: "GET",
                });
                console.log("Single ASA Record Response:", singleRes);
                if (singleRes?.status === 200 && singleRes?.data?.message) {
                    // getASAFormSubmit usually returns the object directly in message or message.data
                    const singleData = singleRes?.data?.message?.asa_form || singleRes?.data?.message;
                    if (singleData && singleData.name) {
                        fetchedData = [singleData];
                    }
                }
            }

            console.log("Final Table Data:", fetchedData);
            setTable(fetchedData);
            settotalEventList(fetchedData.length);

        } catch (error) {
            console.error("Error in fetchTable:", error);
        }
    };

    return (
        <div className="bg-white p-3 rounded-2xl border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-[#0C2741]">ASA Records</h2>
                    <p className="text-sm text-gray-500 mt-1">View and manage your Annual Sustainability Assessments</p>
                </div>
            </div>

            <div>
                <Table>
                    <TableHeader>
                        <TableRow className="bg-[#a4c0fb] text-[14px] hover:bg-[#a4c0fb]">
                            <TableHead className="text-black text-center font-bold text-nowrap">Sr No.</TableHead>
                            <TableHead className="text-black text-center font-bold text-nowrap">ASA Name</TableHead>
                            <TableHead className="text-black text-center font-bold text-nowrap">Year</TableHead>
                            <TableHead className="text-black text-center font-bold text-nowrap">Total Score</TableHead>
                            <TableHead className="text-black text-center font-bold text-nowrap">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {table && table.length > 0 ? (
                            table.map((item, index) => (
                                <TableRow key={index} className="hover:bg-white">
                                    <TableCell className="text-center">
                                        {(currentPage - 1) * record_per_page + index + 1}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="font-semibold text-gray-800">{item?.name}</div>
                                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">{item?.vendor_ref_no}</div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className="text-black font-medium">
                                            {formatYear(item?.creation)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {item?.total_esg_score !== null && item?.total_esg_score !== undefined && !isNaN(Number(item.total_esg_score)) ? (
                                            <div className="inline-flex items-center justify-center min-w-[3rem] px-3 py-1.5 rounded-xl text-sm font-bold bg-green-50 text-green-700 border border-green-100">
                                                {item.total_esg_score}
                                            </div>
                                        ) : (
                                            <span className="text-gray-300 italic text-sm">Not rated</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Link href={`/asa-form?tabtype=company_information&vms_ref_no=${vendorRef}`}>
                                            <Button
                                                variant="nextbtn"
                                                size="nextbtnsize"
                                                className="py-2"
                                            >
                                                View
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-gray-500 py-24">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-200">
                                            <Search className="w-8 h-8" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-lg font-semibold text-gray-700">No ASA records found</p>
                                            <p className="text-sm text-gray-400">Try adjusting your search or check back later.</p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="mt-2 pt-1">
                <Pagination
                    currentPage={currentPage}
                    record_per_page={record_per_page}
                    setCurrentPage={setCurrentPage}
                    total_event_list={total_event_list}
                />
            </div>
        </div>
    );
};

export default VendorASATable;

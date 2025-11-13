"use client"
import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/atoms/table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/src/components/atoms/select";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "../atoms/input";
import { ASAFormResponse, TvendorRegistrationDropdown, ASAForm } from "@/src/types/types";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import API_END_POINTS from "@/src/services/apiEndPoints";
import Pagination from "./Pagination";

type Props = {
    dashboardTableData: ASAFormResponse;
    companyDropdown: TvendorRegistrationDropdown["message"]["data"]["company_master"]
}
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

const DashboardASAVendorFormTable = ({ dashboardTableData, companyDropdown }: Props) => {
    console.log("Dashboard Pending table ASA---->", dashboardTableData)

    const [table, setTable] = useState<ASAForm[]>(dashboardTableData?.pending_asa_vendors || []);
    const [selectedCompany, setSelectedCompany] = useState<string>("")
    const [search, setSearch] = useState<string>("");

    const [totalCount, setTotalCount] = useState<number>(dashboardTableData?.total_count || 0);
    const [recordPerPage, setRecordPerPage] = useState<number>(dashboardTableData?.page_length || 5);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const debouncedSearchName = useDebounce(search, 300);

    useEffect(() => {
        fetchTable();
    }, [debouncedSearchName, selectedCompany, currentPage])


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const fetchTable = async () => {
        const params = new URLSearchParams({
            page_no: String(currentPage),
            page_length: String(recordPerPage)
        });
        if (debouncedSearchName.trim()) {
            params.append("vendor_name", debouncedSearchName.trim());
        }
        const url = `${API_END_POINTS.asavendorListdashboard}?${params.toString()}`;
        const res: AxiosResponse = await requestWrapper({ url, method: "GET" });

        if (res?.status === 200 && res.data?.status === "success") {
            console.log("ASA Table Data--->", res.data);
            setTable(res.data.data || []);
            setTotalCount(res.data.total_count || 0);
            setRecordPerPage(res.data.page_length || 5);
        }
    };
    const sendReminderEmail = async (name: string) => {
        try {
            const res: AxiosResponse = await requestWrapper({
                url: API_END_POINTS.asasendremindermail,
                method: "POST",
                data: {
                    name: name,
                },
            });

            if (res?.status === 200) {
                console.log("Email sent successfully", res.data);
                alert("Reminder email sent!");
            }
        } catch (err) {
            console.error("Error sending email", err);
            alert("Failed to send email. Please try again.");
        }
    };

    const formatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return "-";
        const cleanDate = dateStr.trim().split(" ")[0];
        if (!cleanDate) return "-";
        const [year, month, day] = cleanDate.split("-");
        if (!year || !month || !day) return "-";
        return `${day}-${month}-${year}`;
    };


    return (
        <>
            <div className="shadow- bg-[#f6f6f7] p-4 rounded-2xl">
                <div className="flex w-full justify-between pb-4">
                    <h1 className="text-[20px] text-[#03111F] font-semibold">
                        Pending Vendor List
                    </h1>
                    <div className="flex gap-4">
                        <Input
                            placeholder="Search..."
                            value={search}
                            onChange={handleSearchChange}
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
                <Table>
                    <TableHeader className="text-center">
                        <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
                            <TableHead className="w-[80px]">Sr No.</TableHead>
                            <TableHead className="text-center">Ref No.</TableHead>
                            <TableHead className="text-center">Vendor Name</TableHead>
                            <TableHead className="text-center">Email Address</TableHead>
                            <TableHead className="text-center">Mobile Number</TableHead>
                            <TableHead className="text-center">Country</TableHead>
                            <TableHead className="text-center">Created On</TableHead>
                            <TableHead className="text-center">Send Email</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-center">
                        {table.length > 0 ? (
                            table.map((item, index) => (
                                <TableRow key={item.name}>
                                    <TableCell>{(currentPage - 1) * recordPerPage + index + 1}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.vendor_name}</TableCell>
                                    <TableCell>{item.office_email_primary}</TableCell>
                                    <TableCell>{item.mobile_number}</TableCell>
                                    <TableCell>{item.country}</TableCell>
                                    <TableCell className="text-center">{formatDate(item?.registered_date)}</TableCell>
                                    <TableCell className="text-center">
                                        <Button
                                            className="bg-blue-400 text-white hover:bg-white hover:text-black"
                                            onClick={() => {
                                                if (item?.name) {
                                                    sendReminderEmail(item.name);
                                                }
                                            }}
                                        >
                                            Send Email
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                                    No results found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <Pagination
                currentPage={currentPage}
                record_per_page={recordPerPage}
                setCurrentPage={setCurrentPage}
                total_event_list={totalCount}
            />
        </>
    );
};

export default DashboardASAVendorFormTable;

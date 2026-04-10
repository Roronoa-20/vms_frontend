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
import Cookies from "js-cookie";


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

    const [table, setTable] = useState<ASAForm[]>(dashboardTableData?.pending_vendors || (dashboardTableData as any)?.data || []);
    const [selectedCompany, setSelectedCompany] = useState<string>("");
    const [search, setSearch] = useState<string>("");
    const [total_event_list, settotalEventList] = useState(dashboardTableData?.overall_count || 0);
    const [record_per_page, setRecordPerPage] = useState<number>(5);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        if (dashboardTableData) {
            setTable(dashboardTableData.pending_vendors || (dashboardTableData as any).data || []);
            settotalEventList(
                dashboardTableData.overall_count ||
                dashboardTableData.total_count ||
                (dashboardTableData as any).overall_total_asa || 0
            );
        }
    }, [dashboardTableData]);
    const debouncedSearchName = useDebounce(search, 300);
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [selectedName, setSelectedName] = useState<string>("");
    const [remarks, setremarks] = useState<string>("");


    useEffect(() => {
        fetchTable();
    }, [debouncedSearchName, selectedCompany, currentPage])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const fetchTable = async () => {
        const user = Cookies?.get("user_id");
        const dashboardASAPendingVendorTableDataApi: AxiosResponse = await requestWrapper({
            url: `${API_END_POINTS?.asapendingVendorList}?usr=${user}&vendor_name=${search}&page_no=${currentPage}&page_length=${record_per_page}`,
            method: "GET",
        });
        console.log("Pending API Response:", dashboardASAPendingVendorTableDataApi?.data);
        if (dashboardASAPendingVendorTableDataApi?.status == 200) {
            const msg = dashboardASAPendingVendorTableDataApi?.data?.message;
            setTable(msg?.pending_vendors || msg?.data || []);
            settotalEventList(msg?.overall_count || msg?.total_count || msg?.overall_total_asa || 0);
            setRecordPerPage(record_per_page);
        }
    };

    console.log("Register Table--->", table)

    const sendReminderEmail = async () => {
        try {
            const res: AxiosResponse = await requestWrapper({
                url: API_END_POINTS.asasendremindermail,
                method: "POST",
                data: {
                    name: selectedName,
                    remarks: remarks,
                },
            });

            if (res?.status === 200) {
                console.log("Email sent successfully", res.data);
                alert("Reminder email sent!");
                setIsCommentOpen(false);
                setremarks("");
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
            <div className="bg-[#f6f6f7] p-4 rounded-2xl shadow-sm">
                <div className="flex w-full justify-between pb-4">
                    <h1 className="text-[20px] text-[#03111F] font-semibold">
                        Pending Vendor List
                    </h1>
                    <div className="flex gap-4">
                        <Input
                            placeholder="Search Vendor Name..."
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
                        <TableRow className="bg-[#DDE8FE] text-black text-[14px] hover:bg-[#DDE8FE] rounded-xl text-center font-bold">
                            <TableHead className="w-[75px] h-[2.5rem] text-center text-black">Sr No.</TableHead>
                            <TableHead className="text-center text-black">Ref No.</TableHead>
                            <TableHead className="text-center text-black">Vendor Name</TableHead>
                            <TableHead className="text-center text-black">Email Address</TableHead>
                            <TableHead className="text-center text-black">Mobile Number</TableHead>
                            <TableHead className="text-center text-black">Country</TableHead>
                            <TableHead className="text-center text-black">Register Date</TableHead>
                            <TableHead className="text-center text-black">Send Email</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-center">
                        {table.length > 0 ? (
                            table.map((item, index) => (
                                <TableRow key={item.name}>
                                    <TableCell>{(currentPage - 1) * record_per_page + index + 1}</TableCell>
                                    <TableCell className="text-nowrap">{item.name}</TableCell>
                                    <TableCell>{item.vendor_name}</TableCell>
                                    <TableCell>{item.office_email_primary}</TableCell>
                                    <TableCell>{item.mobile_number}</TableCell>
                                    <TableCell>{item.country}</TableCell>
                                    <TableCell className="text-center">{item?.registered_date}</TableCell>
                                    <TableCell className="text-center">
                                        <Button
                                            className="py-2.5 rounded-[20px] text-white hover:bg-white hover:border hover:border-[#5291CD] hover:text-black"
                                            variant={"nextbtn"}
                                            size={"nextbtnsize"}
                                            onClick={() => {
                                                setSelectedName(item.name);
                                                setIsCommentOpen(true);
                                            }}
                                        >
                                            Send Email
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center text-gray-500 py-4">
                                    No results found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <Pagination
                currentPage={currentPage}
                record_per_page={record_per_page}
                setCurrentPage={setCurrentPage}
                total_event_list={total_event_list}
            />
            {isCommentOpen && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-5 rounded-xl shadow-xl w-[500px]">
                        <h2 className="text-lg font-semibold mb-3">Add Remarks</h2>

                        <textarea
                            className="w-full h-32 border rounded p-2 mb-4"
                            placeholder="Enter your remarks..."
                            value={remarks}
                            onChange={(e) => setremarks(e.target.value)}
                        />

                        <div className="flex justify-end gap-3">
                            <Button
                                className="py-2"
                                variant={"backbtn"}
                                size={"backbtnsize"}
                                onClick={() => setIsCommentOpen(false)}
                            >
                                Cancel
                            </Button>

                            <Button
                                className="py-2"
                                variant={"nextbtn"}
                                size={"nextbtnsize"}
                                onClick={sendReminderEmail}
                            >
                                Send
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DashboardASAVendorFormTable;

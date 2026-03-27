"use client"
import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../atoms/table'
import { Input } from '../atoms/input'
import Pagination from './Pagination'
import { Button } from '../atoms/button'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'
import { useRouter } from 'next/navigation'

interface AdvancePaymentRow {
    po_number: string;
    pr_number: string;
    po_date: string;
    vendor: string;
    company: string;
    total_po_amount: number;
    advance_raised: number;
    raised_date: string;
    status: string;
    name: string;
}

const RaiseAdvacePaymentTable = () => {
    const router = useRouter();
    const [tableData, setTableData] = useState<AdvancePaymentRow[]>([]);
    const [dateFilter, setDateFilter] = useState("");
    const [vendorSearch, setVendorSearch] = useState("");
    const [showAll, setShowAll] = useState(false);

    const [total_event_list, settotalEventList] = useState(0);
    const [record_per_page] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        fetchData();
    }, [currentPage, dateFilter, vendorSearch, showAll]);

    const fetchData = async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_BACKEND_END}/api/method/vms.APIs.vendors_dashboards_api.po_approve_reject.get_advance_payment_list`;
            const response: AxiosResponse = await requestWrapper({
                url: url,
                method: "GET",
                params: {
                    page_no: currentPage,
                    page_length: record_per_page,
                    date: dateFilter,
                    vendor: vendorSearch,
                    show_all: showAll ? 1 : 0,
                }
            });
            if (response?.status == 200) {
                setTableData(response?.data?.message?.data ?? []);
                settotalEventList(response?.data?.message?.total_count || 0);
            }
        } catch (error) {
            console.error(error);
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
        <div className="space-y-4 text-sm text-black font-sans m-3">
            {/* Filters */}
            <div className="flex items-center justify-between bg-white p-4 rounded-md border border-gray-300">
                <div className="flex gap-4 items-center">
                    <Input
                        type="date"
                        className="w-48"
                        value={dateFilter}
                        onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                    />
                    <Input
                        placeholder="Search Vendor..."
                        className="w-60"
                        value={vendorSearch}
                        onChange={(e) => { setVendorSearch(e.target.value); setCurrentPage(1); }}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => { setShowAll(!showAll); setCurrentPage(1); }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showAll ? 'bg-[#5291CD]' : 'bg-gray-300'}`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showAll ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE]">
                        <TableHead className="text-left text-black">Sr.no</TableHead>
                        <TableHead className="text-left text-black">PO Number</TableHead>
                        <TableHead className="text-left text-black">PR Number</TableHead>
                        <TableHead className="text-left text-black">PO Date</TableHead>
                        <TableHead className="text-left text-black">Vendor</TableHead>
                        <TableHead className="text-left text-black">Company</TableHead>
                        <TableHead className="text-left text-black text-nowrap">Total PO Amount</TableHead>
                        <TableHead className="text-left text-black text-nowrap">Advance Raised</TableHead>
                        <TableHead className="text-left text-black text-nowrap">Raised Date</TableHead>
                        <TableHead className="text-left text-black">Status</TableHead>
                        <TableHead className="text-left text-black">View</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="text-left text-black">
                    {tableData && tableData.length > 0 ? (
                        tableData.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="text-left">{(currentPage - 1) * record_per_page + index + 1}</TableCell>
                                <TableCell className="text-left text-nowrap">{item?.po_number}</TableCell>
                                <TableCell className="text-left text-nowrap">{item?.pr_number}</TableCell>
                                <TableCell className="text-left text-nowrap">{formatDate(item?.po_date)}</TableCell>
                                <TableCell className="text-left text-nowrap">{item?.vendor}</TableCell>
                                <TableCell className="text-left text-nowrap">{item?.company}</TableCell>
                                <TableCell className="text-left text-nowrap">{item?.total_po_amount}</TableCell>
                                <TableCell className="text-left text-nowrap">{item?.advance_raised}</TableCell>
                                <TableCell className="text-left text-nowrap">{formatDate(item?.raised_date)}</TableCell>
                                <TableCell className="text-left text-nowrap">
                                    <span className={`px-2 py-1 rounded-xl text-xs ${item?.status === "Pending" ? "bg-yellow-100 text-yellow-800" : item?.status === "Approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                        {item?.status}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Button className="bg-[#5291CD] hover:bg-white hover:text-black hover:border border-[#5291CD] rounded-[14px]" onClick={() => router.push(`/view-vendor-po-details?poname=${item?.name}`)}>
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={11} className="text-center text-gray-500 py-4">
                                No results found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            </div>

            <Pagination currentPage={currentPage} record_per_page={record_per_page} setCurrentPage={setCurrentPage} total_event_list={total_event_list} />
        </div>
    )
}

export default RaiseAdvacePaymentTable
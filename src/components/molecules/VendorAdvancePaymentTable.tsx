"use client"
import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../atoms/table'
import { Input } from '../atoms/input'
import Pagination from './Pagination'
import { Button } from '../atoms/button'
import { useRouter } from 'next/navigation'
import { getPaymentRequestList } from '@/src/services/advancePayment/advancePayment.services'
import { PaymentRequestRecord } from '@/src/types/advancePayment/advancePayment.types'

const VendorAdvancePaymentTable = () => {
    const router = useRouter();
    const [tableData, setTableData] = useState<PaymentRequestRecord[]>([]);
    const [dateFilter, setDateFilter] = useState("");
    const [poSearch, setPoSearch] = useState("");

    const [total_event_list, settotalEventList] = useState(0);
    const [record_per_page] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        fetchData();
    }, [currentPage, dateFilter, poSearch]);

    const fetchData = async () => {
        try {
            const res = await getPaymentRequestList({
                search_term: poSearch || "",
                status: "Pending",
                date: dateFilter || "",
                page_no: currentPage,
                page_size: record_per_page,
            });
            setTableData(res?.data ?? []);
            settotalEventList(res?.total_count || 0);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-4 text-sm text-black font-sans m-3">
            {/* Filters */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-md border border-gray-300">
                <Input
                    type="date"
                    className="w-48"
                    value={dateFilter}
                    onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                />
                <Input
                    placeholder="Search PO Number..."
                    className="w-60"
                    value={poSearch}
                    onChange={(e) => { setPoSearch(e.target.value); setCurrentPage(1); }}
                />
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE]">
                        <TableHead className="text-left text-black">Sr.no</TableHead>
                        <TableHead className="text-left text-black">Payment Req</TableHead>
                        <TableHead className="text-left text-black">PO Number</TableHead>
                        <TableHead className="text-left text-black">Date</TableHead>
                        <TableHead className="text-left text-black">Company</TableHead>
                        <TableHead className="text-left text-black text-nowrap">Amount</TableHead>
                        <TableHead className="text-left text-black text-nowrap">Payment Type</TableHead>
                        <TableHead className="text-left text-black">Approval Status</TableHead>
                        <TableHead className="text-left text-black">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="text-left text-black">
                    {tableData && tableData.length > 0 ? (
                        tableData.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="text-left">{(currentPage - 1) * record_per_page + index + 1}</TableCell>
                                <TableCell className="text-left text-nowrap">{item?.name}</TableCell>
                                <TableCell className="text-left text-nowrap">{item?.record}</TableCell>
                                <TableCell className="text-left text-nowrap">{item?.date || "-"}</TableCell>
                                <TableCell className="text-left text-nowrap">{item?.company || "-"}</TableCell>
                                <TableCell className="text-left text-nowrap">{item?.amount ?? "-"}</TableCell>
                                <TableCell className="text-left text-nowrap">{item?.payment_type || "-"}</TableCell>
                                <TableCell className="text-left text-nowrap">
                                    <span className={`px-2 py-1 rounded-xl text-xs ${item?.approval_status?.toLowerCase().includes("awaiting") ? "bg-yellow-100 text-yellow-800" : item?.approval_status?.toLowerCase().includes("approved") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                        {item?.approval_status}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Button className="bg-[#5291CD] hover:bg-white hover:text-black hover:border border-[#5291CD] rounded-[14px]" onClick={() => router.push(`/raise-advance-payment?refno=${item?.name}`)}>
                                        View
                                    </Button>
                                </TableCell>
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

            <Pagination currentPage={currentPage} record_per_page={record_per_page} setCurrentPage={setCurrentPage} total_event_list={total_event_list} />
        </div>
    )
}

export default VendorAdvancePaymentTable
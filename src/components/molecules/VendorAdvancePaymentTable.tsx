"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../atoms/table'
import Pagination from './Pagination'
import { useRouter } from 'next/navigation'
import { getPaymentRequestList } from '@/src/services/advancePayment/advancePayment.services'
import { PaymentRequestRecord } from '@/src/types/advancePayment/advancePayment.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Eye, FileText, Loader2, Search } from 'lucide-react'

const statusColor = (status?: string) => {
    if (!status) return 'bg-gray-100 text-gray-600 border-gray-200'
    const s = status.toLowerCase()
    if (s.includes('approved')) return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    if (s.includes('reject')) return 'bg-red-50 text-red-700 border-red-200'
    if (s.includes('pending') || s.includes('awaiting')) return 'bg-amber-50 text-amber-700 border-amber-200'
    return 'bg-blue-50 text-blue-700 border-blue-200'
}

const VendorAdvancePaymentTable = () => {
    const router = useRouter();
    const [tableData, setTableData] = useState<PaymentRequestRecord[]>([]);
    const [dateFilter, setDateFilter] = useState("");
    const [poSearch, setPoSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [total_event_list, settotalEventList] = useState(0);
    const [record_per_page] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const hasLoadedOnce = useRef(false);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => setDebouncedSearch(poSearch), 400);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [poSearch]);

    const fetchData = useCallback(async () => {
        try {
            if (hasLoadedOnce.current) setIsFetching(true);
            const res = await getPaymentRequestList({
                search_term: debouncedSearch || "",
                status: "",
                date: dateFilter || "",
                page_no: currentPage,
                page_size: record_per_page,
            });
            setTableData(res?.data ?? []);
            settotalEventList(res?.total_count || 0);
        } catch (error) {
            console.error(error);
        } finally {
            hasLoadedOnce.current = true;
            setIsInitialLoad(false);
            setIsFetching(false);
        }
    }, [currentPage, dateFilter, debouncedSearch, record_per_page]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, dateFilter]);

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-lg font-bold text-[#0F172A] tracking-tight">Vendor advance payments</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">
                        Pending payment requests linked to your vendor account.
                    </p>
                </div>
                {total_event_list > 0 && !isInitialLoad && (
                    <Badge variant="outline" className="w-fit text-[11px] font-semibold border-slate-200 bg-white text-[#475569]">
                        {total_event_list} result{total_event_list !== 1 ? 's' : ''}
                    </Badge>
                )}
            </div>

            <Card className="shadow-sm border-slate-200 overflow-hidden">
                <CardHeader className="py-3 px-4 border-b border-slate-100 bg-gradient-to-r from-[#F8FAFC] to-white">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4F6BED] to-[#7C93F5] flex items-center justify-center shadow-sm flex-shrink-0">
                                <CreditCard className="w-4 h-4 text-white" />
                            </div>
                            <div className="min-w-0">
                                <CardTitle className="text-sm font-bold text-[#0F172A] tracking-tight">Payment requests</CardTitle>
                                <p className="text-[11px] text-[#94A3B8] mt-0.5 font-medium leading-none">
                                    Filter by date or PO, then open a request
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <input
                                type="date"
                                className="h-8 w-[138px] rounded-lg border border-slate-200 bg-white px-2 text-xs text-[#334155] outline-none transition-colors focus:border-[#4F6BED] focus:ring-2 focus:ring-[#4F6BED]/20"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />
                            <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8] pointer-events-none" />
                                <input
                                    placeholder="Search PO / payment ref…"
                                    className="h-8 w-[200px] max-w-full rounded-lg border border-slate-200 bg-white pl-8 pr-2 text-xs text-[#334155] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#4F6BED] focus:ring-2 focus:ring-[#4F6BED]/20"
                                    value={poSearch}
                                    onChange={(e) => setPoSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0 relative">
                    {isInitialLoad ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="w-7 h-7 text-[#4F6BED] animate-spin" />
                                <p className="text-xs font-medium text-[#94A3B8]">Loading payment requests…</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {isFetching && (
                                <div className="absolute inset-0 z-10 bg-white/55 backdrop-blur-[1px] flex items-center justify-center">
                                    <Loader2 className="w-6 h-6 text-[#4F6BED] animate-spin" />
                                </div>
                            )}
                            <div className="overflow-x-auto">
                                <Table className="min-w-[1000px] w-full">
                                    <TableHeader>
                                        <TableRow className="bg-[#F8FAFC] hover:bg-[#F8FAFC] border-b border-slate-200">
                                            <TableHead className="w-11 text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-9 px-2">
                                                Sr.
                                            </TableHead>
                                            <TableHead className="w-[16%] min-w-[7rem] text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-9 px-3">
                                                Payment req
                                            </TableHead>
                                            <TableHead className="w-[12%] min-w-[6rem] text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-9 px-3">
                                                PO number
                                            </TableHead>
                                            <TableHead className="w-[9%] min-w-[5.5rem] text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-9 px-3">
                                                Date
                                            </TableHead>
                                            <TableHead className="w-[24%] min-w-[8rem] text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-9 px-3">
                                                Company
                                            </TableHead>
                                            <TableHead className="w-[10%] min-w-[5.5rem] text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-9 px-3">
                                                Amount
                                            </TableHead>
                                            <TableHead className="w-[11%] min-w-[5.5rem] text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-9 px-3">
                                                Payment type
                                            </TableHead>
                                            <TableHead className="w-[12%] min-w-[6.5rem] text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-9 px-2">
                                                Status
                                            </TableHead>
                                            <TableHead className="w-14 text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-9 px-2">
                                                View
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {tableData && tableData.length > 0 ? (
                                            tableData.map((item, index) => (
                                                <TableRow key={item.name ?? index} className="hover:bg-slate-50/80 border-b border-slate-100 transition-colors">
                                                    <TableCell className="text-center text-xs text-[#64748B] tabular-nums py-2.5 px-2 align-middle">
                                                        {(currentPage - 1) * record_per_page + index + 1}
                                                    </TableCell>
                                                    <TableCell className="text-center text-xs font-semibold text-[#0F172A] py-2.5 px-3 align-middle min-w-0">
                                                        <span className="block truncate text-center" title={item?.name}>
                                                            {item?.name}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-center text-xs text-[#475569] py-2.5 px-3 align-middle min-w-0 tabular-nums">
                                                        <span className="block truncate text-center" title={item?.record}>
                                                            {item?.record}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-center text-xs text-[#475569] tabular-nums py-2.5 px-3 align-middle whitespace-nowrap">
                                                        {item?.date || "—"}
                                                    </TableCell>
                                                    <TableCell className="text-center text-xs text-[#64748B] py-2.5 px-3 align-middle min-w-0">
                                                        <span className="block truncate text-center" title={item?.company ?? item?.company_name ?? undefined}>
                                                            {item?.company || item?.company_name || "—"}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-center text-xs font-semibold text-[#0F172A] tabular-nums py-2.5 px-3 align-middle whitespace-nowrap">
                                                        {item?.amount != null ? item.amount.toLocaleString("en-IN") : "—"}
                                                    </TableCell>
                                                    <TableCell className="text-center text-xs text-[#475569] py-2.5 px-3 align-middle whitespace-nowrap">
                                                        {item?.payment_type || "—"}
                                                    </TableCell>
                                                    <TableCell className="text-center py-2.5 px-2 align-middle">
                                                        <Badge
                                                            variant="outline"
                                                            className={`text-[10px] font-semibold px-2 py-0.5 whitespace-nowrap ${statusColor(item?.approval_status)}`}
                                                            title={item?.approval_status}
                                                        >
                                                            {item?.approval_status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center py-2.5 px-2 align-middle">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                router.push(`/raise-advance-payment?refno=${encodeURIComponent(item.name)}`)
                                                            }
                                                            className="inline-flex w-8 h-8 rounded-lg bg-[#EEF2FF] items-center justify-center hover:bg-[#4F6BED] hover:text-white text-[#4F6BED] transition-colors align-middle"
                                                            title="View payment request"
                                                            aria-label="View payment request"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={9} className="text-center py-14">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <FileText className="w-9 h-9 text-slate-300" />
                                                        <p className="text-sm font-medium text-[#64748B]">No payment requests found</p>
                                                        <p className="text-xs text-[#94A3B8]">Adjust filters or check back later.</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                            {tableData && tableData.length > 0 && (
                                <div className="px-3 py-2 border-t border-slate-100 bg-[#FAFBFC]">
                                    <Pagination
                                        currentPage={currentPage}
                                        record_per_page={record_per_page}
                                        setCurrentPage={setCurrentPage}
                                        total_event_list={total_event_list}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default VendorAdvancePaymentTable

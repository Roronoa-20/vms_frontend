"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../atoms/table'
import Pagination from './Pagination'
import { useRouter } from 'next/navigation'
import { getPaymentRequestList } from '@/src/services/advancePayment/advancePayment.services'
import { PaymentRequestRecord } from '@/src/types/advancePayment/advancePayment.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, CreditCard, Eye, FileText, Loader2 } from 'lucide-react'

const statusBadge = (status?: string) => {
    if (!status) return { className: 'bg-gray-100 text-gray-600 border-gray-200', label: '—' }
    const s = status.toLowerCase()
    if (s.includes('approved')) return { className: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: status }
    if (s.includes('awaiting') || s.includes('pending')) return { className: 'bg-amber-50 text-amber-700 border-amber-200', label: status }
    if (s.includes('reject')) return { className: 'bg-red-50 text-red-700 border-red-200', label: status }
    return { className: 'bg-blue-50 text-blue-700 border-blue-200', label: status }
}

const RaiseAdvacePaymentTable = () => {
    const router = useRouter();
    const [tableData, setTableData] = useState<PaymentRequestRecord[]>([]);
    const [dateFilter, setDateFilter] = useState("");
    const [vendorSearch, setVendorSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [showAll, setShowAll] = useState(false);

    const [total_event_list, settotalEventList] = useState(0);
    const [record_per_page] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setDebouncedSearch(vendorSearch);
            setCurrentPage(1);
        }, 400);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [vendorSearch]);

    useEffect(() => {
        fetchData();
    }, [currentPage, dateFilter, debouncedSearch, showAll]);

    const fetchData = async () => {
        try {
            setIsFetching(true);
            const res = await getPaymentRequestList({
                search_term: debouncedSearch || "",
                status: showAll ? "Pending" : "",
                date: dateFilter || "",
                page_no: currentPage,
                page_size: record_per_page,
            });
            setTableData(res?.data ?? []);
            settotalEventList(res?.total_count || 0);
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetching(false);
            setIsInitialLoad(false);
        }
    };

    return (
        <div className="p-4 space-y-4">
            <Card className="shadow-sm border-slate-200">
                <CardHeader className="py-3 px-4 border-b border-slate-100">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F6BED] to-[#7C93F5] flex items-center justify-center shadow-sm">
                                <CreditCard className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-sm font-bold text-[#0F172A] tracking-tight">Payment Requests</CardTitle>
                                <p className="text-[11px] text-[#94A3B8] mt-0.5 font-medium leading-none">
                                    {total_event_list > 0 ? `${total_event_list} total request${total_event_list !== 1 ? 's' : ''}` : 'No requests found'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                className="h-8 w-[138px] rounded-lg border border-slate-200 bg-white px-2 text-xs text-[#334155] outline-none transition-colors focus:border-[#4F6BED] focus:ring-2 focus:ring-[#4F6BED]/20"
                                value={dateFilter}
                                onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                            />
                            <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8] pointer-events-none" />
                                <input
                                    placeholder="Search vendor..."
                                    className="h-8 w-[170px] rounded-lg border border-slate-200 bg-white pl-8 pr-2 text-xs text-[#334155] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#4F6BED] focus:ring-2 focus:ring-[#4F6BED]/20"
                                    value={vendorSearch}
                                    onChange={(e) => setVendorSearch(e.target.value)}
                                />
                            </div>
                            <button
                                type="button"
                                title={showAll ? "Showing pending only" : "Showing all"}
                                onClick={() => { setShowAll(!showAll); setCurrentPage(1); }}
                                className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors duration-200 ${showAll ? 'bg-[#4F6BED]' : 'bg-slate-300'}`}
                            >
                                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${showAll ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
                            </button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-0 px-0">
                    <div className="overflow-x-auto relative">
                        {isFetching && !isInitialLoad && (
                            <div className="absolute inset-0 z-10 bg-white/60 flex items-center justify-center">
                                <Loader2 className="w-5 h-5 text-[#4F6BED] animate-spin" />
                            </div>
                        )}
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-[#F8FAFC] hover:bg-[#F8FAFC] border-b border-slate-200">
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2">Sr.</TableHead>
                                    <TableHead className="text-left text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 text-nowrap">Payment Req</TableHead>
                                    <TableHead className="text-left text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 text-nowrap">PO Number</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2">Date</TableHead>
                                    <TableHead className="text-left text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2">Company</TableHead>
                                    <TableHead className="text-left text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2">Vendor</TableHead>
                                    <TableHead className="text-right text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2">Amount</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2">Type</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2">Status</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isInitialLoad ? (
                                    <TableRow>
                                        <TableCell colSpan={10} className="text-center py-12">
                                            <div className="flex flex-col items-center gap-2">
                                                <Loader2 className="w-6 h-6 text-[#4F6BED] animate-spin" />
                                                <p className="text-xs font-medium text-[#94A3B8]">Loading payment requests...</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : tableData && tableData.length > 0 ? (
                                    tableData.map((item, index) => {
                                        const badge = statusBadge(item?.approval_status)
                                        return (
                                            <TableRow key={item?.name || index} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                                                <TableCell className="text-center text-xs text-[#64748B] tabular-nums py-2 px-2">
                                                    {(currentPage - 1) * record_per_page + index + 1}
                                                </TableCell>
                                                <TableCell className="text-left text-xs font-semibold text-[#0F172A] py-2 px-2 text-nowrap">
                                                    {item?.name}
                                                </TableCell>
                                                <TableCell className="text-left text-xs text-[#475569] py-2 px-2 text-nowrap">
                                                    {item?.record || "—"}
                                                </TableCell>
                                                <TableCell className="text-center text-xs text-[#64748B] py-2 px-2 text-nowrap">
                                                    {item?.date || "—"}
                                                </TableCell>
                                                <TableCell className="text-left text-xs text-[#475569] py-2 px-2 text-nowrap">
                                                    {item?.company || "—"}
                                                </TableCell>
                                                <TableCell className="text-left text-xs text-[#475569] py-2 px-2 text-nowrap">
                                                    {item?.vendor_name || "—"}
                                                </TableCell>
                                                <TableCell className="text-right text-xs font-semibold text-[#0F172A] tabular-nums py-2 px-2 text-nowrap">
                                                    {item?.amount != null ? Number(item.amount).toLocaleString('en-IN') : "—"}
                                                </TableCell>
                                                <TableCell className="text-center py-2 px-2">
                                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-semibold px-2 py-0">
                                                        {item?.payment_type || "—"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center py-2 px-2">
                                                    <Badge variant="outline" className={`text-[10px] font-semibold px-2 py-0 ${badge.className}`}>
                                                        {badge.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center py-2 px-2">
                                                    <button
                                                        type="button"
                                                        className="w-7 h-7 rounded-lg bg-[#EEF2FF] flex items-center justify-center hover:bg-[#4F6BED] hover:text-white text-[#4F6BED] transition-colors mx-auto"
                                                        title="View"
                                                        onClick={() => router.push(`/raise-advance-payment?refno=${item?.name}`)}
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={10} className="text-center py-10">
                                            <div className="flex flex-col items-center gap-2">
                                                <FileText className="w-8 h-8 text-slate-300" />
                                                <p className="text-xs font-medium text-[#94A3B8]">No payment requests found</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    {tableData && tableData.length > 0 && (
                        <div className="px-4 pb-2 pt-1">
                            <Pagination currentPage={currentPage} record_per_page={record_per_page} setCurrentPage={setCurrentPage} total_event_list={total_event_list} />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default RaiseAdvacePaymentTable

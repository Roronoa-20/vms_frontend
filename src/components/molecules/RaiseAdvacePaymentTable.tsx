"use client"
import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../atoms/table'
import { Input } from '../atoms/input'
import Pagination from './Pagination'
import { Button } from '../atoms/button'
import { useRouter } from 'next/navigation'
import { getPaymentRequestList } from '@/src/services/advancePayment/advancePayment.services'
import { PaymentRequestRecord } from '@/src/types/advancePayment/advancePayment.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, CalendarDays, CreditCard, Eye, FileText } from 'lucide-react'

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
    const [showAll, setShowAll] = useState(false);

    const [total_event_list, settotalEventList] = useState(0);
    const [record_per_page] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        fetchData();
    }, [currentPage, dateFilter, vendorSearch, showAll]);

    const fetchData = async () => {
        try {
            const res = await getPaymentRequestList({
                search_term: vendorSearch || "",
                status: showAll ? "Pending" : "",
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
        <div className="p-4 space-y-5">
            <Card className="shadow-sm border-slate-200">
                <CardHeader className="pb-4 border-b border-slate-100">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F6BED] to-[#7C93F5] flex items-center justify-center shadow-sm">
                                <CreditCard className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-bold text-[#0F172A] tracking-tight">Payment Requests</CardTitle>
                                <p className="text-xs text-[#94A3B8] mt-0.5 font-medium">
                                    {total_event_list > 0 ? `${total_event_list} total request${total_event_list !== 1 ? 's' : ''}` : 'No requests found'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="relative">
                                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
                                <Input
                                    type="date"
                                    className="w-48 h-9 pl-9 rounded-lg border-slate-200 bg-white text-[13px] focus:border-[#4F6BED] focus:ring-[#4F6BED]/20 transition-colors"
                                    value={dateFilter}
                                    onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                                />
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
                                <Input
                                    placeholder="Search vendor..."
                                    className="w-56 h-9 pl-9 rounded-lg border-slate-200 bg-white text-[13px] focus:border-[#4F6BED] focus:ring-[#4F6BED]/20 transition-colors"
                                    value={vendorSearch}
                                    onChange={(e) => { setVendorSearch(e.target.value); setCurrentPage(1); }}
                                />
                            </div>
                            <button
                                onClick={() => { setShowAll(!showAll); setCurrentPage(1); }}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${showAll ? 'bg-[#4F6BED]' : 'bg-slate-300'}`}
                            >
                                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${showAll ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
                            </button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-0 px-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-[#F8FAFC] text-[13px] hover:bg-[#F8FAFC] border-b border-slate-200">
                                    <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider">Sr No.</TableHead>
                                    <TableHead className="text-left text-[#64748B] font-semibold text-xs uppercase tracking-wider">Payment Req</TableHead>
                                    <TableHead className="text-left text-[#64748B] font-semibold text-xs uppercase tracking-wider">PO Number</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider">Date</TableHead>
                                    <TableHead className="text-left text-[#64748B] font-semibold text-xs uppercase tracking-wider">Company</TableHead>
                                    <TableHead className="text-left text-[#64748B] font-semibold text-xs uppercase tracking-wider">Vendor</TableHead>
                                    <TableHead className="text-right text-[#64748B] font-semibold text-xs uppercase tracking-wider text-nowrap">Amount</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider text-nowrap">Type</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider">Status</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tableData && tableData.length > 0 ? (
                                    tableData.map((item, index) => {
                                        const badge = statusBadge(item?.approval_status)
                                        return (
                                            <TableRow key={item?.name || index} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                                                <TableCell className="text-center text-sm text-[#64748B] tabular-nums">
                                                    {(currentPage - 1) * record_per_page + index + 1}
                                                </TableCell>
                                                <TableCell className="text-left text-nowrap text-sm font-semibold text-[#0F172A]">
                                                    {item?.name}
                                                </TableCell>
                                                <TableCell className="text-left text-nowrap text-sm text-[#475569]">
                                                    {item?.record}
                                                </TableCell>
                                                <TableCell className="text-center text-nowrap text-sm text-[#64748B]">
                                                    {item?.date || "—"}
                                                </TableCell>
                                                <TableCell className="text-left text-nowrap text-sm text-[#475569]">
                                                    {item?.company || "—"}
                                                </TableCell>
                                                <TableCell className="text-left text-nowrap text-sm text-[#475569] max-w-[200px] truncate">
                                                    {item?.vendor_name || "—"}
                                                </TableCell>
                                                <TableCell className="text-right text-nowrap text-sm font-semibold text-[#0F172A] tabular-nums">
                                                    {item?.amount != null ? Number(item.amount).toLocaleString('en-IN') : "—"}
                                                </TableCell>
                                                <TableCell className="text-center text-nowrap">
                                                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 border border-blue-200 tracking-wide">
                                                        {item?.payment_type || "—"}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-center text-nowrap">
                                                    <Badge variant="outline" className={`text-[11px] font-semibold px-2.5 py-0.5 tracking-wide ${badge.className}`}>
                                                        {badge.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Button
                                                        className="h-8 px-3 rounded-lg bg-[#4F6BED] hover:bg-[#3B54D4] text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 mx-auto tracking-wide"
                                                        onClick={() => router.push(`/raise-advance-payment?refno=${item?.name}`)}
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        View
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={10} className="text-center py-12">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                                                    <FileText className="w-7 h-7 text-slate-300" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-[#64748B]">No payment requests found</p>
                                                    <p className="text-xs text-[#94A3B8] mt-1 font-medium">Try adjusting your filters or search criteria</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    {tableData && tableData.length > 0 && (
                        <div className="px-4 pb-3 pt-1">
                            <Pagination currentPage={currentPage} record_per_page={record_per_page} setCurrentPage={setCurrentPage} total_event_list={total_event_list} />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default RaiseAdvacePaymentTable
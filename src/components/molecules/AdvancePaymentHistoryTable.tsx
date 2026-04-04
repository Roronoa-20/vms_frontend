"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, History, IndianRupee, ArrowLeft, CalendarDays } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../atoms/table'
import { useRouter } from 'next/navigation'
import { PaymentHistoryRecord } from '@/src/types/advancePayment/advancePayment.types'

interface Props {
    records: PaymentHistoryRecord[];
    refno?: string;
}

const COL_COUNT = 7

const statusColor = (status?: string) => {
    if (!status) return 'bg-gray-100 text-gray-600 border-gray-200'
    const s = status.toLowerCase()
    if (s.includes('approved')) return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    if (s.includes('reject')) return 'bg-red-50 text-red-700 border-red-200'
    if (s.includes('pending') || s.includes('awaiting')) return 'bg-amber-50 text-amber-700 border-amber-200'
    return 'bg-blue-50 text-blue-700 border-blue-200'
}

const fmtAmt = (n: number) =>
    Number.isFinite(n) ? n.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) : '—'

const fmtPct = (n: number) =>
    Number.isFinite(n) ? `${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}%` : '—'

const sumRaisedAmounts = (list: PaymentHistoryRecord[]) =>
    list.reduce(
        (sum, entry) =>
            sum +
            (entry.items?.reduce((row, item) => row + (Number(item.raised_amount) || 0), 0) ?? 0),
        0
    );

const AdvancePaymentHistoryTable = ({ records = [], refno }: Props) => {
    const router = useRouter();
    const [expandedTeams, setExpandedTeams] = useState<Set<number>>(() => new Set(records.map((_, i) => i)));

    useEffect(() => {
        setExpandedTeams(new Set(records.map((_, i) => i)));
    }, [records]);

    const totalItems = useMemo(() => records.reduce((acc, e) => acc + (e.items?.length || 0), 0), [records]);
    const totalRaisedAmount = useMemo(() => sumRaisedAmounts(records), [records]);

    const toggleTeam = (index: number) => {
        setExpandedTeams(prev => {
            const next = new Set(prev);
            if (next.has(index)) next.delete(index);
            else next.add(index);
            return next;
        });
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <Card className="shadow-sm border-slate-200 overflow-hidden">
                <CardHeader className="py-3 px-4 bg-gradient-to-r from-[#F8FAFC] to-white border-b border-slate-100">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300"
                            >
                                <ArrowLeft className="w-3.5 h-3.5 text-[#475569]" />
                            </button>
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] flex items-center justify-center shadow-sm">
                                <History className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-sm font-bold text-[#0F172A] tracking-tight">Advance Payment History</CardTitle>
                                <p className="text-[11px] text-[#94A3B8] mt-0.5 font-medium leading-none">
                                    {refno && <span className="text-[#64748B]">{refno}</span>}
                                    {refno && ' · '}
                                    {records.length} request{records.length !== 1 ? 's' : ''} · {totalItems} line{totalItems !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                        {totalRaisedAmount > 0 && (
                            <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-emerald-100/60 border border-emerald-200 rounded-xl px-3.5 py-2 shadow-sm">
                                <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center">
                                    <IndianRupee className="w-3 h-3 text-white" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-semibold text-emerald-600/70 uppercase tracking-wider leading-none">Total raised</p>
                                    <p className="text-sm font-bold text-emerald-700 tabular-nums leading-tight">{fmtAmt(totalRaisedAmount)}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardHeader>
            </Card>

            {/* Single table card with inline accordion groups */}
            <Card className="shadow-sm border-slate-200 overflow-hidden">
                {records.length > 0 ? (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-[#F8FAFC] hover:bg-[#F8FAFC] border-b border-slate-200">
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-9 px-3 w-12">Sr. No.</TableHead>
                                    <TableHead className="text-left text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-9 px-3 text-nowrap">Item</TableHead>
                                    <TableHead className="text-left text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-9 px-3 text-nowrap">Payment Type</TableHead>
                                    <TableHead className="text-right text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-9 px-3 text-nowrap">Pay %</TableHead>
                                    <TableHead className="text-right text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-9 px-3 text-nowrap">Total Amt</TableHead>
                                    <TableHead className="text-right text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-9 px-3 text-nowrap">Raised Amt</TableHead>
                                    <TableHead className="text-right text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-9 px-3 text-nowrap">Balance Amt</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {records.map((entry, index) => {
                                    const sc = statusColor(entry.status);
                                    const isOpen = expandedTeams.has(index);

                                    return (
                                        <React.Fragment key={`${entry.payment_req}-${index}`}>
                                            {/* Group header row */}
                                            <TableRow
                                                className="bg-[#EEF2FF] hover:bg-[#E5ECFF] cursor-pointer border-b border-slate-200"
                                                onClick={() => toggleTeam(index)}
                                            >
                                                <TableCell colSpan={COL_COUNT} className="py-0 px-3">
                                                    <div className="flex items-center justify-between gap-3 py-2.5 flex-wrap">
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <ChevronDown className={`w-4 h-4 text-[#4F6BED] flex-shrink-0 transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`} />
                                                            <span className="text-xs font-bold text-[#2568EF] truncate">{entry.payment_req || '—'}</span>
                                                            {entry.date && (
                                                                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#64748B] flex-shrink-0">
                                                                    <CalendarDays className="w-3 h-3" />
                                                                    {entry.date}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <Badge variant="outline" className={`text-[10px] font-semibold px-2.5 py-0.5 ${sc}`}>
                                                            {entry.status || '—'}
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                            </TableRow>

                                            {/* Item rows */}
                                            {isOpen && entry.items && entry.items.length > 0 && (
                                                entry.items.map((item, idx) => (
                                                    <TableRow key={`${index}-${idx}`} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                                                        <TableCell className="text-center text-xs text-[#64748B] tabular-nums py-2.5 px-3">{idx + 1}</TableCell>
                                                        <TableCell className="text-left text-xs font-semibold text-[#0F172A] py-2.5 px-3 text-nowrap">{item.item || '—'}</TableCell>
                                                        <TableCell className="text-left text-xs text-[#475569] py-2.5 px-3 text-nowrap">{item.payment_type || '—'}</TableCell>
                                                        <TableCell className="text-right text-xs font-semibold text-[#0F172A] tabular-nums py-2.5 px-3">{fmtPct(item.payment_percentage)}</TableCell>
                                                        <TableCell className="text-right text-xs text-[#475569] tabular-nums py-2.5 px-3">{fmtAmt(item.total_amount)}</TableCell>
                                                        <TableCell className="text-right text-xs text-[#475569] tabular-nums py-2.5 px-3">{fmtAmt(item.raised_amount)}</TableCell>
                                                        <TableCell className="text-right text-xs font-semibold text-[#0F172A] tabular-nums py-2.5 px-3">{fmtAmt(item.balance_amount)}</TableCell>
                                                    </TableRow>
                                                ))
                                            )}

                                            {isOpen && (!entry.items || entry.items.length === 0) && (
                                                <TableRow>
                                                    <TableCell colSpan={COL_COUNT} className="text-center py-4 text-xs text-[#94A3B8]">No items found</TableCell>
                                                </TableRow>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3 py-16">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                            <History className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-sm font-semibold text-[#475569]">No history found</p>
                        <p className="text-xs text-[#94A3B8]">There are no payment history records for this reference.</p>
                    </div>
                )}
            </Card>
        </div>
    )
}

export default AdvancePaymentHistoryTable

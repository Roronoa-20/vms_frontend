"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import AdvancePaymentHistoryTable from '../molecules/AdvancePaymentHistoryTable'
import { getPaymentHistory } from '@/src/services/advancePayment/advancePayment.services'
import { PaymentHistoryRecord } from '@/src/types/advancePayment/advancePayment.types'
import { Loader2, AlertCircle } from 'lucide-react'

const AdvancePaymentHistory = () => {
    const searchParams = useSearchParams();
    const refno = searchParams.get("refno") || "";

    const [records, setRecords] = useState<PaymentHistoryRecord[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPaymentHistory = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getPaymentHistory({
                page_no: 1,
                page_size: 100,
                doctype: "Purchase Order",
                ...(refno ? { doc_name: "12312312312" } : {}),
            });

            if (response?.data) {
                setRecords(response.data);

                let total = 0;
                response.data.forEach((record: PaymentHistoryRecord) => {
                    record.items?.forEach((item) => {
                        total += item.total_amount || 0;
                    });
                });
                setTotalAmount(total);
            } else {
                setRecords([]);
                setTotalAmount(0);
            }

            setError(null);
        } catch (err) {
            console.error("Error fetching payment history:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch payment history");
        } finally {
            setLoading(false);
        }
    }, [refno]);

    useEffect(() => {
        fetchPaymentHistory();
    }, [fetchPaymentHistory]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-7 h-7 text-[#4F6BED] animate-spin" />
                    <p className="text-xs font-semibold text-[#1E293B]">Loading payment history...</p>
                    <p className="text-[11px] text-[#94A3B8]">Please wait</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3 max-w-sm text-center">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <p className="text-xs font-semibold text-[#1E293B]">Failed to load history</p>
                    <p className="text-[11px] text-[#94A3B8]">{error}</p>
                    <button
                        type="button"
                        onClick={fetchPaymentHistory}
                        className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#475569] shadow-sm transition-colors hover:bg-slate-50"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <AdvancePaymentHistoryTable records={records} totalAmount={totalAmount} refno={refno} />
        </div>
    )
}

export default AdvancePaymentHistory

"use client"
import React, { useEffect, useState } from 'react'
import AdvancePaymentHistoryTable from '../molecules/AdvancePaymentHistoryTable'
import { getPaymentHistory } from '@/src/services/advancePayment/advancePayment.services'
import { PaymentHistoryRecord } from '@/src/types/advancePayment/advancePayment.types'

interface ApprovalHistory {
    team_name: string;
    approval_status: string;
    items: {
        sr_no: number;
        material_code: string;
        material_description: string;
        hsn_code: string;
        uom: string;
        quantity: number;
        rate: number;
        schedule_date: string;
        schedule_quantity: number;
    }[]
}

const AdvancePaymentHistory = () => {
    const [approvalHistory, setApprovalHistory] = useState<ApprovalHistory[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPaymentHistory();
    }, []);

    const fetchPaymentHistory = async () => {
        try {
            setLoading(true);
            const response = await getPaymentHistory({
                page_no: 1,
                page_size: 100,
            });

            if (response && response.data) {
                // Transform the response data to match the accordion structure
                const transformedData: ApprovalHistory[] = response.data.map((record: PaymentHistoryRecord) => ({
                    team_name: record.payment_req || "N/A",
                    approval_status: record.status || "Pending",
                    items: record.items?.map((item, index) => ({
                        sr_no: index + 1,
                        material_code: item.item || "-",
                        material_description: item.payment_type || "-",
                        hsn_code: "-",
                        uom: "-",
                        quantity: item.payment_percentage || 0,
                        rate: item.raised_amount || 0,
                        schedule_date: "-",
                        schedule_quantity: item.total_amount || 0,
                    })) || [],
                }));

                setApprovalHistory(transformedData);

                // Calculate total amount
                let total = 0;
                response.data.forEach((record: PaymentHistoryRecord) => {
                    if (record.items) {
                        record.items.forEach((item) => {
                            total += item.total_amount || 0;
                        });
                    }
                });
                setTotalAmount(total);
            }

            setError(null);
        } catch (err) {
            console.error("Error fetching payment history:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch payment history");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-4">
                {/* <h1 className="text-2xl font-semibold text-black mb-4">Advance Payment History</h1> */}
                <div className="text-center text-gray-500">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                {/* <h1 className="text-2xl font-semibold text-black mb-4">Advance Payment History</h1> */}
                <div className="text-center text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="p-4">
            {/* <h1 className="text-2xl font-semibold text-black mb-4">Advance Payment History</h1> */}
            <AdvancePaymentHistoryTable approvalHistory={approvalHistory} totalAmount={totalAmount} />
        </div>
    )
}

export default AdvancePaymentHistory
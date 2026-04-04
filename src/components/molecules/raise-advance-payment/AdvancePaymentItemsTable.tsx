"use client"
import { Table, TableBody, TableCell, TableHead, TableRow } from '../../atoms/table'
import React, { useEffect, useState } from 'react'
import { TableHeader } from '../../atoms/table'
import { Button } from '../../atoms/button'
import Pagination from '../Pagination'
import { useRouter } from 'next/navigation'
import PopUp from '../PopUp'
import { processApprovalAction } from '@/src/services/advancePayment/advancePayment.services'
import { PaymentRequestDetails } from '@/src/types/advancePayment/advancePayment.types'
import { Input } from '../../atoms/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, Package, Landmark, Hash, CalendarDays, IndianRupee, Loader2 } from 'lucide-react'

interface Props {
    paymentDetails?: PaymentRequestDetails
    refno: string
}

const AdvancePaymentItemsTable = ({ paymentDetails, refno }: Props) => {

    const items = paymentDetails?.payment_request_items || [];
    const total_event_list = items.length;
    const [record_per_page] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [status, setStatus] = useState<"approve" | "reject" | "">("");
    const [comments, setComments] = useState("");
    const [isDialog, setIsDialog] = useState(false);
    const [tresuaryDetails, setTreasuryDetails] = useState({
        utr_number: paymentDetails?.utr_number || "",
        payment_date: paymentDetails?.payment_date || "",
        payment_amount: paymentDetails?.payment_amount || ""
    });
    const [isProcessing, setIsProcessing] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setTreasuryDetails({
            utr_number: paymentDetails?.utr_number || "",
            payment_date: paymentDetails?.payment_date || "",
            payment_amount: paymentDetails?.payment_amount || ""
        });
    }, [paymentDetails?.utr_number, paymentDetails?.payment_date, paymentDetails?.payment_amount]);

    const handleApproval = async () => {
        if (!status) return;
        if (paymentDetails?.is_treasury_visible === 1) {
            if (!tresuaryDetails.utr_number || !tresuaryDetails.payment_date || !tresuaryDetails.payment_amount) {
                alert("Please fill all treasury details to approve the payment request.");
                return;
            }
        }
        try {
            setIsProcessing(true);
            const wasApprove = status === "approve";
            const res = await processApprovalAction({
                doctype: "Payment Requisition Form",
                doc_name: refno,
                action: wasApprove ? "Approve" : "Reject",
                remarks: comments,
                utr_number: tresuaryDetails.utr_number,
                payment_date: tresuaryDetails.payment_date,
                payment_amount: tresuaryDetails.payment_amount
            });
            handleClose();
            setIsProcessing(false);
            router.refresh();
            alert(res?.message || (wasApprove ? "Approved successfully" : "Rejected successfully"));
        } catch (error: unknown) {
            setIsProcessing(false);
            console.error(error);
            const message = error instanceof Error ? error.message : "Error processing approval action";
            alert(message);
        }
    };

    const handleClose = () => {
        setIsDialog(false);
        setComments("");
        setStatus("");
    };

    return (
        <div className="space-y-5">
            {isProcessing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3 bg-white rounded-2xl px-8 py-6 shadow-xl">
                        <Loader2 className="w-8 h-8 text-[#4F6BED] animate-spin" />
                        <p className="text-sm font-semibold text-[#1E293B]">Processing...</p>
                        <p className="text-xs text-[#94A3B8]">Please wait</p>
                    </div>
                </div>
            )}
            <Card className="shadow-sm border-slate-200">
                <CardHeader className="py-3 px-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F59E0B] to-[#F97316] flex items-center justify-center shadow-sm">
                            <Package className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-sm font-bold text-[#0F172A] tracking-tight">Payment Request Items</CardTitle>
                            <p className="text-[11px] text-[#94A3B8] mt-0.5 font-medium leading-none">{items.length} item{items.length !== 1 ? 's' : ''} in this request</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-0 px-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-[#F8FAFC] hover:bg-[#F8FAFC] border-b border-slate-200">
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2">Sr.</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 text-nowrap">Item Code</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 text-nowrap">Payment Type</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 text-nowrap">Pay %</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 text-nowrap">Total Amt</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 text-nowrap">Raised Amt</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 text-nowrap">Balance Amt</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.length > 0 ? (
                                    items.map((item, index) => (
                                        <TableRow key={item.name} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                                            <TableCell className="text-center text-xs text-[#64748B] tabular-nums py-2 px-2">
                                                {(currentPage - 1) * record_per_page + index + 1}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-xs font-semibold text-[#0F172A] py-2 px-2">
                                                {item?.item_code}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-xs text-[#475569] py-2 px-2">
                                                {item?.payment_type}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap py-2 px-2">
                                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-semibold px-2 py-0 tabular-nums">
                                                    {item?.payment_percentage}%
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-xs font-semibold text-[#0F172A] tabular-nums py-2 px-2">
                                                {item?.total_amount}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-xs text-emerald-600 font-semibold tabular-nums py-2 px-2">
                                                {item?.raised_amount}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-xs text-amber-600 font-semibold tabular-nums py-2 px-2">
                                                {item?.balance_amount}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8">
                                            <div className="flex flex-col items-center gap-2">
                                                <Package className="w-8 h-8 text-slate-300" />
                                                <p className="text-xs font-medium text-[#94A3B8]">No items found</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    {items.length > 0 && (
                        <div className="px-4 pb-2 pt-1">
                            <Pagination currentPage={currentPage} record_per_page={record_per_page} setCurrentPage={setCurrentPage} total_event_list={total_event_list} />
                        </div>
                    )}
                </CardContent>
            </Card>

            {paymentDetails?.is_treasury_visible ? (
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="py-3 px-4 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-sm">
                                <Landmark className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-sm font-bold text-[#0F172A] tracking-tight">Treasury Details</CardTitle>
                                <p className="text-[11px] text-[#94A3B8] mt-0.5 font-medium leading-none">Fill in the payment transaction details</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-[#475569] flex items-center gap-1.5 uppercase tracking-wider">
                                    <Hash className="w-3.5 h-3.5 text-[#94A3B8]" />
                                    UTR Number <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    name="UTR Number"
                                    placeholder="Enter UTR number"
                                    className="rounded-lg h-10 bg-white border-slate-200 focus:border-[#4F6BED] focus:ring-[#4F6BED]/20 transition-colors"
                                    value={tresuaryDetails?.utr_number || ''}
                                    maxLength={20}
                                    onChange={(e) => {
                                        setTreasuryDetails((prev) => ({
                                            ...prev,
                                            utr_number: e.target.value
                                        }))
                                    }}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-[#475569] flex items-center gap-1.5 uppercase tracking-wider">
                                    <CalendarDays className="w-3.5 h-3.5 text-[#94A3B8]" />
                                    Payment Date <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    name="Payment Date"
                                    placeholder="Select payment date"
                                    className="rounded-lg h-10 bg-white border-slate-200 focus:border-[#4F6BED] focus:ring-[#4F6BED]/20 transition-colors"
                                    value={tresuaryDetails?.payment_date || ''}
                                    onChange={(e) => {
                                        setTreasuryDetails((prev) => ({
                                            ...prev,
                                            payment_date: e.target.value
                                        }))
                                    }}
                                    type="date"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-[#475569] flex items-center gap-1.5 uppercase tracking-wider">
                                    <IndianRupee className="w-3.5 h-3.5 text-[#94A3B8]" />
                                    Payment Amount <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    name="Payment Amount"
                                    placeholder="Enter payment amount"
                                    className="rounded-lg h-10 bg-white border-slate-200 focus:border-[#4F6BED] focus:ring-[#4F6BED]/20 transition-colors"
                                    value={tresuaryDetails?.payment_amount || ''}
                                    type="number"
                                    maxLength={10}
                                    onChange={(e) => {
                                        setTreasuryDetails((prev) => ({
                                            ...prev,
                                            payment_amount: e.target.value
                                        }))
                                    }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : null}

            {paymentDetails?.can_approve && (
                <Card className="shadow-sm border-slate-200">
                    <CardContent className="py-4">
                        <div className="flex items-center justify-end gap-3 flex-wrap">
                            <Button
                                variant={"backbtn"}
                                size={"backbtnsize"}
                                className="px-6 rounded-xl flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 shadow-sm transition-colors"
                                onClick={() => { setStatus("reject"); setIsDialog(true); }}
                            >
                                <XCircle className="w-4 h-4" />
                                Reject
                            </Button>
                            <Button
                                variant={"nextbtn"}
                                size={"nextbtnsize"}
                                className="px-6 rounded-xl flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
                                onClick={() => { setStatus("approve"); setIsDialog(true); }}
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                Approve
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {isDialog &&
                <PopUp
                    handleClose={handleClose}
                    headerText={status === "approve" ? "Approve Payment" : "Reject Payment"}
                    isSubmit={true}
                    Submitbutton={handleApproval}
                    classname="md:max-w-[500px] md:max-h-[380px]"
                >
                    <div className="mt-4">
                        <label className="text-sm font-semibold text-[#1E293B] pb-2 block">
                            Comments {status === "reject" && <span className="text-xs text-[#94A3B8] font-normal">(Provide a reason for rejection)</span>}
                        </label>
                        <textarea
                            onChange={(e) => setComments(e.target.value)}
                            value={comments}
                            className="w-full border border-slate-200 rounded-lg p-3 text-sm text-[#334155] focus:border-[#4F6BED] focus:ring-2 focus:ring-[#4F6BED]/20 outline-none transition-all resize-none"
                            rows={4}
                            placeholder="Enter your comments..."
                        />
                    </div>
                </PopUp>
            }
        </div>
    )
}

export default AdvancePaymentItemsTable
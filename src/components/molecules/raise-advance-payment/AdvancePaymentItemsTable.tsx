"use client"
import { Table, TableBody, TableCell, TableHead, TableRow } from '../../atoms/table'
import React, { useState } from 'react'
import { TableHeader } from '../../atoms/table'
import { Button } from '../../atoms/button'
import Pagination from '../Pagination'
import { useRouter } from 'next/navigation'
import PopUp from '../PopUp'
import { processApprovalAction } from '@/src/services/advancePayment/advancePayment.services'
import { PaymentRequestDetails } from '@/src/types/advancePayment/advancePayment.types'
import { Input } from '../../atoms/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, CheckCircle2, XCircle, Package, Landmark, Hash, CalendarDays, IndianRupee } from 'lucide-react'

interface Props {
    paymentDetails?: PaymentRequestDetails
    refno: string
}

const AdvancePaymentItemsTable = ({ paymentDetails, refno }: Props) => {

    const items = paymentDetails?.payment_request_items || [];
    const [total_event_list] = useState(items.length);
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

    const router = useRouter();

    const handleApproval = async () => {
        if (!status) return;
        if (paymentDetails?.is_treasury_visible === 1) {
            if (!tresuaryDetails.utr_number || !tresuaryDetails.payment_date || !tresuaryDetails.payment_amount) {
                alert("Please fill all treasury details to approve the payment request.");
                return;
            }
        }
        try {
            const res = await processApprovalAction({
                doctype: "Payment Requisition Form",
                doc_name: refno,
                action: status === "approve" ? "Approve" : "Reject",
                remarks: comments,
                utr_number: tresuaryDetails.utr_number,
                payment_date: tresuaryDetails.payment_date,
                payment_amount: tresuaryDetails.payment_amount
            });
            alert(res?.message || (status === "approve" ? "Approved successfully" : "Rejected successfully"));
            location.reload();
        } catch (error: any) {
            console.error(error);
            alert(error?.message || "Error processing approval action");
        }
    };

    const handleClose = () => {
        setIsDialog(false);
        setComments("");
        setStatus("");
    };

    return (
        <div className="space-y-5">
            <Card className="shadow-sm border-slate-200">
                <CardHeader className="pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#F97316] flex items-center justify-center shadow-sm">
                            <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold text-[#0F172A] tracking-tight">Payment Request Items</CardTitle>
                            <p className="text-xs text-[#94A3B8] mt-0.5 font-medium">{items.length} item{items.length !== 1 ? 's' : ''} in this request</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-4 px-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-[#F8FAFC] text-[13px] hover:bg-[#F8FAFC] border-b border-slate-200">
                                    <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider">Sr No.</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider">Item Code</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider">Payment Type</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider text-nowrap">Payment %</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider text-nowrap">Total Amount</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider text-nowrap">Raised Amount</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider text-nowrap">Balance Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.length > 0 ? (
                                    items.map((item, index) => (
                                        <TableRow key={item.name} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                                            <TableCell className="text-center text-sm text-[#64748B] tabular-nums">
                                                {(currentPage - 1) * record_per_page + index + 1}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-sm font-semibold text-[#0F172A]">
                                                {item?.item_code}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-sm text-[#475569]">
                                                {item?.payment_type}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap">
                                                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 tabular-nums">
                                                    {item?.payment_percentage}%
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-sm font-semibold text-[#0F172A] tabular-nums">
                                                {item?.total_amount}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-sm text-emerald-600 font-semibold tabular-nums">
                                                {item?.raised_amount}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-sm text-amber-600 font-semibold tabular-nums">
                                                {item?.balance_amount}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-10">
                                            <div className="flex flex-col items-center gap-2">
                                                <Package className="w-10 h-10 text-slate-300" />
                                                <p className="text-sm font-medium text-[#94A3B8]">No items found</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    {items.length > 0 && (
                        <div className="px-4 pb-3 pt-1">
                            <Pagination currentPage={currentPage} record_per_page={record_per_page} setCurrentPage={setCurrentPage} total_event_list={total_event_list} />
                        </div>
                    )}
                </CardContent>
            </Card>

            {paymentDetails?.is_treasury_visible ? (
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-sm">
                                <Landmark className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-bold text-[#0F172A] tracking-tight">Treasury Details</CardTitle>
                                <p className="text-xs text-[#94A3B8] mt-0.5 font-medium">Fill in the payment transaction details</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            <Card className="shadow-sm border-slate-200">
                <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                        <Button
                            variant={"backbtn"}
                            size={"backbtnsize"}
                            className="px-5 rounded-xl flex items-center gap-2 border-slate-200 text-[#475569] hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-colors"
                            onClick={() => { router.back() }}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                        {paymentDetails?.can_approve && (
                            <div className="flex items-center gap-3">
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
                        )}
                    </div>
                </CardContent>
            </Card>

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
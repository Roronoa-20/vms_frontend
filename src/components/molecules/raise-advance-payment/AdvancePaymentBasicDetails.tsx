"use client"
import React from 'react'
import { PaymentRequestDetails } from '@/src/types/advancePayment/advancePayment.types'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    FileText,
    Building2,
    CalendarDays,
    CreditCard,
    Users,
    UserCircle,
    IndianRupee,
    Paperclip,
    Hash,
    ShoppingCart,
    ClipboardList,
    History
} from 'lucide-react'
import { BackButton } from '@/src/components/atoms/BackButton'

interface Props {
    paymentDetails?: PaymentRequestDetails
    refno?: string
    po_no?: string
}

const statusColor = (status?: string) => {
    if (!status) return 'bg-gray-100 text-gray-600 border-gray-200'
    const s = status.toLowerCase()
    if (s.includes('approved')) return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    if (s.includes('awaiting') || s.includes('pending')) return 'bg-amber-50 text-amber-700 border-amber-200'
    if (s.includes('reject')) return 'bg-red-50 text-red-700 border-red-200'
    return 'bg-blue-50 text-blue-700 border-blue-200'
}

const DetailField = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string | null }) => (
    <div className="flex items-start gap-2.5 min-w-0">
        <div className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-md bg-[#EEF2FF] flex items-center justify-center">
            <Icon className="w-3.5 h-3.5 text-[#4F6BED]" />
        </div>
        <div className="min-w-0">
            <p className="text-[10px] font-medium text-[#94A3B8] uppercase tracking-wider leading-none">{label}</p>
            <p className="text-xs font-semibold text-[#1E293B] mt-0.5 truncate leading-snug">{value || '—'}</p>
        </div>
    </div>
)

const AdvancePaymentBasicDetails = ({ paymentDetails, refno, po_no }: Props) => {
    return (
        <div className="space-y-4">
            <Card className="shadow-sm border-slate-200">
                <CardHeader className="py-3 px-4 border-b border-slate-100">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="flex-shrink-0">
                                <BackButton />
                            </div>
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F6BED] to-[#7C93F5] flex items-center justify-center shadow-sm flex-shrink-0">
                                    <CreditCard className="w-4 h-4 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <CardTitle className="text-sm font-bold text-[#0F172A] tracking-tight">Payment Request Details</CardTitle>
                                    {refno && <p className="text-[11px] text-[#94A3B8] mt-0.5 font-medium tracking-wide leading-none">Ref: {refno}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap justify-end sm:justify-end sm:ml-auto">
                            {refno && (
                                <Link
                                    href={`/advance-payment-history?refno=${encodeURIComponent(refno)}&po_no=${encodeURIComponent(po_no ?? paymentDetails?.po_no ?? '')}`}
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#475569] shadow-sm transition-colors hover:border-[#4F6BED]/40 hover:bg-[#F8FAFF] hover:text-[#4F6BED]"
                                >
                                    <History className="h-3.5 w-3.5" />
                                    Payment History
                                </Link>
                            )}
                            {paymentDetails?.payment_type && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[11px] font-semibold px-3 py-1 tracking-wide">
                                    {paymentDetails.payment_type}
                                </Badge>
                            )}
                            <Badge variant="outline" className={`text-[11px] font-semibold px-3 py-1 tracking-wide ${statusColor(paymentDetails?.status)}`}>
                                {paymentDetails?.status || 'Unknown'}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-4">
                        <DetailField icon={FileText} label="PO Number" value={paymentDetails?.po_no} />
                        <DetailField icon={CalendarDays} label="PO Date" value={paymentDetails?.po_date} />
                        <DetailField icon={Building2} label="Company" value={paymentDetails?.company} />
                        {/* <DetailField icon={Hash} label="Vendor Code" value={paymentDetails?.purchase_details?.vendor_code} /> */}
                        <DetailField icon={UserCircle} label="Vendor Name" value={`${paymentDetails?.vendor_name} (${paymentDetails?.purchase_details?.vendor_code})`} />
                        {/* <DetailField icon={ShoppingCart} label="Purchase Group" value={paymentDetails?.purchase_details?.purchase_group_name} /> */}
                        <DetailField icon={ClipboardList} label="Purchase Team" value={`${paymentDetails?.purchase_team} (${paymentDetails?.purchase_details?.purchase_group_name})`} />
                        <DetailField icon={Users} label="Contact Person" value={paymentDetails?.purchase_details?.contact_person} />
                        <DetailField icon={IndianRupee} label="Total PO Amount" value={paymentDetails?.total_amt ? `${paymentDetails.total_amt} ${paymentDetails.currency || ''}` : undefined} />
                        <DetailField icon={CalendarDays} label="Request Date" value={paymentDetails?.payment_req_date} />
                    </div>
                </CardContent>
            </Card>

            {paymentDetails?.purchase_details?.po_attachment?.url && (
                <Card className="shadow-sm border-slate-200">
                    <CardContent className="py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                                <Paperclip className="w-4 h-4 text-orange-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider leading-none">PO Attachment</p>
                                <Link
                                    target="_blank"
                                    href={paymentDetails.purchase_details.po_attachment.url}
                                    className="text-sm font-medium text-[#4F6BED] hover:text-[#3B54D4] hover:underline transition-colors truncate block mt-0.5"
                                >
                                    {paymentDetails.purchase_details.po_attachment.file_name}
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default AdvancePaymentBasicDetails
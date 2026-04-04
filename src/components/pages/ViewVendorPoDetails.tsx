"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../atoms/table'
import { Button } from '../atoms/button'
import Pagination from '../molecules/Pagination'
import { VendorPoDetailsType } from '@/src/types/view-po-details/poDetailsType'
import PopUp from '../molecules/PopUp'
import { BackButton } from '@/src/components/atoms/BackButton'
import { Input } from '../atoms/input'
import { acknowledgePo, fetchPoDetails as fetchPoDetailsApi, raiseAdvanceRequest } from '@/src/services/purchaseOrder/purchaseOrder.services'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    FileText, CalendarDays, Hash, UserCircle, ShoppingCart, Users,
    IndianRupee, CreditCard, CheckCircle2, Package,
    Loader2, Upload, MessageSquare, ClipboardList
} from 'lucide-react'

interface Props {
    poname: string
}

const statusColor = (status?: string) => {
    if (!status) return 'bg-gray-100 text-gray-600 border-gray-200'
    const s = status.toLowerCase()
    if (s.includes('approved') || s.includes('completed') || s.includes('confirmed')) return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    if (s.includes('awaiting') || s.includes('pending') || s.includes('draft') || s.includes('open')) return 'bg-amber-50 text-amber-700 border-amber-200'
    if (s.includes('reject') || s.includes('cancel')) return 'bg-red-50 text-red-700 border-red-200'
    return 'bg-blue-50 text-blue-700 border-blue-200'
}

const DetailField = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string | number | null }) => (
    <div className="flex items-start gap-2.5 min-w-0">
        <div className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-md bg-[#EEF2FF] flex items-center justify-center">
            <Icon className="w-3.5 h-3.5 text-[#4F6BED]" />
        </div>
        <div className="min-w-0">
            <p className="text-[10px] font-medium text-[#94A3B8] uppercase tracking-wider leading-none">{label}</p>
            <p className="text-xs font-semibold text-[#1E293B] mt-0.5 truncate leading-snug">{value ?? '—'}</p>
        </div>
    </div>
)

const ViewVendorPoDetails = ({ poname }: Props) => {
    const [poDetails, setPoDetails] = useState<VendorPoDetailsType["data"] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialog, setIsDialog] = useState(false);
    const [comment, setComment] = useState("");
    const [isAdvanceDialog, setIsAdvanceDialog] = useState(false);
    const [advanceClosureDate, setAdvanceClosureDate] = useState("");
    const [advanceRemarks, setAdvanceRemarks] = useState("");
    const [advanceFile, setAdvanceFile] = useState<File | null>(null);
    const advanceFileRef = useRef<HTMLInputElement>(null);
    const [advanceCurrentPage, setAdvanceCurrentPage] = useState<number>(1);
    const advanceRecordPerPage = 5;
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
    const [raiseAdvanceValues, setRaiseAdvanceValues] = useState<Record<number, number>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [total_event_list, settotalEventList] = useState(0);
    const [record_per_page] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const fetchPoDetails = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await fetchPoDetailsApi(poname);
            setPoDetails(res?.data);
            settotalEventList(res?.data?.items?.length || 0);
        } catch (err) {
            console.error("Error fetching PO details:", err);
        } finally {
            setIsLoading(false);
        }
    }, [poname]);

    useEffect(() => {
        if (poname) {
            fetchPoDetails();
        } else {
            setIsLoading(false);
            setPoDetails(null);
        }
    }, [poname, fetchPoDetails]);

    const handleAcknowledge = async () => {
        try {
            setIsSubmitting(true);
            const res = await acknowledgePo(poname, comment);
            handleClose();
            setIsSubmitting(false);
            await fetchPoDetails();
            alert(res?.message || "Acknowledged successfully");
        } catch (err: unknown) {
            setIsSubmitting(false);
            const message = err instanceof Error ? err.message : "Failed to acknowledge PO";
            alert(message);
        }
    };

    const handleClose = () => {
        setIsDialog(false);
        setComment("");
    };

    const handleAdvanceClose = () => {
        setIsAdvanceDialog(false);
        setAdvanceClosureDate("");
        setAdvanceRemarks("");
        setAdvanceFile(null);
        setRaiseAdvanceValues({});
        if (advanceFileRef.current) advanceFileRef.current.value = "";
    };

    const handleRaiseAdvanceChange = (idx: number, value: number, advanceBalance: number) => {
        if (value > advanceBalance) {
            alert(`Raise advance cannot exceed advance balance (${advanceBalance})`);
            return;
        }
        setRaiseAdvanceValues(prev => ({ ...prev, [idx]: value }));
    };

    const handleAdvanceSubmit = async () => {
        if (!advanceClosureDate) {
            alert("Please select Advance Closure Date");
            return;
        }
        try {
            setIsSubmitting(true);
            const items = selectedItemsList.map((item, idx) => ({
                material_code: item.material_code,
                name: item.name,
                total_amount: item.total_amount,
                advance: raiseAdvanceValues[idx] ?? item.advance ?? item.total_amount,
            }));
            const res = await raiseAdvanceRequest({
                po_no: poname,
                delivery_date: advanceClosureDate,
                remarks: advanceRemarks,
                payment_request_items: items,
            }, advanceFile || undefined);
            handleAdvanceClose();
            setSelectedItems(new Set());
            setIsSubmitting(false);
            await fetchPoDetails();
            alert(res?.message || "Advance request raised successfully");
        } catch (err: unknown) {
            setIsSubmitting(false);
            const message = err instanceof Error ? err.message : "Failed to raise advance request";
            alert(message);
        }
    };

    const handleSelectItem = (index: number) => {
        setSelectedItems(prev => {
            const updated = new Set(prev);
            if (updated.has(index)) {
                updated.delete(index);
            } else {
                updated.add(index);
            }
            return updated;
        });
    };

    const handleSelectAll = () => {
        if (!poDetails?.items) return;
        if (selectedItems.size === poDetails.items.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(poDetails.items.map((_, i) => i)));
        }
    };

    const selectedItemsList = poDetails?.items?.filter((_, index) => selectedItems.has(index)) || [];
    const totalAmount = selectedItemsList.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.rate)), 0);

    const itemStart = (currentPage - 1) * record_per_page;
    const paginatedItems = poDetails?.items?.slice(itemStart, itemStart + record_per_page) ?? [];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-[#4F6BED] animate-spin" />
                    <p className="text-sm font-semibold text-[#1E293B]">Loading PO details...</p>
                    <p className="text-xs text-[#94A3B8]">Please wait</p>
                </div>
            </div>
        );
    }

    if (!poname) {
        return (
            <div className="p-4 max-w-[1600px] mx-auto">
                <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-center">
                    <Package className="w-10 h-10 text-slate-300" />
                    <p className="text-sm font-semibold text-[#475569]">No purchase order selected</p>
                    <p className="text-xs text-[#94A3B8] max-w-sm">Open this page from the vendor PO list and choose View on a row.</p>
                    <div className="pt-2">
                        <BackButton />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
            {isSubmitting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3 bg-white rounded-2xl px-8 py-6 shadow-xl">
                        <Loader2 className="w-8 h-8 text-[#4F6BED] animate-spin" />
                        <p className="text-sm font-semibold text-[#1E293B]">Processing...</p>
                        <p className="text-xs text-[#94A3B8]">Please wait while we process your request</p>
                    </div>
                </div>
            )}

            {/* Basic PO Details */}
            <Card className="shadow-sm border-slate-200">
                <CardHeader className="py-3 px-4 border-b border-slate-100 bg-gradient-to-r from-[#F8FAFC] to-white">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="flex-shrink-0">
                                <BackButton />
                            </div>
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F6BED] to-[#7C93F5] flex items-center justify-center shadow-sm flex-shrink-0">
                                    <FileText className="w-4 h-4 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <CardTitle className="text-sm font-bold text-[#0F172A] tracking-tight">Purchase Order Details</CardTitle>
                                    {poDetails?.po_no && (
                                        <p className="text-[11px] text-[#94A3B8] mt-0.5 font-medium tracking-wide leading-none">PO: {poDetails.po_no}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap justify-end sm:ml-auto">
                            <Badge
                                variant="outline"
                                className={`text-[10px] font-semibold px-2.5 py-0.5 tracking-wide ${poDetails?.po_ack_by_vendor === 1 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}
                            >
                                {poDetails?.can_acknowledge === 1 ? 'Not Acknowledged' : 'Acknowledged'}
                            </Badge>
                            <Badge variant="outline" className={`text-[10px] font-semibold px-2.5 py-0.5 tracking-wide ${statusColor(poDetails?.status)}`}>
                                {poDetails?.status || 'Unknown'}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-4">
                        <DetailField icon={FileText} label="PO Number" value={poDetails?.po_no} />
                        <DetailField icon={CalendarDays} label="PO Date" value={poDetails?.po_date} />
                        <DetailField icon={Hash} label="Vendor Code" value={poDetails?.vendor_code} />
                        <DetailField icon={UserCircle} label="Vendor Name" value={poDetails?.vendor_name} />
                        <DetailField icon={ShoppingCart} label="Purchase Group" value={poDetails?.purchase_grp_name} />
                        <DetailField icon={Users} label="Contact Person" value={poDetails?.purchase_person} />
                        <DetailField icon={IndianRupee} label="Total Value" value={poDetails?.total_value} />
                        <DetailField icon={CreditCard} label="Terms of Payment" value={poDetails?.payment_terms_name} />
                    </div>
                </CardContent>
            </Card>

            {/* PO Items Table */}
            <Card className="shadow-sm border-slate-200">
                <CardHeader className="py-3 px-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-sm">
                            <Package className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-sm font-bold text-[#0F172A] tracking-tight">PO Items</CardTitle>
                            <p className="text-[11px] text-[#94A3B8] font-medium leading-none mt-0.5">
                                {poDetails?.items?.length || 0} item{(poDetails?.items?.length || 0) !== 1 ? 's' : ''}
                                {selectedItems.size > 0 && <span className="text-[#4F6BED] ml-1">· {selectedItems.size} selected</span>}
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-0 px-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-[#F8FAFC] hover:bg-[#F8FAFC] border-b border-slate-200">
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 w-10">
                                        <input
                                            type="checkbox"
                                            checked={poDetails?.items ? selectedItems.size === poDetails.items.length : false}
                                            onChange={handleSelectAll}
                                            className="w-3.5 h-3.5 rounded border-slate-300 text-[#4F6BED] focus:ring-[#4F6BED] cursor-pointer"
                                        />
                                    </TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2">Sr.</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 text-nowrap">Material Code</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 text-nowrap">Description</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 text-nowrap">HSN Code</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2">UOM</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2">Qty</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2">Rate</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 text-nowrap">Sche. Date</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 text-nowrap">Sche. Qty</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 text-nowrap">Total PO Amt</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 text-nowrap">Adv. Approved</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 text-nowrap">Total Adv. Requested</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 text-nowrap">Adv. Balance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {poDetails?.items && poDetails.items.length > 0 ? (
                                    paginatedItems.map((item, sliceIndex) => {
                                        const index = itemStart + sliceIndex;
                                        return (
                                        <TableRow
                                            key={item?.name ?? index}
                                            className={`hover:bg-slate-50 transition-colors border-b border-slate-100 cursor-pointer ${selectedItems.has(index) ? 'bg-[#F0F4FF]' : ''}`}
                                            onClick={() => handleSelectItem(index)}
                                        >
                                            <TableCell className="text-center py-1.5 px-2" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.has(index)}
                                                    onChange={() => handleSelectItem(index)}
                                                    className="w-3.5 h-3.5 rounded border-slate-300 text-[#4F6BED] focus:ring-[#4F6BED] cursor-pointer"
                                                />
                                            </TableCell>
                                            <TableCell className="text-center text-xs text-[#64748B] tabular-nums py-1.5 px-2">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-xs font-semibold text-[#0F172A] py-1.5 px-2">
                                                {item?.material_code}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-xs text-[#475569] py-1.5 px-2 max-w-[220px] truncate">
                                                {item?.description || "—"}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-xs text-[#64748B] py-1.5 px-2">
                                                {item?.hsn_code}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-xs text-[#64748B] py-1.5 px-2">
                                                {item?.uom}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-xs font-semibold text-[#0F172A] tabular-nums py-1.5 px-2">
                                                {item?.quantity}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-xs text-[#475569] tabular-nums py-1.5 px-2">
                                                {item?.rate}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-xs text-[#64748B] py-1.5 px-2">
                                                {item?.schedule_date || "—"}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-xs text-[#64748B] tabular-nums py-1.5 px-2">
                                                {item?.schedule_qty || "—"}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-xs font-semibold text-emerald-600 tabular-nums py-1.5 px-2">
                                                {item?.total_amount}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-xs text-[#475569] tabular-nums py-1.5 px-2">
                                                {item?.total_claimed_amt}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-xs text-[#475569] tabular-nums py-1.5 px-2">
                                                {item?.total_advance_requested}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-xs text-[#475569] tabular-nums py-1.5 px-2">
                                                {item?.advance_balance}
                                            </TableCell>
                                        </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={13} className="text-center py-8">
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
                    {poDetails?.items && poDetails.items.length > 0 && (
                        <div className="px-3 py-2 border-t border-slate-100 bg-[#FAFBFC]">
                            <Pagination currentPage={currentPage} record_per_page={record_per_page} setCurrentPage={setCurrentPage} total_event_list={total_event_list} />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Actions */}
            {(poDetails?.can_raise_advance === 1 || poDetails?.can_acknowledge === 1) && (
                <Card className="shadow-sm border-slate-200">
                    <CardContent className="py-3 px-4">
                        <div className="flex items-center justify-end gap-3 flex-wrap">
                            {poDetails?.can_raise_advance === 1 && (
                                <Button
                                    variant={"backbtn"}
                                    size={"backbtnsize"}
                                    className="px-5 rounded-xl flex items-center gap-2 border-[#4F6BED]/30 text-[#4F6BED] hover:bg-[#EEF2FF] hover:border-[#4F6BED]/50 shadow-sm transition-colors text-sm"
                                    onClick={() => {
                                        if (selectedItems.size === 0) {
                                            alert("Please select at least 1 line item");
                                            return;
                                        }
                                        setAdvanceCurrentPage(1);
                                        setIsAdvanceDialog(true);
                                    }}
                                >
                                    <IndianRupee className="w-4 h-4" />
                                    Raise Advance
                                </Button>
                            )}
                            {poDetails?.can_acknowledge === 1 && (
                                <Button
                                    variant={"nextbtn"}
                                    size={"nextbtnsize"}
                                    className="px-5 rounded-xl flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors text-sm"
                                    onClick={() => setIsDialog(true)}
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Acknowledge
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Acknowledge PO Dialog */}
            {isDialog && (
                <PopUp handleClose={handleClose} headerText="Acknowledge Purchase Order" isSubmit={true} Submitbutton={handleAcknowledge} classname="md:max-w-[600px] md:max-h-[400px]">
                    <div className="mt-2">
                        <label className="text-xs font-semibold text-[#475569] pb-2 uppercase tracking-wider flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5" />
                            Comment
                        </label>
                        <textarea
                            className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F6BED]/20 focus:border-[#4F6BED] transition-all resize-none text-[#334155] placeholder:text-[#94A3B8]"
                            placeholder="Enter your comment or remarks..."
                            rows={5}
                            onChange={(e) => setComment(e.target.value)}
                            value={comment}
                        />
                    </div>
                </PopUp>
            )}

            {/* Raise Advance Request Dialog */}
            {isAdvanceDialog && (
                <PopUp handleClose={handleAdvanceClose} headerText="Raise Advance Request" isSubmit={true} Submitbutton={handleAdvanceSubmit} classname="md:max-w-[80vw] md:max-h-[80vh] overflow-y-auto">
                    {/* PO Info Header */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3 p-4 bg-[#F8FAFC] rounded-xl border border-slate-100">
                        <div>
                            <p className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">PO Number</p>
                            <p className="text-sm font-semibold text-[#1E293B] mt-0.5">{poDetails?.po_no}</p>
                        </div>
                        <div>
                            <p className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">PO Date</p>
                            <p className="text-sm font-semibold text-[#1E293B] mt-0.5">{poDetails?.po_date}</p>
                        </div>
                        <div>
                            <p className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">Total PO Amount</p>
                            <p className="text-sm font-semibold text-emerald-600 mt-0.5">{poDetails?.total_value}</p>
                        </div>
                        <div>
                            <p className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">Terms of Payment</p>
                            <p className="text-sm font-semibold text-[#1E293B] mt-0.5">{poDetails?.payment_terms_name}</p>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="mt-4">
                        <div className="flex items-center gap-2 mb-3">
                            <ClipboardList className="w-4 h-4 text-[#4F6BED]" />
                            <h2 className="text-sm font-semibold text-[#1E293B]">Selected Items</h2>
                            <Badge variant="outline" className="text-[10px] font-semibold px-2 py-0.5 bg-[#EEF2FF] text-[#4F6BED] border-[#4F6BED]/20">
                                {selectedItemsList.length}
                            </Badge>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto border border-slate-200 rounded-xl">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-[#F8FAFC] text-[13px] hover:bg-[#F8FAFC] border-b border-slate-200">
                                        <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider">Sr.</TableHead>
                                        <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider">Material Code</TableHead>
                                        <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider text-nowrap">Description</TableHead>
                                        <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider">HSN</TableHead>
                                        <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider">UOM</TableHead>
                                        <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider">Qty</TableHead>
                                        <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider">Rate</TableHead>
                                        <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider text-nowrap">Sche. Date</TableHead>
                                        <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider text-nowrap">Sche. Qty</TableHead>
                                        <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider text-nowrap">Total Amt</TableHead>
                                        <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider text-nowrap">Adv. Approved</TableHead>
                                        <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider text-nowrap">Raise Advance</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedItemsList.length > 0 ? (
                                        selectedItemsList
                                            .slice((advanceCurrentPage - 1) * advanceRecordPerPage, advanceCurrentPage * advanceRecordPerPage)
                                            .map((item, index) => (
                                                <TableRow key={index} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                                                    <TableCell className="text-center text-sm text-[#64748B] tabular-nums">
                                                        {(advanceCurrentPage - 1) * advanceRecordPerPage + index + 1}
                                                    </TableCell>
                                                    <TableCell className="text-center text-nowrap text-sm font-semibold text-[#0F172A]">{item?.material_code}</TableCell>
                                                    <TableCell className="text-center text-nowrap text-sm text-[#475569]">{item?.description || "—"}</TableCell>
                                                    <TableCell className="text-center text-nowrap text-sm text-[#64748B]">{item?.hsn_code}</TableCell>
                                                    <TableCell className="text-center text-nowrap text-sm text-[#64748B]">{item?.uom}</TableCell>
                                                    <TableCell className="text-center text-nowrap text-sm font-semibold text-[#0F172A] tabular-nums">{item?.quantity}</TableCell>
                                                    <TableCell className="text-center text-nowrap text-sm text-[#475569] tabular-nums">{item?.rate}</TableCell>
                                                    <TableCell className="text-center text-nowrap text-sm text-[#64748B]">{item?.schedule_date}</TableCell>
                                                    <TableCell className="text-center text-nowrap text-sm text-[#64748B] tabular-nums">{item?.schedule_qty}</TableCell>
                                                    <TableCell className="text-center text-nowrap text-sm font-semibold text-emerald-600 tabular-nums">{item?.total_amount}</TableCell>
                                                    <TableCell className="text-center text-nowrap text-sm text-[#475569] tabular-nums">{item?.total_claimed_amt}</TableCell>
                                                    <TableCell className="text-center text-nowrap">
                                                        <div className="flex justify-center">
                                                            <Input
                                                                type="number"
                                                                className="w-24 rounded-lg h-9 border-slate-200 bg-white text-sm text-center tabular-nums"
                                                                value={raiseAdvanceValues[selectedItemsList.indexOf(item)] ?? item?.advance ?? ""}
                                                                onChange={(e) => {
                                                                    const idx = selectedItemsList.indexOf(item);
                                                                    handleRaiseAdvanceChange(idx, Number(e.target.value), item.advance_balance);
                                                                }}
                                                            />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={12} className="text-center py-8">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Package className="w-8 h-8 text-slate-300" />
                                                    <p className="text-sm font-medium text-[#94A3B8]">No items selected</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        {selectedItemsList.length > 0 && (
                            <div className="pt-1">
                                <Pagination currentPage={advanceCurrentPage} record_per_page={advanceRecordPerPage} setCurrentPage={setAdvanceCurrentPage} total_event_list={selectedItemsList.length} />
                            </div>
                        )}
                    </div>

                    {/* Total Amount */}
                    <div className="flex justify-end mt-3 px-1">
                        <div className="flex items-center gap-2 bg-[#F0FDF4] border border-emerald-200 rounded-lg px-4 py-2">
                            <IndianRupee className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs font-medium text-[#64748B] uppercase tracking-wider">Total Amount:</span>
                            <span className="text-sm font-bold text-emerald-700 tabular-nums">&#8377; {totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    {/* Bottom Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 border-t border-slate-100 pt-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#475569] uppercase tracking-wider flex items-center gap-1.5">
                                <CalendarDays className="w-3.5 h-3.5" />
                                Advance Closure Date
                            </label>
                            <Input
                                type="date"
                                value={advanceClosureDate}
                                onChange={(e) => setAdvanceClosureDate(e.target.value)}
                                className="rounded-lg h-10 border-slate-200 bg-white text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#475569] uppercase tracking-wider flex items-center gap-1.5">
                                <Upload className="w-3.5 h-3.5" />
                                Upload PI (Proforma Invoice)
                            </label>
                            <Input
                                type="file"
                                ref={advanceFileRef}
                                onChange={(e) => setAdvanceFile(e.target.files?.[0] || null)}
                                className="rounded-lg h-10 border-slate-200 bg-white text-sm file:mr-3 file:rounded-md file:border-0 file:bg-[#EEF2FF] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-[#4F6BED]"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#475569] uppercase tracking-wider flex items-center gap-1.5">
                                <MessageSquare className="w-3.5 h-3.5" />
                                Remarks
                            </label>
                            <Input
                                placeholder="Enter remarks..."
                                value={advanceRemarks}
                                onChange={(e) => setAdvanceRemarks(e.target.value)}
                                className="rounded-lg h-10 border-slate-200 bg-white text-sm"
                            />
                        </div>
                    </div>
                </PopUp>
            )}
        </div>
    )
}

export default ViewVendorPoDetails

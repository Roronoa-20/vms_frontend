"use client"
import React, { useRef, useState } from 'react'
import { Input } from '../../atoms/input'
import { Button } from '../../atoms/button'
import { Trash2, FileText, CalendarDays, Hash, UserCircle, Users, ShoppingCart, IndianRupee, CreditCard, Building2, CheckCircle, Upload, Paperclip, X } from 'lucide-react'
import { deleteFileApi } from './apiCalls'
import { uploadPoDocument as uploadPoDocumentApi, fetchPoDetails } from '@/src/services/purchaseOrder/purchaseOrder.services'
import { VendorPoDetailsType } from '@/src/types/view-po-details/poDetailsType'
import Link from 'next/link'
import PopUp from '../PopUp'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../atoms/table'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface POItemsTable {
    requested_for_earlydelivery?: boolean;
    product_name?: string;
    material_code?: string;
    short_text?: string;
    plant?: string;
    schedule_date?: string;
    quantity?: string | number;
    early_delivery_date?: string;
    purchase_team_remarks?: string;
}

interface Props {
    poBasicDetails: VendorPoDetailsType["data"]
}

const statusColor = (status?: string) => {
    if (!status) return 'bg-gray-100 text-gray-600 border-gray-200'
    const s = status.toLowerCase()
    if (s.includes('approved') || s.includes('completed') || s.includes('confirmed')) return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    if (s.includes('pending') || s.includes('draft') || s.includes('open')) return 'bg-amber-50 text-amber-700 border-amber-200'
    if (s.includes('reject') || s.includes('cancel')) return 'bg-red-50 text-red-700 border-red-200'
    return 'bg-blue-50 text-blue-700 border-blue-200'
}

const DetailField = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string | number | null }) => (
    <div className="flex items-start gap-3 min-w-0">
        <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-[#EEF2FF] flex items-center justify-center">
            <Icon className="w-4 h-4 text-[#4F6BED]" />
        </div>
        <div className="min-w-0">
            <p className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider leading-none">{label}</p>
            <p className="text-sm font-semibold text-[#1E293B] mt-1 truncate leading-snug">{value ?? '—'}</p>
        </div>
    </div>
)

const BasicPoDetilails = ({poBasicDetails}: Props) => {
    const [poAttachment,setPoAttachment] = useState<File | null>(null);
    const uploadPoRef = useRef<HTMLInputElement>(null);
    const [poBasicDetailsState, setPoBasicDetailsState] = useState<VendorPoDetailsType["data"]>(poBasicDetails as VendorPoDetailsType["data"]);
    const [POItemsTable, setPOItemsTable] = useState<POItemsTable[]>([]);
    const [isEarlyDeliveryDialog, setIsEarlyDeliveryDialog] = useState<boolean>(false);

    const resetFileUpload = () => {
        if(uploadPoRef.current){
            uploadPoRef.current.value = "";
        }
    }

    const uploadPoDocument = async() => {
        if(!poAttachment){
            alert("Please select a file to upload");
            return;
        }
        await uploadPoDocumentApi(poBasicDetailsState.po_no, poAttachment).then(async () => {
                alert("File uploaded successfully");
                resetFileUpload();
                setPoAttachment(null);
                const poDetails = await fetchPoDetails(poBasicDetailsState.po_no);
            setPoBasicDetailsState(poDetails?.data);
        }).catch((err: any) => {
            alert(err?.message || "Failed to upload file");
        });
    }

    const deletePoDocument = async() => {
        await deleteFileApi(poBasicDetailsState.po_no).then(async()=>{
                alert("File deleted successfully");
            const poDetails = await fetchPoDetails(poBasicDetailsState.po_no);
            setPoBasicDetailsState(poDetails?.data);
        }
    ).catch((err)=>{
        alert("Failed to delete file");
    });
    }


    const handleTableChange = (index: number, name: string, value: string | boolean) => {
    setPOItemsTable((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], [name]: value };
      }
      return updated;
    });
  }

  const handlePoItemsSubmit = async () => {
    const url = API_END_POINTS?.submitPOItems;
    const updatedData = { items: POItemsTable, po_name: poBasicDetailsState.po_no };
    const response: AxiosResponse = await requestWrapper({ url: url, method: "POST", data: { data: updatedData } });
    if (response?.status == 200) {
      alert("submitted successfully");
    }
  }

  const handleClose = () => {
    setIsEarlyDeliveryDialog(false);
  }

  const handleOpen = () => {
    fetchPOItems();
    setIsEarlyDeliveryDialog(true);
  }

  const fetchPOItems = async () => {
    const url = `${API_END_POINTS?.POItemsTable}?po_name=${poBasicDetailsState.po_no}`;
    const response: AxiosResponse = await requestWrapper({ url: url, method: "GET" });
    if (response?.status == 200) {
      setPOItemsTable(response?.data?.message?.items)
    }
  }

  return (
    <div className="space-y-4">
        <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4 border-b border-slate-100">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F6BED] to-[#7C93F5] flex items-center justify-center shadow-sm">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold text-[#0F172A] tracking-tight">Purchase Order Details</CardTitle>
                            {poBasicDetailsState?.po_no && <p className="text-xs text-[#94A3B8] mt-0.5 font-medium tracking-wide">PO: {poBasicDetailsState.po_no}</p>}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-[11px] font-semibold px-3 py-1 tracking-wide ${poBasicDetailsState?.po_ack_by_vendor === 1 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                            {poBasicDetailsState?.po_ack_by_vendor === 1 ? 'Acknowledged' : 'Not Acknowledged'}
                        </Badge>
                        <Badge variant="outline" className={`text-[11px] font-semibold px-3 py-1 tracking-wide ${statusColor(poBasicDetailsState?.status)}`}>
                            {poBasicDetailsState?.status || 'Unknown'}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
                    <DetailField icon={FileText} label="PO Number" value={poBasicDetailsState?.po_no} />
                    <DetailField icon={CalendarDays} label="PO Date" value={poBasicDetailsState?.po_date} />
                    <DetailField icon={Hash} label="Vendor Code" value={poBasicDetailsState?.vendor_code} />
                    <DetailField icon={UserCircle} label="Vendor Name" value={poBasicDetailsState?.vendor_name} />
                    <DetailField icon={ShoppingCart} label="Purchase Group" value={poBasicDetailsState?.purchase_grp_name} />
                    <DetailField icon={Users} label="Contact Person" value={poBasicDetailsState?.purchase_person} />
                    <DetailField icon={IndianRupee} label="Total Value of PO/SO" value={poBasicDetailsState?.total_value} />
                    <DetailField icon={CreditCard} label="Terms of Payment" value={poBasicDetailsState?.payment_terms_name} />
                </div>
            </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#F97316] flex items-center justify-center shadow-sm">
                        <Paperclip className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-bold text-[#0F172A] tracking-tight">PO Attachment</CardTitle>
                        <p className="text-xs text-[#94A3B8] mt-0.5 font-medium">Upload purchase order document (PDF only) <span className="text-red-500">*</span></p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-5">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 flex-wrap">
                        <label
                            htmlFor={poBasicDetailsState?.po_mail_sent === 1 ? undefined : 'file'}
                            className={`border-2 border-dashed rounded-xl py-3 px-5 flex items-center gap-3 bg-[#FAFBFC] transition-colors ${poBasicDetailsState?.po_mail_sent === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-[#4F6BED] hover:bg-[#F8F9FF]'}`}
                        >
                            <Upload className="w-5 h-5 text-[#4F6BED]" />
                            <div className="text-sm">
                                <span className="font-medium text-[#334155]">{poAttachment ? poAttachment.name : 'Choose File'}</span>
                                {!poAttachment && <span className="text-[#94A3B8] ml-1">— No file chosen</span>}
                            </div>
                            <Input id="file" className="hidden" type="file" ref={uploadPoRef} disabled={poBasicDetailsState?.po_mail_sent === 1} onChange={(e) => { setPoAttachment(e.target.files?.[0] || null); }} />
                        </label>

                        {poAttachment && (
                            <button
                                onClick={() => { setPoAttachment(null); resetFileUpload(); }}
                                className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors"
                            >
                                <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                        )}

                        {poBasicDetailsState?.po_mail_sent !== 1 && (
                            <Button
                                variant={"nextbtn"}
                                size={"nextbtnsize"}
                                className="px-4 rounded-xl flex items-center gap-2 shadow-sm"
                                onClick={() => uploadPoDocument()}
                            >
                                <Upload className="w-4 h-4" />
                                Upload
                            </Button>
                        )}
                    </div>

                    {poBasicDetailsState?.po_attachment?.url && (
                        <div className="flex items-center gap-3 bg-[#F8FAFC] rounded-lg px-4 py-3 border border-slate-100">
                            <FileText className="w-5 h-5 text-[#4F6BED] flex-shrink-0" />
                            <Link
                                target="_blank"
                                href={poBasicDetailsState.po_attachment.url}
                                className="text-sm font-medium text-[#4F6BED] hover:text-[#3B54D4] hover:underline transition-colors truncate"
                            >
                                {poBasicDetailsState.po_attachment.file_name}
                            </Link>
                            {poBasicDetailsState?.po_mail_sent !== 1 && (
                                <button
                                    onClick={() => { deletePoDocument(); }}
                                    className="ml-auto w-7 h-7 rounded-md bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors flex-shrink-0"
                                >
                                    <X className="w-3.5 h-3.5 text-red-500" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>

        {isEarlyDeliveryDialog && (
            <PopUp classname="w-full md:max-w-[60vw] md:max-h-[60vh] h-full overflow-y-scroll" handleClose={handleClose} isSubmit={true} Submitbutton={handlePoItemsSubmit}>
                <h1 className="text-[16px] font-semibold text-[#1E293B] pb-3 pl-1">Purchase Order Items</h1>
                <div className="bg-[#f6f6f7] mb-4 p-4 rounded-2xl">
                    <Table className="max-h-40 overflow-y-scroll overflow-x-scroll">
                        <TableHeader>
                            <TableRow className="bg-[#F8FAFC] text-[13px] hover:bg-[#F8FAFC] border-b border-slate-200 text-nowrap">
                                <TableHead className="text-center text-[#475569] font-semibold">Select</TableHead>
                                <TableHead className="text-center text-[#475569] font-semibold">Product Name</TableHead>
                                <TableHead className="text-center text-[#475569] font-semibold">Material Code</TableHead>
                                <TableHead className="text-center text-[#475569] font-semibold">Material Description</TableHead>
                                <TableHead className="text-center text-[#475569] font-semibold">Plant</TableHead>
                                <TableHead className="text-center text-[#475569] font-semibold">Schedule Date</TableHead>
                                <TableHead className="text-center text-[#475569] font-semibold">Quantity</TableHead>
                                <TableHead className="text-center text-[#475569] font-semibold">Early Delivery Date</TableHead>
                                <TableHead className="text-center text-[#475569] font-semibold">Remarks</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {POItemsTable?.map((item, index) => (
                                <TableRow key={index} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                                    <TableCell className="text-center"><input type="checkbox" name="requested_for_earlydelivery" onChange={(e) => { handleTableChange(index, e.target.name, e.target.checked) }} checked={item?.requested_for_earlydelivery ?? undefined} className="w-4 h-4 rounded border-slate-300 text-[#4F6BED] focus:ring-[#4F6BED]" /></TableCell>
                                    <TableCell className="text-center text-[14px] text-[#334155]">{item?.product_name}</TableCell>
                                    <TableCell className="text-center text-nowrap text-[14px] text-[#334155]">{item?.material_code}</TableCell>
                                    <TableCell className="text-center text-nowrap text-[14px] text-[#334155]">{item?.short_text}</TableCell>
                                    <TableCell className="text-center text-[14px] text-[#334155]">{item?.plant}</TableCell>
                                    <TableCell className="text-center text-[14px] text-[#334155]">{item?.schedule_date}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            <Input type="number" name="quantity" onChange={(e) => { handleTableChange(index, e.target.name, e.target.value) }} value={item?.quantity ?? ""} className="w-16 disabled:opacity-100 rounded-lg border-slate-200" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center"><div className="flex justify-center"><Input type="date" name="early_delivery_date" onChange={(e) => { handleTableChange(index, e.target.name, e.target.value) }} value={item?.early_delivery_date ?? ""} className="w-36 disabled:opacity-100 rounded-lg border-slate-200" /></div></TableCell>
                                    <TableCell><div className="flex justify-center"><Input name="purchase_team_remarks" onChange={(e) => { handleTableChange(index, e.target.name, e.target.value) }} value={item?.purchase_team_remarks ?? ""} className="w-24 disabled:opacity-100 rounded-lg border-slate-200" /></div></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </PopUp>
        )}
    </div>
  )
}

export default BasicPoDetilails
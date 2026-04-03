"use client"
import { Table, TableBody, TableCell, TableHead, TableRow } from '../../atoms/table'
import React, { useEffect, useState } from 'react'
import { TableHeader } from '../../atoms/table'
import { Button } from '../../atoms/button'
import Pagination from '../Pagination'
import { VendorPoDetailsType } from '@/src/types/view-po-details/poDetailsType'
import PopUp from '../PopUp'
import MultiSelect, { MultiValue } from "react-select";
import API_END_POINTS from '@/src/services/apiEndPoints'
import { sendPoConfirmationEmail } from '@/src/services/purchaseOrder/purchaseOrder.services'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Send, Package } from 'lucide-react'


interface Props {
    POTableData: VendorPoDetailsType["data"]["items"]
    poName: string
    po_mail_sent: number
}

const PoItemsTable = ({ POTableData, poName, po_mail_sent }: Props) => {

    const [total_event_list, settotalEventList] = useState(0);
    const [record_per_page, setRecordPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isEmailDialog, setIsEmailDialog] = useState<boolean>(false);
    const [isSuccessDialog, setIsSuccessDialog] = useState(false);
    const [ccEmailsList, setCCEmailsList] = useState<{ value: string, label: string }[]>([]);

    const [email, setEmail] = useState<any>();
    const [toTags, setToTags] = useState<string[]>([]);
    const [toInput, setToInput] = useState("");

    const router = useRouter();

    useEffect(() => {
        if (poName) {
            fetchPurchaseEmailIds();
        }
    }, []);

    const fetchPurchaseEmailIds = async () => {
        const response = await fetch(`${API_END_POINTS?.getPurchaseTeamEmailList}?po_no=${poName}`, {
            method: "get",
            credentials: "include"
        });
        const data = await response?.json();
        const emails = data?.message?.pur_team_emails?.map((item: any, index: any) => {
            const obj = {
                label: item,
                value: item
            }
            return obj;
        })
        const vendorEmail = data?.message?.vendor_email || "";
        if (vendorEmail) {
            setToTags([vendorEmail]);
        }
        setEmail((prev: any) => ({ ...prev, to: vendorEmail }))
        setCCEmailsList(emails);
    }

    const handleClose = () => {
        setIsEmailDialog(false);
        setEmail((prev: any) => ({ ...prev, cc: [] }));
    }

    const handleSubmit = async () => {
        const finalToTags = [...toTags];
        const pendingEmail = toInput.trim();
        if (pendingEmail) {
            finalToTags.push(pendingEmail);
            setToTags(finalToTags);
            setToInput("");
        }

        if (!email?.cc || email?.cc?.length === 0) {
            alert("please select at least 1 cc email");
            return;
        }

        await sendPoConfirmationEmail({
            po_no: poName,
            vendor_emails: finalToTags,
            pur_team_emails: email?.cc,
        }).then(() => {
            alert("Email sent successfully");
            handleClose();
            location.reload();
        })
        .catch((error) => {
            console.error(error);
            alert("Failed to send email");
        })
    }

    const handleToInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.includes(",")) {
            const newEmail = value.replace(",", "").trim();
            if (newEmail) {
                const updatedTags = [...toTags, newEmail];
                setToTags(updatedTags);
                setEmail((prev: any) => ({ ...prev, to: updatedTags.join(",") }));
            }
            setToInput("");
        } else {
            setToInput(value);
        }
    }

    const removeToTag = (index: number) => {
        const updatedTags = toTags.filter((_, i) => i !== index);
        setToTags(updatedTags);
        setEmail((prev: any) => ({ ...prev, to: updatedTags.join(",") }));
    }

    const handleCcEmailChange = (value: MultiValue<{ value: string; label: string; }>) => {
        const emailList = value?.map((item) => (item?.value));
        setEmail((prev: any) => ({ ...prev, cc: emailList }));
    }

    return (
        <div className="space-y-5">
            <Card className="shadow-sm border-slate-200">
                <CardHeader className="pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-sm">
                            <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold text-[#0F172A] tracking-tight">PO Items</CardTitle>
                            <p className="text-xs text-[#94A3B8] mt-0.5 font-medium">{POTableData?.length || 0} item{(POTableData?.length || 0) !== 1 ? 's' : ''} in this order</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-4 px-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-[#F8FAFC] text-[13px] hover:bg-[#F8FAFC] border-b border-slate-200">
                                    <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider">Sr No.</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider">Product Name</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider">Material Code</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider text-nowrap">Description</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider">HSN Code</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider">UOM</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider text-nowrap">Quantity</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider text-nowrap">Rate</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider text-nowrap">Total Amount</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider text-nowrap">Schedule Date</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider text-nowrap">Schedule Qty</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {POTableData && POTableData.length > 0 ? (
                                    POTableData.map((item, index) => (
                                        <TableRow key={index} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                                            <TableCell className="text-center text-sm text-[#64748B] tabular-nums">
                                                {(currentPage - 1) * record_per_page + index + 1}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-sm text-[#475569]">
                                                {item?.product_name || "—"}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-sm font-semibold text-[#0F172A]">
                                                {item?.material_code}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-sm text-[#475569]">
                                                {item?.description || "—"}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-sm text-[#64748B]">
                                                {item?.hsn_code}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-sm text-[#64748B]">
                                                {item?.uom}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-sm font-semibold text-[#0F172A] tabular-nums">
                                                {item?.quantity}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-sm text-[#475569] tabular-nums">
                                                {item?.rate}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-sm font-semibold text-emerald-600 tabular-nums">
                                                {item?.total_amount}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-sm text-[#64748B]">
                                                {item?.schedule_date || "—"}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-sm text-[#64748B] tabular-nums">
                                                {item?.schedule_qty || "—"}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={11} className="text-center py-10">
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
                    {POTableData && POTableData.length > 0 && (
                        <div className="px-4 pb-3 pt-1">
                            <Pagination currentPage={currentPage} record_per_page={record_per_page} setCurrentPage={setCurrentPage} total_event_list={total_event_list} />
                        </div>
                    )}
                </CardContent>
            </Card>

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
                        {!po_mail_sent && (
                            <Button
                                variant={"nextbtn"}
                                size={"nextbtnsize"}
                                className="px-6 rounded-xl flex items-center gap-2 shadow-sm"
                                onClick={() => { setIsEmailDialog(true) }}
                            >
                                <Send className="w-4 h-4" />
                                Send Email
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {isEmailDialog && (
                <PopUp handleClose={handleClose} classname="md:max-h-[400px]" headerText="Send Email" isSubmit={true} Submitbutton={handleSubmit}>
                    <div className="mb-3">
                        <label className="text-xs font-semibold text-[#475569] pb-2 block uppercase tracking-wider">To</label>
                        <div className="flex flex-wrap items-center gap-1.5 border border-slate-200 rounded-lg p-2.5 min-h-[42px] bg-white focus-within:border-[#4F6BED] focus-within:ring-2 focus-within:ring-[#4F6BED]/20 transition-all">
                            {toTags.map((tag, index) => (
                                <span key={index} className="inline-flex items-center gap-1 bg-[#EEF2FF] text-[#4F6BED] text-xs px-2.5 py-1 rounded-md font-semibold">
                                    {tag}
                                    {index !== 0 && (
                                        <button type="button" onClick={() => removeToTag(index)} className="text-[#4F6BED]/60 hover:text-red-500 text-xs ml-0.5 transition-colors">&times;</button>
                                    )}
                                </span>
                            ))}
                            <input
                                type="text"
                                value={toInput}
                                onChange={handleToInputChange}
                                placeholder={toTags.length === 0 ? "Enter email address..." : ""}
                                className="flex-1 min-w-[120px] outline-none text-sm border-none bg-transparent text-[#334155]"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-[#475569] pb-2 block uppercase tracking-wider">CC</label>
                        <MultiSelect
                            onChange={(value) => handleCcEmailChange(value)}
                            instanceId="vendor-type-multiselect"
                            options={ccEmailsList}
                            isMulti
                            required
                            className="text-[14px] text-black"
                        />
                    </div>
                </PopUp>
            )}
        </div>
    )
}

export default PoItemsTable
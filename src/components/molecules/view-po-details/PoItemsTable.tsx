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
import { Send, Package } from 'lucide-react'


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
                <CardHeader className="py-3 px-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F59E0B] to-[#F97316] flex items-center justify-center shadow-sm">
                            <Package className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-sm font-bold text-[#0F172A] tracking-tight">PO Items</CardTitle>
                            <p className="text-[11px] text-[#94A3B8] mt-0.5 font-medium leading-none">{POTableData?.length || 0} item{(POTableData?.length || 0) !== 1 ? 's' : ''} in this order</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-0 px-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-[#F8FAFC] hover:bg-[#F8FAFC] border-b border-slate-200">
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2">Sr.</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 text-nowrap">Product Name</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 text-nowrap">Material Code</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 text-nowrap">Description</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 text-nowrap">HSN Code</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2">UOM</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 text-nowrap">Qty</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 text-nowrap">Rate</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 text-nowrap">Total Amt</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 text-nowrap">Schedule Date</TableHead>
                                    <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 text-nowrap">Schedule Qty</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {POTableData && POTableData.length > 0 ? (
                                    POTableData.map((item, index) => (
                                        <TableRow key={index} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                                            <TableCell className="text-center text-xs text-[#64748B] tabular-nums py-2 px-2">
                                                {(currentPage - 1) * record_per_page + index + 1}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-xs text-[#475569] py-2 px-2">
                                                {item?.product_name || "—"}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-xs font-semibold text-[#0F172A] py-2 px-2">
                                                {item?.material_code}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-xs text-[#475569] py-2 px-2">
                                                {item?.description || "—"}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-xs text-[#64748B] py-2 px-2">
                                                {item?.hsn_code}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-xs text-[#64748B] py-2 px-2">
                                                {item?.uom}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-xs font-semibold text-[#0F172A] tabular-nums py-2 px-2">
                                                {item?.quantity}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-xs text-[#475569] tabular-nums py-2 px-2">
                                                {item?.rate}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-xs font-semibold text-emerald-600 tabular-nums py-2 px-2">
                                                {item?.total_amount}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-xs text-[#64748B] py-2 px-2">
                                                {item?.schedule_date || "—"}
                                            </TableCell>
                                            <TableCell className="text-center text-nowrap text-xs text-[#64748B] tabular-nums py-2 px-2">
                                                {item?.schedule_qty || "—"}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={11} className="text-center py-8">
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
                    {POTableData && POTableData.length > 0 && (
                        <div className="px-4 pb-2 pt-1">
                            <Pagination currentPage={currentPage} record_per_page={record_per_page} setCurrentPage={setCurrentPage} total_event_list={total_event_list} />
                        </div>
                    )}
                </CardContent>
            </Card>

            {!po_mail_sent && (
                <Card className="shadow-sm border-slate-200">
                    <CardContent className="py-4">
                        <div className="flex items-center justify-end gap-3 flex-wrap">
                            <Button
                                variant={"nextbtn"}
                                size={"nextbtnsize"}
                                className="px-6 rounded-xl flex items-center gap-2 shadow-sm transition-colors"
                                onClick={() => { setIsEmailDialog(true) }}
                            >
                                <Send className="w-4 h-4" />
                                Send Email
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {isEmailDialog && (
                <PopUp handleClose={handleClose} classname="md:max-w-[500px] md:max-h-[400px]" headerText="Send Email" isSubmit={true} Submitbutton={handleSubmit}>
                    <div className="mt-4 space-y-4">
                        <div>
                            <label className="text-sm font-semibold text-[#1E293B] pb-2 block">To</label>
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
                            <label className="text-sm font-semibold text-[#1E293B] pb-2 block">CC</label>
                            <MultiSelect
                                onChange={(value) => handleCcEmailChange(value)}
                                instanceId="vendor-type-multiselect"
                                options={ccEmailsList}
                                isMulti
                                required
                                className="text-sm"
                                styles={{
                                    control: (base) => ({ ...base, minHeight: "40px", fontSize: "0.875rem", borderRadius: "0.5rem", borderColor: "#e2e8f0" }),
                                    multiValue: (base) => ({ ...base, fontSize: "0.8125rem" }),
                                }}
                            />
                        </div>
                    </div>
                </PopUp>
            )}
        </div>
    )
}

export default PoItemsTable
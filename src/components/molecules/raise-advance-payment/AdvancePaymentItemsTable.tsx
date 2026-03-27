"use client"
import { Table, TableBody, TableCell, TableHead, TableRow } from '../../atoms/table'
import React, { useState } from 'react'
import { TableHeader } from '../../atoms/table'
import { Button } from '../../atoms/button'
import Pagination from '../Pagination'
import { PoDetailsType } from '@/src/types/view-po-details/poDetailsType'
import { useRouter } from 'next/navigation'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'
import PopUp from '../PopUp'

interface Props {
    POTableData: PoDetailsType["message"]["items"]
    poName: string
}

const AdvancePaymentItemsTable = ({ POTableData, poName }: Props) => {

    const [total_event_list, settotalEventList] = useState(0);
    const [record_per_page] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [status, setStatus] = useState<"approve" | "reject" | "">("");
    const [comments, setComments] = useState("");
    const [isDialog, setIsDialog] = useState(false);

    const router = useRouter();

    const handleApproval = async () => {
        const url = {
            approve: `${process.env.NEXT_PUBLIC_BACKEND_END}/api/method/vms.APIs.vendors_dashboards_api.po_approve_reject.po_approve`,
            reject: `${process.env.NEXT_PUBLIC_BACKEND_END}/api/method/vms.APIs.vendors_dashboards_api.po_approve_reject.po_reject`,
        };
        if (!status) return;
        const response: AxiosResponse = await requestWrapper({
            url: url[status],
            data: {
                data: {
                    po_name: poName,
                    comment: comments,
                }
            },
            method: "POST"
        });
        if (response?.status == 200) {
            alert(status === "approve" ? "Approved successfully" : "Rejected successfully");
            location.reload();
        }
    };

    const handleClose = () => {
        setIsDialog(false);
        setComments("");
        setStatus("");
    };

    return (
        <>
            <div className='bg-white mt-4 border rounded-xl p-4'>
                <h1 className='pb-5 font-semibold'> PO Items</h1>
                <Table>
                    <TableHeader className="text-center">
                        <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
                            <TableHead className="text-center text-black">Sr No.</TableHead>
                            <TableHead className="text-center text-black">Material Code</TableHead>
                            <TableHead className="text-center text-black text-nowrap">Material Description</TableHead>
                            <TableHead className="text-center text-black">HSN Code</TableHead>
                            <TableHead className="text-center text-black">UOM</TableHead>
                            <TableHead className="text-center text-black text-nowrap">Quantity</TableHead>
                            <TableHead className="text-center text-black text-nowrap">Rate</TableHead>
                            <TableHead className="text-center text-black text-nowrap">Schedule Date</TableHead>
                            <TableHead className="text-center text-black text-nowrap">Schedule Quantity</TableHead>
                            <TableHead className="text-center text-black text-nowrap">Total Amount</TableHead>
                            <TableHead className="text-center text-black text-nowrap">Raise Amount</TableHead>
                            <TableHead className="text-center text-black text-nowrap">Total Advance Approved</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-center text-black">
                        {POTableData ? (
                            POTableData?.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="text-center">{(currentPage - 1) * record_per_page + index + 1}</TableCell>
                                    <TableCell className="text-center text-nowrap">{item?.material_code}</TableCell>
                                    <TableCell className="text-center text-nowrap">{item?.short_text ? item.short_text : "-"}</TableCell>
                                    <TableCell className="text-center text-nowrap">{item?.hsnsac}</TableCell>
                                    <TableCell className="text-center text-nowrap">{item?.uom}</TableCell>
                                    <TableCell className="text-center text-nowrap">{item?.quantity}</TableCell>
                                    <TableCell className="text-center text-nowrap">{item?.rate}</TableCell>
                                    <TableCell className="text-center text-nowrap">{item?.schedule_date}</TableCell>
                                    <TableCell className="text-center text-nowrap">{item?.schedule_date_qty_json}</TableCell>
                                    <TableCell className="text-center text-nowrap">{item?.total_amount}</TableCell>
                                    <TableCell className="text-center text-nowrap">{item?.raise_amount}</TableCell>
                                    <TableCell className="text-center text-nowrap">{item?.total_advance_approved}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={12} className="text-center text-gray-500 py-4">
                                    No results found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <Pagination currentPage={currentPage} record_per_page={record_per_page} setCurrentPage={setCurrentPage} total_event_list={total_event_list} />
            <div className='flex justify-between mt-4'>
                <Button variant={"nextbtn"} size={"nextbtnsize"} className="px-4 mt-4 mx-2 rounded-xl" onClick={() => { router.back() }}>Back</Button>
                <div className="flex gap-2">
                    <Button
                        variant={"nextbtn"}
                        size={"nextbtnsize"}
                        className="px-4 mt-4 rounded-xl hover:bg-white hover:text-black border border-transparent hover:border-[#5291CD]"
                        onClick={() => { setStatus("approve"); setIsDialog(true); }}
                    >
                        Approve
                    </Button>
                    <Button
                        variant={"backbtn"}
                        size={"backbtnsize"}
                        className="px-4 mt-4 rounded-xl hover:bg-[#5291CD] hover:text-white hover:border-[#5291CD]"
                        onClick={() => { setStatus("reject"); setIsDialog(true); }}
                    >
                        Reject
                    </Button>
                </div>
            </div>

            {isDialog &&
                <PopUp
                    handleClose={handleClose}
                    headerText={status === "approve" ? "Approve" : "Reject"}
                    isSubmit={true}
                    Submitbutton={handleApproval}
                    classname="md:max-w-[500px] md:max-h-[350px]"
                >
                    <div className="mt-4">
                        <h1 className="text-[14px] font-medium pb-2">Comments</h1>
                        <textarea
                            onChange={(e) => setComments(e.target.value)}
                            value={comments}
                            className="w-full border-2 rounded-lg p-3 text-[14px]"
                            rows={4}
                            placeholder="Enter your comments..."
                        />
                    </div>
                </PopUp>
            }
        </>
    )
}

export default AdvancePaymentItemsTable
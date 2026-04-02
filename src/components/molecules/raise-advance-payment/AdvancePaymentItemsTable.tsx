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
        utr_number: "",
        payment_date: "",
        payment_amount: ""
    });

    const router = useRouter();

    const handleApproval = async () => {
        if (!status) return;
        if(paymentDetails?.is_treasury_visible === 1){
        if(!tresuaryDetails.utr_number || !tresuaryDetails.payment_date || !tresuaryDetails.payment_amount){
            alert("Please fill all treasury details to approve the payment request.");
            return;
        }
        }
        try {
            const res = await processApprovalAction({
                doctype: "Payment Requisition",
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
        <>
            <div className='bg-white mt-4 border rounded-xl p-4'>
                <h1 className='pb-5 font-semibold'>Payment Request Items</h1>
                <Table>
                    <TableHeader className="text-center">
                        <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
                            <TableHead className="text-center text-black">Sr No.</TableHead>
                            <TableHead className="text-center text-black">Item Code</TableHead>
                            <TableHead className="text-center text-black">Payment Type</TableHead>
                            <TableHead className="text-center text-black text-nowrap">Payment %</TableHead>
                            <TableHead className="text-center text-black text-nowrap">Total Amount</TableHead>
                            <TableHead className="text-center text-black text-nowrap">Raised Amount</TableHead>
                            <TableHead className="text-center text-black text-nowrap">Balance Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-center text-black">
                        {items.length > 0 ? (
                            items.map((item, index) => (
                                <TableRow key={item.name}>
                                    <TableCell className="text-center">{(currentPage - 1) * record_per_page + index + 1}</TableCell>
                                    <TableCell className="text-center text-nowrap">{item?.item_code}</TableCell>
                                    <TableCell className="text-center text-nowrap">{item?.payment_type}</TableCell>
                                    <TableCell className="text-center text-nowrap">{item?.payment_percentage}%</TableCell>
                                    <TableCell className="text-center text-nowrap">{item?.total_amount}</TableCell>
                                    <TableCell className="text-center text-nowrap">{item?.raised_amount}</TableCell>
                                    <TableCell className="text-center text-nowrap">{item?.balance_amount}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-gray-500 py-4">
                                    No results found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <Pagination currentPage={currentPage} record_per_page={record_per_page} setCurrentPage={setCurrentPage} total_event_list={total_event_list} />
                        {
                            paymentDetails?.is_treasury_visible && 
                            <div className="py-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-1 flex flex-col gap-2">
                        <h2 className="text-[13px] font-medium text-[#64748B]">UTR Number <span className="text-red-500">*</span></h2>
                        <div className="relative">
                            <Input
                                name="UTR Number"
                                placeholder="UTR Number"
                                className="rounded-xl h-10 bg-white border-gray-200 pr-9"
                                value={tresuaryDetails?.utr_number || ''}
                                maxLength={20}
                                onChange={(e)=>{
                                    setTreasuryDetails((prev)=>({
                                        ...prev,
                                        utr_number: e.target.value
                                    }))
                                }}
                                // disabled={formData?.is_submitted === 1}
                            />
                        </div>
                    </div>
                    <div className="col-span-1 flex flex-col gap-2">
                        <h2 className="text-[13px] font-medium text-[#64748B]">Payment Date <span className="text-red-500">*</span></h2>
                        <div className="relative">
                            <Input
                                name="Payment Date"
                                placeholder="Payment Date"
                                className="rounded-xl h-10 bg-white border-gray-200 pr-9"
                                value={tresuaryDetails?.payment_date || ''}
                                onChange={(e=>{
                                    setTreasuryDetails((prev)=>({
                                        ...prev,
                                        payment_date: e.target.value
                                    }))
                                })}
                                type="date"
                                // disabled={formData?.is_submitted === 1}
                            />
                        </div>
                    </div>
                    <div className="col-span-1 flex flex-col gap-2">
                        <h2 className="text-[13px] font-medium text-[#64748B]">Payment Amount <span className="text-red-500">*</span></h2>
                        <div className="relative">
                            <Input
                                name="Payment Amount"
                                placeholder="Payment Amount"
                                className="rounded-xl h-10 bg-white border-gray-200 pr-9"
                                value={tresuaryDetails?.payment_amount || ''}
                                type='number'
                                maxLength={10}
                                onChange={(e)=>{
                                    setTreasuryDetails((prev)=>({
                                        ...prev,
                                        payment_amount: e.target.value
                                    }))
                                }}
                                // disabled={formData?.is_submitted === 1}
                            />
                        </div>
                    </div>
                </div>
            }

            <div className='flex justify-between mt-4'>
                <Button variant={"nextbtn"} size={"nextbtnsize"} className="px-4 mt-4 mx-2 rounded-xl" onClick={() => { router.back() }}>Back</Button>
                {paymentDetails?.can_approve && (
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
                )}
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
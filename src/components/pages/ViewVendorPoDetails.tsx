"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../atoms/table'
import { Button } from '../atoms/button'
import Pagination from '../molecules/Pagination'
import { PoDetailsType } from '@/src/types/view-po-details/poDetailsType'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'
import { useRouter } from 'next/navigation'
import PopUp from '../molecules/PopUp'
import { Input } from '../atoms/input'

interface Props {
    poname: string
}

const ViewVendorPoDetails = ({ poname }: Props) => {
    const router = useRouter();
    const [poDetails, setPoDetails] = useState<PoDetailsType["message"] | null>(null);
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

    const [total_event_list, settotalEventList] = useState(0);
    const [record_per_page] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        if (poname) {
            fetchPoDetails();
        }
    }, [poname]);

    const fetchPoDetails = async () => {
        const url = `${API_END_POINTS?.POItemsTable}?po_name=${poname}`;
        const response: AxiosResponse = await requestWrapper({ url: url, method: "POST" });
        if (response?.status == 200) {
            setPoDetails(response?.data?.message);
            settotalEventList(response?.data?.message?.items?.length || 0);
        }
    };

    const handleAcknowledge = async () => {
        const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_END}/api/method/vms.APIs.vendors_dashboards_api.po_approve_reject.po_approve`;
        const response: AxiosResponse = await requestWrapper({
            url: apiUrl,
            data: { data: { po_name: poname, comment: comment } },
            method: "POST"
        });
        if (response?.status == 200) {
            alert("Acknowledged successfully");
            location.reload();
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
        if (advanceFileRef.current) advanceFileRef.current.value = "";
    };

    const handleAdvanceSubmit = async () => {
        if (!advanceClosureDate) {
            alert("Please select Advance Closure Date");
            return;
        }
        const url = `${process.env.NEXT_PUBLIC_BACKEND_END}/api/method/vms.APIs.vendors_dashboards_api.po_approve_reject.raise_advance_request`;
        const formdata = new FormData();
        formdata.append("data", JSON.stringify({
            po_name: poname,
            advance_closure_date: advanceClosureDate,
            remarks: advanceRemarks,
        }));
        if (advanceFile) {
            formdata.append("proforma_invoice", advanceFile);
        }
        const response: AxiosResponse = await requestWrapper({
            url: url,
            data: formdata,
            method: "POST"
        });
        if (response?.status == 200) {
            alert("Advance request raised successfully");
            handleAdvanceClose();
            location.reload();
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
    const totalAmount = selectedItemsList.reduce((sum, item) => sum + (item.quantity * item.rate), 0);

    return (
        <>
            {/* Basic PO Details */}
            <div className='bg-white shadow-md border grid grid-cols-4 gap-3 p-4 rounded-xl mt-3 mx-2'>
                <div className='flex gap-2'>
                    <h1 className='font-semibold'>PO Number: </h1>
                    <p>{poDetails?.po_name}</p>
                </div>
                <div className='flex gap-2'>
                    <h1 className='font-semibold'>PO Date: </h1>
                    <p>{poDetails?.po_date}</p>
                </div>
                <div className='flex gap-2'>
                    <h1 className='font-semibold'>Vendor Code: </h1>
                    <p>{poDetails?.vendor_code}</p>
                </div>
                <div className='flex gap-2'>
                    <h1 className='font-semibold'>Vendor Name: </h1>
                    <p>{poDetails?.supplier_name}</p>
                </div>
                <div className='flex gap-2'>
                    <h1 className='font-semibold'>Purchase Group: </h1>
                    <p>{poDetails?.purchase_group_name}</p>
                </div>
                <div className='flex gap-2'>
                    <h1 className='font-semibold'>Purchase Contact Person: </h1>
                    <p>{poDetails?.contact_person}</p>
                </div>
                <div className="flex gap-2">
                    <h1 className='font-semibold'>Status: </h1>
                    <p>{poDetails?.po_status}</p>
                </div>
            </div>

            {/* PO Items Table */}
            <div className='bg-white mt-4 border rounded-xl p-4 mx-2'>
                <h1 className='pb-5 font-semibold'>PO Items</h1>
                <Table>
                    <TableHeader>
                        <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE]">
                            <TableHead className="text-center text-black">
                                <input type="checkbox" checked={poDetails?.items ? selectedItems.size === poDetails.items.length : false} onChange={handleSelectAll} />
                            </TableHead>
                            <TableHead className="text-left text-black">Sr No.</TableHead>
                            <TableHead className="text-left text-black">Material Code</TableHead>
                            <TableHead className="text-left text-black text-nowrap">Material Description</TableHead>
                            <TableHead className="text-left text-black">HSN Code</TableHead>
                            <TableHead className="text-left text-black">UOM</TableHead>
                            <TableHead className="text-left text-black text-nowrap">Quantity</TableHead>
                            <TableHead className="text-left text-black text-nowrap">Rate</TableHead>
                            <TableHead className="text-left text-black text-nowrap">Schedule Date</TableHead>
                            <TableHead className="text-left text-black text-nowrap">Schedule Quantity</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-left text-black">
                        {poDetails?.items ? (
                            poDetails.items.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="text-center">
                                        <input type="checkbox" checked={selectedItems.has(index)} onChange={() => handleSelectItem(index)} />
                                    </TableCell>
                                    <TableCell className="text-left">{(currentPage - 1) * record_per_page + index + 1}</TableCell>
                                    <TableCell className="text-left text-nowrap">{item?.material_code}</TableCell>
                                    <TableCell className="text-left text-nowrap">{item?.short_text ? item.short_text : "-"}</TableCell>
                                    <TableCell className="text-left text-nowrap">{item?.hsnsac}</TableCell>
                                    <TableCell className="text-left text-nowrap">{item?.uom}</TableCell>
                                    <TableCell className="text-left text-nowrap">{item?.quantity}</TableCell>
                                    <TableCell className="text-left text-nowrap">{item?.rate}</TableCell>
                                    <TableCell className="text-left text-nowrap">{item?.schedule_date}</TableCell>
                                    <TableCell className="text-left text-nowrap">{item?.schedule_date_qty_json}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={10} className="text-center text-gray-500 py-4">
                                    No results found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Pagination currentPage={currentPage} record_per_page={record_per_page} setCurrentPage={setCurrentPage} total_event_list={total_event_list} />

            {/* Action Buttons */}
            <div className='flex justify-between mt-4 mx-2'>
                <Button variant={"backbtn"} size={"backbtnsize"} className="px-4 rounded-xl" onClick={() => { router.back() }}>Back</Button>
                <div className="flex gap-4">
                    <Button
                        variant={"nextbtn"}
                        size={"nextbtnsize"}
                        className="py-2 hover:bg-white hover:text-black border border-transparent hover:border-[#5291CD] rounded-[14px]"
                        onClick={() => setIsDialog(true)}
                    >
                        Acknowledge
                    </Button>
                    <Button
                        variant={"nextbtn"}
                        size={"nextbtnsize"}
                        className="py-2 hover:bg-white hover:text-black border border-transparent hover:border-[#5291CD] rounded-[14px]"
                        onClick={() => { if (selectedItems.size === 0) { alert("Please select at least 1 line item"); return; } setAdvanceCurrentPage(1); setIsAdvanceDialog(true); }}
                    >
                        Raise Advance Request
                    </Button>
                </div>
            </div>

            {isDialog &&
                <PopUp handleClose={handleClose} headerText="Acknowledge PO" isSubmit={true} Submitbutton={handleAcknowledge} classname="md:max-w-[600px] md:max-h-[400px]">
                    <div className="mt-4">
                        <h1 className="text-[14px] font-normal text-[#626973] pb-2">Comment</h1>
                        <textarea
                            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5291CD]"
                            placeholder="Enter your comment..."
                            rows={6}
                            onChange={(e) => setComment(e.target.value)}
                            value={comment}
                        />
                    </div>
                </PopUp>
            }

            {isAdvanceDialog &&
                <PopUp handleClose={handleAdvanceClose} headerText="Raise Advance Request" isSubmit={true} Submitbutton={handleAdvanceSubmit} classname="md:max-w-[80vw] md:max-h-[80vh] overflow-y-auto">
                    {/* PO Info Header */}
                    <div className="grid grid-cols-4 gap-4 mt-4 text-sm">
                        <div className="flex gap-2">
                            <h1 className="font-semibold">PO Number:</h1>
                            <p>{poDetails?.po_name}</p>
                        </div>
                        <div className="flex gap-2">
                            <h1 className="font-semibold">PO Date:</h1>
                            <p>{poDetails?.po_date}</p>
                        </div>
                        <div className="flex gap-2">
                            <h1 className="font-semibold">Total PO Amount:</h1>
                            <p>{poDetails?.total_gross_amount}</p>
                        </div>
                        <div className="flex gap-2">
                            <h1 className="font-semibold">Terms of Payment:</h1>
                            <p>{poDetails?.terms_of_payment}</p>
                        </div>
                    </div>

                    {/* Items Table */}
                    <h1 className="font-semibold mt-4 mb-2 text-sm">Items</h1>
                    <div className="max-h-[300px] overflow-y-auto border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[13px] hover:bg-[#DDE8FE]">
                                    <TableHead className="text-left text-black">Sr.no</TableHead>
                                    <TableHead className="text-left text-black">Material Code</TableHead>
                                    <TableHead className="text-left text-black">Material Description</TableHead>
                                    <TableHead className="text-left text-black">HSN Code</TableHead>
                                    <TableHead className="text-left text-black">UOM</TableHead>
                                    <TableHead className="text-left text-black">Quantity</TableHead>
                                    <TableHead className="text-left text-black">Rate</TableHead>
                                    <TableHead className="text-left text-black text-nowrap">Sche. Date</TableHead>
                                    <TableHead className="text-left text-black text-nowrap">Sche. Qty</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="text-left text-black text-sm">
                                {selectedItemsList.length > 0 ? (
                                    selectedItemsList
                                        .slice((advanceCurrentPage - 1) * advanceRecordPerPage, advanceCurrentPage * advanceRecordPerPage)
                                        .map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="text-left">{(advanceCurrentPage - 1) * advanceRecordPerPage + index + 1}</TableCell>
                                            <TableCell className="text-left text-nowrap">{item?.material_code}</TableCell>
                                            <TableCell className="text-left text-nowrap">{item?.short_text || "-"}</TableCell>
                                            <TableCell className="text-left text-nowrap">{item?.hsnsac}</TableCell>
                                            <TableCell className="text-left text-nowrap">{item?.uom}</TableCell>
                                            <TableCell className="text-left text-nowrap">{item?.quantity}</TableCell>
                                            <TableCell className="text-left text-nowrap">{item?.rate}</TableCell>
                                            <TableCell className="text-left text-nowrap">{item?.schedule_date}</TableCell>
                                            <TableCell className="text-left text-nowrap">{item?.schedule_date_qty_json}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center text-gray-500 py-4">
                                            No items selected
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <Pagination currentPage={advanceCurrentPage} record_per_page={advanceRecordPerPage} setCurrentPage={setAdvanceCurrentPage} total_event_list={selectedItemsList.length} />

                    <div className="flex justify-end mt-2 text-sm font-semibold">
                        Total Amount : &#8377; {totalAmount}
                    </div>

                    {/* Bottom Fields */}
                    <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                        <div className="flex flex-col">
                            <h1 className="text-[13px] font-normal text-[#626973] pb-1">Advance Closure Date (Delivery Date)</h1>
                            <Input type="date" value={advanceClosureDate} onChange={(e) => setAdvanceClosureDate(e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-[13px] font-normal text-[#626973] pb-1">Upload PI (Proforma Invoice)</h1>
                            <Input type="file" ref={advanceFileRef} onChange={(e) => setAdvanceFile(e.target.files?.[0] || null)} />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-[13px] font-normal text-[#626973] pb-1">Remarks</h1>
                            <Input placeholder="Type here..." value={advanceRemarks} onChange={(e) => setAdvanceRemarks(e.target.value)} />
                        </div>
                    </div>
                </PopUp>
            }
        </>
    )
}

export default ViewVendorPoDetails
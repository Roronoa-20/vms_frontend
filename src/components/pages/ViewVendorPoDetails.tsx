"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../atoms/table'
import { Button } from '../atoms/button'
import Pagination from '../molecules/Pagination'
import { VendorPoDetailsType } from '@/src/types/view-po-details/poDetailsType'
import { useRouter } from 'next/navigation'
import PopUp from '../molecules/PopUp'
import { Input } from '../atoms/input'
import { acknowledgePo, fetchPoDetails as fetchPoDetailsApi, raiseAdvanceRequest } from '@/src/services/purchaseOrder/purchaseOrder.services'

interface Props {
    poname: string
}

const ViewVendorPoDetails = ({ poname }: Props) => {
    const router = useRouter();
    const [poDetails, setPoDetails] = useState<VendorPoDetailsType["data"] | null>(null);
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

    const [total_event_list, settotalEventList] = useState(0);
    const [record_per_page] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        if (poname) {
            fetchPoDetails();
        }
    }, [poname]);

    const fetchPoDetails = async () => {
        try {
            const res = await fetchPoDetailsApi(poname);
            setPoDetails(res?.data);
            settotalEventList(res?.data?.items?.length || 0);
        } catch (err) {
            console.error("Error fetching PO details:", err);
        }
    };

    const handleAcknowledge = async () => {
        try {
            const res = await acknowledgePo(poname, comment);
            alert(res?.message || "Acknowledged successfully");
            fetchPoDetails();
        } catch (err: any) {
            alert(err?.message || "Failed to acknowledge PO");
        } finally {
            handleClose();
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
            const items = selectedItemsList.map((item, idx) => ({
                material_code: item.material_code,
                name: item.name,
                total_amount: item.total_amount,
                raise_advance: raiseAdvanceValues[idx] ?? item.raise_advance ?? item.total_amount,
            }));
            const res = await raiseAdvanceRequest({
                po_no: poname,
                delivery_date: advanceClosureDate,
                remarks: advanceRemarks,
                payment_request_items: items,
            }, advanceFile || undefined);
            alert(res?.message || "Advance request raised successfully");
            handleAdvanceClose();
            fetchPoDetails();
        } catch (err: any) {
            alert(err?.message || "Failed to raise advance request");
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

    return (
        <>
            {/* Basic PO Details */}
            <div className='bg-white shadow-md border grid grid-cols-4 gap-3 p-4 rounded-xl mt-3 mx-2'>
                <div className='flex gap-2'>
                    <h1 className='font-semibold'>PO Number: </h1>
                    <p>{poDetails?.po_no}</p>
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
                    <p>{poDetails?.vendor_name}</p>
                </div>
                <div className='flex gap-2'>
                    <h1 className='font-semibold'>Purchase Group: </h1>
                    <p>{poDetails?.purchase_grp_name}</p>
                </div>
                <div className='flex gap-2'>
                    <h1 className='font-semibold'>Purchase Contact Person: </h1>
                    <p>{poDetails?.purchase_person}</p>
                </div>
                <div className="flex gap-2">
                    <h1 className='font-semibold'>Status: </h1>
                    <p>{poDetails?.status}</p>
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
                            <TableHead className="text-left text-black text-nowrap">Total PO Amount</TableHead>
                            <TableHead className="text-left text-black text-nowrap">Total Advance Approved</TableHead>
                            <TableHead className="text-left text-black text-nowrap">Raise Advance</TableHead>
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
                                    <TableCell className="text-left text-nowrap">{item?.description ? item.description : "-"}</TableCell>
                                    <TableCell className="text-left text-nowrap">{item?.hsn_code}</TableCell>
                                    <TableCell className="text-left text-nowrap">{item?.uom}</TableCell>
                                    <TableCell className="text-left text-nowrap">{item?.quantity}</TableCell>
                                    <TableCell className="text-left text-nowrap">{item?.rate}</TableCell>
                                    <TableCell className="text-left text-nowrap">{item?.schedule_date}</TableCell>
                                    <TableCell className="text-left text-nowrap">{item?.schedule_qty}</TableCell>
                                    <TableCell className="text-left text-nowrap">{item?.total_amount}</TableCell>
                                    <TableCell className="text-left text-nowrap">{item?.total_claimed_amt}</TableCell>
                                    <TableCell className="text-left text-nowrap">{item?.raise_advance}</TableCell>
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
                    {poDetails?.po_ack_by_vendor !== 1 && <Button
                        variant={"nextbtn"}
                        size={"nextbtnsize"}
                        className="py-2 hover:bg-white hover:text-black border border-transparent hover:border-[#5291CD] rounded-[14px]"
                        onClick={() => setIsDialog(true)}
                    >
                        Acknowledge
                    </Button>}
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
                            <p>{poDetails?.po_no}</p>
                        </div>
                        <div className="flex gap-2">
                            <h1 className="font-semibold">PO Date:</h1>
                            <p>{poDetails?.po_date}</p>
                        </div>
                        <div className="flex gap-2">
                            <h1 className="font-semibold">Total PO Amount:</h1>
                            <p>{poDetails?.total_value}</p>
                        </div>
                        <div className="flex gap-2">
                            <h1 className="font-semibold">Terms of Payment:</h1>
                            <p>{poDetails?.payment_terms_name}</p>
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
                                    <TableHead className="text-left text-black text-nowrap">Total PO Amount</TableHead>
                            <TableHead className="text-left text-black text-nowrap">Total Advance Approved</TableHead>
                            <TableHead className="text-left text-black text-nowrap">Raise Advance</TableHead>
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
                                            <TableCell className="text-left text-nowrap">{item?.description || "-"}</TableCell>
                                            <TableCell className="text-left text-nowrap">{item?.hsn_code}</TableCell>
                                            <TableCell className="text-left text-nowrap">{item?.uom}</TableCell>
                                            <TableCell className="text-left text-nowrap">{item?.quantity}</TableCell>
                                            <TableCell className="text-left text-nowrap">{item?.rate}</TableCell>
                                            <TableCell className="text-left text-nowrap">{item?.schedule_date}</TableCell>
                                            <TableCell className="text-left text-nowrap">{item?.schedule_qty}</TableCell>
                                            <TableCell className="text-left text-nowrap">{item?.total_amount}</TableCell>
                                    <TableCell className="text-left text-nowrap">{item?.total_claimed_amt}</TableCell>
                                    <TableCell className="text-left text-nowrap">
                                                <Input
                                                    type="number"
                                                    className="w-24"
                                                    value={raiseAdvanceValues[selectedItemsList.indexOf(item)] ?? item?.raise_advance ?? ""}
                                                    onChange={(e) => {
                                                        const idx = selectedItemsList.indexOf(item);
                                                        handleRaiseAdvanceChange(idx, Number(e.target.value), item.advance_balance);
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={12} className="text-center text-gray-500 py-4">
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
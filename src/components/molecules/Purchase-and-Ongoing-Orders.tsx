"use client"
import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/atoms/table";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/atoms/select";
import { Input } from "../atoms/input";
// import { useEffect } from 'react';
import { DashboardPOTableItem } from '@/src/types/types';
import { Button } from '@/components/ui/button';
type Props = {
    dashboardPOTableData: DashboardPOTableItem[]
}
const PurchaseAndOngoingOrders = ({ dashboardPOTableData }: Props) => {
    console.log(dashboardPOTableData, "dashboardPOTableData-------------------------")

    const downloadPoDetails = async (name: string) => {
        try {
            const Data = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_END}/api/method/vms.purchase.doctype.purchase_order.purchase_order.get_po_printfomat`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        "po_name": name
                    })
                }
            );
            if (Data.ok) {
                const data = await Data.blob();
                const url = URL.createObjectURL(data);
                const link = document.createElement('a');
                link.href = url;
                link.target = '_blank';
                link.click();
                setTimeout(() => URL.revokeObjectURL(url), 500);
            }
        } catch (error) {
            console.log(error, "something went wrong");
        }
    };
    return (
        <div className="shadow- bg-[#f6f6f7] p-4 rounded-2xl">
            <div className="flex w-full justify-between pb-4">
                <h1 className="text-[20px] text-[#03111F] font-semibold">
                    Purchase and Ongoing Orders
                </h1>
                <div className="flex gap-4">
                    <Input placeholder="Search..." />
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Company" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup className="w-full">
                                <SelectItem value="apple">Apple</SelectItem>
                                <SelectItem value="banana">Banana</SelectItem>
                                <SelectItem value="blueberry">Blueberry</SelectItem>
                                <SelectItem value="grapes">Grapes</SelectItem>
                                <SelectItem value="pineapple">Pineapple</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="apple">Apple</SelectItem>
                                <SelectItem value="banana">Banana</SelectItem>
                                <SelectItem value="blueberry">Blueberry</SelectItem>
                                <SelectItem value="grapes">Grapes</SelectItem>
                                <SelectItem value="pineapple">Pineapple</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <Table>
                {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                <TableHeader className="text-center">
                    <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
                        <TableHead className="w-[100px]">Sr No.</TableHead>
                        <TableHead>PO No</TableHead>
                        <TableHead>Vendor Name</TableHead>
                        <TableHead className="text-center">PO Date</TableHead>
                        <TableHead className="text-center">Delivery Date</TableHead>
                        <TableHead className="text-center">PO Amount</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-center">Early Delivery</TableHead>
                        <TableHead className="text-center">View details</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="text-center">
                    {dashboardPOTableData && dashboardPOTableData?.length > 0 ? (
                        dashboardPOTableData.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{item?.idx}</TableCell>
                                <TableCell>{item?.po_no}</TableCell>
                                <TableCell>{item?.supplier_name ? item.supplier_name : "-"}</TableCell>
                                <TableCell>{item?.po_date}</TableCell>
                                <TableCell>{item?.delivery_date}</TableCell>
                                <TableCell>{item?.total_gross_amount}</TableCell>
                                <TableCell>
                                    <div
                                        className={`px-2 py-3 rounded-xl ${item?.status === "Pending"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : item?.status === "approved"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {item?.vendor_status}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">{item?.name}</TableCell>
                                <TableCell ><Button variant={'outline'} onClick={() => downloadPoDetails(item?.name)}>view</Button></TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center text-gray-500 py-4">
                                No results found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>

            </Table>
        </div>
    )
}

export default PurchaseAndOngoingOrders

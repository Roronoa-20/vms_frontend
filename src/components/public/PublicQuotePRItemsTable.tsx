"use client";

import React, { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/atoms/table";
import { Button } from '@/components/ui/button';
import { DeleteIcon } from "lucide-react"; // Optional: Replace with your icon if using Lucide

interface Props {
    prItems: Record<string, string>[];
    setPrItems: React.Dispatch<React.SetStateAction<Record<string, string>[]>>;
}

const PublicQuotePRItemsTable = ({ prItems, setPrItems }: Props) => {
const handleDeleteRow = (indexToRemove: number) => {
        const updatedItems = prItems.filter((_, index) => index !== indexToRemove);
        setPrItems(updatedItems);
    };
console.log(prItems,'prItems')
    return (
        <div>
            <h1 className='text-lg py-2 font-semibold'>Added Items</h1>
            <div className="overflow-auto">
                <Table>
                    <TableHeader className="text-center">
                        <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
                            <TableHead>Sr No.</TableHead>
                            <TableHead>Item Code</TableHead>
                            <TableHead className="min-w-[200px]">Item Description</TableHead>
                            <TableHead>Rate</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>UOM</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Remarks</TableHead>
                            <TableHead className="text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white text-black">
                        {prItems.length > 0 ? (
                            prItems.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell className="text-nowrap">{item?.material_code_head}</TableCell>
                                    <TableCell className="text-nowrap">{item?.material_name_head}</TableCell>
                                    <TableCell className="text-nowrap">{item?.rate_head}</TableCell>
                                    <TableCell className="text-nowrap">{item?.quantity_head}</TableCell>
                                    <TableCell className="text-nowrap">{item?.uom_head}</TableCell>
                                    <TableCell className="text-nowrap">{item?.price_head}</TableCell>
                                    <TableCell className="text-nowrap">{item?.remarks}</TableCell>
                                    <TableCell className="text-center">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteRow(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <DeleteIcon size={20} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center text-gray-500 py-4">
                                    No results found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default PublicQuotePRItemsTable;

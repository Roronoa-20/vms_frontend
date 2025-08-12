import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/atoms/table";
import { RFQDetails } from '@/src/types/RFQtype';
interface Props {
    RFQData: RFQDetails;
    refno?: string
}
const ViewMaterialPRItemsTable = ({ RFQData }: Props) => {
    return (
        <div>
            <div>
                <h1 className='text-lg py-2 font-semibold'>Items</h1>
                <div className="">
                    <Table className="">
                        <TableHeader className="text-center">
                            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
                                <TableHead className="">Sr No.</TableHead>
                                <TableHead>Item Code</TableHead>
                                <TableHead className="min-w-[200px]">Item Description</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>UOM</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Delivery Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="bg-white">
                            {RFQData?.pr_items.length > 0 ? (
                                RFQData.pr_items?.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell className="text-nowrap">{item?.material_code_head}</TableCell>
                                        <TableCell className="text-nowrap">{item?.material_name_head}</TableCell>
                                        <TableCell className="text-nowrap">{item?.quantity_head}</TableCell>
                                        <TableCell className="text-nowrap">{item?.uom_head}</TableCell>
                                        <TableCell className="text-nowrap">{item?.price_head}</TableCell>
                                        <TableCell className="text-nowrap">{item?.delivery_date_head}</TableCell>
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
            </div>
        </div>
    )
}

export default ViewMaterialPRItemsTable

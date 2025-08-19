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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { PurchaseRequisitionRow } from '@/src/types/RFQtype';
import { Button } from '@/components/ui/button';

interface Props {
    items: PurchaseRequisitionRow[];
    refno?: string
}
const ViewQuotationMaterialItems = ({ items }: Props) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="text-sm">
                    View
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] max-w-screen-md overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Quotation Items</DialogTitle>
                </DialogHeader>
                <Table className="w-full">
                    <TableHeader className="text-center">
                        <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
                            <TableHead className="">Sr No.</TableHead>
                            <TableHead className="text-center">Material Code</TableHead>
                            <TableHead className="text-center">Material Name</TableHead>
                            <TableHead className="text-center">Quantity</TableHead>
                            <TableHead className="text-center">UOM</TableHead>
                            <TableHead className="text-center">Price</TableHead>
                            <TableHead className="text-center">Lead Time</TableHead>
                            <TableHead className="text-center">Remarks</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-center bg-white">
                        {items.length > 0 ? (
                            items?.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium text-center">{index + 1}</TableCell>
                                    <TableCell className="text-nowrap text-center">{item?.material_code_head}</TableCell>
                                    <TableCell className="text-nowrap text-center">{item?.material_name_head}</TableCell>
                                    <TableCell className="text-nowrap text-center">{item?.quantity_head}</TableCell>
                                    <TableCell className="text-nowrap text-center">{item?.uom_head}</TableCell>
                                    <TableCell className="text-nowrap text-center">{item?.price_head}</TableCell>
                                    <TableCell className="text-nowrap text-center">{item?.lead_time_head}</TableCell>
                                    <TableCell className="text-nowrap text-center">{item?.remarks}</TableCell>
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
            </DialogContent>
        </Dialog>
    )
}

export default ViewQuotationMaterialItems

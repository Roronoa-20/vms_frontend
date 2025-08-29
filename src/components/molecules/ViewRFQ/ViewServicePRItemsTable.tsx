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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
interface Props {
    RFQData: RFQDetails;
    refno?: string
}
const ViewServicePRItemsTable = ({ RFQData }: Props) => {
    return (
        <div>
            <div>
                <h1 className='text-lg py-2 font-semibold'>RFQ Items</h1>
                <div className="border rounded-lg overflow-hidden">
                    <Accordion type="multiple" className="w-full space-y-4" defaultValue={RFQData?.pr_items.map((head) => head.head_unique_field)}>
                        {RFQData?.pr_items.map((head, index) => (
                            <AccordionItem
                                key={head.head_unique_field}
                                value={head.head_unique_field}
                                defaultValue={RFQData?.pr_items.map((head) => head.head_unique_field)}
                                className="rounded-lg border border-gray-200 shadow-sm dark:border-gray-700 hover:none"
                            >
                                {/* Trigger moved to a separate arrow button */}
                                <div className="flex items-center gap-4 w-full p-4 bg-gray-100 dark:bg-gray-800 rounded-t-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                    {/* Main info block */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full text-left text-sm md:text-base">
                                        <div><strong>Requisition No.</strong>: {head.purchase_requisition_number || "N/A"}</div>
                                        <div><strong>Service Name</strong>: {head.material_name_head || "Unnamed"}</div>
                                        <div><strong>Service Code</strong>: {head.material_code_head || "N/A"}</div>
                                        <div><strong>Price</strong>: ₹{head.price_head || "0"}</div>
                                        <div><strong>Quantity</strong>: {head.quantity_head}</div>
                                        <div><strong>UOM</strong>: {head.uom_head || "N/A"}</div>
                                        <div><strong>Delivery Date</strong>: {head.delivery_date_head || "N/A"}</div>
                                    </div>
                                    {/* Accordion toggle arrow only */}
                                    <AccordionTrigger className="ml-auto w-6 h-6" />
                                </div>
                                <AccordionContent className="p-4 bg-white dark:bg-gray-900 rounded-b-lg">
                                    <Table>
                                        <TableHeader className='bg-[#DDE8FE]'>
                                            <TableRow className="bg-muted/50 text-xs md:text-sm">
                                                <TableHead>Service Name</TableHead>
                                                <TableHead>Quantity</TableHead>
                                                <TableHead>UOM</TableHead>
                                                <TableHead>Price</TableHead>
                                                <TableHead>Delivery Date</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {head?.subhead_fields.map((sub) => {
                                                return (
                                                    <TableRow key={sub.subhead_unique_field} className="text-sm">
                                                        <TableCell>{sub.material_name_subhead}</TableCell>
                                                        <TableCell>
                                                            {sub.quantity_subhead}
                                                        </TableCell>
                                                        <TableCell>{sub.uom_subhead}</TableCell>
                                                        <TableCell>₹{sub.price_subhead}</TableCell>
                                                        <TableCell>
                                                            {sub.delivery_date_subhead}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </div>
    )
}

export default ViewServicePRItemsTable

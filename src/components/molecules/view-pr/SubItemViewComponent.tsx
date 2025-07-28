import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type props = {
    materials: {
        head_unique_field: string;
        requisition_no: string;
        material_name_head: string;
        material_code_head: string;
        price_head: number;
        quantity_head: number;
        uom_head: string;
        delivery_date_head: string;
        subhead_fields: {
            subhead_unique_field: string;
            material_name_subhead: string;
            quantity_subhead: number;
            uom_subhead: string;
            price_subhead: number;
            delivery_date_subhead: string;
        }[];
    }[];
}
const SubItemViewComponent = ({materials}:props) => {
    return (
        <div>
            <div className="border rounded-lg overflow-hidden">
                <Accordion type="multiple" className="w-full space-y-4">
                    {materials.map((head, index) => (
                        <AccordionItem
                            key={head.head_unique_field}
                            value={head.head_unique_field}
                            className="rounded-lg border border-gray-200 shadow-sm dark:border-gray-700"
                        >
                            <AccordionTrigger className="p-4 bg-gray-100 dark:bg-gray-800 rounded-t-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full text-left text-sm md:text-base">
                                    <div><strong>Requisition No.</strong>: {head.requisition_no || "N/A"}</div>
                                    <div><strong>Material Name</strong>: {head.material_name_head || "Unnamed"}</div>
                                    <div><strong>Material Code</strong>: {head.material_code_head || "N/A"}</div>
                                    <div><strong>Price</strong>: ₹{head.price_head || "0"}</div>
                                    <div><strong>Quantity</strong>: {head.quantity_head}</div>
                                    <div><strong>UOM</strong>: {head.uom_head || "N/A"}</div>
                                    <div><strong>Delivery Date</strong>: {head.delivery_date_head || "N/A"}</div>
                                </div>
                            </AccordionTrigger>

                            <AccordionContent className="p-4 bg-white dark:bg-gray-900 rounded-b-lg">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50 text-xs md:text-sm">
                                            <TableHead className="w-12">Select</TableHead>
                                            <TableHead>Material Name</TableHead>
                                            <TableHead>Quantity</TableHead>
                                            <TableHead>UOM</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Delivery Date</TableHead>
                                            <TableHead className="w-24">Actions</TableHead>
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
                                                    <TableCell>
                                                        {/* {isEditing ? (
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="px-2"
                                                                    onClick={() => saveEdit(head.head_unique_field, sub?.subhead_unique_field)}
                                                                    title="Save"
                                                                >
                                                                    <Check className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="px-2"
                                                                    onClick={cancelEdit}
                                                                    title="Cancel"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="p-1"
                                                                onClick={() =>
                                                                    startEdit(sub.subhead_unique_field, sub.quantity_subhead, sub.delivery_date_subhead)
                                                                }
                                                                disabled={editingRow !== null}
                                                                title="Edit"
                                                            >
                                                                <Edit2 className="h-4 w-4 text-blue-600" />
                                                            </Button>
                                                        )} */}
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
    )
}

export default SubItemViewComponent

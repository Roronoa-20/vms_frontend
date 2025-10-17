import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onClose: () => void;
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
};

const SubItemViewComponent = ({ open, onClose, materials }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl overflow-y-auto flex flex-col">
        {/* Header with Cross button */}
        <DialogHeader className="flex justify-start mb-1">
          <DialogTitle>PR Details</DialogTitle>
        </DialogHeader>

        {/* Accordion */}
        <div className="border rounded-lg overflow-hidden flex-1">
          <Accordion type="multiple" className="w-full space-y-4">
            {materials.map((head) => (
              <AccordionItem
                key={head.head_unique_field}
                value={head.head_unique_field}
                className="rounded-lg shadow-sm dark:border-gray-700"
              >
                <AccordionTrigger className="p-2 bg-blue-100 hover:bg-blue-100 border-none !border-b-0 rounded-t-lg">
                  <div className="grid grid-cols-3 gap-4 w-full text-left text-sm md:text-base">
                    <div>
                      <strong>Requisition No.</strong>: {head.requisition_no || "N/A"}
                    </div>
                    <div>
                      <strong>Material Name</strong>: {head.material_name_head || "Unnamed"}
                    </div>
                    <div>
                      <strong>Material Code</strong>: {head.material_code_head || "N/A"}
                    </div>
                    <div>
                      <strong>Price</strong>: ₹{head.price_head || 0}
                    </div>
                    <div>
                      <strong>Quantity</strong>: {head.quantity_head}
                    </div>
                    <div>
                      <strong>UOM</strong>: {head.uom_head || "N/A"}
                    </div>
                    <div>
                      <strong>Delivery Date</strong>: {head.delivery_date_head || "N/A"}
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="p-1 bg-white dark:bg-gray-900 rounded-b-lg">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-100 text-xs md:text-sm">
                        <TableHead>Material Name</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>UOM</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Delivery Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {head.subhead_fields.map((sub) => (
                        <TableRow key={sub.subhead_unique_field} className="text-sm">
                          <TableCell>{sub.material_name_subhead}</TableCell>
                          <TableCell>{sub.quantity_subhead}</TableCell>
                          <TableCell>{sub.uom_subhead}</TableCell>
                          <TableCell>₹{sub.price_subhead}</TableCell>
                          <TableCell>{sub.delivery_date_subhead}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Back button at bottom */}
        <div className="mt-1 flex justify-end">
          <Button size="backbtnsize" variant="backbtn" onClick={onClose}>
            Back
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubItemViewComponent;

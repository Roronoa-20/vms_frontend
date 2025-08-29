import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/atoms/table";
import { PurchaseRequisitionRow } from "@/src/types/RFQtype";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

interface Props {
  serviceItems: PurchaseRequisitionRow[];
  setServiceItems: React.Dispatch<React.SetStateAction<PurchaseRequisitionRow[]>>;
}

const PublicQuoteServiceItemsTable = ({ serviceItems, setServiceItems }: Props) => {
  // Patch IDs into state once when missing
  useEffect(() => {
    let changed = false;
    const updated = serviceItems.map((head, headIndex) => {
      if (!head.head_unique_field) {
        changed = true;
        head.head_unique_field = `head-${headIndex}-${Date.now()}`;
      }
      head.subhead_fields = head?.subhead_fields?.map((sub, subIndex) => {
        if (!sub.subhead_unique_field) {
          changed = true;
          sub.subhead_unique_field = `sub-${headIndex}-${subIndex}-${Date.now()}`;
        }
        return sub;
      }) || [];
      return head;
    });
    if (changed) {
      setServiceItems(updated);
    }
  }, [serviceItems, setServiceItems]);

  // Delete head with its subheads
  const handleDeleteHead = (id: string) => {
    setServiceItems((prev) => prev.filter((item) => item?.head_unique_field !== id));
  };
  return (
    <div>
      <h1 className="text-lg py-2 font-semibold">Items Added</h1>
      <div className="border rounded-lg overflow-hidden">
        <Accordion
          type="multiple"
          className="w-full space-y-4"
          defaultValue={serviceItems.map((head) => head?.head_unique_field!)}
        >
          {serviceItems?.map((head,index) => (
            <AccordionItem
              key={index}
              value={head?.head_unique_field!}
              className="rounded-lg border border-gray-200 shadow-sm dark:border-gray-700 hover:none"
            >
              <div className="flex items-center gap-4 w-full p-4 bg-gray-100 dark:bg-gray-800 rounded-t-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full text-left text-sm md:text-base">
                  <div><strong>Service Code</strong>: {head?.material_code_head || "N/A"}</div>
                  <div ><strong>Service Name</strong>: {head?.material_name_head || "Unnamed"}</div>
                  <div><strong>Price</strong>: ₹{head?.price_head || "0"}</div>
                  <div ><strong>Lead Time</strong>: {head?.lead_time_head}</div>
                  <div><strong>Remarks</strong>: {head?.remarks || "N/A"}</div>
                </div>

                {/* Delete Button */}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteHead(head?.head_unique_field!)}
                >
                  Delete
                </Button>

                {/* Accordion toggle */}
                <AccordionTrigger className="ml-auto w-6 h-6">
                  <span key={`trigger-${head?.head_unique_field}`}></span>
                </AccordionTrigger>

              </div>

              <AccordionContent className="p-4 bg-white dark:bg-gray-900 rounded-b-lg">
                <Table>
                  <TableHeader className="bg-[#DDE8FE]">
                    <TableRow className="bg-muted/50 text-xs md:text-sm">
                      <TableHead>Service Name</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>UOM</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Delivery Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {head?.subhead_fields?.map((sub, index) => (
                      <TableRow key={index || `${head?.head_unique_field}-sub-${index}`} className="text-sm">
                        <TableCell>{sub?.material_name_subhead}</TableCell>
                        <TableCell>{sub?.quantity_subhead}</TableCell>
                        <TableCell>{sub?.uom_subhead}</TableCell>
                        <TableCell>₹{sub?.price_subhead}</TableCell>
                        <TableCell>{sub?.delivery_date_subhead}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default PublicQuoteServiceItemsTable;

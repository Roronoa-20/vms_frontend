import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"; // adjust this path if needed

import { PurchaseRequisitionDataItem } from "@/src/types/PurchaseRequisitionType";

type Props = {
  data: PurchaseRequisitionDataItem[];
  loading: boolean;
};

const ViewPRTable = ({ data, loading }: Props) => {
  if (loading) return <p className="text-center text-gray-500">Loading PR data...</p>;

  return (
    <div className="rounded-xl border overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>Sr. No.</TableHead>
            <TableHead>PR No</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Requester</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                No PR records found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((pr, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{pr.name}</TableCell>
                <TableCell>{pr.purchase_requisition_date}</TableCell>
                <TableCell>{pr.requisitioner}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ViewPRTable;

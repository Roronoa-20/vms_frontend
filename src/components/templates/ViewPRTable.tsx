import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PurchaseRequisitionDataItem } from "@/src/types/PurchaseRequisitionType";


type Props = {
  data: PurchaseRequisitionDataItem[];
  loading: boolean;
  pageNo: number;
  pageLength: number;
  totalCount: number;
  onPageChange: (page: number) => void;
};

const ViewPRTable = ({ data, loading, pageNo, pageLength, totalCount, onPageChange }: Props) => {
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleCheckboxChange = (sap_pr_code: string, pr_type: string | null) => {
    if (!pr_type) {
      console.error("PR Type is missing for this entry.");
      return;
    }

    const isChecked = selectedRows[sap_pr_code];

    if (!isChecked) {
      if (!selectedType) {
        setSelectedType(pr_type);
      } else if (selectedType !== pr_type) {
        console.error(`Only '${selectedType}' PRs can be selected. '${pr_type}' is not allowed.`);
        return;
      }
    }

    const updatedRows = {
      ...selectedRows,
      [sap_pr_code]: !isChecked,
    };

    const anyChecked = Object.values(updatedRows).some(Boolean);
    if (!anyChecked) setSelectedType(null);

    setSelectedRows(updatedRows);
  };

  const totalPages = Math.ceil(totalCount / pageLength);
  const selectedData = data.filter((item) => selectedRows[item.sap_pr_code]);

  const router = useRouter();

  const handleCreateRFQ = () => {
    const selectedPRCodes = Object.keys(selectedRows).filter(
      (key) => selectedRows[key]
    );

    if (selectedPRCodes.length === 0 || !selectedType) {
      console.error("No PRs selected or missing PR type");
      return;
    }

    const queryParams = new URLSearchParams({
      pr_codes: selectedPRCodes.join(","),
      pr_type: selectedType,
    });

    router.push(`/create-rfq?${queryParams.toString()}`);
  };
  if (loading) return <p className="text-center text-gray-500">Loading PR data...</p>;


  return (
    <div className="space-y-4">
      {selectedData.length > 0 && (
        <div className="flex justify-end">
          <Button
            className="my-4"
            variant="nextbtn"
            size="nextbtnsize"
            onClick={handleCreateRFQ}
            disabled={Object.values(selectedRows).filter(Boolean).length === 0}
          >
            Create RFQ
          </Button>
        </div>
      )}

      <div className="rounded-xl border overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-100 text-center">
            <TableRow>
              <TableHead className="text-center">Select</TableHead>
              <TableHead className="text-center">Sr. No.</TableHead>
              <TableHead className="text-center">Purchase Requisition Type</TableHead>
              <TableHead className="text-center">PR No</TableHead>
              <TableHead className="text-center">Date</TableHead>
              <TableHead className="text-center">Requester</TableHead>
              <TableHead className="text-center">View</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                  No PR records found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((pr, index) => (
                <TableRow key={pr.sap_pr_code}>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      <Input
                        type="checkbox"
                        checked={!!selectedRows[pr.sap_pr_code]}
                        onChange={() => handleCheckboxChange(pr.sap_pr_code, pr.purchase_requisition_type)}
                        className="cursor-pointer w-4 h-4"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{(pageNo - 1) * pageLength + index + 1}</TableCell>
                  <TableCell className="text-center">{pr.purchase_requisition_type}</TableCell>
                  <TableCell className="text-center">{pr.sap_pr_code}</TableCell>
                  <TableCell className="text-center">{pr.purchase_requisition_date}</TableCell>
                  <TableCell className="text-center">{pr.requisitioner}</TableCell>
                  <TableCell className="text-center">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            variant="outline"
            disabled={pageNo === 1}
            onClick={() => onPageChange(pageNo - 1)}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {pageNo} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={pageNo === totalPages}
            onClick={() => onPageChange(pageNo + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ViewPRTable;

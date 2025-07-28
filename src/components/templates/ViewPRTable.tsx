
// const safeData = data.filter(pr => pr.sap_pr_code !== null && pr.sap_pr_code !== undefined); DO NOT DELETE
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PurchaseRequisitionDataItem } from "@/src/types/PurchaseRequisitionType";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../atoms/select";
import PopUp from "../molecules/PopUp";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import SubItemViewComponent from "../molecules/view-pr/SubItemViewComponent";

interface PRItemsType {
  name: string,
  product_name: string,
  material_code_head: string,
  plant_head: string,
  cost_center_head: string,
  gl_account_number_head: string,
  quantity_head: string,
  product_name_head: string,
  uom_head: string,
  item_number_of_purchase_requisition_head: string;
  item_number_of_purchase_requisition_subhead: string;
  cost_center_subhead: string,
  gl_account_number_subhead: string,
  quantity_subhead: string,
  uom_subhead: string,
  short_text_head: string,
  short_text_subhead: string
}

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
  const [filterType, setFilterType] = useState<string>("All");
  const router = useRouter();

  const filteredData = filterType === "All" ? data : data.filter((pr) => pr.purchase_requisition_type === filterType);
  const totalPages = Math.ceil(totalCount / pageLength);
  const selectedData = data.filter((item) => selectedRows[item.sap_pr_code]);
  const uniqueTypes = Array.from(new Set(data.map((pr) => pr.purchase_requisition_type))).filter(Boolean);

  const handleCheckboxChange = (clickedCode: string, clickedType: string | null) => {
    if (!clickedType) return;

    const isAlreadySelected = !!selectedRows[clickedCode];
    if (selectedType && selectedType !== clickedType) return;

    const updatedRows = { ...selectedRows };
    if (isAlreadySelected) {
      delete updatedRows[clickedCode];
    } else {
      updatedRows[clickedCode] = true;
    }

    const selectedCodes = Object.keys(updatedRows).filter((key) => updatedRows[key]);
    setSelectedType(selectedCodes.length > 0 ? clickedType : null);
    setSelectedRows(updatedRows);
  };

  const handleCreateRFQ = () => {
    const selectedPRCodes = Object.keys(selectedRows).filter((key) => selectedRows[key]);
    if (selectedPRCodes.length === 0 || !selectedType) return;

    const queryParams = new URLSearchParams({
      pr_codes: selectedPRCodes.join(","),
      pr_type: selectedType,
    });

    router.push(`/create-rfq?${queryParams.toString()}`);
  };

  const [prItems, setPRItems] = useState<PRItemsType[]>([]);
  const [selectedPRDetails, setSelectedPRDetails] = useState<PurchaseRequisitionDataItem | null>(null);
  const [showPRPopup, setShowPRPopup] = useState(false);
  const [expandedSubheadRows, setExpandedSubheadRows] = useState<Record<string, boolean>>({});
  const [showSubItemComponent, setShowSubItemComponent] = useState(false);


  const fetchPRItems = async (prCode: string) => {
    const url = `${API_END_POINTS?.getPRItemsTable}?pr_name=${prCode}`;
    const response: AxiosResponse = await requestWrapper({ url, method: "GET" });
    if (response?.status === 200) {
      setPRItems(response?.data?.message?.data?.purchase_requisition_form_table);
    }
  };

  const toggleItemExpanded = (prName: string, itemNo: string) => {
    const key = `${prName}-${itemNo}`;
    setExpandedSubheadRows((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const transformToMaterials = (prItems: PRItemsType[]): any[] => {
    const grouped: Record<string, any> = {};

    prItems.forEach((item) => {
      const key = item.item_number_of_purchase_requisition_head;

      if (!grouped[key]) {
        grouped[key] = {
          head_unique_field: `${item.name}-${item.item_number_of_purchase_requisition_head}`,
          requisition_no: item.name,
          material_name_head: item.product_name_head,
          material_code_head: item.material_code_head,
          price_head: 0,
          quantity_head: Number(item.quantity_head),
          uom_head: item.uom_head,
          delivery_date_head: "N/A",
          subhead_fields: []
        };
      }

      grouped[key].subhead_fields.push({
        subhead_unique_field: `${item.name}-${item.item_number_of_purchase_requisition_subhead}`,
        material_name_subhead: item.short_text_subhead || item.product_name_head,
        quantity_subhead: Number(item.quantity_subhead),
        uom_subhead: item.uom_subhead,
        price_subhead: 0,
        delivery_date_subhead: "N/A"
      });
    });

    return Object.values(grouped);
  };


  if (loading) return <p className="text-center text-gray-500">Loading PR data...</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Filter by PR Type:</label>
          <Select onValueChange={(value) => setFilterType(value)} value={filterType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {uniqueTypes.map((type) => (
                <SelectItem key={type as string} value={type as string}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selectedData.length > 0 && (
          <Button
            className="my-4"
            variant="nextbtn"
            size="nextbtnsize"
            onClick={handleCreateRFQ}
            disabled={Object.values(selectedRows).filter(Boolean).length === 0}
          >
            Create RFQ
          </Button>
        )}
      </div>

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
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-gray-500">No PR records found.</TableCell>
              </TableRow>
            ) : (filteredData.map((pr, index) => (
              <React.Fragment key={pr.sap_pr_code ?? `row-${index}`}>
                <TableRow>
                  <TableCell className="text-center">
                    <input
                      type="checkbox"
                      checked={!!selectedRows[pr.sap_pr_code]}
                      disabled={!!selectedType && selectedType !== pr.purchase_requisition_type}
                      onChange={() => handleCheckboxChange(pr.sap_pr_code, pr.purchase_requisition_type)}
                      className="cursor-pointer w-4 h-4"
                    />
                  </TableCell>
                  <TableCell className="text-center">{(pageNo - 1) * pageLength + index + 1}</TableCell>
                  <TableCell className="text-center">{pr.purchase_requisition_type}</TableCell>
                  <TableCell className="text-center">{pr.sap_pr_code}</TableCell>
                  <TableCell className="text-center">{pr.purchase_requisition_date}</TableCell>
                  <TableCell className="text-center">{pr.requisitioner}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        await fetchPRItems(pr.name);
                        setSelectedPRDetails(pr);

                        if (pr.purchase_requisition_type === "SB") {
                          setShowSubItemComponent(true);
                          setShowPRPopup(false);
                        } else {
                          setShowPRPopup(true);
                          setShowSubItemComponent(false);
                        }
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))
            )}
          </TableBody>
        </Table>
      </div>
      {selectedPRDetails && (
        <>
          {showPRPopup && selectedPRDetails.purchase_requisition_type !== "SB" && (
            <PopUp classname="w-full md:max-w-[70vw] md:max-h-[60vh] h-full overflow-y-scroll" handleClose={() => setShowPRPopup(false)}>
              <h1 className="pl-5">Purchase Requisition Items</h1>
              <div className="shadow bg-[#f6f6f7] mb-4 p-4 rounded-2xl">
                <Table className="max-h-40 overflow-y-scroll overflow-x-scroll">
                  <TableHeader className="text-center">
                    <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center text-nowrap">
                      <TableHead>Sr. No.</TableHead>
                      <TableHead>Plant</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Material Code</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>UOM</TableHead>
                      <TableHead>GL Account Number</TableHead>
                      <TableHead>Cost Center</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.plant_head}</TableCell>
                        <TableCell>{item.product_name_head}</TableCell>
                        <TableCell>{item.material_code_head}</TableCell>
                        <TableCell>{item.quantity_head}</TableCell>
                        <TableCell>{item.uom_head}</TableCell>
                        <TableCell>{item.cost_center_head}</TableCell>
                        <TableCell>{item.gl_account_number_head}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </PopUp>
          )}
          {showSubItemComponent && selectedPRDetails?.purchase_requisition_type === "SB" && (
            <PopUp classname="w-full md:max-w-[80vw] md:max-h-[80vh] h-full overflow-y-scroll" handleClose={() => setShowSubItemComponent(false)}>
              <SubItemViewComponent materials={transformToMaterials(prItems)} />
            </PopUp>
          )}
        </>
      )}


      {totalPages > 1 && (
        <div className="flex justify-start items-center gap-2 mt-4">
          <Button variant="outline" disabled={pageNo === 1} onClick={() => onPageChange(pageNo - 1)}>
            Previous
          </Button>
          <span className="text-sm">Page {pageNo} of {totalPages}</span>
          <Button variant="outline" disabled={pageNo === totalPages} onClick={() => onPageChange(pageNo + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ViewPRTable;
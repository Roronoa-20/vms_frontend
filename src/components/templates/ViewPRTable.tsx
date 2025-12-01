"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "../atoms/select";
import PopUp from "../molecules/PopUp";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import Pagination from "../molecules/Pagination";
import { PurchaseRequisitionDataItem } from '@/src/types/PurchaseRequisitionType';
import { Label } from "@/components/ui/label";
import { TvendorRegistrationDropdown } from "@/src/types/types";


type Props = {
  data: PurchaseRequisitionDataItem[];
  loading: boolean;
  companyDropdown: TvendorRegistrationDropdown["message"]["data"]["company_master"];
};

const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const ViewPRTable = ({ data, loading, companyDropdown }: Props) => {
  console.log(data, "this is data")

  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("All");
  const router = useRouter();
  const [table, setTable] = useState<PurchaseRequisitionDataItem[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const [total_event_list, settotalEventList] = useState(0);
  const [record_per_page, setRecordPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const debouncedSearchName = useDebounce(search, 300);
  const selectedData = data.filter((item) => selectedRows[item.sap_pr_code]);
  const uniqueTypes = Array.from(new Set(data.map((pr) => pr.purchase_requisition_type))).filter(Boolean);

  const handleCheckboxChange = (prUniqueKey: string, clickedType: string | null) => {
    if (!clickedType) return;

    const isSelected = !!selectedRows[prUniqueKey];
    if (selectedType && selectedType !== clickedType) return;

    const updatedRows = { ...selectedRows };
    if (isSelected) {
      delete updatedRows[prUniqueKey];
    } else {
      updatedRows[prUniqueKey] = true;
    }

    const selectedCodesOfType = Object.entries(updatedRows)
      .filter(([key]) => {
        const pr = data.find((item) => (item.sap_pr_code || item.name) === key);
        return pr?.purchase_requisition_type === clickedType;
      })
      .map(([key]) => key);

    setSelectedType(selectedCodesOfType.length > 0 ? clickedType : null);
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

  useEffect(() => {
    fetchTable();
  }, [debouncedSearchName, selectedCompany, filterType, currentPage]);


  const handlesearchname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const purReqFilter = filterType === "All" ? "" : filterType;

  const fetchTable = async () => {
    const PRFormData: AxiosResponse = await requestWrapper({
      url: `${API_END_POINTS?.sapprcreated}?pur_req_type=${purReqFilter}&company=${selectedCompany}&pr_no=${debouncedSearchName}&page_no=${currentPage}&page_length=${record_per_page}`,
      method: "GET",
    });
    console.log("ijbnivjnsifvnesivnoer---->", PRFormData)
    if (PRFormData?.status == 200) {
      const data = PRFormData?.data?.message;
      setTable(data?.data || []);
      settotalEventList(data?.total_count || 0);
      setRecordPerPage(5);
    }
  };

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };


  if (loading) return <p className="text-center text-gray-500">Loading PR data...</p>;

  return (
    <>
      <div className="shadow bg-[#f6f6f7] p-3 rounded-2xl">
        <div className="flex items-center justify-between w-full">

          {/* LEFT SIDE — Filters */}
          <div className="flex items-center gap-4">

            <Label className="text-sm font-medium">Filter by PR Type:</Label>
            <Select onValueChange={(value) => setFilterType(value)} value={filterType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                {uniqueTypes.map((type) => (
                  <SelectItem key={type as string} value={type as string}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Search + Company */}
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search PR No..."
                value={search}
                onChange={handlesearchname}
                className="min-w-[150px]"
              />

              <Select
                value={selectedCompany || "all"}
                onValueChange={(value) => setSelectedCompany(value === "all" ? "" : value)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All</SelectItem>
                    {companyDropdown?.map((item, index) => (
                      <SelectItem key={index} value={item?.name}>
                        {item?.description}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

          </div>

          {/* RIGHT SIDE — Create RFQ Button */}
          {selectedData.length > 0 && (
            <Button
              className="py-2.5"
              variant="nextbtn"
              size="nextbtnsize"
              onClick={handleCreateRFQ}
              disabled={Object.values(selectedRows).filter(Boolean).length === 0}
            >
              Create RFQ
            </Button>
          )}

        </div>
        <div className="w-full">
          <p className="text-[12px] text-center text-gray-600 italic bg-gray-100 py-1 rounded-md underline mt-4">
            {/* Disclaimer: All PRs are visible here, whether created through VMS Portal or SAP. */}
            Disclaimer: This list displays all Purchase Requisitions (PRs), regardless of whether they were generated via the VMS Portal or synchronized from SAP.
          </p>
        </div>
        <Table>
          <TableHeader className="bg-blue-100 text-center">
            <TableRow>
              <TableHead className="text-center text-black">Select</TableHead>
              <TableHead className="text-center text-black">Sr. No.</TableHead>
              <TableHead className="text-center text-black">Company</TableHead>
              <TableHead className="text-center text-black">PR Type</TableHead>
              <TableHead className="text-center text-black">PR Name</TableHead>
              <TableHead className="text-center text-black">PR No</TableHead>
              <TableHead className="text-center text-black">Date</TableHead>
              <TableHead className="text-center text-black">Plant</TableHead>
              <TableHead className="text-center text-black">Status</TableHead>
              <TableHead className="text-center text-black">View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-gray-500">No PR records found.</TableCell>
              </TableRow>
            ) : (table.map((pr, index) => (
              <React.Fragment key={pr.sap_pr_code ?? `row-${index}`}>
                <TableRow>
                  <TableCell className="text-center">
                    <input
                      type="checkbox"
                      checked={!!selectedRows[pr.sap_pr_code || pr.name]}
                      disabled={!!selectedType && selectedType !== pr.purchase_requisition_type}
                      onChange={() => handleCheckboxChange(pr.sap_pr_code || pr.name, pr.purchase_requisition_type)}
                      className="cursor-pointer w-4 h-4"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{(currentPage - 1) * record_per_page + index + 1}</TableCell>
                  <TableCell className="text-center">{pr.company}</TableCell>
                  <TableCell className="text-center">{pr.purchase_requisition_type}</TableCell>
                  <TableCell className="text-center">{pr.prf_name_for_sap}</TableCell>
                  <TableCell className="text-center">{pr.sap_pr_code}</TableCell>
                  <TableCell className="text-center">{pr.purchase_requisition_date ? formatDate(new Date(pr.purchase_requisition_date)) : ""}</TableCell>
                  <TableCell className="text-center">{pr.plant}</TableCell>
                  <TableCell>
                    <div
                      className={`text-center px-2 py-3 rounded-xl ${pr?.sap_status === "Failed"
                        ? "bg-red-100 text-red-800"
                        : pr?.sap_status === "Success"
                          ? "bg-green-100 text-green-800" : pr?.sap_status === "RELEASED"
                            ? "bg-green-100 text-green-800" : pr?.sap_status === "RELEASED"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {pr?.sap_status || "--"}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="nextbtn"
                      size="nextbtnsize"
                      className="py-2.5 hover:bg-white hover:text-black hover:border border-blue-500 w-[70px] rounded-[16px]"
                      onClick={() => {
                        if (pr?.pr_created_from_sap === 1) {
                          const prfName = pr?.name;
                          router.push(`/pr-request?prf_name=${prfName}`);
                        } else {
                          // Normal PR → use cart_id + pur_req
                          const cartId = pr?.cart_id;
                          const purReq = pr?.pur_req_webform_name;
                          router.push(`/pr-request?cart_id=${cartId}&pur_req=${purReq}`);
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
      <Pagination
        currentPage={currentPage}
        record_per_page={record_per_page}
        setCurrentPage={setCurrentPage}
        total_event_list={total_event_list}
      />
    </>
  );
};

export default ViewPRTable;
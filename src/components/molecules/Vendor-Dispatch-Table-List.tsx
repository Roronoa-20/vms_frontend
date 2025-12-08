"use client"
import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/atoms/table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/src/components/atoms/select";
import { tableData } from "@/src/constants/dashboardTableData";
import { Input } from "../atoms/input";
import { DashboardPOTableData, DashboardTableType } from "@/src/types/types";
import Link from "next/link";
import { dispatchTable } from "@/src/types/dispatchTableType";
import PopUp from "./PopUp";
import { Button } from "../atoms/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { Plus, RefreshCw } from "lucide-react";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import API_END_POINTS from "@/src/services/apiEndPoints";
import Pagination from "./Pagination";

type Props = {
  dashboardTableData: dispatchTable["dispatches"]
  poname:string
}

const useDebounce = (value: any, delay: any) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const DashboardDispatchVendorsTable = ({ dashboardTableData,poname }: Props) => {
  const { designation } = useAuth();
  console.log(dashboardTableData, "this is table data")
  const [isPODialog, setIsPODialog] = useState<boolean>(false);
  const [selectedPOTable, setSelectedPOTable] = useState<string[]>();
  const router = useRouter();
  const [table, setTable] = useState<any[]>(dashboardTableData || []);
  const [total_event_list, settotalEventList] = useState(0);
  const [record_per_page, setRecordPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleClose = () => {
    setIsPODialog(false);
  };

  const handlePOClick = (table: string[]) => {
    setSelectedPOTable(table);
    setIsPODialog(true);
  };

  const [vendorSearch, setVendorSearch] = useState("");
  const [poSearch, setPOSearch] = useState(poname ?? "");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const debouncedFromDate = useDebounce(fromDate, 300);
  const debouncedToDate = useDebounce(toDate, 300);
  const debouncedVendor = useDebounce(vendorSearch, 300);
  const debouncedPO = useDebounce(poSearch, 300);


  useEffect(() => {
    fetchTable();
  }, [debouncedVendor, debouncedPO, currentPage, debouncedFromDate, debouncedToDate])

  const fetchTable = async () => {
    const dispatchTableData: AxiosResponse = await requestWrapper({
      url: `${API_END_POINTS?.dispatchTable}?vendor_name=${debouncedVendor}&po_name=${debouncedPO}&from_date=${debouncedFromDate}&to_date=${debouncedToDate}&page_no=${currentPage}&page_size=${record_per_page}`,
      method: "GET",
    });
    if (dispatchTableData?.status == 200) {
      setTable(dispatchTableData?.data?.message?.dispatches);
      console.log("srkjbsvikbwigv----------->", table)
      settotalEventList(dispatchTableData?.data?.message?.total_count)
      // setRecordPerPage(5);
    }
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "-";
    const cleanDate = dateStr.trim().split(" ")[0];
    if (!cleanDate) return "-";
    const [year, month, day] = cleanDate.split("-");
    if (!year || !month || !day) return "-";
    return `${day}-${month}-${year}`;
  };

  const resetFilters = () => {
    setVendorSearch("");
    setPOSearch("");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };


  return (
    <div className="py-4 px-2">
      <div className="shadow bg-[#f6f6f7] p-4 rounded-2xl">
        <div className="flex w-full justify-between pb-4">
          {/* <h1 className="text-[20px] text-[#03111F] font-semibold">
            All Dispatch Orders
          </h1> */}
          {designation === "Vendor" && (
            <Button onClick={() => { router.push("/dispatch") }} className="py-2.5" variant={"nextbtn"} size={"nextbtnsize"}>
              <Plus size={18} strokeWidth={2.5} />
              Create Dispatch</Button>
          )}
          <div className="flex gap-4">
            {designation !== "Vendor" && (
              <Input
                placeholder="Search Vendor Name..."
                value={vendorSearch}
                onChange={(e) => {
                  setVendorSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            )}

            <Input
              placeholder="Search PO No..."
              value={poSearch}
              onChange={(e) => {
                setPOSearch(e.target.value);
                setCurrentPage(1);
              }}
            />

            <Input
              type="date"
              placeholder="From Date"
              value={fromDate}
              onChange={(e) => { setFromDate(e.target.value); setCurrentPage(1); }}
            />
            <Input
              type="date"
              placeholder="To Date"
              value={toDate}
              onChange={(e) => { setToDate(e.target.value); setCurrentPage(1); }}
            />
            <Button onClick={resetFilters} className="bg-[#f6f6f7] p-0 hover:bg-[#f6f6f7] flex items-center gap-1">
              <RefreshCw size={18} color="green" className="border-none" />
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader className="text-center">
            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] text-center">
              <TableHead className="text-center text-black">Sr. No.</TableHead>
              <TableHead className="text-center text-black">Ref No.</TableHead>
              {designation !== "Vendor" && (
                <TableHead className="text-center text-black">Vendor Name</TableHead>
              )}
              <TableHead className="text-center text-black">PO. No.</TableHead>
              <TableHead className="text-center text-black">Invoice Number</TableHead>
              <TableHead className="text-center text-black">Invoice Date</TableHead>
              <TableHead className="text-center text-black">Invoice Amount</TableHead>
              <TableHead className="text-center text-black">Status</TableHead>
              <TableHead className="text-center text-black">View Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-center">
            {table?.length ? (table.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="text-center font-medium">{index + 1}</TableCell>
                <TableCell className="text-center whitespace-nowrap">{item?.name}</TableCell>
                {designation !== "Vendor" && (
                  <TableCell className="text-center whitespace-nowrap">{item?.vendor_name}</TableCell>
                )}
                <TableCell className="text-center whitespace-nowrap">
                  {item?.purchase_numbers?.length
                    ? item.purchase_numbers.join(", ")
                    : "-"}
                </TableCell>
                <TableCell className="text-center whitespace-nowrap">{item?.invoice_number}</TableCell>
                <TableCell className="text-center whitespace-nowrap">{formatDate(item?.invoice_date)}</TableCell>
                <TableCell className="text-center whitespace-nowrap">₹{item?.invoice_amount}</TableCell>
                <TableCell className="text-center whitespace-nowrap">
                  <div
                    className={`px-2 py-3 rounded-xl uppercase ${item?.status === "In Transit"
                      ? "bg-yellow-100 text-yellow-800"
                      : item?.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                      }`}
                  >
                    {item?.status}
                  </div>
                </TableCell>
                {/* <TableCell>
                  <Button className="py-2 font-medium hover:bg-white hover:text-black" variant={"nextbtn"} size={"nextbtnsize"} onClick={() => { handlePOClick(item?.purchase_numbers) }}>
                    View PO
                  </Button>
                </TableCell> */}
                <TableCell>
                  <Button variant={"nextbtn"} size={"nextbtnsize"} onClick={() => { (designation != "Vendor" || item?.status != "Pending") ? router.push(`/view-dispatch?refno=${item?.name}`) : router.push(`/dispatch?refno=${item?.name}`) }} className="hover:bg-white hover:text-black font-medium py-2.5 hover:border hover:border-[#5291CD]">
                    View
                  </Button>
                </TableCell>
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
      {/* ------------------------------------ Below is the Multiple PR PopUp ------------------------------------- */}
      {isPODialog &&
        <PopUp handleClose={handleClose} headerText="Purchase Order List">
          <Table>
            <TableHeader className="text-center">
              <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
                <TableHead className="text-center">PO No.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-center">
              {selectedPOTable ? (selectedPOTable?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item}</TableCell>
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
        </PopUp>
      }
      <Pagination currentPage={currentPage} record_per_page={record_per_page} setCurrentPage={setCurrentPage} total_event_list={total_event_list} />
    </div>
  );
};

export default DashboardDispatchVendorsTable;

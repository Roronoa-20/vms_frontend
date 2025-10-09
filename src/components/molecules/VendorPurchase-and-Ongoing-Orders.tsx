"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/atoms/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/atoms/select";
import { Input } from "../atoms/input";
// import { useEffect } from 'react';
import { DashboardPOTableData, DashboardPOTableItem, TvendorRegistrationDropdown, VendorDashboardPOTableData } from "@/src/types/types";
import { Button } from "@/components/ui/button";
import PODialog from './PODialog'
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import { useMultipleVendorCodeStore } from "@/src/store/MultipleVendorCodeStore";
import { useAuth } from "@/src/context/AuthContext";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { useRouter } from "next/navigation";


type Props = {
  dashboardPOTableData?: VendorDashboardPOTableData["message"];
  companyDropdown: TvendorRegistrationDropdown["message"]["data"]["company_master"]
};

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

const PurchaseAndOngoingOrders = ({ dashboardPOTableData, companyDropdown }: Props) => {
  const [status, setStatus] = useState<"approve" | "reject" | "">("");
  const [date, setDate] = useState("");
  const [comments, setComments] = useState("");
  const [isDialog, setIsDialog] = useState(false);
  const [poNumber, setPONumber] = useState("");
  const [tableData, setTableData] = useState<DashboardPOTableItem[]>(dashboardPOTableData?.purchase_orders ?? []);
  const { MultipleVendorCode, addMultipleVendorCode, reset, selectedVendorCode } = useMultipleVendorCodeStore();
  const [search, setSearch] = useState<string>("");

  const [total_event_list, settotalEventList] = useState(0);
  const [record_per_page, setRecordPerPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { designation } = useAuth();
  const router = useRouter();

  const debouncedSearchName = useDebounce(search, 300);

  console.log(tableData, "this is table")

  useEffect(() => {
    const fetchPoTable = async () => {
      const POUrl = `${API_END_POINTS?.vendorPOTable}?vendor_code=${selectedVendorCode}&po_no=${search}`
      const dashboardPOTableDataApi: AxiosResponse = await requestWrapper({
        url: POUrl,
        method: "GET",
      });

      if (dashboardPOTableDataApi?.status == 200) {
        setTableData(dashboardPOTableDataApi?.data?.message?.purchase_orders)
      }
    }
    if (selectedVendorCode || debouncedSearchName || currentPage) {
      fetchPoTable();
    }
  }, [selectedVendorCode, debouncedSearchName, currentPage])


  const handlesearchname = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(value, "this is search name")
    setSearch(value);
  }

  const downloadPoDetails = async (name: string) => {
    try {
      const Data = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_END}/api/method/vms.purchase.doctype.purchase_order.purchase_order.get_po_printfomat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            po_name: name,
          }),
        }
      );
      if (Data.ok) {
        const data = await Data.blob();
        const url = URL.createObjectURL(data);
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 500);
      }
    } catch (error) {
      console.log(error, "something went wrong");
    }
  };

  const handleApproval = async (status: "approve" | "reject" | "") => {
    const url = {
      approve: `${process.env.NEXT_PUBLIC_BACKEND_END}/api/method/vms.APIs.vendors_dashboards_api.po_approve_reject.po_approve`,
      reject: `${process.env.NEXT_PUBLIC_BACKEND_END}/api/method/vms.APIs.vendors_dashboards_api.po_approve_reject.po_reject`,
    };
    let apiUrl = "";
    if (status) {
      apiUrl = url[status];
    }
    const response: AxiosResponse = await requestWrapper({ url: apiUrl, data: { data: { po_name: poNumber, tentative_date: status == "approve" ? date : "", reason_for_rejection: status == "reject" ? comments : "" } }, method: "POST" });
    if (response?.status == 200) {
      if (status == "approve") {
        alert("approved successfully");
        location.reload();
      } else {
        alert("rejected successfully")
      }
    }
  };

  const handleClose = () => {
    setIsDialog(false);
    setDate("");
    setComments("");
  }

  console.log(companyDropdown, "this is company dropdown")

  return (
    <>
      <div className="shadow- bg-[#f6f6f7] p-4 rounded-2xl">
        <div className="flex w-full justify-between pb-4">
          <h1 className="text-[20px] text-[#03111F] font-semibold">
            Purchase and Ongoing Orders
          </h1>
          <div className="flex gap-4">
            <Input placeholder="Search..." onChange={(e) => { handlesearchname(e) }} />
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="w-full">
                  {
                    companyDropdown?.map((item, index) => (
                      <SelectItem key={index} value={item?.name}>{item?.description}</SelectItem>
                    ))
                  }
                </SelectGroup>
              </SelectContent>
            </Select>
            {/* <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select> */}
          </div>
        </div>
        <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader className="text-center">
            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
              <TableHead className="text-center text-black">Sr No.</TableHead>
              <TableHead className="text-center text-black">PO No</TableHead>
              <TableHead className="text-center text-black">Vendor Name</TableHead>
              <TableHead className="text-center text-black">PO Date</TableHead>
              <TableHead className="text-center text-black">Delivery Date</TableHead>
              <TableHead className="text-center text-black">PO Amount</TableHead>
              <TableHead className="text-center text-black">Status</TableHead>
              <TableHead className="text-center text-black">Early Delivery</TableHead>
              <TableHead className="text-center text-black">View details</TableHead>
              <TableHead className={`text-center text-black ${designation == "Vendor" ? "" : "hidden"}`}>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-center">
            {tableData && tableData?.length > 0 ? (
              tableData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center font-medium">{index + 1}</TableCell>
                  <TableCell className="text-center whitespace-nowrap">{item?.name}</TableCell>
                  <TableCell className="text-center whitespace-nowrap">
                    {item?.supplier_name ? item.supplier_name : "-"}
                  </TableCell>
                  <TableCell className="text-center whitespace-nowrap">{item?.po_date}</TableCell>
                  <TableCell className="text-center whitespace-nowrap">{item?.delivery_date}</TableCell>
                  <TableCell className="text-center whitespace-nowrap">{item?.total_gross_amount}</TableCell>
                  <TableCell className="text-center whitespace-nowrap">
                    <div
                      className={`px-2 py-3 rounded-xl ${item?.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : item?.status.includes("Approved")
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                    >
                      {item?.status}
                    </div>
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">{item?.vendors_tentative_delivery_date}</TableCell>
                  <TableCell>
                    <Button
                      variant={"outline"}
                      // onClick={() => downloadPoDetails(item?.name)}
                      onClick={() => router.push(`/view-vendor-po?po_name=${item?.name}`)}
                    >
                      view
                    </Button>
                  </TableCell>
                  <TableCell className={`flex gap-4 ${designation == "Vendor" ? "" : "hidden"}  ${item?.approved_from_vendor == Boolean(1) ? "hidden" : ""} `}>
                    <Button
                      variant={"outline"}
                      onClick={() => { setStatus("approve"); setIsDialog((prev) => !prev); setPONumber(item?.name) }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant={"outline"}
                      onClick={() => { setStatus("reject"); setIsDialog((prev) => !prev); setPONumber(item?.name) }}
                    >
                      Reject
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
      {
        isDialog &&
        <div className="absolute z-50 flex pt-10 items-center justify-center bg-black bg-opacity-50 inset-0">
          <PODialog Submitbutton={handleApproval} handleClose={handleClose} handleComment={setComments} handleDate={setDate} status={status} />
        </div>
      }
    </>
  );
};

export default PurchaseAndOngoingOrders;

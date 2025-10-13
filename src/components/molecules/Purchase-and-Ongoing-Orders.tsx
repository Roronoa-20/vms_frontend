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
import PopUp from "./PopUp";
import { useOutsideClick } from "@/src/hooks/useOutsideClick";
import { useRouter } from "next/navigation";
import Pagination from "./Pagination";


type Props = {
  dashboardPOTableData?: DashboardPOTableData["message"];
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
  const [tableData, setTableData] = useState<DashboardPOTableItem[]>(dashboardPOTableData?.total_po ?? []);
  const { MultipleVendorCode, addMultipleVendorCode, reset, selectedVendorCode } = useMultipleVendorCodeStore();
  const [search, setSearch] = useState<string>("");
  const [selectedCompany, setSelectedCompany] = useState<string>("");

  const [total_event_list, settotalEventList] = useState(0);
  const [record_per_page, setRecordPerPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { designation } = useAuth();
  const [isEmailDialog, setIsEmailDialog] = useState<boolean>(false);
  const debouncedSearchName = useDebounce(search, 300);
  const [POFile, setPOFile] = useState<File | null>(null)
  const [email, setEmail] = useState<any>();
  const router = useRouter();

  useEffect(() => {
    const fetchPoTable = async () => {
      const POUrl = `${API_END_POINTS?.poTable}?vendor_name=${search}`
      const dashboardPOTableDataApi: AxiosResponse = await requestWrapper({
        url: POUrl,
        method: "GET",
      });

      if (dashboardPOTableDataApi?.status == 200) {
        setTableData(dashboardPOTableDataApi?.data?.message?.total_po)
      }
    }
    if (selectedVendorCode || debouncedSearchName || currentPage) {
      fetchPoTable();
    }
  }, [selectedVendorCode, debouncedSearchName, currentPage])

  console.log("PO Table Data--->", tableData)


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
      } else {
        alert("rejected successfully")
      }
    }
  };

  const handleClose = () => {
    setIsDialog(false);
    setIsEmailDialog(false);
    setDate("");
    setComments("");
    setEmail(null);
  }

  const handleSubmit = async () => {
    if (!POFile) {
      alert("please add PO");
      return;
    }

    if (!email?.cc) {
      alert("please cc emails");
      return;
    }
    const sendPoEmailUrl = API_END_POINTS?.sendPOEmailVendor;
    const formdata = new FormData();
    if (POFile) {
      formdata.append("attach", POFile)
    }
    formdata.append("to", JSON.stringify(email?.to))
    formdata.append("cc", JSON.stringify(email?.cc))
    const response: AxiosResponse = await requestWrapper({ url: sendPoEmailUrl, data: formdata, method: "POST" });
    if (response?.status == 200) {
      alert("email sent successfully");
      handleClose();
    }
  }

  const handleSelectChange = (
  value: string,
  setter: (val: string) => void
  ) => {
  if (value === "--Select--") {
    setter(""); // reset filter
  } else {
    setter(value);
  }
};


  return (
    <>
      <div className="shadow- bg-[#f6f6f7] p-4 rounded-2xl">
        <div className="flex w-full justify-between pb-4">
          <h1 className="text-[20px] text-[#03111F] font-semibold">
            Purchase and Ongoing Orders
          </h1>
          <div className="flex gap-4">
            <Input placeholder="Search..." onChange={(e) => { handlesearchname(e) }} />
            <Select
              value={selectedCompany}
              onValueChange={(value) => handleSelectChange(value, setSelectedCompany)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="w-full">
                  <SelectItem value="--Select--">--Select--</SelectItem>
                  {
                    companyDropdown?.map((item, index) => (
                      <SelectItem key={index} value={item?.name}>{item?.description}</SelectItem>
                    ))
                  }
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Release">Release</SelectItem>
                  <SelectItem value="Revoked">Revoked</SelectItem>
                  <SelectItem value="Approved by Vendor">Approved by Vendor</SelectItem>
                  <SelectItem value="Rejected by Vendor">Rejected by Vendor</SelectItem>
                  <SelectItem value="Confrimation Pending From User">Pineapple</SelectItem>
                  <SelectItem value="Confirmed By User">Confirmed By User</SelectItem>
                  <SelectItem value="Goods Not Received">Goods Not Received</SelectItem>
                  <SelectItem value="Send to Accounts Team For Payment Release">With Accounts Team</SelectItem>
                  <SelectItem value="GRN Generated">GRN Generated</SelectItem>
                  <SelectItem value="Dispatched">Dispatched</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
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
              <TableHead className="text-center text-black">Send Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-center text-black">
            {tableData ? (
              tableData?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{item?.name}</TableCell>
                  <TableCell>
                    {item?.supplier_name ? item.supplier_name : "-"}
                  </TableCell>
                  <TableCell>{item?.po_date}</TableCell>
                  <TableCell>{item?.delivery_date}</TableCell>
                  <TableCell>{item?.total_gross_amount}</TableCell>
                  <TableCell>
                    <div
                      className={`px-2 py-3 rounded-xl ${item?.status === "Pending by Vendor"
                          ? "bg-yellow-100 text-yellow-800"
                          : item?.status === "Approved by Vendor"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                    >
                      {item?.status}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{item?.name}</TableCell>
                  <TableCell>
                    <Button
                      variant={"outline"}
                      className="bg-blue-400 hover:bg-blue-300 text-white font-medium"
                      // onClick={() => downloadPoDetails(item?.name)}
                      onClick={() => router.push(`/view-po?po_name=${item?.name}&email_to=${item?.email}`)}
                    >
                      View
                    </Button>
                  </TableCell>
                  <TableCell><Button onClick={() => { setIsEmailDialog(true); setEmail((prev: any) => ({ ...prev, to: item?.email })) }} className="bg-blue-400 hover:bg-blue-300">Send</Button></TableCell>
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
      <Pagination currentPage={currentPage} record_per_page={record_per_page} setCurrentPage={setCurrentPage} total_event_list={total_event_list} />
      {
        isDialog &&
        <div className="absolute z-50 flex pt-10 items-center justify-center bg-black bg-opacity-50 inset-0">
          <PODialog Submitbutton={handleApproval} handleClose={handleClose} handleComment={setComments} handleDate={setDate} status={status} />
        </div>
      }
      {
        isEmailDialog &&
        <PopUp handleClose={handleClose} classname="md:max-h-[400px]" headerText="Send Email" isSubmit={true} Submitbutton={handleSubmit}>
          <div className="mb-3">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              To
            </h1>
            <Input disabled value={email?.to ?? ""} />
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              CC
            </h1>
            <Input onChange={(e) => { setEmail((prev: any) => ({ ...prev, cc: e.target.value })) }} />
          </div>
          <Input onChange={(e) => { setPOFile(e.target.files && e.target.files[0]) }} className="mt-4" type="file" />
        </PopUp>
      }
    </>
  );
};

export default PurchaseAndOngoingOrders;

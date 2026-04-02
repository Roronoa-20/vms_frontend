"use client"
import React, { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../atoms/table";
import { Button } from "../atoms/button";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../atoms/select";
import MultiSelect from "react-select";
import PODialog from '@/src/components/molecules/PODialog';
import { TvendorRegistrationDropdown } from "@/src/types/types";
import Pagination from "../molecules/Pagination";
import { useAuth } from "@/src/context/AuthContext";
import { PoListViewRecord } from "@/src/types/po/po.types";
import { getPoListView } from "@/src/services/purchaseOrder/purchaseOrder.services";

interface PODropdown {
  name: string,
  po_no: string,
  company_code: string
}

interface Props {
  po_name?: string
  dropdown: PODropdown[]
  companyDropdown: TvendorRegistrationDropdown["message"]["data"]["company_master"]
}

const ViewVendorPO = ({ po_name, dropdown, companyDropdown }: Props) => {
  const router = useRouter();
  const { vendorRef } = useAuth();

  const [PRNumber, setPRNumber] = useState<string | undefined>(po_name);
  const [tableData, setTableData] = useState<PoListViewRecord[]>([]);
  const [status, setStatus] = useState<"approve" | "reject" | "">("");
  const [comments, setComments] = useState("");
  const [isDialog, setIsDialog] = useState(false);
  const [date, setDate] = useState("");
  const [poNumber, setPONumber] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string>("");

  const [total_event_list, settotalEventList] = useState(0);
  const [record_per_page] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    if (vendorRef || PRNumber || currentPage || selectedCompany) {
      fetchPoTable();
    }
  }, [vendorRef, PRNumber, currentPage, selectedCompany]);

  const fetchPoTable = async () => {
    try {
      const res = await getPoListView({
        search_term: PRNumber || "",
        company: selectedCompany,
        page_no: currentPage,
        page_size: record_per_page,
      });
      setTableData(res?.data || []);
      settotalEventList(res?.total_count || 0);
    } catch (err) {
      console.error("Error fetching PO table:", err);
    }
  };

  const handlePOChange = (value: string) => {
    setPRNumber(value || undefined);
    setCurrentPage(1);
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "-";
    const cleanDate = dateStr.trim().split(" ")[0];
    if (!cleanDate) return "-";
    const [year, month, day] = cleanDate.split("-");
    if (!year || !month || !day) return "-";
    return `${day}-${month}-${year}`;
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
        alert("rejected successfully");
        location.reload();
      }
    }
  };

  const handleClose = () => {
    setIsDialog(false);
    setDate("");
    setComments("");
  };

  return (
    <>
      <div className="bg-[#f8fafc] space-y-6 text-sm text-black font-sans m-5">
        {/* Header Section */}
        <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-md border border-gray-300">
          <div className="flex gap-4">
            <MultiSelect
              className="w-60 text-sm"
              instanceId="vendor-po-search-select"
              options={dropdown?.map((po: PODropdown) => ({
                value: po.name,
                label: `${po.name} - ${po.company_code || ""}`
              })) || []}
              placeholder="Search PO Number…"
              isSearchable
              isClearable
              onChange={(selectedOption: any) => {
                handlePOChange(selectedOption?.value || "");
              }}
              value={
                PRNumber
                  ? { value: PRNumber, label: PRNumber }
                  : null
              }
            />

            <Select onValueChange={(value) => { setSelectedCompany(value) }} value={selectedCompany}>
              <SelectTrigger className="w-60">
                <SelectValue placeholder="Select Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {
                    companyDropdown?.map((item, index) => (
                      <SelectItem key={index} value={item?.name}>{item?.description}</SelectItem>
                    ))
                  }
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader className="text-center">
            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
              <TableHead className="text-center text-black">Sr No.</TableHead>
              <TableHead className="text-center text-black">PO No</TableHead>
              <TableHead className="text-center text-black text-nowrap">PO Date</TableHead>
              <TableHead className="text-center text-black text-nowrap">Delivery Date</TableHead>
              <TableHead className="text-center text-black">Company</TableHead>
              <TableHead className="text-center text-black">Status</TableHead>
              <TableHead className="text-center text-black">Purchase Group</TableHead>
              <TableHead className="text-center text-black">Purchase Team</TableHead>
              <TableHead className="text-center text-black text-nowrap">Ack Date</TableHead>
              <TableHead className="text-center text-black text-nowrap">View PO</TableHead>
              <TableHead className="text-center text-black text-nowrap">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-center text-black">
            {tableData && tableData?.length > 0 ? (
              tableData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center">{(currentPage - 1) * record_per_page + index + 1}</TableCell>
                  <TableCell className="text-center whitespace-nowrap">{item?.name}</TableCell>
                  <TableCell className="text-center text-nowrap">{formatDate(item?.po_date)}</TableCell>
                  <TableCell className="text-center text-nowrap">{formatDate(item?.delivery_date)}</TableCell>
                  <TableCell className="text-center text-nowrap">{item?.company_code}</TableCell>
                  <TableCell className="text-center whitespace-nowrap">
                    <div
                      className={`px-2 py-3 rounded-xl ${item?.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : item?.status?.includes("Approved") || item?.status === "RELEASED"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                        }`}
                    >
                      {item?.status}
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-nowrap">{item?.purchase_group || "-"}</TableCell>
                  <TableCell className="text-center text-nowrap">{item?.purchase_team || "-"}</TableCell>
                  <TableCell className="text-center whitespace-nowrap">{formatDate(item?.ack_date)}</TableCell>
                  <TableCell>
                    <Button
                      className="bg-[#5291CD] hover:bg-white hover:text-black hover:border border-[#5291CD] rounded-[14px]"
                      onClick={() => router.push(`/view-vendor-po-details?poname=${item?.name}`)}
                    >
                      View
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant={"nextbtn"}
                        size={"nextbtnsize"}
                        className="py-2 hover:bg-white hover:text-black border border-transparent hover:border-[#5291CD] rounded-[14px]"
                        onClick={() => { setStatus("approve"); setIsDialog(true); setPONumber(item?.name); }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant={"backbtn"}
                        size={"backbtnsize"}
                        className="py-2 hover:bg-[#5291CD] hover:text-white hover:border-[#5291CD] rounded-[14px]"
                        onClick={() => { setStatus("reject"); setIsDialog(true); setPONumber(item?.name); }}
                      >
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} className="text-center text-gray-500 py-4">
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {isDialog &&
          <div className="absolute z-50 flex pt-10 items-center justify-center bg-black bg-opacity-50 inset-0">
            <PODialog Submitbutton={handleApproval} handleClose={handleClose} handleComment={setComments} handleDate={setDate} status={status} />
          </div>
        }
      </div>
      <Pagination currentPage={currentPage} record_per_page={record_per_page} setCurrentPage={setCurrentPage} total_event_list={total_event_list} />
    </>
  );
};

export default ViewVendorPO;
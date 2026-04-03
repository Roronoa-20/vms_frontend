"use client"
import React, { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../atoms/table";
import { Button } from "../atoms/button";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../atoms/select";
import MultiSelect from "react-select";
import { TvendorRegistrationDropdown } from "@/src/types/types";
import Pagination from "../molecules/Pagination";
import { useAuth } from "@/src/context/AuthContext";
import { PoListViewRecord } from "@/src/types/po/po.types";
import { getPoListView } from "@/src/services/purchaseOrder/purchaseOrder.services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText, Search, Building2, Eye, Package, Loader2,
  CheckCircle2, XCircle, CalendarDays, MessageSquare, X
} from "lucide-react";
import { Input } from "../atoms/input";
import PopUp from "../molecules/PopUp";

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

const statusColor = (status?: string) => {
  if (!status) return 'bg-gray-100 text-gray-600 border-gray-200'
  const s = status.toLowerCase()
  if (s.includes('approved') || s.includes('released') || s.includes('confirmed')) return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (s.includes('awaiting') || s.includes('pending') || s.includes('open')) return 'bg-amber-50 text-amber-700 border-amber-200'
  if (s.includes('reject') || s.includes('cancel')) return 'bg-red-50 text-red-700 border-red-200'
  return 'bg-blue-50 text-blue-700 border-blue-200'
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handlePOChange = (value: string) => {
    setPRNumber(value || undefined);
    setCurrentPage(1);
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "—";
    const cleanDate = dateStr.trim().split(" ")[0];
    if (!cleanDate) return "—";
    const [year, month, day] = cleanDate.split("-");
    if (!year || !month || !day) return "—";
    return `${day}-${month}-${year}`;
  };

  const handleApproval = async () => {
    const url = {
      approve: `${process.env.NEXT_PUBLIC_BACKEND_END}/api/method/vms.APIs.vendors_dashboards_api.po_approve_reject.po_approve`,
      reject: `${process.env.NEXT_PUBLIC_BACKEND_END}/api/method/vms.APIs.vendors_dashboards_api.po_approve_reject.po_reject`,
    };
    let apiUrl = "";
    if (status) {
      apiUrl = url[status];
    }

    try {
      setIsSubmitting(true);
      const response: AxiosResponse = await requestWrapper({
        url: apiUrl,
        data: {
          data: {
            po_name: poNumber,
            tentative_date: status == "approve" ? date : "",
            reason_for_rejection: status == "reject" ? comments : ""
          }
        },
        method: "POST"
      });
      if (response?.status == 200) {
        handleClose();
        setIsSubmitting(false);
        await fetchPoTable();
        alert(status === "approve" ? "Approved successfully" : "Rejected successfully");
      }
    } catch (err) {
      setIsSubmitting(false);
      alert("Action failed. Please try again.");
    }
  };

  const handleClose = () => {
    setIsDialog(false);
    setDate("");
    setComments("");
    setStatus("");
  };

  return (
    <div className="p-4 space-y-5">
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 bg-white rounded-2xl px-8 py-6 shadow-xl">
            <Loader2 className="w-8 h-8 text-[#4F6BED] animate-spin" />
            <p className="text-sm font-semibold text-[#1E293B]">Processing...</p>
            <p className="text-xs text-[#94A3B8]">Please wait while we process your request</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F6BED] to-[#7C93F5] flex items-center justify-center shadow-sm">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-[#0F172A] tracking-tight">Vendor Purchase Orders</CardTitle>
              <p className="text-xs text-[#94A3B8] mt-0.5 font-medium">
                {total_event_list} record{total_event_list !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex flex-col gap-1.5 min-w-[260px]">
              <label className="text-xs font-semibold text-[#475569] uppercase tracking-wider flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                Search PO
              </label>
              <MultiSelect
                className="text-sm"
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
                styles={{
                  control: (base: any) => ({
                    ...base,
                    borderRadius: '0.5rem',
                    borderColor: '#e2e8f0',
                    minHeight: '40px',
                    '&:hover': { borderColor: '#4F6BED' },
                  }),
                  placeholder: (base: any) => ({
                    ...base,
                    color: '#94A3B8',
                  }),
                }}
              />
            </div>
            <div className="flex flex-col gap-1.5 min-w-[260px]">
              <label className="text-xs font-semibold text-[#475569] uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                Company
              </label>
              <Select onValueChange={(value) => { setSelectedCompany(value); setCurrentPage(1); }} value={selectedCompany}>
                <SelectTrigger className="rounded-lg h-10 border-slate-200 bg-white text-sm">
                  <SelectValue placeholder="Select Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companyDropdown?.map((item, index) => (
                      <SelectItem key={index} value={item?.name}>{item?.description}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-sm">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-[#0F172A] tracking-tight">Purchase Orders</CardTitle>
              <p className="text-xs text-[#94A3B8] mt-0.5 font-medium">Review and manage vendor purchase orders</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 px-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-7 h-7 text-[#4F6BED] animate-spin" />
                <p className="text-sm font-medium text-[#94A3B8]">Loading purchase orders...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#F8FAFC] text-[13px] hover:bg-[#F8FAFC] border-b border-slate-200">
                      <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider">Sr No.</TableHead>
                      <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider">PO No</TableHead>
                      <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider text-nowrap">PO Date</TableHead>
                      <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider text-nowrap">Delivery Date</TableHead>
                      <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider">Company</TableHead>
                      <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider">Status</TableHead>
                      <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider text-nowrap">Purchase Group</TableHead>
                      <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider text-nowrap">Purchase Team</TableHead>
                      <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider text-nowrap">Ack Date</TableHead>
                      <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider">View</TableHead>
                      {/* <TableHead className="text-center text-[#64748B] font-semibold text-xs uppercase tracking-wider">Action</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData && tableData.length > 0 ? (
                      tableData.map((item, index) => (
                        <TableRow key={index} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                          <TableCell className="text-center text-sm text-[#64748B] tabular-nums">
                            {(currentPage - 1) * record_per_page + index + 1}
                          </TableCell>
                          <TableCell className="text-center text-nowrap text-sm font-semibold text-[#0F172A]">
                            {item?.name}
                          </TableCell>
                          <TableCell className="text-center text-nowrap text-sm text-[#475569]">
                            {formatDate(item?.po_date)}
                          </TableCell>
                          <TableCell className="text-center text-nowrap text-sm text-[#475569]">
                            {formatDate(item?.delivery_date)}
                          </TableCell>
                          <TableCell className="text-center text-nowrap text-sm text-[#64748B]">
                            {item?.company_code}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className={`text-[11px] font-semibold px-2.5 py-0.5 tracking-wide whitespace-nowrap ${statusColor(item?.status)}`}>
                              {item?.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center text-nowrap text-sm text-[#64748B]">
                            {item?.purchase_group || "—"}
                          </TableCell>
                          <TableCell className="text-center text-nowrap text-sm text-[#64748B]">
                            {item?.purchase_team || "—"}
                          </TableCell>
                          <TableCell className="text-center text-nowrap text-sm text-[#475569]">
                            {formatDate(item?.ack_date)}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="relative group">
                              <button
                                onClick={() => router.push(`/view-vendor-po-details?poname=${item?.name}`)}
                                className="w-8 h-8 rounded-lg bg-[#EEF2FF] flex items-center justify-center hover:bg-[#4F6BED] hover:text-white text-[#4F6BED] transition-colors mx-auto"
                                aria-label="View Purchase Order"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <span className="opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity absolute left-1/2 -translate-x-1/2 top-full mt-1 z-10 whitespace-nowrap px-2.5 py-1 bg-gray-800 text-xs text-white rounded shadow-lg">
                                View PO
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={11} className="text-center py-10">
                          <div className="flex flex-col items-center gap-2">
                            <FileText className="w-10 h-10 text-slate-300" />
                            <p className="text-sm font-medium text-[#94A3B8]">No purchase orders found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              {tableData && tableData.length > 0 && (
                <div className="px-4 pb-3 pt-1">
                  <Pagination currentPage={currentPage} record_per_page={record_per_page} setCurrentPage={setCurrentPage} total_event_list={total_event_list} />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

    </div>
  );
};

export default ViewVendorPO;

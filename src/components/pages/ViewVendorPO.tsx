"use client"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../atoms/table";
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
  FileText,
  Search,
  Building2,
  Eye,
  Package,
  Loader2,
} from "lucide-react";

interface PODropdown {
  name: string;
  po_no: string;
  company_code: string;
}

interface Props {
  po_name?: string;
  dropdown: PODropdown[];
  companyDropdown: TvendorRegistrationDropdown["message"]["data"]["company_master"] | undefined;
}

const statusColor = (status?: string) => {
  if (!status) return "bg-gray-100 text-gray-600 border-gray-200";
  const s = status.toLowerCase();
  if (s.includes("approved") || s.includes("released") || s.includes("confirmed"))
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s.includes("awaiting") || s.includes("pending") || s.includes("open"))
    return "bg-amber-50 text-amber-700 border-amber-200";
  if (s.includes("reject") || s.includes("cancel")) return "bg-red-50 text-red-700 border-red-200";
  return "bg-blue-50 text-blue-700 border-blue-200";
};

const ViewVendorPO = ({ po_name, dropdown, companyDropdown }: Props) => {
  const router = useRouter();
  const { vendorRef } = useAuth();

  const [PRNumber, setPRNumber] = useState<string | undefined>(po_name);
  const [tableData, setTableData] = useState<PoListViewRecord[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("_all");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const hasLoadedOnce = useRef(false);

  const [total_event_list, settotalEventList] = useState(0);
  const [record_per_page] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    if (po_name) setPRNumber(po_name);
  }, [po_name]);

  const poOptions = useMemo(
    () =>
      (dropdown || []).map((po: PODropdown) => ({
        value: po.name,
        label: [po.po_no || po.name, po.company_code].filter(Boolean).join(" · ") || po.name,
      })),
    [dropdown]
  );

  const selectedPoOption = useMemo(() => {
    if (!PRNumber) return null;
    const found = poOptions.find((o) => o.value === PRNumber);
    return found ?? { value: PRNumber, label: PRNumber };
  }, [PRNumber, poOptions]);

  const fetchPoTable = useCallback(async () => {
    try {
      if (hasLoadedOnce.current) {
        setIsFetching(true);
      }
      const res = await getPoListView({
        search_term: PRNumber || "",
        company: selectedCompany === "_all" ? "" : selectedCompany,
        page_no: currentPage,
        page_size: record_per_page,
      });
      setTableData(res?.data || []);
      settotalEventList(res?.total_count || 0);
    } catch (err) {
      console.error("Error fetching PO table:", err);
    } finally {
      hasLoadedOnce.current = true;
      setIsInitialLoad(false);
      setIsFetching(false);
    }
  }, [PRNumber, selectedCompany, currentPage, record_per_page]);

  useEffect(() => {
    fetchPoTable();
  }, [vendorRef, fetchPoTable]);

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

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      {/* Page intro */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#0F172A] tracking-tight">Vendor purchase orders</h1>
          <p className="text-[13px] text-[#64748B] mt-0.5">
            Search by PO, filter by company, then open a PO to acknowledge or raise advance.
          </p>
        </div>
        {total_event_list > 0 && (
          <Badge variant="outline" className="w-fit text-[11px] font-semibold border-slate-200 bg-white text-[#475569]">
            {total_event_list} result{total_event_list !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {/* Filters + table */}
      <Card className="shadow-sm border-slate-200 overflow-hidden">
        <CardHeader className="py-3 px-4 border-b border-slate-100 bg-gradient-to-r from-[#F8FAFC] to-white">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4F6BED] to-[#7C93F5] flex items-center justify-center shadow-sm flex-shrink-0">
                <Package className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-sm font-bold text-[#0F172A] tracking-tight">Purchase order list</CardTitle>
                <p className="text-[11px] text-[#94A3B8] mt-0.5 font-medium leading-none">
                  Filter and select a row to view details
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto lg:min-w-0">
              <div className="flex-1 min-w-[200px] max-w-md">
                <label className="sr-only">Search PO</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8] pointer-events-none z-[1]" />
                  <div className="pl-7">
                    <MultiSelect
                      className="text-sm"
                      classNamePrefix="vendor-po"
                      instanceId="vendor-po-search-select"
                      options={poOptions}
                      placeholder="Search PO number…"
                      isSearchable
                      isClearable
                      onChange={(selectedOption: { value: string } | null) => {
                        handlePOChange(selectedOption?.value || "");
                      }}
                      value={selectedPoOption}
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: "0.5rem",
                          borderColor: "#e2e8f0",
                          minHeight: "36px",
                          fontSize: "0.8125rem",
                          boxShadow: "none",
                          "&:hover": { borderColor: "#cbd5e1" },
                        }),
                        placeholder: (base) => ({ ...base, color: "#94a3b8", fontSize: "0.8125rem" }),
                        singleValue: (base) => ({ ...base, fontSize: "0.8125rem", color: "#334155" }),
                        menu: (base) => ({ ...base, zIndex: 20 }),
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full sm:w-[220px] flex-shrink-0">
                <label className="sr-only">Company</label>
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-[#94A3B8] flex-shrink-0 hidden sm:block" />
                  <Select
                    onValueChange={(value) => {
                      setSelectedCompany(value);
                      setCurrentPage(1);
                    }}
                    value={selectedCompany}
                  >
                    <SelectTrigger className="rounded-lg h-9 border-slate-200 bg-white text-xs w-full">
                      <SelectValue placeholder="Company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="_all">All companies</SelectItem>
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
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 relative">
          {isInitialLoad ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-7 h-7 text-[#4F6BED] animate-spin" />
                <p className="text-xs font-medium text-[#94A3B8]">Loading purchase orders…</p>
              </div>
            </div>
          ) : (
            <>
              {isFetching && (
                <div className="absolute inset-0 z-10 bg-white/55 backdrop-blur-[1px] flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-[#4F6BED] animate-spin" />
                </div>
              )}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#F8FAFC] hover:bg-[#F8FAFC] border-b border-slate-200">
                      <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 w-12">
                        Sr.
                      </TableHead>
                      <TableHead className="text-left text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 text-nowrap">
                        PO No.
                      </TableHead>
                      <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 text-nowrap">
                        PO Date
                      </TableHead>
                      <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 text-nowrap">
                        Delivery
                      </TableHead>
                      <TableHead className="text-left text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2">
                        Company
                      </TableHead>
                      <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2">
                        Status
                      </TableHead>
                      <TableHead className="text-left text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 text-nowrap">
                        Pur. group
                      </TableHead>
                      <TableHead className="text-left text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 text-nowrap">
                        Pur. team
                      </TableHead>
                      <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 text-nowrap">
                        Ack. date
                      </TableHead>
                      <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-8 px-2 w-14">
                        View
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData && tableData.length > 0 ? (
                      tableData.map((item, index) => (
                        <TableRow
                          key={item?.name ?? index}
                          className="hover:bg-slate-50/80 transition-colors border-b border-slate-100"
                        >
                          <TableCell className="text-center text-xs text-[#64748B] tabular-nums py-2 px-2">
                            {(currentPage - 1) * record_per_page + index + 1}
                          </TableCell>
                          <TableCell className="text-left text-xs font-semibold text-[#0F172A] py-2 px-2 max-w-[140px] truncate" title={item?.name}>
                            {item?.name}
                          </TableCell>
                          <TableCell className="text-center text-nowrap text-xs text-[#475569] py-2 px-2">
                            {formatDate(item?.po_date)}
                          </TableCell>
                          <TableCell className="text-center text-nowrap text-xs text-[#475569] py-2 px-2">
                            {formatDate(item?.delivery_date)}
                          </TableCell>
                          <TableCell className="text-left text-xs text-[#64748B] py-2 px-2 max-w-[100px] truncate" title={item?.company_code}>
                            {item?.company_code}
                          </TableCell>
                          <TableCell className="text-center py-2 px-2">
                            <Badge
                              variant="outline"
                              className={`text-[10px] font-semibold px-2 py-0 tracking-wide whitespace-nowrap ${statusColor(item?.status)}`}
                            >
                              {item?.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-left text-xs text-[#64748B] py-2 px-2 max-w-[120px] truncate" title={item?.purchase_group}>
                            {item?.purchase_group || "—"}
                          </TableCell>
                          <TableCell className="text-left text-xs text-[#64748B] py-2 px-2 max-w-[120px] truncate" title={item?.purchase_team}>
                            {item?.purchase_team || "—"}
                          </TableCell>
                          <TableCell className="text-center text-nowrap text-xs text-[#475569] py-2 px-2">
                            {formatDate(item?.ack_date)}
                          </TableCell>
                          <TableCell className="text-center py-2 px-2">
                            <button
                              type="button"
                              onClick={() => router.push(`/view-vendor-po-details?poname=${encodeURIComponent(item?.name || "")}`)}
                              className="inline-flex w-8 h-8 rounded-lg bg-[#EEF2FF] items-center justify-center hover:bg-[#4F6BED] hover:text-white text-[#4F6BED] transition-colors mx-auto"
                              title="View PO"
                              aria-label="View purchase order"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-14">
                          <div className="flex flex-col items-center gap-2">
                            <FileText className="w-9 h-9 text-slate-300" />
                            <p className="text-sm font-medium text-[#64748B]">No purchase orders found</p>
                            <p className="text-xs text-[#94A3B8] max-w-sm">
                              Try another PO search or company filter.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              {tableData && tableData.length > 0 && (
                <div className="px-3 py-2 border-t border-slate-100 bg-[#FAFBFC]">
                  <Pagination
                    currentPage={currentPage}
                    record_per_page={record_per_page}
                    setCurrentPage={setCurrentPage}
                    total_event_list={total_event_list}
                  />
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

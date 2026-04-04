"use client"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import PopUp from "../molecules/PopUp";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../atoms/table";
import { Input } from "../atoms/input";
import { Button } from "../atoms/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../atoms/select";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import MultiSelect, { MultiValue } from "react-select";
import { DashboardPOTableData, TvendorRegistrationDropdown } from "@/src/types/types";
import Pagination from "../molecules/Pagination";
import { PoListViewRecord } from "@/src/types/po/po.types";
import { getPoListView } from "@/src/services/purchaseOrder/purchaseOrder.services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Eye, FileText, Loader2, Package, Search, UserRound } from "lucide-react";

interface POItemsTable {
  name: string,
  product_name: string,
  material_code: string,
  plant: string,
  schedule_date: string,
  quantity: string,
  early_delivery_date: string
  purchase_team_remarks: string,
  requested_for_earlydelivery: boolean;
  description: string;
  short_text: string,
}

interface dropdown {
  name: string,
  print_format_name: string
}

interface PODropdown {
  name: string,
  po_no: string,
  company_code: string,
}

interface Props {
  po_name?: string
  POTableData?: DashboardPOTableData["message"]
  companyDropdown: TvendorRegistrationDropdown["message"]["data"]["company_master"] | undefined
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

const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "—";
  const cleanDate = String(dateStr).trim().split(" ")[0];
  if (!cleanDate) return "—";
  const [y, m, d] = cleanDate.split("-");
  if (!y || !m || !d) return dateStr;
  return `${d}-${m}-${y}`;
};



const ViewPO = ({ po_name, companyDropdown }: Props) => {
  const [prDetails, setPRDetails] = useState<any>();
  const [isSuccessDialog, setIsSuccessDialog] = useState(false);

  const [poTableData,setPoTableData] = useState<PoListViewRecord[]>([]);

  const [PRNumber, setPRNumber] = useState<string | undefined>(po_name);
  const [POItemsTable, setPOItemsTable] = useState<POItemsTable[]>([]);
  const [isEarlyDeliveryDialog, setIsEarlyDeliveryDialog] = useState<boolean>(false);
  const [printFormatDropdown, setPrintFormatDropdown] = useState<dropdown[]>([])
  const [selectedPODropdown, setSelectedPODropdown] = useState<string>("");
  const [PONumberDropdown, setPONumberDropdown] = useState<PODropdown[]>([]);

  const [selectedCompany, setSelectedCompany] = useState<string>("_all");
  const [debouncedVendor, setDebouncedVendor] = useState("");
  const vendorDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const hasLoadedOnce = useRef(false);
  // const [isPrintFormat, setIPrintFormat] = useState<boolean>(false);
  const [isEmailDialog, setIsEmailDialog] = useState<boolean>(false);
  const email_to = useSearchParams()?.get("email_to");
  const [email, setEmail] = useState<any>({ to: email_to });
  const [date, setDate] = useState("");
  const [comments, setComments] = useState("");
  const [POFile, setPOFile] = useState<File | null>(null)
  const [vendorName, setVendorName] = useState<string>("");

  const [total_event_list, settotalEventList] = useState(0);
    const [record_per_page, setRecordPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);

  const [ccEmailsList, setCCEmailsList] = useState<{ value: string, label: string }[]>([]);

  useEffect(() => {
    if (po_name) {
      void handlePOChange(po_name);
      void fetchPurchaseEmailIds();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount + po_name from URL only
  }, [po_name]);


  // setEmail((prev:any)=>({...prev,to:email_to}));
  // const [sign,setSign] = useState();
  const router = useRouter();



  // const base64Image = await toBase64("/images/coronary_balloon_catheters.png");

  const fetchPurchaseEmailIds = async()=>{
    const response = await fetch(`${API_END_POINTS?.getPurchaseTeamEmailList}?po_no=${po_name}`,{
      method:"get",
    });
    const data = await response?.json();
    const emails = data?.map((item: any, index: any) => {
        const obj = {
          label: item,
          value: item
        }
        return obj;
      })
      setCCEmailsList(emails);
  } 

  const handleClose = () => {
    setIsEarlyDeliveryDialog(false);
    setIsEmailDialog(false);
    setDate("");
    setComments("");
    setEmail((prev: any) => ({ ...prev, cc: [] }));
  }



  const handleTableChange = (index: number, name: string, value: string | boolean) => {
    // const { name, value } = e.target;
    setPOItemsTable((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], [name]: value };
      }
      return updated;
    });
  }

  useEffect(() => {
    getPODropdown();
    if (po_name) {
      const button = document.getElementById("viewPrintBtn");
      if (button) {
        button?.click();
      }
    }
  }, [])


  useEffect(() => {
    if (vendorDebounceRef.current) clearTimeout(vendorDebounceRef.current);
    vendorDebounceRef.current = setTimeout(() => setDebouncedVendor(vendorName), 400);
    return () => {
      if (vendorDebounceRef.current) clearTimeout(vendorDebounceRef.current);
    };
  }, [vendorName]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedVendor, selectedCompany, PRNumber]);

  const fetchPoTable = useCallback(async () => {
    try {
      if (hasLoadedOnce.current) setIsFetching(true);
      const res = await getPoListView({
        search_term: debouncedVendor || PRNumber || "",
        company: selectedCompany === "_all" ? "" : selectedCompany,
        page_no: currentPage,
        page_size: record_per_page,
      });
      setPoTableData(res?.data || []);
      settotalEventList(res?.total_count || 0);
    } catch (err) {
      console.error("Error fetching PO table:", err);
    } finally {
      hasLoadedOnce.current = true;
      setIsInitialLoad(false);
      setIsFetching(false);
    }
  }, [currentPage, debouncedVendor, PRNumber, record_per_page, selectedCompany]);

  useEffect(() => {
    fetchPoTable();
  }, [fetchPoTable]);




  const getPODropdown = async () => {
    const url = API_END_POINTS?.getPONumberDropdown;
    const response: AxiosResponse = await requestWrapper({ url: url, method: 'GET' });
    if (response?.status == 200) {
      const raw = response?.data?.message?.total_po;
      setPONumberDropdown(Array.isArray(raw) ? raw : []);
    }
  }

  const poOptions = useMemo(
    () =>
      PONumberDropdown.map((po) => ({
        value: po.name,
        label: [po.po_no || po.name, po.company_code].filter(Boolean).join(" · ") || po.name,
      })),
    [PONumberDropdown]
  );

  const selectedPoOption = useMemo(() => {
    if (!PRNumber) return null;
    const found = poOptions.find((o) => o.value === PRNumber);
    return found ?? { value: PRNumber, label: PRNumber };
  }, [PRNumber, poOptions]);

  const handlePoItemsSubmit = async () => {
    const url = API_END_POINTS?.submitPOItems;
    const updatedData = { items: POItemsTable, po_name: PRNumber };
    const response: AxiosResponse = await requestWrapper({ url: url, method: "POST", data: { data: updatedData } });
    if (response?.status == 200) {
      alert("submitted successfully");
    }
  }


  const handleSubmit = async () => {
    if (!PRNumber) {
      alert("Please Select PO Number");
      return;
    }

    if (!email?.cc) {
      alert("please select at least 1 cc email");
      return;
    }
    if (!POFile) {
      alert("please add PO");
      return;
    }
    const sendPoEmailUrl = `${API_END_POINTS.sendPOEmailVendor}?po_name=${PRNumber}`;
    const formdata = new FormData();
    if (POFile) {
      formdata.append("attach", POFile)
    }
    formdata.append("to", JSON.stringify(email?.to))
    formdata.append("cc", JSON.stringify(email?.cc))
    const response: AxiosResponse = await requestWrapper({ url: sendPoEmailUrl, data: formdata, method: "POST" });
    if (response?.status === 200) {
      setIsSuccessDialog(true);
      handleClose();
    }
  };

  const handlePOChange = async (value: string) => {
    if (!value) {
      setPRNumber(undefined);
      setPRDetails(null);
      setCurrentPage(1);
      return;
    }
    setPRNumber(value);
    setCurrentPage(1);
    const response: AxiosResponse = await requestWrapper({ url: API_END_POINTS?.dataBasedOnPo, method: "GET", params: { po_number: value } });
    if (response?.status == 200) {
      setEmail((prev: any) => ({ ...prev, to: response?.data?.message?.vendor_emails?.office_email_primary }));
      console.log(response?.data?.message?.team_members?.all_team_user_ids, "this is cc emails")
      // const emailList = response?.data?.message?.team_members?.all_team_user_ids?.map((item: any, index: any) => {
      //   const obj = {
      //     label: item,
      //     value: item
      //   }
      //   return obj;
      // })
      // setCCEmailsList(emailList);
    }
  }

  const handleCcEmailChange = (value: MultiValue<{ value: string; label: string; }>) => {
    const emailList = value?.map((item) => (item?.value));
    setEmail((prev: any) => ({ ...prev, cc: emailList }));
  }

  return (
    <>
    <div className="p-4 max-w-[1600px] mx-auto space-y-4 text-sm">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#0F172A] tracking-tight">Purchase orders</h1>
          <p className="text-[13px] text-[#64748B] mt-0.5">Search, filter by company or vendor, then open PO details.</p>
        </div>
        {total_event_list > 0 && !isInitialLoad && (
          <Badge variant="outline" className="w-fit text-[11px] font-semibold border-slate-200 bg-white text-[#475569]">
            {total_event_list} result{total_event_list !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      <Card className="shadow-sm border-slate-200 overflow-hidden">
        <CardHeader className="py-3 px-4 border-b border-slate-100 bg-gradient-to-r from-[#F8FAFC] to-white">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4F6BED] to-[#7C93F5] flex items-center justify-center shadow-sm flex-shrink-0">
                <Package className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-sm font-bold text-[#0F172A] tracking-tight">PO list</CardTitle>
                <p className="text-[11px] text-[#94A3B8] mt-0.5 font-medium leading-none">Filters apply to the table below</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full xl:w-auto xl:min-w-0">
              <div className="flex-1 min-w-[200px] max-w-md">
                <label className="sr-only">Search PO</label>
                <div className="relative">
                  {/* <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8] pointer-events-none z-[1]" /> */}
                  <div className="pl-7">
                    <MultiSelect
                      className="text-sm"
                      classNamePrefix="view-po-po"
                      instanceId="po-search-select"
                      options={poOptions}
                      placeholder="Search PO number…"
                      isSearchable
                      isClearable
                      onChange={(selectedOption: { value: string } | null) => {
                        void handlePOChange(selectedOption?.value || "");
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
                  {/* <Building2 className="w-3.5 h-3.5 text-[#94A3B8] flex-shrink-0 hidden sm:block" /> */}
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
              <div className="w-full sm:w-[200px] flex-shrink-0">
                <label className="sr-only">Vendor name</label>
                <div className="relative">
                  <UserRound className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8] pointer-events-none" />
                  <input
                    placeholder="Vendor name…"
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-2 text-xs text-[#334155] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#4F6BED] focus:ring-2 focus:ring-[#4F6BED]/20"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                  />
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
                <Table className="table-fixed min-w-[960px] w-full">
                  <TableHeader>
                    <TableRow className="bg-[#F8FAFC] hover:bg-[#F8FAFC] border-b border-slate-200">
                      <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-9 px-2 w-11">Sr.</TableHead>
                      <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-9 px-2 text-nowrap">PO no.</TableHead>
                      <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-9 px-2 text-nowrap">PO date</TableHead>
                      <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-9 px-2 min-w-[7rem]">Vendor</TableHead>
                      <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-9 px-2">Company</TableHead>
                      <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-9 px-2">Status</TableHead>
                      <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-9 px-2 text-nowrap">Pur. group</TableHead>
                      <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-9 px-2 text-nowrap">Pur. team</TableHead>
                      <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-9 px-2 text-nowrap">Ack. date</TableHead>
                      <TableHead className="text-center text-[#64748B] font-semibold text-[10px] uppercase tracking-wider h-9 px-2 w-14">View</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {poTableData && poTableData.length > 0 ? (
                      poTableData.map((item, index) => (
                        <TableRow key={item.name ?? index} className="hover:bg-slate-50/80 border-b border-slate-100 transition-colors">
                          <TableCell className="text-center text-xs text-[#64748B] tabular-nums py-2.5 px-2">
                            {(currentPage - 1) * record_per_page + index + 1}
                          </TableCell>
                          <TableCell className="text-center text-xs font-semibold text-[#0F172A] py-2.5 px-2 min-w-0">
                            <span className="block truncate text-center" title={item?.name}>{item?.name}</span>
                          </TableCell>
                          <TableCell className="text-center text-xs text-[#475569] tabular-nums py-2.5 px-2 whitespace-nowrap">
                            {formatDate(item?.po_date)}
                          </TableCell>
                          <TableCell className="text-center text-xs text-[#64748B] py-2.5 px-2 min-w-0">
                            <span className="block truncate text-center" title={item?.supplier_name}>{item?.supplier_name || "—"}</span>
                          </TableCell>
                          <TableCell className="text-center text-xs text-[#64748B] py-2.5 px-2 min-w-0">
                            <span className="block truncate text-center" title={item?.company_code}>{item?.company_code}</span>
                          </TableCell>
                          <TableCell className="text-center py-2.5 px-2">
                            <Badge variant="outline" className={`text-[10px] font-semibold px-2 py-0.5 whitespace-nowrap ${statusColor(item?.status)}`}>
                              {item?.status || "—"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center text-xs text-[#64748B] py-2.5 px-2 min-w-0">
                            <span className="block truncate text-center" title={item?.purchase_group}>{item?.purchase_group || "—"}</span>
                          </TableCell>
                          <TableCell className="text-center text-xs text-[#64748B] py-2.5 px-2 min-w-0">
                            <span className="block truncate text-center" title={item?.purchase_team}>{item?.purchase_team || "—"}</span>
                          </TableCell>
                          <TableCell className="text-center text-xs text-[#475569] py-2.5 px-2 whitespace-nowrap tabular-nums">
                            {formatDate(item?.ack_date)}
                          </TableCell>
                          <TableCell className="text-center py-2.5 px-2">
                            <button
                              type="button"
                              onClick={() => router.push(`/view-po-details?poname=${encodeURIComponent(item.name)}`)}
                              className="inline-flex w-8 h-8 rounded-lg bg-[#EEF2FF] items-center justify-center hover:bg-[#4F6BED] hover:text-white text-[#4F6BED] transition-colors"
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
                            <p className="text-xs text-[#94A3B8]">Try different filters or search terms.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              {poTableData && poTableData.length > 0 && (
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

      {/* Early Delivery Button */}
      {/* {isPrintFormat &&
        <div className="flex justify-start text-left space-x-4">
        <Button onClick={() => { handleOpen() }} variant={"nextbtn"} size={"nextbtnsize"} className="py-2.5 transition">
            Early Delivery
            </Button>
          <Button variant={"nextbtn"} size={"nextbtnsize"} className="py-2.5 transition" onClick={() => { handleDownloadPDF() }}>Download</Button>
          
          </div>
          } */}
      {/* {isPrintFormat &&
        <Button variant={"nextbtn"} size={"nextbtnsize"} className="px-4 py-2.5 transition" onClick={() => { handleDownloadPDF() }}>Download</Button>
        } */}

      {/* PO Main Section */}
      {/* {isPrintFormat &&
        <POPrintFormat contentRef={contentRef} prDetails={prDetails} Heading={selectedPODropdown} />
        } */}

      {/* {isPrintFormat && Boolean(prDetails?.sent_to_vendor) &&
        <div className="flex justify-end items-center"><Button variant={"nextbtn"} size={"nextbtnsize"} className="px-4 py-2.5 transition" onClick={() => { setIsEmailDialog(true) }}>Send Email</Button></div>
        } */}

      {isEmailDialog &&
        <PopUp handleClose={handleClose} classname="md:max-h-[400px]" headerText="Send Email" isSubmit={true} Submitbutton={handleSubmit}>
          <div className="mb-2">
            <h1 className="text-[14px] font-normal text-[#626973] pb-2">
              To
            </h1>
            <Input onChange={(e) => { setEmail((prev: any) => ({ ...prev, to: e.target.value })); }} value={email?.to ?? ""} />
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-2">
              CC
            </h1>
            {/* <Input onChange={(e) => { setEmail((prev: any) => ({ ...prev, cc: e.target.value })) }} /> */}
            <MultiSelect
              onChange={(value) => handleCcEmailChange(value)}
              instanceId="vendor-type-multiselect"
              options={ccEmailsList}
              isMulti
              required
              className="text-[14px] text-black"
            // menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
            // styles={multiSelectStyles}
            />
          </div>
          <Input onChange={(e) => { setPOFile(e.target.files && e.target.files[0]) }} className="mt-4" type="file" />
        </PopUp>
      }

      {/* End of Print Format */}
      {isEarlyDeliveryDialog &&
        <PopUp classname="w-full md:max-w-[60vw] md:max-h-[60vh] h-full overflow-y-scroll" handleClose={handleClose} isSubmit={true} Submitbutton={handlePoItemsSubmit}>
          <h1 className="text-[16px] font-medium pb-3 pl-1">Purchase Order Items</h1>
          <div className="shadow- bg-[#f6f6f7] mb-4 p-4 rounded-2xl">
            <Table className=" max-h-40 overflow-y-scroll overflow-x-scroll">
              <TableHeader className="text-center">
                <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center text-nowrap">
                  <TableHead className="text-center">Select</TableHead>
                  <TableHead className="text-center">Product Name</TableHead>
                  <TableHead className="text-center">Material Code</TableHead>
                  <TableHead className="text-center">Material Description</TableHead>
                  <TableHead className="text-center">Plant</TableHead>
                  <TableHead className="text-center">Schedule Date</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-center">Early Delivery Date</TableHead>
                  <TableHead className="text-center">Remarks</TableHead>

                </TableRow>
              </TableHeader>
              <TableBody className="text-center">
                {POItemsTable?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className='text-center'><input type="checkbox" name="requested_for_earlydelivery" onChange={(e) => { handleTableChange(index, e.target.name, e.target.checked) }} checked={item?.requested_for_earlydelivery ?? ""} /></TableCell>
                    <TableCell className='text-center'>{item?.product_name}</TableCell>
                    <TableCell className='text-center text-nowrap'>{item?.material_code}</TableCell>
                    <TableCell className='text-center text-nowrap'>{item?.short_text}</TableCell>
                    <TableCell className='text-center'>{item?.plant}</TableCell>
                    <TableCell className='text-center'>{item?.schedule_date}</TableCell>
                    <TableCell className='text-center'>
                      <div className={`flex justify-center`}>
                        <Input type="number" name="quantity" onChange={(e) => { handleTableChange(index, e.target.name, e.target.value) }} value={item?.quantity ?? ""} className='w-16 disabled:opacity-100' />
                      </div>
                    </TableCell>
                    <TableCell className={`flex justify-center`}><Input type="date" name="early_delivery_date" onChange={(e) => { handleTableChange(index, e.target.name, e.target.value) }} value={item?.early_delivery_date ?? ""} className='w-36 disabled:opacity-100' /></TableCell>
                    <TableCell><div className={`flex justify-center`}> <Input name="purchase_team_remarks" onChange={(e) => { handleTableChange(index, e.target.name, e.target.value) }} value={item?.purchase_team_remarks ?? ""} className='w-24 disabled:opacity-100' /></div></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </PopUp>
      }

      {isSuccessDialog && (
        <PopUp
        handleClose={() => setIsSuccessDialog(false)}
        // headerText="Success"
        classname="md:max-w-[350px] text-center"
        >
          <div className="p-4 flex flex-col items-center justify-center space-y-4">
            <div className="text-green-600 text-lg font-semibold">
              ✅ Email Sent Successfully
            </div>
            <p className="text-gray-700 text-sm">
              Purchase Order has been emailed to the vendor.
            </p>
            <Button
              variant="nextbtn"
              size="nextbtnsize"
              onClick={() => {
                setIsSuccessDialog(false);
                router.push("/dashboard");
              }}
            >
              OK
            </Button>
          </div>
        </PopUp>
      )}

    </div>
</>
  );
};

export default ViewPO;

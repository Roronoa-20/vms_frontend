"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/atoms/table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/src/components/atoms/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "../atoms/input";
import { DashboardTableType, TvendorRegistrationDropdown } from "@/src/types/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import API_END_POINTS from "@/src/services/apiEndPoints";
import Pagination from "./Pagination";
import { useAuth } from "@/src/context/AuthContext";
import { Eye } from "lucide-react";
import { useAgingTimer } from "@/src/hooks/useAgingTimer";


type Props = {
  dashboardTableData: DashboardTableType["rejected_vendor_onboarding"],
  companyDropdown: TvendorRegistrationDropdown["message"]["data"]["company_master"]
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

const DashboardRejectedVendorsTable = ({ dashboardTableData, companyDropdown }: Props) => {
  console.log(dashboardTableData, 'this is rejected vendor list')
  console.log(Array.isArray(dashboardTableData), dashboardTableData)
  const [table, setTable] = useState<DashboardTableType["rejected_vendor_onboarding"]>(dashboardTableData);
  const [selectedCompany, setSelectedCompany] = useState<string>("")
  const [search, setSearch] = useState<string>("");
  const [total_event_list, settotalEventList] = useState(0);
  const [record_per_page, setRecordPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [remarks, setRemarks] = useState<string>("");
  const [openReasonDialog, setOpenReasonDialog] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const router = useRouter();

  const handleAmendClick = (vendorOnboarding: string) => {
    setSelectedVendor(vendorOnboarding);
    setRemarks("");
    setOpenDialog(true);
  };

  const handleReasonClick = (reason: string) => {
    setSelectedReason(reason);
    setOpenReasonDialog(true);
  };

  const user = Cookies?.get("user_id");
  console.log(user, "this is user");

  const debouncedSearchName = useDebounce(search, 300);

  useEffect(() => {
    fetchTable();
  }, [debouncedSearchName, selectedCompany, currentPage])


  const handlesearchname = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(value, "this is search name")
    setSearch(value);
  }

  const fetchTable = async () => {
    const dashboardRejectedVendorTableDataApi: AxiosResponse = await requestWrapper({
      url: `${API_END_POINTS?.dashboardRejectedVendorTableURL}?usr=${user}&company=${selectedCompany}&vendor_name=${search}&page_no=${currentPage}&page_length=${record_per_page}`,
      method: "GET",
    });
    console.log("dashboardRejectedVendorTableDataApi---->", dashboardRejectedVendorTableDataApi)
    if (dashboardRejectedVendorTableDataApi?.status == 200) {
      setTable(dashboardRejectedVendorTableDataApi?.data?.message?.rejected_vendor_onboarding);
      settotalEventList(dashboardRejectedVendorTableDataApi?.data?.message?.total_count);
      settotalEventList(dashboardRejectedVendorTableDataApi?.data?.message?.total_count);
      // setRecordPerPage(dashboardRejectedVendorTableDataApi?.data?.message?.rejected_vendor_onboarding?.length);
      setRecordPerPage(10)
    }
  };

  const handleSubmitAmend = async () => {
    if (!remarks.trim()) {
      alert("Remarks are mandatory before submitting.");
      return;
    }
    try {
      const res: AxiosResponse = await requestWrapper({
        url: API_END_POINTS.AmendAPI,
        method: "POST",
        data: {
          data: {
            vendor_onboarding: selectedVendor,
            remarks: remarks,
          }
        }
      });

      if (res?.status === 200) {
        console.log("Amend successful", res.data);
        setOpenDialog(false);
        fetchTable();
        router.refresh();
      }
    } catch (err) {
      console.error("Error in Amend API:", err);
    }
  };


  const AgingCell = ({ timeDiff }: { timeDiff?: string }) => {
    const aging = useAgingTimer(timeDiff || "");
    return (
      <div>
        {timeDiff ? aging : "--"}
      </div>
    );
  };

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
            Total Rejected Vendors
          </h1>
          <div className="flex gap-4">
            <Input placeholder="Search..." onChange={(e) => { handlesearchname(e) }} />
            <Select
              value={selectedCompany || "all"}
              onValueChange={(value) => setSelectedCompany(value === "all" ? "" : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All</SelectItem>
                  {companyDropdown?.map((item) => (
                    <SelectItem key={item.name} value={item.name}>
                      {item.description}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Table>
          <TableHeader className="text-center">
            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
              <TableHead className="text-center text-black">Sr. No.</TableHead>
              <TableHead className="text-center text-black">Ref No.</TableHead>
              <TableHead className="text-center text-black">Vendor Name</TableHead>
              <TableHead className="text-center text-black whitespace-nowrap">Company Code</TableHead>
              <TableHead className="text-center text-black">Status</TableHead>
              <TableHead className="text-center text-black whitespace-nowrap">Aging</TableHead>
              <TableHead className="text-center text-black">Rejected By Designation</TableHead>
              <TableHead className="text-center text-black whitespace-nowrap">Rejected By</TableHead>
              <TableHead className="text-center text-black whitespace-nowrap">View Rejection Reason</TableHead>
              <TableHead className="text-center text-black whitespace-nowrap">View Details</TableHead>
              <TableHead className="text-center text-black whitespace-nowrap">Amend Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-center">
            {Array.isArray(table) && table.length > 0 ? (
              table.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center font-medium">{(currentPage - 1) * record_per_page + index + 1}</TableCell>
                  <TableCell className="text-nowrap text-center">{item?.name}</TableCell>
                  <TableCell className="text-nowrap text-center">{item?.vendor_name}</TableCell>
                  <TableCell className="text-nowrap text-center">{item?.company_name}</TableCell>
                  <TableCell>
                    <div
                      className={`text-center px-2 py-3 rounded-xl ${item?.onboarding_form_status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : item?.onboarding_form_status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                        }`}
                    >
                      {item?.onboarding_form_status}
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap"><div className="px-2 py-3 rounded-[20px] bg-blue-200 text-orange-800 text-[14px] font-medium"> <AgingCell timeDiff={item?.time_diff} /></div></TableCell>
                  <TableCell
                    className="max-w-[180px] truncate whitespace-nowrap text-sm text-center"
                    title={item?.rejected_by_designation ?? ""}
                  >
                    {(() => {
                      const designation = item?.rejected_by_designation;
                      if (!designation) return "";
                      const parts = designation.split(/by\s+/i);
                      return parts.length > 1 ? parts.pop()?.trim() : designation;
                    })()}
                  </TableCell>
                  <TableCell className="text-center whitespace-nowrap">{item?.rejected_by_full_name}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReasonClick(item?.reason_for_rejection || "No reason provided")}
                    >
                      <Eye className="!h-6 !w-6 text-black text-center" />
                    </Button>
                  </TableCell>
                  <TableCell className="text-center"><Link href={`/view-onboarding-details?tabtype=Company%20Detail&vendor_onboarding=${item?.name}&refno=${item?.ref_no}`}><Button className="bg-[#5291CD] hover:bg-white hover:text-black rounded-[14px]">View</Button></Link></TableCell>
                  <TableCell className="text-center"><Button onClick={() => handleAmendClick(item?.name)} className="bg-[#5291CD] hover:bg-white hover:text-black rounded-[14px]">Amend</Button></TableCell>
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
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Amend Vendor</DialogTitle>
            </DialogHeader>

            <div className="py-4">
              <Textarea
                placeholder="Enter remarks..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitAmend}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={openReasonDialog} onOpenChange={setOpenReasonDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rejection Reason</DialogTitle>
            </DialogHeader>
            <div className="py-4 text-black">
              <Textarea
                value={selectedReason}
                disabled
                className="resize-none cursor-not-allowed text-black bg-white opacity-100"
              />
            </div>
            <DialogFooter>
              <Button onClick={() => setOpenReasonDialog(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
      <Pagination currentPage={currentPage} record_per_page={record_per_page} setCurrentPage={setCurrentPage} total_event_list={total_event_list} />
    </>
  );
};

export default DashboardRejectedVendorsTable;

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

const DashboardAccountsRejectedVendorsTable = ({ dashboardTableData, companyDropdown }: Props) => {
  console.log(dashboardTableData, 'this is rejected vendor list')
  console.log(Array.isArray(dashboardTableData), dashboardTableData)
  const [table, setTable] = useState<DashboardTableType["rejected_vendor_onboarding"]>(dashboardTableData);
  const [selectedCompany, setSelectedCompany] = useState<string>("")
  const [search, setSearch] = useState<string>("");
  const [total_event_list, settotalEventList] = useState(0);
  const [record_per_page, setRecordPerPage] = useState<number>(5);
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
      url: `${API_END_POINTS?.dashboardRejectedVendorsAccounts}?usr=${user}&company=${selectedCompany}&vendor_name=${search}&page_no=${currentPage}`,
      method: "GET",
    });
    console.log("dashboardRejectedVendorTableDataApi---->", dashboardRejectedVendorTableDataApi)
    if (dashboardRejectedVendorTableDataApi?.status == 200) {
      setTable(dashboardRejectedVendorTableDataApi?.data?.message?.rejected_vendor_onboarding);
      settotalEventList(dashboardRejectedVendorTableDataApi?.data?.message?.total_count);
      settotalEventList(dashboardRejectedVendorTableDataApi?.data?.message?.total_count);
      // setRecordPerPage(dashboardRejectedVendorTableDataApi?.data?.message?.rejected_vendor_onboarding?.length);
      setRecordPerPage(5)
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


  console.log(table, "this is table");

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
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader className="text-center">
            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
              <TableHead>Sr. No.</TableHead>
              <TableHead>Ref No.</TableHead>
              <TableHead>Vendor Name</TableHead>
              <TableHead className="text-center">Company Name</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Rejected By Designation</TableHead>
              {/* <TableHead className="text-center">Purchase Team</TableHead> */}
              {/* <TableHead className="text-center">Purchase Head</TableHead> */}
              {/* <TableHead className="text-center">Account Team</TableHead> */}
              <TableHead className="text-center">Rejected By</TableHead>
              <TableHead className="text-center">Rejection Reason</TableHead>
              <TableHead className="text-center">View Details</TableHead>
              <TableHead className="text-center">Amend Email</TableHead>
              {/* <TableHead className="text-center">QMS Form</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody className="text-center">
            {Array.isArray(table) && table.length > 0 ? (
              table.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{(currentPage - 1) * record_per_page + index + 1}</TableCell>
                  <TableCell className="text-nowrap">{item?.name}</TableCell>
                  <TableCell className="text-nowrap">{item?.vendor_name}</TableCell>
                  <TableCell className="text-nowrap">{item?.company_name}</TableCell>
                  <TableCell>
                    <div
                      className={`px-2 py-3 rounded-xl ${item?.onboarding_form_status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : item?.onboarding_form_status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                        }`}
                    >
                      {item?.onboarding_form_status}
                    </div>
                  </TableCell>
                  {/* <TableCell>{item?.rejected_by_designation}</TableCell> */}
                  <TableCell
                    className="max-w-[180px] truncate whitespace-nowrap text-sm"
                    title={item?.rejected_by_designation ?? ""}
                  >
                    {(() => {
                      const designation = item?.rejected_by_designation;
                      if (!designation) return "";
                      const parts = designation.split(/by\s+/i);
                      return parts.length > 1 ? parts.pop()?.trim() : designation;
                    })()}
                  </TableCell>
                  {/* <TableCell>{item?.purchase_t_approval}</TableCell> */}
                  {/* <TableCell>{item?.purchase_h_approval}</TableCell> */}
                  {/* <TableCell>{item?.accounts_t_approval}</TableCell> */}
                  <TableCell>{item?.rejected_by}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReasonClick(item?.reason_for_rejection || "No reason provided")}
                    >
                      <Eye className="h-8 w-8 text-black" />
                    </Button>
                  </TableCell>
                  <TableCell><Link href={`/view-onboarding-details?tabtype=Company%20Detail&vendor_onboarding=${item?.name}&refno=${item?.ref_no}`}><Button className="bg-[#5291CD] hover:bg-white hover:text-black rounded-[14px]">View</Button></Link></TableCell>
                  <TableCell><Button onClick={() => handleAmendClick(item?.name)} className="bg-[#5291CD] hover:bg-white hover:text-black rounded-[14px]">Amend</Button></TableCell>
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

export default DashboardAccountsRejectedVendorsTable;

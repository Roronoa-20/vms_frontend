"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "../atoms/input";
import { DashboardTableType, PurchaseRequisition, RFQTable, TPRInquiryTable } from "@/src/types/types";
import { Button } from "@/components/ui/button";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import API_END_POINTS from "@/src/services/apiEndPoints";
import Pagination from "./Pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Mail, CheckCircle } from "lucide-react";


type Props = {
  dashboardTableData?: DashboardTableType["sapErrorDashboardData"]
  companyDropdown: { name: string, description: string }[]
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

const DashboardSAPErrorTable = ({ dashboardTableData, companyDropdown }: Props) => {
  console.log("SAP ERROR TABLE___>", dashboardTableData);
  const [total_event_list, settotalEventList] = useState(0);
  const [record_per_page, setRecordPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [table, setTable] = useState<DashboardTableType["sapErrorDashboardData"]["sap_error_vendor_onboarding"]>(dashboardTableData?.sap_error_vendor_onboarding || []);
  const [searchVendor, setSearchVendor] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [remarks, setRemark] = useState("");
  const debouncedSearchName = useDebounce(searchVendor, 300);
  const router = useRouter();


  useEffect(() => {
    fetchTable();
  }, [debouncedSearchName, currentPage, selectedCompany])

  const handlesearchname = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {name, value } = e.target;
    console.log(value, "this is search name")
    setSearchVendor(value);
  };

  const fetchTable = async () => {
    const dashboardTableDataApi: AxiosResponse = await requestWrapper({
      url: `${API_END_POINTS?.sapApiDashboardDetails}?page_no=${currentPage}&company=${selectedCompany}&vendor_name=${debouncedSearchName}`,
      method: "GET",
    });
    if (dashboardTableDataApi?.status == 200) {
      setTable(dashboardTableDataApi?.data?.message?.sap_error_vendor_onboarding);
      console.log(dashboardTableDataApi?.data?.message?.sap_error_vendor_onboarding, "this is data")
      settotalEventList(dashboardTableDataApi?.data?.message?.total_count);
      // setRecordPerPage(dashboardPRTableDataApi?.data?.message?.rejected_vendor_onboarding?.length);
      setRecordPerPage(5)
    }
  };


  const handleEmailSent = async () => {
    if (!selectedId) return;

    const response: AxiosResponse = await requestWrapper({
      url: API_END_POINTS?.sapErrorSendEmail,
      method: "POST",
      params: { doctype: "Vendor Onboarding", docname: selectedId, remarks },
    });

    if (response?.status == 200) {
      alert("Email Sent Successfully to IT Team!!!")
      setTable(prev =>
        prev.map(item =>
          item.name === selectedId
            ? { ...item, sap_error_mail_sent: 1 }
            : item
        )
      );
      setOpenDialog(false);
      setRemark("");
      setSelectedId(null);
    } else {
      alert("failed to send email");
    }
  };

  const handleView = async (refno: string, vendor_Onboarding: string) => {
    router.push(`/view-onboarding-details?tabtype=Company%20Detail&vendor_onboarding=${vendor_Onboarding}&refno=${refno}`)
  }

  return (
    <>

      <div className="shadow- bg-[#f6f6f7] p-4 rounded-2xl">
        <div className="flex w-full justify-between pb-4">
          <h1 className="text-[20px] text-[#03111F] font-semibold">
            SAP Error Logs
          </h1>
          <div className="flex gap-4">
            <Input placeholder="Search..." value={searchVendor} onChange={(e) => { handlesearchname(e) }} />
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
        <div className="overflow-y-scroll max-h-[55vh]">
          <Table className="">
            <TableHeader className="text-center">
              <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
                <TableHead className="text-center text-black">Sr No.</TableHead>
                <TableHead className="text-center text-black">Ref No.</TableHead>
                <TableHead className="text-center text-black">Vendor Name</TableHead>
                <TableHead className="text-center text-black">Company</TableHead>
                <TableHead className="text-center whitespace-nowrap text-black">Register By</TableHead>
                <TableHead className="text-center text-black">SAP Error Message</TableHead>
                <TableHead className={`text-center text-black`}>Action</TableHead>
                <TableHead className="text-center text-black">View Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-center">
              {table.length > 0 ? (
                table?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-center">{index + 1}</TableCell>
                    <TableCell className="text-nowrap text-center">{item?.name}</TableCell>
                    <TableCell className="text-nowrap text-center">{item?.vendor_name}</TableCell>
                    <TableCell className="text-nowrap text-center">{item?.company_name}</TableCell>
                    <TableCell className="text-nowrap text-center">{item?.registered_by_full_name}</TableCell>
                    <TableCell className="text-nowrap text-center">{item?.sap_error_message}</TableCell>
                    <TableCell className="text-nowrap text-center">
                      {item?.sap_error_mail_sent === 1 ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <CheckCircle className="text-green-600 w-6 h-6 mx-auto" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Email Sent to IT Team</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Mail
                                className="text-blue-600 w-6 h-6 mx-auto cursor-pointer hover:text-blue-800"
                                onClick={() => {
                                  setSelectedId(item?.name);
                                  setOpenDialog(true);
                                }}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Send Email</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </TableCell>
                    <TableCell><Button onClick={() => { item?.form_fully_submitted_by_vendor == 1 ? handleView(item?.ref_no, item?.name) : alert("Vendor Form is not fully subitted") }} variant={"outline"}>View</Button></TableCell>
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
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Remark before sending</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Write your remark here..."
            value={remarks}
            onChange={e => setRemark(e.target.value)}
          />
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEmailSent} disabled={!remarks.trim()}>
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Pagination currentPage={currentPage} record_per_page={record_per_page} setCurrentPage={setCurrentPage} total_event_list={total_event_list} />
    </>
  );
};

export default DashboardSAPErrorTable;

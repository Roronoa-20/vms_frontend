"use client"
import React, { useEffect, useState } from "react";
import POPrintFormat from "../molecules/POPrintFormat";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import PopUp from "../molecules/PopUp";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../atoms/table";
import { Input } from "../atoms/input";
import { Button } from "../atoms/button";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../atoms/select";
import PODialog from '@/src/components/molecules/PODialog';


interface POItemsTable {
  name: string,
  product_name: string,
  material_code: string,
  plant: string,
  schedule_date: string,
  quantity: string,
  early_delivery_date: string
  purchase_team_remarks: string,
  requested_for_earlydelivery: boolean,
  vendor_remarks: string,
  rejected_by_vendor: boolean,
  approved_by_vendor: boolean
}

interface PODropdown {
  name: string,
  po_no: string,
  company_code: string
}

interface Props {
  po_name?: string
  dropdown: any
}

interface PRDetails {
  approved_from_vendor?: number;
  [key: string]: any;
}

const ViewVendorPO = ({ po_name, dropdown }: Props) => {
  const router = useRouter();
  const [prDetails, setPRDetails] = useState<PRDetails | PRDetails[] | null>(null);
  const [PRNumber, setPRNumber] = useState<string | undefined>(po_name);
  const [POItemsTable, setPOItemsTable] = useState<POItemsTable[]>([]);
  const [isEarlyDeliveryDialog, setIsEarlyDeliveryDialog] = useState<boolean>(false);
  const [PONumberDropdown, setPONumberDropdown] = useState<PODropdown[]>([]);
  const [isPrintFormat, setIPrintFormat] = useState<boolean>(false);
  const [status, setStatus] = useState<"approve" | "reject" | "">("");
  const [comments, setComments] = useState("");
  const [isDialog, setIsDialog] = useState(false);
  const [date, setDate] = useState("");
  const [poNumber, setPONumber] = useState("");

  const getPODetails = async () => {
    if (!PRNumber) {
      alert("Please Select PO Number");
      return;
    }
    const url = `${API_END_POINTS?.getPrintFormatData}?po_name=${PRNumber}`;
    const response: AxiosResponse = await requestWrapper({ url: url, method: "GET" })
    if (response?.status == 200) {
      // console.log(response?.data?.message,"this is response")
      setPRDetails(response?.data?.message?.data);
    }
    setIPrintFormat(true)
  }



  const handleClose = () => {
    setIsEarlyDeliveryDialog(false);
  }

  useEffect(() => {
    if (po_name) {
      const button = document.getElementById("viewPrintBtn");
      if (button) {
        button.click();
      }
    }
  }, [])


  const handleOpen = () => {
    fetchPOItems();
    setIsEarlyDeliveryDialog(true);
  }


  const fetchPOItems = async () => {
    const url = `${API_END_POINTS?.POItemsTable}?po_name=${PRNumber}`;
    const response: AxiosResponse = await requestWrapper({ url: url, method: "GET" });
    if (response?.status == 200) {
      setPOItemsTable(response?.data?.message?.items)
    }
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


  const handlePoItemsSubmit = async () => {
    const url = API_END_POINTS?.POItemsApproval;
    const updatedData = { items: POItemsTable, po_name: PRNumber };
    const response: AxiosResponse = await requestWrapper({ url: url, method: "POST", data: { data: updatedData } });
    if (response?.status == 200) {
      alert("submitted successfully");
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

  const handleBack = () => {
    setIsDialog(false);
    setDate("");
    setComments("");
  };

  const approvedFromVendor =
    Array.isArray(prDetails)
      ? prDetails[0]?.approved_from_vendor
      : prDetails?.approved_from_vendor;


  // const getPODropdown = async()=>{
  //   const url = API_END_POINTS?.getPONumberDropdown;
  //   const response:AxiosResponse = await requestWrapper({url:url,method:'GET'});
  //   if(response?.status == 200){
  //     // console.log(response?.data?.message?.data,"this is dropdown");
  //     setPONumberDropdown(response?.data?.message?.total_po);
  //     console.log(response?.data?.message?.total_po);
  //   }
  // }
  console.log(prDetails, "this is pr details")

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 space-y-6 text-sm text-black font-sans m-5">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-md border border-gray-300">
        {/* <input
        onChange={(e)=>{setPRNumber(e.target.value)}}
          type="text"
          className="w-full md:w-1/2 border border-gray-300 rounded px-4 py-2 focus:outline-none hover:border-blue-700 transition"
        /> */}
        <Select onValueChange={(value) => { setPRNumber(value) }} value={PRNumber ?? ""}>
          <SelectTrigger className="w-60">
            <SelectValue placeholder="Select PO Number" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {
                dropdown?.map((item: any, index: any) => (
                  <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                ))
              }
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex gap-2 md:gap-4">
          <Button id="viewPrintBtn" onClick={() => { getPODetails() }} variant={"nextbtn"} size={"nextbtnsize"} className="py-2 transition text-nowrap rounded-[16px]">
            View PO Details
          </Button>
          <Button onClick={() => { router.push(`/view-po-line-items?po_name=${PRNumber}`) }} variant={"nextbtn"} size={"nextbtnsize"} className="py-2 transition text-nowrap rounded-[16px]">
            View All Changed PO Details
          </Button>
        </div>
      </div>

      {/* Early Delivery Button */}
      {/* <div className="text-left">
        <button onClick={()=>{handleOpen()}} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Early Delivery
        </button>
      </div> */}

      {/* PO Main Section */}
      {
        isPrintFormat &&
        <POPrintFormat prDetails={prDetails} />
      }
      {/* End of Print Format */}

      {
        isEarlyDeliveryDialog &&
        <PopUp classname="w-full md:max-w-[60vw] md:max-h-[60vh] h-full overflow-y-scroll" handleClose={handleClose}>
          <h1 className="pl-5">Purchase Inquiry Items</h1>
          <div className="shadow- bg-[#f6f6f7] mb-4 p-4 rounded-2xl">
            <Table className=" max-h-40 overflow-y-scroll overflow-x-scroll">
              <TableHeader className="text-center">
                <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center text-nowrap">
                  <TableHead className="text-center">Product Name</TableHead>
                  <TableHead className="text-center">Material Code</TableHead>
                  <TableHead className="text-center">Plant</TableHead>
                  <TableHead className="text-center">Schedule Date</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-center">Early Delivery Date</TableHead>
                  <TableHead className="text-center">Remarks</TableHead>
                  <TableHead className="text-center">Approved</TableHead>
                  <TableHead className="text-center">Rejected</TableHead>
                  <TableHead className="text-center">Vendor Remarks</TableHead>

                </TableRow>
              </TableHeader>
              <TableBody className="text-center">
                {POItemsTable?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item?.product_name}</TableCell>
                    <TableCell className='text-center'>{item?.material_code}</TableCell>
                    <TableCell>{item?.plant}</TableCell>
                    <TableCell>{item?.schedule_date}</TableCell>
                    <TableCell>{item?.quantity}</TableCell>
                    <TableCell className={`flex justify-center`}>{item?.early_delivery_date}</TableCell>
                    <TableCell>{item?.purchase_team_remarks}</TableCell>
                    {/* <TableCell>
                  <div className={`flex justify-center gap-2`}>
                    <div className="flex flex-col gap-2 w-3">
                  <Input  type="radio" name="early_delivery_date" onChange={(e)=>{handleTableChange(index,e.target.name,e.target.value)}} value={item?.early_delivery_date ?? ""}  className=' disabled:opacity-100' />
                  <h1>approved</h1>
                    </div>
                    <div className="flex flex-col gap-2 w-3">
                  <Input  type="radio" name="early_delivery_date" onChange={(e)=>{handleTableChange(index,e.target.name,e.target.value)}} value={item?.early_delivery_date ?? ""}  className=' disabled:opacity-100' />
                  <h1>rejected</h1>
                    </div>
                  </div>
                  </TableCell> */}
                    <TableCell>
                      <input
                        className="w-4"
                        type="radio"
                        name={`vendor_response_${index}`}
                        checked={item.approved_by_vendor}
                        onChange={() => {
                          handleTableChange(index, "approved_by_vendor", true);
                          handleTableChange(index, "rejected_by_vendor", false);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        className="w-4"
                        type="radio"
                        name={`vendor_response_${index}`}
                        checked={item.rejected_by_vendor}
                        onChange={() => {
                          handleTableChange(index, "approved_by_vendor", false);
                          handleTableChange(index, "rejected_by_vendor", true);
                        }}
                      />
                    </TableCell>
                    <TableCell><div className={`flex justify-center`}> <Input name="vendor_remarks" onChange={(e) => { handleTableChange(index, e.target.name, e.target.value) }} value={item?.vendor_remarks ?? ""} className=' w-36 disabled:opacity-100' /></div></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button onClick={() => { handlePoItemsSubmit() }}>Submit</Button>
        </PopUp>
      }
      {(approvedFromVendor === 1) && isPrintFormat &&
        <div className="flex gap-2 md:gap-4">
          <Button
            variant={"nextbtn"}
            size={"nextbtnsize"}
            className="py-2 hover:bg-white hover:text-black border border-transparent hover:border-[#5291CD] rounded-[14px]"
            onClick={() => { setStatus("approve"); setIsDialog((prev) => !prev); setPONumber(PRNumber ?? ""); }}>
            Approve
          </Button>
          <Button
            variant={"backbtn"}
            size={"backbtnsize"}
            className="py-2 hover:bg-[#5291CD] hover:text-white hover:border-[#5291CD] rounded-[14px]"
            onClick={() => { setStatus("reject"); setIsDialog((prev) => !prev); setPONumber(PRNumber ?? ""); }}>
            Reject
          </Button>
        </div>
      }
      {isDialog &&
        <div className="absolute z-50 flex pt-10 items-center justify-center bg-black bg-opacity-50 inset-0">
          <PODialog Submitbutton={handleApproval} handleClose={handleBack} handleComment={setComments} handleDate={setDate} status={status} />
        </div>
      }
    </div>
  );
};

export default ViewVendorPO;

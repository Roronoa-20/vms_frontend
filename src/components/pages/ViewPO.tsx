"use client"
import React, { useEffect, useRef, useState } from "react";
import POPrintFormat from "../molecules/POPrintFormat";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import PopUp from "../molecules/PopUp";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../atoms/table";
import { Input } from "../atoms/input";
import { Button } from "../atoms/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../atoms/select";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import MultiSelect, { MultiValue } from "react-select";
import { DashboardPOTableData, TvendorRegistrationDropdown } from "@/src/types/types";
import Pagination from "../molecules/Pagination";
import page from "@/src/app/maintainance/page";

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
  POTableData: DashboardPOTableData["message"];
  companyDropdown : TvendorRegistrationDropdown["message"]["data"]["company_master"]
}



const ViewPO = ({ po_name,POTableData,companyDropdown }: Props) => {
  const [prDetails, setPRDetails] = useState<any>();
  const [isSuccessDialog, setIsSuccessDialog] = useState(false);

  const [poTableData,setPoTableData] = useState<DashboardPOTableData["message"]>(POTableData);

  const [PRNumber, setPRNumber] = useState<string | undefined>(po_name);
  const [POItemsTable, setPOItemsTable] = useState<POItemsTable[]>([]);
  const [isEarlyDeliveryDialog, setIsEarlyDeliveryDialog] = useState<boolean>(false);
  const [printFormatDropdown, setPrintFormatDropdown] = useState<dropdown[]>([])
  const [selectedPODropdown, setSelectedPODropdown] = useState<string>("");
  const [PONumberDropdown, setPONumberDropdown] = useState<PODropdown[]>([]);

  const [selectedCompany, setSelectedCompany] = useState<string>("");
  // const [isPrintFormat, setIPrintFormat] = useState<boolean>(false);
  const [isEmailDialog, setIsEmailDialog] = useState<boolean>(false);
  const email_to = useSearchParams()?.get("email_to");
  const [email, setEmail] = useState<any>({ to: email_to });
  const [date, setDate] = useState("");
  const [comments, setComments] = useState("");
  const [POFile, setPOFile] = useState<File | null>(null)
  const [vendorName, setVendorName] = useState<string>("");

  const [total_event_list, settotalEventList] = useState(poTableData?.total_count);
    const [record_per_page, setRecordPerPage] = useState<number>(5);
    const [currentPage, setCurrentPage] = useState<number>(1);

  const [ccEmailsList, setCCEmailsList] = useState<{ value: string, label: string }[]>([]);

  useEffect(() => {
    if (po_name) {
      handlePOChange(po_name);
    }
  }, [])


  // setEmail((prev:any)=>({...prev,to:email_to}));
  // const [sign,setSign] = useState();
  const router = useRouter();



  // const base64Image = await toBase64("/images/coronary_balloon_catheters.png");

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
    if(currentPage || PRNumber || selectedCompany || vendorName){
      fetchPoTable();
    }
  },[currentPage,PRNumber,selectedCompany,vendorName]);

  const fetchPoTable = async()=>{
    
      const dashboardPOTableDataApi: AxiosResponse = await requestWrapper({
    url: `${API_END_POINTS?.poTable}`,
    method: "GET",
    params:{
      page_no:currentPage,
      vendor_name:vendorName,
      po_number:PRNumber,
      company:selectedCompany
    }
  });

  const dashboardPOTableData: DashboardPOTableData["message"] =
    dashboardPOTableDataApi?.status == 200 ? dashboardPOTableDataApi?.data?.message : "";

    setPoTableData(dashboardPOTableData);
    settotalEventList(dashboardPOTableData?.total_count || 0);
  }




  const getPODropdown = async () => {
    const url = API_END_POINTS?.getPONumberDropdown;
    const response: AxiosResponse = await requestWrapper({ url: url, method: 'GET' });
    if (response?.status == 200) {
      // console.log(response?.data?.message?.data,"this is dropdown");
      setPONumberDropdown(response?.data?.message?.total_po);
    }
  }

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
      setPRNumber("");
      // setIPrintFormat(false);
      setPRDetails(null);
      return;
    }
    setPRNumber(value);
    const response: AxiosResponse = await requestWrapper({ url: API_END_POINTS?.dataBasedOnPo, method: "GET", params: { po_number: value } });
    if (response?.status == 200) {
      setEmail((prev: any) => ({ ...prev, to: response?.data?.message?.vendor_emails?.office_email_primary }));
      console.log(response?.data?.message?.team_members?.all_team_user_ids, "this is cc emails")
      const emailList = response?.data?.message?.team_members?.all_team_user_ids?.map((item: any, index: any) => {
        const obj = {
          label: item,
          value: item
        }
        return obj;
      })
      setCCEmailsList(emailList);
    }
  }

  const handleCcEmailChange = (value: MultiValue<{ value: string; label: string; }>) => {
    const emailList = value?.map((item) => (item?.value));
    setEmail((prev: any) => ({ ...prev, cc: emailList }));
  }

  return (
    <>
    <div className=" bg-[#f8fafc] space-y-6 text-sm text-black font-sans m-5">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-md border border-gray-300">
        <div className="flex gap-4">

        <MultiSelect
          className="w-60 text-sm"
          instanceId="po-search-select"
          options={PONumberDropdown.map(po => ({
            value: po.name,
            label: `${po.name} - ${po.company_code || ""}`
          }))}
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

        {/* <div className="flex justify-end gap-5 w-full"> */}
          {/* <Select onValueChange={(value) => { setSelectedPODropdown(value) }}>
            <SelectTrigger className="w-60">
              <SelectValue placeholder="Select Print Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  printFormatDropdown?.map((item, index) => (
                    <SelectItem key={index} value={item?.name}>{item?.print_format_name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select> */}

            <div>
            <Input placeholder="Vendor Name" onChange={(e) => { setVendorName(e.target.value) }} value={vendorName} />
            </div>

                  </div>

                <div className="flex gap-4">
          {/* <Button id="viewPrintBtn" onClick={() => { getPODetails(); }} variant={"nextbtn"} size={"nextbtnsize"} className="px-5 py-2 transition text-nowrap">
            View PO Details
          </Button> */}
          <Button onClick={() => { router.push(`/view-all-po-changes`) }} variant={"nextbtn"} size={"nextbtnsize"} className="px-5 py-2 transition text-nowrap">
            View All Changed PO Details
          </Button>
          <Button onClick={() => { router.push(`/view-invalid-po`) }} variant={"nextbtn"} size={"nextbtnsize"} className="px-5 py-2 transition text-nowrap">
            View Invalid PO
          </Button>
                </div>
        </div>
      {/* </div> */}

                <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader className="text-center">
            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
              <TableHead className="text-center text-black">Sr No.</TableHead>
              <TableHead className="text-center text-black">PO No</TableHead>
              <TableHead className="text-center text-black text-nowrap">PO Date</TableHead>
              <TableHead className="text-center text-black">Vendor Name</TableHead>
              <TableHead className="text-center text-black">company</TableHead>
              <TableHead className="text-center text-black text-nowrap">View PO</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-center text-black">
            {poTableData ? (
              poTableData?.total_po?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center">{(currentPage - 1) * record_per_page + index + 1}</TableCell>
                  <TableCell className="text-center">{item?.po_no}</TableCell>
                  <TableCell className="text-center text-nowrap">{item?.po_date}</TableCell>
                  <TableCell className="text-center text-nowrap">{item?.supplier_name ? item.supplier_name : "-"}</TableCell>
                   <TableCell className="text-center text-nowrap">{item?.company_code}</TableCell>
                  <TableCell>
                    <Button
                      className={`bg-[#5291CD] hover:bg-white hover:text-black hover:border border-[#5291CD] rounded-[14px] `}
                      onClick={() => router.push(`/view-po-details?poname=${item?.po_number}`)}
                    >
                      View
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
<Pagination currentPage={currentPage} record_per_page={record_per_page} setCurrentPage={setCurrentPage} total_event_list={total_event_list} />
</>
  );
};

export default ViewPO;

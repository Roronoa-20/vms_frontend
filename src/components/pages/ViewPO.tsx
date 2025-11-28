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

interface POItemsTable {
  name: string,
  product_name: string,
  material_code: string,
  plant: string,
  schedule_date: string,
  quantity: string,
  early_delivery_date: string
  purchase_team_remarks: string,
  requested_for_earlydelivery: boolean
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
}



const ViewPO = ({ po_name }: Props) => {
  const [prDetails, setPRDetails] = useState<any>();
  const [isSuccessDialog, setIsSuccessDialog] = useState(false);

  const [PRNumber, setPRNumber] = useState<string | undefined>(po_name);
  const [POItemsTable, setPOItemsTable] = useState<POItemsTable[]>([]);
  const [isEarlyDeliveryDialog, setIsEarlyDeliveryDialog] = useState<boolean>(false);
  const [printFormatDropdown, setPrintFormatDropdown] = useState<dropdown[]>([])
  const [selectedPODropdown, setSelectedPODropdown] = useState<string>("");
  const [PONumberDropdown, setPONumberDropdown] = useState<PODropdown[]>([]);
  const [isPrintFormat, setIPrintFormat] = useState<boolean>(false);
  const [isEmailDialog, setIsEmailDialog] = useState<boolean>(false);
  const email_to = useSearchParams()?.get("email_to");
  const [email, setEmail] = useState<any>({ to: email_to });
  const [date, setDate] = useState("");
  const [comments, setComments] = useState("");
  const [POFile, setPOFile] = useState<File | null>(null)

  const [ccEmailsList, setCCEmailsList] = useState<{ value: string, label: string }[]>([]);

  useEffect(() => {
    if (po_name) {
      handlePOChange(po_name);
    }
  }, [])


  // setEmail((prev:any)=>({...prev,to:email_to}));
  // const [sign,setSign] = useState();
  const router = useRouter();
  const getPODetails = async () => {
    if (!PRNumber) {
      alert("Please Select PO Number");
      return;
    }
    const url = `${API_END_POINTS?.getPrintFormatData}?po_name=${PRNumber}&po_format_name=${selectedPODropdown}`;
    const response: AxiosResponse = await requestWrapper({ url: url, method: "GET" })
    if (response?.status == 200) {
      // console.log(response?.data?.message,"this is response")
      setPRDetails(response?.data?.message?.data);
      setIPrintFormat(true);
    }
  }
  const contentRef = useRef<HTMLDivElement>(null);


  const handleDownloadPDF = async () => {
    // if (!imageLoaded || !pdfRef.current) {
    //   alert("Image not loaded yet.");
    //   return;
    // }

    if (!contentRef || contentRef.current == null) return;

    const canvas = await html2canvas(contentRef.current, {
      useCORS: false,
      scale: 2,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("report.pdf");
  };


  // const base64Image = await toBase64("/images/coronary_balloon_catheters.png");




  const handleClose = () => {
    setIsEarlyDeliveryDialog(false);
    setIsEmailDialog(false);
    setDate("");
    setComments("");
    setEmail((prev: any) => ({ ...prev, cc: [] }));
  }

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

  useEffect(() => {
    getDropdown();
    getPODropdown();
    if (po_name) {
      const button = document.getElementById("viewPrintBtn");
      if (button) {
        button?.click();
      }
    }
  }, [])

  useEffect(()=>{
    
  },[selectedPODropdown])

  const getPODropdown = async () => {
    const url = API_END_POINTS?.getPONumberDropdown;
    const response: AxiosResponse = await requestWrapper({ url: url, method: 'GET' });
    if (response?.status == 200) {
      // console.log(response?.data?.message?.data,"this is dropdown");
      setPONumberDropdown(response?.data?.message?.total_po);
    }
  }

  const getDropdown = async () => {
    const url = API_END_POINTS?.getPrintFormatDropdown;
    const response: AxiosResponse = await requestWrapper({ url: url, method: 'GET' });
    if (response?.status == 200) {
      // console.log(response?.data?.message?.data,"this is dropdown");
      setPrintFormatDropdown(response?.data?.message?.data);
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
    <div className="min-h-screen bg-[#f8fafc] space-y-6 text-sm text-black font-sans m-5">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-md border border-gray-300">
        {/* <input
          onChange={(e) => { setPRNumber(e.target.value) }}
          type="text"
          className="w-full md:w-1/2 border border-gray-300 rounded px-4 py-2 focus:outline-none hover:border-blue-700 transition"
        /> */}
        <Select onValueChange={(value) => { handlePOChange(value) }} value={PRNumber ?? ""}>
          <SelectTrigger className="w-60">
            <SelectValue placeholder="Select PO Number" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {
                PONumberDropdown?.map((item, index) => (
                  <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                ))
              }
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex justify-end gap-5 w-full">
          <Select onValueChange={(value) => { setSelectedPODropdown(value) }}>
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
          </Select>
          <Button id="viewPrintBtn" onClick={() => { getPODetails(); }} variant={"nextbtn"} size={"nextbtnsize"} className="px-2 transition text-nowrap">
            View PO Details
          </Button>
          <Button onClick={() => { router.push(`/view-all-po-changes`) }} variant={"nextbtn"} size={"nextbtnsize"} className="px-2 transition text-nowrap">
            View All Changed PO Details
          </Button>
          <Button onClick={() => { router.push(`/view-invalid-po`) }} variant={"nextbtn"} size={"nextbtnsize"} className="px-2 transition text-nowrap">
            View Invalid PO
          </Button>
        </div>
      </div>

      {/* Early Delivery Button */}
      {isPrintFormat &&
        <div className="flex justify-start text-left space-x-4">
          <Button onClick={() => { handleOpen() }} variant={"nextbtn"} size={"nextbtnsize"} className="px-4 py-2.5 transition">
            Early Delivery
          </Button>
          <Button variant={"nextbtn"} size={"nextbtnsize"} className="px-4 py-2.5 transition" onClick={() => { handleDownloadPDF() }}>Download</Button>

        </div>
      }
      {/* {isPrintFormat &&
        <Button variant={"nextbtn"} size={"nextbtnsize"} className="px-4 py-2.5 transition" onClick={() => { handleDownloadPDF() }}>Download</Button>
      } */}

      {/* PO Main Section */}
      {isPrintFormat &&
        <POPrintFormat contentRef={contentRef} prDetails={prDetails} Heading={selectedPODropdown} />
      }
      {isPrintFormat && Boolean(prDetails?.sent_to_vendor) &&
        <div className="flex justify-end items-center"><Button variant={"nextbtn"} size={"nextbtnsize"} className="px-4 py-2.5 transition" onClick={() => { setIsEmailDialog(true) }}>Send Email</Button></div>
      }

      {isEmailDialog &&
        <PopUp handleClose={handleClose} classname="md:max-h-[400px]" headerText="Send Email" isSubmit={true} Submitbutton={handleSubmit}>
          <div className="mb-2">
            <h1 className="text-[14px] font-normal text-[#626973] pb-2">
              To
            </h1>
            <Input disabled value={email?.to ?? ""} />
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
        <PopUp classname="w-full md:max-w-[60vw] md:max-h-[60vh] h-full overflow-y-scroll" handleClose={handleClose}>
          <h1 className="pl-5">Purchase Inquiry Items</h1>
          <div className="shadow- bg-[#f6f6f7] mb-4 p-4 rounded-2xl">
            <Table className=" max-h-40 overflow-y-scroll overflow-x-scroll">
              <TableHeader className="text-center">
                <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center text-nowrap">
                  <TableHead className="text-center"></TableHead>
                  <TableHead className="text-center">Product Name</TableHead>
                  <TableHead className="text-center">Material Code</TableHead>
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
                    <TableCell><input type="checkbox" name="requested_for_earlydelivery" onChange={(e) => { handleTableChange(index, e.target.name, e.target.checked) }} checked={item?.requested_for_earlydelivery ?? ""}  /></TableCell>
                    <TableCell>{item?.product_name}</TableCell>
                    <TableCell className='text-center'>{item?.material_code}</TableCell>
                    <TableCell>{item?.plant}</TableCell>
                    <TableCell>{item?.schedule_date}</TableCell>
                    <TableCell><div className={`flex justify-center`}> <Input type="number" name="quantity" onChange={(e) => { handleTableChange(index, e.target.name, e.target.value) }} value={item?.quantity ?? ""} className='w-36 disabled:opacity-100' /></div></TableCell>
                    <TableCell className={`flex justify-center`}><Input type="date" name="early_delivery_date" onChange={(e) => { handleTableChange(index, e.target.name, e.target.value) }} value={item?.early_delivery_date ?? ""} className='w-36 disabled:opacity-100' /></TableCell>
                    <TableCell><div className={`flex justify-center`}> <Input name="purchase_team_remarks" onChange={(e) => { handleTableChange(index, e.target.name, e.target.value) }} value={item?.purchase_team_remarks ?? ""} className='disabled:opacity-100' /></div></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button onClick={() => { handlePoItemsSubmit() }}>Submit</Button>
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
  );
};

export default ViewPO;

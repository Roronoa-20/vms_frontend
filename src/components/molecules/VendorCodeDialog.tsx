import React, { useEffect, useState } from "react";
import { Button } from "@/src/components/atoms/button";
import { Link, X } from 'lucide-react'
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../atoms/table";
type props = {
  handleClose: (value:boolean) => void;
  vendor_ref_no:string
}


type vendorCode = {
    company_name:string,
    state:string,
    gst_no:string,
    vendor_code:string
}

const VendorCodeDialog = ({ handleClose,vendor_ref_no}: props) => {
    const [vendorCodes,setVendorCodes] = useState<vendorCode[]>([]);
    useEffect(()=>{
        const fetchVendorCodes = async()=>{
            const url = `${API_END_POINTS?.vendorCodeDialogApi}?vendor_ref_no=${vendor_ref_no}`;
            const response:AxiosResponse = await requestWrapper({url:url,method:"GET"});
            if(response?.status == 200){
                setVendorCodes(response?.data?.message);
            }
        }
        fetchVendorCodes();
    },[])
  return (
    <div className="absolute z-50 flex pt-10 items-center justify-center bg-black bg-opacity-50 inset-0">
    <div className="bg-white rounded-xl border p-7 md:max-w-[800px] md:max-h-[350px] h-full w-full gap-8 text-black md:text-md font-light">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-2xl font-poppins">Vendor Codes</h1>
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer "
          onClick={()=>{handleClose(false)}}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      <div className="flexjusttify-between pt-5 gap-4 w-full">
        <div className="overflow-y-scroll">

      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader className="text-center">
          <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
            <TableHead className="w-[100px]">Sr No.</TableHead>
            <TableHead>Company Name</TableHead>
            <TableHead>Gst No</TableHead>
            <TableHead className="text-center">State</TableHead>
            <TableHead className="text-center">Vendor Code</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-center text-black">
          {vendorCodes?.length> 0 ? (
              vendorCodes.map((item, index) => (
                  <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}.</TableCell>
                <TableCell>{item?.company_name}</TableCell>
                <TableCell>{item?.gst_no?item?.gst_no:'-'}</TableCell>
                <TableCell>{item?.state?item?.state:"-"}</TableCell>
                <TableCell>{item?.vendor_code}</TableCell>
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
    </div>
     </div >
  );
};

export default VendorCodeDialog;

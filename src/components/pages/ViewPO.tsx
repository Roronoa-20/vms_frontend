"use client"
import React, { useState } from "react";
import POPrintFormat from "../molecules/POPrintFormat";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import PopUp from "../molecules/PopUp";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../atoms/table";
import { Input } from "../atoms/input";


interface POItemsTable {
  name:string,
  product_name:string,
  material_code:string,
  plant:string,
  schedule_date:string,
  quantity:string,
  early_delivery_date:string
  purchase_team_remarks:string
}


const ViewPO = () => {
    const [prDetails,setPRDetails] = useState();
    const [PRNumber,setPRNumber] = useState<string>("");
    const [POItemsTable,setPOItemsTable] = useState<POItemsTable[]>();
    const [isEarlyDeliveryDialog,setIsEarlyDeliveryDialog] = useState<boolean>(false);
    const getPODetails = async()=>{
        const url = `${API_END_POINTS?.getPrintFormatData}?po_name=${PRNumber}`;
        const response:AxiosResponse = await requestWrapper({url:url,method:"GET"})
        if(response?.status == 200){
            // console.log(response?.data?.message,"this is response")
            setPRDetails(response?.data?.message);
        }
    }


    const handleClose = ()=>{
        setIsEarlyDeliveryDialog(false);
    }

    const handleOpen = ()=>{
      fetchPOItems();
      setIsEarlyDeliveryDialog(true);
    }


    const fetchPOItems = async ()=>{
      const url = `${API_END_POINTS?.POItemsTable}?po_name=${PRNumber}`;
      const response:AxiosResponse = await requestWrapper({url:url,method:"GET"});
      if(response?.status == 200){
        console.log(response?.data,"this is po items");
      }
    }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 space-y-6 text-sm text-black font-sans m-5">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-md border border-gray-300">
        <input
        onChange={(e)=>{setPRNumber(e.target.value)}}
          type="text"
          className="w-full md:w-1/2 border border-gray-300 rounded px-4 py-2 focus:outline-none hover:border-blue-700 transition"
        />
        <div className="flex gap-2 md:gap-4">
          <button onClick={()=>{getPODetails()}} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            View PO Details
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            View All Changed PO Details
          </button>
        </div>
      </div>

      {/* Early Delivery Button */}
      <div className="text-left">
        <button onClick={()=>{handleOpen()}} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Early Delivery
        </button>
      </div>

      {/* PO Main Section */}
      <POPrintFormat prDetails={prDetails}  />
      {/* End of Print Format */}

      {
          isEarlyDeliveryDialog &&
          <PopUp classname="w-full md:max-w-[60vw] md:max-h-[60vh] h-full overflow-y-scroll" handleClose={handleClose}>
            <h1 className="pl-5">Purchase Inquiry Items</h1>
      <div className="shadow- bg-[#f6f6f7] mb-4 p-4 rounded-2xl">
        <Table className=" max-h-40 overflow-y-scroll">
          <TableHeader className="text-center">
            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center text-nowrap">
              <TableHead className="text-center">Product Name</TableHead>
              <TableHead className="text-center">Material Code</TableHead>
              <TableHead className="text-center">Plant</TableHead>
              <TableHead className="text-center">Schedule Date</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              
            </TableRow>
          </TableHeader>
          {/* <TableBody className="text-center">
            {POItemsTable?.map((item, index) => (
              <TableRow key={index}>
                <TableCell className='text-center'>{item?.plant}</TableCell>
                <TableCell>{item?.product_name}</TableCell>
                <TableCell>{item?.product_price}</TableCell>
                <TableCell>{item?.uom}</TableCell>  
                <TableCell className={`flex justify-center`}><Input type="date"  className='w-5' /></TableCell>
              </TableRow>
            ))}
          </TableBody> */}
        </Table>
      </div>
          </PopUp> 
      }
    </div>
  );
};

export default ViewPO;

"use client"
import React, { useState } from "react";
import POPrintFormat from "../molecules/POPrintFormat";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import PopUp from "../molecules/PopUp";

const ViewPO = () => {
    const [prDetails,setPRDetails] = useState();
    const [PRNumber,setPRNumber] = useState<string>("");
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
        <button onClick={()=>{setIsEarlyDeliveryDialog(true)}} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Early Delivery
        </button>
      </div>

      {/* PO Main Section */}
      <POPrintFormat prDetails={prDetails}  />
      {/* End of Print Format */}

      {
          isEarlyDeliveryDialog &&
          <PopUp handleClose={handleClose}/> 
      }
    </div>
  );
};

export default ViewPO;

'use client'
import React, { useEffect, useState } from "react";
import { Input } from "../../atoms/input";
import { Button } from "../../atoms/button";
import { TTestingFacility, useTestingStore } from "@/src/store/TestingFacilityStore";
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../atoms/table";
import { VendorOnboardingResponse } from "@/src/types/types";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";

interface Props {
  ref_no:string,
  onboarding_ref_no:string
  OnboardingDetail:VendorOnboardingResponse["message"]["testing_details_tab"]
}

const TestingDetail = ({ref_no,onboarding_ref_no,OnboardingDetail}:Props) => {
  const [multipleTestingDetail,setMultipleTestingDetail] = useState<Partial<TTestingFacility>>();
  const {designation} = useAuth();
  const {testingDetail,updateTestingDetail,reset} = useTestingStore();
  
  useEffect(()=>{
    reset();
    OnboardingDetail?.map((item,index)=>{
      updateTestingDetail(item)
    })
  },[])
  
  
  // if(!designation){
  //   return(
  //     <div>Loading...</div>
  //   )
  // }
  
  const router = useRouter()
  const handleSubmit = async()=>{
    const submitUrl = API_END_POINTS?.testingDetailSubmit;
    const updatedData = {testing_detail:testingDetail,ref_no:ref_no,vendor_onboarding:onboarding_ref_no}
    const machineDetailResponse:AxiosResponse = await requestWrapper({url:submitUrl,data:{data:updatedData},method:"POST"});

    if(machineDetailResponse?.status == 200) router.push(`/vendor-details-form?tabtype=Reputed%20Partners&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`);
  }

  const handleAdd = async()=>{
    updateTestingDetail(multipleTestingDetail);
    setMultipleTestingDetail({});
  }
  return (
    <div className="flex flex-col bg-white rounded-lg px-4 pb-4 max-h-[80vh] overflow-y-scroll w-full">
      <h1 className="border-b-2 pb-2 mb-4 sticky top-0 bg-white py-4 text-lg">
        Details of Testing Facility
      </h1>
      <div className="grid grid-cols-3 gap-6 p-5">
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Equipment Name
          </h1>
          <Input placeholder="" value={multipleTestingDetail?.equipment_name ?? ""} onChange={(e)=>{setMultipleTestingDetail((prev:any)=>({...prev,equipment_name:e.target.value}))}} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Equipment Qty.
          </h1>
          <Input placeholder="" value={multipleTestingDetail?.equipment_qty ?? ""} onChange={(e)=>{setMultipleTestingDetail((prev:any)=>({...prev,equipment_qty:e.target.value}))}}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Capacity
          </h1>
          <Input placeholder="" value={multipleTestingDetail?.capacity ?? ""} onChange={(e)=>{setMultipleTestingDetail((prev:any)=>({...prev,capacity:e.target.value}))}} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Remarks
          </h1>
          <Input placeholder="" value={multipleTestingDetail?.remarks ?? ""} onChange={(e)=>{setMultipleTestingDetail((prev:any)=>({...prev,remarks:e.target.value}))}}/>
        </div>
        <div className="col-span-1 flex items-end">
          <Button className={`bg-blue-400 hover:bg-blue-300 ${designation?"hidden":""}`} onClick={()=>{handleAdd()}}>Add</Button>
        </div>
      </div>
      <div className="shadow- bg-[#f6f6f7] p-4 mb-4 rounded-2xl">
            <div className="flex w-full justify-between pb-4">
              <h1 className="text-[20px] text-[#03111F] font-semibold">
                Multiple Testing Facility
              </h1>
            </div>
            <Table className=" max-h-40 overflow-y-scroll">
              {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
              <TableHeader className="text-center">
                <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
                  <TableHead className="w-[100px]">Sr No.</TableHead>
                  <TableHead className="text-center">Equipment Name</TableHead>
                  <TableHead className="text-center">Equipment Qty.</TableHead>
                  <TableHead className="text-center">Capacity</TableHead>
                  <TableHead className="text-center">Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-center">
                {testingDetail?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{item?.equipment_name}</TableCell>
                    <TableCell>{item?.equipment_qty}</TableCell>
                    <TableCell>{item?.capacity}</TableCell>
                    <TableCell>
                      {item?.remarks}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
      <div className={`flex justify-end pr-4 ${designation?"hidden":""}`} onClick={()=>{handleSubmit()}}><Button>Next</Button></div>
    </div>
  );
};

export default TestingDetail;

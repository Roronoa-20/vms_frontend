'use client'
import React, { useEffect, useState } from "react";
import { Input } from "../../atoms/input";
import { Button } from "../../atoms/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../atoms/table";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import { VendorOnboardingResponse } from "@/src/types/types";
import { useAuth } from "@/src/context/AuthContext";

type TReputedPartnerDetails = {
  company_name:string,
  supplied_qtyyear:string,
  remark:string
}
type Props = {
  ref_no:string,
  onboarding_ref_no:string,
  OnboardingDetail:VendorOnboardingResponse["message"]["reputed_partners_details_tab"]
}

const ReputedPartners = ({ref_no,onboarding_ref_no,OnboardingDetail}:Props) => {
  const [reputedPartnersDetails,setReputedPartnersDetails] = useState<Partial<TReputedPartnerDetails[]>>([]);
  const [reputedPartners,setReputedPartners] = useState<Partial<TReputedPartnerDetails>>()

  const {designation} = useAuth();
  
  useEffect(()=>{
    OnboardingDetail?.map((item)=>{
      setReputedPartnersDetails((prev)=>([...prev,item]))
    })
  },[])

  // if(!designation){
  //   return(
  //     <div>Loading...</div>
  //   )
  // }


  const handleSubmit = async()=>{
    const url = API_END_POINTS?.reputedDetailSubmit;
    const updateData = {reputed_partners:reputedPartnersDetails}
    const response:AxiosResponse = await requestWrapper({url:url,data:{data:{...updateData,ref_no:ref_no,vendor_onboarding:onboarding_ref_no}},method:"POST"})
    if(response?.status == 200){
      console.log("successfully submitted")
    }
  }

const handleAdd = ()=>{
  setReputedPartnersDetails((prev:any)=>([...prev,reputedPartners]));
  setReputedPartners({});
}


  return (
    <div className="flex flex-col bg-white rounded-lg px-4 pb-4 max-h-[80vh] overflow-y-scroll w-full">
      <h1 className="border-b-2 pb-2 mb-4 sticky top-0 bg-white py-4 text-lg">
        Reputed Partners
      </h1>
      <div className="grid grid-cols-3 gap-6 p-5">
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Company Name
          </h1>
          <Input placeholder="" value={reputedPartners?.company_name ?? ""} onChange={(e)=>{setReputedPartners((prev)=>({...prev,company_name:e.target.value}))}}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Supplied Qty./ Year
          </h1>
          <Input placeholder="" value={reputedPartners?.supplied_qtyyear ?? ""} onChange={(e)=>{setReputedPartners((prev)=>({...prev,supplied_qtyyear:e.target.value}))}}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Remarks
          </h1>
          <Input placeholder="" value={reputedPartners?.remark ?? ""} onChange={(e)=>{setReputedPartners((prev)=>({...prev,remark:e.target.value}))}}/>
        </div>
        <div className="col-span-1 flex items-end">
          <Button className={`bg-blue-400 hover:bg-blue-300 ${designation?"hidden":""}`} onClick={()=>{handleAdd()}}>Add</Button>
        </div>
      </div>
      <div className="shadow- bg-[#f6f6f7] p-4 mb-4 rounded-2xl">
            <div className="flex w-full justify-between pb-4">
              <h1 className="text-[20px] text-[#03111F] font-semibold">
                Multiple Reputed Partners
              </h1>
            </div>
            <Table className=" max-h-40 overflow-y-scroll">
              {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
              <TableHeader className="text-center">
                <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
                  <TableHead className="w-[100px]">Sr No.</TableHead>
                  <TableHead className="text-center">Company Name</TableHead>
                  <TableHead className="text-center">Supplied Quantity</TableHead>
                  <TableHead className="text-center">Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-center">
                {reputedPartnersDetails?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index}</TableCell>
                    <TableCell>{item?.company_name}</TableCell>
                    <TableCell>{item?.supplied_qtyyear}</TableCell>
                    <TableCell>{item?.remark}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className={`flex justify-end pr-4 ${designation?"hidden":""}`}><Button onClick={()=>{handleSubmit()}}>Next</Button></div>
    </div>
  );
};

export default ReputedPartners;

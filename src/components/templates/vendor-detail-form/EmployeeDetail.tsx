'use client'
import React from "react";
import { Input } from "../../atoms/input";
import { useEmployeeDetailStore } from "@/src/store/EmployeeDetailStore";
import { Button } from "../../atoms/button";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";

type Props = {
  ref_no:string,
  onboarding_ref_no:string
}

const EmployeeDetail = ({ref_no,onboarding_ref_no}:Props) => {
  const {employeeDetail,updateEmployeeDetail} = useEmployeeDetailStore()

  const handleSubmit = async()=>{
    const employeeSubmitUrl = API_END_POINTS?.employeeDetailSubmit;
    const updatedData = {...employeeDetail,ref_no:ref_no,vendor_onboarding:onboarding_ref_no}
    const employeeDetailResponse:AxiosResponse = await requestWrapper({url:employeeSubmitUrl,data:{data:updatedData},method:"POST"});
    if(employeeDetailResponse?.status == 200){
      console.log("submitted successfully")
    }
  }

  return (
    <div className="flex flex-col bg-white rounded-lg px-4 pb-4 max-h-[80vh] overflow-y-scroll w-full">
      <h1 className="border-b-2 pb-2 mb-4 sticky top-0 bg-white py-4 text-lg">
        Number of Employees in Various Divisions
      </h1>
      <div className="grid grid-cols-3 gap-6 p-5">
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Employees in Production
          </h1>
          <Input placeholder="" onChange={(e)=>{updateEmployeeDetail("production",e.target.value)}}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Employees in QA/QC
          </h1>
          <Input placeholder="" onChange={(e)=>{updateEmployeeDetail("qaqc",e.target.value)}}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Employees in Logistics
          </h1>
          <Input placeholder="" onChange={(e)=>{updateEmployeeDetail("logistics",e.target.value)}}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Employees in Marketing
          </h1>
          <Input placeholder="" onChange={(e)=>{updateEmployeeDetail("marketing",e.target.value)}}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Employees in R&D
          </h1>
          <Input placeholder="" onChange={(e)=>{updateEmployeeDetail("r_d",e.target.value)}}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Employees in HSE
          </h1>
          <Input placeholder="" onChange={(e)=>{updateEmployeeDetail("hse",e.target.value)}}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Employees in Other Department
          </h1>
          <Input placeholder=""onChange={(e)=>{updateEmployeeDetail("other",e.target.value)}} />
        </div>
      </div>
      <div><Button onClick={()=>{handleSubmit()}}>Next</Button></div>
    </div>
  );
};

export default EmployeeDetail;

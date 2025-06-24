'use client'
import React, { useEffect, useState } from "react";
import { Input } from "../../atoms/input";
import { TEmployeeDetail, useEmployeeDetailStore } from "@/src/store/EmployeeDetailStore";
import { Button } from "../../atoms/button";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../atoms/table";
import { VendorOnboardingResponse } from "@/src/types/types";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";

type Props = {
  ref_no:string,
  onboarding_ref_no:string
  OnboardingDetail:VendorOnboardingResponse["message"]["employee_details_tab"]
}

const EmployeeDetail = ({ref_no,onboarding_ref_no,OnboardingDetail}:Props) => {
  const {employeeDetail,updateEmployeeDetail,resetEmployeeDetail} = useEmployeeDetailStore()
  const [addEmployeeDetail,setEmployeeDetail] = useState<TEmployeeDetail | null>();
  useEffect(()=>{
    resetEmployeeDetail();
    OnboardingDetail?.map((item)=>{
      updateEmployeeDetail(item)
    })
  },[])
  const {designation} = useAuth();
  // if(!designation){
  //   return(
  //     <div>Loading...</div>
  //   )
  // }
  const router = useRouter()

  const handleSubmit = async()=>{
    const employeeSubmitUrl = API_END_POINTS?.employeeDetailSubmit;
    const updatedData = {data:{number_of_employee:[...employeeDetail],ref_no:ref_no,vendor_onboarding:onboarding_ref_no}}
    const employeeDetailResponse:AxiosResponse = await requestWrapper({url:employeeSubmitUrl,data:updatedData,method:"POST"});
    if(employeeDetailResponse?.status == 200) router.push(`/vendor-details-form?tabtype=Machinery%20Detail&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`);
  }

  const handleAdd = ()=>{
    updateEmployeeDetail(addEmployeeDetail);
    setEmployeeDetail(null)
  }

  return (
    <div className="flex flex-col bg-white rounded-lg px-4 pb-4 max-h-[80vh] overflow-y-scroll w-full">
      <h1 className="border-b-2 pb-2 mb-4 sticky top-0 bg-white py-4 text-lg">
        Number of Employees in Various Divisions
      </h1>
      <div className="shadow- bg-[#f6f6f7] p-4 mb-4 rounded-2xl">
            <div className="flex w-full justify-between pb-4">
              <h1 className="text-[20px] text-[#03111F] font-semibold">
                Multiple Employees
              </h1>
            </div>
            <Table className=" max-h-40 overflow-y-scroll">
              {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
              <TableHeader className="text-center">
                <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
                  <TableHead className="w-[100px]">Sr No.</TableHead>
                  <TableHead className="text-center">Employees in Production</TableHead>
                  <TableHead className="text-center">Employees in QA/QC</TableHead>
                  <TableHead className="text-center">Employees in Logistics</TableHead>
                  <TableHead className="text-center">Employees in Marketing</TableHead>
                  <TableHead className="text-center">Employees in R&D</TableHead>
                  <TableHead className="text-center">Employees in HSE</TableHead>
                  <TableHead className="text-center">Employees in Other Department</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-center">
                {employeeDetail?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index +1}</TableCell>
                    <TableCell>{item?.production}</TableCell>
                    <TableCell>{item?.qaqc}</TableCell>
                    <TableCell>{item?.logistics}</TableCell>
                    <TableCell>
                      {item?.marketing}
                    </TableCell>
                    <TableCell>
                      {item?.r_d}
                    </TableCell>
                    <TableCell>
                      {item?.hse}
                    </TableCell>
                    <TableCell>
                      {item?.other}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
      {/* <div className={`flex justify-end pr-6 ${designation?"hidden":""}`}><Button className="hover:bg-blue-400 bg-blue-400" onClick={()=>{handleSubmit()}}>Next</Button></div> */}
    </div>
  );
};

export default EmployeeDetail;

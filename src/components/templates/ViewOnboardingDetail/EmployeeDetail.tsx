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
import { Lock, Pencil, Trash2 } from "lucide-react";

type Props = {
  ref_no: string,
  onboarding_ref_no: string
  OnboardingDetail: VendorOnboardingResponse["message"]["employee_details_tab"]
  isAmendment: number;
  re_release?: number;
}

const EmployeeDetail = ({ ref_no, onboarding_ref_no, OnboardingDetail, isAmendment, re_release }: Props) => {
  const { employeeDetail, updateEmployeeDetail, resetEmployeeDetail } = useEmployeeDetailStore()
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const { designation } = useAuth();
  const [addEmployeeDetail, setEmployeeDetail] = useState<TEmployeeDetail | null>();
  useEffect(() => {
    resetEmployeeDetail();
    OnboardingDetail?.map((item) => {
      updateEmployeeDetail(item)
    })
  }, [])

  const router = useRouter()

  const handleSubmit = async () => {
    const employeeSubmitUrl = API_END_POINTS?.employeeDetailSubmit;
    const updatedData = { data: { number_of_employee: [...employeeDetail], ref_no: ref_no, vendor_onboarding: onboarding_ref_no } }
    const employeeDetailResponse: AxiosResponse = await requestWrapper({ url: employeeSubmitUrl, data: updatedData, method: "POST" });
    if (employeeDetailResponse?.status == 200) {
      alert("Employee Details Updated Successfully!!!")
      router.push(`/view-onboarding-details?tabtype=Machinery%20Detail&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`);
      location.reload();
    }
  }

  const handleAdd = () => {
    updateEmployeeDetail(addEmployeeDetail);
    setEmployeeDetail(null)
  }

  const handleRowDelete = (index: number) => {
    const updatedEmployees = employeeDetail.filter((_, itemIndex) => itemIndex !== index);
    resetEmployeeDetail();
    updatedEmployees.forEach(item => updateEmployeeDetail(item));
  }

  return (
    <div className="flex flex-col bg-white rounded-lg p-2 w-full">
      <div className="flex justify-between items-center border-b-2">
        <h1 className="font-semibold text-[18px]">Number of Employees</h1>
        {/* <Button onClick={() => { setIsDisabled(prev => !prev) }} className={`mb-2 ${isAmendment == 1?"":"hidden"}`}>{isDisabled ? "Enable Edit" : "Disable Edit"}</Button> */}
        {designation == "Purchase Team" &&(isAmendment == 1 || re_release == 1) && (
          <div
            onClick={() => setIsDisabled(prev => !prev)}
            className="mb-2 inline-flex items-center gap-2 cursor-pointer rounded-[28px] border px-3 py-2 shadow-sm bg-[#5e90c0] hover:bg-gray-100 transition"
          >
            {isDisabled ? (
              <>
                <Lock className="w-5 h-5 text-red-500" />
                <span className="text-[14px] font-medium text-white hover:text-black">Enable Edit</span>
              </>
            ) : (
              <>
                <Pencil className="w-5 h-5 text-green-600" />
                <span className="text-[14px] font-medium text-white hover:text-black">Disable Edit</span>
              </>
            )}
          </div>
        )}
      </div>
      <div className={`grid grid-cols-3 gap-6 p-2 ${isDisabled ? "hidden" : ""}`}>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Employees in Production
          </h1>
          <Input disabled={isDisabled} className="disabled:opacity-100" placeholder="" value={addEmployeeDetail?.production ?? ""} onChange={(e) => { setEmployeeDetail((prev: any) => ({ ...prev, production: e.target.value })) }} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Employees in QA/QC
          </h1>
          <Input disabled={isDisabled} className="disabled:opacity-100" placeholder="" value={addEmployeeDetail?.qaqc ?? ""} onChange={(e) => { setEmployeeDetail((prev: any) => ({ ...prev, qaqc: e.target.value })) }} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Employees in Logistics
          </h1>
          <Input disabled={isDisabled} className="disabled:opacity-100" placeholder="" value={addEmployeeDetail?.logistics ?? ""} onChange={(e) => { setEmployeeDetail((prev: any) => ({ ...prev, logistics: e.target.value })) }} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Employees in Marketing
          </h1>
          <Input disabled={isDisabled} className="disabled:opacity-100" placeholder="" value={addEmployeeDetail?.marketing ?? ""} onChange={(e) => { setEmployeeDetail((prev: any) => ({ ...prev, marketing: e.target.value })) }} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Employees in R&D
          </h1>
          <Input disabled={isDisabled} className="disabled:opacity-100" placeholder="" value={addEmployeeDetail?.r_d ?? ""} onChange={(e) => { setEmployeeDetail((prev: any) => ({ ...prev, r_d: e.target.value })) }} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Employees in HSE
          </h1>
          <Input disabled={isDisabled} className="disabled:opacity-100" placeholder="" value={addEmployeeDetail?.hse ?? ""} onChange={(e) => { setEmployeeDetail((prev: any) => ({ ...prev, hse: e.target.value })) }} />
        </div>
          <div className="col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Employees in Other Department
            </h1>
            <Input
              disabled={isDisabled}
              className="disabled:opacity-100"
              placeholder=""
              value={addEmployeeDetail?.other ?? ""}
              onChange={(e) =>
                setEmployeeDetail((prev: any) => ({ ...prev, other: e.target.value }))
              }
            />
          </div>
          <div className="col-span-1 flex items-end">
            <Button
              variant={"nextbtn"}
              size={"nextbtnsize"}
              onClick={() => { handleAdd(); }}
              className={`scroll-py-24 ${isDisabled ? "hidden" : ""}`}
            >
              Add
            </Button>
          </div>
      </div>
      <div className="shadow- bg-[#f6f6f7] p-2 mb-4 mt-2 rounded-2xl">
        {/* <div className="flex w-full justify-between pb-4">
          <h1 className="text-[20px] text-[#03111F] font-semibold">
            Employees
          </h1>
        </div> */}
        <Table className=" max-h-40 overflow-y-scroll">
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
              <TableHead className="text-center">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-center">
            {employeeDetail?.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{item?.production}</TableCell>
                <TableCell>{item?.qaqc}</TableCell>
                <TableCell>{item?.logistics}</TableCell>
                <TableCell>{item?.marketing}</TableCell>
                <TableCell>{item?.r_d}</TableCell>
                <TableCell>{item?.hse}</TableCell>
                <TableCell>{item?.other}</TableCell>
                <TableCell className="flex justify-center">
                  {!isDisabled && (
                    <Trash2
                      className="text-red-400 cursor-pointer"
                      onClick={() => handleRowDelete(index)}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className={`flex justify-end pb-2`}>
        <Button className={`py-2 ${isDisabled ? "hidden" : ""}`} variant={"nextbtn"} size={"nextbtnsize"} onClick={() => { handleSubmit() }}>Next</Button></div>
    </div>
  );
};

export default EmployeeDetail;

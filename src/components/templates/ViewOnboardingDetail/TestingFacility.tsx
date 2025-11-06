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
import { Lock, Pencil, Trash2 } from "lucide-react";

interface Props {
  ref_no: string,
  onboarding_ref_no: string
  OnboardingDetail: VendorOnboardingResponse["message"]["testing_details_tab"]
  isAmendment: number;
  re_release: number;
}

const TestingDetail = ({ ref_no, onboarding_ref_no, OnboardingDetail, isAmendment, re_release }: Props) => {
  const [multipleTestingDetail, setMultipleTestingDetail] = useState<Partial<TTestingFacility>>();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const { designation } = useAuth();
  const { testingDetail, updateTestingDetail, reset } = useTestingStore();

  useEffect(() => {
    reset();
    OnboardingDetail?.map((item, index) => {
      updateTestingDetail(item)
    })
  }, [])

  const router = useRouter();
  const handleSubmit = async () => {
    const submitUrl = API_END_POINTS?.testingDetailSubmit;
    const updatedData = { testing_detail: testingDetail, ref_no: ref_no, vendor_onboarding: onboarding_ref_no }
    const machineDetailResponse: AxiosResponse = await requestWrapper({ url: submitUrl, data: { data: updatedData }, method: "POST" });

    if (machineDetailResponse?.status == 200) {
      alert("Testing Facility Details Updated Successfully!!!");
      router.push(`/view-onboarding-details?tabtype=Reputed%20Partners&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`);
      // location.reload();
    }
  }

  const handleAdd = async () => {
    updateTestingDetail(multipleTestingDetail);
    setMultipleTestingDetail({});
  }

  const handleRowDelete = (index: number) => {
    const updatedTestingDetails = testingDetail.filter((_, itemIndex) => itemIndex !== index);
    reset();
    updatedTestingDetails.forEach(item => updateTestingDetail(item));
  };

  return (
    <div className="flex flex-col bg-white rounded-lg p-2 w-full">
      <div className="flex justify-between items-center border-b-2">
        <h1 className="font-semibold text-[18px]">Testing Facility</h1>
        {/* <Button onClick={() => { setIsDisabled(prev => !prev) }} className={`mb-2 ${isAmendment == 1?"":"hidden"}`}>{isDisabled ? "Enable Edit" : "Disable Edit"}</Button> */}
        { designation == "Purchase Team" && (isAmendment == 1 || re_release == 1) && (
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
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Equipment Name
          </h1>
          <Input disabled={isDisabled} className="disabled:opacity-100" placeholder="" value={multipleTestingDetail?.equipment_name ?? ""} onChange={(e) => { setMultipleTestingDetail((prev: any) => ({ ...prev, equipment_name: e.target.value })) }} />
        </div>
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Equipment Qty.
          </h1>
          <Input placeholder="" disabled={isDisabled} className="disabled:opacity-100" value={multipleTestingDetail?.equipment_qty ?? ""} onChange={(e) => { setMultipleTestingDetail((prev: any) => ({ ...prev, equipment_qty: e.target.value })) }} />
        </div>
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Capacity
          </h1>
          <Input disabled={isDisabled} className="disabled:opacity-100" placeholder="" value={multipleTestingDetail?.capacity ?? ""} onChange={(e) => { setMultipleTestingDetail((prev: any) => ({ ...prev, capacity: e.target.value })) }} />
        </div>
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Remarks
          </h1>
          <Input placeholder="" disabled={isDisabled} className="disabled:opacity-100" value={multipleTestingDetail?.remarks ?? ""} onChange={(e) => { setMultipleTestingDetail((prev: any) => ({ ...prev, remarks: e.target.value })) }} />
        </div>
        <div className="col-span-1 flex items-end">
          <Button className={`py-2 ${isDisabled ? "hidden" : ""}`} variant={"nextbtn"} size={"nextbtnsize"} onClick={() => { handleAdd() }}>Add</Button>
        </div>
      </div>
      <div className="shadow- bg-[#f6f6f7] p-2 mb-4 mt-4 rounded-2xl">
        {/* <div className="flex w-full justify-between pb-4">
          <h1 className="text-[20px] text-[#03111F] font-semibold">
            Multiple Testing Facility
          </h1>
        </div> */}
        <Table className=" max-h-40 overflow-y-scroll">
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader className="text-center">
            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
              <TableHead className="w-[100px]">Sr No.</TableHead>
              <TableHead className="text-center">Equipment Name</TableHead>
              <TableHead className="text-center">Equipment Qty.</TableHead>
              <TableHead className="text-center">Capacity</TableHead>
              <TableHead className="text-center">Remarks</TableHead>
              <TableHead className="text-center">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-center">
            {testingDetail?.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{item?.equipment_name}</TableCell>
                <TableCell>{item?.equipment_qty}</TableCell>
                <TableCell>{item?.capacity}</TableCell>
                <TableCell>{item?.remarks}</TableCell>
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
      <div className={`flex justify-end ${isDisabled ? "hidden" : ""}`} onClick={() => { handleSubmit() }}><Button variant={"nextbtn"} size={"nextbtnsize"}>Next</Button></div>
    </div>
  );
};

export default TestingDetail;

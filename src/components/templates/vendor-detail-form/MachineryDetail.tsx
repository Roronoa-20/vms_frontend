"use client";
import React, { useEffect, useState } from "react";
import { Input } from "../../atoms/input";
import { Button } from "../../atoms/button";
import {
  TMachineDetail,
  useMachineDetailStore,
} from "@/src/store/MachinaryDetailStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../atoms/table";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import { VendorOnboardingResponse } from "@/src/types/types";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface Props {
  ref_no: string;
  onboarding_ref_no: string;
  OnboardingDetail: VendorOnboardingResponse["message"]["machinery_details_tab"];
}

const MachineryDetail = ({
  ref_no,
  onboarding_ref_no,
  OnboardingDetail,
}: Props) => {
  const { machineDetail, updateMachineDetail, resetMachineDetail } =
    useMachineDetailStore();
  const [multipleMachineDetail, setMultipleMachineDetail] =
    useState<TMachineDetail | null>(null);
  const router = useRouter();
  useEffect(() => {
    resetMachineDetail();
    OnboardingDetail?.map((item, index) => {
      updateMachineDetail(item);
    });
  }, []);

  const handleSubmit = async () => {
    const submitUrl = API_END_POINTS?.machineDetailSubmit;
    const updatedData = {
      machinery_detail: machineDetail,
      ref_no: ref_no,
      vendor_onboarding: onboarding_ref_no,
    };
    const machineDetailResponse: AxiosResponse = await requestWrapper({
      url: submitUrl,
      data: { data: updatedData },
      method: "POST",
    });

    if (machineDetailResponse?.status == 200)
      router.push(
        `/vendor-details-form?tabtype=Testing%20Facility&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`
      );
  };

  const handleBack = () => {
    router.push(
      `/vendor-details-form?tabtype=Employee%20Detail&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`
    );
  };

  const handleAdd = async () => {
    updateMachineDetail(multipleMachineDetail);
    setMultipleMachineDetail(null);
  };

  const handleRowDelete = (index: number) => {
    // Remove the machine at the given index from the machineDetail store
    const updatedMachines = machineDetail.filter(
      (_, itemIndex) => itemIndex !== index
    );
    resetMachineDetail();
    updatedMachines.forEach((item) => updateMachineDetail(item));
  };

  return (
    <div className="flex flex-col bg-white rounded-lg px-4 pb-4 max-h-[80vh] overflow-y-scroll w-full">
      <h1 className="border-b-2 pb-2 mb-4 sticky top-0 bg-white py-4 text-lg">
        Details of Machinery & Other Equipment
      </h1>
      <div className="grid grid-cols-3 gap-6 p-5">
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Equipment Name
          </h1>
          <Input
            placeholder=""
            value={multipleMachineDetail?.equipment_name ?? ""}
            onChange={(e) => {
              setMultipleMachineDetail((prev: any) => ({
                ...prev,
                equipment_name: e.target.value,
              }));
            }}
          />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Equipment Qty.
          </h1>
          <Input
            placeholder=""
            value={multipleMachineDetail?.equipment_qty ?? ""}
            onChange={(e) => {
              setMultipleMachineDetail((prev: any) => ({
                ...prev,
                equipment_qty: e.target.value,
              }));
            }}
          />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Capacity
          </h1>
          <Input
            placeholder=""
            value={multipleMachineDetail?.capacity ?? ""}
            onChange={(e) => {
              setMultipleMachineDetail((prev: any) => ({
                ...prev,
                capacity: e.target.value,
              }));
            }}
          />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Remarks
          </h1>
          <Input
            placeholder=""
            value={multipleMachineDetail?.remarks ?? ""}
            onChange={(e) => {
              setMultipleMachineDetail((prev: any) => ({
                ...prev,
                remarks: e.target.value,
              }));
            }}
          />
        </div>
        <div className={`col-span-1 flex items-end`}>
          <Button
            className="bg-blue-400 hover:bg-blue-300"
            onClick={() => {
              handleAdd();
            }}
          >
            Add
          </Button>
        </div>
      </div>
      {machineDetail.length > 0 && (
        <div className="shadow- bg-[#f6f6f7] p-4 mb-4 rounded-2xl">
          <div className="flex w-full justify-between pb-4">
            <h1 className="text-[20px] text-[#03111F] font-semibold">
              Multiple Machinery Detail
            </h1>
          </div>
          <Table className="max-h-40 overflow-y-scroll">
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader className="text-center">
              <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
                <TableHead className="w-[100px]">Sr No.</TableHead>
                <TableHead className="text-center">Equipment Name</TableHead>
                <TableHead className="text-center">Equipment Qty</TableHead>
                <TableHead className="text-center">Capacity</TableHead>
                <TableHead className="text-center">Remarks</TableHead>
                <TableHead className="text-center">Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-center">
              {machineDetail?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{item?.equipment_name}</TableCell>
                  <TableCell>{item?.equipment_qty}</TableCell>
                  <TableCell>{item?.capacity}</TableCell>
                  <TableCell>{item?.remarks}</TableCell>
                  <TableCell className="flex justify-center">
                    <Trash2
                      onClick={() => {
                        handleRowDelete(index);
                      }}
                      className="text-red-400 cursor-pointer"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <div className="flex justify-end items-center space-x-3 mt-3">
        <Button onClick={handleBack} variant="backbtn" size="backbtnsize">
          Back
        </Button>

        <Button onClick={handleSubmit} variant="nextbtn" size="nextbtnsize">
          Next
        </Button>
      </div>
    </div>
  );
};

export default MachineryDetail;

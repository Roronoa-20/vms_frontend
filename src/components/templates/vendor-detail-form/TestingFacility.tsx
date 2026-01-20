"use client";
import React, { useEffect, useState } from "react";
import { Input } from "../../atoms/input";
import { Button } from "../../atoms/button";
import {
  TTestingFacility,
  useTestingStore,
} from "@/src/store/TestingFacilityStore";
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../atoms/table";
import { VendorOnboardingResponse } from "@/src/types/types";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface Props {
  ref_no: string;
  onboarding_ref_no: string;
  OnboardingDetail: VendorOnboardingResponse["message"]["testing_details_tab"];
}

const TestingDetail = ({
  ref_no,
  onboarding_ref_no,
  OnboardingDetail,
}: Props) => {
  const [multipleTestingDetail, setMultipleTestingDetail] =
    useState<Partial<TTestingFacility>>();
  const { designation } = useAuth();
  const { testingDetail, updateTestingDetail, reset } = useTestingStore();

  useEffect(() => {
    reset();
    OnboardingDetail?.map((item, index) => {
      updateTestingDetail(item);
    });
  }, []);

  // if(!designation){
  //   return(
  //     <div>Loading...</div>
  //   )
  // }

  const router = useRouter();
  const handleSubmit = async () => {
    const submitUrl = API_END_POINTS?.testingDetailSubmit;
    const updatedData = {
      testing_detail: testingDetail,
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
        `/vendor-details-form?tabtype=Reputed%20Partners&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`
      );
  };

  const handleBack = () => {
    router.push(
      `/vendor-details-form?tabtype=Machinery%20Detail&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`
    );
  };

  const handleAdd = async () => {
    updateTestingDetail(multipleTestingDetail);
    setMultipleTestingDetail({});
  };

  const handleRowDelete = (index: number) => {
    // Remove the testing facility at the given index from the testingDetail store
    const updatedTestingDetails = testingDetail.filter(
      (_, itemIndex) => itemIndex !== index
    );
    reset();
    updatedTestingDetails.forEach((item) => updateTestingDetail(item));
  };
  return (
    <div className="flex flex-col bg-white rounded-lg px-4 pb-4 max-h-[80vh] overflow-y-scroll w-full">
      <h1 className="border-b-2 pb-1 sticky top-0 bg-white py-2 font-semibold text-lg">
        Details of Testing Facility
      </h1>
      <div className="grid grid-cols-3 gap-4 p-2">
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
            Equipment Name
          </h1>
          <Input
            placeholder=""
            value={multipleTestingDetail?.equipment_name ?? ""}
            onChange={(e) => {
              setMultipleTestingDetail((prev: any) => ({
                ...prev,
                equipment_name: e.target.value,
              }));
            }}
          />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
            Equipment Qty.
          </h1>
          <Input
            placeholder=""
            value={multipleTestingDetail?.equipment_qty ?? ""}
            onChange={(e) => {
              setMultipleTestingDetail((prev: any) => ({
                ...prev,
                equipment_qty: e.target.value,
              }));
            }}
          />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
            Capacity
          </h1>
          <Input
            placeholder=""
            value={multipleTestingDetail?.capacity ?? ""}
            onChange={(e) => {
              setMultipleTestingDetail((prev: any) => ({
                ...prev,
                capacity: e.target.value,
              }));
            }}
          />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
            Remarks
          </h1>
          <Input
            placeholder=""
            value={multipleTestingDetail?.remarks ?? ""}
            onChange={(e) => {
              setMultipleTestingDetail((prev: any) => ({
                ...prev,
                remarks: e.target.value,
              }));
            }}
          />
        </div>
        <div className="col-span-1 flex items-end">
          <Button
            className={`py-2`}
            variant={"nextbtn"}
            size={"nextbtnsize"}
            onClick={() => {
              handleAdd();
            }}
          >
            Add
          </Button>
        </div>
      </div>
      {testingDetail.length > 0 && (
        <div className="shadow- bg-[#f6f6f7] p-4 mb-4 rounded-2xl">
          <div className="flex w-full justify-between pb-4">
            <h1 className="text-[20px] text-[#03111F] font-semibold">
              Testing Facility List
            </h1>
          </div>
          <Table className=" max-h-40 overflow-y-scroll">
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

export default TestingDetail;

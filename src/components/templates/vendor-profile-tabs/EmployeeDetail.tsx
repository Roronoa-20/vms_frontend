"use client";
import React, { useEffect, useState } from "react";
import { Input } from "../../atoms/input";
import {
  TEmployeeDetail,
  useEmployeeDetailStore,
} from "@/src/store/EmployeeDetailStore";
import { Button } from "../../atoms/button";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
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

type Props = {
  ref_no: string;
  onboarding_ref_no: string;
  OnboardingDetail: VendorOnboardingResponse["message"]["employee_details_tab"];
  onNextTab?: () => void;
  onBackTab?: () => void;
};

const EmployeeDetail = ({
  ref_no,
  onboarding_ref_no,
  OnboardingDetail,
}: Props) => {
  const { employeeDetail, updateEmployeeDetail, resetEmployeeDetail } =
    useEmployeeDetailStore();
  const [addEmployeeDetail, setEmployeeDetail] =
    useState<TEmployeeDetail | null>();
  useEffect(() => {
    resetEmployeeDetail();
    OnboardingDetail?.map((item) => {
      updateEmployeeDetail(item);
    });
  }, []);

  const router = useRouter();

  const handleSubmit = async () => {
    const employeeSubmitUrl = API_END_POINTS?.employeeDetailSubmit;
    const updatedData = {
      data: {
        number_of_employee: [...employeeDetail],
        ref_no: ref_no,
        vendor_onboarding: onboarding_ref_no,
      },
    };
    const employeeDetailResponse: AxiosResponse = await requestWrapper({
      url: employeeSubmitUrl,
      data: updatedData,
      method: "POST",
    });
    if (employeeDetailResponse?.status == 200)
      router.push(
        `/vendor-details-form?tabtype=Machinery%20Detail&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`
      );
  };

  const handleAdd = () => {
    updateEmployeeDetail(addEmployeeDetail);
    setEmployeeDetail(null);
  };

  const handleRowDelete = (index: number) => {
    // Remove the employee at the given index from the employeeDetail store
    const updatedEmployees = employeeDetail.filter(
      (_, itemIndex) => itemIndex !== index
    );
    resetEmployeeDetail();
    updatedEmployees.forEach((item) => updateEmployeeDetail(item));
  };

  const handleBack = () => {
    router.push(
      `/vendor-details-form?tabtype=Manufacturing%20Detail&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`
    );
  };

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
          <Input
            placeholder=""
            value={addEmployeeDetail?.production ?? ""}
            onChange={(e) => {
              setEmployeeDetail((prev: any) => ({
                ...prev,
                production: e.target.value,
              }));
            }}
          />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Employees in QA/QC
          </h1>
          <Input
            placeholder=""
            value={addEmployeeDetail?.qaqc ?? ""}
            onChange={(e) => {
              setEmployeeDetail((prev: any) => ({
                ...prev,
                qaqc: e.target.value,
              }));
            }}
          />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Employees in Logistics
          </h1>
          <Input
            placeholder=""
            value={addEmployeeDetail?.logistics ?? ""}
            onChange={(e) => {
              setEmployeeDetail((prev: any) => ({
                ...prev,
                logistics: e.target.value,
              }));
            }}
          />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Employees in Marketing
          </h1>
          <Input
            placeholder=""
            value={addEmployeeDetail?.marketing ?? ""}
            onChange={(e) => {
              setEmployeeDetail((prev: any) => ({
                ...prev,
                marketing: e.target.value,
              }));
            }}
          />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Employees in R&D
          </h1>
          <Input
            placeholder=""
            value={addEmployeeDetail?.r_d ?? ""}
            onChange={(e) => {
              setEmployeeDetail((prev: any) => ({
                ...prev,
                r_d: e.target.value,
              }));
            }}
          />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Employees in HSE
          </h1>
          <Input
            placeholder=""
            value={addEmployeeDetail?.hse ?? ""}
            onChange={(e) => {
              setEmployeeDetail((prev: any) => ({
                ...prev,
                hse: e.target.value,
              }));
            }}
          />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Employees in Other Department
          </h1>
          <Input
            placeholder=""
            value={addEmployeeDetail?.other ?? ""}
            onChange={(e) => {
              setEmployeeDetail((prev: any) => ({
                ...prev,
                other: e.target.value,
              }));
            }}
          />
        </div>
        <div className="col-span-1 flex items-end">
          <Button
            onClick={() => {
              handleAdd();
            }}
            className="bg-blue-400 hover:bg-blue-400"
          >
            Add
          </Button>
        </div>
      </div>
      {employeeDetail?.length > 0 && (
        <div className="shadow- bg-[#f6f6f7] p-4 mb-4 rounded-2xl">
          <div className="flex w-full justify-between pb-4">
            <h1 className="text-[20px] text-[#03111F] font-semibold">
              Multiple Employees
            </h1>
          </div>
          <Table className=" max-h-40 overflow-y-scroll">
            <TableHeader className="text-center">
              <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
                <TableHead className="w-[100px]">Sr No.</TableHead>
                <TableHead className="text-center">
                  Employees in Production
                </TableHead>
                <TableHead className="text-center">
                  Employees in QA/QC
                </TableHead>
                <TableHead className="text-center">
                  Employees in Logistics
                </TableHead>
                <TableHead className="text-center">
                  Employees in Marketing
                </TableHead>
                <TableHead className="text-center">Employees in R&D</TableHead>
                <TableHead className="text-center">Employees in HSE</TableHead>
                <TableHead className="text-center">
                  Employees in Other Department
                </TableHead>
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

export default EmployeeDetail;

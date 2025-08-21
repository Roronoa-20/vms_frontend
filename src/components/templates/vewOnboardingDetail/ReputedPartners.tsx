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
import { useRouter } from "next/navigation";
import { TReputedPartner, useReputedPartnerStore } from "@/src/store/ReputedPartnerStore";

type Props = {
  ref_no: string,
  onboarding_ref_no: string,
  OnboardingDetail: VendorOnboardingResponse["message"]["reputed_partners_details_tab"]
  isAmendment:number
}

const ReputedPartners = ({ ref_no, onboarding_ref_no, OnboardingDetail,isAmendment }: Props) => {
  const [reputedPartnersDetails, setReputedPartnersDetails] = useState<Partial<TReputedPartner>>();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const { reputedPartners, updateReputedPartner, reset } = useReputedPartnerStore();
  const { designation } = useAuth();
  const router = useRouter()

  useEffect(() => {
    reset();
    OnboardingDetail?.map((item, index) => {
      updateReputedPartner(item)
    })
  }, [])

  // if(!designation){
  //   return(
  //     <div>Loading...</div>
  //   )
  // }


  const handleSubmit = async () => {
    const url = API_END_POINTS?.reputedDetailSubmit;
    const updateData = { reputed_partners: reputedPartnersDetails }
    const response: AxiosResponse = await requestWrapper({ url: url, data: { data: { ...updateData, ref_no: ref_no, vendor_onboarding: onboarding_ref_no } }, method: "POST" })
    if (response?.status == 200) {
      alert("updated successfully");
      location.reload();
    }
  };

  const handleAdd = async () => {
    updateReputedPartner(reputedPartnersDetails);
    setReputedPartnersDetails({});
  };

  const handleRowDelete = (index: number) => {
    // Remove the testing facility at the given index from the testingDetail store
    const updateReputedPartners = reputedPartners.filter((_, itemIndex) => itemIndex !== index);
    reset();
    updateReputedPartners.forEach(item => updateReputedPartner(item));
  };


  return (
    <div className="flex flex-col bg-white rounded-lg p-3 w-full">
      <div className="flex justify-between items-center border-b-2">
        <h1 className="font-semibold text-[18px]">
          Reputed Partners
        </h1><Button onClick={() => { setIsDisabled(prev => !prev) }} className={`mb-2 ${isAmendment == 1?"":"hidden"}`}>{isDisabled ? "Enable Edit" : "Disable Edit"}</Button><Button onClick={() => { setIsDisabled(prev => !prev) }} className="mb-2">{isDisabled ? "Enable Edit" : "Disable Edit"}</Button>
      </div>
      <div className={`grid grid-cols-3 gap-6 p-3 ${isDisabled ? "hidden" : ""}`}>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Company Name
          </h1>
          <Input disabled={isDisabled} className="disabled:opacity-100" placeholder="" value={reputedPartnersDetails?.company_name ?? ""} onChange={(e) => { setReputedPartnersDetails((prev: any) => ({ ...prev, company_name: e.target.value })) }} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Supplied Qty. & Year
          </h1>
          <Input placeholder="" disabled={isDisabled} className="disabled:opacity-100" value={reputedPartnersDetails?.supplied_qtyyear ?? ""} onChange={(e) => { setReputedPartnersDetails((prev: any) => ({ ...prev, supplied_qtyyear: e.target.value })) }} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Remarks
          </h1>
          <Input placeholder="" disabled={isDisabled} className="disabled:opacity-100" value={reputedPartnersDetails?.remarks ?? ""} onChange={(e) => { setReputedPartnersDetails((prev: any) => ({ ...prev, remarks: e.target.value })) }} />
        </div>
        <div className="col-span-1 flex items-end">
          <Button className={`bg-blue-400 hover:bg-blue-300 ${isDisabled ? "hidden" : ""}`} onClick={() => { handleAdd() }}>Add</Button>
        </div>
      </div>

      <div className="shadow- bg-[#f6f6f7] p-4 mb-4 mt-4 rounded-2xl">
        <div className="flex w-full justify-between pb-4">
          <h1 className="text-[20px] text-[#03111F] font-semibold">
            Reputed Partners
          </h1>
        </div>
        <Table className=" max-h-40 overflow-y-scroll">
          <TableHeader className="text-center">
            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
              <TableHead className="w-[100px]">Sr No.</TableHead>
              <TableHead className="text-center">Company Name</TableHead>
              <TableHead className="text-center">Supplied Quantity</TableHead>
              <TableHead className="text-center">Remarks</TableHead>
              <TableHead className="text-center">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-center">
            {reputedPartners?.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{item?.company_name}</TableCell>
                <TableCell>{item?.supplied_qtyyear}</TableCell>
                <TableCell>{item?.remarks}</TableCell>
                <TableCell>
                  <Button className={`${isDisabled ? "hidden" : ""}`} onClick={() => { handleRowDelete(index) }}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className={`flex justify-end pr-4 ${isDisabled ? "hidden" : ""}`}><Button onClick={() => { handleSubmit() }}>Next</Button></div>
    </div>
  );
};

export default ReputedPartners;

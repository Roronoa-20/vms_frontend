'use client'
import React, { useState } from "react";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../atoms/select";
import { Input } from "../../atoms/input";
import { SelectContent } from "../../atoms/select";
import { usePaymentDetailStore } from "@/src/store/paymentDetailStore";
import { TbankNameDropdown, TCurrencyDropdown, VendorOnboardingResponse } from "@/src/types/types";
import { Button } from "../../atoms/button";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import { useAuth } from "@/src/context/AuthContext";

interface Props {
  ref_no:string,
  onboarding_ref_no:string,
  bankNameDropown:TbankNameDropdown["data"];
  currencyDropown:TCurrencyDropdown["data"]
  OnboardingDetail:VendorOnboardingResponse["message"]["payment_details_tab"]
}


const PaymentDetail = ({ref_no,onboarding_ref_no,bankNameDropown,currencyDropown,OnboardingDetail}:Props) => {
  const {paymentDetail,updatePaymentDetail} = usePaymentDetailStore()
  const [bankProofFile,setBankProofFile] = useState<FileList | null>(null);
  const {designation} = useAuth();
  if(!designation){
    return(
      <div>Loading...</div>
    )
  }
  const handleSubmit = async()=>{
    const submitUrl = API_END_POINTS?.bankSubmit;
    const updatedData = {...paymentDetail,ref_no:ref_no,vendor_onboarding:onboarding_ref_no}
    const formData = new FormData()
    formData.append("data",JSON.stringify(updatedData));
    if(bankProofFile){
      formData.append("file",bankProofFile[0])
    }
    const response:AxiosResponse = await requestWrapper({url:submitUrl,method:"POST",data:formData})
    if(response?.status == 200){
      console.log("successfully submitted")
    }
  }
  return (
    <div className="flex flex-col bg-white rounded-lg px-4 pb-4 max-h-[80vh] overflow-y-scroll w-full">
      <h1 className="border-b-2 pb-2 mb-4 sticky top-0 bg-white py-4 text-lg">
        Company Address
      </h1>
      <h1 className="pl-2 ">Billing Address</h1>
      <div className="grid grid-cols-3 gap-6 p-5">
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Bank Name
          </h1>
          <Select value={paymentDetail?.bank_name ?? OnboardingDetail?.bank_name} onValueChange={(value)=>{updatePaymentDetail("bank_name",value)}}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  bankNameDropown?.map((item,index)=>(
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            IFSC Code
          </h1>
          <Input placeholder="" value={paymentDetail?.ifsc_code ?? OnboardingDetail?.ifsc_code} onChange={(e)=>{updatePaymentDetail("ifsc_code",e.target.value)}}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Account Number
          </h1>
          <Input placeholder="" value={paymentDetail?.account_number ?? OnboardingDetail?.account_number} onChange={(e)=>{updatePaymentDetail("account_number",e.target.value)}}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Name of Account Holder
          </h1>
          <Input placeholder="" value={paymentDetail?.name_of_account_holder ?? OnboardingDetail?.name_of_account_holder} onChange={(e)=>{updatePaymentDetail("name_of_account_holder",e.target.value)}}/>
        </div>

        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Type of Account
          </h1>
          <Select value={paymentDetail?.type_of_account ?? OnboardingDetail?.type_of_account} onValueChange={(value)=>{updatePaymentDetail("type_of_account",value)}}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Savings Account">Savings Account</SelectItem>
                <SelectItem value="Current Account">Current Account</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Currency
          </h1>
          <Select value={paymentDetail?.currency ?? OnboardingDetail?.currency} onValueChange={(value)=>{updatePaymentDetail("currency",value)}}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  currencyDropown?.map((item,index)=>(
                    <SelectItem value={item?.name} key={index}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Bank Proof (Upload Passbook Leaf/Cancelled Cheque)
          </h1>
          <Input placeholder=""  type="file" onChange={(e)=>{setBankProofFile(e.target.files)}} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Preferred Transaction:
          </h1>
          <div className="flex justify-start gap-3">
            <div className="flex items-center gap-3">
              <Input placeholder="" type="checkbox" checked={(paymentDetail?.rtgs ?? OnboardingDetail?.rtgs) == 1} className="w-4" onChange={(e)=>{updatePaymentDetail("rtgs",e.target.checked?1:0)}}/>
              <h1>RTGS</h1>
            </div>
            <div className="flex items-center gap-3">
              <Input placeholder="" type="checkbox" checked={(paymentDetail?.neft ?? OnboardingDetail?.neft) == 1} className="w-4" onChange={(e)=>{updatePaymentDetail("neft",e.target.checked?1:0)}}/>
              <h1>NEFT</h1>
            </div>
          </div>
        </div>
      </div>
      <div className={`flex justify-end pr-4 ${designation?"hidden":""} `}><Button className="bg-blue-400 hover:to-blue-400" onClick={()=>{handleSubmit()}}>Next</Button></div>
    </div>
  );
};

export default PaymentDetail;

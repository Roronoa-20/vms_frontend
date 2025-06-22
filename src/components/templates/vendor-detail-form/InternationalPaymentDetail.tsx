'use client'
import React, { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";
import { UsePurchaseTeamApprovalStore } from "@/src/store/PurchaseTeamApprovalStore";

interface Props {
  ref_no:string,
  onboarding_ref_no:string,
  OnboardingDetail:VendorOnboardingResponse["message"]["payment_details_tab"],
  company_name?:string
}


const PaymentDetail = ({ref_no,onboarding_ref_no,OnboardingDetail,company_name}:Props) => {
  const {paymentDetail,updatePaymentDetail} = usePaymentDetailStore()
  const [bankProofFile,setBankProofFile] = useState<FileList | null>(null);
  const [isBankFilePreview, setIsBankFilePreview] = useState<boolean>(true);
  const [isPurchaseBankFilePreview, setPurchaseIsBankFilePreview] = useState<boolean>(true);
  const [bankNameDropown,setBankNameDropown] = useState<TbankNameDropdown["message"]["data"]>([])
  const [currencyDropdown,setCurrencyDropdown] = useState<TCurrencyDropdown["message"]["data"]>([])
  const {designation} = useAuth();
  const {setBankProof,bank_proof} = UsePurchaseTeamApprovalStore();
  // if(!designation){
  //   return(
  //     <div>Loading...</div>
  //   )
  // }
  const router = useRouter()
  useEffect(()=>{
    const fetchBank = async ()=>{

      const bankNameDropdownUrl = `${API_END_POINTS?.bankNameDropdown}?company_name=${company_name}`;
      const bankNameResponse:AxiosResponse = await requestWrapper({url:bankNameDropdownUrl,method:"GET"});
      if(bankNameResponse?.status == 200){
        setBankNameDropown(bankNameResponse?.data?.message?.data)
      }
    }
    console.log(OnboardingDetail,"payment details data")
    const fetchCurrency = async ()=>{

      const currencyUrl = `${API_END_POINTS?.currencyDropdown}`;
      const currencyResponse:AxiosResponse = await requestWrapper({url:currencyUrl,method:"GET"});
      if(currencyResponse?.status == 200){
        setCurrencyDropdown(currencyResponse?.data?.message?.data)
      }
    }

    fetchBank();
    fetchCurrency();
  },[])
  const handleSubmit = async()=>{
    const submitUrl = API_END_POINTS?.bankSubmit;
    const updatedData = {...paymentDetail,ref_no:ref_no,vendor_onboarding:onboarding_ref_no}
    const formData = new FormData()
    formData.append("data",JSON.stringify(updatedData));
    if(bankProofFile){
      formData.append("bank_proof",bankProofFile[0])
    }
    const response:AxiosResponse = await requestWrapper({url:submitUrl,method:"POST",data:formData})
    
      if(response?.status == 200) router.push(`/vendor-details-form?tabtype=Contact%20Detail&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`);
    
  }
  console.log(OnboardingDetail?.bank_proof?.file_name,"thiskjdvb")
  return (
    <div className="flex flex-col bg-white rounded-lg px-4 pb-4 max-h-[80vh] overflow-y-scroll w-full">
      <h1 className="border-b-2 pb-2 mb-4 sticky top-0 bg-white py-4 text-lg">
        Bank Details
      </h1>
      {/* <h1 className="pl-2 ">Billing Address</h1> */}
      <div className="grid grid-cols-3 gap-6 p-5">
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Beneficiary Name
          </h1>
          <Input placeholder="" value={paymentDetail?.ifsc_code ?? OnboardingDetail?.ifsc_code ?? ""} onChange={(e)=>{updatePaymentDetail("ifsc_code",e.target.value)}}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Beneficiary Bank Name
          </h1>
          <Select value={paymentDetail?.type_of_account ?? OnboardingDetail?.type_of_account ?? ""} onValueChange={(value)=>{updatePaymentDetail("type_of_account",value)}}>
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
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Beneficiary Account No.
          </h1>
          <Input placeholder="" value={paymentDetail?.account_number ?? OnboardingDetail?.account_number ?? ""} onChange={(e)=>{updatePaymentDetail("account_number",e.target.value)}}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Beneficiary IBAN No.
          </h1>
          <Input placeholder="" value={paymentDetail?.name_of_account_holder ?? OnboardingDetail?.name_of_account_holder ?? ""} onChange={(e)=>{updatePaymentDetail("name_of_account_holder",e.target.value)}}/>
        </div>

        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Beneficiary Bank Address
          </h1>
          <Input placeholder="" value={paymentDetail?.ifsc_code ?? OnboardingDetail?.ifsc_code ?? ""} onChange={(e)=>{updatePaymentDetail("ifsc_code",e.target.value)}}/>
        </div>
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Beneficiary Bank Swift Code
          </h1>
         <Input placeholder="" value={paymentDetail?.ifsc_code ?? OnboardingDetail?.ifsc_code ?? ""} onChange={(e)=>{updatePaymentDetail("ifsc_code",e.target.value)}}/>
        </div>
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Beneficiary ABA No.
          </h1>
          <Input placeholder="" value={paymentDetail?.ifsc_code ?? OnboardingDetail?.ifsc_code ?? ""} onChange={(e)=>{updatePaymentDetail("ifsc_code",e.target.value)}}/>
        </div>
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Beneficiary ACH No.
          </h1>
          <Input placeholder="" value={paymentDetail?.ifsc_code ?? OnboardingDetail?.ifsc_code ?? ""} onChange={(e)=>{updatePaymentDetail("ifsc_code",e.target.value)}}/>
        </div>
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Beneficiary Routing No.
          </h1>
          <Input placeholder="" value={paymentDetail?.ifsc_code ?? OnboardingDetail?.ifsc_code ?? ""} onChange={(e)=>{updatePaymentDetail("ifsc_code",e.target.value)}}/>
        </div>
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Beneficiary Currency
          </h1>
          <Input placeholder="" value={paymentDetail?.ifsc_code ?? OnboardingDetail?.ifsc_code ?? ""} onChange={(e)=>{updatePaymentDetail("ifsc_code",e.target.value)}}/>
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Bank Proof (Upload Passbook Leaf/Cancelled Cheque)
          </h1>
          <div className="flex gap-4">
          <Input placeholder=""  type="file" onChange={(e)=>{setBankProofFile(e.target.files)}} />
          {/* file preview */}
          {isBankFilePreview &&
              !bankProofFile &&
              OnboardingDetail?.bank_proof?.url && (
                <div className="flex gap-2">
                  <Link
                  target="blank"
                  href={OnboardingDetail?.bank_proof?.url}
                  className="underline text-blue-300 max-w-44 truncate"
                  >
                    <span>{OnboardingDetail?.bank_proof?.file_name}</span>
                  </Link>
                  <X
                    className="cursor-pointer"
                    onClick={() => {
                      setIsBankFilePreview((prev) => !prev);
                    }}
                    />
                </div>
              )}
              </div>
        </div>
      </div>
        <div className="w-full flex justify-start items-center gap-4 pl-10"><Input className="w-4" type="checkbox"/><h1 className="text-[15px] font-semibold">
            Add Intermediate Bank Details
          </h1></div>
          <div className="grid grid-cols-3 gap-6 p-5">
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Intermidiate Name
          </h1>
          <Input placeholder="" value={paymentDetail?.ifsc_code ?? OnboardingDetail?.ifsc_code ?? ""} onChange={(e)=>{updatePaymentDetail("ifsc_code",e.target.value)}}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Intermidiate Bank Name
          </h1>
          <Select value={paymentDetail?.type_of_account ?? OnboardingDetail?.type_of_account ?? ""} onValueChange={(value)=>{updatePaymentDetail("type_of_account",value)}}>
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
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Intermidiate Account No.
          </h1>
          <Input placeholder="" value={paymentDetail?.account_number ?? OnboardingDetail?.account_number ?? ""} onChange={(e)=>{updatePaymentDetail("account_number",e.target.value)}}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Intermidiate IBAN No.
          </h1>
          <Input placeholder="" value={paymentDetail?.name_of_account_holder ?? OnboardingDetail?.name_of_account_holder ?? ""} onChange={(e)=>{updatePaymentDetail("name_of_account_holder",e.target.value)}}/>
        </div>

        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Intermidiate Bank Address
          </h1>
          <Input placeholder="" value={paymentDetail?.ifsc_code ?? OnboardingDetail?.ifsc_code ?? ""} onChange={(e)=>{updatePaymentDetail("ifsc_code",e.target.value)}}/>
        </div>
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Intermidiate Bank Swift Code
          </h1>
         <Input placeholder="" value={paymentDetail?.ifsc_code ?? OnboardingDetail?.ifsc_code ?? ""} onChange={(e)=>{updatePaymentDetail("ifsc_code",e.target.value)}}/>
        </div>
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Intermidiate ABA No.
          </h1>
          <Input placeholder="" value={paymentDetail?.ifsc_code ?? OnboardingDetail?.ifsc_code ?? ""} onChange={(e)=>{updatePaymentDetail("ifsc_code",e.target.value)}}/>
        </div>
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Intermidiate ACH No.
          </h1>
          <Input placeholder="" value={paymentDetail?.ifsc_code ?? OnboardingDetail?.ifsc_code ?? ""} onChange={(e)=>{updatePaymentDetail("ifsc_code",e.target.value)}}/>
        </div>
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Intermidiate Routing No.
          </h1>
          <Input placeholder="" value={paymentDetail?.ifsc_code ?? OnboardingDetail?.ifsc_code ?? ""} onChange={(e)=>{updatePaymentDetail("ifsc_code",e.target.value)}}/>
        </div>
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Intermidiate Currency
          </h1>
          <Input placeholder="" value={paymentDetail?.ifsc_code ?? OnboardingDetail?.ifsc_code ?? ""} onChange={(e)=>{updatePaymentDetail("ifsc_code",e.target.value)}}/>
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Bank Proof (Upload Passbook Leaf/Cancelled Cheque)
          </h1>
          <div className="flex gap-4">
          <Input placeholder=""  type="file" onChange={(e)=>{setBankProofFile(e.target.files)}} />
          {/* file preview */}
          {isBankFilePreview &&
              !bankProofFile &&
              OnboardingDetail?.bank_proof?.url && (
                <div className="flex gap-2">
                  <Link
                  target="blank"
                  href={OnboardingDetail?.bank_proof?.url}
                  className="underline text-blue-300 max-w-44 truncate"
                  >
                    <span>{OnboardingDetail?.bank_proof?.file_name}</span>
                  </Link>
                  <X
                    className="cursor-pointer"
                    onClick={() => {
                      setIsBankFilePreview((prev) => !prev);
                    }}
                    />
                </div>
              )}
              </div>
        </div>
      </div>
      <div className={`flex justify-end pr-4 ${designation?"hidden":""} `}><Button className="bg-blue-400 hover:to-blue-400" onClick={()=>{handleSubmit()}}>Next</Button></div>
    </div>
  );
};

export default PaymentDetail;

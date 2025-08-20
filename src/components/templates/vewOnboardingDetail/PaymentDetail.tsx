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
  const [isDisabled,setIsDisabled] = useState<boolean>(true);
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
  console.log(OnboardingDetail,"this is country");
  useEffect(()=>{
    const fetchBank = async ()=>{

      const bankNameDropdownUrl = `${API_END_POINTS?.bankNameDropdown}`;
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

  const [errors, setErrors] = useState<any>({});
  const validate = () => {
    const errors:any = {};
    // if (!paymentDetail?.bank_name) {
    //   errors.bank_name = "Please Enter Bank Name";
    // }
    // if (!paymentDetail?.ifsc_code) {
    //   errors.ifsc_code = "Please Enter ifsc code";
    // }

    // if (!paymentDetail?.account_number) {
    //   errors.account_number = "Please Enter Account Number ";

    // } 

    // if (!paymentDetail?.name_of_account_holder) {
    //   errors.name_of_account_holder = "Please Enter Account Holder ";

    // } 

    // if (!paymentDetail?.type_of_account) {
    //   errors.type_of_account = "Please Enter Type Of Account";

    // } 

    // if (!bankProofFile) {
    //   errors.bank_proof = "Please Upload Bank Proof";

    // } 

    return errors;
  };

  const handleSubmit = async()=>{
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const submitUrl = API_END_POINTS?.bankSubmit;
    const updatedData = {...paymentDetail,ref_no:ref_no,vendor_onboarding:onboarding_ref_no}
    const formData = new FormData()
    formData.append("data",JSON.stringify(updatedData));
    if(bankProofFile){
      formData.append("bank_proof",bankProofFile[0])
    }
    const response:AxiosResponse = await requestWrapper({url:submitUrl,method:"POST",data:formData})
    
      if(response?.status == 200) router.push(`${designation == "Purchase Team" || designation == "Purchase Head"?`/view-onboarding-details?tabtype=Manufacturing%20Detail&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`:`/view-onboarding-details?tabtype=Contact%20Detail&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`}`);
    
  }
  console.log(OnboardingDetail?.bank_proof?.file_name,"thiskjdvb")
  return (
    <div className="flex flex-col bg-white rounded-lg p-3 w-full">
      <div className="flex justify-between items-center border-b-2">
        <h1 className="font-semibold text-[18px]">Bank Details</h1>
      <Button onClick={()=>{setIsDisabled(prev=>!prev)}} className="mb-2">{isDisabled?"Enable Edit":"Disable Edit"}</Button>
      </div>
      <div className="grid grid-cols-3 gap-6 p-3">
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Bank Name <span className="pl-2 text-red-400 text-2xl">*</span>
          </h1>
          <Select disabled={isDisabled} value={paymentDetail?.bank_name ?? OnboardingDetail?.bank_name ?? ""} onValueChange={(value)=>{updatePaymentDetail("bank_name",value)}}>
            <SelectTrigger className="disabled:opacity-100">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  bankNameDropown?.map((item,index)=>(
                    <SelectItem key={index} value={item?.name}>{item?.bank_name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
                      {errors?.bank_name && !paymentDetail?.bank_name && <span style={{ color: 'red' }}>{errors?.bank_name}</span>}

        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            IFSC Code <span className="pl-2 text-red-400 text-2xl">*</span>
          </h1>
          <Input className="disabled:opacity-100" disabled={isDisabled} placeholder="" value={paymentDetail?.ifsc_code ?? OnboardingDetail?.ifsc_code ?? ""} onChange={(e)=>{updatePaymentDetail("ifsc_code",e.target.value)}}/>
                      {errors?.ifsc_code && !paymentDetail?.ifsc_code && <span style={{ color: 'red' }}>{errors?.ifsc_code}</span>}

        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Account Number <span className="pl-2 text-red-400 text-2xl">*</span>
          </h1>
          <Input disabled={isDisabled} className="disabled:opacity-100" placeholder="" value={paymentDetail?.account_number ?? OnboardingDetail?.account_number ?? ""} onChange={(e)=>{updatePaymentDetail("account_number",e.target.value)}}/>
          {errors?.account_number && !paymentDetail?.account_number && <span style={{ color: 'red' }}>{errors?.account_number}</span>}
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Name of Account Holder <span className="pl-2 text-red-400 text-2xl">*</span>
          </h1>
          <Input disabled={isDisabled} className="disabled:opacity-100" placeholder="" value={paymentDetail?.name_of_account_holder ?? OnboardingDetail?.name_of_account_holder ?? ""} onChange={(e)=>{updatePaymentDetail("name_of_account_holder",e.target.value)}}/>
          {errors?.name_of_account_holder && !paymentDetail?.name_of_account_holder && <span style={{ color: 'red' }}>{errors?.name_of_account_holder}</span>}
        </div>

        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Type of Account <span className="pl-2 text-red-400 text-2xl">*</span>
          </h1>
          <Select disabled={isDisabled} value={paymentDetail?.type_of_account ?? OnboardingDetail?.type_of_account ?? ""} onValueChange={(value)=>{updatePaymentDetail("type_of_account",value)}}>
            <SelectTrigger className="disabled:opacity-100">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Savings Account">Savings Account</SelectItem>
                <SelectItem value="Current Account">Current Account</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors?.type_of_account && !paymentDetail?.type_of_account && <span style={{ color: 'red' }}>{errors?.type_of_account}</span>}
        </div>
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-6">
            Currency 
          </h1>
          <Select disabled={isDisabled} value={paymentDetail?.currency ?? OnboardingDetail?.currency ?? ""} onValueChange={(value)=>{updatePaymentDetail("currency",value)}}>
            <SelectTrigger className="disabled:opacity-100">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  currencyDropdown?.map((item,index)=>(
                    <SelectItem value={item?.name} key={index}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Bank Proof (Upload Passbook Leaf/Cancelled Cheque) <span className="pl-2 text-red-400 text-2xl">*</span>
          </h1>
          <div className="flex gap-4">
          <Input className="disabled:opacity-100" disabled={isDisabled} placeholder=""  type="file" onChange={(e)=>{setBankProofFile(e.target.files)}} />
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
                    className={`cursor-pointer ${isDisabled?"hidden":""}`}
                    onClick={() => {
                      setIsBankFilePreview((prev) => !prev);
                    }}
                    />
                    {errors?.bank_proof && !bankProofFile && <span style={{ color: 'red' }}>{errors?.bank_proof}</span>}
                </div>
              )}
              </div>
        </div>
        {/* <div className="flex flex-col">
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
            <div className="flex items-center gap-3">
              <Input placeholder="" type="checkbox" checked={(paymentDetail?.ift ?? OnboardingDetail?.ift) == 1} className="w-4" onChange={(e)=>{updatePaymentDetail("ift",e.target.checked?1:0)}}/>
              <h1>IFT</h1>
            </div>
          </div>
        </div> */}
        <div></div>
      </div>
      <div className={`flex justify-end pr-4 ${isDisabled?"hidden":""} `}><Button className="bg-blue-400 hover:to-blue-400" onClick={()=>{handleSubmit()}}>Next</Button></div>
    </div>
  );
};

export default PaymentDetail;

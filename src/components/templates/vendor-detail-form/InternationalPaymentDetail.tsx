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
  ref_no: string,
  onboarding_ref_no: string,
  OnboardingDetail: VendorOnboardingResponse["message"]["payment_details_tab"],
  company_name?: string
}

interface IformData {
  international_bank_details: {
    name: string,
    beneficiary_name: string,
    beneficiary_bank_name: string,
    beneficiary_account_no: string,
    beneficiary_iban_no: string,
    beneficiary_bank_address: string,
    beneficiary_swift_code: string,
    beneficiary_aba_no: string,
    beneficiary_ach_no: string,
    beneficiary_routing_no: string,
    beneficiary_currency: string,
  },
  intermediate_bank_details: {
    name: string,
    intermediate_name: string,
    intermediate_bank_name: string,
    intermediate_account_no: string,
    intermediate_iban_no: string,
    intermediate_bank_address: string,
    intermediate_swift_code: string,
    intermediate_aba_no: string,
    intermediate_ach_no: string,
    intermediate_routing_no: string,
    intermediate_currency: string
  }
}


const PaymentDetail = ({ ref_no, onboarding_ref_no, OnboardingDetail, company_name }: Props) => {
  // const {paymentDetail,updatePaymentDetail} = usePaymentDetailStore()
  const [formData, setFormData] = useState<IformData>();
  // const [bankProofFile,setBankProofFile] = useState<FileList | null>(null);
  const [bankProofBeneficiaryFile, setBankProofBeneficiaryFile] = useState<FileList | null>(null);
  const [bankProofIntermediateFile, setBankProofIntermediateFile] = useState<FileList | null>(null);
  const [isBankFileBeneficiaryPreview, setIsBankFileBeneficiaryPreview] = useState<boolean>(true);
  const [isBankFileIntermediatePreview, setIsBankFileIntermediatePreview] = useState<boolean>(true);
  const [isIntermediateCheck, setIsIntermediateCheck] = useState<boolean>(OnboardingDetail?.international_bank_details?.[0] ? true : false);
  // const [isBankFilePreview, setIsBankFilePreview] = useState<boolean>(true);
  const [isPurchaseBankFilePreview, setPurchaseIsBankFilePreview] = useState<boolean>(true);
  const [bankNameDropown, setBankNameDropown] = useState<TbankNameDropdown["message"]["data"]>([])
  const [currencyDropdown, setCurrencyDropdown] = useState<TCurrencyDropdown["message"]["data"]>([])
  const { designation } = useAuth();
  const { setBankProof, bank_proof } = UsePurchaseTeamApprovalStore();
  // if(!designation){
  //   return(
  //     <div>Loading...</div>
  //   )
  // }

  useEffect(() => {
    const fetchCurrency = async () => {

      const currencyUrl = `${API_END_POINTS?.currencyDropdown}`;
      const currencyResponse: AxiosResponse = await requestWrapper({ url: currencyUrl, method: "GET" });
      if (currencyResponse?.status == 200) {
        setCurrencyDropdown(currencyResponse?.data?.message?.data)
      }
    }

    fetchCurrency();
  }, [])

  const requiredFields = {
    beneficiary_name:"Please Enter Beneficiary Name",
    beneficiary_bank_name:"Please Enter Beneficiary Name",
    beneficiary_account_no:"Please Enter Beneficiary Account No",
    beneficiary_iban_no:"Please Enter Beneficiary IBAN No",
    beneficiary_bank_address:"Please Enter Beneficiary Bank Address",
    beneficiary_swift_code:"Please Enter Beneficiary Bank Swift Code",
    // beneficiary_aba_no:"Please Enter Beneficiary ABA No"
  }

  const router = useRouter()
  useEffect(() => {
    const fetchBank = async () => {

      const bankNameDropdownUrl = `${API_END_POINTS?.bankNameDropdown}?company_name=${company_name}`;
      const bankNameResponse: AxiosResponse = await requestWrapper({ url: bankNameDropdownUrl, method: "GET" });
      if (bankNameResponse?.status == 200) {
        setBankNameDropown(bankNameResponse?.data?.message?.data)
      }
    }
    if (OnboardingDetail?.international_bank_details?.[0]?.name) {
      setFormData((prev: any) => ({ ...prev, international_bank_details: { ...prev?.international_bank_details, name: OnboardingDetail?.international_bank_details?.[0]?.name } }))
    }
    if (OnboardingDetail?.intermediate_bank_details?.[0]?.name) {
      setFormData((prev: any) => ({ ...prev, intermediate_bank_details: { ...prev?.intermediate_bank_details, name: OnboardingDetail?.intermediate_bank_details?.[0]?.name } }))
    }
    if (OnboardingDetail?.intermediate_bank_details?.[0]) {
      setIsIntermediateCheck(true);
    }
    console.log(OnboardingDetail, "payment details data")
    const fetchCurrency = async () => {

      const currencyUrl = `${API_END_POINTS?.currencyDropdown}`;
      const currencyResponse: AxiosResponse = await requestWrapper({ url: currencyUrl, method: "GET" });
      if (currencyResponse?.status == 200) {
        setCurrencyDropdown(currencyResponse?.data?.message?.data)
      }
    }

    fetchBank();
    fetchCurrency();
  }, [])

  const validation = ():Boolean=>{
    if(!OnboardingDetail?.international_bank_details?.[0]?.beneficiary_name && !formData?.international_bank_details?.beneficiary_name){
          alert("Please Enter Beneficiary Name");
          return true;
        }
        if(!OnboardingDetail?.international_bank_details?.[0]?.beneficiary_bank_name && !formData?.international_bank_details?.beneficiary_bank_name){
          alert("Please Enter Beneficiary Bank Name");
          return true;
        }
        if( !OnboardingDetail?.international_bank_details?.[0]?.beneficiary_account_no && !formData?.international_bank_details?.beneficiary_account_no){
          alert("Please Enter Beneficiary Account No");
          return true;
        }
        if(!OnboardingDetail?.international_bank_details?.[0]?.beneficiary_iban_no && !formData?.international_bank_details?.beneficiary_iban_no){
          alert("Please Enter Beneficiary Iban No");
          return true;
        }
        if(!OnboardingDetail?.international_bank_details?.[0]?.beneficiary_bank_address && !formData?.international_bank_details?.beneficiary_bank_address){
          alert("Please Enter Beneficiary Bank Address");
          return true;
        }
        if(!OnboardingDetail?.international_bank_details?.[0]?.beneficiary_swift_code && !formData?.international_bank_details?.beneficiary_swift_code){
          alert("Please Enter Beneficiary Swift Code");
          return true;
        }
        // if(!OnboardingDetail?.international_bank_details?.[0]?.beneficiary_aba_no && !formData?.international_bank_details?.beneficiary_aba_no){
        //   alert("Please Enter Beneficiary Aba No");
        //   return true;
        // }
        return false;
  }

  const handleSubmit = async () => {

    // for (const [key, message] of Object.entries(requiredFields)) {
        //   if (!formData?.[key as keyof IformData ]) {
        //     alert(message);
        //     return;
        //   }
        // }

        if(validation()){
          return;
        }

    const submitUrl = API_END_POINTS?.bankSubmit;
    const updatedData = { ...formData, ref_no: ref_no, vendor_onboarding: onboarding_ref_no }
    const formdata = new FormData();
    formdata.append("data", JSON.stringify({ ...updatedData, international_bank_details: [updatedData?.international_bank_details], intermediate_bank_details: [updatedData?.intermediate_bank_details] }));
    const oldBeneficiaryDoc = OnboardingDetail?.international_bank_details?.[0]?.bank_proof_for_beneficiary_bank;

    if (bankProofBeneficiaryFile) {
      formdata.append("bank_proof_for_beneficiary_bank", bankProofBeneficiaryFile[0])
    } else if (!oldBeneficiaryDoc) {
      alert("Please Upload Beneficiary BankProof");
      return;
    }
    if (bankProofIntermediateFile) {
      formdata.append("bank_proof_for_intermediate_bank", bankProofIntermediateFile[0])
    }
    const response: AxiosResponse = await requestWrapper({ url: submitUrl, method: "POST", data: formdata })

    if (response?.status == 200) router.push(`/vendor-details-form?tabtype=Contact%20Detail&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`);

  };

  const handleBack = () => {
    router.push(`/vendor-details-form?tabtype=Document%20Detail&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`);
  };

  const handleFieldChange = (e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >, bankType: string) => {
    const { name, value } = e.target;
    if (bankType == "beneficiary_details") {
      setFormData((prev: any) => ({ ...prev, international_bank_details: { ...prev?.international_bank_details, [name]: value } }));
    } else {
      setFormData((prev: any) => ({ ...prev, intermediate_bank_details: { ...prev?.intermediate_bank_details, [name]: value } }));
    }
  }
  console.log(OnboardingDetail?.bank_proof?.file_name, "thiskjdvb")
  return (
    <div className="flex flex-col bg-white rounded-lg px-4 pb-4 max-h-[80vh] overflow-y-scroll w-full">
      <h1 className="border-b-2 pb-1 font-semibold sticky top-0 bg-white py-4 text-lg">
        Bank Details
      </h1>
      <div className="grid grid-cols-3 gap-4 p-2">
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] flex">
            Beneficiary Name<span className="pl-1 text-red-400 text-xl">*</span>
          </h1>
          <Input placeholder="" name="beneficiary_name" value={formData?.international_bank_details?.beneficiary_name ?? OnboardingDetail?.international_bank_details?.[0]?.beneficiary_name ?? ""} onChange={(e) => { handleFieldChange(e, "beneficiary_details") }} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] flex">
            Beneficiary Bank Name<span className="pl-1 text-red-400 text-xl">*</span>
          </h1>
          <Input placeholder="" name="beneficiary_bank_name" value={formData?.international_bank_details?.beneficiary_bank_name ?? OnboardingDetail?.international_bank_details?.[0]?.beneficiary_bank_name ?? ""} onChange={(e) => { handleFieldChange(e, "beneficiary_details") }} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] flex">
            Beneficiary Account No.<span className="pl-1 text-red-400 text-xl">*</span>
          </h1>
          <Input placeholder="" name="beneficiary_account_no" value={formData?.international_bank_details?.beneficiary_account_no ?? OnboardingDetail?.international_bank_details?.[0]?.beneficiary_account_no ?? ""} onChange={(e) => { handleFieldChange(e, "beneficiary_details") }} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] flex">
            Beneficiary IBAN No.<span className="pl-1 text-red-400 text-xl">*</span>
          </h1>
          <Input placeholder="" name="beneficiary_iban_no" value={formData?.international_bank_details?.beneficiary_iban_no ?? OnboardingDetail?.international_bank_details?.[0]?.beneficiary_iban_no ?? ""} onChange={(e) => { handleFieldChange(e, "beneficiary_details") }} />
        </div>

        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] flex">
            Beneficiary Bank Address<span className="pl-1 text-red-400 text-xl">*</span>
          </h1>
          <Input placeholder="" name="beneficiary_bank_address" value={formData?.international_bank_details?.beneficiary_bank_address ?? OnboardingDetail?.international_bank_details?.[0]?.beneficiary_bank_address ?? ""} onChange={(e) => { handleFieldChange(e, "beneficiary_details") }} />
        </div>
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] flex">
            Beneficiary Bank Swift Code<span className="pl-1 text-red-400 text-xl">*</span>
          </h1>
          <Input placeholder="" name="beneficiary_swift_code" value={formData?.international_bank_details?.beneficiary_swift_code ?? OnboardingDetail?.international_bank_details?.[0]?.beneficiary_swift_code ?? ""} onChange={(e) => { handleFieldChange(e, "beneficiary_details") }} />
        </div>
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
            Beneficiary ABA No.
          </h1>
          <Input placeholder="" name="beneficiary_aba_no" value={formData?.international_bank_details?.beneficiary_aba_no ?? OnboardingDetail?.international_bank_details?.[0]?.beneficiary_aba_no ?? ""} onChange={(e) => { handleFieldChange(e, "beneficiary_details") }} />
        </div>
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
            Beneficiary ACH No.
          </h1>
          <Input placeholder="" name="beneficiary_ach_no" value={formData?.international_bank_details?.beneficiary_ach_no ?? OnboardingDetail?.international_bank_details?.[0]?.beneficiary_ach_no ?? ""} onChange={(e) => { handleFieldChange(e, "beneficiary_details") }} />
        </div>
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
            Beneficiary Routing No.
          </h1>
          <Input placeholder="" name="beneficiary_routing_no" value={formData?.international_bank_details?.beneficiary_routing_no ?? OnboardingDetail?.international_bank_details?.[0]?.beneficiary_routing_no ?? ""} onChange={(e) => { handleFieldChange(e, "beneficiary_details") }} />
        </div>
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] flex">
            Beneficiary Currency<span className="pl-1 text-red-400 text-xl">*</span>
          </h1>
          <Select onValueChange={(value) => { setFormData((prev: any) => ({ ...prev, international_bank_details: { ...prev?.international_bank_details, beneficiary_currency: value } })) }} value={formData?.international_bank_details?.beneficiary_currency ?? OnboardingDetail?.international_bank_details?.[0]?.beneficiary_currency ?? ""}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  currencyDropdown?.map((item, index) => (
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
          {/* <Input placeholder="" name="beneficiary_currency" value={formData?.beneficiary_currency ?? OnboardingDetail?.beneficiary_currency ?? ""} onChange={(e)=>{handleFieldChange(e)}}/> */}
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] flex">
            Bank Proof (Upload Passbook Leaf/Cancelled Cheque)<span className="pl-1 text-red-400 text-xl">*</span>
          </h1>
          <div className="flex gap-4">
            <Input placeholder="" type="file" onChange={(e) => { setBankProofBeneficiaryFile(e.target.files) }} />
            {/* file preview */}
            {isBankFileBeneficiaryPreview &&
              !bankProofBeneficiaryFile &&
              OnboardingDetail?.international_bank_details?.[0]?.bank_proof_for_beneficiary_bank?.url && (
                <div className="flex gap-2">
                  <Link
                    target="blank"
                    href={OnboardingDetail?.international_bank_details?.[0]?.bank_proof_for_beneficiary_bank?.url}
                    className="underline text-blue-300 max-w-44 truncate"
                  >
                    <span>{OnboardingDetail?.international_bank_details?.[0]?.bank_proof_for_beneficiary_bank?.file_name}</span>
                  </Link>
                  <X
                    className="cursor-pointer"
                    onClick={() => {
                      setIsBankFileBeneficiaryPreview((prev) => !prev);
                    }}
                  />
                </div>
              )}
          </div>
        </div>
      </div>
      <div className="w-full flex justify-start items-center gap-4 pl-2 pt-2"><Input className="w-4" onChange={(e) => { setIsIntermediateCheck((prev) => (!prev)) }} checked={isIntermediateCheck} type="checkbox" /><h1 className="text-[15px] font-semibold">
        Add Intermediate Bank Details
      </h1></div>
      {
        isIntermediateCheck &&
        <div className="grid grid-cols-3 gap-4 p-2">
          <div className="flex flex-col col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-2">
              Intermediate Name
            </h1>
            <Input placeholder="" name="intermediate_name" value={formData?.intermediate_bank_details?.intermediate_name ?? OnboardingDetail?.intermediate_bank_details?.[0]?.intermediate_name ?? ""} onChange={(e) => { handleFieldChange(e, "") }} />
          </div>
          <div className="col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-2">
              Intermediate Bank Name
            </h1>
            <Input placeholder="" name="intermediate_bank_name" value={formData?.intermediate_bank_details?.intermediate_bank_name ?? OnboardingDetail?.intermediate_bank_details?.[0]?.intermediate_bank_name ?? ""} onChange={(e) => { handleFieldChange(e, "") }} />
          </div>
          <div className="col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-2">
              Intermediate Account No.
            </h1>
            <Input placeholder="" name="intermediate_account_no" value={formData?.intermediate_bank_details?.intermediate_account_no ?? OnboardingDetail?.intermediate_bank_details?.[0]?.intermediate_account_no ?? ""} onChange={(e) => { handleFieldChange(e, "") }} />
          </div>
          <div className="col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-2">
              Intermediate IBAN No.
            </h1>
            <Input placeholder="" name="intermediate_iban_no" value={formData?.intermediate_bank_details?.intermediate_iban_no ?? OnboardingDetail?.intermediate_bank_details?.[0]?.intermediate_iban_no ?? ""} onChange={(e) => { handleFieldChange(e, "") }} />
          </div>

          <div className="flex flex-col col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-2">
              Intermediate Bank Address
            </h1>
            <Input placeholder="" name="intermediate_bank_address" value={formData?.intermediate_bank_details?.intermediate_bank_address ?? OnboardingDetail?.intermediate_bank_details?.[0]?.intermediate_bank_address ?? ""} onChange={(e) => { handleFieldChange(e, "") }} />
          </div>
          <div className="flex flex-col col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-2">
              Intermediate Bank Swift Code
            </h1>
            <Input placeholder="" name="intermediate_swift_code" value={formData?.intermediate_bank_details?.intermediate_swift_code ?? OnboardingDetail?.intermediate_bank_details?.[0]?.intermediate_swift_code ?? ""} onChange={(e) => { handleFieldChange(e, "") }} />
          </div>
          <div className="flex flex-col col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-2">
              Intermediate ABA No.
            </h1>
            <Input placeholder="" name="intermediate_aba_no" value={formData?.intermediate_bank_details?.intermediate_aba_no ?? OnboardingDetail?.intermediate_bank_details?.[0]?.intermediate_aba_no ?? ""} onChange={(e) => { handleFieldChange(e, "") }} />
          </div>
          <div className="flex flex-col col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-2">
              Intermediate ACH No.
            </h1>
            <Input placeholder="" name="intermediate_ach_no" value={formData?.intermediate_bank_details?.intermediate_ach_no ?? OnboardingDetail?.intermediate_bank_details?.[0]?.intermediate_ach_no ?? ""} onChange={(e) => { handleFieldChange(e, "") }} />
          </div>
          <div className="flex flex-col col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-2">
              Intermediate Routing No.
            </h1>
            <Input placeholder="" name="intermediate_routing_no" value={formData?.intermediate_bank_details?.intermediate_routing_no ?? OnboardingDetail?.intermediate_bank_details?.[0]?.intermediate_routing_no ?? ""} onChange={(e) => { handleFieldChange(e, "") }} />
          </div>
          <div className="flex flex-col col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-2">
              Intermediate Currency
            </h1>
            <Select onValueChange={(value) => { setFormData((prev: any) => ({ ...prev, intermediate_bank_details: { ...prev?.intermediate_bank_details, intermediate_currency: value } })) }} value={formData?.intermediate_bank_details?.intermediate_currency ?? OnboardingDetail?.intermediate_bank_details?.[0]?.intermediate_currency ?? ""}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {
                    currencyDropdown?.map((item, index) => (
                      <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                    ))
                  }
                </SelectGroup>
              </SelectContent>
            </Select>
            {/* <Input placeholder="" name="intermediate_currency" value={formData?.intermediate_currency ?? OnboardingDetail?.intermediate_currency ?? ""} onChange={(e)=>{handleFieldChange(e)}}/> */}
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-2">
              Intermediate Bank Proof <span className="text-[10px]">(Upload Passbook Leaf/Cancelled Cheque)</span>
            </h1>
            <div className="flex gap-4">
              <Input placeholder="" type="file" onChange={(e) => { setBankProofIntermediateFile(e.target.files) }} />
              {/* file preview */}
              {isBankFileIntermediatePreview &&
                !bankProofBeneficiaryFile &&
                OnboardingDetail?.intermediate_bank_details?.[0]?.bank_proof_for_intermediate_bank?.url && (
                  <div className="flex gap-2">
                    <Link
                      target="blank"
                      href={OnboardingDetail?.intermediate_bank_details?.[0]?.bank_proof_for_intermediate_bank?.url}
                      className="underline text-blue-300 max-w-44 truncate"
                    >
                      <span>{OnboardingDetail?.intermediate_bank_details?.[0]?.bank_proof_for_intermediate_bank?.file_name}</span>
                    </Link>
                    <X
                      className="cursor-pointer"
                      onClick={() => {
                        setIsBankFileIntermediatePreview((prev) => !prev);
                      }}
                    />
                  </div>
                )}
            </div>
          </div>
        </div>
      }
      <div className="flex justify-end items-center space-x-3 mt-3">
        <Button
          onClick={handleBack}
          variant="backbtn"
          size="backbtnsize"
        >
          Back
        </Button>

        <Button
          onClick={handleSubmit}
          variant="nextbtn"
          size="nextbtnsize"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default PaymentDetail;

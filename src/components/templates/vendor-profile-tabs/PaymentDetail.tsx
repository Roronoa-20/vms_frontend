"use client";
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
import {
  TbankNameDropdown,
  TCurrencyDropdown,
  VendorOnboardingResponse,
} from "@/src/types/types";
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
  ref_no: string;
  onboarding_ref_no: string;
  OnboardingDetail: VendorOnboardingResponse["message"]["payment_details_tab"];
  company_name?: string;
  onNextTab?: () => void;
  onBackTab?: () => void;
}

const PaymentDetail = ({ref_no, onboarding_ref_no, OnboardingDetail, company_name, onNextTab, onBackTab}: Props) => {
  const { paymentDetail, updatePaymentDetail } = usePaymentDetailStore();
  const [bankProofFile, setBankProofFile] = useState<FileList | null>(null);
  const [isBankFilePreview, setIsBankFilePreview] = useState<boolean>(true);
  const [isPurchaseBankFilePreview, setPurchaseIsBankFilePreview] = useState<boolean>(true);
  const [bankNameDropown, setBankNameDropown] = useState<TbankNameDropdown["message"]["data"]>([]);
  const [currencyDropdown, setCurrencyDropdown] = useState<TCurrencyDropdown["message"]["data"]>([]);
  const { designation } = useAuth();

  const { setBankProof, bank_proof } = UsePurchaseTeamApprovalStore();
 
  const router = useRouter();
  console.log(OnboardingDetail, "this is country");
  useEffect(() => {
    const fetchBank = async () => {
      const bankNameDropdownUrl = `${API_END_POINTS?.bankNameDropdown}`;
      const bankNameResponse: AxiosResponse = await requestWrapper({
        url: bankNameDropdownUrl,
        method: "GET",
      });
      if (bankNameResponse?.status == 200) {
        setBankNameDropown(bankNameResponse?.data?.message?.data);
      }
    };
    console.log(OnboardingDetail, "payment details data");
    const fetchCurrency = async () => {
      const currencyUrl = `${API_END_POINTS?.currencyDropdown}`;
      const currencyResponse: AxiosResponse = await requestWrapper({
        url: currencyUrl,
        method: "GET",
      });
      if (currencyResponse?.status == 200) {
        setCurrencyDropdown(currencyResponse?.data?.message?.data);
      }
    };

    fetchBank();
    fetchCurrency();
  }, []);

  const [errors, setErrors] = useState<any>({});
  const validate = () => {
    const errors: any = {};
    if (!paymentDetail?.bank_name) {
      errors.bank_name = "Please Enter Bank Name";
    }
    if (!paymentDetail?.ifsc_code) {
      errors.ifsc_code = "Please Enter ifsc code";
    }

    if (!paymentDetail?.account_number) {
      errors.account_number = "Please Enter Account Number ";
    }

    if (!paymentDetail?.name_of_account_holder) {
      errors.name_of_account_holder = "Please Enter Account Holder ";
    }

    if (!paymentDetail?.type_of_account) {
      errors.type_of_account = "Please Enter Type Of Account";
    }

    if (!bankProofFile) {
      errors.bank_proof = "Please Upload Bank Proof";
    }

    return errors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();

    if (!bankProofFile) {
      alert("Please upload bank proof");
      return;
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const submitUrl = API_END_POINTS?.bankSubmit;
    const updatedData = {
      ...paymentDetail,
      ref_no: ref_no,
      vendor_onboarding: onboarding_ref_no,
    };
    const formData = new FormData();
    formData.append("data", JSON.stringify(updatedData));
    if (bankProofFile) {
      formData.append("bank_proof", bankProofFile[0]);
    }
    const response: AxiosResponse = await requestWrapper({
      url: submitUrl,
      method: "POST",
      data: formData,
    });

    if (response?.status == 200)
      router.push(
        `/vendor-details-form?tabtype=Contact%20Detail&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`
      );
  };

  const handleBack = () => {
    router.push(
      `/vendor-details-form?tabtype=Document%20Detail&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`
    );
  };

  console.log(OnboardingDetail?.bank_proof?.file_name, "thiskjdvb");

  return (
    <div className="flex flex-col bg-white rounded-lg p-4 w-full h-[calc(100vh-120px)] overflow-y-auto">
      <h1 className="border-b-2 pb-2 sticky top-0 bg-white text-lg">
        Bank Details
      </h1>
      <div className="grid grid-cols-3 gap-6 p-2">
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-1">
            Bank Name
          </h1>
          <Select
            value={
              paymentDetail?.bank_name ?? OnboardingDetail?.bank_name ?? ""
            }
            onValueChange={(value) => {
              updatePaymentDetail("bank_name", value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {bankNameDropown?.map((item, index) => (
                  <SelectItem key={index} value={item?.name}>
                    {item?.bank_name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors?.bank_name && !paymentDetail?.bank_name && (
            <span style={{ color: "red" }}>{errors?.bank_name}</span>
          )}
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-1">
            IFSC Code
          </h1>
          <Input
            placeholder=""
            value={
              paymentDetail?.ifsc_code ?? OnboardingDetail?.ifsc_code ?? ""
            }
            onChange={(e) => {
              updatePaymentDetail("ifsc_code", e.target.value);
            }}
          />
          {errors?.ifsc_code && !paymentDetail?.ifsc_code && (
            <span style={{ color: "red" }}>{errors?.ifsc_code}</span>
          )}
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-1">
            Account Number
          </h1>
          <Input
            placeholder=""
            value={
              paymentDetail?.account_number ??
              OnboardingDetail?.account_number ??
              ""
            }
            onChange={(e) => {
              updatePaymentDetail("account_number", e.target.value);
            }}
          />
          {errors?.account_number && !paymentDetail?.account_number && (
            <span style={{ color: "red" }}>{errors?.account_number}</span>
          )}
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-1">
            Name of Account Holder{" "}
          
          </h1>
          <Input
            placeholder=""
            value={
              paymentDetail?.name_of_account_holder ??
              OnboardingDetail?.name_of_account_holder ??
              ""
            }
            onChange={(e) => {
              updatePaymentDetail("name_of_account_holder", e.target.value);
            }}
          />
          {errors?.name_of_account_holder &&
            !paymentDetail?.name_of_account_holder && (
              <span style={{ color: "red" }}>
                {errors?.name_of_account_holder}
              </span>
            )}
        </div>

        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-1">
            Type of Account{" "}
          
          </h1>
          <Select
            value={
              paymentDetail?.type_of_account ??
              OnboardingDetail?.type_of_account ??
              ""
            }
            onValueChange={(value) => {
              updatePaymentDetail("type_of_account", value);
            }}
          >
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
          {errors?.type_of_account && !paymentDetail?.type_of_account && (
            <span style={{ color: "red" }}>{errors?.type_of_account}</span>
          )}
        </div>
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-1">
            Currency
          </h1>
          <Select
            value={paymentDetail?.currency ?? OnboardingDetail?.currency ?? ""}
            onValueChange={(value) => {
              updatePaymentDetail("currency", value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {currencyDropdown?.map((item, index) => (
                  <SelectItem value={item?.name} key={index}>
                    {item?.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-1">
            Bank Proof (Upload Passbook Leaf/Cancelled Cheque){" "}
          
          </h1>
          <div className="flex gap-4">
            <Input
              placeholder=""
              type="file"
              onChange={(e) => {
                setBankProofFile(e.target.files);
              }}
            />
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
                  {errors?.bank_proof && !bankProofFile && (
                    <span style={{ color: "red" }}>{errors?.bank_proof}</span>
                  )}
                </div>
              )}
          </div>
        </div>
        <div></div>
      </div>
      <div className="flex justify-end items-center space-x-3 mt-3">
        <Button onClick={onBackTab} variant="backbtn" size="backbtnsize">
          Back
        </Button>

        <Button onClick={onNextTab} variant="nextbtn" size="nextbtnsize">
          Next
        </Button>
      </div>
    </div>
  );
};

export default PaymentDetail;

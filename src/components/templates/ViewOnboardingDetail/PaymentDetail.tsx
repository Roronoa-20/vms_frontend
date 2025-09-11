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
import { X, Lock, Pencil } from "lucide-react";
import { UsePurchaseTeamApprovalStore } from "@/src/store/PurchaseTeamApprovalStore";
import SimpleFileUpload from "../../molecules/multiple_file_upload";
import { Toaster, toast } from 'sonner'

interface Props {
  ref_no: string,
  onboarding_ref_no: string,
  OnboardingDetail: VendorOnboardingResponse["message"]["payment_details_tab"],
  company_name?: string
  isAccountTeam: number,
  isAmendment: number
  isBankProof: number
  re_release: number
}


const PaymentDetail = ({ ref_no, onboarding_ref_no, OnboardingDetail, company_name, isAccountTeam, isAmendment, isBankProof, re_release }: Props) => {
  const { paymentDetail, updatePaymentDetail } = usePaymentDetailStore()
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [bankProofFile, setBankProofFile] = useState<FileList | null>(null);
  const [isBankFilePreview, setIsBankFilePreview] = useState<boolean>(true);
  const [isPurchaseBankFilePreview, setPurchaseIsBankFilePreview] = useState<boolean>(true);
  const [bankNameDropown, setBankNameDropown] = useState<TbankNameDropdown["message"]["data"]>([])
  const [currencyDropdown, setCurrencyDropdown] = useState<TCurrencyDropdown["message"]["data"]>([])
  const { designation } = useAuth();
  const [PurchaseTeambankProof, setPurchaseTeamBankProof] = useState<File>();
  const { setBankProof, bank_proof } = UsePurchaseTeamApprovalStore();
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<FileList | null>(null)
  const [rowNamesMapping, setRowNamesMapping] = useState<{ [key: string]: string }>({});

  const router = useRouter()
  useEffect(() => {
    const fetchBank = async () => {

      const bankNameDropdownUrl = `${API_END_POINTS?.bankNameDropdown}`;
      const bankNameResponse: AxiosResponse = await requestWrapper({ url: bankNameDropdownUrl, method: "GET" });
      if (bankNameResponse?.status == 200) {
        setBankNameDropown(bankNameResponse?.data?.message?.data)
      }
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

  const [errors, setErrors] = useState<any>({});
  const validate = () => {
    const errors: any = {};
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


  const FileUpload = async () => {
    const formdata = new FormData();

    if (uploadedFiles && uploadedFiles.length > 0) {
      for (let i = 0; i < uploadedFiles.length; i++) {
        formdata.append("bank_proofs_by_purchase_team", uploadedFiles[i]);
      }
    } else {
      toast.warning("No file to Upload");
      console.log("No file to upload");
    }
    formdata?.append("data", JSON.stringify({ ref_no: ref_no, vendor_onboarding: onboarding_ref_no }))

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_END}/api/method/vms.APIs.vendor_onboarding.vendor_payment_details.update_bank_proof_purchase_team`, {
        method: "POST",
        credentials: 'include',
        body: formdata,
      });

      if (!response.ok) {
        setFiles([]);
        setUploadedFiles(null);
        console.error('file upload request failed');
        return;
      }

      const data = await response.json();

      const newMapping = { ...rowNamesMapping };

      if (data.message.new_rows.bank_proofs_by_purchase_team) {
        data.message.new_rows.bank_proofs_by_purchase_team.forEach((row: any) => {
          newMapping[row.attachment_name] = row.row_name;
        });
      }
      setRowNamesMapping(newMapping);

      if (response.ok) {
        location.reload();
      }
    } catch (error) {
      setFiles([]);
      setUploadedFiles(null);
      console.error('Error uploading file:', error);
    }
  };


  const handleNext = async () => {
    const response = await FileUpload();
    location.reload()
  }

  const handleSubmit = async () => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const submitUrl = API_END_POINTS?.bankSubmit;
    const updatedData = { ...paymentDetail, ref_no: ref_no, vendor_onboarding: onboarding_ref_no }
    const formData = new FormData()
    formData.append("data", JSON.stringify(updatedData));
    if (bankProofFile) {
      formData.append("bank_proof", bankProofFile[0])
    }
    const response: AxiosResponse = await requestWrapper({ url: submitUrl, method: "POST", data: formData })

    if (response?.status == 200) {
      alert("updated successfully");
      location.reload();
    }
  }

  const uploadBankProofByPurchaseTeam = async () => {
    const formdata = new FormData();
    if (PurchaseTeambankProof != null) {
      formdata?.append("bank_proof_by_purchase_team", PurchaseTeambankProof)
    }

    formdata?.append("data", JSON.stringify({ ref_no: ref_no, vendor_onboarding: onboarding_ref_no }));

    const response: AxiosResponse = await requestWrapper({ url: API_END_POINTS?.bankProofByPurchaseTeam, method: "POST", data: formdata });
    if (response?.status == 200) {
      alert("Uploaded Successfully");
      location?.reload();
    } else {
      alert("Error in Uploading");
    }
  };

  const handleTwoWayFileDelete = async (attachment_table_name: string, row_name: string) => {
    const data = {
      ref_no: ref_no,
      vendor_onboarding: onboarding_ref_no,
      attachment_table_name: attachment_table_name,
      attachment_name: row_name
    }

    const response: AxiosResponse = await requestWrapper({
      url: API_END_POINTS?.deleteTwoWayBankFile,
      data: { data: data },
      method: "POST"
    });

    if (response?.status == 200) {
      alert("Deleted Successfully");
      location.reload();
    }
  };



  return (
    <div className="flex flex-col bg-white rounded-lg p-2 w-full">
      <div className="flex justify-between items-center border-b-2">
        <h1 className="font-semibold text-[18px]">Bank Details</h1>
        {/* <Button onClick={() => { setIsDisabled(prev => !prev) }} className={`mb-2 ${isAmendment == 1?"":"hidden"}`}>{isDisabled ? "Enable Edit" : "Disable Edit"}</Button> */}{(isAmendment == 1 || re_release == 1) && (
          <div
            onClick={() => setIsDisabled((prev) => !prev)}
            className="mb-2 inline-flex items-center gap-2 cursor-pointer rounded-[28px] border px-3 py-2 shadow-sm bg-[#5e90c0] hover:bg-gray-100 transition"
          >
            {isDisabled ? (
              <>
                <Lock className="w-5 h-5 text-red-500" />
                <span className="text-[14px] font-medium text-white hover:text-black">
                  Enable Edit
                </span>
              </>
            ) : (
              <>
                <Pencil className="w-5 h-5 text-green-600" />
                <span className="text-[14px] font-medium text-white hover:text-black">
                  Disable Edit
                </span>
              </>
            )}
          </div>
        )}

      </div>
      <div className="grid grid-cols-3 gap-6 p-2">
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Bank Name <span className="pl-2 text-red-400 text-2xl">*</span>
          </h1>
          <Select disabled={isDisabled} value={paymentDetail?.bank_name ?? OnboardingDetail?.bank_name ?? ""} onValueChange={(value) => { updatePaymentDetail("bank_name", value) }}>
            <SelectTrigger className="disabled:opacity-100">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  bankNameDropown?.map((item, index) => (
                    <SelectItem key={index} value={item?.name}>{item?.bank_code} - {item?.bank_name}</SelectItem>
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
          <Input className="disabled:opacity-100" disabled={isDisabled} placeholder="" value={paymentDetail?.ifsc_code ?? OnboardingDetail?.ifsc_code ?? ""} onChange={(e) => { updatePaymentDetail("ifsc_code", e.target.value) }} />
          {errors?.ifsc_code && !paymentDetail?.ifsc_code && <span style={{ color: 'red' }}>{errors?.ifsc_code}</span>}

        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Account Number <span className="pl-2 text-red-400 text-2xl">*</span>
          </h1>
          <Input disabled={isDisabled} className="disabled:opacity-100" placeholder="" value={paymentDetail?.account_number ?? OnboardingDetail?.account_number ?? ""} onChange={(e) => {
            const sanitizedValue = e.target.value.replace(/[-,/@]/g, "");
            updatePaymentDetail("account_number", sanitizedValue);
          }} />
          {errors?.account_number && !paymentDetail?.account_number && <span style={{ color: 'red' }}>{errors?.account_number}</span>}
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Name of Account Holder <span className="pl-2 text-red-400 text-2xl">*</span>
          </h1>
          <Input disabled={isDisabled} className="disabled:opacity-100" placeholder="" value={paymentDetail?.name_of_account_holder ?? OnboardingDetail?.name_of_account_holder ?? ""} onChange={(e) => { updatePaymentDetail("name_of_account_holder", e.target.value) }} />
          {errors?.name_of_account_holder && !paymentDetail?.name_of_account_holder && <span style={{ color: 'red' }}>{errors?.name_of_account_holder}</span>}
        </div>

        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Type of Account <span className="pl-2 text-red-400 text-2xl">*</span>
          </h1>
          <Select disabled={isDisabled} value={paymentDetail?.type_of_account ?? OnboardingDetail?.type_of_account ?? ""} onValueChange={(value) => { updatePaymentDetail("type_of_account", value) }}>
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
          <Select disabled={isDisabled} value={paymentDetail?.currency ?? OnboardingDetail?.currency ?? ""} onValueChange={(value) => { updatePaymentDetail("currency", value) }}>
            <SelectTrigger className="disabled:opacity-100">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  currencyDropdown?.map((item, index) => (
                    <SelectItem value={item?.name} key={index}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Bank Proof (Upload Passbook Leaf/Cancelled Cheque) <span className="pl-2 text-red-400 text-2xl">*</span>
          </h1>
          <div className="flex gap-4">
            <Input className="disabled:opacity-100" disabled={isDisabled} placeholder="" type="file" onChange={(e) => { setBankProofFile(e.target.files) }} />
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
                    className={`cursor-pointer ${isDisabled ? "hidden" : ""}`}
                    onClick={() => {
                      setIsBankFilePreview((prev) => !prev);
                    }}
                  />
                  {errors?.bank_proof && !bankProofFile && <span style={{ color: 'red' }}>{errors?.bank_proof}</span>}
                </div>
              )}
          </div>
        </div>
        {OnboardingDetail?.bank_proof_by_purchase_team?.url && (
        <div className="flex flex-col col-span-1 mt-3.5">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Bank Proof By Purchase Team <span className="font-semibold">(2-Way)(Old)</span>
          </h1>

          <div className="flex gap-6 items-start flex-wrap">
            {/* Old File Preview */}
            <div className="flex flex-col gap-2">
              {OnboardingDetail?.bank_proof_by_purchase_team?.url ? (
                <a
                  href={OnboardingDetail.bank_proof_by_purchase_team?.url}
                  target="_blank"
                  className="text-blue-500 underline text-sm max-w-[200px] truncate"
                >
                  {OnboardingDetail.bank_proof_by_purchase_team?.file_name || "View File"}
                </a>
              ) : (
                <span className="text-gray-400 text-sm">No file uploaded</span>
              )}
            </div>
          </div>
        </div>
        )}

        <div className="flex flex-col col-span-1">
          {/* Header */}
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            For 2-Way Verification <span className="pl-2 text-red-400 text-2xl">*</span>
          </h1>

          <div className="flex gap-6 items-start flex-wrap">
            {/* Upload Section */}
            {(isAccountTeam === 0 && designation === "Purchase Team" && isBankProof === 0) ||
              (isAccountTeam === 1 && designation === "Accounts Team" && isBankProof === 1) ? (
              <div className="flex flex-col gap-2">
                <SimpleFileUpload
                  files={files}
                  setFiles={setFiles}
                  setUploadedFiles={setUploadedFiles}
                  onNext={handleNext}
                  buttonText={'Upload Here'}
                />
              </div>
            ) : null}

            {/* Existing Files Preview Inline */}
            {OnboardingDetail?.bank_proofs_by_purchase_team?.length > 0 && (
              <div className="flex gap-2 flex-wrap items-center">
                {OnboardingDetail.bank_proofs_by_purchase_team.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Link
                      href={item?.url}
                      target="_blank"
                      className="underline text-blue-300 max-w-[150px] truncate text-sm"
                    >
                      {item?.file_name}
                    </Link>
                    <X
                      className="cursor-pointer mt-1"
                      onClick={() => {
                        const rowName = rowNamesMapping[item?.url] || (item as any)?.row_name || item?.name;
                        handleTwoWayFileDelete("bank_proofs_by_purchase_team", rowName);
                      }}
                    />
                  </div>
                ))}
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
        <div>
        </div>
      </div>
      <div className={`flex justify-end pr-4 pb-4 ${isDisabled ? "hidden" : ""} `}><Button className="py-2" variant={"nextbtn"} size={"nextbtnsize"} onClick={() => { handleSubmit() }}>Next</Button></div>
      <Toaster richColors position="top-right" />
    </div>
  );
};

export default PaymentDetail;

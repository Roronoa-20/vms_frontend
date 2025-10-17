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
import { Toaster, toast } from 'sonner'
import SimpleFileUpload from "../../molecules/multiple_file_upload";

interface Props {
  ref_no: string,
  onboarding_ref_no: string,
  OnboardingDetail: VendorOnboardingResponse["message"]["payment_details_tab"],
  company_name?: string
  isAccountTeam: number
  isAmendment: number
  isBankProof: number
  re_release: number
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

const PaymentDetail = ({ ref_no, onboarding_ref_no, OnboardingDetail, company_name, isAccountTeam, isAmendment, isBankProof, re_release }: Props) => {
  const [formData, setFormData] = useState<IformData>();
  const [bankProofBeneficiaryFile, setBankProofBeneficiaryFile] = useState<FileList | null>(null);
  const [bankProofIntermediateFile, setBankProofIntermediateFile] = useState<FileList | null>(null);
  const [isBankFileBeneficiaryPreview, setIsBankFileBeneficiaryPreview] = useState<boolean>(true);
  const [isIntermediateCheck, setIsIntermediateCheck] = useState<boolean>(OnboardingDetail?.international_bank_details?.[0] ? true : false);
  const [bankNameDropown, setBankNameDropown] = useState<TbankNameDropdown["message"]["data"]>([])
  const [currencyDropdown, setCurrencyDropdown] = useState<TCurrencyDropdown["message"]["data"]>([])
  const { designation } = useAuth();
  const [PurchaseTeamBeneficiaryProof, setPurchaseTeamBeneficiaryProof] = useState<File>();
  const [PurchaseTeamIntermediateProof, setPurchaseTeamIntermideateProof] = useState<File>();
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<FileList | null>(null)
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [rowNamesMapping, setRowNamesMapping] = useState<{ [key: string]: string }>({});
  const isTreasuryUser = designation?.toLowerCase() === "treasury";


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

  const router = useRouter();

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

  const handleSubmit = async () => {
    const submitUrl = API_END_POINTS?.bankSubmit;
    const updatedData = { ...formData, ref_no: ref_no, vendor_onboarding: onboarding_ref_no }
    const formdata = new FormData();
    formdata.append("data", JSON.stringify({ ...updatedData, international_bank_details: [updatedData?.international_bank_details], intermediate_bank_details: [updatedData?.intermediate_bank_details] }));
    if (bankProofBeneficiaryFile) {
      formdata.append("bank_proof_for_beneficiary_bank", bankProofBeneficiaryFile[0])
    }
    if (bankProofIntermediateFile) {
      formdata.append("bank_proof_for_intermediate_bank", bankProofIntermediateFile[0])
    }
    const response: AxiosResponse = await requestWrapper({ url: submitUrl, method: "POST", data: formdata })

    if (response?.status == 200) {
      alert("Updated Successfully");
      location.reload();
    }
  };

  const FileUpload = async (bankType: "Beneficiary" | "Intermediate") => {
    if (!uploadedFiles || uploadedFiles.length === 0) {
      toast.warning("No file to Upload");
      return;
    }
    const formdata = new FormData();
    if (uploadedFiles && uploadedFiles.length > 0) {
      for (let i = 0; i < uploadedFiles.length; i++) {
        if (bankType == "Beneficiary") {
          formdata.append("international_bank_proofs_by_purchase_team", uploadedFiles[i]);
        } else if (bankType == "Intermediate") {
          formdata.append("intermediate_bank_proofs_by_purchase_team", uploadedFiles[i]);
        }
      }
    } else {
      toast.warning("No file to Upload");
      console.log("No file to upload");
      return;
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

      if (bankType === "Beneficiary" && data.message.new_rows.international_bank_proofs_by_purchase_team) {
        data.message.new_rows.international_bank_proofs_by_purchase_team.forEach((row: any) => {
          newMapping[row.attachment_name] = row.row_name;
        });
      }

      if (bankType === "Intermediate" && data.message.new_rows.intermediate_bank_proofs_by_purchase_team) {
        data.message.new_rows.intermediate_bank_proofs_by_purchase_team.forEach((row: any) => {
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

  const handleNextBeneficiary = async () => {
    const response = await FileUpload("Beneficiary");
    // setTimeout(()=>{
    //   location.reload()
    // },1500)
  }


  const handleNextIntermediate = async () => {
    const response = await FileUpload("Intermediate");
    // setTimeout(()=>{
    //   location.reload()
    // },1500)
  }


  const handleFieldChange = (e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >, bankType: string) => {
    const { name, value } = e.target;
    if (bankType == "beneficiary_details") {
      setFormData((prev: any) => ({ ...prev, international_bank_details: { ...prev?.international_bank_details, [name]: value } }));
    } else {
      setFormData((prev: any) => ({ ...prev, intermediate_bank_details: { ...prev?.intermediate_bank_details, [name]: value } }));
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

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  return (
    <div className="flex flex-col bg-white rounded-lg p-3 w-full">
      <div className="flex justify-between items-center border-b-2">
        <div className="flex justify-between items-center border-b-2 w-full">
          <h1 className="font-semibold text-[18px]">Bank Details</h1>
          {/* <Button onClick={() => { setIsDisabled(prev => !prev) }} className={`mb-2 ${isAmendment == 1?"":"hidden"}`}>{isDisabled ? "Enable Edit" : "Disable Edit"}</Button> */}
          {designation == "Purchase Team" && !isTreasuryUser && isClient && (isAmendment == 1 || re_release == 1) && (
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
      </div>
      <div className="grid grid-cols-3 gap-6 p-3">
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Beneficiary Name
          </h1>
          <Input placeholder="" disabled={isDisabled} name="beneficiary_name" value={formData?.international_bank_details?.beneficiary_name ?? OnboardingDetail?.international_bank_details?.[0]?.beneficiary_name ?? ""} onChange={(e) => { handleFieldChange(e, "beneficiary_details") }} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Beneficiary Bank Name
          </h1>
          <Input placeholder="" disabled={isDisabled} name="beneficiary_bank_name" value={formData?.international_bank_details?.beneficiary_bank_name ?? OnboardingDetail?.international_bank_details?.[0]?.beneficiary_bank_name ?? ""} onChange={(e) => { handleFieldChange(e, "beneficiary_details") }} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Beneficiary Account No.
          </h1>
          <Input placeholder="" disabled={isDisabled} name="beneficiary_account_no" value={formData?.international_bank_details?.beneficiary_account_no ?? OnboardingDetail?.international_bank_details?.[0]?.beneficiary_account_no ?? ""} onChange={(e) => { handleFieldChange(e, "beneficiary_details") }} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Beneficiary IBAN No.
          </h1>
          <Input placeholder="" disabled={isDisabled} name="beneficiary_iban_no" value={formData?.international_bank_details?.beneficiary_iban_no ?? OnboardingDetail?.international_bank_details?.[0]?.beneficiary_iban_no ?? ""} onChange={(e) => { handleFieldChange(e, "beneficiary_details") }} />
        </div>

        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Beneficiary Bank Address
          </h1>
          <Input placeholder="" disabled={isDisabled} name="beneficiary_bank_address" value={formData?.international_bank_details?.beneficiary_bank_address ?? OnboardingDetail?.international_bank_details?.[0]?.beneficiary_bank_address ?? ""} onChange={(e) => { handleFieldChange(e, "beneficiary_details") }} />
        </div>
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Beneficiary Bank Swift Code
          </h1>
          <Input placeholder="" disabled={isDisabled} name="beneficiary_swift_code" value={formData?.international_bank_details?.beneficiary_swift_code ?? OnboardingDetail?.international_bank_details?.[0]?.beneficiary_swift_code ?? ""} onChange={(e) => { handleFieldChange(e, "beneficiary_details") }} />
        </div>
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Beneficiary ABA No.
          </h1>
          <Input placeholder="" disabled={isDisabled} name="beneficiary_aba_no" value={formData?.international_bank_details?.beneficiary_aba_no ?? OnboardingDetail?.international_bank_details?.[0]?.beneficiary_aba_no ?? ""} onChange={(e) => { handleFieldChange(e, "beneficiary_details") }} />
        </div>
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Beneficiary ACH No.
          </h1>
          <Input placeholder="" disabled={isDisabled} name="beneficiary_ach_no" value={formData?.international_bank_details?.beneficiary_ach_no ?? OnboardingDetail?.international_bank_details?.[0]?.beneficiary_ach_no ?? ""} onChange={(e) => { handleFieldChange(e, "beneficiary_details") }} />
        </div>
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Beneficiary Routing No.
          </h1>
          <Input placeholder="" disabled={isDisabled} name="beneficiary_routing_no" value={formData?.international_bank_details?.beneficiary_routing_no ?? OnboardingDetail?.international_bank_details?.[0]?.beneficiary_routing_no ?? ""} onChange={(e) => { handleFieldChange(e, "beneficiary_details") }} />
        </div>
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Beneficiary Currency
          </h1>
          <Select disabled={isDisabled} onValueChange={(value) => { setFormData((prev: any) => ({ ...prev, international_bank_details: { ...prev?.international_bank_details, beneficiary_currency: value } })) }} value={formData?.international_bank_details?.beneficiary_currency ?? OnboardingDetail?.international_bank_details?.[0]?.beneficiary_currency ?? ""}>
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
        </div>
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Bank Proof (Upload Passbook Leaf/Cancelled Cheque)
          </h1>
          <div className="flex gap-4">
            <Input placeholder="" disabled={isDisabled} type="file" onChange={(e) => { setBankProofBeneficiaryFile(e.target.files) }} />
            {/* file preview */}
            {
              OnboardingDetail?.international_bank_details?.[0]?.bank_proof_for_beneficiary_bank?.url && (
                <div className="flex gap-2">
                  <Link
                    target="blank"
                    href={OnboardingDetail?.international_bank_details?.[0]?.bank_proof_for_beneficiary_bank?.url}
                    className="underline text-blue-300 max-w-44 truncate"
                  >
                    <span>{OnboardingDetail?.international_bank_details?.[0]?.bank_proof_for_beneficiary_bank?.file_name}</span>
                  </Link>
                  {
                    !isDisabled &&
                    <X
                      className="cursor-pointer"
                      onClick={() => {
                        setIsBankFileBeneficiaryPreview((prev) => !prev);
                      }}
                    />
                  }
                </div>
              )}
          </div>
        </div>
        {OnboardingDetail?.international_bank_details?.[0]?.international_bank_proof_by_purchase_team?.url && (
          <div className="flex flex-col col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Bank Proof By Purchase Team <span className="font-semibold">(2-Way)(old)</span>
              <span className="pl-2 text-red-400 text-2xl">*</span>
            </h1>
            <div className="flex gap-4">
              {(isAccountTeam === 0 && designation === "Purchase Team") ||
                (isAccountTeam === 1 && designation === "Accounts Team") ? (
                <div className="flex flex-col col-span-1">
                  <a
                    href={OnboardingDetail.international_bank_details[0].international_bank_proof_by_purchase_team.url}
                    target="_blank"
                    className="text-blue-500 underline text-sm"
                  >
                    {OnboardingDetail.international_bank_details[0].international_bank_proof_by_purchase_team.file_name || "View File"}
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        )}

        <div className="flex flex-col col-span-1">
          {/* Header */}
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            For 2-Way Verification
          </h1>

          <div className="flex gap-6 items-start flex-wrap">
            {/* Upload Section */}
            {(isAccountTeam === 0 && designation === "Purchase Team") ||
              (isAccountTeam === 1 && designation === "Accounts Team") ? (
              <div className="flex flex-col gap-2">
                <SimpleFileUpload
                  files={files}
                  setFiles={setFiles}
                  setUploadedFiles={setUploadedFiles}
                  onNext={handleNextBeneficiary}
                  buttonText={'Upload Here'}
                />
              </div>
            ) : null}
            {/* File Preview */}
            {OnboardingDetail?.international_bank_proofs_by_purchase_team &&
              OnboardingDetail.international_bank_proofs_by_purchase_team.length > 0 && (
                <div className="flex gap-2 items-center flex-col">
                  {OnboardingDetail.international_bank_proofs_by_purchase_team.map((item, index) => (
                    <div className="flex gap-2" key={index}>
                      <Link
                        target="_blank"
                        href={item?.url}
                        className="underline text-blue-300 max-w-44 truncate"
                      >
                        <span>{item?.file_name}</span>
                      </Link>

                      {/* Show delete only for uploader */}
                      {((isAccountTeam === 0 && designation === "Purchase Team") ||
                        (isAccountTeam === 1 && designation === "Accounts Team")) && (
                          <X
                            className="cursor-pointer"
                            onClick={() => {
                              const rowName =
                                rowNamesMapping[item?.url] || (item as any)?.row_name || item?.name;
                              handleTwoWayFileDelete(
                                "international_bank_proofs_by_purchase_team",
                                rowName
                              );
                            }}
                          />
                        )}
                    </div>
                  ))}
                </div>
              )}

          </div>
        </div>
      </div>

      <div className="w-full flex justify-start items-center gap-4 pl-4 pt-4"><Input className="w-4" disabled onChange={(e) => { setIsIntermediateCheck((prev) => (!prev)) }} checked={isIntermediateCheck} type="checkbox" /><h1 className="text-[15px] font-semibold">
        Add Intermediate Bank Details
      </h1></div>
      {
        isIntermediateCheck &&
        <div className="grid grid-cols-3 gap-6 p-5">
          <div className="flex flex-col col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              intermediate Name
            </h1>
            <Input placeholder="" disabled={isDisabled} name="intermediate_name" value={formData?.intermediate_bank_details?.intermediate_name ?? OnboardingDetail?.intermediate_bank_details?.[0]?.intermediate_name ?? ""} onChange={(e) => { handleFieldChange(e, "") }} />
          </div>
          <div className="col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              intermediate Bank Name
            </h1>
            <Input placeholder="" disabled={isDisabled} name="intermediate_bank_name" value={formData?.intermediate_bank_details?.intermediate_bank_name ?? OnboardingDetail?.intermediate_bank_details?.[0]?.intermediate_bank_name ?? ""} onChange={(e) => { handleFieldChange(e, "") }} />
          </div>
          <div className="col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              intermediate Account No.
            </h1>
            <Input placeholder="" disabled={isDisabled} name="intermediate_account_no" value={formData?.intermediate_bank_details?.intermediate_account_no ?? OnboardingDetail?.intermediate_bank_details?.[0]?.intermediate_account_no ?? ""} onChange={(e) => { handleFieldChange(e, "") }} />
          </div>
          <div className="col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              intermediate IBAN No.
            </h1>
            <Input placeholder="" disabled={isDisabled} name="intermediate_iban_no" value={formData?.intermediate_bank_details?.intermediate_iban_no ?? OnboardingDetail?.intermediate_bank_details?.[0]?.intermediate_iban_no ?? ""} onChange={(e) => { handleFieldChange(e, "") }} />
          </div>

          <div className="flex flex-col col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              intermediate Bank Address
            </h1>
            <Input placeholder="" disabled={isDisabled} name="intermediate_bank_address" value={formData?.intermediate_bank_details?.intermediate_bank_address ?? OnboardingDetail?.intermediate_bank_details?.[0]?.intermediate_bank_address ?? ""} onChange={(e) => { handleFieldChange(e, "") }} />
          </div>
          <div className="flex flex-col col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              intermediate Bank Swift Code
            </h1>
            <Input placeholder="" disabled={isDisabled} name="intermediate_swift_code" value={formData?.intermediate_bank_details?.intermediate_swift_code ?? OnboardingDetail?.intermediate_bank_details?.[0]?.intermediate_swift_code ?? ""} onChange={(e) => { handleFieldChange(e, "") }} />
          </div>
          <div className="flex flex-col col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              intermediate ABA No.
            </h1>
            <Input placeholder="" disabled={isDisabled} name="intermediate_aba_no" value={formData?.intermediate_bank_details?.intermediate_aba_no ?? OnboardingDetail?.intermediate_bank_details?.[0]?.intermediate_aba_no ?? ""} onChange={(e) => { handleFieldChange(e, "") }} />
          </div>
          <div className="flex flex-col col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              intermediate ACH No.
            </h1>
            <Input placeholder="" disabled={isDisabled} name="intermediate_ach_no" value={formData?.intermediate_bank_details?.intermediate_ach_no ?? OnboardingDetail?.intermediate_bank_details?.[0]?.intermediate_ach_no ?? ""} onChange={(e) => { handleFieldChange(e, "") }} />
          </div>
          <div className="flex flex-col col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              intermediate Routing No.
            </h1>
            <Input placeholder="" disabled={isDisabled} name="intermediate_routing_no" value={formData?.intermediate_bank_details?.intermediate_routing_no ?? OnboardingDetail?.intermediate_bank_details?.[0]?.intermediate_routing_no ?? ""} onChange={(e) => { handleFieldChange(e, "") }} />
          </div>
          <div className="flex flex-col col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              intermediate Currency
            </h1>
            <Select disabled={isDisabled} onValueChange={(value) => { setFormData((prev: any) => ({ ...prev, intermediate_bank_details: { ...prev?.intermediate_bank_details, intermediate_currency: value } })) }} value={formData?.intermediate_bank_details?.intermediate_currency ?? OnboardingDetail?.intermediate_bank_details?.[0]?.intermediate_currency ?? ""}>
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
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Bank Proof (Upload Passbook Leaf/Cancelled Cheque)
            </h1>
            <div className="flex gap-4">
              <Input placeholder="" disabled={isDisabled} type="file" onChange={(e) => { setBankProofIntermediateFile(e.target.files) }} />
              {
                <div className="flex gap-2 items-center flex-col">

                  {OnboardingDetail?.intermediate_bank_details?.[0]?.bank_proof_for_intermediate_bank?.url && (
                    <div className="flex gap-2">
                      <Link
                        target="blank"
                        href={OnboardingDetail?.intermediate_bank_details?.[0]?.bank_proof_for_intermediate_bank?.url}
                        className="underline text-blue-300 max-w-44 truncate"
                      >
                        <span>{OnboardingDetail?.intermediate_bank_details?.[0]?.bank_proof_for_intermediate_bank?.file_name}</span>
                      </Link>
                      {
                        !isDisabled &&
                        <X
                          className="cursor-pointer"
                          onClick={() => {
                            setIsBankFileBeneficiaryPreview((prev) => !prev);
                          }}
                        />
                      }
                    </div>
                  )}
                </div>
              }
            </div>
          </div>
          {OnboardingDetail?.intermediate_bank_details?.[0]?.intermediate_bank_proof_by_purchase_team?.url && (
            <div className="flex flex-col col-span-1">
              <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                Bank Proof By Purchase Team <span className="font-semibold">(2-Way)(old)</span>
              </h1>
              <div className="flex gap-4">
                {(isAccountTeam === 0 && designation === "Purchase Team") ||
                  (isAccountTeam === 1 && designation === "Accounts Team") ? (
                  <div className="flex flex-col col-span-1">
                    <a
                      href={OnboardingDetail?.intermediate_bank_details?.[0]?.intermediate_bank_proof_by_purchase_team?.url}
                      target="_blank"
                      className="text-blue-500 underline text-sm"
                    >
                      {OnboardingDetail?.intermediate_bank_details?.[0]?.intermediate_bank_proof_by_purchase_team?.file_name || "View File"}
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* <div>
            <div>
              <div className={`flex items-end gap-6 col-span-1 text-nowrap ${isAccountTeam == 0 && designation == "Purchase Team" && isBankProof == 1 ? "" : "hidden"}`}>
                <div className="flex flex-col gap-3">
                  <h1 className="text-[12px] font-normal text-[#626973]">
                    For 2-way Verification<span className="text-[#e60000]">*</span>
                  </h1>
                  <SimpleFileUpload files={files} setFiles={setFiles} setUploadedFiles={setUploadedFiles} onNext={handleNextIntermediate} buttonText={'Upload Here'} />
                </div>
              </div>
              <div className={`flex items-end gap-6 col-span-1 text-nowrap ${isAccountTeam == 1 && designation == "Accounts Team" && isBankProof == 1 ? "" : "hidden"}`}>
                <div className="flex flex-col gap-3">
                  <h1 className="text-[12px] font-normal text-[#626973]">
                    For 2-way Verification<span className="text-[#e60000]">*</span>
                  </h1>
                  <SimpleFileUpload files={files} setFiles={setFiles} setUploadedFiles={setUploadedFiles} onNext={handleNextIntermediate} buttonText={'Upload Here'} />
                </div>
              </div> */}

          <div className="flex flex-col col-span-1">
            {/* Header */}
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              For 2-Way Verification
            </h1>

            <div className="flex gap-6 items-start flex-wrap">
              {/* Upload Section */}
              {(isAccountTeam === 0 && designation === "Purchase Team") ||
                (isAccountTeam === 1 && designation === "Accounts Team") ? (
                <div className="flex flex-col gap-2">
                  <SimpleFileUpload
                    files={files}
                    setFiles={setFiles}
                    setUploadedFiles={setUploadedFiles}
                    onNext={handleNextIntermediate}
                    buttonText={'Upload Here'}
                  />
                </div>
              ) : null}
              {/* File Preview */}
              {OnboardingDetail?.intermediate_bank_proofs_by_purchase_team &&
                OnboardingDetail.intermediate_bank_proofs_by_purchase_team.length > 0 && (
                  <div className="flex gap-2 items-center flex-col">
                    {OnboardingDetail.intermediate_bank_proofs_by_purchase_team.map((item, index) => (
                      <div className="flex gap-2" key={index}>
                        <Link
                          target="_blank"
                          href={item?.url}
                          className="underline text-blue-300 max-w-44 truncate"
                        >
                          <span>{item?.file_name}</span>
                        </Link>

                        {/* Show delete only for uploader */}
                        {((isAccountTeam === 0 && designation === "Purchase Team") ||
                          (isAccountTeam === 1 && designation === "Accounts Team")) && (
                            <X
                              className="cursor-pointer"
                              onClick={() => {
                                const rowName =
                                  rowNamesMapping[item?.url] || (item as any)?.row_name || item?.name;
                                handleTwoWayFileDelete(
                                  "intermediate_bank_proofs_by_purchase_team",
                                  rowName
                                );
                              }}
                            />
                          )}
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        </div>
      }
      <div className={`flex justify-end pr-4 pb-2 ${isDisabled ? "hidden" : ""} `}><Button className="py-2" variant={"nextbtn"} size={"nextbtnsize"} onClick={() => { handleSubmit() }}>Next</Button></div>
    </div>
  );
};

export default PaymentDetail;

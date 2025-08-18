"use client";
import React, { useEffect } from "react";
import { Input } from "../../atoms/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../atoms/select";
import { useState } from "react";
import { Button } from "../../atoms/button";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import {
  TdocumentDetailDropdown,
  TvendorOnboardingDetail,
  VendorOnboardingResponse,
} from "@/src/types/types";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";

type formData = {
  iec: string,
  trc_certificate_no: string
}

interface Props {
  ref_no: string;
  onboarding_ref_no: string;
  OnboardingDetail: VendorOnboardingResponse["message"]["document_details_tab"];
  documentDetailDropdown: TdocumentDetailDropdown["message"]["data"];
}

const DocumentDetails = ({
  ref_no,
  onboarding_ref_no,
  OnboardingDetail,
  documentDetailDropdown,
}: Props) => {
  const router = useRouter();

  const [formData, setFormData] = useState<formData | null>(null);

  const [isIECProofPreview, setIsIECProofPreview] = useState<boolean>(true);
  const [isTRCProofPreview, setIsTRCProofPreview] = useState<boolean>(true);
  const [is10FProofPreview, setIs10FProofPreview] = useState<boolean>(true);
  const [isPEProofPreview, setIsPEProofPreview] = useState<boolean>(true);
  const [IECProof, setIECProof] = useState<FileList | null>(null);
  const [TRCProof, setTRCProof] = useState<FileList | null>(null);
  const [file10FProof, setFile10FProof] = useState<FileList | null>(null);
  const [PEProof, setPEProof] = useState<FileList | null>(null);

  const handleSubmit = async () => {
    const url = API_END_POINTS?.documentDetailSubmit;
    const updatedFormData = { ...formData, ref_no: ref_no, vendor_onboarding: onboarding_ref_no }
    const formdata = new FormData();
    formdata.append("data", JSON.stringify(updatedFormData));
    if (IECProof) {
      formdata.append("iec_proof", IECProof[0]);
    }
    if (TRCProof) {
      formdata.append("trc_certificate", TRCProof[0]);
    }
    if (file10FProof) {
      formdata.append("form_10f_proof", file10FProof[0]);
    }
    if (PEProof) {
      formdata.append("pe_certificate", PEProof[0]);
    }

    const response: AxiosResponse = await requestWrapper({ url: url, data: formdata, method: "POST" });
    if (response?.status == 200) {
      setFormData(null)
      setIECProof(null);
      setFile10FProof(null);
      setTRCProof(null);
      setPEProof(null);
      router.push(
        `/vendor-details-form?tabtype=Payment%20Detail&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`
      );
    }
  };

  const handleBack = () => {
    router.push(`/vendor-details-form?tabtype=Company%20Address&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`);
  };

  const handleFieldChange = (e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="flex flex-col bg-white rounded-lg p-4 w-full max-h-[80vh]">
      <h1 className="border-b-2 pb-2 text-lg">Document Details</h1>
      <div className="overflow-y-scroll">
        <div className="grid grid-cols-2 gap-6 p-5 ">
          <div className="col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Import/Export Code
            </h1>
            <Input
              placeholder="Enter Company Pan Number"
              // value={
              //   documentDetails?.company_pan_number ??
              //   OnboardingDetail?.company_pan_number ??
              //   ""
              // }
              value={OnboardingDetail?.iec ?? formData?.iec ?? ""}
              name="iec"
              onChange={(e) => {
                handleFieldChange(e)
              }}
            />
          </div>
          <div className="col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Upload IEC Proof
            </h1>
            <div className="flex gap-4">

              <Input
                placeholder=""
                type="file"
                onChange={(e) => {
                  setIECProof(e.target.files)
                }}
              />
              {/* file preview */}
              {isIECProofPreview &&
                !IECProof &&
                OnboardingDetail?.iec_proof?.url && (
                  <div className="flex gap-2">
                    <Link
                      target="blank"
                      href={OnboardingDetail?.iec_proof?.url}
                      className="underline text-blue-300 max-w-44 truncate"
                    >
                      <span>{OnboardingDetail?.iec_proof?.file_name}</span>
                    </Link>
                    <X
                      className="cursor-pointer"
                      onClick={() => {
                        setIsIECProofPreview((prev) => !prev);
                      }}
                    />
                  </div>
                )}
            </div>
          </div>
          <div className="col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              TRC Number
            </h1>
            <Input
              placeholder="Enter Company Pan Number"
              // value={
              //   // documentDetails?.company_pan_number ??
              //   OnboardingDetail?.company_pan_number ??
              //   ""
              // }
              value={OnboardingDetail?.trc_certificate_no ?? formData?.trc_certificate_no ?? ""}
              name="trc_certificate_no"
              onChange={(e) => {
                handleFieldChange(e)
              }}
            />
          </div>
          <div className="col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              TRC Certificate Proof
            </h1>
            <div className="flex gap-4">

              <Input
                placeholder=""
                type="file"
                onChange={(e) => {
                  setTRCProof(e.target.files)
                }}
              />
              {/* file preview */}
              {isTRCProofPreview &&
                !TRCProof &&
                OnboardingDetail?.trc_certificate?.url && (
                  <div className="flex gap-2">
                    <Link
                      target="blank"
                      href={OnboardingDetail?.trc_certificate?.url}
                      className="underline text-blue-300 max-w-44 truncate"
                    >
                      <span>{OnboardingDetail?.trc_certificate?.file_name}</span>
                    </Link>
                    <X
                      className="cursor-pointer"
                      onClick={() => {
                        setIsTRCProofPreview((prev) => !prev);
                      }}
                    />
                  </div>
                )}
            </div>
          </div>
          <div className="col-span-1">
            <h1 className="text-[12px] font-semibold  pb-3">
              Digital Form 10F
            </h1>
            <ul className="pl-4"><Link href={""} target="blank"><li className="text-blue-400 text-sm underline list-disc">View Sample form 10F Document</li></Link>
              <Link href={""} target="blank"><li className="text-blue-400 underline text-sm list-disc">Step-By-Step-Guide to generate Form 10F</li></Link>
              <Link href={""} target="blank"><li className="text-blue-400 underline text-sm list-disc">Click Here to Generate Form 10F</li></Link>
            </ul>
          </div>
          <div className="col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Digital Form 10F Proof
            </h1>
            <div className="flex gap-4">

              <Input
                placeholder=""
                type="file"
                onChange={(e) => {
                  setFile10FProof(e.target.files);
                }}
              />
              {/* file preview */}
              {is10FProofPreview &&
                !file10FProof &&
                OnboardingDetail?.form_10f_proof?.url && (
                  <div className="flex gap-2">
                    <Link
                      target="blank"
                      href={OnboardingDetail?.form_10f_proof?.url}
                      className="underline text-blue-300 max-w-44 truncate"
                    >
                      <span>{OnboardingDetail?.form_10f_proof?.file_name}</span>
                    </Link>
                    <X
                      className="cursor-pointer"
                      onClick={() => {
                        setIs10FProofPreview((prev) => !prev);
                      }}
                    />
                  </div>
                )}
            </div>
          </div>
          <div className="col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Permanent Establishment Certificate
            </h1>
            <Link className="text-blue-400 text-sm underline" href={""}>Download PE Certificate Format File</Link>
            <div className="flex gap-4 pt-2">

              <Input
                placeholder=""
                type="file"
                onChange={(e) => {
                  setPEProof(e.target.files)
                }}
              />
              {/* file preview */}
              {isPEProofPreview &&
                !PEProof &&
                OnboardingDetail?.pe_certificate?.url && (
                  <div className="flex gap-2">
                    <Link
                      target="blank"
                      href={OnboardingDetail?.pe_certificate?.url}
                      className="underline text-blue-300 max-w-44 truncate"
                    >
                      <span>{OnboardingDetail?.pe_certificate?.file_name}</span>
                    </Link>
                    <X
                      className="cursor-pointer"
                      onClick={() => {
                        setIsPEProofPreview((prev) => !prev);
                      }}
                    />
                  </div>
                )}
            </div>
          </div>
        </div>
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
    </div>
  );
};

export default DocumentDetails;

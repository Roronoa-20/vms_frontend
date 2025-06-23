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

interface documentDetail {
  company_pan_number: string;
  name_on_company_pan: string;
  msme_registered: string;
  enterprise_registration_number: string;
  msme_enterprise_type: string;
  udyam_number: string;
  name_on_udyam_certificate: string;
  panDocument: FileList;
  registrationDocument: FileList;
  gst_state: string;
  gst_number: string;
  gst_registration_date: string;
  gstDocument: FileList;
  companyNameUdyamCertificate: string;
  udyamCertificate: FileList;
  gst_ven_type: string;
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
  const [documentDetails, setDocumentDetail] =
    useState<Partial<documentDetail>>();

 




  const [isIecFilePreview, setIsPanFilePreview] = useState<boolean>(true);
  const [isPanFilePreview, setIsPanFilePreview] = useState<boolean>(true);
  const [isPanFilePreview, setIsPanFilePreview] = useState<boolean>(true);
  const [isPanFilePreview, setIsPanFilePreview] = useState<boolean>(true);

  const handleSubmit = async () => {
    const url = API_END_POINTS?.documentDetailSubmit;
    const updatedData = {
      ...documentDetails,
      msme_registered: isMSME,
      gst_table: [
        {
          name:OnboardingDetail?.gst_table?.[0]?.name,
          gst_state: documentDetails?.gst_state,
          gst_number: documentDetails?.gst_number,
          gst_registration_date: documentDetails?.gst_registration_date,
          gst_ven_type: documentDetails?.gst_ven_type,
        },
      ],
      ref_no: ref_no,
      vendor_onboarding: onboarding_ref_no,
    };
    const formData = new FormData();
    formData.append("data", JSON.stringify(updatedData));
    if (documentDetails?.registrationDocument) {
      formData.append("entity_proof", documentDetails?.registrationDocument[0]);
    }
    if (documentDetails?.panDocument) {
      formData.append("pan_proof", documentDetails?.panDocument[0]);
    }
    if (documentDetails?.gstDocument) {
      formData.append("gst_document", documentDetails?.gstDocument[0]);
    }
    if (documentDetails?.udyamCertificate) {
      formData.append("msme_proof", documentDetails?.udyamCertificate[0]);
    }
    const Response: AxiosResponse = await requestWrapper({
      url: url,
      data: formData,
      method: "POST",
    });
    if (Response?.status == 200)
      setDocumentDetail({})
      router.push(
        `/vendor-details-form?tabtype=Payment%20Detail&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`
      );
  };

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
              value={
                documentDetails?.company_pan_number ??
                OnboardingDetail?.company_pan_number ??
                ""
              }
              onChange={(e) => {
                setDocumentDetail((prev) => ({
                  ...prev,
                  company_pan_number: e.target.value,
                }));
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
                setDocumentDetail((prev: any) => ({
                  ...prev,
                  panDocument: e.target.files,
                }));
              }}
              />
            {/* file preview */}
            {isPanFilePreview &&
              !documentDetails?.panDocument &&
              OnboardingDetail?.pan_proof?.url && (
                <div className="flex gap-2">
                  <Link
                  target="blank"
                    href={OnboardingDetail?.pan_proof?.url}
                    className="underline text-blue-300 max-w-44 truncate"
                    >
                    <span>{OnboardingDetail?.pan_proof?.file_name}</span>
                  </Link>
                  <X
                    className="cursor-pointer"
                    onClick={() => {
                      setIsPanFilePreview((prev) => !prev);
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
              value={
                documentDetails?.company_pan_number ??
                OnboardingDetail?.company_pan_number ??
                ""
              }
              onChange={(e) => {
                setDocumentDetail((prev) => ({
                  ...prev,
                  company_pan_number: e.target.value,
                }));
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
                setDocumentDetail((prev: any) => ({
                  ...prev,
                  panDocument: e.target.files,
                }));
              }}
              />
            {/* file preview */}
            {isPanFilePreview &&
              !documentDetails?.panDocument &&
              OnboardingDetail?.pan_proof?.url && (
                <div className="flex gap-2">
                  <Link
                  target="blank"
                    href={OnboardingDetail?.pan_proof?.url}
                    className="underline text-blue-300 max-w-44 truncate"
                    >
                    <span>{OnboardingDetail?.pan_proof?.file_name}</span>
                  </Link>
                  <X
                    className="cursor-pointer"
                    onClick={() => {
                      setIsPanFilePreview((prev) => !prev);
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
                setDocumentDetail((prev: any) => ({
                  ...prev,
                  panDocument: e.target.files,
                }));
              }}
              />
            {/* file preview */}
            {isPanFilePreview &&
              !documentDetails?.panDocument &&
              OnboardingDetail?.pan_proof?.url && (
                <div className="flex gap-2">
                  <Link
                  target="blank"
                    href={OnboardingDetail?.pan_proof?.url}
                    className="underline text-blue-300 max-w-44 truncate"
                    >
                    <span>{OnboardingDetail?.pan_proof?.file_name}</span>
                  </Link>
                  <X
                    className="cursor-pointer"
                    onClick={() => {
                      setIsPanFilePreview((prev) => !prev);
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
                setDocumentDetail((prev: any) => ({
                  ...prev,
                  panDocument: e.target.files,
                }));
              }}
              />
            {/* file preview */}
            {isPanFilePreview &&
              !documentDetails?.panDocument &&
              OnboardingDetail?.pan_proof?.url && (
                <div className="flex gap-2">
                  <Link
                  target="blank"
                    href={OnboardingDetail?.pan_proof?.url}
                    className="underline text-blue-300 max-w-44 truncate"
                    >
                    <span>{OnboardingDetail?.pan_proof?.file_name}</span>
                  </Link>
                  <X
                    className="cursor-pointer"
                    onClick={() => {
                      setIsPanFilePreview((prev) => !prev);
                    }}
                    />
                </div>
              )}
              </div>
          </div>
        </div>
        <div className="flex justify-end pr-6">
          <Button
            className={`bg-blue-400 hover:bg-blue-400`}
            onClick={() => {
              handleSubmit();
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;

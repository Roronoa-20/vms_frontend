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
  const [BusinessType, setBusinessType] = useState<string>(
    OnboardingDetail?.gst_table[0]?.gst_ven_type
  );
  const [isMSME, setIsMSME] = useState<string>(
    OnboardingDetail?.msme_registered
  );
  const router = useRouter();
  const [documentDetails, setDocumentDetail] =
    useState<Partial<documentDetail>>();

  useEffect(()=>{
    setDocumentDetail((prev)=>(
      {...prev,gst_table:[
        {
          name:OnboardingDetail?.gst_table?.[0]?.name,
          gst_state:OnboardingDetail?.gst_table?.[0]?.gst_state,
          gst_number:OnboardingDetail?.gst_table?.[0]?.gst_number,
          gst_registration_date:OnboardingDetail?.gst_table?.[0]?.gst_registration_date,
          gst_ven_type:OnboardingDetail?.gst_table?.[0]?.gst_ven_type
        }
      ]}
    ))
  },[])


console.log(OnboardingDetail?.gst_table[0],"this is gst document")
  const [isRegistrationFilePreview, setIsRegistrationFilePreview] = useState<boolean>(true);
  const [isMsmeFilePreview, setIsMsmeFilePreview] = useState<boolean>(true);
  const [isGstFilePreview, setIsGstFilePreview] = useState<boolean>(true);
  const [isPanFilePreview, setIsPanFilePreview] = useState<boolean>(true);

    const [errors, setErrors] = useState<any>({});
  const validate = () => {
    const errors:any = {};
    if (!documentDetails?.company_pan_number) {
      errors.company_pan_number = "Please Enter Company Pan Number";
    }
    if (!documentDetails?.name_on_company_pan) {
      errors.name_on_company_pan = "Please Enter Name On Company Pan";
    }

    if (documentDetails?.gst_ven_type == "Registered" && !documentDetails?.gst_state) {
      errors.gst_state = "Please Select Gst State";

    } 
    if (documentDetails?.gst_ven_type == "Registered" && !documentDetails?.gst_number) {
      errors.gst_number = "Please Enter Gst Number";

    } 
    if (documentDetails?.gst_ven_type == "Registered" && !documentDetails?.gst_registration_date) {
      errors.gst_registration_date = "Please Select Gst Registration Date";

    } 
    if (documentDetails?.gst_ven_type == "Registered" && documentDetails?.gstDocument?.length && documentDetails?.gstDocument?.length == 0) {
      errors.gst_state = "Please Upload Gst File";

    } 

    if (documentDetails?.msme_registered == "Yes" && !documentDetails?.msme_enterprise_type) {
      errors.msme_enterprise_type = "Please Select Enterprise Type";
    } 

    if (documentDetails?.msme_registered == "Yes" && !documentDetails?.udyam_number) {
      errors.udyam_number = "Please Enter Udhyam Registration Number";
    } 

    if (documentDetails?.msme_registered == "Yes" && !documentDetails?.name_on_udyam_certificate) {
      errors.name_on_udyam_certificate = "Please Enter Name Udhyam Certificate";
    } 

    if (documentDetails?.msme_registered == "Yes" && documentDetails?.udyamCertificate?.length && documentDetails?.udyamCertificate?.length == 0) {
      errors.udyamCertificate = "Please Upload Udhyam Certificate";
    } 


    if (!documentDetails?.enterprise_registration_number) {
      errors.enterprise_registration_number = "Please Enter Enterprice Registration Number";
    }

    return errors;
  };


  const handleSubmit = async () => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
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
        `/vendor-details-form?tabtype=Payment Detail&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`
      );
  };

  return (
    <div className="flex flex-col bg-white rounded-lg p-4 w-full max-h-[80vh]">
      <h1 className="border-b-2 pb-2 text-lg">Document Details</h1>
      <div className="overflow-y-scroll">
        <div className="grid grid-cols-3 gap-6 p-5 ">
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Company PAN Number <span className="pl-2 text-red-400 text-2xl">*</span>
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
            {errors?.company_pan_number && !documentDetails?.company_pan_number && <span style={{ color: 'red' }}>{errors?.company_pan_number}</span>}
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Name of Company on PAN Card <span className="pl-2 text-red-400 text-2xl">*</span>
            </h1>
            <Input
              placeholder="Enter Pan Card"
              value={
                documentDetails?.name_on_company_pan ??
                OnboardingDetail?.name_on_company_pan ??
                ""
              }
              onChange={(e) => {
                setDocumentDetail((prev) => ({
                  ...prev,
                  name_on_company_pan: e.target.value,
                }));
              }}
            />
            {errors?.name_on_company_pan && !documentDetails?.name_on_company_pan && <span style={{ color: 'red' }}>{errors?.name_on_company_pan}</span>}
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Upload PAN Document <span className="pl-2 text-red-400 text-2xl">*</span>
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
              {errors?.panDocument && !documentDetails?.panDocument && <span style={{ color: 'red' }}>{errors?.panDocument}</span>}
              </div>
          </div>
          <div className="col-span-3 grid grid-cols-3 gap-6">
            <div className="flex flex-col">
              <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                GST Vendor Type <span className="pl-2 text-red-400 text-2xl">*</span>
              </h1>
              <Select
                onValueChange={(value) => {
                  setBusinessType(value);
                  setDocumentDetail((prev) => ({
                    ...prev,
                    gst_ven_type: value,
                  }));
                }}
                value={BusinessType ?? ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Vendor Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {documentDetailDropdown?.gst_vendor_type?.map(
                      (item, index) => (
                        <SelectItem key={index} value={item?.name}>
                          {item?.registration_ven_name}
                        </SelectItem>
                      )
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors?.gst_ven_type && !documentDetails?.gst_ven_type && <span style={{ color: 'red' }}>{errors?.gst_ven_type}</span>}
            </div>
          </div>
          <div
            className={`col-span-3 grid grid-cols-3 gap-6 ${BusinessType == "Not-Registered" || BusinessType == "" ? "hidden" : ""}`}
          >
            <div>
              <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                State <span className="pl-2 text-red-400 text-2xl">*</span>
              </h1>
              {/* <Input placeholder="Enter State" value={documentDetails?.gst_state ?? OnboardingDetail?.gst_table[0]?.gst_state} onChange={(e)=>{setDocumentDetail((prev)=>({...prev,gst_state:e.target.value}))}}/> */}
              <Select
                onValueChange={(value) => {
                  setDocumentDetail((prev) => ({ ...prev, gst_state: value }));
                }}
                value={
                  documentDetails?.gst_state ??
                  OnboardingDetail?.gst_table[0]?.gst_state
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Vendor Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {documentDetailDropdown?.state_master?.map(
                      (item, index) => (
                        <SelectItem key={index} value={item?.name}>
                          {item?.state_name}
                        </SelectItem>
                      )
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors?.gst_state && !documentDetails?.gst_state && <span style={{ color: 'red' }}>{errors?.gst_state}</span>}
            </div>
            <div>
              <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                GST Number <span className="pl-2 text-red-400 text-2xl">*</span>
              </h1>
              <Input
                placeholder="Enter GST Number"
                value={
                  documentDetails?.gst_number ??
                  OnboardingDetail?.gst_table[0]?.gst_number ??
                  ""
                }
                onChange={(e) => {
                  setDocumentDetail((prev) => ({
                    ...prev,
                    gst_number: e.target.value,
                  }));
                }}
              />
              {errors?.gst_number && !documentDetails?.gst_number && <span style={{ color: 'red' }}>{errors?.gst_number}</span>}
            </div>
            <div>
              <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                GST Registration Date <span className="pl-2 text-red-400 text-2xl">*</span>
              </h1>
              <Input
                placeholder="Enter Registration Date"
                value={
                  documentDetails?.gst_registration_date ??
                  OnboardingDetail?.gst_table[0]?.gst_registration_date ??
                  ""
                }
                type="date"
                onChange={(e) => {
                  setDocumentDetail((prev) => ({
                    ...prev,
                    gst_registration_date: e.target.value,
                  }));
                }}
              />
              {errors?.gst_registration_date && !documentDetails?.gst_registration_date && <span style={{ color: 'red' }}>{errors?.gst_registration_date}</span>}
            </div>
            <div>
              <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                Upload GST Document <span className="pl-2 text-red-400 text-2xl">*</span>
              </h1>
              <div className="flex gap-4">
              <Input
                type="file"
                onChange={(e) => {
                  setDocumentDetail((prev: any) => ({
                    ...prev,
                    gstDocument: e.target.files,
                  }));
                }}
                />
                {errors?.gstDocument && !documentDetails?.gstDocument && <span style={{ color: 'red' }}>{errors?.gstDocument}</span>}
              {/* file preview */}
            {isGstFilePreview &&
              !documentDetails?.gstDocument &&
              OnboardingDetail?.gst_table[0]?.gst_document?.url && (
                <div className="flex gap-2">
                  <Link
                  target="blank"
                    href={OnboardingDetail?.gst_table[0]?.gst_document?.url}
                    className="underline text-blue-300 max-w-44 truncate"
                    >
                    <span>{OnboardingDetail?.gst_table[0]?.gst_document?.file_name}</span>
                  </Link>
                  <X
                    className="cursor-pointer"
                    onClick={() => {
                      setIsGstFilePreview((prev) => !prev);
                    }}
                    />
                </div>
              )}
              </div>
            </div>
          </div>
          <div className="flex flex-col col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              MSME Registered?
            </h1>
            <Select
              onValueChange={(value) => {
                setIsMSME(value);
                setDocumentDetail((prev) => ({
                  ...prev,
                  company_pan_number: value,
                }));
              }}
              value={isMSME ?? OnboardingDetail?.msme_registered ?? ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div
            className={`flex flex-col col-span-1 ${isMSME == "Yes" ? "" : "hidden"}`}
          >
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              MSME Enterprise Type <span className="pl-2 text-red-400 text-2xl">*</span>
            </h1>
            <Select
              value={
                documentDetails?.msme_enterprise_type ??
                OnboardingDetail?.msme_enterprise_type
              }
              onValueChange={(value) => {
                setDocumentDetail((prev) => ({
                  ...prev,
                  msme_enterprise_type: value,
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="MSME - Micro">MSME - Micro</SelectItem>
                  <SelectItem value="MSME - Small">MSME - Small</SelectItem>
                  <SelectItem value="MSME - Medium">MSME - Medium</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors?.msme_enterprise_type && !documentDetails?.msme_enterprise_type && <span style={{ color: 'red' }}>{errors?.msme_enterprise_type}</span>}
          </div>
          <div className={`${isMSME == "Yes" ? "" : "hidden"}`}>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Udyam Registration No. <span className="pl-2 text-red-400 text-2xl">*</span>
            </h1>
            <Input
              placeholder=" Enter Udyam Registration No"
              value={
                documentDetails?.udyam_number ??
                OnboardingDetail?.udyam_number ??
                ""
              }
              onChange={(e) => {
                setDocumentDetail((prev) => ({
                  ...prev,
                  udyam_number: e.target.value,
                }));
              }}
            />
            {errors?.udyam_number && !documentDetails?.udyam_number && <span style={{ color: 'red' }}>{errors?.udyam_number}</span>}
          </div>
          <div className={`${isMSME == "Yes" ? "" : "hidden"}`}>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Name of Company in Udyam Certificate <span className="pl-2 text-red-400 text-2xl">*</span>
            </h1>
            <Input
              placeholder=""
              value={
                documentDetails?.name_on_udyam_certificate ??
                OnboardingDetail?.name_on_udyam_certificate ??
                ""
              }
              onChange={(e) => {
                setDocumentDetail((prev) => ({
                  ...prev,
                  name_on_udyam_certificate: e.target.value,
                }));
              }}
            />
            {errors?.name_on_udyam_certificate && !documentDetails?.name_on_udyam_certificate && <span style={{ color: 'red' }}>{errors?.name_on_udyam_certificate}</span>}
          </div>
          <div className={`${isMSME == "Yes" ? "" : "hidden"}`}>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Upload Udyam Certificate <span className="pl-2 text-red-400 text-2xl">*</span>
            </h1>
            <div className="flex gap-4">
            <Input
              placeholder=""
              type="file"
              onChange={(e) => {
                setDocumentDetail((prev: any) => ({
                  ...prev,
                  udyamCertificate: e.target.files,
                }));
              }}
              />
              {errors?.udyamCertificate && !documentDetails?.udyamCertificate && <span style={{ color: 'red' }}>{errors?.udyamCertificate}</span>}
            {/* file preview */}
            {isMsmeFilePreview &&
              !documentDetails?.udyamCertificate &&
              OnboardingDetail?.msme_proof?.url && (
                <div className="flex gap-2">
                  <Link
                  target="blank"
                  href={OnboardingDetail?.msme_proof?.url}
                  className="underline text-blue-300 max-w-44 truncate"
                  >
                    <span>{OnboardingDetail?.msme_proof?.file_name}</span>
                  </Link>
                  <X
                    className="cursor-pointer"
                    onClick={() => {
                      setIsMsmeFilePreview((prev) => !prev);
                    }}
                    />
                </div>
              )}
              </div>
          </div>
        </div>
        <div className="grid grid-cols-3 pl-5 gap-6">
          <div className={``}>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Enterprise Registration Number <span className="pl-2 text-red-400 text-2xl">*</span>
            </h1>
            <Input
              placeholder="Enter Enterprise Registration Number"
              value={
                documentDetails?.enterprise_registration_number ??
                OnboardingDetail?.enterprise_registration_number ??
                ""
              }
              onChange={(e) => {
                setDocumentDetail((prev) => ({
                  ...prev,
                  enterprise_registration_number: e.target.value,
                }));
              }}
            />
            {errors?.enterprise_registration_number && !documentDetails?.enterprise_registration_number && <span style={{ color: 'red' }}>{errors?.enterprise_registration_number}</span>}
          </div>
          <div className={``}>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Upload Enterprise Registration Document <span className="pl-2 text-red-400 text-2xl">*</span>
            </h1>
            <div className="flex gap-4 w-full">

            <Input
              placeholder=""
              type="file"
              onChange={(e) => {
                setDocumentDetail((prev: any) => ({
                  ...prev,
                  registrationDocument: e.target.files,
                }));
              }}
              />
              {errors?.registrationDocument && !documentDetails?.registrationDocument && <span style={{ color: 'red' }}>{errors?.registrationDocument}</span>}
            {/* file preview */}
            {isRegistrationFilePreview &&
              !documentDetails?.registrationDocument &&
              OnboardingDetail?.entity_proof?.url && (
                <div className="flex gap-2">
                  <Link
                  target="blank"
                    href={OnboardingDetail?.entity_proof?.url}
                    className="underline text-blue-300 max-w-44 truncate"
                    >
                    <span>{OnboardingDetail?.entity_proof?.file_name}</span>
                  </Link>
                  <X
                    className="cursor-pointer"
                    onClick={() => {
                      setIsRegistrationFilePreview((prev) => !prev);
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

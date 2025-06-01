'use client'
import React from "react";
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
import { TdocumentDetailDropdown, TvendorOnboardingDetail, VendorOnboardingResponse } from "@/src/types/types";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";


interface documentDetail  {
  company_pan_number:string,
  name_on_company_pan:string,
  msme_registered:string,
  enterprise_registration_number:string,
  msme_enterprise_type:string,
  udyam_number:string,
  name_on_udyam_certificate:string,
  panDocument:FileList,
  registrationDocument:FileList,
  gst_state:string,
  gst_number:string,
  gst_registration_date:string,
  gstDocument:FileList,
  companyNameUdyamCertificate:string,
  udyamCertificate:FileList
  gst_ven_type:string
}

interface Props {
  ref_no:string,
  onboarding_ref_no:string,
  onboarding_data:TvendorOnboardingDetail["message"]["data"]
  OnboardingDetail:VendorOnboardingResponse["message"]["document_details_tab"]
  documentDetailDropdown:TdocumentDetailDropdown["message"]["data"]
}

const DocumentDetails = ({ref_no,onboarding_ref_no,OnboardingDetail,documentDetailDropdown}:Props) => {
  const [BusinessType, setBusinessType] = useState<string>(OnboardingDetail?.gst_table[0]?.gst_ven_type);
  const [isMSME, setIsMSME] = useState<string>(OnboardingDetail?.msme_registered);
  const router = useRouter();
  const [documentDetails,setDocumentDetail] = useState<Partial<documentDetail>>();

  const {designation} = useAuth();
  // if(!designation){
  //   return(
  //     <div>Loading</div>
  //   )
  // }

  const handleSubmit = async()=>{
    const url = API_END_POINTS?.documentDetailSubmit;
    const updatedData = {...documentDetails,msme_registered:isMSME,gst_table:[{gst_state:documentDetails?.gst_state,gst_number:documentDetails?.gst_number,gst_registration_date:documentDetails?.gst_registration_date,gst_ven_type:documentDetails?.gst_ven_type}],ref_no:ref_no,vendor_onboarding:onboarding_ref_no};
    const formData = new FormData();
    formData.append("data",JSON.stringify(updatedData));
    if(documentDetails?.registrationDocument){
      formData.append("entity_proof",documentDetails?.registrationDocument[0])
    }
    if(documentDetails?.panDocument){
      formData.append("pan_proof",documentDetails?.panDocument[0])
    }
    if(documentDetails?.gstDocument){
      formData.append("gst_document",documentDetails?.gstDocument[0])
    }
    if(documentDetails?.udyamCertificate){
      formData.append("msme_proof",documentDetails?.udyamCertificate[0])
    }
    const Response:AxiosResponse = await requestWrapper({url:url,data:formData,method:"POST"});
    if(Response?.status == 200) router.push(`/vendor-details-form?tabtype=Payment%20Detail&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`);
  }

  return (
    <div className="flex flex-col bg-white rounded-lg p-4 w-full max-h-[80vh]">
      <h1 className="border-b-2 pb-2 text-lg">Document Details</h1>
      <div className="overflow-y-scroll">
      <div className="grid grid-cols-3 gap-6 p-5 ">
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Company PAN Number
          </h1>
          <Input placeholder="Enter Reg No." value={documentDetails?.company_pan_number ?? OnboardingDetail?.company_pan_number ?? ""} onChange={(e)=>{setDocumentDetail((prev)=>({...prev,company_pan_number:e.target.value}))}} />
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Name of Company on PAN Card
          </h1>
          <Input placeholder="Enter Reg No." value={documentDetails?.name_on_company_pan ?? OnboardingDetail?.name_on_company_pan ?? ""} onChange={(e)=>{setDocumentDetail((prev)=>({...prev,name_on_company_pan:e.target.value}))}} />
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Upload PAN Document
          </h1>
          <Input placeholder="" type="file" onChange={(e)=>{setDocumentDetail((prev:any)=>({...prev,panDocument:e.target.files}))}}/>
        </div>
        <div className="col-span-3 grid grid-cols-3 gap-6">
          <div className="flex flex-col">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Type Of Business (Please select any one)
            </h1>
            <Select
              onValueChange={(value) => {
                setBusinessType(value);
                setDocumentDetail((prev)=>({...prev,gst_ven_type:value}))
              }}
              value={BusinessType ?? ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Vendor Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {
                    documentDetailDropdown?.gst_vendor_type?.map((item,index)=>(
                      <SelectItem key={index} value={item?.name}>{item?.registration_ven_name}</SelectItem>
                    ))
                  }
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div
          className={`col-span-3 grid grid-cols-3 gap-6 ${BusinessType == "Not-Registered" || BusinessType == "" ? "hidden" : ""}`}
        >
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              State
            </h1>
            {/* <Input placeholder="Enter State" value={documentDetails?.gst_state ?? OnboardingDetail?.gst_table[0]?.gst_state} onChange={(e)=>{setDocumentDetail((prev)=>({...prev,gst_state:e.target.value}))}}/> */}
            <Select
              onValueChange={(value) => {
                setDocumentDetail((prev)=>({...prev,gst_state:value})
              )}}
              value={documentDetails?.gst_state ?? OnboardingDetail?.gst_table[0]?.gst_state}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Vendor Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {
                    documentDetailDropdown?.state_master?.map((item,index)=>(
                      <SelectItem key={index} value={item?.name}>{item?.state_name}</SelectItem>
                    ))
                  }
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              GST Number
            </h1>
            <Input placeholder="Enter GST Number" value={documentDetails?.gst_number ?? OnboardingDetail?.gst_table[0]?.gst_number ?? ""} onChange={(e)=>{setDocumentDetail((prev)=>({...prev,gst_number:e.target.value}))}} />
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              GST Registration Date
            </h1>
            <Input placeholder="Enter Registration Date" value={documentDetails?.gst_registration_date ?? OnboardingDetail?.gst_table[0]?.gst_registration_date ?? ""} type="date" onChange={(e)=>{setDocumentDetail((prev)=>({...prev,gst_registration_date:e.target.value}))}} />
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Upload GST Document
            </h1>
            <Input type="file" onChange={(e)=>{setDocumentDetail((prev:any)=>({...prev,gstDocument:e.target.files}))}} />
          </div>
        </div>
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            MSME Registered?
          </h1>
          <Select
            onValueChange={(value) => {
              setIsMSME(value);
              setDocumentDetail((prev)=>({...prev,company_pan_number:value}))
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
            MSME Enterprise Type
          </h1>
          <Select value={documentDetails?.msme_enterprise_type ?? OnboardingDetail?.msme_enterprise_type} onValueChange={(value)=>{setDocumentDetail((prev)=>({...prev,msme_enterprise_type:value}))}}>
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
        </div>
        <div className={`${isMSME == "Yes" ? "" : "hidden"}`}>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Udyam Registration No.
          </h1>
          <Input placeholder="" value={documentDetails?.udyam_number ?? OnboardingDetail?.udyam_number ?? ""} onChange={(e)=>{setDocumentDetail((prev)=>({...prev,udyam_number:e.target.value}))}} />
        </div>
        <div className={`${isMSME == "Yes" ? "" : "hidden"}`}>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Name of Company in Udyam Certificate
          </h1>
          <Input placeholder="" value={documentDetails?.name_on_udyam_certificate ??OnboardingDetail?.name_on_udyam_certificate ?? ""} onChange={(e)=>{setDocumentDetail((prev)=>({...prev,name_on_udyam_certificate:e.target.value}))}}/>
        </div>
        <div className={`${isMSME == "Yes" ? "" : "hidden"}`}>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Upload Udyam Certificate
          </h1>
          <Input placeholder="" type="file" onChange={(e)=>{setDocumentDetail((prev:any)=>({...prev,udyamCertificate:e.target.files}))}}/>
        </div>
      </div>
      <div className="grid grid-cols-3 pl-5 gap-6">
        <div className={``}>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Enterprise Registration Number
          </h1>
          <Input placeholder="Enter Enterprise Registration Number" value={documentDetails?.enterprise_registration_number ?? OnboardingDetail?.enterprise_registration_number ?? ""}  onChange={(e)=>{setDocumentDetail((prev)=>({...prev,enterprise_registration_number:e.target.value}))}}/>
        </div>
        <div className={``}>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Upload Enterprise Registration Document
          </h1>
          <Input placeholder="" type="file" onChange={(e)=>{setDocumentDetail((prev:any)=>({...prev,registrationDocument:e.target.files}))}} />
        </div>
      </div>
      </div>
      <div className="flex justify-end pr-6"><Button className={`bg-blue-400 hover:bg-blue-400 ${designation?"hidden":""}`} onClick={()=>{handleSubmit()}}>Next</Button></div>
    </div>
  );
};

export default DocumentDetails;

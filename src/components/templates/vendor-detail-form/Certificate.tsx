'use client'
import React, { useEffect, useRef, useState } from "react";
import { Input } from "../../atoms/input";
import { Button } from "../../atoms/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../atoms/select";
import { CertificateAttachment, TcertificateCodeDropdown, VendorOnboardingResponse } from "@/src/types/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../atoms/table";
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";

interface Props {
  certificateCodeDropdown:TcertificateCodeDropdown["message"]["data"]["certificate_names"];
  ref_no:string,
  onboarding_ref_no:string
  OnboardingDetail:VendorOnboardingResponse["message"]["certificate_details_tab"]
}

type certificateData = {
  certificate_name:string,
  valid_till:string,
  file:FileList
  fileDetail:CertificateAttachment
}

const Certificate = ({certificateCodeDropdown,ref_no,onboarding_ref_no,OnboardingDetail}:Props) => {
  console.log(OnboardingDetail)
  const [certificateData,setCertificateData] = useState<Partial<certificateData>>({});
   const [multipleCertificateData,setMultipleCertificateData] = useState<certificateData[]>([]);

  useEffect(()=>{
    OnboardingDetail?.map((item)=>{
      setMultipleCertificateData((prev:any)=>([...prev,{certificate_name:item?.name,fileDetail:{file_name:item?.certificate_attach?.file_name,name:item?.certificate_attach?.name,url:item?.certificate_attach?.url},valid_till:item?.valid_till}]))
    })
  },[])


  const fileInput = useRef<HTMLInputElement>(null);

  const handleSubmit = async ()=>{
    const url = API_END_POINTS?.certificateSubmit;
    const formData = new FormData()
    formData.append("data",JSON.stringify({ref_no:ref_no,vendor_onboarding:onboarding_ref_no,certificates:[certificateData]}))
    if(certificateData?.file){
      formData.append("certificate_attach",certificateData.file[0])
    }
    console?.log(formData?.values)
    const certificateSubmit:AxiosResponse = await requestWrapper({url:url,data:formData,method:"POST"})
    if(certificateSubmit?.status == 200){
      console.log("Successfully submit")
    }
  }

  const handleAdd = async()=>{
    const url = API_END_POINTS?.certificateSubmit;
    const formData = new FormData()
    formData.append("data",JSON.stringify({ref_no:ref_no,vendor_onboarding:onboarding_ref_no,certificates:[certificateData]}))
    if(certificateData?.file){
      formData.append("certificate_attach",certificateData.file[0])
    }
    console?.log(formData?.values)
    const certificateSubmit:AxiosResponse = await requestWrapper({url:url,data:formData,method:"POST"})
    if(certificateSubmit?.status == 200){
      console.log("Successfully submit")
    }
    setCertificateData({})
    if(fileInput?.current){
      fileInput.current.value =''
    }
  }

  return (
    <div className="flex flex-col bg-white rounded-lg px-4 pb-4 max-h-[80vh] overflow-y-scroll w-full">
      <h1 className="border-b-2 pb-2 mb-4 sticky top-0 bg-white py-4 text-lg">
        Certificate Details
      </h1>
      <div className="grid grid-cols-3 gap-6 p-5">
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Certificate Name
          </h1>
          <Select value={certificateData?.certificate_name ?? ""} onValueChange={(value)=>{setCertificateData((prev:any)=>({...prev,certificate_name:value}))}}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  certificateCodeDropdown?.map((item,index)=>(
                    <SelectItem value={item?.name} key={index}>{item?.certificate_name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Valid Till
          </h1>
          <Input value={certificateData?.valid_till ?? ""} placeholder="" type="date" onChange={(e)=>{setCertificateData((prev:any)=>({...prev,valid_till:e.target.value}))}}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Upload Certificate File
          </h1>
          <Input ref={fileInput} placeholder="" type="file" onChange={(e)=>{setCertificateData((prev:any)=>({...prev,file:e?.target?.files,fileDetail:{file_name:e?.target?.files != null? e.target.files[0].name:""}}))}}/>
        </div>
      </div>
      <div className="flex justify-end pr-6"><Button onClick={()=>{handleAdd()}}>Add</Button></div>
      <div className="shadow- bg-[#f6f6f7] p-4 mb-4 rounded-2xl">
                  <div className="flex w-full justify-between pb-4">
                    <h1 className="text-[20px] text-[#03111F] font-semibold">
                      Multiple Contact
                    </h1>
                  </div>
                  <Table className=" max-h-40 overflow-y-scroll">
                    {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                    <TableHeader className="text-center">
                      <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
                        <TableHead className="w-[100px]">Sr No.</TableHead>
                        <TableHead className="text-center">Address1</TableHead>
                        <TableHead className="text-center">Address2</TableHead>
                        <TableHead className="text-center">Pincode</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="text-center">
                      {multipleCertificateData?.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{index}</TableCell>
                          <TableCell>{item?.certificate_name}</TableCell>
                          <TableCell>{item?.valid_till}</TableCell>
                          <TableCell>{item?.fileDetail?.file_name}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
      <div className="flex justify-end pr-4"><Button onClick={()=>{handleSubmit()}}>Submit</Button></div>
    </div>
  );
};

export default Certificate;

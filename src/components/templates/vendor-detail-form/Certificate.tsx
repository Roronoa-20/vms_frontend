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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../atoms/table";
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import { CrossIcon, Trash, Trash2 } from "lucide-react";
import { it } from "node:test";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";

interface Props {
  certificateCodeDropdown: TcertificateCodeDropdown["message"]["data"]["certificate_names"];
  ref_no: string,
  onboarding_ref_no: string
  OnboardingDetail: VendorOnboardingResponse["message"]["certificate_details_tab"]
}

type certificateData = {
  certificate_code: string,
  valid_till: string,
  file?: FileList
  fileDetail?: CertificateAttachment,
  name?: string
  certificate_attach?: CertificateAttachment
  others?: string
  certificate_number?: string
  certificate_body?: string
}

const Certificate = ({ certificateCodeDropdown, ref_no, onboarding_ref_no, OnboardingDetail }: Props) => {
  const [certificateData, setCertificateData] = useState<Partial<certificateData>>({});
  const [multipleCertificateData, setMultipleCertificateData] = useState<certificateData[]>(OnboardingDetail);
  const [otherField, setOtherField] = useState<string>()
  const router = useRouter();
  const [isOtherField, setIsOtherField] = useState<boolean>(false);

  useEffect(() => {
  }, [multipleCertificateData])

  console.log(OnboardingDetail, "this is data of certificate")
  const fileInput = useRef<HTMLInputElement>(null);
  const handleSubmit = async () => {
    if (OnboardingDetail?.length < 1) {
      toast.warn("Upload At Least 1 Certificate")
      return;
    }
    const url = API_END_POINTS?.certificateSubmit;
    const certificateSubmit: AxiosResponse = await requestWrapper({ url: url, data: { data: { onb_id: onboarding_ref_no, completed: 1 } }, method: "POST" })
    if (certificateSubmit?.status == 200) {
      router.push("/Success");
    }
  }

  const handleBack = () => {
    router.push(`/vendor-details-form?tabtype=Reputed%20Partners&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`);
  };

  const handleAdd = async () => {
    const url = API_END_POINTS?.certificateSave;
    const formData = new FormData()
    formData.append("data", JSON.stringify({ ref_no: ref_no, vendor_onboarding: onboarding_ref_no, certificates: [certificateData] }))
    if (certificateData?.file) {
      formData.append("certificate_attach", certificateData.file[0])
    }
    console?.log(formData?.values)
    const certificateSubmit: AxiosResponse = await requestWrapper({ url: url, data: formData, method: "POST" })
    if (certificateSubmit?.status == 200) {
      console.log("Successfully submit")
    }
    setCertificateData({})
    if (fileInput?.current) {
      fileInput.current.value = ''
    }
    console.log("pushring")
    location.reload()
    // router.push(`/vendor-details-form?tabtype=Certificate&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`);
    // tableFetch();
  }


  // const tableFetch = async () => {
  //   const url = `${API_END_POINTS?.fetchDetails}?ref_no=${ref_no}&vendor_onboarding=${onboarding_ref_no}`;
  //   const fetchOnboardingDetailResponse: AxiosResponse = await requestWrapper({ url: url, method: "GET" });
  //   const OnboardingDetails: VendorOnboardingResponse["message"]["certificate_details_tab"] = fetchOnboardingDetailResponse?.status == 200 ? fetchOnboardingDetailResponse?.data?.message?.certificate_details_tab : "";
  //   console.log(OnboardingDetails, "this is after api")
  //   setMultipleCertificateData([]);
  //   OnboardingDetails?.map((item) => {
  //     setMultipleCertificateData((prev: any) => ([...prev, { certificate_code: item?.certificate_code, fileDetail: { file_name: item?.certificate_attach?.file_name, name: item?.certificate_attach?.name, url: item?.certificate_attach?.url }, valid_till: item?.valid_till, name: item?.name }]))
  //   })
  // }

  const deleteRow = async (certificate_code: string) => {
    const url = `${API_END_POINTS?.deleteCertificate}?certificate_code=${certificate_code}&ref_no=${ref_no}&vendor_onboarding=${onboarding_ref_no}`
    const deleteResponse: AxiosResponse = await requestWrapper({ url: url, method: "POST" });
    if (deleteResponse?.status == 200) {
      setMultipleCertificateData([]);
      // tableFetch();
      location.reload()
    }
  }


  return (
    <div className="flex flex-col bg-white rounded-lg px-4 pb-4 max-h-[80vh] overflow-y-scroll w-full">
      <h1 className="border-b-2 pb-1 font-semibold sticky top-0 bg-white py-4 text-lg">
        Certificate Details
      </h1>
      <div className="grid grid-cols-3 gap-4 p-2">
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] flex">
            Certificate Name<span className="pl-1 text-red-400 text-xl">*</span>
          </h1>
          <Select
            value={certificateData?.certificate_code ?? ""}
            onValueChange={(value) => {
              setCertificateData((prev: any) => ({
                ...prev,
                certificate_code: value,
              }));
              setIsOtherField(value === "Others");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {certificateCodeDropdown?.map((item, index) => (
                  <SelectItem value={item?.name} key={index}>
                    {item?.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] flex">
            Certificate Number<span className="pl-1 text-red-400 text-xl">*</span>
          </h1>
          <Input value={certificateData?.certificate_number ?? ""} onChange={(e) => { setCertificateData((prev: any) => ({ ...prev, certificate_number: e.target.value })) }} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
            Certification Body
          </h1>
          <Input value={certificateData?.certificate_body ?? ""} onChange={(e) => { setCertificateData((prev: any) => ({ ...prev, certificate_body: e.target.value })) }} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] flex">
            Valid Till<span className="pl-1 text-red-400 text-xl">*</span>
          </h1>
          <Input value={certificateData?.valid_till ?? ""} placeholder="" type="date" onChange={(e) => { setCertificateData((prev: any) => ({ ...prev, valid_till: e.target.value })) }} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] flex">
            Upload Certificate File<span className="pl-1 text-red-400 text-xl">*</span>
          </h1>
          <Input ref={fileInput} placeholder="" type="file" onChange={(e) => { setCertificateData((prev: any) => ({ ...prev, file: e?.target?.files, fileDetail: { file_name: e?.target?.files != null ? e.target.files[0].name : "" } })) }} />
        </div>
        {certificateData?.certificate_code == "Others" &&
          <div className="col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-2">
              Others
            </h1>
            <Input value={certificateData?.others ?? ""} onChange={(e) => { setCertificateData((prev: any) => ({ ...prev, others: e.target.value })) }} />
          </div>
        }
      </div>

      <div className={`flex justify-end`}><Button className="py-2" variant={"nextbtn"} size={"nextbtnsize"} onClick={() => { handleAdd() }}>Add</Button></div>
      {multipleCertificateData?.length > 0 && (
        <div className="shadow- bg-[#f6f6f7] p-4 mb-4 rounded-2xl">
          <div className="flex w-full justify-between pb-4">
            <h1 className="text-[20px] text-[#03111F] font-semibold">
              Certificate Details List
            </h1>
          </div>
          <Table className=" max-h-40 overflow-y-scroll">
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader className="text-center">
              <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
                <TableHead className="text-center">Sr No.</TableHead>
                <TableHead className="text-center">Certifcate Code</TableHead>
                <TableHead className="text-center">Certifcate Number</TableHead>
                <TableHead className="text-center">Certifcate Body</TableHead>
                <TableHead className="text-center">Valid Till</TableHead>
                <TableHead className="text-center">File</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {multipleCertificateData?.map((item, index) => (

                <TableRow key={item?.name ? item?.name : ""}>
                  <TableCell className="font-medium text-center">{index + 1}</TableCell>
                  <TableCell className="text-center">{item?.certificate_code}</TableCell>
                  <TableCell className="text-center">{item?.certificate_number}</TableCell>
                  <TableCell className="text-center">{item?.certificate_body}</TableCell>
                  <TableCell className="text-center">{item?.valid_till}</TableCell>
                  <TableCell className="text-center"><Link href={item?.certificate_attach?.url as string}>{item?.certificate_attach?.file_name}</Link></TableCell>
                  <TableCell className="flex justify-center items-center text-center"><Trash2 onClick={() => { deleteRow(item?.certificate_code ? item?.certificate_code : "") }} className=" text-red-400 cursor-pointer" /></TableCell>
                </TableRow>
              ))
              }
            </TableBody>
          </Table>
        </div>
      )}
      <div className="flex justify-end items-center space-x-3 mt-10">
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
          Submit
        </Button>
      </div>
      <ToastContainer closeButton theme="dark" autoClose={2000} />
    </div>
  );
};

export default Certificate;

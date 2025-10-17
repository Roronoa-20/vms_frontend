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
import {
  CertificateAttachment,
  TcertificateCodeDropdown,
  VendorOnboardingResponse,
} from "@/src/types/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../atoms/table";
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import {
  Trash2,
  Lock,
  Pencil,
  Paperclip,
  X,
} from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  certificateCodeDropdown: TcertificateCodeDropdown["message"]["data"]["certificate_names"];
  ref_no: string;
  onboarding_ref_no: string;
  OnboardingDetail: VendorOnboardingResponse["message"]["certificate_details_tab"];
  isAmendment: number;
  re_release: number;
}

type certificateData = {
  certificate_code: string;
  valid_till: string;
  file?: FileList;
  fileDetail?: CertificateAttachment;
  name?: string;
  certificate_attach?: CertificateAttachment;
  others?: string;
};

const Certificate = ({
  certificateCodeDropdown,
  ref_no,
  onboarding_ref_no,
  OnboardingDetail,
  isAmendment,
  re_release,
}: Props) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [certificateData, setCertificateData] = useState<Partial<certificateData>>({});
  const [multipleCertificateData, setMultipleCertificateData] =
    useState<certificateData[]>(OnboardingDetail);
  const fileInput = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const { designation } = useAuth();

  // ---- Submit
  const handleSubmit = async () => {
    if (multipleCertificateData.length < 1) {
      alert("Upload At Least 1 Certificate");
      return;
    }
    router.push(`/view-onboarding-details?tabtype=Purchase%20Detail&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`);
    // location.reload();
  };

  // ---- Add Certificate
  const handleAdd = async () => {
    const url = API_END_POINTS?.certificateSave;
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        ref_no: ref_no,
        vendor_onboarding: onboarding_ref_no,
        certificates: [certificateData],
      })
    );
    if (certificateData?.file) {
      formData.append("certificate_attach", certificateData.file[0]);
    }

    const certificateSubmit: AxiosResponse = await requestWrapper({
      url: url,
      data: formData,
      method: "POST",
    });
    if (certificateSubmit?.status === 200) {
      setMultipleCertificateData((prev) => [...prev, certificateData as certificateData]);
      setCertificateData({});
      if (fileInput?.current) fileInput.current.value = "";
    }
    // if (certificateSubmit?.status == 200) {
    //   console.log("Successfully submit");
    // }
    // setCertificateData({});
    // if (fileInput?.current) fileInput.current.value = "";
    // location.reload();
  };


  // ---- Delete Row
  const deleteRow = async (certificate_code: string) => {
    const url = `${API_END_POINTS?.deleteCertificate}?certificate_code=${certificate_code}&ref_no=${ref_no}&vendor_onboarding=${onboarding_ref_no}`;
    const deleteResponse: AxiosResponse = await requestWrapper({
      url: url,
      method: "POST",
    });
    if (deleteResponse?.status == 200) {
      setMultipleCertificateData((prev) =>
        prev.filter((row) => row.certificate_code !== certificate_code)
      );
      // setMultipleCertificateData([]);
      // location.reload();
    }
  };

  // ---- Remove uploaded file before adding
  const handleRemoveFile = () => {
    setCertificateData((prev) => ({ ...prev, file: undefined, fileDetail: undefined }));
    if (fileInput.current) fileInput.current.value = "";
  };

  return (
    <div className="flex flex-col bg-white rounded-lg p-2 w-full">
      {/* Header with toggle */}
      <div className="flex justify-between items-center border-b-2">
        <h1 className="font-semibold text-[18px]">Certificate Details</h1>
        {designation == "Purchase Team" &&(isAmendment == 1 || re_release == 1) && (
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

      {/* Form Inputs */}
      <div className={`grid grid-cols-3 gap-6 p-2 ${isDisabled ? "hidden" : ""}`}>
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] text-[#626973] pb-3">Certificate Name</h1>
          <Select
            disabled={isDisabled}
            value={certificateData?.certificate_code ?? ""}
            onValueChange={(value) =>
              setCertificateData((prev: any) => ({ ...prev, certificate_code: value }))
            }
          >
            <SelectTrigger className="disabled:opacity-100">
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
          <h1 className="text-[12px] text-[#626973] pb-3">Valid Till</h1>
          <Input
            disabled={isDisabled}
            type="date"
            value={certificateData?.valid_till ?? ""}
            onChange={(e) =>
              setCertificateData((prev: any) => ({ ...prev, valid_till: e.target.value }))
            }
          />
        </div>

        {/* Paperclip Upload */}
        <div className="col-span-1">
          <h1 className="text-[12px] text-[#626973] pb-3">Upload Certificate</h1>
          <div className="flex items-center gap-2">
            <input
              ref={fileInput}
              type="file"
              className="hidden"
              disabled={isDisabled}
              onChange={(e) =>
                setCertificateData((prev: any) => ({
                  ...prev,
                  file: e?.target?.files,
                  fileDetail: {
                    file_name: e?.target?.files ? e.target.files[0].name : "",
                  },
                }))
              }
            />
            <Button
              disabled={isDisabled}
              type="button"
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-black px-3 py-2 rounded-lg"
              onClick={() => fileInput.current?.click()}
            >
              <Paperclip className="w-4 h-4" /> Attach File
            </Button>
            {certificateData?.fileDetail?.file_name && (
              <div className="flex items-center gap-2 text-sm bg-gray-100 px-2 py-1 rounded">
                <span>{certificateData.fileDetail.file_name}</span>
                <X
                  className="w-4 h-4 text-red-500 cursor-pointer"
                  onClick={handleRemoveFile}
                />
              </div>
            )}
          </div>
        </div>

        {certificateData?.certificate_code == "Others" && (
          <div className="col-span-1">
            <h1 className="text-[12px] text-[#626973] pb-3">Others</h1>
            <Input
              disabled={isDisabled}
              value={certificateData?.others ?? ""}
              onChange={(e) =>
                setCertificateData((prev: any) => ({ ...prev, others: e.target.value }))
              }
            />
          </div>
        )}
      </div>

      {/* Add button */}
      <div className={`flex justify-end pb-4 ${isDisabled ? "hidden" : ""}`}>
        <Button variant={"nextbtn"} size={"nextbtnsize"} onClick={handleAdd}>
          Add
        </Button>
      </div>

      {/* Table */}
      <div className="bg-[#f6f6f7] p-4 mb-4 mt-2 rounded-2xl">
        <h1 className="text-[20px] text-[#03111F] font-semibold pb-4">
          Certificates List
        </h1>
        <Table>
          <TableHeader className="text-center">
            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px]">
              <TableHead className="text-center text-black">Sr No.</TableHead>
              <TableHead className="text-center text-black">Certificate</TableHead>
              <TableHead className="text-center text-black">Valid Till</TableHead>
              <TableHead className="text-center text-black">File</TableHead>
              <TableHead className="text-center text-black">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {multipleCertificateData?.map((item, index) => (
              <TableRow key={item?.name || index}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="text-center">{item?.certificate_code}</TableCell>
                <TableCell className="text-center">{item?.valid_till}</TableCell>
                <TableCell className="text-center">
                  <Link href={item?.certificate_attach?.url || ""} target="_blank">
                    {item?.certificate_attach?.file_name}
                  </Link>
                </TableCell>
                <TableCell className="text-center">
                  {!isDisabled && (
                    <Trash2
                      onClick={() => deleteRow(item?.certificate_code || "")}
                      className="text-red-400 cursor-pointer"
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Next Button */}
      <div className="flex justify-end">
        <Button
          className="py-2"
          variant="nextbtn"
          size="nextbtnsize"
          onClick={handleSubmit}
          disabled={multipleCertificateData.length === 0}
          style={{
            display: isDisabled ? "none" : "inline-flex",
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Certificate;






// 'use client'
// import React, { useEffect, useRef, useState } from "react";
// import { Input } from "../../atoms/input";
// import { Button } from "../../atoms/button";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../atoms/select";
// import { CertificateAttachment, TcertificateCodeDropdown, VendorOnboardingResponse } from "@/src/types/types";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../atoms/table";
// import API_END_POINTS from "@/src/services/apiEndPoints";
// import requestWrapper from "@/src/services/apiCall";
// import { AxiosResponse } from "axios";
// import { CrossIcon, Trash, Trash2, Lock, Pencil } from "lucide-react";
// import { it } from "node:test";
// import { useAuth } from "@/src/context/AuthContext";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// interface Props {
//   certificateCodeDropdown: TcertificateCodeDropdown["message"]["data"]["certificate_names"];
//   ref_no: string,
//   onboarding_ref_no: string
//   OnboardingDetail: VendorOnboardingResponse["message"]["certificate_details_tab"]
//   isAmendment:number;
//   re_release: number;
// }

// type certificateData = {
//   certificate_code: string,
//   valid_till: string,
//   file?: FileList
//   fileDetail?: CertificateAttachment,
//   name?: string
//   certificate_attach?: CertificateAttachment
//   others?: string
// }

// const Certificate = ({ certificateCodeDropdown, ref_no, onboarding_ref_no, OnboardingDetail,isAmendment, re_release }: Props) => {
//   console.log(OnboardingDetail)
//   const [isDisabled, setIsDisabled] = useState<boolean>(true);
//   const [certificateData, setCertificateData] = useState<Partial<certificateData>>({});
//   const [multipleCertificateData, setMultipleCertificateData] = useState<certificateData[]>(OnboardingDetail);
//   const [otherField, setOtherField] = useState<string>();
//   const router = useRouter();
//   const [isOtherField, setIsOtherField] = useState<boolean>(false);

//   useEffect(() => {
//   }, [multipleCertificateData])

//   console.log(OnboardingDetail, "this is data of certificate")

//   const fileInput = useRef<HTMLInputElement>(null);
//   const { designation } = useAuth();

//   const handleSubmit = async () => {
//     if (OnboardingDetail?.length < 1) {
//       alert("Upload At Least 1 Certificate")
//       return;
//     }
//     // const url = API_END_POINTS?.certificateSubmit;
//     // const certificateSubmit:AxiosResponse = await requestWrapper({url:url,data:{data:{onb_id:onboarding_ref_no,completed:1}},method:"POST"})
//     // if(certificateSubmit?.status == 200){
//     location.reload();
//     // }
//   }

//   const handleAdd = async () => {
//     const url = API_END_POINTS?.certificateSave;
//     const formData = new FormData()
//     formData.append("data", JSON.stringify({ ref_no: ref_no, vendor_onboarding: onboarding_ref_no, certificates: [certificateData] }))
//     if (certificateData?.file) {
//       formData.append("certificate_attach", certificateData.file[0])
//     }
//     console?.log(formData?.values)
//     const certificateSubmit: AxiosResponse = await requestWrapper({ url: url, data: formData, method: "POST" })
//     if (certificateSubmit?.status == 200) {
//       console.log("Successfully submit")
//     }
//     setCertificateData({})
//     if (fileInput?.current) {
//       fileInput.current.value = ''
//     }
//     console.log("pushring")
//     location.reload()
//     // router.push(`/vendor-details-form?tabtype=Certificate&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`);
//     // tableFetch();
//   }


//   const tableFetch = async () => {
//     const url = `${API_END_POINTS?.fetchDetails}?ref_no=${ref_no}&vendor_onboarding=${onboarding_ref_no}`;
//     const fetchOnboardingDetailResponse: AxiosResponse = await requestWrapper({ url: url, method: "GET" });
//     const OnboardingDetails: VendorOnboardingResponse["message"]["certificate_details_tab"] = fetchOnboardingDetailResponse?.status == 200 ? fetchOnboardingDetailResponse?.data?.message?.certificate_details_tab : "";
//     console.log(OnboardingDetails, "this is after api")
//     setMultipleCertificateData([]);
//     OnboardingDetails?.map((item) => {
//       setMultipleCertificateData((prev: any) => ([...prev, { certificate_code: item?.certificate_code, fileDetail: { file_name: item?.certificate_attach?.file_name, name: item?.certificate_attach?.name, url: item?.certificate_attach?.url }, valid_till: item?.valid_till, name: item?.name }]))
//     })
//   }

//   const deleteRow = async (certificate_code: string) => {
//     const url = `${API_END_POINTS?.deleteCertificate}?certificate_code=${certificate_code}&ref_no=${ref_no}&vendor_onboarding=${onboarding_ref_no}`
//     const deleteResponse: AxiosResponse = await requestWrapper({ url: url, method: "POST" });
//     if (deleteResponse?.status == 200) {
//       setMultipleCertificateData([]);
//       // tableFetch();
//       location.reload()
//     }
//   }


//   return (
//     <div className="flex flex-col bg-white rounded-lg p-2 w-full">
//       <div className="flex justify-between items-center border-b-2">
//         <h1 className="font-semibold text-[18px]">Certificate Details</h1>
//         {/* <Button onClick={() => { setIsDisabled(prev => !prev) }} className={`mb-2 ${isAmendment == 1?"":"hidden"}`}>{isDisabled ? "Enable Edit" : "Disable Edit"}</Button> */}
//         {(isAmendment == 1 || re_release == 1) && (
//           <div
//             onClick={() => setIsDisabled(prev => !prev)}
//             className="mb-2 inline-flex items-center gap-2 cursor-pointer rounded-[28px] border px-3 py-2 shadow-sm bg-[#5e90c0] hover:bg-gray-100 transition"
//           >
//             {isDisabled ? (
//               <>
//                 <Lock className="w-5 h-5 text-red-500" />
//                 <span className="text-[14px] font-medium text-white hover:text-black">Enable Edit</span>
//               </>
//             ) : (
//               <>
//                 <Pencil className="w-5 h-5 text-green-600" />
//                 <span className="text-[14px] font-medium text-white hover:text-black">Disable Edit</span>
//               </>
//             )}
//           </div>
//         )}
//       </div>
//       <div className={`grid grid-cols-3 gap-6 p-2 ${isDisabled ? "hidden" : ""}`}>
//         <div className="flex flex-col col-span-1">
//           <h1 className="text-[12px] font-normal text-[#626973] pb-3">
//             Certificate Name
//           </h1>
//           <Select disabled={isDisabled} value={certificateData?.certificate_code ?? ""} onValueChange={(value) => { setCertificateData((prev: any) => ({ ...prev, certificate_code: value })); }}>
//             <SelectTrigger className="disabled:opacity-100">
//               <SelectValue placeholder="Select" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectGroup>
//                 {
//                   certificateCodeDropdown?.map((item, index) => (
//                     <SelectItem value={item?.name} key={index}>{item?.name}</SelectItem>
//                   ))
//                 }
//               </SelectGroup>
//             </SelectContent>
//           </Select>
//         </div>
//         <div className="col-span-1">
//           <h1 className="text-[12px] font-normal text-[#626973] pb-3">
//             Valid Till
//           </h1>
//           <Input disabled={isDisabled} className="disabled:opacity-100" value={certificateData?.valid_till ?? ""} placeholder="" type="date" onChange={(e) => { setCertificateData((prev: any) => ({ ...prev, valid_till: e.target.value })) }} />
//         </div>
//         <div className="col-span-1">
//           <h1 className="text-[12px] font-normal text-[#626973] pb-3">
//             Upload Certificate File
//           </h1>
//           <Input disabled={isDisabled} className="disabled:opacity-100" ref={fileInput} placeholder="" type="file" onChange={(e) => { setCertificateData((prev: any) => ({ ...prev, file: e?.target?.files, fileDetail: { file_name: e?.target?.files != null ? e.target.files[0].name : "" } })) }} />
//         </div>
//         {certificateData?.certificate_code == "Others" &&
//           <div className="col-span-1">
//             <h1 className="text-[12px] font-normal text-[#626973] pb-3">
//               Others
//             </h1>
//             <Input disabled={isDisabled} className="disabled:opacity-100" value={certificateData?.others ?? ""} onChange={(e) => { setCertificateData((prev: any) => ({ ...prev, others: e.target.value })) }} />
//           </div>
//         }
//       </div>
//       <div className={`flex justify-end pb-4`}><Button className={`py-2 ${isDisabled ? "hidden" : ""}`} variant={"nextbtn"} size={"nextbtnsize"} onClick={() => { handleAdd() }}>Add</Button></div>
//       <div className="shadow- bg-[#f6f6f7] p-4 mb-4 rounded-2xl">
//         <div className="flex w-full justify-between pb-4">
//           <h1 className="text-[20px] text-[#03111F] font-semibold">
//             Multiple Certificates
//           </h1>
//         </div>
//         <Table className=" max-h-40 overflow-y-scroll">
//           {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
//           <TableHeader className="text-center">
//             <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
//               <TableHead className="text-center">Sr No.</TableHead>
//               <TableHead className="text-center">Company Code</TableHead>
//               <TableHead className="text-center">Valid Till</TableHead>
//               <TableHead className="text-center">File</TableHead>
//               <TableHead className="text-center">Action</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {multipleCertificateData?.map((item, index) => (

//               <TableRow key={item?.name ? item?.name : ""}>
//                 <TableCell className="font-medium text-center">{index + 1}</TableCell>
//                 <TableCell className="text-center">{item?.certificate_code}</TableCell>
//                 <TableCell className="text-center">{item?.valid_till}</TableCell>
//                 <TableCell className="text-center"><Link href={item?.fileDetail?.url || ""} target="blank">{item?.certificate_attach?.file_name}</Link></TableCell>
//                 <TableCell className="flex justify-center items-center text-center"><Trash2 onClick={() => { deleteRow(item?.certificate_code ? item?.certificate_code : "") }} className={`text-red-400 cursor-pointer ${isDisabled ? "hidden" : ""}`} /></TableCell>
//               </TableRow>
//             ))

//             }
//           </TableBody>
//         </Table>
//       </div>
//       <div className="flex justify-end">
//         <Button className={`py-2 ${isDisabled ? "hidden" : ""}`} variant={"nextbtn"} size={"nextbtnsize"} onClick={() => { handleSubmit() }}>Next</Button>
//       </div>
//     </div>
//   );
// };

// export default Certificate;

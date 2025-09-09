// "use client";
// import React, { useEffect } from "react";
// import { Input } from "../../atoms/input";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../atoms/select";
// import { useState } from "react";
// import { Button } from "../../atoms/button";
// import API_END_POINTS from "@/src/services/apiEndPoints";
// import { AxiosResponse } from "axios";
// import requestWrapper from "@/src/services/apiCall";
// import {
//   TdocumentDetailDropdown,
//   TvendorOnboardingDetail,
//   VendorOnboardingResponse,
// } from "@/src/types/types";
// import { useAuth } from "@/src/context/AuthContext";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { X, Lock, Pencil } from "lucide-react";

// type formData = {
//   iec: string,
//   trc_certificate_no: string
// }

// interface Props {
//   ref_no: string;
//   onboarding_ref_no: string;
//   OnboardingDetail: VendorOnboardingResponse["message"]["document_details_tab"];
//   documentDetailDropdown: TdocumentDetailDropdown["message"]["data"];
//   isAmendment:number;
//   re_release:number;
// }

// const DocumentDetails = ({
//   ref_no,
//   onboarding_ref_no,
//   OnboardingDetail,
//   documentDetailDropdown,
//   isAmendment,
//   re_release
// }: Props) => {
//   const router = useRouter();

//   const [formData, setFormData] = useState<formData | null>(null);

//   const [isIECProofPreview, setIsIECProofPreview] = useState<boolean>(true);
//   const [isTRCProofPreview, setIsTRCProofPreview] = useState<boolean>(true);
//   const [is10FProofPreview, setIs10FProofPreview] = useState<boolean>(true);
//   const [isPEProofPreview, setIsPEProofPreview] = useState<boolean>(true);
//   const [IECProof, setIECProof] = useState<FileList | null>(null);
//   const [TRCProof, setTRCProof] = useState<FileList | null>(null);
//   const [file10FProof, setFile10FProof] = useState<FileList | null>(null);
//   const [PEProof, setPEProof] = useState<FileList | null>(null);
//   const [isDisabled, setIsDisabled] = useState<boolean>(true);

//   const handleSubmit = async () => {
//     const url = API_END_POINTS?.documentDetailSubmit;
//     const updatedFormData = { ...formData, ref_no: ref_no, vendor_onboarding: onboarding_ref_no }
//     const formdata = new FormData();
//     formdata.append("data", JSON.stringify(updatedFormData));
//     if (IECProof) {
//       formdata.append("iec_proof", IECProof[0]);
//     }
//     if (TRCProof) {
//       formdata.append("trc_certificate", TRCProof[0]);
//     }
//     if (file10FProof) {
//       formdata.append("form_10f_proof", file10FProof[0]);
//     }
//     if (PEProof) {
//       formdata.append("pe_certificate", PEProof[0]);
//     }

//     const response: AxiosResponse = await requestWrapper({ url: url, data: formdata, method: "POST" });
//     if (response?.status == 200) {
//       setFormData(null)
//       setIECProof(null);
//       setFile10FProof(null);
//       setTRCProof(null);
//       setPEProof(null);
//       router.push(
//         `/vendor-details-form?tabtype=Payment%20Detail&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`
//       );
//     }
//   };

//   const handleFieldChange = (e: React.ChangeEvent<
//     HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//   >) => {
//     const { name, value } = e.target;
//     setFormData((prev: any) => ({ ...prev, [name]: value }));
//   }

//   return (
//     <div className="flex flex-col bg-white rounded-lg p-3 w-full max-h-[80vh]">
//       <div className="flex justify-between items-center border-b-2">
//         <h1 className="font-semibold text-[18px]">Document Details</h1>
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
//       <div className="overflow-y-scroll">
//         <div className="grid grid-cols-2 gap-6 p-3">
//           <div className="col-span-1">
//             <h1 className="text-[12px] font-normal text-[#626973] pb-3">
//               Import/Export Code
//             </h1>
//             <Input
//               placeholder="Enter Company Pan Number"
//               // value={
//               //   documentDetails?.company_pan_number ??
//               //   OnboardingDetail?.company_pan_number ??
//               //   ""
//               // }
//               value={OnboardingDetail?.iec ?? formData?.iec ?? ""}
//               name="iec"
//               onChange={(e) => {
//                 handleFieldChange(e)
//               }}
//               disabled={isDisabled}
//             />
//           </div>
//           <div className="col-span-1">
//             <h1 className="text-[12px] font-normal text-[#626973] pb-3">
//               Upload IEC Proof
//             </h1>
//             <div className="flex gap-4">

//               {/* <Input
//               placeholder=""
//               type="file"
//               onChange={(e) => {
//                 setIECProof(e.target.files)
//               }}
//               /> */}
//               {/* file preview */}
//               {isIECProofPreview &&
//                 !IECProof &&
//                 OnboardingDetail?.iec_proof?.url && (
//                   <div className="flex gap-2">
//                     <Link
//                       target="blank"
//                       href={OnboardingDetail?.iec_proof?.url}
//                       className="underline text-blue-300 max-w-44 truncate"
//                     >
//                       <span>{OnboardingDetail?.iec_proof?.file_name}</span>
//                     </Link>
//                     {/* <X
//                     className="cursor-pointer"
//                     onClick={() => {
//                       setIsIECProofPreview((prev) => !prev);
//                     }}
//                     /> */}
//                   </div>
//                 )}
//             </div>
//           </div>
//           <div className="col-span-1">
//             <h1 className="text-[12px] font-normal text-[#626973] pb-3">
//               TRC Number
//             </h1>
//             <Input
//               placeholder="Enter Company Pan Number"
//               // value={
//               //   // documentDetails?.company_pan_number ??
//               //   OnboardingDetail?.company_pan_number ??
//               //   ""
//               // }
//               value={OnboardingDetail?.trc_certificate_no ?? formData?.trc_certificate_no ?? ""}
//               name="trc_certificate_no"
//               onChange={(e) => {
//                 handleFieldChange(e)
//               }}
//             />
//           </div>
//           <div className="col-span-1">
//             <h1 className="text-[12px] font-normal text-[#626973] pb-3">
//               TRC Certificate Proof
//             </h1>
//             <div className="flex gap-4">

//               {/* <Input
//               placeholder=""
//               type="file"
//               onChange={(e) => {
//                 setTRCProof(e.target.files)
//               }}
//               /> */}
//               {/* file preview */}
//               {isTRCProofPreview &&
//                 !TRCProof &&
//                 OnboardingDetail?.trc_certificate?.url && (
//                   <div className="flex gap-2">
//                     <Link
//                       target="blank"
//                       href={OnboardingDetail?.trc_certificate?.url}
//                       className="underline text-blue-300 max-w-44 truncate"
//                     >
//                       <span>{OnboardingDetail?.trc_certificate?.file_name}</span>
//                     </Link>
//                     {/* <X
//                     className="cursor-pointer"
//                     onClick={() => {
//                       setIsTRCProofPreview((prev) => !prev);
//                     }}
//                     /> */}
//                   </div>
//                 )}
//             </div>
//           </div>
//           <div className="col-span-1">
//             <h1 className="text-[12px] font-semibold  pb-3">
//               Digital Form 10F
//             </h1>
//             <ul className="pl-4"><Link href={""} target="blank"><li className="text-blue-400 text-sm underline list-disc">View Sample form 10F Document</li></Link>
//               <Link href={""} target="blank"><li className="text-blue-400 underline text-sm list-disc">Step-By-Step-Guide to generate Form 10F</li></Link>
//               <Link href={""} target="blank"><li className="text-blue-400 underline text-sm list-disc">Click Here to Generate Form 10F</li></Link>
//             </ul>
//           </div>
//           <div className="col-span-1">
//             <h1 className="text-[12px] font-normal text-[#626973] pb-3">
//               Digital Form 10F Proof
//             </h1>
//             <div className="flex gap-4">

//               {/* <Input
//               placeholder=""
//               type="file"
//               onChange={(e) => {
//                setFile10FProof(e.target.files);
//               }}
//               /> */}
//               {/* file preview */}
//               {is10FProofPreview &&
//                 !file10FProof &&
//                 OnboardingDetail?.form_10f_proof?.url && (
//                   <div className="flex gap-2">
//                     <Link
//                       target="blank"
//                       href={OnboardingDetail?.form_10f_proof?.url}
//                       className="underline text-blue-300 max-w-44 truncate"
//                     >
//                       <span>{OnboardingDetail?.form_10f_proof?.file_name}</span>
//                     </Link>
//                     {/* <X
//                     className="cursor-pointer"
//                     onClick={() => {
//                       setIs10FProofPreview((prev) => !prev);
//                     }}
//                     /> */}
//                   </div>
//                 )}
//             </div>
//           </div>
//           <div className="col-span-1">
//             <h1 className="text-[12px] font-normal text-[#626973] pb-3">
//               Permanent Establishment Certificate
//             </h1>
//             <Link className="text-blue-400 text-sm underline" href={""}>Download PE Certificate Format File</Link>
//             <div className="flex gap-4 pt-2">

//               {/* <Input
//               placeholder=""
//               type="file"
//               onChange={(e) => {
//                 setPEProof(e.target.files)
//               }}
//               /> */}
//               {/* file preview */}
//               {isPEProofPreview &&
//                 !PEProof &&
//                 OnboardingDetail?.pe_certificate?.url && (
//                   <div className="flex gap-2">
//                     <Link
//                       target="blank"
//                       href={OnboardingDetail?.pe_certificate?.url}
//                       className="underline text-blue-300 max-w-44 truncate"
//                     >
//                       <span>{OnboardingDetail?.pe_certificate?.file_name}</span>
//                     </Link>
//                     {/* <X
//                     className="cursor-pointer"
//                     onClick={() => {
//                       setIsPEProofPreview((prev) => !prev);
//                     }}
//                     /> */}
//                   </div>
//                 )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DocumentDetails;


"use client";
import React, { useState } from "react";
import { Input } from "../../atoms/input";
import { Button } from "../../atoms/button";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import {
  TdocumentDetailDropdown,
  VendorOnboardingResponse,
} from "@/src/types/types";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X, Lock, Pencil, Paperclip } from "lucide-react";

type formData = {
  iec: string;
  trc_certificate_no: string;
};

interface Props {
  ref_no: string;
  onboarding_ref_no: string;
  OnboardingDetail: VendorOnboardingResponse["message"]["document_details_tab"];
  documentDetailDropdown: TdocumentDetailDropdown["message"]["data"];
  isAmendment: number;
  re_release: number;
}

const DocumentDetails = ({
  ref_no,
  onboarding_ref_no,
  OnboardingDetail,
  isAmendment,
  re_release,
}: Props) => {
  const router = useRouter();
  const [formData, setFormData] = useState<formData | null>(null);

  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const [IECProof, setIECProof] = useState<FileList | null>(null);
  const [TRCProof, setTRCProof] = useState<FileList | null>(null);
  const [file10FProof, setFile10FProof] = useState<FileList | null>(null);
  const [PEProof, setPEProof] = useState<FileList | null>(null);

  const [isIECProofPreview, setIsIECProofPreview] = useState(true);
  const [isTRCProofPreview, setIsTRCProofPreview] = useState(true);
  const [is10FProofPreview, setIs10FProofPreview] = useState(true);
  const [isPEProofPreview, setIsPEProofPreview] = useState(true);

  const handleSubmit = async () => {
    const url = API_END_POINTS?.documentDetailSubmit;
    const updatedFormData = {
      ...formData,
      ref_no: ref_no,
      vendor_onboarding: onboarding_ref_no,
    };
    const formdata = new FormData();
    formdata.append("data", JSON.stringify(updatedFormData));
    if (IECProof) formdata.append("iec_proof", IECProof[0]);
    if (TRCProof) formdata.append("trc_certificate", TRCProof[0]);
    if (file10FProof) formdata.append("form_10f_proof", file10FProof[0]);
    if (PEProof) formdata.append("pe_certificate", PEProof[0]);

    const response: AxiosResponse = await requestWrapper({
      url: url,
      data: formdata,
      method: "POST",
    });
    if (response?.status == 200) {
      setFormData(null);
      setIECProof(null);
      setFile10FProof(null);
      setTRCProof(null);
      setPEProof(null);
      alert("International Document Details Updated Successfully!!!");
      router.push(`/view-onboarding-details?tabtype=Payment%20Detail%20%2F%20Bank%20Detail&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`);
    }
  };

  const handleFieldChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const fileConfigs = [
    {
      label: "Upload IEC Proof",
      state: IECProof,
      setState: setIECProof,
      previewState: isIECProofPreview,
      setPreview: setIsIECProofPreview,
      url: OnboardingDetail?.iec_proof?.url,
      fileName: OnboardingDetail?.iec_proof?.file_name,
    },
    {
      label: "TRC Certificate Proof",
      state: TRCProof,
      setState: setTRCProof,
      previewState: isTRCProofPreview,
      setPreview: setIsTRCProofPreview,
      url: OnboardingDetail?.trc_certificate?.url,
      fileName: OnboardingDetail?.trc_certificate?.file_name,
    },
    {
      label: "Digital Form 10F Proof",
      state: file10FProof,
      setState: setFile10FProof,
      previewState: is10FProofPreview,
      setPreview: setIs10FProofPreview,
      url: OnboardingDetail?.form_10f_proof?.url,
      fileName: OnboardingDetail?.form_10f_proof?.file_name,
    },
    {
      label: "Permanent Establishment Certificate",
      state: PEProof,
      setState: setPEProof,
      previewState: isPEProofPreview,
      setPreview: setIsPEProofPreview,
      url: OnboardingDetail?.pe_certificate?.url,
      fileName: OnboardingDetail?.pe_certificate?.file_name,
    },
  ];

  const renderFileUpload = (config: (typeof fileConfigs)[0]) => (
    <div className="col-span-1">
      <h1 className="text-[12px] font-normal text-[#626973] pb-3">
        {config.label}
      </h1>

      <div className="flex items-center gap-3">
        {/* Hidden file input */}
        <input
          type="file"
          id={config.label}
          hidden
          disabled={isDisabled}
          onChange={(e) => {
            if (!isDisabled) config.setState(e.target.files);
          }}
        />

        {/* Paperclip button (acts as file uploader) */}
        {!config.state && config.previewState && !config.url && !isDisabled && (
          <label
            htmlFor={config.label}
            className="cursor-pointer flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <Paperclip className="w-5 h-5" />
            <span className="text-sm">Attach file</span>
          </label>
        )}

        {/* Existing uploaded file (backend link) */}
        {config.previewState && !config.state && config.url && (
          <div className="flex items-center gap-2">
            <Link
              target="_blank"
              href={config.url}
              className="flex items-center gap-2 text-blue-600 underline max-w-44 truncate"
            >
              <Paperclip className="w-4 h-4 text-blue-500" />
              <span>{config.fileName}</span>
            </Link>
            {!isDisabled && (
              <X
                className="w-4 h-4 text-red-500 cursor-pointer"
                onClick={() => config.setPreview(false)}
              />
            )}
          </div>
        )}

        {/* Newly uploaded file (local) */}
        {config.state && (
          <div className="flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-700 truncate max-w-44">
              {config.state[0]?.name}
            </span>
            {!isDisabled && (
              <X
                className="w-4 h-4 text-red-500 cursor-pointer"
                onClick={() => config.setState(null)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );


  return (
    <div className="flex flex-col bg-white rounded-lg p-2 w-full max-h-[80vh]">
      <div className="flex justify-between items-center border-b-2">
        <h1 className="font-semibold text-[18px]">Document Details</h1>
        {(isAmendment == 1 || re_release == 1) && (
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

      <div>
        <div className="grid grid-cols-2 gap-6 p-2">
          {/* IEC Number */}
          <div className="col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Import/Export Code
            </h1>
            <Input
              placeholder="Enter Company Pan Number"
              value={OnboardingDetail?.iec ?? formData?.iec ?? ""}
              name="iec"
              onChange={handleFieldChange}
              disabled={isDisabled}
            />
          </div>
          {/* IEC Proof */}
          {renderFileUpload(fileConfigs[0])}

          {/* TRC Number */}
          <div className="col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              TRC Number
            </h1>
            <Input
              placeholder="Enter TRC Number"
              value={
                OnboardingDetail?.trc_certificate_no ??
                formData?.trc_certificate_no ??
                ""
              }
              name="trc_certificate_no"
              onChange={handleFieldChange}
              disabled={isDisabled}
            />
          </div>
          {/* TRC Proof */}
          {renderFileUpload(fileConfigs[1])}

          {/* Digital Form 10F with sample links */}
          <div className="col-span-1">
            <h1 className="text-[12px] font-semibold  pb-3">Digital Form 10F</h1>
            <ul className="pl-4">
              <Link href={""} target="blank">
                <li className="text-blue-400 text-sm underline list-disc">
                  View Sample form 10F Document
                </li>
              </Link>
              <Link href={""} target="blank">
                <li className="text-blue-400 underline text-sm list-disc">
                  Step-By-Step-Guide to generate Form 10F
                </li>
              </Link>
              <Link href={""} target="blank">
                <li className="text-blue-400 underline text-sm list-disc">
                  Click Here to Generate Form 10F
                </li>
              </Link>
            </ul>
          </div>
          {/* Digital Form 10F Proof */}
          {renderFileUpload(fileConfigs[2])}

          {/* PE Certificate with sample download */}
          <div className="col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Permanent Establishment Certificate
            </h1>
            <Link
              className="text-blue-400 text-sm underline"
              href={""}
              target="blank"
            >
              Download PE Certificate Format File
            </Link>
          </div>
          {/* PE Proof */}
          {renderFileUpload(fileConfigs[3])}
        </div>
      </div>

      <div className={`flex justify-end gap-4 mt-4`}>
        <Button
          variant={"nextbtn"}
          size={"nextbtnsize"}
          className={`py-2 ${isDisabled ? "hidden" : ""}`}
          onClick={() => {
            handleSubmit();
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default DocumentDetails;


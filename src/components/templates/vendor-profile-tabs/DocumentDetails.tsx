"use client";
import React, { useEffect, useRef } from "react";
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
  FileAttachment,
  TdocumentDetailDropdown,
  TvendorOnboardingDetail,
  VendorOnboardingResponse,
} from "@/src/types/types";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../atoms/table";
import { Blob } from "buffer";

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
  onNextTab?: () => void;
  onBackTab?: () => void;
}

interface gstRow {
  name?: string;
  gst_document_upload: FileList;
  gst_state: string;
  gst_ven_type: string;
  gst_registration_date: string;
  gst_number: string;
  gst_document: FileAttachment;
  pincode: string;
  company: string;
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

  useEffect(() => {
    setDocumentDetail((prev) => ({
      ...prev,
    }));
  }, []);

  interface gstDropdown {
    states:{
      state_name: string;
      name: string;
      pincode: string;
    }[],
    company: {
      name: string;
      company_code: string;
      company_name: string;
      description: string;
    }[];
  }

  const [isRegistrationFilePreview, setIsRegistrationFilePreview] =
    useState<boolean>(true);
  const [isMsmeFilePreview, setIsMsmeFilePreview] = useState<boolean>(true);
  const [isGstFilePreview, setIsGstFilePreview] = useState<boolean>(true);
  const [isPanFilePreview, setIsPanFilePreview] = useState<boolean>(true);
  const [singlerow, setSingleRow] = useState<gstRow | null>();
  const [GSTTable, setGSTTable] = useState<gstRow[]>(
    OnboardingDetail?.gst_table
  );
  const [showGSTTable, setShowGSTTable] = useState(
    OnboardingDetail?.gst_table?.length > 0 ? true : false
  );
  const [gstStateDropdown, setGstStateDropdown] = useState<gstDropdown>();
  useEffect(() => {
    if (ref_no && onboarding_ref_no) {
      getState();
    }
  }, []);

  const getState = async () => {
    const url = `${API_END_POINTS?.gstVendorStateDropdown}?vendor_onboarding=${onboarding_ref_no}`;
    const response: AxiosResponse = await requestWrapper({
      url: url,
      method: "GET",
    });
    if (response?.status == 200) {
      setGstStateDropdown(response?.data?.message?.data);
      console.log(response?.data?.message, "this is state dropdown");
    }
  };

  const [errors, setErrors] = useState<any>({});

  const fileInput = useRef<HTMLInputElement>(null);

  const validate = () => {
    const errors: any = {};
    if (
      !documentDetails?.company_pan_number &&
      !OnboardingDetail?.company_pan_number
    ) {
      errors.company_pan_number = "Please Enter Company Pan Number";
    }
    if (
      !documentDetails?.name_on_company_pan &&
      !OnboardingDetail?.name_on_company_pan
    ) {
      errors.name_on_company_pan = "Please Enter Name On Company Pan";
    }

    // if ((documentDetails?.gst_ven_type == "Registered" && !documentDetails?.gst_state) && (!OnboardingDetail?.gst_table[0]?.gst_ven_type && OnboardingDetail?.gst_table[0]?.gst_state)) {
    //   errors.gst_state = "Please Select Gst State";

    // }
    // // if ((documentDetails?.gst_ven_type == "Registered" && !documentDetails?.gst_number) && (!OnboardingDetail?.gst_table[0]?.gst_ven_type && OnboardingDetail?.gst_table[0]?.gst_number)) {
    // //   errors.gst_number = "Please Enter Gst Number";

    // // }
    // if ((documentDetails?.gst_ven_type == "Registered" && !documentDetails?.gst_registration_date) && ((!OnboardingDetail?.gst_table[0]?.gst_ven_type && OnboardingDetail?.gst_table[0]?.gst_registration_date))) {
    //   errors.gst_registration_date = "Please Select Gst Registration Date";

    // }
    // if ((documentDetails?.gst_ven_type == "Registered" && documentDetails?.gstDocument?.length && documentDetails?.gstDocument?.length == 0) && (!OnboardingDetail?.gst_table[0]?.gst_ven_type && OnboardingDetail?.gst_table[0]?.gst_document)) {
    //   errors.gst_state = "Please Upload Gst File";

    // }

    if (
      documentDetails?.msme_registered == "Yes" &&
      !documentDetails?.msme_enterprise_type &&
      OnboardingDetail?.msme_registered == "yes" &&
      !OnboardingDetail?.msme_enterprise_type
    ) {
      errors.msme_enterprise_type = "Please Select Enterprise Type";
    }

    if (
      documentDetails?.msme_registered == "Yes" &&
      !documentDetails?.udyam_number &&
      OnboardingDetail?.msme_registered == "Yes" &&
      !OnboardingDetail?.udyam_number
    ) {
      errors.udyam_number = "Please Enter Udhyam Registration Number";
    }

    if (
      documentDetails?.msme_registered == "Yes" &&
      !documentDetails?.name_on_udyam_certificate &&
      OnboardingDetail?.msme_registered == "Yes" &&
      !OnboardingDetail?.name_on_udyam_certificate
    ) {
      errors.name_on_udyam_certificate = "Please Enter Name Udhyam Certificate";
    }

    // if (
    //   documentDetails?.msme_registered == "Yes" &&
    //   documentDetails?.udyamCertificate?.length &&
    //   documentDetails?.udyamCertificate?.length == 0 &&
    //   OnboardingDetail?.msme_registered == "Yes" &&
    //   !OnboardingDetail?.msme_proof
    // ) {
    //   errors.udyamCertificate = "Please Upload Udhyam Certificate";
    // }

    if (
      !documentDetails?.enterprise_registration_number &&
      !OnboardingDetail?.enterprise_registration_number
    ) {
      errors.enterprise_registration_number =
        "Please Enter Enterprice Registration Number";
    }

    return errors;
  };

  const checkGST = (str: string) => {
    let regex = new RegExp(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
    );
    if (str == null) {
      return false;
    }

    // Return true if the GST_CODE
    // matched the ReGex
    if (regex.test(str) == true) {
      return true;
    } else {
      return false;
    }
  };

  const checkPAN = (str: string) => {
    const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (str == null) {
      return false;
    }

    // Return true if the PAN matches the regex
    if (regex.test(str) == true) {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const url = API_END_POINTS?.documentDetailSubmit;
    if (
      !checkPAN(documentDetails?.company_pan_number as string) &&
      !checkPAN(OnboardingDetail?.company_pan_number)
    ) {
      alert("please enter correct PAN Number");
      return;
    }

    if (GSTTable?.length == 0) {
      alert("please add at least 1 gst document details");
      return;
    }
    // if(!checkGST(documentDetails?.gst_number as string)){
    //   alert("please enter correct gst number")
    //   return;
    // }
    const updatedData = {
      ...documentDetails,
      msme_registered: isMSME,
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
    if (Response?.status == 200) setDocumentDetail({});
    router.push(
      `/vendor-details-form?tabtype=Payment Detail&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`
    );
  };

  const handleBack = () => {
    router.push(
      `/vendor-details-form?tabtype=Company%20Address&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`
    );
  };

  const handleGSTTableAdd = async () => {
    // console.log(singlerow,"this is single row after add");

    if (!singlerow?.gst_ven_type) {
      setErrors((prev: any) => ({
        ...prev,
        gst_ven_type: "please select gst vendor type",
      }));
      return;
    }
    if (!singlerow?.gst_state) {
      setErrors((prev: any) => ({
        ...prev,
        gst_state: "please select gst state",
      }));
      return;
    }

    if (!singlerow?.pincode) {
      setErrors((prev: any) => ({
        ...prev,
        pincode: "please enter gst pincode",
      }));
      return;
    }

    if (
      singlerow?.gst_ven_type == "Registered" &&
      !singlerow?.gst_document_upload
    ) {
      setErrors((prev: any) => ({
        ...prev,
        gst_document_upload: "please upload gst document",
      }));
      return;
    }

    if (singlerow?.gst_ven_type == "Registered" && !singlerow?.gst_number) {
      setErrors((prev: any) => ({
        ...prev,
        gst_number: "please enter gst number",
      }));
      return;
    }

    if (
      singlerow?.gst_ven_type == "Registered" &&
      !singlerow?.gst_registration_date
    ) {
      setErrors((prev: any) => ({
        ...prev,
        gst_registration_date: "please enter gst registration date",
      }));
      return;
    }

    if (
      singlerow?.gst_ven_type != "Not-Registered" &&
      !checkGST(singlerow?.gst_number as string)
    ) {
      alert("please enter correct gst number");
      return;
    }
    const url = API_END_POINTS?.addGSTTAbleData;
    const table = [{ ...singlerow }];
    const data = {
      ref_no: ref_no,
      vendor_onboarding: onboarding_ref_no,
      gst_table: table,
    };
    const formdata = new FormData();
    formdata.append("data", JSON.stringify(data));
    if (singlerow?.gst_document_upload) {
      formdata.append("gst_document", singlerow?.gst_document_upload[0]);
    }
    const response: AxiosResponse = await requestWrapper({
      url: url,
      data: formdata,
      method: "POST",
    });
    if (response?.status == 200) {
      alert("submittes successfully");
      fetchGstTable();
      setSingleRow(null);
      setShowGSTTable(true);
      if (fileInput?.current) {
        fileInput.current.value = "";
      }
      setErrors({});
    }
  };

  const handleGSTDelete = async (row_name: string) => {
    const deleteUrl = `${API_END_POINTS?.deleteGSTRow}?row_name=${row_name}&ref_no=${ref_no}&vendor_onboarding=${onboarding_ref_no}`;
    const response: AxiosResponse = await requestWrapper({
      url: deleteUrl,
      method: "GET",
    });
    if (response?.status == 200) {
      alert("Sccessfully Deleted");
      fetchGstTable();
    }
  };

  const fetchGstTable = async () => {
    const fetchOnboardingDetailUrl = `${API_END_POINTS?.fetchDetails}?ref_no=${ref_no}&vendor_onboarding=${onboarding_ref_no}`;
    const fetchOnboardingDetailResponse: AxiosResponse = await requestWrapper({
      url: fetchOnboardingDetailUrl,
      method: "GET",
    });
    const OnboardingDetail: VendorOnboardingResponse["message"]["document_details_tab"]["gst_table"] =
      fetchOnboardingDetailResponse?.status == 200
        ? fetchOnboardingDetailResponse?.data?.message?.document_details_tab
            ?.gst_table
        : "";
    setGSTTable(OnboardingDetail);
  };

  const handlePincodeChange = async (pincode: string) => {
    setSingleRow((prev: any) => ({
      ...prev,
      pincode: pincode,
    }));
    if (pincode.length < 6) {
      return;
    }
    const url = `${API_END_POINTS?.getStateBasedOnPincode}?pincode=${pincode}`;
    const response: AxiosResponse = await requestWrapper({
      url: url,
      method: "GET",
    });
    if (response?.status == 200) {
      setSingleRow((prev: any) => ({
        ...prev,
        gst_state: response?.data?.message?.data?.state?.name,
      }));
    }
  };

  const validateGSTDate = (date:string)=>{
    const todayDate = new Date();
    const inputDate = new Date(date);
    if(inputDate > todayDate){
      alert("Selected Date Cannot be Greater Than Today's Date");
      return;
    }else{
      setSingleRow((prev: any) => ({
                    ...prev,
                    gst_registration_date: date,
                  }));
    }
  }

  console.log(singlerow);
  console.log(gstStateDropdown, "this is dropown");

  return (
    <div className="flex flex-col bg-white rounded-lg p-4 w-full max-h-[80vh]">
      <h1 className="border-b-2 pb-2 text-lg">Document Details</h1>
      <div className="overflow-y-scroll">
        <div className="grid grid-cols-3 gap-6 p-5 ">
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Company PAN Number{" "}
              <span className="pl-2 text-red-400 text-2xl">*</span>
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
            {errors?.company_pan_number &&
              !documentDetails?.company_pan_number && (
                <span style={{ color: "red" }}>
                  {errors?.company_pan_number}
                </span>
              )}
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Name of Company on PAN Card{" "}
              <span className="pl-2 text-red-400 text-2xl">*</span>
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
            {errors?.name_on_company_pan &&
              !documentDetails?.name_on_company_pan && (
                <span style={{ color: "red" }}>
                  {errors?.name_on_company_pan}
                </span>
              )}
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Upload PAN Document{" "}
              <span className="pl-2 text-red-400 text-2xl">*</span>
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
              {errors?.panDocument && !documentDetails?.panDocument && (
                <span style={{ color: "red" }}>{errors?.panDocument}</span>
              )}
            </div>
          </div>
          <div className="col-span-3 grid grid-cols-3 gap-6">
            <div className="flex flex-col">
              <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                GST Vendor Type{" "}
                <span className="pl-2 text-red-400 text-2xl">*</span>
              </h1>
              <Select
                // onValueChange={(value) => {
                //   setBusinessType(value);
                //   setDocumentDetail((prev) => ({
                //     ...prev,
                //     gst_ven_type: value,
                //   }));
                // }}
                onValueChange={(value) => {
                  setSingleRow((prev: any) => ({
                    ...prev,
                    gst_ven_type: value,
                  }));
                }}
                value={singlerow?.gst_ven_type ?? ""}
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
              {errors?.gst_ven_type && !singlerow?.gst_ven_type && (
                <span style={{ color: "red" }}>{errors?.gst_ven_type}</span>
              )}
            </div>
            <div>
              <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                Meril Company <span className="pl-2 text-red-400 text-2xl">*</span>
              </h1>
              <Select
                onValueChange={(value) => {
                  setSingleRow((prev: any) => ({ ...prev, company: value }));
                }}
                value={singlerow?.company ?? ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {gstStateDropdown?.company?.map((item, index) => (
                      <SelectItem key={index} value={item?.name}>
                        {item?.description}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors?.pincode && !singlerow?.pincode && (
                <span style={{ color: "red" }}>{errors?.pincode}</span>
              )}
            </div>
            <div>
              <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                Pincode <span className="pl-2 text-red-400 text-2xl">*</span>
              </h1>
              {/* <Input
                className="disabled:opacity-100"
                placeholder="Enter Pincode"
                value={
                  singlerow?.pincode ??
                  ""
                }
                // onChange={(e) => {
                //   setDocumentDetail((prev) => ({
                //     ...prev,
                //     gst_number: e.target.value,
                //   }));
                // }}
                onChange={(e) => {
                  handlePincodeChange(e.target.value);
                }}
              /> */}
              <Select
                // onValueChange={(value) => {
                //   setDocumentDetail((prev) => ({ ...prev, gst_state: value }));
                // }}
                onValueChange={(value) => {
                  // setSingleRow((prev: any) => ({ ...prev, gst_state: value }));
                  handlePincodeChange(value);
                }}
                value={singlerow?.pincode ?? ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Pincode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {gstStateDropdown?.states.map((item, index) => (
                      <SelectItem key={index} value={item?.pincode}>
                        {item?.pincode}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors?.pincode && !singlerow?.pincode && (
                <span style={{ color: "red" }}>{errors?.pincode}</span>
              )}
            </div>
            <div>
              <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                State <span className="pl-2 text-red-400 text-2xl">*</span>
              </h1>
              {/* <Input placeholder="Enter State" value={documentDetails?.gst_state ?? OnboardingDetail?.gst_table[0]?.gst_state} onChange={(e)=>{setDocumentDetail((prev)=>({...prev,gst_state:e.target.value}))}}/> */}
              <Select
                disabled
                // onValueChange={(value) => {
                //   setDocumentDetail((prev) => ({ ...prev, gst_state: value }));
                // }}
                onValueChange={(value) => {
                  setSingleRow((prev: any) => ({ ...prev, gst_state: value }));
                }}
                value={singlerow?.gst_state ?? ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Vendor State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {gstStateDropdown?.states?.map((item, index) => (
                      <SelectItem key={index} value={item?.name}>
                        {item?.state_name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors?.gst_state && !singlerow?.gst_state && (
                <span style={{ color: "red" }}>{errors?.gst_state}</span>
              )}
            </div>
          </div>
          <div
            className={`col-span-3 grid grid-cols-3 gap-6 ${singlerow?.gst_ven_type == "Not-Registered" ? "hidden" : ""}`}
          >
            <div>
              <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                GST Number <span className="pl-2 text-red-400 text-2xl">*</span>
              </h1>
              <Input
                placeholder="Enter GST Number"
                value={singlerow?.gst_number ?? ""}
                // onChange={(e) => {
                //   setDocumentDetail((prev) => ({
                //     ...prev,
                //     gst_number: e.target.value,
                //   }));
                // }}
                onChange={(e) => {
                  setSingleRow((prev: any) => ({
                    ...prev,
                    gst_number: e.target.value,
                  }));
                }}
              />
              {errors?.gst_number && !singlerow?.gst_number && (
                <span style={{ color: "red" }}>{errors?.gst_number}</span>
              )}
            </div>
            <div>
              <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                GST Registration Date{" "}
                <span className="pl-2 text-red-400 text-2xl">*</span>
              </h1>
              <Input
              
                placeholder="Enter Registration Date"
                value={singlerow?.gst_registration_date ?? ""}
                type="date"
                // onChange={(e) => {
                //   setDocumentDetail((prev) => ({
                //     ...prev,
                //     gst_registration_date: e.target.value,
                //   }));
                // }}
                onChange={(e) => {
                  validateGSTDate(e.target.value);
                }}
              />
              {errors?.gst_registration_date &&
                !singlerow?.gst_registration_date && (
                  <span style={{ color: "red" }}>
                    {errors?.gst_registration_date}
                  </span>
                )}
            </div>
            <div>
              <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                Upload GST Document{" "}
                <span className="pl-2 text-red-400 text-2xl">*</span>
              </h1>
              <div className="flex gap-4">
                <Input
                  ref={fileInput}
                  type="file"
                  // onChange={(e) => {
                  //   setDocumentDetail((prev: any) => ({
                  //     ...prev,
                  //     gstDocument: e.target.files,
                  //   }));
                  // }}
                  onChange={(e) => {
                    setSingleRow((prev: any) => ({
                      ...prev,
                      gst_document_upload: e.target.files,
                    }));
                  }}
                />
                {errors?.gstDocument && !singlerow?.gst_document_upload && (
                  <span style={{ color: "red" }}>{errors?.gstDocument}</span>
                )}
                {/* file preview */}
                {/* {isGstFilePreview &&
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
              )} */}
              </div>
            </div>
          </div>
        </div>
        <div className={`flex justify-end pr-6 mb-4`}>
          <Button
            className={`bg-blue-400 hover:bg-blue-400`}
            onClick={() => {
              handleGSTTableAdd();
            }}
          >
            Add
          </Button>
        </div>
        {showGSTTable && (
          <div className="shadow- bg-[#f6f6f7] p-4 mb-4 rounded-2xl">
            <div className="flex w-full justify-between pb-4">
              <h1 className="text-[20px] text-[#03111F] font-semibold">
                Multiple GST Certificates
              </h1>
            </div>
            <Table className=" max-h-40 overflow-y-scroll">
              {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
              <TableHeader className="text-center">
                <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
                  <TableHead className="text-center">GST Type</TableHead>
                  <TableHead className="text-center">Meril Company</TableHead>
                  <TableHead className="text-center">GST State</TableHead>
                  <TableHead className="text-center">GST Pincode</TableHead>
                  <TableHead className="text-center">GST Number</TableHead>
                  <TableHead className="text-center">GST Date</TableHead>
                  <TableHead className="text-center">File</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {GSTTable?.map((item, index) => (
                  <TableRow key={item?.name ? item?.name : ""}>
                    <TableCell className="text-center">
                      {item?.gst_ven_type}
                    </TableCell>
                    <TableCell className="text-center">
                      {item?.company}
                    </TableCell>
                    <TableCell className="text-center">
                      {item?.gst_state}
                    </TableCell>
                    <TableCell className="text-center">
                      {item?.pincode}
                    </TableCell>
                    <TableCell className="text-center">
                      {item?.gst_number}
                    </TableCell>
                    <TableCell className="text-center">
                      {item?.gst_registration_date}
                    </TableCell>
                    <TableCell className="text-center">
                      <Link href={item?.gst_document?.url} target="blank">
                        {item?.gst_document?.file_name}
                      </Link>
                    </TableCell>
                    <TableCell className="flex justify-center items-center text-center">
                      <Trash2
                        onClick={() => {
                          handleGSTDelete(item?.name ? item?.name : "");
                        }}
                        className=" text-red-400 cursor-pointer"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <div className="grid grid-cols-3 p-5 gap-6">
          <div className="flex flex-col col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-[26px]">
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
              MSME Enterprise Type{" "}
              <span className="pl-2 text-red-400 text-2xl">*</span>
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
            {errors?.msme_enterprise_type &&
              !documentDetails?.msme_enterprise_type && (
                <span style={{ color: "red" }}>
                  {errors?.msme_enterprise_type}
                </span>
              )}
          </div>
          <div
            className={`flex flex-col col-span-1 ${isMSME == "Yes" ? "" : "hidden"}`}
          >
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Udyam Registration No.{" "}
              <span className="pl-2 text-red-400 text-2xl">*</span>
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
            {errors?.udyam_number && !documentDetails?.udyam_number && (
              <span style={{ color: "red" }}>{errors?.udyam_number}</span>
            )}
          </div>
          <div
            className={`flex flex-col col-span-1 ${isMSME == "Yes" ? "" : "hidden"}`}
          >
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Name of Company in Udyam Certificate{" "}
              <span className="pl-2 text-red-400 text-2xl">*</span>
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
            {errors?.name_on_udyam_certificate &&
              !documentDetails?.name_on_udyam_certificate && (
                <span style={{ color: "red" }}>
                  {errors?.name_on_udyam_certificate}
                </span>
              )}
          </div>
          <div
            className={`flex flex-col col-span-1 ${isMSME == "Yes" ? "" : "hidden"}`}
          >
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Upload Udyam Certificate{" "}
              <span className="pl-2 text-red-400 text-2xl">*</span>
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
              {errors?.udyamCertificate &&
                !documentDetails?.udyamCertificate && (
                  <span style={{ color: "red" }}>
                    {errors?.udyamCertificate}
                  </span>
                )}
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
          <div className={`flex flex-col col-span-1`} title="Type NA for if you don't have the Number">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Enterprise Registration Number{" "}
              <span className="pl-2 text-red-400 text-2xl">*</span>
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
            {errors?.enterprise_registration_number &&
              !documentDetails?.enterprise_registration_number && (
                <span style={{ color: "red" }}>
                  {errors?.enterprise_registration_number}
                </span>
              )}
          </div>
          <div className={`flex flex-col col-span-1`}>
            <h1 className="text-[12px] font-normal text-[#626973] pb-6">
              Upload Enterprise Registration Document{" "}
              {/* <span className="pl-2 text-red-400 text-2xl">*</span> */}
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
              {errors?.registrationDocument &&
                !documentDetails?.registrationDocument && (
                  <span style={{ color: "red" }}>
                    {errors?.registrationDocument}
                  </span>
                )}
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
        <div className="flex justify-end items-center space-x-3 mt-3">
          <Button onClick={handleBack} variant="backbtn" size="backbtnsize">
            Back
          </Button>

          <Button onClick={handleSubmit} variant="nextbtn" size="nextbtnsize">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;

'use client'
import React, { FormEvent, useEffect, useState } from "react";
import { Input } from "../../atoms/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../atoms/select";
import { TcompanyDetailDropdown, TCompanyDetailForm, TvendorOnboardingDetail, VendorOnboardingResponse } from "@/src/types/types";
import { useCompanyDetailFormStore } from "@/src/store/companyDetailStore";
import { Button } from "../../atoms/button";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { Pencil, Lock } from "lucide-react";

interface Props {
  companyDetailDropdown: TcompanyDetailDropdown["message"]["data"]
  onboarding_refno?: string
  refno?: string,
  OnboardingDetail: VendorOnboardingResponse["message"]["company_details_tab"]
  multipleCompany: { company: string }[]
  ismulticompany: boolean,
  isAmendment: number
  re_release: number
}

const CompanyDetailForm = ({ companyDetailDropdown, onboarding_refno, refno, OnboardingDetail, multipleCompany, ismulticompany, isAmendment, re_release }: Props) => {
  const router = useRouter();
  const [errors, setErrors] = useState<any>({});
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const { data, updateField, resetForm } = useCompanyDetailFormStore();
  const { designation } = useAuth();
  const validate = () => {
    const errors: any = {};
    // if (!data?.type_of_business) {
    //   errors.type_of_business = "Please Select Type Of Business ";
    // }
    // // if (!data?.registered_office_number) {
    // //   errors.registered_office_number = "Please Select Reg No. ";
    // // }

    // if (!data?.corporate_identification_number) {
    //   errors.corporate_identification_number = "Please Select Corporate Identification Number ";

    // } if (!data?.cin_date) {
    //   errors.cin_date = "Please Select Cin Date"
    // } 

    return errors;
  };

  console.log(OnboardingDetail, "this is onboarding detail")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const companyDetailSubmitUrl = API_END_POINTS?.companyDetailSubmit
    const updatedData: TCompanyDetailForm | {} = { ...data, vendor_onboarding: onboarding_refno as string, ref_no: refno as string }
    try {
      const resposne: AxiosResponse = await requestWrapper({ url: companyDetailSubmitUrl, method: "POST", data: { data: updatedData } });
      if (resposne?.status == 200) {
        alert("Company Details Updated Successfully!!!");
        router.push(`/view-onboarding-details?tabtype=Company%20Address&vendor_onboarding=${onboarding_refno}&refno=${refno}`);
        // location.reload();
      };
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-lg p-2 w-full">
      <div className="flex justify-between items-center border-b-2">
        <h1 className="font-semibold text-[18px]">Company Detail</h1>
        {/* <Button onClick={() => { setIsDisabled(prev => !prev) }} className={`mb-2 ${isAmendment == 1 || re_release == 1 ? "" : "hidden"}`}>{isDisabled ? "Enable Edit" : "Disable Edit"}</Button> */}
        {designation == "Purchase Team" &&(isAmendment == 1 || re_release == 1) && (
          <div
            onClick={() => setIsDisabled(prev => !prev)}
            className="mb-2 inline-flex items-center gap-2 cursor-pointer rounded-[28px] border px-3 py-2 shadow-sm bg-[#5e90c0] hover:bg-gray-100 transition"
          >
            {isDisabled ? (
              <>
                <Lock className="w-5 h-5 text-red-500" />
                <span className="text-[14px] font-medium text-white hover:text-black">Enable Edit</span>
              </>
            ) : (
              <>
                <Pencil className="w-5 h-5 text-green-600" />
                <span className="text-[14px] font-medium text-white hover:text-black">Disable Edit</span>
              </>
            )}
          </div>
        )}
      </div>
      <form onSubmit={(e) => { handleSubmit(e) }}>
        <div className="grid grid-cols-3 gap-6 p-2 overflow-y-scroll max-h-[70vh]">
          <div>
            <div className="grid grid-cols-4 gap-1">
              <div className="flex flex-col col-span-1">
                <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                  Vendor Title
                </h1>
                <Input className="col-span-2 disabled:opacity-100" placeholder="Enter Company Name" defaultValue={OnboardingDetail?.vendor_title ?? ""} disabled={isDisabled} />
              </div>
              <div className="col-span-3">
                <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                  Company Name
                </h1>
                <Input className="col-span-2 w-full border rounded-lg disabled:opacity-100" placeholder="Enter Company Name" defaultValue={OnboardingDetail?.vendor_name ?? ""} disabled={isDisabled} />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-[12px] font-normal text-[#626973] flex">
              Type Of Business (Please select any one) <span className="pl-2 text-red-400 text-xl">*</span>
            </h1>
            <Select disabled={isDisabled} required={true} onValueChange={(value) => { updateField('type_of_business', value) }} value={data?.type_of_business ?? OnboardingDetail?.type_of_business}>
              <SelectTrigger className="disabled:opacity-100">
                <SelectValue placeholder="Select Vendor Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {
                    companyDetailDropdown?.type_of_business?.map((item, index) => (
                      <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                    ))
                  }
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors?.type_of_business && !data?.type_of_business && <span style={{ color: 'red' }}>{errors?.type_of_business}</span>}
          </div>
          <div className="flex flex-col">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Size of Company
            </h1>
            <Input
              className="disabled:opacity-100"
              disabled={isDisabled}
              placeholder=""
              onChange={(e) => {
                updateField("size_of_company", e.target.value);
              }}
              value={data?.size_of_company ?? OnboardingDetail?.size_of_company ?? ""}
            />
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Website
            </h1>
            <Input className="disabled:opacity-100" disabled={isDisabled} placeholder="" onChange={(e) => { updateField("website", e.target.value) }} value={data?.website ?? OnboardingDetail?.website ?? ""} />
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Reg No.
              {/* <span className="pl-2 text-red-400 text-xl">*</span> */}
            </h1>
            <Input className="disabled:opacity-100" disabled={isDisabled} placeholder="Enter Reg No." onChange={(e) => { updateField("registered_office_number", e.target.value) }} value={data?.registered_office_number ?? OnboardingDetail?.registered_office_number ?? ""} />
            {errors?.registered_office_number && !data?.registered_office_number && <span style={{ color: 'red' }}>{errors?.registered_office_number}</span>}
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Mobile Number
            </h1>
            <Input className="disabled:opacity-100" placeholder="Enter Mobile Number" disabled={isDisabled} onChange={(e) => { updateField("telephone_number", e.target.value) }} value={data?.telephone_number ?? OnboardingDetail?.telephone_number ?? ""} />
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              WhatsApp Number (If applicable)
            </h1>
            <Input className="disabled:opacity-100" disabled={isDisabled} placeholder="" onChange={(e) => { updateField("whatsapp_number", e.target.value) }} value={data?.whatsapp_number ?? OnboardingDetail?.whatsapp_number ?? ""} />
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Established Year
            </h1>
            <Input disabled={isDisabled} className="disabled:opacity-100" placeholder="" onChange={(e) => { updateField("established_year", e.target.value) }} value={data?.established_year ?? OnboardingDetail?.established_year ?? ""} />
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Office Email Primary
            </h1>
            <Input className="disabled:opacity-100" placeholder="" disabled={isDisabled} onChange={(e) => { updateField("office_email_primary", e.target.value) }} value={data?.office_email_primary ?? OnboardingDetail?.office_email_primary ?? ""} />
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Office Email (Secondary)
            </h1>
            <Input disabled={isDisabled} className="disabled:opacity-100" placeholder="" onChange={(e) => { updateField("office_email_secondary", e.target.value) }} value={data?.office_email_secondary ?? OnboardingDetail?.office_email_secondary ?? ""} />
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] flex">
              Corporate Identification No.(CIN No.) <span className="pl-2 text-red-400 text-xl">*</span>
            </h1>
            <Input className="disabled:opacity-100" disabled={isDisabled} placeholder="" onChange={(e) => { updateField("corporate_identification_number", e.target.value) }} value={data?.corporate_identification_number ?? OnboardingDetail?.corporate_identification_number ?? ""} />
            {errors?.corporate_identification_number && !data?.corporate_identification_number && <span style={{ color: 'red' }}>{errors?.corporate_identification_number}</span>}
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] flex">
              Cin Date <span className="pl-2 text-red-400 text-xl">*</span>
            </h1>
            <Input className="disabled:opacity-100" disabled={isDisabled} type="date" placeholder="Enter Mobile Number" onChange={(e) => { updateField("cin_date", e.target.value) }} value={data?.cin_date ?? OnboardingDetail?.cin_date ?? ""} />
            {errors?.cin_date && !data?.cin_date && <span style={{ color: 'red' }}>{errors?.cin_date}</span>}
          </div>
          <div className="flex flex-col">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Nature of Company(Please select anyone)
            </h1>
            <Select disabled={isDisabled} onValueChange={(value) => { updateField('nature_of_company', value) }} value={data?.nature_of_company ?? OnboardingDetail?.nature_of_company ?? ""}>
              <SelectTrigger className="disabled:opacity-100">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {
                    companyDetailDropdown?.company_nature_master?.map((item, index) => (
                      <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                    ))
                  }
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Nature of Business (Please Select anyone)
            </h1>
            <Select disabled={isDisabled} onValueChange={(value) => { updateField('nature_of_business', value) }} value={data?.nature_of_business ?? OnboardingDetail?.nature_of_business}>
              <SelectTrigger className="disabled:opacity-100">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {
                    companyDetailDropdown?.business_nature_master?.map((item, index) => (
                      <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                    ))
                  }
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Meril Associated Companies
            </h1>
            {
              ismulticompany ?
                <textarea className="col-span-2 disabled:opacity-100 w-full border rounded-lg p-2" placeholder="Enter Company Name" defaultValue={multipleCompany.map((item, index) => (item?.company)) ?? ""} disabled/>
                :
                <Input placeholder="" className="disabled:opacity-100" defaultValue={OnboardingDetail?.company_name_description ?? ""} disabled />
            }
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Vendor Type
            </h1>
            <textarea className="col-span-2 w-full border rounded-lg p-2 disabled:opacity-100" placeholder="" defaultValue={OnboardingDetail?.vendor_type_list_from_master?.map((item) => (item))} disabled/>
          </div>
        </div>
        <div className="flex justify-end pr-4 pb-4">
          <Button className={`py-2 ${isDisabled ? "hidden" : ""}`} variant={"nextbtn"} size={"nextbtnsize"}>Next</Button>
        </div>
      </form>
    </div>
  );
};

export default CompanyDetailForm;

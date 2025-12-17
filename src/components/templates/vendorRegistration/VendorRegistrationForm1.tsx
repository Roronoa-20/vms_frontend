"use client";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../atoms/select";
import MultiSelect, { MultiValue, SingleValue } from "react-select";
import { TvendorRegistrationDropdown, VendorRegistrationData } from "@/src/types/types";
import { useVendorStore } from "../../../store/VendorRegistrationStore";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import { multiSelectStyles } from "../../common/sharedStyles";

type OptionType = {
  value: string;
  label: string;
};

interface Props {
  vendorTypeDropdown: TvendorRegistrationDropdown["message"]["data"]["vendor_type"];
  vendorTitleDropdown: TvendorRegistrationDropdown["message"]["data"]["vendor_title"];
  countryDropdown: TvendorRegistrationDropdown["message"]["data"]["country_master"];
  formData: Partial<VendorRegistrationData>;
  handlefieldChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleSelectChange: (value: any, name: string) => void;
  setMultiVendor: (data: any) => void;
  VendorNameCheckApi:(email:string)=>void
  fieldDisable:boolean
}

const VendorRegistration1 = ({
  vendorTypeDropdown,
  vendorTitleDropdown,
  countryDropdown,
  formData,
  handlefieldChange,
  handleSelectChange,
  setMultiVendor,
  VendorNameCheckApi,
  fieldDisable
}: Props) => {
  const [newVendorTypeDropdown, setNewVendorTypeDropdown] = useState<OptionType[]>([]);
  const [countryMobileCode, setCountryMobileCode] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [multiSelectCountryDropdownList,setMultiSelectCountryDropdownList] = useState<OptionType[]>([]);

  // Avoid SSR hydration mismatch by only setting after mount
  useEffect(() => {
    if (vendorTypeDropdown?.length) {
      setNewVendorTypeDropdown(
        vendorTypeDropdown.map((item) => ({
          label: item?.name,
          value: item?.name,
        }))
      );
    }
    if (countryDropdown?.length) {
      setMultiSelectCountryDropdownList(
        countryDropdown.map((item) => ({
          label: item?.name,
          value: item?.name,
        }))
      );
    }
  }, [vendorTypeDropdown]);

  const handleVendorTypeChange = (value: MultiValue<OptionType>) => {
    const newArray = value?.map((item) => item?.value);
    const newArray2 = value?.map((item) => ({ vendor_type: item?.value }));
    handleSelectChange(newArray2, "vendor_types");
    setMultiVendor(newArray);
  };

  const fetchCountryCode = async (value: string) => {
    try {
      const url = API_END_POINTS?.mobileCodeBasedOnCountry;
      const countryCodeApi: AxiosResponse = await requestWrapper({
        url,
        data: { data: { country: value } },
        method: "POST",
      });
      if (countryCodeApi?.status === 200) {
        setCountryMobileCode(countryCodeApi?.data?.message ?? "");
      }
    } catch (err) {
      console.error("Country code fetch failed", err);
    }
  };

  const handleCountryChange = async(value:SingleValue<OptionType>)=>{
    fetchCountryCode(value?.value as string);
    handleSelectChange(value?.value, "country");
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    handlefieldChange(e);

    if (!value.includes("@")) {
      setEmailError("Please enter a valid email");
    } else {
      setEmailError("");
    }
  };

  return (
    <div className="mb-4">
      <h1 className="text-[18px] font-semibold pb-1 leading-[24px] text-[#03111F] border-b border-slate-500">
        Vendor Details
      </h1>
      <div className="grid grid-cols-3 gap-5 p-2">
        {/* Vendor Type */}
        <div className="flex flex-col">
          <h1 className="text-[14px] font-normal text-black pb-2">Vendor Type</h1>
          {newVendorTypeDropdown.length > 0 && (
            <MultiSelect
              onChange={handleVendorTypeChange}
              instanceId="vendor-type-multiselect"
              options={newVendorTypeDropdown}
              isMulti
              required
              className="text-[12px] text-black"
              menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
              styles={multiSelectStyles}
            />
          )}
        </div>

        {/* Vendor Title + Name */}
        <div>
          <div className="grid grid-cols-4 gap-1">
            <div className="flex flex-col col-span-1">
              <h1 className="text-[14px] font-normal text-black pb-2">Vendor Title</h1>
              <Select
                onValueChange={(value) => handleSelectChange(value, "vendor_title")}
                value={formData?.vendor_title ?? ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {vendorTitleDropdown?.length ? (
                      vendorTitleDropdown.map((item) => (
                        <SelectItem value={item?.name} key={item?.name}>
                          {item?.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="text-center">No Value</div>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-3">
              <h1 className="text-[14px] font-normal text-black pb-2">Vendor Name</h1>
              <Input
                className="col-span-2"
                required
                placeholder="Enter Vendor Name"
                name="vendor_name"
                value={formData?.vendor_name ?? ""}
                onChange={(e)=>{handlefieldChange(e)}}
                disabled={fieldDisable}
              />
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <h1 className="text-[14px] font-normal text-black pb-2">Email</h1>
          <Input
            required
            onChange={(e)=>{handleEmailChange(e),VendorNameCheckApi(e.target.value)}}
            value={formData?.office_email_primary ?? ""}
            name="office_email_primary"
            placeholder="Enter Email Address"
            disabled={fieldDisable}
          />
          {emailError && (
            <span className="text-red-500 text-[12px] mt-1">{emailError}</span>
          )}
        </div>

        {/* Country */}
        <div>
          <h1 className="text-[14px] font-normal text-black pb-2">Country</h1>
          {/* <Select
            required
            value={formData?.country ?? ""}
            onValueChange={(value) => {
              handleSelectChange(value, "country");
              fetchCountryCode(value);
            }}
            disabled={fieldDisable}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {countryDropdown?.length ? (
                  countryDropdown.map((item) => (
                    <SelectItem value={item?.name} key={item?.name}>
                      {item?.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="text-center">No Value</div>
                )}
              </SelectGroup>
            </SelectContent>
          </Select> */}

                <MultiSelect
                value={{value:formData?.country,label:formData?.country}}
              onChange={handleCountryChange}
              instanceId="country-multiselect"
              options={multiSelectCountryDropdownList}
              className="text-[12px] text-black"
              menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
              styles={multiSelectStyles}
            />

        </div>

        {/* Mobile No. */}
        <div>
          <div className="grid grid-cols-4 gap-3">
            <div className="flex flex-col col-span-1">
              <h1 className="text-[14px] font-normal text-black pb-2">Mobile No.</h1>
              <Input placeholder="+91" value={countryMobileCode} disabled readOnly />
            </div>
            <div className="col-span-3 flex flex-col justify-end">
              <Input
                placeholder="Enter Mobile Number"
                name="mobile_number"
                required
                value={formData?.mobile_number ?? ""}
                onChange={handlefieldChange}
                disabled={fieldDisable}
              />
            </div>
          </div>
        </div>

        {/* Search Terms */}
        <div>
          <h1 className="text-[14px] font-normal text-black pb-2">Search Terms</h1>
          <Input
            placeholder="Enter Search Terms"
            name="search_term"
            value={formData?.search_term ?? ""}
            required
            onChange={handlefieldChange}
            disabled={fieldDisable}
          />
        </div>
      </div>
    </div>
  );
};

export default VendorRegistration1;
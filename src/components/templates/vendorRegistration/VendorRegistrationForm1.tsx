"use client";
import { Input } from "@/components/ui/input";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../atoms/select";
import MultiSelect from "react-select";
import {
  TvendorRegistrationDropdown,
  VendorRegistrationData,
} from "@/src/types/types";
import { useEffect } from "react";
import { useState } from "react";
import { useVendorStore } from "../../../store/VendorRegistrationStore";

interface Props {
  vendorTypeDropdown: TvendorRegistrationDropdown["message"]["data"]["vendor_type"];
  vendorTitleDropdown: TvendorRegistrationDropdown["message"]["data"]["vendor_title"];
  countryDropdown: TvendorRegistrationDropdown["message"]["data"]["country_master"];
}

import { MultiValue } from "react-select";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";

type OptionType = {
  value: string;
  label: string;
};

const VendorRegistration1 = ({
  vendorTypeDropdown,
  vendorTitleDropdown,
  countryDropdown,
}: Props) => {
  const { data, updateVendorTypes, resetForm } = useVendorStore();
  const updateField = useVendorStore(state => state.updateField);
// const updateVendorTypes = useVendorStore(state => state.updateVendorTypes);
// const resetForm = useVendorStore(state => state.resetForm);

// // Only get data when you actually need it for display
const currentData = useVendorStore(state => state.data);
  const [formData, setFormData] = useState<Partial<VendorRegistrationData>>({});
  const [isQa, setIsQa] = useState<boolean>(false);
  const [newVendorTypeDropdown, setNewVendorTypeDropdown] = useState<
    MultiValue<OptionType>
  >([]);
  const [countryMobileCode, setCountryMobileCode] = useState<string>("");
  useEffect(() => {
    const newVendorType = vendorTypeDropdown?.map((item, index) => {
      return { label: item?.name, value: item?.name };
    });
    setNewVendorTypeDropdown(() => [...newVendorType]);
  }, []);

  const handleVendorTypeChange = async (value: MultiValue<OptionType>) => {
    const newArray = value?.map((item) => {
      return item?.value;
    });

    const newArray2 = value?.map((item) => {
      return {
        vendor_type: item?.value,
      };
    });

    updateVendorTypes(newArray2);
    if (newArray?.includes("Material Vendor")) {
      setIsQa(true);
    } else {
      setIsQa(false);
    }
  };

  const fetchCountryCode = async (value: string) => {
    const url = API_END_POINTS?.mobileCodeBasedOnCountry;
    const countryCodeApi: AxiosResponse = await requestWrapper({
      url: url,
      data: { data: { country: value } },
      method: "POST",
    });
    if (countryCodeApi?.status == 200) {
      setCountryMobileCode(countryCodeApi?.data?.message);
    }
  };

  const handlefieldChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(
      (prev) => ({ ...prev, [name]: value }) as VendorRegistrationData
    );
    updateField(name as keyof VendorRegistrationData,value)
  };
  // const handleSelectChange = (value: string, name: string) => {
  //   setFormData(
  //     (prev) => ({ ...prev, [name]: value }) as VendorRegistrationData
  //   );
  // };
  return (
    <div>
      <h1 className="text-[20px] font-medium pb-1 leading-[24px] text-[#03111F] border-b border-slate-500">
        Vendor Details
      </h1>
      <div className="grid grid-cols-3 gap-6 p-5">
        <div className="flex flex-col">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Vendor Type
          </h1>
          <MultiSelect
            onChange={(value) => {
              handleVendorTypeChange(value);
            }}
            instanceId="multiselect"
            options={newVendorTypeDropdown}
            isMulti
            required={true}
          />
        </div>
        {isQa && (
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              QA Required
            </h1>
            <Select
              onValueChange={(value) => {
                updateField("qa_required", value);
              }}
              value={currentData?.qa_required ?? ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={"Yes"}>Yes</SelectItem>
                  <SelectItem value={"No"}>No</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
        <div>
          <div className="grid grid-cols-4 gap-1">
            <div className="flex flex-col col-span-1">
              <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                Vendor Title
              </h1>
              <Select
                onValueChange={(value) => {
                  updateField("vendor_title", value);
                }}
                value={currentData?.vendor_title ?? ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {vendorTitleDropdown ? (
                      vendorTitleDropdown?.map((item) => (
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
              <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                Vendor Name
              </h1>
              <Input
                className="col-span-2"
                required
                value={formData?.vendor_name ?? ""}
                name="vendor_name"
                placeholder="Enter Vendor Name"
                onChange={(e) => {
                  // updateField("vendor_name", e.target.value);
                  handlefieldChange(e);
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">Email</h1>
          <Input
            required
            name="office_email_primary"
            onChange={(e) => {
              // updateField("office_email_primary", e.target.value);
              handlefieldChange(e);
            }}
            placeholder="Enter Email Address"
            value={formData?.office_email_primary ?? ""}
          />
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Country
          </h1>
          <Select
            required
            onValueChange={(value) => {
              updateField("country", value), fetchCountryCode(value);
            }}
            value={currentData?.country ?? ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {countryDropdown ? (
                  countryDropdown?.map((item) => (
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
        <div>
          <div className="grid grid-cols-4 gap-3">
            <div className="flex flex-col col-span-1">
              <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                Mobile No.
              </h1>
              <Input
                placeholder="+91"
                value={countryMobileCode ?? ""}
                disabled
              />
            </div>
            <div className="col-span-3 flex flex-col justify-end">
              {/* <h1 className="text-[12px] font-normal text-[#626973] pb-3">Mobile No.</h1> */}
              <Input
                placeholder="Enter Mobile Number"
                name="mobile_number"
                required
                onChange={(e) => {
                  // updateField("mobile_number", e.target.value);
                  handlefieldChange(e);
                }}
                value={formData?.mobile_number ?? ""}
              />
            </div>
          </div>
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Search Terms
          </h1>
          <Input
            placeholder="Enter Search Terms"
            name="search_term"
            required
            onChange={(e) => {
              // updateField("search_term", e.target.value),
               handlefieldChange(e);
            }}
            value={formData?.search_term ?? ""}
          />
        </div>
      </div>
    </div>
  );
};

export default VendorRegistration1;

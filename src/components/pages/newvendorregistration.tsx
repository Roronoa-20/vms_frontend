"use client";

import React, { useState, useEffect } from "react";
import VendorRegistration2 from "../templates/vendorRegistration/VendorRegistrationForm2";
import { TvendorRegistrationDropdown } from "@/src/types/types";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import { useRouter } from "next/navigation";
import MultiSelect, { MultiValue } from "react-select";

interface Props {
  vendorTypeDropdown: TvendorRegistrationDropdown["message"]["data"]["vendor_type"];
  companyDropdown: TvendorRegistrationDropdown["message"]["data"]["company_master"];
  incoTermsDropdown: TvendorRegistrationDropdown["message"]["data"]["incoterm_master"];
  currencyDropdown: TvendorRegistrationDropdown["message"]["data"]["currency_master"];
  handleCancel?: () => void;
}

export interface NewVendorFormData {
  vendor_types: { vendor_type: string }[];
}

export type TtableData = {
  company_name: string;
  purchase_organization: string;
  account_group: string;
  purchase_group: string;
  terms_of_payment: string;
  order_currency: string;
  incoterms: string;
  reconciliation_account: string;
  vendor_types: { vendor_type: string }[];
  qms_required: string;
};

type OptionType = {
  value: string;
  label: string;
};

const NewVendorRegistration = ({ handleCancel, ...Props }: Props) => {
  const [formData, setFormData] = useState<Partial<NewVendorFormData>>({});
  const [multiVendor, setMultiVendor] = useState<string[]>([]);
  const [tableData, setTableData] = useState<TtableData[]>([]);
  const [vendorTypeOptions, setVendorTypeOptions] = useState<OptionType[]>([]);

  const router = useRouter();

  // Prepare vendor type dropdown
  useEffect(() => {
    if (Props?.vendorTypeDropdown) {
      const mapped = Props.vendorTypeDropdown.map((item) => ({
        label: item?.name,
        value: item?.name,
      }));
      setVendorTypeOptions(mapped);
    }
  }, [Props?.vendorTypeDropdown]);

  const handleSelectChange = (value: any, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value } as NewVendorFormData));
  };

  // Vendor type change logic
  const handleVendorTypeChange = async (value: MultiValue<OptionType>) => {
    const newArray = value.map((item) => item.value);
    const newArray2 = value.map((item) => ({ vendor_type: item.value }));

    handleSelectChange(newArray2, "vendor_types");
    setMultiVendor(newArray);
  };

  // --- Submit logic: only checks vendor type + table data ---
  const handleSubmit = async () => {
    if (!formData?.vendor_types || formData?.vendor_types?.length === 0) {
      alert("Please Select Vendor Type");
      return;
    }

    if (tableData?.length == 0) {
      alert("Please Add at least 1 Row");
      return;
    }

    const submitButton = document.getElementById("submitButton") as HTMLButtonElement | null;
    if (submitButton) {
      submitButton.disabled = true;
    }

    const url = API_END_POINTS?.vendorRegistrationSubmit;
    let updateFormData;

    if (tableData?.length > 1) {
      updateFormData = {
        ...formData,
        purchase_details: tableData,
        for_multiple_company: 1,
      };
    } else {
      updateFormData = {
        ...formData,
        company_name: tableData?.[0]?.company_name,
        purchase_organization: tableData?.[0]?.purchase_organization,
        account_group: tableData?.[0]?.account_group,
        terms_of_payment: tableData?.[0]?.terms_of_payment,
        purchase_group: tableData?.[0]?.purchase_group,
        order_currency: tableData?.[0]?.order_currency,
        reconciliation_account: tableData?.[0]?.reconciliation_account,
        incoterms: tableData?.[0]?.incoterms,
        qms_required: tableData?.[0]?.qms_required,
        for_multiple_company: 0,
      };
    }

    const response: AxiosResponse = await requestWrapper({
      url: url,
      method: "POST",
      data: { data: updateFormData },
    });

    if (response?.status == 500) {
      console.log("error in submitting this form");
      return;
    }

    if (response?.status == 200) {
      if (response?.data?.message?.status == "duplicate") {
        alert(response?.data?.message?.message);
        if (submitButton) {
          submitButton.disabled = false;
        }
        return;
      }
      alert("Submit Successfully");
      router.push("/dashboard");
    } else {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  };

  const onCancel = () => {
    if (handleCancel) {
      handleCancel();
    }
  };

  return (
    <div className="p-3">
      {/* Vendor Type Section */}
      <div className="mb-4">
        <h1 className="text-[18px] font-semibold pb-1 leading-[24px] text-[#03111F] border-b border-slate-500">
          Vendor Type
        </h1>
        <div className="grid grid-cols-3 gap-6 p-2">
          <div className="flex flex-col">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">Vendor Type</h1>
            <MultiSelect
              onChange={(value) => handleVendorTypeChange(value)}
              instanceId="multiselect-vendor"
              options={vendorTypeOptions}
              isMulti
              required={true}
            />
          </div>
        </div>
      </div>

      {/* Purchase Details Section */}
      <VendorRegistration2
        companyDropdown={Props.companyDropdown}
        incoTermsDropdown={Props.incoTermsDropdown}
        currencyDropdown={Props.currencyDropdown}
        formData={{
          ...formData,
          vendor_types: formData.vendor_types?.map((item) => item.vendor_type),
        }}
        handlefieldChange={() => {}}
        handleSelectChange={handleSelectChange}
        tableData={tableData}
        setTableData={setTableData}
        handleSubmit={handleSubmit}
        handleCancel={onCancel}
        multiVendor={multiVendor}
      />
    </div>
  );
};

export default NewVendorRegistration;

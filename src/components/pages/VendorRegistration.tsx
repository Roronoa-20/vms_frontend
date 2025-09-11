"use client"
import React, { useState } from "react";
import VendorRegistration1 from "../templates/vendorRegistration/VendorRegistrationForm1";
import VendorRegistration2 from "../templates/vendorRegistration/VendorRegistrationForm2";
import { TvendorRegistrationDropdown, VendorRegistrationData } from "@/src/types/types";
import { handleSubmit } from "../templates/vendorRegistration/utility";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import { useVendorStore } from "@/src/store/VendorRegistrationStore";
import { useRouter } from "next/navigation";

interface Props {
  vendorTitleDropdown: TvendorRegistrationDropdown["message"]["data"]["vendor_title"]
  vendorTypeDropdown: TvendorRegistrationDropdown["message"]["data"]["vendor_type"]
  countryDropdown: TvendorRegistrationDropdown["message"]["data"]["country_master"]
  companyDropdown: TvendorRegistrationDropdown["message"]["data"]["company_master"]
  incoTermsDropdown: TvendorRegistrationDropdown["message"]["data"]["incoterm_master"]
  currencyDropdown: TvendorRegistrationDropdown["message"]["data"]["currency_master"]
}

export type TtableData = {
  company_name: string,
  purchase_organization: string,
  account_group: string,
  purchase_group: string,
  terms_of_payment: string,
  order_currency: string,
  incoterms: string,
  reconciliation_account: string
  vendor_types: { vendor_type: string }[]
  qms_required: string
}

const VendorRegistration = ({ ...Props }: Props) => {

  const [formData, setFormData] = useState<Partial<VendorRegistrationData>>({})
  const [multiVendor, setMultiVendor] = useState();
  const [tableData, setTableData] = useState<TtableData[]>([]);
  const handlefieldChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value } as VendorRegistrationData));
  };
  const handleSelectChange = (value: any, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value } as VendorRegistrationData));
  };


  const vendorTitleDropdown = Props?.vendorTitleDropdown;
  const vendorTypeDropdown = Props?.vendorTypeDropdown;
  const countryDropdown = Props?.countryDropdown;
  const companyDropdown = Props?.companyDropdown;
  const incoTermsDropdown = Props?.incoTermsDropdown;
  const currencyDropdown = Props?.currencyDropdown;
  const router = useRouter();

  const handleSubmit = async () => {

    if (formData?.vendor_type && formData?.vendor_type?.length < 0) {
      alert("Please Select Vendor Type");
      return;
    }

    // if (!formData?.vendor_type || formData?.vendor_type?.length === 0) {
    //   alert("Please Select Vendor Type");
    //   return;
    // }

    if (!formData?.vendor_name) {
      alert("please Enter Vendor Name");
      return;
    }

    if (!formData?.office_email_primary) {
      alert("please Enter Vendor Email");
      return;
    }

    if (!formData?.office_email_primary.includes("@")) {
      alert("Please enter a valid email address with '@'");
      return;
    }

    if (!formData?.country) {
      alert("please Select Vendor Country");
      return;
    }

    if (!formData?.search_term) {
      alert("please Enter Search Terms");
      return;
    }

    if (tableData?.length == 0) {
      alert("Please Add atleast 1 Row");
      return;
    }

    const submitButton = document.getElementById("submitButton") as HTMLButtonElement | null;
    if (submitButton) {
      console.log("inside button")
      submitButton.disabled = true;
    }
    const url = API_END_POINTS?.vendorRegistrationSubmit;
    let updateFormData;
    if (tableData?.length > 1) {
      updateFormData = {
        ...formData,
        purchase_details: tableData,
        // reconciliation_account:tableData?.[0]?.reconciliation_account,
        // incoterms:tableData?.[0]?.incoterms,
        for_multiple_company: 1
      }
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
        for_multiple_company: 0
      }
    }
    const response: AxiosResponse = await requestWrapper({
      url: url,
      method: "POST",
      data: { data: updateFormData }
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
      console.log("handle submit successfully");
      alert("Submit Successfully");
      router.push("/dashboard");
      return;
    } else {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  };

  const handleCancel = async () => {
    router.push("/dashboard");
  };



  return (
    <div className="p-3">
      {/* <form onSubmit={(e)=>{handleSubmit(e)}}> */}
      <VendorRegistration1
        vendorTitleDropdown={vendorTitleDropdown}
        vendorTypeDropdown={vendorTypeDropdown}
        countryDropdown={countryDropdown}
        formData={formData}
        handlefieldChange={handlefieldChange}
        handleSelectChange={handleSelectChange}
        setMultiVendor={setMultiVendor}
      />
      <VendorRegistration2
        companyDropdown={companyDropdown}
        incoTermsDropdown={incoTermsDropdown}
        currencyDropdown={currencyDropdown}
        formData={formData}
        handlefieldChange={handlefieldChange}
        handleSelectChange={handleSelectChange}
        tableData={tableData}
        setTableData={setTableData}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        multiVendor={multiVendor}
      />
      {/* </form> */}
    </div>
  );
};

export default VendorRegistration;

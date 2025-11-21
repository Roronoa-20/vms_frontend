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
import { ToastContainer, toast } from 'react-toastify';
import PopUp from "../molecules/PopUp";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../atoms/table";

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

type gstDetailsType = {
  gst_state:string,
  gst_number:string,
  pincode:string,
  company:string
}

type vendorNameDialogDataType = {
  name:string,
  vendor_name:string,
  office_email_primary:string,
  country:string,
  first_name:string,
  mobile_number:string,
  search_term:string,
  pan_number:string,
  gst_details:gstDetailsType[]
}

const VendorRegistration = ({ ...Props }: Props) => {

  const [formData, setFormData] = useState<Partial<VendorRegistrationData>>({})
  const [multiVendor, setMultiVendor] = useState();
  const [tableData, setTableData] = useState<TtableData[]>([]);
  const [vendorNameDialog,setVendorNameDialog] = useState<boolean>(false);
  const [vendorNameDialogData,setVendorNameDialogData] = useState<vendorNameDialogDataType[]>([]);
  
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

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
      // console.log("error in submitting this form");
      toast?.error("Error submitting this form");
      return;
    }

    if (response?.status == 200) {
      if (response?.data?.message?.status == "duplicate") {
        toast.warn(response?.data?.message?.message);
        if (submitButton) {
          submitButton.disabled = false;
        }
        return;
      }
      toast.success("Vendor Registered Successfully.....");
      setTimeout(()=>{
        router.push("/dashboard");
      },2000)
      return;
    } else {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
    // toast.success("Vendor Registered Successfully.....");
    
  };

  const handleCancel = async () => {
    router.push("/dashboard");
  };

  const VendorNameCheckApi = async(value:string)=>{

    if(value.length < 3){
      return;
    }
    
    try {

      const response:AxiosResponse = await requestWrapper({url:API_END_POINTS?.VendorNameCheckApi,params:{vendor_name:value},method:"GET"});
      
      if(response?.status == 404){
        return;
      }
      
      if(response?.status == 200){
        setVendorNameDialogData(response?.data?.message?.data);
        setVendorNameDialog(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

    const handleClose = ()=>{
      setVendorNameDialog(false);
    }


  const toggleRow = (index: number) => {
    setExpandedRows((s) => ({ ...s, [index]: !s[index] }));
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
        VendorNameCheckApi={VendorNameCheckApi}
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
      <ToastContainer closeButton theme="dark" autoClose={2000} />
      {
        vendorNameDialog && 
  <PopUp handleClose={handleClose} classname="overflow-y-scroll md:max-w-[1000px] w-full">
   <div className="overflow-auto">
      <table className="min-w-full">
        <thead className="border-b">
          <tr>
            <th className="text-left p-3">Name</th>
            <th className="text-left p-3">Vendor Name</th>
            <th className="text-left p-3">Email</th>
            <th className="text-left p-3">Mobile</th>
            <th className="text-left p-3">Pan Number</th>
            <th className="text-left p-3">GST Details</th>
          </tr>
        </thead>

        <tbody>
          {vendorNameDialogData.map((item, i) => {
            const isOpen = !!expandedRows[i];
            return (
              <React.Fragment key={i}>
                {/* MAIN ROW */}
                <tr className="align-top border-b">
                  <td className="p-3 align-top">{item.name}</td>
                  <td className="p-3 align-top">{item.vendor_name}</td>
                  <td className="p-3 align-top">{item.office_email_primary}</td>
                  <td className="p-3 align-top">{item.mobile_number}</td>
                  <td className="p-3 align-top">{item.pan_number}</td>

                  <td className="p-3 align-top">
                    <button
                      onClick={() => toggleRow(i)}
                      aria-expanded={isOpen}
                      aria-controls={`gst-row-${i}`}
                      className="text-sm inline-flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100"
                    >
                      {item.gst_details.length > 0 ? "View GST Details" : "No GST Records"}
                      <svg
                        className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.1 1.02l-4.25 4.657a.75.75 0 01-1.1 0L5.21 8.27a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>

                {/* EXPANDED ROW (separate <tr>, valid HTML) */}
                <tr id={`gst-row-${i}`} className="bg-white">
                  <td colSpan={5} className="p-0">
                    {/* content wrapper inside the td — safe to animate */}
                    <div
                      // animate using max-height + opacity. Keep overflow hidden.
                      className={`overflow-hidden transition-[max-height,opacity] duration-300 px-3 ${
                        isOpen ? "max-h-[1000px] opacity-100 py-3" : "max-h-0 opacity-0 py-0"
                      }`}
                    >
                      {item.gst_details.length > 0 ? (
                        <table className="min-w-full border">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="text-left p-2">GST State</th>
                              <th className="text-left p-2">GST Number</th>
                              <th className="text-left p-2">Pincode</th>
                              <th className="text-left p-2">Company</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.gst_details.map((gst, gi) => (
                              <tr key={gi} className="border-t">
                                <td className="p-2">{gst.gst_state}</td>
                                <td className="p-2">{gst.gst_number}</td>
                                <td className="p-2">{gst.pincode ?? "—"}</td>
                                <td className="p-2">{gst.company ?? "—"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p className="text-sm text-muted-foreground">No GST details available.</p>
                      )}
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
</PopUp>
      }
    </div>
  );
};

export default VendorRegistration;

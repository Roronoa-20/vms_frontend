"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import { Pencil, CheckCircle2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "../atoms/input";
import RFQDropdown from "../common/RFQSrNoDropdown";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

type Field = {
  label: string;
  name?: string;
  type: "text" | "date" | "select" | "text-date" | "textarea" | "info";
  placeholder?: string;
  rows?: number;
  fullWidth?: boolean;
};

export default function ServiceBill() {
  const searchParams = useSearchParams();
  const servicename = searchParams.get("name");
  const router = useRouter();

  const [formData, setFormData] = useState<any>({});
  const [isEditMode, setIsEditMode] = useState<boolean>(!!servicename);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [rfqOptions, setRfqOptions] = useState<any[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [statusMessage, setStatusMessage] = useState<null | "success" | "updated">(null);
  const [updatedStatus, setUpdatedStatus] = useState<string>("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    return () => document.removeEventListener("click", handleClickOutside, true);
  }, []);

  const secondRow: Field[] = [
    { label: "RFQ Number & Date", name: "rfq_number", type: "text-date" },
    { label: "Meril Job & Date", name: "meril_job", type: "text-date" },
  ];

  const remainingFields: Field[] = [
    { label: "Bill Number", name: "bill_number", type: "text" },
    { label: "Bill Date", name: "bill_date", type: "date" },
    { label: "RFQ Amount", name: "rfq_amount", type: "text" },
    { label: "Bill Amount", name: "bill_amount", type: "text" },
    { label: "RFQ Weight", name: "rfq_weight", type: "text" },
    { label: "Actual Weight", name: "actual_weight", type: "text" },
    { label: "Bill Received On", name: "bill_received_on", type: "date" },
    { label: "Bill Sent to Accounts on", name: "bill_sent_on", type: "date" },
    { label: "Bill Booking Ref No", name: "bill_booking_ref_no", type: "text" },
    { label: "Bill Booking Date", name: "bill_booking_date", type: "date" },
    { label: "UTR Number", name: "utr_number", type: "text" },
    { label: "UTR Date", name: "utr_date", type: "date" },
    { label: "Amount Paid", name: "amount_paid", type: "text" },
    {
      label:
        "The consolidated amount against clearing document # is. This is for information purpose only!",
      name: "info",
      type: "info",
    },
    { label: "HAWB NO", name: "hawb_no", type: "text" },
    { label: "Status", name: "service_bill_status", type: "select" },
  ];

  const remarkField: Field[] = [
    {
      label: "Service Provider Remark",
      name: "service_provider_remark",
      type: "textarea",
      fullWidth: true,
    },
    {
      label: "EXIM Team Remark",
      name: "exim_team_remark",
      type: "textarea",
      fullWidth: true,
      rows: 3,
      placeholder: "Enter remarks here...",
    },
  ];

  const clearAutoPopulateFields = () => {
    setFormData((prev: any) => ({
      ...prev,
      // RFQ identifiers
      rfq_number: "", // backend name — unset if user types/clears
      rfq_number_display: "",
      enter_rfq_no: "",
      rfq_number_date: "",
      // auto fields that come from RFQ fetch
      jrn: "",
      jrn_date: "",
      consignee_name: "",
      consignor_name: "",
      port_of_loading: "",
      port_of_discharge: "",
      incoterms: "",
      shipment_mode: "",
      number_of_packs: "",
      packs_units: "",
      actual_weight: "",
      chargeable_weight: "",
      remarks: "",
    }));
  };

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  // If fetching an existing service bill (edit mode), normalize RFQ display fields:
  useEffect(() => {
    const fetchservicebill = async () => {
      if (!servicename) return;
      try {
        const res: AxiosResponse<any> = await requestWrapper({
          url: API_END_POINTS.servicebilldetails,
          method: "GET",
          params: { name: servicename },
        });
        const data = res.data.message.data || {};
        setFormData(data);

        // Keep enter_document_no as earlier
        if (data.sr_no) {
          setFormData((prev: any) => ({ ...prev, enter_document_no: data.sr_no }));
        }

        // If backend returned rfq_number (backend name) but not a display sr, fetch sr_no for UI
        if (data.rfq_number && !data.rfq_number_display) {
          try {
            const rfqRes: AxiosResponse<any> = await requestWrapper({
              url: API_END_POINTS.getRFQdata,
              method: "GET",
              params: { name: data.rfq_number },
            });
            const rfqData = rfqRes.data.message || {};
            setFormData((prev: any) => ({
              ...prev,
              rfq_number_display: rfqData.sr_no || rfqData.srno || "",
              // keep rfq_number as backend name
              rfq_number_date: rfqData.rfq_date_logistic || prev.rfq_number_date || "",
              enter_rfq_no: rfqData.sr_no || rfqData.srno || prev.enter_rfq_no || "",
              // populate other fields if needed
              jrn: rfqData.jrn_number || prev.jrn || "",
              jrn_date: rfqData.jrn_date || prev.jrn_date || "",
            }));
          } catch (err) {
            // ignore — UI can still show backend name if display not found
            console.error("Error fetching RFQ sr_no for edit mode", err);
          }
        }

        setIsEditable(false);
      } catch (err) {
        console.error("Error fetching shipment details", err);
      }
    };
    fetchservicebill();
  }, [servicename]);

  useEffect(() => {
    if (!isEditMode) {
      const fetchRFQSrNos = async () => {
        try {
          const res: AxiosResponse<any> = await requestWrapper({
            url: API_END_POINTS.allRFQSrNo,
            method: "GET",
          });
          setRfqOptions(res.data.message || []);
        } catch (err) {
          console.error("Error fetching RFQ Sr.No list", err);
        }
      };
      fetchRFQSrNos();
    }
  }, [isEditMode]);

  // When user types or clears the Enter RFQ No input (top field)
  const handleEnterRFQChange = (val: string) => {
    if (!val) {
      // user cleared input => clear auto-populated fields
      clearAutoPopulateFields();
      return;
    }

    // user typed something — keep the typed value in enter_rfq_no and display,
    // but unset rfq_number (backend id) until they select from dropdown
    setFormData((prev: any) => ({
      ...prev,
      enter_rfq_no: val,
      rfq_number_display: val,
      rfq_number: "", // unset backend id
    }));
  };

  // When user selects from the RFQ dropdown we get (name, srNo)
  const handleRFQSelect = async (name: string, srNo: string) => {
    if (!name) return;

    // set both backend name and display sr no, and set enter_rfq_no (input) to srNo
    setFormData((prev: any) => ({
      ...prev,
      rfq_number: name, // backend id (what we will submit)
      rfq_number_display: srNo, // what we show to user
      enter_rfq_no: srNo,
    }));

    try {
      const res: AxiosResponse<any> = await requestWrapper({
        url: API_END_POINTS.getRFQdata,
        method: "GET",
        params: { name },
      });

      const rfqData = res.data.message || {};

      // update only the auto-populated fields, DO NOT overwrite rfq_number (backend id)
      setFormData((prev: any) => ({
        ...prev,
        rfq_number_date: rfqData.rfq_date_logistic || prev.rfq_number_date || "",
        jrn: rfqData.jrn_number || prev.jrn || "",
        jrn_date: rfqData.jrn_date || prev.jrn_date || "",
        actual_weight: rfqData.actual_weight || prev.actual_weight || "",
        consignee_name: rfqData.consignee_name || prev.consignee_name || "",
        consignor_name: rfqData.consignor_name || prev.consignor_name || "",
        port_of_loading: rfqData.port_of_loading || prev.port_of_loading || "",
        port_of_discharge: rfqData.port_of_discharge || rfqData.destination_port || prev.port_of_discharge || "",
        incoterms: rfqData.inco_terms || rfqData.incoterms || prev.incoterms || "",
        shipment_mode: rfqData.mode_of_shipment || rfqData.shipment_mode || prev.shipment_mode || "",
        number_of_packs: rfqData.no_of_pkg_units || rfqData.number_of_packs || prev.number_of_packs || "",
        packs_units: rfqData.packs_unit || prev.packs_units || "",
        chargeable_weight: rfqData.chargeable_weight || prev.chargeable_weight || "",
        remarks: rfqData.remarks || prev.remarks || "",
      }));
    } catch (err) {
      console.error("Error fetching RFQ data", err);
    }
  };

  const handleBack = () => {
    router.push("/service-bill-dashboard");
  };

  const handleSubmit = async () => {
    try {
      let res;
      if (isEditMode) {
        res = await requestWrapper({
          url: API_END_POINTS.createnewservicebill,
          method: "PUT",
          data: { data: JSON.stringify(formData) },
        });

        const ServiceBillNo = res?.data?.message;
        if (ServiceBillNo?.action === "Updated") {
          setUpdatedStatus(ServiceBillNo.shipment_status || "");
          setStatusMessage("updated");
        } else {
          console.error("Shipment not updated successfully", ServiceBillNo?.message);
        }
      } else {
        res = await requestWrapper({
          url: API_END_POINTS.createnewservicebill,
          method: "POST",
          data: { data: JSON.stringify(formData) },
        });

        const ServiceBillNo = res?.data?.message;
        if (ServiceBillNo?.message === "Success") {
          setStatusMessage("success");
        } else {
          console.error("Shipment not saved successfully", ServiceBillNo?.message);
        }
      }
    } catch (err) {
      console.error("Error saving shipment", err);
    }
  };

  const renderField = (field: Field, index: number) => {
    // For rfq_number field prefer to show the display (sr_no) value.
    const isDisabled = isEditMode && !isEditable;

    const valueForField =
      field.name === "rfq_number"
        ? formData.rfq_number_display || formData.enter_rfq_no || formData.rfq_number || ""
        : formData[field.name || ""] || "";

    const options =
      field.name === "service_bill_status"
        ? ["Bill Pending", "Submission Pending", "Bill not submitted", "Submitted"]
        : [];

    return (
      <div
        key={index}
        className={`flex flex-col ${field.fullWidth ? "col-span-1 md:col-span-3" : ""}`}
      >
        {field.type !== "info" && (
          <Label className="text-sm font-medium text-gray-700 mb-1">{field.label}</Label>
        )}

        {field.type === "text" && (
          <Input
            type="text"
            value={valueForField}
            disabled={isDisabled}
            onChange={(e) => {
              const v = e.target.value;
              // if editing rfq_number text directly, treat it like editing enter_rfq_no:
              if (field.name === "rfq_number") {
                // user changed the display value manually, so unset backend id and clear auto fields
                setFormData((prev: any) => ({
                  ...prev,
                  enter_rfq_no: v,
                  rfq_number_display: v,
                  rfq_number: "",
                }));
                // clear auto-populated fields so data doesn't misrepresent
                setTimeout(() => clearAutoPopulateFields(), 0);
              } else {
                handleChange(field.name!, v);
              }
            }}
            placeholder={field.placeholder || ""}
            className="border border-gray-300 rounded-md px-3 py-2 bg-gray-100 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        )}

        {field.type === "date" && (
          <Input
            type="date"
            value={valueForField}
            disabled={isDisabled}
            onChange={(e) => handleChange(field.name!, e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 bg-gray-100 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        )}

        {field.type === "text-date" && (
          <div className="flex gap-2">
            <Input
              type="text"
              value={valueForField}
              disabled={isDisabled}
              onChange={(e) => {
                const v = e.target.value;
                if (field.name === "rfq_number") {
                  // typing into second-row rfq input behaves same as typing top input
                  setFormData((prev: any) => ({
                    ...prev,
                    enter_rfq_no: v,
                    rfq_number_display: v,
                    rfq_number: "",
                  }));
                  setTimeout(() => clearAutoPopulateFields(), 0);
                } else {
                  handleChange(field.name!, v);
                }
              }}
              placeholder={field.placeholder || ""}
              className="w-1/2 border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
            />
            <Input
              type="date"
              value={formData[field.name! + "_date"] || ""}
              disabled={isDisabled}
              onChange={(e) => handleChange(field.name! + "_date", e.target.value)}
              className="w-1/2 border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
            />
          </div>
        )}

        {field.type === "textarea" && (
          <textarea
            rows={field.rows || 3}
            value={valueForField}
            disabled={isDisabled}
            onChange={(e) => handleChange(field.name!, e.target.value)}
            placeholder={field.placeholder || ""}
            className="border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
          />
        )}

        {field.type === "select" && (
          <Select
            value={valueForField}
            onValueChange={(val) => handleChange(field.name!, val)}
            disabled={isDisabled}
          >
            <SelectTrigger className="border border-gray-300 rounded-md px-3 py-2 bg-gray-100">
              <SelectValue placeholder={field.placeholder || "Select"} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {field.type === "info" && <p className="text-red-600 font-medium">{field.label}</p>}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-2 w-full bg-gray-100">
      <div className="bg-white p-4 rounded shadow">
        <div className="space-y-2">
          <div className="flex items-end justify-between mb-4 gap-4 border-b pb-3">
            <div className="flex-1">
              <Label>Enter RFQ No</Label>
              {isEditMode ? (
                <Input
                  type="text"
                  value={formData.enter_document_no || ""}
                  readOnly
                  className="border border-gray-300 rounded-md px-3 py-2 w-[27%]"
                />
              ) : (
                <div className="flex-1 relative" ref={dropdownRef}>
                  <RFQDropdown
                    // controlled by enter_rfq_no (editable) — if not set, show rfq_number_display
                    value={formData.enter_rfq_no ?? formData.rfq_number_display ?? ""}
                    onChange={(val: string) => handleEnterRFQChange(val)}
                    options={rfqOptions}
                    onSelect={(rfq: { name: string; sr_no: string }) =>
                      handleRFQSelect(rfq.name, rfq.sr_no)
                    }
                    autoClearFields={() => {
                      clearAutoPopulateFields();
                    }}
                  />
                </div>
              )}
            </div>

            {isEditMode && !isEditable && (
              <Button
                variant="nextbtn"
                size="nextbtnsize"
                onClick={() => setIsEditable(true)}
                className="py-2 items-center self-end"
              >
                <Pencil className="w-4 h-4 mr-1" /> Edit
              </Button>
            )}
          </div>

          {/* RFQ and JRN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{secondRow.map(renderField)}</div>

          {/* Remaining fields in 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {remainingFields.map(renderField)}
            {remarkField.map(renderField)}
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex space-x-3 justify-end">
            <Button className="py-2.5" onClick={handleBack} variant={"backbtn"} size={"backbtnsize"}>
              Back
            </Button>
            <Button
              className="py-2.5"
              variant={"nextbtn"}
              size={"nextbtnsize"}
              onClick={handleSubmit}
              disabled={!formData.enter_document_no || (isEditMode && !isEditable)}
            >
              {isEditMode ? "Update" : "Submit"}
            </Button>
          </div>
        </div>

        {statusMessage && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
            <Card className="relative max-w-md w-full bg-gray-100 rounded-2xl shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                {statusMessage === "success" ? (
                  <>
                    <h2 className="text-2xl font-bold mb-2 text-black">
                      Service Bill Submitted Successfully!!!
                    </h2>
                    <p className="text-gray-600 mb-6">Thank you for submitting the service bill details.</p>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-2 text-black">
                      Service Bill <span className="text-blue-600">{updatedStatus}</span> updated Successfully!!!
                    </h2>
                    <p className="text-gray-600 mb-6">Your service bill has been successfully updated.</p>
                  </>
                )}
                <Button
                  className="mt-2"
                  variant="nextbtn"
                  size="nextbtnsize"
                  onClick={() => {
                    setStatusMessage(null);
                    router.push("/service-bill-dashboard");
                  }}
                >
                  OK
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
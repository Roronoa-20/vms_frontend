"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import { Pencil } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "../atoms/input";
import RFQDropdown from "../common/RFQSrNoDropdown";

type Field = {
  label: string;
  name: string;
  type: "text" | "date" | "select" | "text-date" | "textarea";
  placeholder?: string;
  rows?: number;
};

export default function ShipmentStatus() {
  const searchParams = useSearchParams();
  const shipmentName = searchParams.get("name");

  const [formData, setFormData] = useState<any>({});
  const [isEditMode, setIsEditMode] = useState<boolean>(!!shipmentName);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [rfqOptions, setRfqOptions] = useState<any[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    { label: "RFQ Number & Date", name: "rfq_number", type: "text-date", placeholder: "RFQ Number" },
    { label: "JRN & Date", name: "jrn", type: "text-date", placeholder: "JRN Number" },
  ];

  const thirdRow: Field[] = [
    { label: "Consignee Name (RFQ)", name: "consignee_name", type: "text" },
    { label: "Consignor Name (JRN)", name: "consignor_name", type: "text" },
  ];

  const remainingFields: Field[] = [
    { label: "Port Of Loading", name: "port_of_loading", type: "text" },
    { label: "Port Of Discharge", name: "port_of_discharge", type: "text" },
    { label: "IncoTerms", name: "incoterms", type: "text" },
    { label: "Shipment Mode", name: "shipment_mode", type: "select", placeholder: "Search By" },
    { label: "House Bill #", name: "house_bill", type: "text" },
    { label: "Master Bill #", name: "master_bill", type: "text", placeholder: "Master Airway Bill Number" },
    { label: "House Bill Date", name: "house_bill_date", type: "date" },
    { label: "MAWB Date", name: "mawb_date", type: "date" },
    { label: "Estimated Arrival", name: "estimated_arrival", type: "date" },
    { label: "Estimated Departure", name: "estimated_departure", type: "date" },
    { label: "Actual Dep at Origin", name: "actual_departure_at_origin", type: "date" },
    { label: "Booking Date", name: "booking_date", type: "date" },
    { label: "Estimated Pickup", name: "estimated_pickup", type: "date" },
    { label: "Actual Pickup", name: "actual_pickup", type: "date" },
    { label: "Number of Packs", name: "number_of_packs", type: "text" },
    { label: "Packs Unit", name: "packs_units", type: "text" },
    { label: "Actual Weight", name: "actual_weight", type: "text", placeholder: "Actual Weight/Gross Weight" },
    { label: "Chargeable Weight", name: "chargeable_weight", type: "text", placeholder: "Actual Chargeable Weight" },
    { label: "Carrier Name", name: "carrier_name", type: "text" },
    { label: "CHA Name", name: "cha_name", type: "text" },
    { label: "Shipment Status", name: "shipment_status", type: "select", placeholder: "Search By" },
    { label: "Actual Volume", name: "actual_volume", type: "text" },
    { label: "Month/Year", name: "month_year", type: "text" },
  ];

  const remarkField: Field[] = [
    { label: "Remark", name: "remarks", type: "textarea", rows: 3, placeholder: "Enter remarks here..." },
  ];

  useEffect(() => {
    const fetchShipment = async () => {
      if (!shipmentName) return;
      try {
        const res: AxiosResponse<any> = await requestWrapper({
          url: API_END_POINTS.shipmentdetails,
          method: "GET",
          params: { name: shipmentName },
        });
        const data = res.data.message.data || {};
        setFormData(data);

        if (data.sr_no) {
          setFormData((prev: any) => ({ ...prev, enter_document_no: data.sr_no }));
        }

        setIsEditable(false);
      } catch (err) {
        console.error("Error fetching shipment details", err);
      }
    };
    fetchShipment();
  }, [shipmentName]);

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

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleRFQSelect = async (name: string, srNo: string) => {
    if (!name) return;

    handleChange("enter_document_no", "By RFQ No");

    handleChange("enter_rfq_no", name);
    handleChange("rfq_number", srNo);

    try {
      const res: AxiosResponse<any> = await requestWrapper({
        url: API_END_POINTS.getRFQdata,
        method: "GET",
        params: { name },
      });

      const rfqData = res.data.message || {};

      setFormData((prev: any) => ({
        ...prev,
        rfq_number: rfqData.sr_no || "",
        rfq_number_date: rfqData.rfq_date_logistic || "",
        jrn: rfqData.jrn_number || "",
        jrn_date: rfqData.jrn_date || "",
        consignee_name:
          rfqData.consignee_name || rfqData.consignee_name_rfq || "",
        consignor_name:
          rfqData.consignor_name || rfqData.consignee_name_jrn || "",
        port_of_loading: rfqData.port_of_loading || "",
        port_of_discharge:
          rfqData.port_of_discharge || rfqData.destination_port || "",
        incoterms: rfqData.inco_terms || rfqData.incoterms || "",
        shipment_mode: rfqData.mode_of_shipment || rfqData.shipment_mode || "",
        number_of_packs:
          rfqData.no_of_pkg_units || rfqData.number_of_packs || "",
        packs_units: rfqData.packs_unit || "",
        actual_weight: rfqData.actual_weight || "",
        chargeable_weight: rfqData.chargeable_weight || "",
        remarks: rfqData.remarks || "",
      }));
    } catch (err) {
      console.error("Error fetching RFQ data", err);
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        await requestWrapper({
          url: API_END_POINTS.createnewshipmentstatus,
          method: "PATCH",
          data: formData,
        });
        alert("Shipment updated successfully");
      } else {
        await requestWrapper({
          url: API_END_POINTS.createnewshipmentstatus,
          method: "POST",
          data: { data: JSON.stringify(formData) },
        });
        alert("New shipment created successfully");
      }
    } catch (err) {
      console.error("Error saving shipment", err);
    }
  };

  const renderField = (field: Field, index: number) => {
    const value = formData[field.name] || "";

    const isDisabled = isEditMode && !isEditable;

    if (field.type === "text") {
      return (
        <div key={index} className={`flex flex-col ${field.label === "Remark" ? "col-span-1 md:col-span-3" : ""}`}>
          <Label className="text-[14px] font-normal text-black pb-2">{field.label}</Label>
          <Input
            type="text"
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder || ""}
            className="border border-gray-300 rounded-md px-3 py-2"
            disabled={isDisabled}
          />
        </div>
      );
    }

    if (field.type === "date") {
      return (
        <div key={index} className="flex flex-col">
          <Label className="text-[14px] font-normal text-black pb-2">{field.label}</Label>
          <Input
            type="date"
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
            disabled={isDisabled}
          />
        </div>
      );
    }

    if (field.type === "select") {
      return (
        <div key={index} className="flex flex-col">
          <Label className="text-[14px] font-normal text-black pb-2">{field.label}</Label>
          <select
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
            disabled={isDisabled}
          >
            <option value="">{field.placeholder || "Select"}</option>
            {field.name === "shipment_mode" &&
              ["Air", "Ocean"].map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
          </select>
        </div>
      );
    }

    if (field.type === "text-date") {
      return (
        <div key={index} className="flex flex-col">
          <Label className="text-[14px] font-normal text-black pb-2">{field.label}</Label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder || ""}
              className="w-1/2 border border-gray-300 rounded-md px-3 py-2"
              disabled={isDisabled}
            />
            <Input
              type="date"
              value={formData[field.name + "_date"] || ""}
              onChange={(e) => handleChange(field.name + "_date", e.target.value)}
              className="w-1/2 border border-gray-300 rounded-md px-3 py-2"
              disabled={isDisabled}
            />
          </div>
        </div>
      );
    }

    if (field.type === "textarea") {
      return (
        <div key={index} className="flex flex-col">
          <Label className="text-[14px] font-normal text-black pb-2">{field.label}</Label>
          <textarea
            rows={field.rows || 3}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder || ""}
            className="border border-gray-300 rounded-md px-3 py-2"
            disabled={isDisabled}
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="container mx-auto p-2 w-full bg-gray-100">
      <div className="bg-white p-4 rounded shadow space-y-2">
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
                  value={formData.enter_rfq_no || ""}
                  onChange={(val: string) => handleChange("enter_rfq_no", val)}
                  options={rfqOptions}
                  onSelect={(rfq: { name: string; sr_no: string }) => handleRFQSelect(rfq.name, rfq.sr_no)}
                  autoClearFields={() =>
                    setFormData((prev: Record<string, any>) => ({
                      ...prev,
                      rfq_number: "",
                      rfq_number_date: "",
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
                    }))
                  }
                />

                {dropdownOpen && filteredOptions.length > 0 && (
                  <ul className="absolute z-10 bg-white border border-gray-300 w-[27%] mt-1.5 max-h-48 overflow-y-auto rounded-md shadow-md">
                    {filteredOptions.map((rfq: { name: string; sr_no: string }, idx: number) => (
                      <li
                        key={rfq.name}
                        className={`px-3 py-2 cursor-pointer ${highlightedIndex === idx ? "bg-gray-200" : ""
                          }`}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        onClick={() => {
                          handleRFQSelect(rfq.name, rfq.sr_no);
                          setDropdownOpen(false);
                          setHighlightedIndex(-1);
                        }}
                      >
                        {rfq.sr_no}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Edit button */}
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


        {/* RFQ & JRN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{secondRow.map(renderField)}</div>

        {/* Consignee & Consignor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{thirdRow.map(renderField)}</div>

        {/* Remaining fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {remainingFields.map(renderField)}
        </div>

        <div className="grid grid-cols-1 gap-6">
          {remarkField.map(renderField)}
        </div>

        {/* Submit / Update Button */}
        <div className="mt-6 flex justify-end">
          <Button
            className="py-2.5"
            variant="nextbtn"
            size="nextbtnsize"
            onClick={handleSubmit}
            disabled={!formData.enter_document_no || (isEditMode && !isEditable)}
          >
            {isEditMode ? "Update" : "Submit"}
          </Button>
        </div>
      </div>
    </div >
  );
}
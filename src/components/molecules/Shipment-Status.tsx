"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import { Pencil } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "../atoms/input";

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
    { label: "Number of Packs", name: "number_of_packs", type: "text" },
    { label: "Packs Unit", name: "packs_units", type: "text" },
    { label: "Actual Weight", name: "actual_weight", type: "text" },
    { label: "Chargeable Weight", name: "chargeable_weight", type: "text" },
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

        setIsEditable(false); // fields disabled initially
      } catch (err) {
        console.error("Error fetching shipment details", err);
      }
    };
    fetchShipment();
  }, [shipmentName]);

  // 🔹 Fetch all RFQ Sr.No for dropdown (only for new shipment)
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

    handleChange("enter_document_no", srNo);
    handleChange("enter_document_no_name", name);

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
        consignee_name: rfqData.consignee_name || rfqData.consignee_name_rfq || "",
        consignor_name: rfqData.consignor_name || rfqData.consignee_name_jrn || "",
        port_of_loading: rfqData.port_of_loading || "",
        port_of_discharge: rfqData.port_of_discharge || rfqData.destination_port || "",
        incoterms: rfqData.inco_terms || rfqData.incoterms || "",
        shipment_mode: rfqData.mode_of_shipment || rfqData.shipment_mode || "",
        number_of_packs: rfqData.no_of_pkg_units || rfqData.number_of_packs || "",
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
          data: formData,
        });
        alert("New shipment created successfully");
      }
    } catch (err) {
      console.error("Error saving shipment", err);
    }
  };

  // 🔹 Render field helper with editable toggle
  const renderField = (field: Field, index: number) => {
    const value = formData[field.name] || "";

    const isDisabled = isEditMode && !isEditable;

    if (field.type === "text") {
      return (
        <div key={index} className={`flex flex-col ${field.label === "Remark" ? "col-span-1 md:col-span-3" : ""}`}>
          <Label className="text-gray-700 mb-1">{field.label}</Label>
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
          <Label>{field.label}</Label>
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
          <Label>{field.label}</Label>
          <select
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
            disabled={isDisabled}
          >
            <option value="">{field.placeholder || "Select"}</option>
            {field.name === "shipment_mode" &&
              ["Air", "Sea", "Road"].map((mode) => (
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
        <div key={index} className="flex gap-2">
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
      );
    }

    if (field.type === "textarea") {
      return (
        <div key={index} className="flex flex-col">
          <Label>{field.label}</Label>
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
      <div className="bg-white p-4 rounded shadow space-y-6">
        {/* Enter Doc + Edit inline */}
        <div className="flex items-end justify-between mb-4 gap-4">
          {/* Enter Document field */}
          <div className="flex-1">
            <Label>Enter RFQ No</Label>
            {isEditMode ? (
              <Input
                type="text"
                value={formData.enter_document_no || ""}
                readOnly
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            ) : (
              <select
                value={formData.enter_document_no_name || ""} // store selected name internally
                onChange={(e) => {
                  const selected = rfqOptions.find(r => r.name === e.target.value);
                  if (selected) handleRFQSelect(selected.name, selected.sr_no);
                }}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              >
                <option value="">Search By RFQ Sr.No</option>
                {rfqOptions.map((rfq: any, idx: number) => (
                  <option key={idx} value={rfq.name}>
                    {rfq.sr_no}
                  </option>
                ))}
              </select>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{secondRow.map(renderField)}</div>

        {/* Consignee & Consignor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{thirdRow.map(renderField)}</div>

        {/* Remaining fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {remainingFields.map(renderField)}
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
    </div>
  );
}
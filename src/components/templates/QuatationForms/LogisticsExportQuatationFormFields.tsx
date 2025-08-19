"use client";
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PurchaseRequestDropdown } from "@/src/types/PurchaseRequestType";
import MultipleFileUpload from "../../molecules/MultipleFileUpload";

interface Props {
  formData: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  uploadedFiles: File[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  Dropdown: PurchaseRequestDropdown["message"];
}

const LogisticsExportQuatationFormFields = ({
  formData,
  setFormData,
  uploadedFiles,
  setUploadedFiles,
  Dropdown,
}: Props) => {

  // Parse numeric inputs safely
  const chargeableWeight = parseFloat(formData["chargeable_weight"]) || 0;
  const rateKg = parseFloat(formData["ratekg"]) || 0;
  const fuelSurcharge = parseFloat(formData["fuel_surcharge"]) || 0;
  const sc = parseFloat(formData["sc"]) || 0;
  const xray = parseFloat(formData["xray"]) || 0;
  const otherCharges = parseFloat(formData["other_charges_in_total"]) || 0;

  // Auto-calculate total freight
  useEffect(() => {
    const totalFreight = chargeableWeight * (rateKg + fuelSurcharge + sc + xray) + otherCharges;

    setFormData((prev) => ({
      ...prev,
      total_freight: totalFreight.toFixed(2),
    }));
  }, [
    chargeableWeight,
    rateKg,
    fuelSurcharge,
    sc,
    xray,
    otherCharges,
    setFormData,
  ]);

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const renderInput = (
    name: string,
    label: string,
    type = "text",
    disabled = false
  ) => (
    <div className="col-span-1">
      <h1 className="text-[12px] font-normal text-[#626973] pb-3">{label}</h1>
      <Input
        name={name}
        type={type}
        className="border-neutral-200"
        value={formData[name] || ""}
        onChange={handleFieldChange}
        disabled={disabled}
      />
    </div>
  );

  const renderTextarea = (name: string, label: string, rows = 4) => (
    <div className="col-span-1">
      <h1 className="text-[12px] font-normal text-[#626973] pb-3">{label}</h1>
      <textarea
        name={name}
        rows={rows}
        value={formData[name] || ""}
        onChange={handleFieldChange}
        className="w-full rounded-md border border-neutral-200 px-3 h-10 py-2 text-sm text-gray-800"
      />
    </div>
  );

  const renderSelect = <T,>(
    name: string,
    label: string,
    options: T[],
    getValue: (item: T) => string,
    getLabel: (item: T) => string,
    isDisabled?: boolean
  ) => (
    <div className="col-span-1">
      <h1 className="text-[12px] font-normal text-[#626973] pb-3">{label}</h1>
      <Select
        value={formData[name] ?? ""}
        onValueChange={(value) => handleSelectChange(value, name)}
        disabled={isDisabled}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options?.map((item, idx) => (
              <SelectItem key={idx} value={getValue(item)}>
                {getLabel(item)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="grid grid-cols-3 gap-6 p-5">
      {renderSelect(
        "mode_of_shipment",
        "Mode of Shipment",
        Dropdown?.mode_of_shipment,
        (item) => item.name,
        (item) => `${item.name}`
      )}
      {renderInput("airlinevessel_name", "Airline/Vessel Name")}
      {renderInput("chargeable_weight", "Chargeable Weight")}
      {renderInput("ratekg", "Rate/Kg")}
      {renderInput("fuel_surcharge", "Fuel Surcharge")}
      {renderInput("sc", "SC")}
      {renderInput("xray", "X-Ray")}
      {renderInput("other_charges_in_total", "Other Charges in Total")}
      {renderInput("total_freight", "Total Freight", "text", true)}
      {renderInput(
        "expected_delivery_in_no_of_days",
        "Expected Delivery in No of Days"
      )}
      {renderTextarea("remarks", "Remarks")}
      <div>
        <h1 className="text-[12px] font-normal text-[#626973] pb-3">
          Upload Documents
        </h1>
        <MultipleFileUpload
          files={uploadedFiles}
          setFiles={setUploadedFiles}
          buttonText="Attach Files"
        />
      </div>
    </div>
  );
};

export default LogisticsExportQuatationFormFields;

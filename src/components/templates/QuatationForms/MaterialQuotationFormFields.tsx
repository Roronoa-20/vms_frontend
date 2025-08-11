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
import { PurchaseRequisitionRow } from "@/src/types/RFQtype";

interface Props {
  formData: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  uploadedFiles: File[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  Dropdown: PurchaseRequestDropdown["message"];
  itemcodes:PurchaseRequisitionRow[]
}

const MaterialQuatationFormFields = ({
  formData,
  setFormData,
  uploadedFiles,
  setUploadedFiles,
  Dropdown,
  itemcodes
}: Props) => {

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

// "row_id": "u9e7atrp0o",
// 				"head_unique_field": "H123",
// 				"purchase_requisition_number": "PR-0001",
// 				"material_code_head": "MAT-001",
// 				"delivery_date_head": null,
// 				"plant_head": null,
// 				"material_name_head": "Material A",
// 				"quantity_head": "100",
// 				"uom_head": "12",
// 				"price_head": "150",
// 				"rate_with_tax": 0,
// 				"rate_without_tax":  0,
// 				"moq_head":  0,
// 				"lead_time_head": 0,
// 				"tax":  0

  return (
    <div className="grid grid-cols-3 gap-6 p-5">
      {renderSelect(
        "material_code_head",
        "Select item Code",
        itemcodes,
        (item) => item.material_code_head,
        (item) => `${item.material_code_head}`
      )}
      {renderInput("material_name_head","Material Desc. & Specifications")}
      {renderInput("rate_head","Rate")}
      {renderInput("quantity_head","MOQ")}
      {renderInput("uom_head","UOM")}
      {renderInput("price_head","Price")}
      {renderInput("delivery_date_head","Delivery Date","date")}
      {renderInput("lead_time_head","Lead Time")}
      {renderTextarea("remarks", "Remarks")}
      {/* <div>
        <h1 className="text-[12px] font-normal text-[#626973] pb-3">
          Upload Documents
        </h1>
        <MultipleFileUpload
          files={uploadedFiles}
          setFiles={setUploadedFiles}
          onNext={(files) => console.log("Final selected files:", files)}
          buttonText="Attach Files"
        />
      </div> */}
    </div>
  );
};

export default MaterialQuatationFormFields;

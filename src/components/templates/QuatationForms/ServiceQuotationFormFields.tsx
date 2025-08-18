"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PurchaseRequestDropdown } from "@/src/types/PurchaseRequestType";
import { PurchaseRequisitionRow } from "@/src/types/RFQtype";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Plus } from "lucide-react";

interface SubheadField {
  material_code_subhead: string;
  material_name_subhead: string;
  quantity_subhead: string;
  uom_subhead: string;
  price_subhead: string;
  delivery_date_subhead: string;
}

interface Props {
  formData: Record<string, any>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  Dropdown: PurchaseRequestDropdown["message"];
  itemcodes: PurchaseRequisitionRow[];
  setTableData: React.Dispatch<React.SetStateAction<PurchaseRequisitionRow[]>>;
}

const ServiceQuotationFormFields = ({
  formData,
  setFormData,
  Dropdown,
  itemcodes,
  setTableData
}: Props) => {
  const [subheadFields, setSubheadFields] = useState<SubheadField[]>([]);

  // Sync subheadFields & auto calculate head price
  useEffect(() => {
    const totalPrice = subheadFields.reduce(
      (sum, item) => sum + (parseFloat(item.price_subhead) || 0),
      0
    );
    setFormData((prev) => ({
      ...prev,
      subhead_fields: subheadFields,
      price_head: totalPrice.toFixed(2),
    }));
  }, [subheadFields, setFormData]);

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Initialize with one row on selecting material code first time
    if (field === "material_code_head" && subheadFields.length === 0) {
      setSubheadFields([
        {
          material_code_subhead: value,
          material_name_subhead: "",
          quantity_subhead: "",
          uom_subhead: "",
          price_subhead: "",
          delivery_date_subhead: "",
        },
      ]);
    }
  };

  const handleSubheadChange = (
    index: number,
    field: keyof SubheadField,
    value: string
  ) => {
    const updated = [...subheadFields];
    updated[index][field] = value;
    setSubheadFields(updated);
  };

  const addSubheadRow = (index: number) => {
    const updated = [...subheadFields];
    updated.splice(index + 1, 0, {
      material_code_subhead: formData.material_code_head || "",
      material_name_subhead: "",
      quantity_subhead: "",
      uom_subhead: "",
      price_subhead: "",
      delivery_date_subhead: "",
    });
    setSubheadFields(updated);
  };

  const deleteSubheadRow = (index: number) => {
    const updated = subheadFields.filter((_, idx) => idx !== index);
    setSubheadFields(updated);
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
    <div className="p-5 space-y-6">
      {/* Main form */}
      <div className="grid grid-cols-3 gap-6">
        {renderSelect(
          "material_code_head",
          "Select item Code",
          itemcodes,
          (item) => item.material_code_head,
          (item) => `${item.material_code_head}`
        )}
        {renderInput("material_name_head", "Material Desc. & Specifications")}
        {renderInput("price_head", "Total Price", "number", true)}
        {renderInput("lead_time_head", "Lead Time")}
        {renderTextarea("remarks", "Remarks")}
      </div>

      {/* Sub services table */}
      {formData.material_code_head && (
        <>
          <div className="mt-6 border">
            <h2 className="text-lg font-semibold mb-3">Sub Services</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Add Row</TableHead>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>UOM</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Delivery Date</TableHead>
                  <TableHead>Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subheadFields.map((sub, index) => (
                  <TableRow key={index}>
                    {/* Add Row Button */}
                    <TableCell>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => addSubheadRow(index)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </TableCell>

                    <TableCell>
                      <Input
                        value={sub.material_name_subhead}
                        onChange={(e) =>
                          handleSubheadChange(index, "material_name_subhead", e.target.value)
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <Input
                        value={sub.quantity_subhead}
                        onChange={(e) =>
                          handleSubheadChange(index, "quantity_subhead", e.target.value)
                        }
                      />
                    </TableCell>

                    {/* UOM Select */}
                    <TableCell>
                      <Select
                        value={sub.uom_subhead}
                        onValueChange={(val) =>
                          handleSubheadChange(index, "uom_subhead", val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {Dropdown.uom_master?.map((u, idx) => (
                            <SelectItem key={idx} value={u.name}>
                              {u.uom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>

                    <TableCell>
                      <Input
                        value={sub.price_subhead}
                        onChange={(e) =>
                          handleSubheadChange(index, "price_subhead", e.target.value)
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <Input
                        type="date"
                        value={sub.delivery_date_subhead}
                        onChange={(e) =>
                          handleSubheadChange(index, "delivery_date_subhead", e.target.value)
                        }
                      />
                    </TableCell>

                    {/* Delete Button */}
                    <TableCell>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => deleteSubheadRow(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="default"
              onClick={() => {
                setTableData(prev => [...prev, { ...formData }]);
                // Reset the form
                setFormData({
                  material_code_head: "",
                  material_name_head: "",
                  price_head: "",
                  lead_time_head: "",
                  remarks: "",
                  subhead_fields: []
                });
                // Also clear the subhead table
                setSubheadFields([]);
              }}
            >
              Save Services
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ServiceQuotationFormFields;

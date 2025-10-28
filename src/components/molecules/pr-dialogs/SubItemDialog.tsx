
'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectGroup, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { SubheadField } from '@/src/types/PurchaseRequisitionType';
import API_END_POINTS from '@/src/services/apiEndPoints';
import { AxiosResponse } from 'axios';
import requestWrapper from '@/src/services/apiCall';
import { CostCenter, Currency, GLAccountNumber, UOMMaster } from '@/src/types/PurchaseRequestType';
interface DropdownData {
  currency_master: Currency[]
  uom_master: UOMMaster[];
  cost_center: CostCenter[];
  gl_account_number: GLAccountNumber[];
}

interface SubItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  fetchTableData: (pur_req: string) => void;
  Dropdown: DropdownData;
  CostCenterDropdown: CostCenter[]
  GLAccountDropdwon: GLAccountNumber[]
  pur_req: string;
  selectedMainItemId: string;
  currentItemNumber: number;
  defaultData: SubheadField | null;
  editAction: boolean;
}


const SubItemModal: React.FC<SubItemModalProps> = ({
  isOpen, onClose, fetchTableData, Dropdown, pur_req, selectedMainItemId, CostCenterDropdown, GLAccountDropdwon, currentItemNumber, defaultData, editAction
}) => {
  const emptyFormData: SubheadField = {
    row_id: "",
    doc_name:"",
    name:"",
    item_number_of_purchase_requisition_subhead: String(currentItemNumber),
    service_number_subhead: "",
    short_text_subhead: "",
    quantity_subhead: "",
    uom_subhead: "",
    gross_price_subhead: 0,
    currency_subhead: "",
    service_type_subhead: "",
    net_value_subhead: 0,
    cost_center_subhead: "",
    gl_account_number_subhead: "",
    row_name: "",
    sub_head_unique_id: "",
    purchase_requisition_item_subhead: "",
    purchase_requisition_date_subhead: "",
    account_assignment_category_subhead: "",
    item_category_subhead: "",
    store_location_subhead: "",
    delivery_date_subhead: "",
    material_group_subhead: "",
    main_asset_no_subhead: "",
    asset_subnumber_subhead: "",
    profit_ctr_subhead: "",
    price_of_purchase_requisition_subhead: "",
    material_code_subhead: "",
    purchase_group_subhead: "",
    subhead_unique_field: "", material_name_subhead: "", price_subhead: "", original_quantity: "", original_delivery_date: ""
  };
  const [formData, setFormData] = useState<SubheadField>({ ...emptyFormData });
  const [errors, setErrors] = useState<Record<keyof SubheadField, boolean>>({} as any);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (isOpen) {
  //     setFormData({ ...emptyFormData });
  //     // setErrors({});
  //   }
  // }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (defaultData && Object.keys(defaultData).length > 0) {
        // ✅ Edit mode — populate with defaultData
        setFormData({
          ...emptyFormData,
          ...defaultData,
        });
      } else {
        // ✅ Add mode — fresh form
        setFormData({ ...emptyFormData });
      }
    }
  }, [isOpen, defaultData]);


  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const field = name as keyof SubheadField;
    setFormData(prev => ({ ...prev, [field]: value }));
    // if (errors[field]) {
    //   setErrors(prev => ({ ...prev, [field]: false }));
    // }
  };

  const handleSelectChange = (value: string, field: keyof SubheadField) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // if (errors[field]) {
    //   setErrors(prev => ({ ...prev, [field]: false }));
    // }
  };

  const getInputClass = (field: keyof SubheadField) =>
    errors[field] ? "border-red-600" : "border-neutral-200";

  const renderLabel = (label: string, field: keyof SubheadField) => (
    <h1 className="text-[12px] font-normal text-[#626973] pb-3">
      {label}
      {errors[field] && <span className="text-red-600 ml-1">*</span>}
    </h1>
  );

  const requiredFields: (keyof SubheadField)[] = [
    "service_number_subhead", "short_text_subhead", "quantity_subhead",
    "uom_subhead", "gross_price_subhead", "currency_subhead",
    "service_type_subhead", "net_value_subhead",
    "cost_center_subhead", "gl_account_number_subhead"
  ];

  const validate = () => {
    const newErrors: Record<keyof SubheadField, boolean> = {} as any;
    requiredFields.forEach(field => {
      if (!formData[field]) newErrors[field] = true;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      let url = API_END_POINTS?.PRTableSubHeadSubmitData; // default = add
      let updateformdata: SubheadField = {
        ...formData,
        name: pur_req,
        row_name: selectedMainItemId,
      };

      if (editAction) {
        url = API_END_POINTS?.PRTableSubHeadUpdateData; // your edit API
        updateformdata = {
          ...formData,
          name: pur_req, // use doc_name instead of name
          row_name: defaultData?.row_name ?? "",
        };
      }

      const response: AxiosResponse = await requestWrapper({
        url,
        data: { data: updateformdata },
        method: "POST",
      });

      if (response?.status === 200) {
        fetchTableData(pur_req);
        onClose();
      } else {
        alert("Error while saving data");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };


  const textFields: { name: keyof SubheadField; label: string; type?: string }[] = [
    { name: "item_number_of_purchase_requisition_subhead", label: "Item Number of Purchase Requisition" },
    { name: "service_number_subhead", label: "Service Number" },
    { name: "short_text_subhead", label: "Short Text" },
    { name: "quantity_subhead", label: "Quantity", type: "number" },
    { name: "gross_price_subhead", label: "Gross Price", type: "number" },
    // { name: "currency_subhead", label: "Currency" },
    { name: "service_type_subhead", label: "Service Type" },
    { name: "net_value_subhead", label: "Net Value", type: "number" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Add Sub Item</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-6 p-5">
          {textFields.map(({ name, label, type }) => (
            <div className="col-span-1" key={name}>
              {renderLabel(label, name)}
              <Input
                name={name}
                type={type || 'text'}
                className={getInputClass(name)}
                value={formData[name]?.toString() ?? ""}
                onChange={handleFieldChange}
              />
            </div>
          ))}

          <div className="col-span-1">
            {renderLabel("UOM", "uom_subhead")}
            <Select
              value={formData.uom_subhead ?? ""}
              onValueChange={(val) => handleSelectChange(val, "uom_subhead")}
            >
              <SelectTrigger className={getInputClass("uom_subhead")}>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Dropdown?.uom_master.map((item, i) => (
                    <SelectItem key={i} value={item?.name}>{item?.description}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-1">
            {renderLabel("Currency", "currency_subhead")}
            <Select
              value={formData.currency_subhead ?? ""}
              onValueChange={(val) => handleSelectChange(val, "currency_subhead")}>
              <SelectTrigger className={getInputClass("currency_subhead")}>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Dropdown?.currency_master.map((item, i) => (
                    <SelectItem key={i} value={item?.name}>{item?.name}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-1">
            {renderLabel("Cost Center", "cost_center_subhead")}
            <Select
              value={formData.cost_center_subhead ?? ""}
              onValueChange={(val) => handleSelectChange(val, "cost_center_subhead")}
            >
              <SelectTrigger className={getInputClass("cost_center_subhead")}>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {CostCenterDropdown.map((item, i) => (
                    <SelectItem key={i} value={item.name}>{item.cost_center_code} - {item.cost_center_name}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-1">
            {renderLabel("G/L Number", "gl_account_number_subhead")}
            <Select
              value={formData.gl_account_number_subhead ?? ""}
              onValueChange={(val) => handleSelectChange(val, "gl_account_number_subhead")}
            >
              <SelectTrigger className={getInputClass("gl_account_number_subhead")}>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {GLAccountDropdwon.map((item, i) => (
                    <SelectItem key={i} value={item.name}>{item.gl_account_code} - {item.gl_account_name}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Sub Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubItemModal;

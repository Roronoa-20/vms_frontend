'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import API_END_POINTS from '@/src/services/apiEndPoints';
import { AxiosResponse } from 'axios';
import requestWrapper from '@/src/services/apiCall';
import { AccountAssignmentCategory, ItemCategoryMaster, MaterialGroupMaster, PurchaseGroup, PurchaseOrganisation, StorageLocation, StoreLocation, UOMMaster, ValuationArea, ValuationClass } from '@/src/types/PurchaseRequestType';

interface DropdownData {
  purchase_organisation: PurchaseOrganisation[];
  account_assignment_category: AccountAssignmentCategory[];
  item_category_master: ItemCategoryMaster[];
  uom_master: UOMMaster[];
  material_group_master: MaterialGroupMaster[];
  purchase_group: PurchaseGroup[];
  store_location: StoreLocation[];
  valuation_area: ValuationArea[];
  // valuation_class: ValuationClass[];

}

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  fetchTableData: (pur_req: string) => void;
  Dropdown: DropdownData;
  defaultData: Record<string, any> | undefined;
  pur_req: string;
  PurchaseGroupDropdown: PurchaseGroup[]
  StorageLocationDropdown: StorageLocation[]
  ValuationClassDropdown: ValuationClass[]
  PurchaseOrgDropdown: PurchaseOrganisation[]
  MaterialGroupDropdown: MaterialGroupMaster[]
}

const EditSBItemModal: React.FC<EditItemModalProps> = ({
  isOpen,
  onClose,
  fetchTableData,
  Dropdown,
  defaultData,
  pur_req,
  PurchaseGroupDropdown,
  StorageLocationDropdown,
  ValuationClassDropdown,
  PurchaseOrgDropdown,
  MaterialGroupDropdown
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [requiredField, setRequiredField] = useState<Record<string, any>>({});
  useEffect(() => {
    if (isOpen) {
      setFormData(defaultData || {});
      setErrors({});
    }
  }, [isOpen, defaultData]);


  const fetchRequiredData = async (company: string, pur_type: string, acct_cate: string) => {
    console.log(company, pur_type, acct_cate)
    try {
      const Data = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_END}/api/method/vms.APIs.purchase_api.handle_req_field_pr.filter_req_fields?company=${company}&pur_type=${pur_type}&acct_cate=${acct_cate}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
        }
      );
      if (Data.ok) {
        const data = await Data.json();
        setRequiredField(data?.message)
        console.log(data, "data in required")
      }
    } catch (error) {
      console.log(error, "something went wrong");
    }
  };
  useEffect(() => {
    fetchRequiredData(formData?.company_code_area_head, formData?.purchase_requisition_type, formData?.account_assignment_category_head);
  }, [formData?.company_code_area_head, formData?.purchase_requisition_type, formData?.account_assignment_category_head])


  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const getInputClass = (field: string) =>
    errors[field] ? "border-red-600" : "border-neutral-200";

  const renderLabel = (label: string, field: string) => (
    <h1 className="text-[12px] font-normal text-[#626973] pb-3">
      {label}
      {errors[field] && <span className="text-red-600 ml-1">*</span>}
    </h1>
  );

  const validate = () => {
    const newErrors: Record<string, string> = {};

    Object.entries(requiredField).forEach(([field, rule]) => {
      const value = formData[field];

      if (rule.includes("Compulsory")) {
        if (!value || value.trim() === "") {
          newErrors[field] = `${field} is required`;
        }
      }

      // Special condition for "Compulsory must D"
      if (rule === "Compulsory must D" && value !== "D") {
        newErrors[field] = `${field} must be 'D'`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      alert(JSON.stringify(errors));
      return;
    }
    const updateformdata = { ...formData, name: pur_req };
    const url = API_END_POINTS?.PRTableHeadSubmitData;
    const response: AxiosResponse = await requestWrapper({
      url,
      data: { data: updateformdata },
      method: "POST"
    });

    if (response?.status === 200) {
      console.log(response.data, "response edit head and update");
      fetchTableData(pur_req);
      onClose();
    } else {
      alert("Error");
    }
  };

  // ✅ Typed input and select field arrays with `as const`
  const inputFields = [
    // ["status_head", "Status"],
    // ["item_number_of_purchase_requisition_head", "Item Number of Purchase Requisition"],
    ["purchase_requisition_date_head", "Purchase Requisition Date", "date"],
    ["short_text_head", "Short Text"],
    ["quantity_head", "Quantity", "number"],
    ["c_delivery_date_head", "C/ Delivery Date", "date"],
    ["delivery_date_head", "Delivery Date", "date"],
    ["tracking_id_head", "Tracking ID"],
    ["desired_vendor_head", "Desired Vendor"],
    ["fixed_value_head", "Fixed Value"],
    ["spit_head", "Spit"],
    ["agreement_head", "Agreement"],
    ["item_of_head", "Item Of..."],
    ["mpn_number_head", "MPN Number"],
  ] as const;
  const selectFields = [
    [
      "purchase_group_head",
      "Purchase Group",
      PurchaseGroupDropdown,
      (item: PurchaseGroup) => item.purchase_group_code,
      (item: PurchaseGroup) => `${item.purchase_group_code} - ${item.purchase_group_name}`
    ],
    [
      "store_location_head",
      "Store Location",
      StorageLocationDropdown,
      (item: StorageLocation) => item.name,
      (item: StorageLocation) => `${item.storage_name} - ${item.storage_location_name}`
    ],
    [
      "valuation_area_head",
      "Valuation Area",
      ValuationClassDropdown,
      (item: ValuationClass) => item.name,
      (item: ValuationClass) => `${item.valuation_class_code} - ${item.valuation_class_name}`
    ],
    [
      "account_assignment_category_head",
      "Account Assignment Category",
      Dropdown?.account_assignment_category,
      (item: AccountAssignmentCategory) => item.account_assignment_category_code,
      (item: AccountAssignmentCategory) => `${item.account_assignment_category_code} - ${item.account_assignment_category_name}`
    ],
    [
      "item_category_head",
      "Item Category",
      Dropdown?.item_category_master,
      (item: ItemCategoryMaster) => item.name,
      (item: ItemCategoryMaster) => `${item.item_code} - ${item.item_name}`
    ],
    [
      "uom_head",
      "UOM",
      Dropdown?.uom_master,
      (item: UOMMaster) => item.uom_code,
      (item: UOMMaster) => `${item.uom_code} - ${item.uom}`
    ],
    [
      "material_group_head",
      "Material Group",
      MaterialGroupDropdown,
      (item: MaterialGroupMaster) => item.material_group_name,
      (item: MaterialGroupMaster) => `${item.material_group_name} - ${item.material_group_description}`
    ],
    [
      "purchase_organisation_head",
      "Purchase Organisation",
      PurchaseOrgDropdown,
      (item: PurchaseOrganisation) => item.purchase_organisation_code,
      (item: PurchaseOrganisation) => `${item.purchase_organisation_code} - ${item.purchase_organisation_name}`
    ],
  ] as const;
  const disabledFields = ["item_number_of_purchase_requisition_head", "Item Number of Purchase Requisition"];

  console.log(formData?.company_code_area_head, formData?.purchase_requisition_type, formData?.account_assignment_category_head, "formData?.company, formData?.purchase_requisition_type, formData?.account_assignment_category")
  console.log(requiredField, "requiredField")
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Purchase Request Items</DialogTitle>
          <DialogDescription>Edit the details below</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6 p-5">
          {inputFields.map(([name, label, type = "text",]) => (
            <div className="col-span-1" key={name}>
              {renderLabel(label, name)}
              <Input
                name={name}
                type={type}
                className={getInputClass(name)}
                value={formData[name] || ""}
                onChange={handleFieldChange}
                disabled={disabledFields.includes(name)}
              />
            </div>
          ))}

          {selectFields.map(([name, label, options]) => (
            <div className="col-span-1" key={name}>
              {renderLabel(label, name)}
              <Select
                value={formData[name] || ""}
                onValueChange={val => handleSelectChange(val, name)}
              >
                <SelectTrigger className={getInputClass(name)}>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {options?.map((item, i) => (
                      <SelectItem key={i} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditSBItemModal;

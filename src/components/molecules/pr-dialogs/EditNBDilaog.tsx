// components/EditNBModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'
import { today } from '../../templates/RFQTemplates/LogisticsImportRFQFormFields';
import { AccountAssignmentCategory, CostCenter, GLAccountNumber, ItemCategoryMaster, MaterialCode, MaterialGroupMaster, ProfitCenter, PurchaseGroup, StorageLocation, StoreLocation, UOMMaster, ValuationArea, ValuationClass } from '@/src/types/PurchaseRequestType';
interface DropdownData {
  account_assignment_category: AccountAssignmentCategory[];
  item_category_master: ItemCategoryMaster[];
  uom_master: UOMMaster[];
  cost_center: CostCenter[];
  profit_center: ProfitCenter[];
  gl_account_number: GLAccountNumber[];
  material_group_master: MaterialGroupMaster[];
  material_code: MaterialCode[];
  purchase_group: PurchaseGroup[];
  store_location: StoreLocation[];
  valuation_area: ValuationArea[];
  // valuation_class: ValuationClass[];
  storage_location: StorageLocation[];
}

interface EditNBModalProps {
  isOpen: boolean;
  onClose: () => void;
  fetchTableData: (pur_req: string) => void;
  Dropdown: DropdownData;
  defaultData: Record<string, any> | undefined;
  pur_req: string;
  PurchaseGroupDropdown: PurchaseGroup[]
  StorageLocationDropdown: StorageLocation[]
  ValuationClassDropdown: ValuationClass[]
  ProfitCenterDropdown: ProfitCenter[]
  MaterialGroupDropdown: MaterialGroupMaster[]
  GLAccountDropdwon: GLAccountNumber[]
  CostCenterDropdown: CostCenter[]
  MaterialCodeDropdown: MaterialCode[]
}

const EditNBModal: React.FC<EditNBModalProps> = ({
  isOpen,
  onClose,
  fetchTableData,
  Dropdown,
  defaultData,
  pur_req,
  PurchaseGroupDropdown,
  StorageLocationDropdown,
  ValuationClassDropdown,
  ProfitCenterDropdown, MaterialGroupDropdown, GLAccountDropdwon, CostCenterDropdown, MaterialCodeDropdown
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [requiredField, setRequiredField] = useState<Record<string, any>>({});
  useEffect(() => {
    if (isOpen) {
      setFormData(defaultData || {});
      setErrors({});
    }
  }, [isOpen, defaultData]);
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };
  const renderError = (field: string) =>
    errors[field] ? (
      <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
    ) : null;
  const handleSelectChange = (value: string, field: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };
  const fetchRequiredData = async (company: string, pur_type: string, acct_cate: string) => {
    console.log(company, pur_type, acct_cate, "data rrquired before api")
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
        console.log(data, "data in required-------------------------------------------")
      }
    } catch (error) {
      console.log(error, "something went wrong");
    }
  };
  useEffect(() => {
    const { company_code_area_head, purchase_requisition_type, account_assignment_category_head } = formData || {};
    // Only call API if all three are present (non-empty)
    if (company_code_area_head && purchase_requisition_type && account_assignment_category_head) {
      fetchRequiredData(
        company_code_area_head,
        purchase_requisition_type,
        account_assignment_category_head
      );
    }
  }, [
    formData?.company_code_area_head,
    formData?.purchase_requisition_type,
    formData?.account_assignment_category_head
  ]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Helper: Convert field name to readable format
    const formatFieldName = (name: string) => {
      return name
        .replace(/_/g, " ") // replace underscores with spaces
        .replace(/([a-z])([A-Z])/g, "$1 $2") // split camelCase
        .replace(/\b\w/g, (char) => char.toUpperCase()) // capitalize each word
        .replace(/\bHead\b/gi, ""); // remove the word 'Head' if present
    };

    Object.entries(requiredField).forEach(([field, rule]) => {
      const value = formData[field];
      const displayName = formatFieldName(field);

      if (rule.includes("Compulsory")) {
        if (!value || value.trim() === "") {
          newErrors[field] = `${displayName} is required`;
        }
      }

      if (rule === "Compulsory must D" && value !== "D") {
        newErrors[field] = `${displayName} must be 'D'`;
      }
    });

    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async () => {
    console.log(errors, "errors before submit")
    if(!formData.account_assignment_category_head){
      alert("Select Account Assignment Category")
      return
    }
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      alert(JSON.stringify(validationErrors));
      return;
    }

    const updateformdata = { ...formData, name: pur_req }
    const url = API_END_POINTS?.PRTableHeadSubmitData;
    const response: AxiosResponse = await requestWrapper({ url: url, data: { data: { ...updateformdata } }, method: "POST" });
    if (response?.status == 200) {
      console.log(response.data, "reposne edit NB head and upadte")
      console.log(pur_req, "pur_reqpur_reqpur_reqpur_req before submit")
      fetchTableData(pur_req);
      onClose();
    } else {
      alert("error");
    }
  };
  useEffect(() => {
    setFormData((prev) => ({ ...prev, purchase_requisition_date_head: formData?.purchase_requisition_date_head ? formData?.purchase_requisition_date_head : today }));
  }, [today, formData?.purchase_requisition_date_head]);
  const renderInput = (name: string, label: string, type = 'text', inputProps: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div className="col-span-1">
      <h1 className="text-[12px] font-normal text-[#626973] pb-3">
        {label} {errors[name] && <span className="text-red-600 ml-1">*</span>}
      </h1>
      <Input
        name={name}
        type={type}
        className={errors[name] ? 'border-red-600' : 'border-neutral-200'}
        value={formData[name] || ''}
        onChange={handleFieldChange}
        {...inputProps}
      />
      {renderError(name)}
    </div>
  );
  const renderSelect = <T,>(
    name: string,
    label: string,
    options: T[],
    getValue: (item: T) => string,
    getLabel: (item: T) => string
  ) => {
    const selectedValue = formData[name] ?? "";
    return (
      <div className="col-span-1">
        <h1 className="text-[12px] font-normal text-[#626973] pb-3">
          {label}
          {errors[name as keyof typeof errors] && (
            <span className="text-red-600 ml-1">*</span>
          )}
        </h1>

        <Select
          value={selectedValue}
          onValueChange={(value) => handleSelectChange(value, name)}
        >
          <SelectTrigger className={errors[name as keyof typeof errors] ? 'border border-red-600' : ''}>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {options.map((item, idx) => (
                <SelectItem key={idx} value={getValue(item)}>
                  {getLabel(item)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {renderError(name)}
      </div>
    );
  };
  console.log(formData, "0000000000000000000000000000000000000000000000000000")
  console.log(errors, "errors")
  console.log(requiredField, "requiredField")


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Purchase Request Items</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-6">
          {renderInput('item_number_of_purchase_requisition_head', 'Item Number of Purchase Requisition', 'text', { disabled: true })}
          {renderInput('purchase_requisition_date_head', 'Purchase Requisition Date', 'date')}
          {renderSelect(
            'purchase_group_head',
            'Purchase Group',
            PurchaseGroupDropdown,
            (item) => item.name,
            (item) => `${item.purchase_group_code} - ${item.purchase_group_name}`
          )}

          {renderSelect(
            'account_assignment_category_head',
            'Account Assignment Category',
            Dropdown.account_assignment_category,
            (item) => item.name,
            (item) => `${item.account_assignment_category_code} - ${item.account_assignment_category_name}`
          )}
          {renderSelect(
            'store_location_head',
            'Store Location',
            StorageLocationDropdown,
            (item) => item.name,
            (item) => `${item.storage_name}`
          )}

          {renderInput('delivery_date_head', 'Delivery Date', 'date')}

          {renderSelect(
            'item_category_head',
            'Item Category',
            Dropdown.item_category_master,
            (item) => item.name,
            (item) => `${item.item_code} - ${item.item_name}`
          )}

          {renderSelect(
            'material_group_head',
            'Material Group',
            MaterialGroupDropdown,
            (item) => item.name,
            (item) => `${item.material_group_name} - ${item.material_group_description}`
          )}

          {renderSelect(
            'uom_head',
            'UOM',
            Dropdown.uom_master,
            (item) => item.name,
            (item) => `${item.uom_code} - ${item.uom}`
          )}

          {renderSelect(
            'cost_center_head',
            'Cost Center',
            CostCenterDropdown,
            (item) => item.name,
            (item) => `${item.cost_center_code} - ${item.cost_center_name}`
          )}
          {renderInput('main_asset_no_head', 'Main Asset No')}
          {renderInput('asset_subnumber_head', 'Asset Subnumber')}

          {renderSelect(
            'profit_ctr_head',
            'Profit Center',
            ProfitCenterDropdown,
            (item) => item.name,
            (item) => `${item.profit_center_code} - ${item.profit_center_name}`
          )}

          {renderInput('short_text_head', 'Description')}
          {/* {renderInput('valuation_area_head', 'Valuation Area')} */}
          {renderSelect(
            'valuation_area_head',
            'Valuation Area',
            ValuationClassDropdown,
            (item) => item.name,
            (item) => `${item.valuation_class_code} - ${item.valuation_class_name}`
          )}
          {renderInput('quantity_head', 'Quantity')}
          {renderInput('price_of_purchase_requisition_head', 'Price Of Purchase Requisition')}

          {renderSelect(
            'gl_account_number_head',
            'GL Account Number',
            GLAccountDropdwon,
            (item) => item.name,
            (item) => `${item.gl_account_code} - ${item.gl_account_name}`
          )}

          {renderSelect(
            'material_code_head',
            'Material Code',
            MaterialCodeDropdown,
            (item) => item.name,
            (item) => `${item.material_code} - ${item.material_name}`
          )}
        </div>

        <DialogFooter>
          <Button variant="backbtn" size="backbtnsize" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading} className="py-2.5" variant={"nextbtn"} size={"nextbtnsize"}>
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditNBModal;

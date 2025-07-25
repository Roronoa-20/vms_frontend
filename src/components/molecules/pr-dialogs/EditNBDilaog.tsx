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
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(defaultData || {});
      setErrors({});
    }
  }, [isOpen, defaultData]);
  console.log(pur_req, defaultData, "pur_req----------------")
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

  const validate = () => {
    const requiredFields = [
      'account_assignment_category', 'store_location', 'delivery_date',
      'item_category', 'material_group', 'uom', 'cost_center',
      'main_asset_no', 'asset_subnumber', 'profit_ctr', 'short_text',
      'quantity', 'price_of_purchase_requisition', 'gl_account_number', 'material_code'
    ];
    const newErrors: Record<string, boolean> = {};
    requiredFields.forEach(field => {
      if (!formData[field]) newErrors[field] = true;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // if (!validate()) return;
    // setLoading(true);
    // try {
    //   const res = await fetch('/api/edit-nb', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData),
    //   });
    //   if (res.ok) {
    //     onClose();
    //     fetchTableData(pur_req?pur_req:"");
    //   } else {
    //     console.error("Failed to submit", await res.text());
    //   }
    // } catch (err) {
    //   console.error("Error submitting NB", err);
    // } finally {
    //   setLoading(false);
    // }

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
    </div>
  );

  // const renderSelect = <T,>(
  //   name: string,
  //   label: string,
  //   options: T[],
  //   getValue: (item: T) => string,
  //   getLabel: (item: T) => string
  // ) => (
  //   <div className="col-span-1">
  //     <h1 className="text-[12px] font-normal text-[#626973] pb-3">
  //       {label}
  //       {errors[name as keyof typeof errors] && (
  //         <span className="text-red-600 ml-1">*</span>
  //       )}
  //     </h1>
  //     <Select
  //       value={formData[name] ?? ""}
  //       onValueChange={(value) => handleSelectChange(value, name)}
  //     >
  //       <SelectTrigger className={errors[name as keyof typeof errors] ? 'border border-red-600' : ''}>
  //         <SelectValue placeholder="Select" />
  //       </SelectTrigger>
  //       <SelectContent>
  //         <SelectGroup>
  //           {options.map((item, idx) => (
  //             <SelectItem key={idx} value={getValue(item)}>
  //               {getLabel(item)}
  //             </SelectItem>
  //           ))}
  //         </SelectGroup>
  //       </SelectContent>
  //     </Select>
  //   </div>
  // );

  const renderSelect = <T,>(
    name: string,
    label: string,
    options: T[],
    getValue: (item: T) => string,
    getLabel: (item: T) => string
  ) => {
    const selectedValue = formData[name] ?? "";

    // Debug: See what's going wrong
    // console.log(`Selected value for "${name}":`, selectedValue);
    // console.log("Available option values:", options.map(getValue));

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
      </div>
    );
  };



  console.log("UOM MaterialForm", Dropdown.uom_master)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Purchase Request Items</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-6 p-5">
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

          {/* {renderInput('store_location_head', 'Store Location')} */}

          {/* {renderSelect(
            'store_location_head',
            'Store Location',
            Dropdown.store_location,
            (item) => item.name,
            (item) => `${item.store_name} - ${item.store_location_name}`
          )} */}

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
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-green-600 hover:bg-green-700">
            {loading ? 'Submitting...' : 'Submit NB'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditNBModal;

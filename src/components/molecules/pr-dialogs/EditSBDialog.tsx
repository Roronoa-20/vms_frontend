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
import { AccountAssignmentCategory, CostCenter, GLAccountNumber, ItemCategoryMaster, MaterialGroupMaster, PurchaseGroup, PurchaseOrganisation, StorageLocation, StoreLocation, UOMMaster, ValuationArea, ValuationClass } from '@/src/types/PurchaseRequestType';
import { today } from '../../templates/RFQTemplates/LogisticsImportRFQFormFields';
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
  CostCenterDropdown: CostCenter[]
  GLAccountDropdwon: GLAccountNumber[]
  accountAssigmentDropdown:AccountAssignmentCategory[]
  itemCategoryDropdown:ItemCategoryMaster[]
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
  MaterialGroupDropdown,
  GLAccountDropdwon,
  CostCenterDropdown,
  accountAssigmentDropdown,
  itemCategoryDropdown
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

  useEffect(() => {
    setFormData((prev) => ({ ...prev, purchase_requisition_date_head: formData?.purchase_requisition_date_head ? formData?.purchase_requisition_date_head : today }));
  }, [today, formData?.purchase_requisition_date_head]);

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
  // ✅ Error helper functions
  const getInputClass = (field: string) =>
    `w-full border p-2 rounded-md ${errors[field] ? "border-red-600" : "border-neutral-200"
    }`;

  const renderLabel = (label: string, field: string) => (
    <h1 className="text-[12px] font-normal text-[#626973] pb-3 flex items-center gap-1">
      {label}
      {errors[field] && <span className="text-red-600">*</span>}
    </h1>
  );

  const renderError = (field: string) =>
    errors[field] ? (
      <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
    ) : null;

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
    console.log(validationErrors,"this are all the errors")
    console.log(errors,"this is the funciton errors")
    if (Object.keys(validationErrors).length > 0) {
      // alert(JSON.stringify(validationErrors));
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
      alert('Updated Successfully');
      onClose();
    } else {
      alert("Error");
    }
  };

  // ✅ Typed input and select field arrays with `as const`
  const disabledFields = ["item_number_of_purchase_requisition_head", "Item Number of Purchase Requisition"];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Purchase Request Items</DialogTitle>
          <DialogDescription>Edit the details below</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-6 p-5">

          {/* Purchase Requisition Date */}
          <div className="col-span-1">
            {renderLabel("Purchase Requisition Date", "purchase_requisition_date_head")}
            <Input
              name="purchase_requisition_date_head"
              type="date"
              className={getInputClass("purchase_requisition_date_head")}
              value={formData.purchase_requisition_date_head || ""}
              onChange={handleFieldChange}
              disabled={disabledFields.includes("purchase_requisition_date_head")}
            />
            {renderError("purchase_requisition_date_head")}
          </div>
          {/* Purchase Group */}
          <div className="col-span-1">
            {renderLabel("Purchase Group", "purchase_group_head")}
            <Select
              value={formData.purchase_group_head || ""}
              onValueChange={val => handleSelectChange(val, "purchase_group_head")}
            >
              <SelectTrigger className={getInputClass("purchase_group_head")}>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {PurchaseGroupDropdown?.map((item, i) => (
                    <SelectItem key={i} value={item.purchase_group_code}>
                      {item.purchase_group_code} - {item.purchase_group_name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {renderError("purchase_group_head")}
          </div>

          {/* Account Assignment Category */}
          <div className="col-span-1">
            {renderLabel("Account Assignment Category", "account_assignment_category_head")}
            <Select
              value={formData.account_assignment_category_head || ""}
              onValueChange={val => handleSelectChange(val, "account_assignment_category_head")}
            >
              <SelectTrigger className={getInputClass("account_assignment_category_head")}>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {accountAssigmentDropdown?.map((item, i) => (
                    <SelectItem key={i} value={item.account_assignment_category_code}>
                      {item.account_assignment_category_code} - {item.account_assignment_category_name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {renderError("account_assignment_category_head")}
          </div>

          {/* Store Location */}
          <div className="col-span-1">
            {renderLabel("Store Location", "store_location_head")}
            <Select
              value={formData.store_location_head || ""}
              onValueChange={val => handleSelectChange(val, "store_location_head")}
            >
              <SelectTrigger className={getInputClass("store_location_head")}>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {StorageLocationDropdown?.map((item, i) => (
                    <SelectItem key={i} value={item.name}>
                      {item.storage_name} - {item.storage_location_name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {renderError("store_location_head")}
          </div>

          {/* Delivery Date */}
          <div className="col-span-1">
            {renderLabel("Delivery Date", "delivery_date_head")}
            <Input
              name="delivery_date_head"
              type="date"
              className={getInputClass("delivery_date_head")}
              value={formData.delivery_date_head || ""}
              onChange={handleFieldChange}
              disabled={disabledFields.includes("delivery_date_head")}
            />
            {renderError("delivery_date_head")}
          </div>

          {/* C/ Delivery Date */}
          <div className="col-span-1">
            {renderLabel("C/ Delivery Date", "c_delivery_date_head")}
            <Input
              name="c_delivery_date_head"
              type="date"
              className={getInputClass("c_delivery_date_head")}
              value={formData.c_delivery_date_head || ""}
              onChange={handleFieldChange}
              disabled={disabledFields.includes("c_delivery_date_head")}
            />
            {renderError("c_delivery_date_head")}
          </div>

          {/* Item Category */}
          <div className="col-span-1">
            {renderLabel("Item Category", "item_category_head")}
            <Select
              value={formData.item_category_head || ""}
              onValueChange={val => handleSelectChange(val, "item_category_head")}
              disabled={itemCategoryDropdown?.length > 0 ? false : true}
            >
              <SelectTrigger className={getInputClass("item_category_head")}>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {itemCategoryDropdown?.map((item, i) => (
                    <SelectItem key={i} value={item.name}>
                      {item.item_code} - {item.item_name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {renderError("item_category_head")}
          </div>

          {/* Material Group */}
          <div className="col-span-1">
            {renderLabel("Material Group", "material_group_head")}
            <Select
              value={formData.material_group_head || ""}
              onValueChange={val => handleSelectChange(val, "material_group_head")}
            >
              <SelectTrigger className={getInputClass("material_group_head")}>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {MaterialGroupDropdown?.map((item, i) => (
                    <SelectItem key={i} value={item.material_group_name}>
                      {item.material_group_name} - {item.material_group_description}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {renderError("material_group_head")}
          </div>
          {/* UOM */}
          <div className="col-span-1">
            {renderLabel("UOM", "uom_head")}
            <Select
              value={formData.uom_head || ""}
              onValueChange={val => handleSelectChange(val, "uom_head")}
            >
              <SelectTrigger className={getInputClass("uom_head")}>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Dropdown?.uom_master?.map((item, i) => (
                    <SelectItem key={i} value={item.uom_code}>
                      {item.uom_code} - {item.uom}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {renderError("uom_head")}
          </div>

          <div className="col-span-1">
            {renderLabel("Cost Center", "cost_center_head")}
            <Select
              value={formData.cost_center_head || ""}
              onValueChange={val => handleSelectChange(val, "cost_center_head")}
            >
              <SelectTrigger className={getInputClass("cost_center_head")}>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {CostCenterDropdown?.map((item, i) => (
                    <SelectItem key={i} value={item.cost_center_name}>
                      {item.cost_center_code} - {item.cost_center_name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {renderError("cost_center_head")}
          </div>

          {/* Valuation Area */}
          <div className="col-span-1">
            {renderLabel("Valuation Area", "valuation_area_head")}
            <Select
              value={formData.valuation_area_head || ""}
              onValueChange={val => handleSelectChange(val, "valuation_area_head")}
            >
              <SelectTrigger className={getInputClass("valuation_area_head")}>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {ValuationClassDropdown?.map((item, i) => (
                    <SelectItem key={i} value={item.name}>
                      {item.valuation_class_code} - {item.valuation_class_name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {renderError("valuation_area_head")}
          </div>

          {/* Purchase Organisation */}
          <div className="col-span-1">
            {renderLabel("Purchase Organisation", "purchase_organisation_head")}
            <Select
              value={formData.purchase_organisation_head || ""}
              onValueChange={val => handleSelectChange(val, "purchase_organisation_head")}
            >
              <SelectTrigger className={getInputClass("purchase_organisation_head")}>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {PurchaseOrgDropdown?.map((item, i) => (
                    <SelectItem key={i} value={item.purchase_organization_name}>
                      {item.purchase_organization_code} - {item.purchase_organization_name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {renderError("purchase_organisation_head")}
          </div>

          {/* Short Text */}
          <div className="col-span-1">
            {renderLabel("Short Text", "short_text_head")}
            <Input
              name="short_text_head"
              type="text"
              className={getInputClass("short_text_head")}
              value={formData.short_text_head || ""}
              onChange={handleFieldChange}
              disabled={disabledFields.includes("short_text_head")}
            />
            {renderError("short_text_head")}
          </div>

          {/* Quantity */}
          <div className="col-span-1">
            {renderLabel("Quantity", "quantity_head")}
            <Input
              name="quantity_head"
              type="number"
              className={getInputClass("quantity_head")}
              value={formData.quantity_head || ""}
              onChange={handleFieldChange}
              disabled={disabledFields.includes("quantity_head")}
            />
            {renderError("quantity_head")}
          </div>

          <div className="col-span-1">
            {renderLabel("GL Account Number", "gl_account_number_head")}
            <Select
              value={formData.gl_account_number_head || ""}
              onValueChange={val => handleSelectChange(val, "gl_account_number_head")}
            >
              <SelectTrigger className={getInputClass("gl_account_number_head")}>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {GLAccountDropdwon?.map((item, i) => (
                    <SelectItem key={i} value={item.gl_account_name}>
                      {item.gl_account_code} - ${item.gl_account_name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {renderError("gl_account_number_head")}
          </div>

          {/* Tracking ID */}
          <div className="col-span-1">
            {renderLabel("Tracking ID", "tracking_id_head")}
            <Input
              name="tracking_id_head"
              type="text"
              className={getInputClass("tracking_id_head")}
              value={formData.tracking_id_head || ""}
              onChange={handleFieldChange}
              disabled={disabledFields.includes("tracking_id_head")}
            />
            {renderError("tracking_id_head")}
          </div>

          {/* Desired Vendor */}
          <div className="col-span-1">
            {renderLabel("Desired Vendor", "desired_vendor_head")}
            <Input
              name="desired_vendor_head"
              type="text"
              className={getInputClass("desired_vendor_head")}
              value={formData.desired_vendor_head || ""}
              onChange={handleFieldChange}
              disabled={disabledFields.includes("desired_vendor_head")}
            />
            {renderError("desired_vendor_head")}
          </div>

          {/* Fixed Value */}
          <div className="col-span-1">
            {renderLabel("Fixed Value", "fixed_value_head")}
            <Input
              name="fixed_value_head"
              type="text"
              className={getInputClass("fixed_value_head")}
              value={formData.fixed_value_head || ""}
              onChange={handleFieldChange}
              disabled={disabledFields.includes("fixed_value_head")}
            />
            {renderError("fixed_value_head")}
          </div>

          {/* Spit */}
          <div className="col-span-1">
            {renderLabel("Spit", "spit_head")}
            <Input
              name="spit_head"
              type="text"
              className={getInputClass("spit_head")}
              value={formData.spit_head || ""}
              onChange={handleFieldChange}
              disabled={disabledFields.includes("spit_head")}
            />
            {renderError("spit_head")}
          </div>

          {/* Agreement */}
          <div className="col-span-1">
            {renderLabel("Agreement", "agreement_head")}
            <Input
              name="agreement_head"
              type="text"
              className={getInputClass("agreement_head")}
              value={formData.agreement_head || ""}
              onChange={handleFieldChange}
              disabled={disabledFields.includes("agreement_head")}
            />
            {renderError("agreement_head")}
          </div>

          {/* Item Of */}
          <div className="col-span-1">
            {renderLabel("Item Of...", "item_of_head")}
            <Input
              name="item_of_head"
              type="text"
              className={getInputClass("item_of_head")}
              value={formData.item_of_head || ""}
              onChange={handleFieldChange}
              disabled={disabledFields.includes("item_of_head")}
            />
            {renderError("item_of_head")}
          </div>

          {/* MPN Number */}
          <div className="col-span-1">
            {renderLabel("MPN Number", "mpn_number_head")}
            <Input
              name="mpn_number_head"
              type="text"
              className={getInputClass("mpn_number_head")}
              value={formData.mpn_number_head || ""}
              onChange={handleFieldChange}
              disabled={disabledFields.includes("mpn_number_head")}
            />
            {renderError("mpn_number_head")}
          </div>

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

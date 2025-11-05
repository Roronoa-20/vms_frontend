
'use client';

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectGroup, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { SubheadField } from '@/src/types/PurchaseRequisitionType';
import API_END_POINTS from '@/src/services/apiEndPoints';
import { AxiosResponse } from 'axios';
import requestWrapper from '@/src/services/apiCall';
import { CostCenter, Currency, GLAccountNumber, UOMMaster } from '@/src/types/PurchaseRequestType';
import PopUp from '../PopUp';
import SearchSelectComponent from '../../common/SelectSearchComponent';
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
  pur_req: string;
  selectedMainItemId: string;
  currentItemNumber: number;
  defaultData: SubheadField | null;
  editAction: boolean;
  company: string;
}


const SubItemModal: React.FC<SubItemModalProps> = ({
  isOpen, onClose, fetchTableData, Dropdown, pur_req, selectedMainItemId, currentItemNumber, defaultData, editAction, company
}) => {
  const emptyFormData: SubheadField = {
    row_id: "",
    doc_name: "",
    name: "",
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
  const [CostCenterDropdown, setCostCenterDropdown] = useState<CostCenter[]>()
  const [CostCenter, setCostCenter] = useState<string>("");
  const [GLAccountDropdown, setGLAccountDropdown] = useState<GLAccountNumber[]>()
  const [GLAccount, setGLAccount] = useState<string>("");

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

  useEffect(() => {
    if (defaultData?.cost_center_subhead) {
      setCostCenter(defaultData?.cost_center_subhead);
    }
    if (defaultData?.gl_account_number_subhead) {
      setGLAccount(defaultData?.gl_account_number_subhead);
    }
  }, [defaultData]);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const field = name as keyof SubheadField;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (value: string, field: keyof SubheadField) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    "cost_center_subhead", "gl_account_number_subhead"
  ];

  const handleSubmit = async () => {
    try {
      const newErrors: Record<keyof SubheadField, boolean> = {} as any;
      let isValid = true;

      requiredFields.forEach((field) => {
        if (!formData[field] || formData[field]?.toString().trim() === "") {
          newErrors[field] = true;
          isValid = false;
        }
      });

      setErrors(newErrors);
      if (!isValid) {
        alert("Please fill all mandatory fields — including Cost Center and GL Account Number.");
        return;
      }

      let url = API_END_POINTS?.PRTableSubHeadSubmitData;
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
    }
  };

  const fetchCostCenterData = async (query?: string): Promise<[]> => {
    console.log(query)
    const baseUrl = API_END_POINTS?.CostCenterSearchApi;
    let url = baseUrl;
    // Only include filters if company exists
    const filters = [];
    if (company) {
      filters.push({ "company_code": company });
    }
    if (filters.length > 0) {
      url += `?filters=${encodeURIComponent(JSON.stringify(filters))}`;
    }

    // Add search_term if query exists
    if (query) {
      url += `${url.includes('?') ? '&' : '?'}search_term=${encodeURIComponent(query)}`;
    }
    const response: AxiosResponse = await requestWrapper({ url: url, method: "GET" });
    if (response?.status == 200) {
      setCostCenterDropdown(response?.data?.message?.data)
      return response.data.message.data
    } else {
      alert("error");
    }
    return []
  }

  const fetchGLNumberData = async (query?: string): Promise<[]> => {
    const baseUrl = API_END_POINTS?.GLAccountSearchApi;
    let url = baseUrl;
    // Only include filters if company exists
    const filters = [];
    if (company) {
      filters.push({ "company": company });
    }
    if (filters.length > 0) {
      url += `?filters=${encodeURIComponent(JSON.stringify(filters))}`;
    }

    // Add search_term if query exists
    if (query) {
      url += `${url.includes('?') ? '&' : '?'}search_term=${encodeURIComponent(query)}`;
    }
    const response: AxiosResponse = await requestWrapper({ url: url, method: "GET" });
    if (response?.status == 200) {
      setGLAccountDropdown(response?.data?.message?.data)
      return response.data.message.data
    } else {
      alert("error");
    }
    return []
  }

  useEffect(() => {
    if (GLAccount) {
      fetchGLNumberData(GLAccount);
    }
    if (CostCenter) {
      fetchCostCenterData(CostCenter);
    }
  }, [
    GLAccount,
    CostCenter,
  ]);

  const textFields: { name: keyof SubheadField; label: string; type?: string }[] = [
    { name: "item_number_of_purchase_requisition_subhead", label: "Item Number of Purchase Requisition" },
    { name: "service_number_subhead", label: "Service Number" },
    { name: "short_text_subhead", label: "Short Text" },
    { name: "quantity_subhead", label: "Quantity", type: "number" },
    { name: "gross_price_subhead", label: "Gross Price", type: "number" },
    { name: "service_type_subhead", label: "Service Type" },
    { name: "net_value_subhead", label: "Net Value", type: "number" },
  ];

  return (
    <PopUp headerText='Add Sub Item' classname='overflow-y-scroll md:max-w-[1000px] md:max-h-[600px]' handleClose={onClose} isSubmit={true} Submitbutton={handleSubmit}>
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

        {/* <div className="col-span-1">
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
        </div> */}

        <div className='w-full'>
          <h1 className="text-[14px] font-normal text-[#626973] pb-2 flex items-center gap-1 ">
            {"Cost Center"}
            {/* {error && <span className="text-red-600">*</span>} */}
            <span className="text-red-600">*</span>
          </h1>
          <SearchSelectComponent
            setData={(value) => {
              setCostCenter(value ?? "");
              setFormData(prev => ({ ...prev, cost_center_subhead: value ?? "" }));
            }}
            data={CostCenter ?? ""}
            getLabel={(item) => `${item?.cost_center_code} - ${item?.cost_center_name}`}
            getValue={(item) => item?.name}
            dropdown={CostCenterDropdown ? CostCenterDropdown : []}
            searchApi={fetchCostCenterData}
            setDropdown={setCostCenterDropdown}
            placeholder='Select Cost Center'
          />
        </div>

        {/* <div className="col-span-1">
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
        </div> */}

        <div className='w-full'>
          <h1 className="text-[14px] font-normal text-[#626973] pb-2 flex items-center gap-1 ">
            {"GL Account Number"}
            {/* {error && <span className="text-red-600">*</span>} */}
            <span className="text-red-600">*</span>
          </h1>
          <SearchSelectComponent
            setData={(value) => {
              setGLAccount(value ?? "");
              setFormData(prev => ({ ...prev, gl_account_number_subhead: value ?? "" }));
            }}
            data={GLAccount ?? ""}
            getLabel={(item) => `${item?.gl_account_code} - ${item?.gl_account_name}`}
            getValue={(item) => item?.name}
            dropdown={GLAccountDropdown ? GLAccountDropdown : []}
            searchApi={fetchGLNumberData}
            setDropdown={setGLAccountDropdown}
            placeholder='Select GL Account Number'
          />
        </div>
      </div>
    </PopUp >
  );
};

export default SubItemModal;

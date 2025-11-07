// components/EditNBModal.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
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
import { AccountAssignmentCategory, CostCenter, GLAccountNumber, ItemCategoryMaster, MaterialCode, MaterialGroupMaster, Plant, ProfitCenter, PurchaseGroup, StorageLocation, StoreLocation, UOMMaster, ValuationArea, ValuationClass } from '@/src/types/PurchaseRequestType';
import SearchSelectComponent from '../../common/SelectSearchComponent';
import PopUp from '../PopUp';
import { useAuth } from '@/src/context/AuthContext';

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
  ProfitCenterDropdown: ProfitCenter[]
  accountAssigmentDropdown: AccountAssignmentCategory[]
  itemCategoryDropdown: ItemCategoryMaster[]
  plant: string
  company: string
  purchase_group: string
}

const EditNBModal: React.FC<EditNBModalProps> = ({
  isOpen,
  onClose,
  fetchTableData,
  Dropdown,
  defaultData,
  pur_req,
  PurchaseGroupDropdown,
  ProfitCenterDropdown, accountAssigmentDropdown, itemCategoryDropdown, plant, company, purchase_group
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [MaterialCodeDropdown, setMaterialCodeDropdown] = useState<MaterialCode[]>()
  const [PlantCodeDropdown, setPlantCodeDropdown] = useState<Plant[]>()
  const [materialCode, setMaterialCode] = useState<string>("");
  const [plantCode, setPlantCode] = useState<string>("");
  const [requiredField, setRequiredField] = useState<Record<string, any>>({});
  const [GLAccountDropdown, setGLAccountDropdown] = useState<GLAccountNumber[]>()
  const [GLAccount, setGLAccount] = useState<string>("");
  const [StoreLocationDropdown, setStoreLocationDropdown] = useState<StorageLocation[]>()
  const [storeLocation, setStoreLocation] = useState<string>("");
  const [MaterialGroupDropdown, setMaterialGroupDropdown] = useState<MaterialGroupMaster[]>()
  const [MaterialGroup, setMaterialGroup] = useState<string>("");
  const [CostCenterDropdown, setCostCenterDropdown] = useState<CostCenter[]>()
  const [CostCenter, setCostCenter] = useState<string>("");
  const [ValuationAreaDropdown, setValuationAreaDropdown] = useState<ValuationClass[]>()
  const [ValuationArea, setValuationArea] = useState<string>("");
  const { designation } = useAuth();
  const isPurchaseTeam = designation === "Purchase Team";
  useEffect(() => {
    if (isOpen) {
      setFormData(defaultData || {});
      setErrors({});
    }
  }, [isOpen, defaultData]);

  useEffect(() => {
    if (defaultData?.plant_head) {
      setPlantCode(defaultData?.plant_head);
    }
    if (defaultData?.store_location_head) {
      setStoreLocation(defaultData?.store_location_head);
    }
    if (defaultData?.cost_center_head) {
      setCostCenter(defaultData?.cost_center_head);
    }
    if (defaultData?.material_group_head) {
      setMaterialGroup(defaultData?.material_group_head);
    }
    if (defaultData?.material_code_head) {
      setMaterialCode(defaultData?.material_code_head);
    }
    if (defaultData?.gl_account_number_head) {
      setGLAccount(defaultData?.gl_account_number_head);
    }
    if (defaultData?.valuation_area_head) {
      setValuationArea(defaultData?.valuation_area_head);
    }
  }, [defaultData]);
  console.log(PlantCodeDropdown, "PlantCodeDropdown PlantCodeDropdownPlantCodeDropdownPlantCodeDropdown")
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

  const fetchMaterialCodeData = async (query?: string): Promise<[]> => {
    console.log(query)
    const baseUrl = API_END_POINTS?.MaterialCodeSearchApi;
    let url = baseUrl;

    // Only include filters if company exists
    const filters = [];

    if (company) {
      filters.push({ company });
    }

    if (formData?.plant_head) {
      filters.push({ plant: formData.plant_head });
    }

    if (filters.length > 0) {
      url += `?filters=${encodeURIComponent(JSON.stringify(filters))}`;
    }

    console.log(filters, "filters");

    // Add search_term if query exists
    if (query) {
      url += `${url.includes('?') ? '&' : '?'}search_term=${encodeURIComponent(query)}`;
    }

    const response: AxiosResponse = await requestWrapper({ url: url, method: "GET" });
    if (response?.status == 200) {
      setMaterialCodeDropdown(response?.data?.message?.data)
      return response.data.message.data
    } else {
      alert("error");
    }
    return []
  };
  
  const fetchPlantCodeData = async (query?: string): Promise<[]> => {
    console.log(query)
    const baseUrl = API_END_POINTS?.FetchPlantSearchApi;
    let url = baseUrl;

    // Add search_term if query exists
    if (query) {
      url += `${url.includes('?') ? '&' : '?'}search_term=${encodeURIComponent(query)}`;
    }

    const response: AxiosResponse = await requestWrapper({ url: url, method: "GET" });
    if (response?.status == 200) {
      console.log(response?.data?.message?.data, "response?.data?.message?.data plant")
      setPlantCodeDropdown(response?.data?.message?.data)
      return response.data.message.data
    } else {
      alert("error");
    }
    return []
  }
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
    if (!formData.account_assignment_category_head) {
      alert("Select Account Assignment Category")
      return
    }
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      // alert(JSON.stringify(validationErrors));
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
    setFormData((prev) => ({ ...prev, purchase_requisition_date_head: formData?.purchase_requisition_date_head ? formData?.purchase_requisition_date_head : today, plant_head: plant, purchase_group_head: purchase_group }));
  }, [today, formData?.purchase_requisition_date_head, purchase_group]);

  useEffect(() => {
    fetchMaterialCodeData();
  }, [formData?.company_code_area_head, formData?.plant_head]);
  const fetchGLNumberData = async (query?: string): Promise<[]> => {
    console.log(query)
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
  const fetchStoreLocationData = async (query?: string): Promise<[]> => {
    console.log(query)
    const baseUrl = API_END_POINTS?.StorageLocationSearchApi;

    // Determine which plant name to use
    const plant_name = plantCode ?? plant;

    // Build query parameters
    const params = new URLSearchParams();

    if (plant_name) params.append("plant_name", plant_name);
    if (query) params.append("search_term", query);

    const url = `${baseUrl}?${params.toString()}`;

    const response: AxiosResponse = await requestWrapper({ url: url, method: "GET" });
    if (response?.status == 200) {
      console.log(response?.data?.message?.data, "response?.data?.message?.data store loaction")
      setStoreLocationDropdown(response?.data?.message?.data)
      return response.data.message.data
    } else {
      alert("error");
    }
    return []
  }
  const fetchMaterialGroupData = async (query?: string): Promise<[]> => {
    console.log(query)
    const baseUrl = API_END_POINTS?.MaterialGroupSearchApi;
    let url = baseUrl;
    // Only include filters if company exists
    console.log(company, "company")
    const filters = [];
    if (company) {
      filters.push({ "material_group_company": company });
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
      setMaterialGroupDropdown(response?.data?.message?.data)
      return response.data.message.data
    } else {
      alert("error");
    }
    return []
  }
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
  const fetchValuationAreaData = async (query?: string): Promise<[]> => {
    console.log(query)
    const baseUrl = API_END_POINTS?.ValuationAreaSearchApi;
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
      setValuationAreaDropdown(response?.data?.message?.data)
      return response.data.message.data
    } else {
      alert("error");
    }
    return []
  }
  useEffect(() => {
    if (plantCode) {
      fetchStoreLocationData();
    }
  }, [plantCode, formData?.plant_head]);

  useEffect(() => {
    if (plantCode) {
      fetchPlantCodeData(plantCode);
    }
    if (GLAccount) {
      fetchGLNumberData(GLAccount);
    }
    if (CostCenter) {
      fetchCostCenterData(CostCenter);
    }
    if (ValuationArea) {
      fetchValuationAreaData(ValuationArea);
    }
    if (MaterialGroup) {
      fetchMaterialGroupData(MaterialGroup);
    }
    if (storeLocation) {
      fetchStoreLocationData(storeLocation);
    }
  }, [
    plantCode,
    GLAccount,
    CostCenter,
    ValuationArea,
    MaterialGroup,
    storeLocation,
  ]);

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
    getLabel: (item: T) => string,
    disabled?: boolean
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
          disabled={disabled}
        >
          <SelectTrigger className={errors[name as keyof typeof errors] ? 'border border-red-600' : ''}>
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
        {renderError(name)}
      </div>
    );
  };
  return (
    <PopUp headerText='Purchase Request Items' classname='overflow-y-scroll md:max-w-[1000px] md:max-h-[600px]' handleClose={onClose} isSubmit={true} Submitbutton={handleSubmit}>
      <div className="grid grid-cols-3 gap-6 pt-2">
        {renderInput('item_number_of_purchase_requisition_head', 'Item Number of Purchase Requisition', 'text', { disabled: true })}
        {renderInput('purchase_requisition_date_head', 'Purchase Requisition Date', 'date', { disabled: true })}
        {renderSelect(
          'purchase_group_head',
          'Purchase Group',
          PurchaseGroupDropdown,
          (item) => item.name,
          (item) => `${item.purchase_group_code} - ${item.purchase_group_name}`,
          true
        )}
        <div className='w-full'>
          <h1 className="text-[14px] font-normal text-[#626973] pb-1 flex items-center gap-1 ">
            {"Select Plant"}
            {/* {error && <span className="text-red-600">*</span>} */}
          </h1>
          <SearchSelectComponent
            setData={(value) => {
              setPlantCode(value ?? "");
              setFormData(prev => ({ ...prev, plant_head: value ?? "" }));
            }}
            data={plantCode ?? ""}
            getLabel={(item) => `${item?.plant_code} - ${item?.plant_name}`}
            getValue={(item) => item?.name}
            dropdown={PlantCodeDropdown ? PlantCodeDropdown : []}
            searchApi={fetchPlantCodeData}
            setDropdown={setPlantCodeDropdown}
            placeholder='Select Plant Code'
          />
          {renderError("plant_head")}
        </div>
        {renderSelect(
          'account_assignment_category_head',
          'Account Assignment Category',
          accountAssigmentDropdown,
          (item) => item.name,
          (item) => `${item.account_assignment_category_code} - ${item.account_assignment_category_name}`
        )}
        {/* {renderSelect(
          'store_location_head',
          'Store Location',
          StorageLocationDropdown,
          (item) => item.name,
          (item) => `${item.storage_name}`
        )} */}
        <div className='w-full'>
          <h1 className="text-[14px] font-normal text-[#626973] pb-2 flex items-center gap-1 ">
            {"Select Store Location"}
            {/* {error && <span className="text-red-600">*</span>} */}
          </h1>
          <SearchSelectComponent
            setData={(value) => {
              setStoreLocation(value ?? "");
              setFormData(prev => ({ ...prev, store_location_head: value ?? "" }));
            }}
            data={storeLocation ?? ""}
            getLabel={(item) => `${item?.storage_name} - ${item?.storage_location_name}`}
            getValue={(item) => item?.name}
            dropdown={StoreLocationDropdown ? StoreLocationDropdown : []}
            searchApi={fetchStoreLocationData}
            setDropdown={setStoreLocationDropdown}
            placeholder='Select Store Location'
          />
          {renderError("store_location_head")}
        </div>

        {renderInput('delivery_date_head', 'Delivery Date', 'date')}
        {renderSelect(
          'item_category_head',
          'Item Category',
          itemCategoryDropdown,
          (item) => item.name,
          (item) => `${item.item_code} - ${item.item_name}`,
          itemCategoryDropdown?.length > 0 ? false : true
        )}
        {/* 
        {renderSelect(
          'material_group_head',
          'Material Group',
          MaterialGroupDropdown,
          (item) => item.name,
          (item) => `${item.material_group_name} - ${item.material_group_description}`
        )} */}
        <div className='w-full'>
          <h1 className="text-[14px] font-normal text-[#626973] pb-2 flex items-center gap-1 ">
            {"Material Group"}
            {/* {error && <span className="text-red-600">*</span>} */}
          </h1>
          <SearchSelectComponent
            setData={(value) => {
              setMaterialGroup(value ?? "");
              setFormData(prev => ({ ...prev, material_group_head: value ?? "" }));
            }}
            data={MaterialGroup ?? ""}
            getLabel={(item) => `${item?.material_group_name} - ${item?.material_group_description}`}
            getValue={(item) => item?.name}
            dropdown={MaterialGroupDropdown ? MaterialGroupDropdown : []}
            searchApi={fetchMaterialGroupData}
            setDropdown={setMaterialGroupDropdown}
            placeholder='Select Material Group'
          />
          {renderError("material_group_head")}
        </div>

        {renderSelect(
          'uom_head',
          'UOM',
          Dropdown.uom_master,
          (item) => item.name,
          (item) => `${item.uom_code} - ${item.uom}`
        )}
        {renderInput('quantity_head', 'Quantity')}
        {/* {renderSelect(
          'cost_center_head',
          'Cost Center',
          CostCenterDropdown,
          (item) => item.name,
          (item) => `${item.cost_center_code} - ${item.cost_center_name}`,
          formData.account_assignment_category_head == "A" && formData.purchase_requisition_type == "NB" ? true : false
        )} */}
        <div className='w-full'>
          <h1 className="text-[14px] font-normal text-[#626973] pb-2 flex items-center gap-1 ">
            {"Cost Center"}
            {/* {error && <span className="text-red-600">*</span>} */}
          </h1>
          <SearchSelectComponent
            setData={(value) => {
              setCostCenter(value ?? "");
              setFormData(prev => ({ ...prev, cost_center_head: value ?? "" }));
            }}
            data={CostCenter ?? ""}
            getLabel={(item) => `${item?.cost_center_code} - ${item?.cost_center_name}`}
            getValue={(item) => item?.name}
            dropdown={CostCenterDropdown ? CostCenterDropdown : []}
            searchApi={fetchCostCenterData}
            setDropdown={setCostCenterDropdown}
            placeholder='Select Cost Center'
          />
          {renderError("cost_center_head")}
        </div>

        <div className='w-full'>
          <h1 className="text-[14px] font-normal text-[#626973] pb-1 flex items-center gap-1 ">
            {"Select Material Code"}
            {/* {error && <span className="text-red-600">*</span>} */}
          </h1>
          <SearchSelectComponent
            setData={(value) => {
              setMaterialCode(value ?? "");
              const selectedMaterial = MaterialCodeDropdown?.find(
                (item) => item.name === value
              );
              setFormData((prev) => ({
                ...prev,
                material_code_head: value ?? "",
                profit_ctr_head: selectedMaterial?.profit_center ?? "",
                valuation_area_head: selectedMaterial?.valuation_class ?? "",
              }));
            }}

            data={materialCode ?? ""}
            getLabel={(item) => item.material_code}
            getValue={(item) => item?.name}
            dropdown={MaterialCodeDropdown ? MaterialCodeDropdown : []}
            searchApi={fetchMaterialCodeData}
            setDropdown={setMaterialCodeDropdown}
            placeholder='Select Material Code'
          />
          {renderError("material_code_head")}
        </div>
        {renderInput('profit_ctr_head', 'Profit Center')}
        {renderInput('valuation_area_head', 'Valuation Area')}
        {renderInput('main_asset_no_head', 'Main Asset No')}
        {renderInput('asset_subnumber_head', 'Asset Subnumber')}

        {/* {renderSelect(
          'profit_ctr_head',
          'Profit Center',
          ProfitCenterDropdown,
          (item) => item.name,
          (item) => `${item.profit_center_code} - ${item.profit_center_name}`
        )} */}
        {/* {renderSelect(
          'valuation_area_head',
          'Valuation Area',
          ValuationClassDropdown,
          (item) => item.name,
          (item) => `${item.valuation_class_code} - ${item.valuation_class_name}`
        )} */}
        {/* <div className='w-full'>
          <h1 className="text-[14px] font-normal text-[#626973] pb-2 flex items-center gap-1 ">
            {"Valuation Area"}
          </h1>
          <SearchSelectComponent
            setData={(value) => {
              setValuationArea(value ?? "");
              setFormData(prev => ({ ...prev, valuation_area_head: value ?? "" }));
            }}
            data={ValuationArea ?? ""}
            getLabel={(item) => `${item?.valuation_class_code} - ${item?.valuation_class_name}`}
            getValue={(item) => item?.name}
            dropdown={ValuationAreaDropdown ? ValuationAreaDropdown : []}
            searchApi={fetchValuationAreaData}
            setDropdown={setValuationAreaDropdown}
            placeholder='Select Valuation Area'
          />
          {renderError("valuation_area_head")}
        </div> */}

        {renderInput('short_text_head', 'Description')}
        {renderInput('price_of_purchase_requisition_head', 'Price Of Purchase Requisition')}

        {/* {renderSelect(
          'gl_account_number_head',
          'GL Account Number',
          GLAccountDropdwon,
          (item) => item.name,
          (item) => `${item.gl_account_code} - ${item.gl_account_name}`,
          formData.account_assignment_category_head == "A" && formData.purchase_requisition_type == "NB" ? true : false
        )} */}

        <div className='w-full'>
          <h1 className="text-[14px] font-normal text-[#626973] pb-2 flex items-center gap-1 ">
            {"GL Account Number"}
            {/* {error && <span className="text-red-600">*</span>} */}
          </h1>
          <SearchSelectComponent
            setData={(value) => {
              setGLAccount(value ?? "");
              setFormData(prev => ({ ...prev, gl_account_number_head: value ?? "" }));
            }}
            data={GLAccount ?? ""}
            getLabel={(item) => `${item?.gl_account_code} - ${item?.gl_account_name}`}
            getValue={(item) => item?.name}
            dropdown={GLAccountDropdown ? GLAccountDropdown : []}
            searchApi={fetchGLNumberData}
            setDropdown={setGLAccountDropdown}
            placeholder='Select GL Account Number'
            disabled={formData.account_assignment_category_head == "A" && formData.purchase_requisition_type == "NB" ? true : false}
          />
          {renderError("gl_account_number_head")}
        </div>
      </div>

    </PopUp>
  );
};

export default EditNBModal;
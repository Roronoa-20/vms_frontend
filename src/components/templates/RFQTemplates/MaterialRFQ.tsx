
import React, { useState, useEffect } from 'react'
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
import { AccountAssignmentCategory, Company, CostCenter, Country, Currency, DestinationPort, GLAccountNumber, IncoTerms, ItemCategoryMaster, MaterialCode, MaterialGroupMaster, ModeOfShipment, PackageType, PortCode, PortOfLoading, ProductCategory, ProfitCenter, PurchaseGroup, PurchaseOrganisation, RFQType, ShipmentType, StoreLocation, UOMMaster, ValuationArea } from '@/src/types/PurchaseRequestType';
import VendorTable from '../../molecules/rfq/VendorTable';
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'
import useDebounce from '@/src/hooks/useDebounce';
import { SAPPRData, VendorApiResponse, VendorSelectType } from '@/src/types/RFQtype';
import Pagination from '../../molecules/Pagination';
import PRMaterialsManager, { SelectedMaterial } from './PRMaterialsManager';
import NewVendorTable from '../../molecules/rfq/NewVendorTable';
import AddNewVendorRFQDialog from '../../molecules/AddNewVendorRFQDialog';
import { useRouter } from 'next/navigation';
import MaterialRFQFormFields from './MaterialRFQFormFields';


export interface DropdownDataMaterial {
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
  company: Company[];
  product_category: ProductCategory[];
  mode_of_shipment: ModeOfShipment[];
  destination_port: DestinationPort[];
  country_master: Country[];
  port_master: PortCode[];
  port_of_loading: PortOfLoading[];
  incoterm_master: IncoTerms[];
  package_type: PackageType[];
  rfq_type: RFQType[];
  purchase_organisation: PurchaseOrganisation[];
  currency_master: Currency[];
  shipment_type: ShipmentType[]
}
type Props = {
  Dropdown: DropdownDataMaterial;
  pr_codes?: string | null;
  pr_type?: string | null;
};

export interface newVendorTable {
  refno: string,
  vendor_name: string,
  vendor_code: string,
  service_provider_type: string,
  office_email_primary: string,
  mobile_number: string,
  country: string
  pan_number: string
  gst_number: string
}


const MaterialRFQ = ({ Dropdown, pr_codes, pr_type }: Props) => {
  const [formData, setFormData] = useState<Record<string, string | null>>({ rfq_type: "Material Vendor" });
  const [vendorSearchName, setVendorSearchName] = useState('')
  const [currentVendorPage, setVendorCurrentPage] = useState<number>(1);
  const [VendorList, setVendorList] = useState<VendorApiResponse>();
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<VendorSelectType>(
    {
      vendors: []
    }
  );
  const [availablePRs, setAvailablePRs] = useState<SAPPRData[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<string | null>(null)
  const [selectedMaterials, setSelectedMaterials] = useState<SelectedMaterial[]>([])
  const debouncedDoctorSearchName = useDebounce(vendorSearchName, 500);
  const [files, setFiles] = useState<Record<string, File | null>>({});

  const [isDialog, setIsDialog] = useState<boolean>(false);
  const [newVendorTable, setNewVendorTable] = useState<newVendorTable[]>([])
  const router = useRouter()
  useEffect(() => {
    const fetchVendorTableData = async (rfq_type: string) => {
      console.log(rfq_type, "rfq_type in table code")
      const url = `${API_END_POINTS?.fetchVendorListBasedOnRFQType}?rfq_type=${rfq_type}&page_no=${currentVendorPage}&vendor_name=${debouncedDoctorSearchName}`
      const response: AxiosResponse = await requestWrapper({ url: url, method: "GET" });
      if (response?.status == 200) {
        setVendorList(response.data.message)
        console.log(response, "response of vendor table data")
      } else {
        alert("error");
      }
    }
    fetchVendorTableData(formData?.rfq_type ? formData?.rfq_type : "Material Vendor");
  }, [currentVendorPage, debouncedDoctorSearchName]);

  useEffect(() => {
    const fetchPRDropdown = async (rfq_type: string) => {
      console.log(rfq_type, "rfq_type in table code")
      const url = `${API_END_POINTS?.fetchPRDropdown}?rfq_type=${rfq_type}`
      const response: AxiosResponse = await requestWrapper({ url: url, method: "GET" });
      if (response?.status == 200) {
        setAvailablePRs(response.data.message.pr_numbers)
        console.log(response, "response of pr dropdown")
      } else {
        alert("error");
      }
    }
    fetchPRDropdown(formData?.rfq_type ? formData?.rfq_type : "Material Vendor");
  }, []);

  useEffect(() => {
    if (pr_codes) {
      console.log("Auto-filling PR number with:", pr_codes);
      setFormData((prev) => ({
        ...prev,
        pr_number: pr_codes
      }));
    }
  }, [pr_codes ?? null]);


  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleVendorSearch = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setVendorCurrentPage(1)
    setVendorSearchName(e.target.value);
  }
  const handleSelectChange = (value: string, field: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderInput = (name: string, label: string, type = 'text') => (
    <div className="col-span-1">
      <h1 className="text-[12px] font-normal text-[#626973] pb-3">
        {label}
        {/* {errors[name] && <span className="text-red-600 ml-1">*</span>} */}
      </h1>
      <Input
        name={name}
        type={type}
        // className={errors[name] ? 'border-red-600' : 'border-neutral-200'}
        className={'border-neutral-200'}
        value={formData[name] || ''}
        onChange={handleFieldChange}
      />
    </div>
  );

  const renderFileInput = (name: string, label: string) => (
    <div className="col-span-1">
      <h1 className="text-[12px] font-normal text-[#626973] pb-3">
        {label}
      </h1>
      <Input
        name={name}
        type="file"
        className="border-neutral-200"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          setFiles((prev) => ({ ...prev, [name]: file }));
        }}
      />
    </div>
  );


  const renderSelect = <T,>(
    name: string,
    label: string,
    options: T[],
    getValue: (item: T) => string,
    getLabel: (item: T) => string,
    isDisabled?: boolean,
  ) => (
    <div className="col-span-1">
      <h1 className="text-[12px] font-normal text-[#626973] pb-3">
        {label}
        {/* {errors[name as keyof typeof errors] && (
                    <span className="text-red-600 ml-1">*</span>
                )} */}
      </h1>
      <Select
        value={formData[name] ?? ""}
        onValueChange={(value) => handleSelectChange(value, name)}
        disabled={isDisabled}
      >
        {/* className={errors[name as keyof typeof errors] ? 'border border-red-600' : ''} */}
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
  const handleSubmit = async () => {
    console.log(selectedMaterials, "selectedMaterials")
    console.log({ ...formData, vendors: selectedRows.vendors, pr_items: selectedMaterials }, "submit data")
    const formdata = new FormData();
    const fullData = {
      ...formData,
      vendors: selectedRows.vendors,
      pr_items: selectedMaterials,
      // non_onboarded_vendors: nonOnboardedVendors, 
    };

    console.log(fullData, "submit data ------------------------------");

    // Append JSON data as a string under key 'data'
    formdata.append('data', JSON.stringify(fullData));

    // Append file only if exists
    if (files && files['file']) {
      formdata.append('file', files['file']);
    }
    const url = `${API_END_POINTS?.CreateMaterialRFQ}`;
    const response: AxiosResponse = await requestWrapper({ url: url, data: formdata, method: "POST" });
    if (response?.status == 200) {
      console.log(response, "response")
      alert("Submit Successfull");
      router.push("/dashboard")
    } else {
      alert("error");
    }
  }
  const setPRItems = async (materials: SelectedMaterial[]) => {
    setSelectedMaterials(materials)
  }

  const handleOpen = () => {
    setIsDialog(true);
  }

  const handleClose = () => {
    setIsDialog(false);
  }

  return (
    <div className='bg-white h-full w-full pb-6'>
      <div className='flex justify-between items-center pr-4'>
        <h1 className='font-bold text-[24px] p-5'>RFQ Data for Material</h1>
        <Button onClick={handleOpen}>Add New Vendor</Button>
      </div>

      <div className="w-full mx-auto space-y-6 p-5">


        {/* PR Materials Manager Component */}
        <PRMaterialsManager
          prNumbers={availablePRs}
          // materials={mockMaterials}
          onSelectionChange={setPRItems}
          title="Select Purchase Request Numbers"
        />

      </div>
      {/* <div className="grid grid-cols-3 gap-6 p-5">
        {renderSelect(
          'rfq_type',
          'RFQ Type',
          Dropdown?.rfq_type,
          (item) => item.name,
          (item) => `${item.vendor_type_name}`,
          true
        )}
        {renderInput('rfq_date', 'RFQ Date', 'date')}
        {renderSelect(
          'company_name',
          'Company Name',
          Dropdown?.company,
          (item) => item.name,
          (item) => `${item.company_name}`

        )}
        {renderSelect(
          'purchase_organization',
          'Purchasing Organization',
          Dropdown?.purchase_organisation,
          (item) => item.name,
          (item) => `${item.name}`
        )}
        {renderSelect(
          'purchase_group',
          'Purchase Group',
          Dropdown?.purchase_group,
          (item) => item.name,
          (item) => `${item.purchase_group_name}`
        )}
        {renderSelect(
          'currency',
          'Select Currency',
          Dropdown?.currency_master,
          (item) => item.name,
          (item) => `${item.currency_name}`
        )}
      </div>
      <h1 className='text-[24px] font-normal pt-5 px-5'>Administrative Fields</h1>
      <div className="grid grid-cols-3 gap-6 p-5">
        {renderInput('collection_number', 'Collection No.')}
        {renderInput('quotation_deadline', 'Quotation Deadline', 'date')}
        {renderInput('requestor_name', 'Requestor Name')}
        {renderFileInput('file', 'Upload Document')}
      </div>

      <h1 className='text-[24px] font-normal pt-5 px-5'>Deadline Monitoring</h1>
      <div className="grid grid-cols-3 gap-6 p-5">
        {renderInput('first_remainder', '1st Reminder', 'date')}
        {renderInput('second_remainder', '2nd Reminder', 'date')}
        {renderInput('third_remainder', '3rd Reminder', 'date')}
      </div> */}

      <MaterialRFQFormFields
        formData={formData}
        setFormData={setFormData}
        Dropdown={Dropdown}
        setFiles={setFiles}
        files={files}
      />

      <VendorTable VendorList={VendorList?.data ? VendorList?.data : []} loading={loading} setSelectedRows={setSelectedRows} selectedRows={selectedRows} handleVendorSearch={handleVendorSearch} />
      <div className='px-4'>
        <Pagination currentPage={currentVendorPage} setCurrentPage={setVendorCurrentPage} record_per_page={VendorList?.data.length ? VendorList?.data.length : 0} total_event_list={VendorList?.total_count ? VendorList?.total_count : 0} />
      </div>
      <div className='py-6'>
        <NewVendorTable newVendorTable={newVendorTable} />
      </div>
      {
        isDialog &&
        <AddNewVendorRFQDialog Dropdown={Dropdown} setNewVendorTable={setNewVendorTable} handleClose={handleClose} />
      }
      <div className='flex justify-end pt-10 px-4'>
        <Button type='button' className='flex bg-blue-400 hover:bg-blue-400 px-10 font-medium' onClick={() => { handleSubmit() }}>Submit RFQ</Button>
      </div>
    </div>
  )
}

export default MaterialRFQ

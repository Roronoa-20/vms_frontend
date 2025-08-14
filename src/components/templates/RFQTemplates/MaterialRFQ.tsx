
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


const MaterialRFQ = ({ Dropdown, pr_codes }: Props) => {
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

  const handleVendorSearch = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setVendorCurrentPage(1)
    setVendorSearchName(e.target.value);
  }

  const handleSubmit = async () => {
    console.log(selectedMaterials, "selectedMaterials")
    console.log({ ...formData, vendors: selectedRows.vendors, pr_items: selectedMaterials }, "submit data")
    const formdata = new FormData();
    const fullData = {
      ...formData,
      vendors: selectedRows.vendors,
      pr_items: selectedMaterials,
      non_onboarded_vendors: newVendorTable,
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

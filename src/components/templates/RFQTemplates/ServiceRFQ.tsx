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
import { AccountAssignmentCategory, Company, CostCenter, Country, Currency, DestinationPort, GLAccountNumber, IncoTerms, ItemCategoryMaster, MaterialCode, MaterialGroupMaster, ModeOfShipment, PackageType, Plant, plantCode, PortCode, PortOfLoading, ProductCategory, ProfitCenter, PurchaseGroup, PurchaseOrganisation, quantityUnit, RFQType, serviceCategory, serviceCode, ShipmentType, StoreLocation, UOMMaster, ValuationArea } from '@/src/types/PurchaseRequestType';
import VendorTable from '../../molecules/rfq/VendorTable';
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'
import useDebounce from '@/src/hooks/useDebounce';
import { SAPPRData, VendorApiResponse, VendorSelectType } from '@/src/types/RFQtype';
import Pagination from '../../molecules/Pagination';
import PRServiceManager, { SelectedMaterial } from './PRServiceManager';
import NewVendorTable from '../../molecules/rfq/NewVendorTable';
import AddNewVendorRFQDialog from '../../molecules/AddNewVendorRFQDialog';
import { useRouter } from 'next/navigation';
import ServiceRFQFormFields from './ServiceRFQFormFields';

export interface DropdownDataService {
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
  service_code: serviceCode[];
  service_category: serviceCategory[]
  plant_code: plantCode[];
  quantity_unit: quantityUnit[]
  shipment_type: ShipmentType[]
  plant: Plant[];
}
type Props = {
  Dropdown: DropdownDataService;
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

const ServiceRFQ = ({ Dropdown }: Props) => {
  const [formData, setFormData] = useState<Record<string, string>>({ rfq_type: "Service Vendor" });
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
  // const [files, setFiles] = useState<Record<string, File | null>>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isDialog, setIsDialog] = useState<boolean>(false);
  const [newVendorTable, setNewVendorTable] = useState<newVendorTable[]>([])
  const router = useRouter()
  useEffect(() => {
    const fetchVendorTableData = async (rfq_type: string) => {
      const url = `${API_END_POINTS?.fetchVendorListBasedOnRFQType}?rfq_type=${rfq_type}&page_no=${currentVendorPage}&vendor_name=${debouncedDoctorSearchName}&company=${formData?.company_name}`
      const response: AxiosResponse = await requestWrapper({ url: url, method: "GET" });
      if (response?.status == 200) {
        setVendorList(response.data.message)
      } else {
        alert("error");
      }
    }
    if (formData?.company_name) {
      fetchVendorTableData(formData?.rfq_type ? formData?.rfq_type : "Service Vendor");
    }
  }, [currentVendorPage, debouncedDoctorSearchName,formData?.company_name]);

  useEffect(() => {
    const fetchPRDropdown = async (rfq_type: string) => {
      const url = `${API_END_POINTS?.fetchPRDropdown}?rfq_type=${rfq_type}`
      const response: AxiosResponse = await requestWrapper({ url: url, method: "GET" });
      if (response?.status == 200) {
        setAvailablePRs(response.data.message.pr_numbers)
      } else {
        alert("error");
      }
    }
    fetchPRDropdown(formData?.rfq_type ? formData?.rfq_type : "Service Vendor");
  }, []);

  const handleVendorSearch = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setVendorCurrentPage(1)
    setVendorSearchName(e.target.value);
  }

  const handleSubmit = async () => {
    const formdata = new FormData();
    const fullData = {
      ...formData,
      vendors: selectedRows.vendors,
      pr_items: selectedMaterials,
      non_onboarded_vendors: newVendorTable, 
    };
    formdata.append('data', JSON.stringify(fullData));

    // Append file only if exists
    if (uploadedFiles) {
      uploadedFiles?.forEach((file) => {
        formdata.append("file", file);
      });
    }

    const url = `${API_END_POINTS?.CreateServiceRFQ}`;
    const response: AxiosResponse = await requestWrapper({ url: url, data: formdata, method: "POST" });
    if (response?.status == 200) {
      alert("Submit Successfull");
      router.push("/dashboard")
    } else {
      alert("error");
    }

  }
  const setItems = async (materials: SelectedMaterial[]) => {
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
        <h1 className='font-bold text-[24px] p-5'>RFQ Data for Service</h1>
        <Button onClick={handleOpen}>Add New Vendor</Button>
      </div>

      <div className="w-full mx-auto space-y-6 p-5">
        {/* PR Materials Manager Component */}
        <PRServiceManager
          prNumbers={availablePRs}
          onSelectionChange={setItems}
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
          'purchase_organisation',
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
        {renderSelect(
          'service_code',
          'Service Code',
          Dropdown?.service_code,
          (item) => item.name,
          (item) => `${item.service_name}`
        )}
        {renderSelect(
          'service_category',
          'Service Category',
          Dropdown?.service_category,
          (item) => item.name,
          (item) => `${item.service_category_name}`
        )}
        {renderSelect(
          'material_code',
          'Material Code',
          Dropdown?.material_code,
          (item) => item.name,
          (item) => `${item.material_name}`
        )}
        {renderSelect(
          'plant_code',
          'Plant Code',
          Dropdown?.plant_code,
          (item) => item.name,
          (item) => `${item.plant_name}`
        )}
        {renderSelect(
          'store_location',
          'Storage Location',
          Dropdown?.store_location,
          (item) => item.name,
          (item) => `${item.store_location_name}`
        )}
        {renderInput('short_text', 'Short Text')}
        {renderTextarea('service_location', 'Service Location')}
      </div>

      <h1 className='text-[24px] font-normal pt-5 px-5'>Material/Item Details</h1>
      <div className="grid grid-cols-3 gap-6 p-5">
        {renderInput('collection_no', 'Collection No.')}
        {renderInput('quotation_deadline', 'Quotation Deadline', 'date')}
        {renderInput('bidding_person', 'Bidding Person')}
      </div>
      <h1 className='text-[24px] font-normal pt-5 px-5'>Quantity & Date</h1>
      <div className="grid grid-cols-3 gap-6 p-5">
        {renderInput('rfq_quantity', 'RFQ Quantity')}

        {renderSelect(
          'quantity_unit',
          'Quantity Unit',
          Dropdown?.quantity_unit,
          (item) => item.name,
          (item) => `${item.quantity_unit_name}`
        )}
        {renderInput('delivery_date', 'Delivery Date', 'date')}
        {renderInput('estimated_price', 'Enter estimated Price', 'number')}
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Uplaod Documents
          </h1>
          <MultipleFileUpload
            files={uploadedFiles}
            setFiles={setUploadedFiles}
            onNext={(files) => {
              console.log("Final selected files:", files)
            }}
            buttonText="Attach Files"
          />
        </div>
      </div>
      <h1 className='text-[24px] font-normal pt-5 px-5'>Deadline Monitoring</h1>
      <div className="grid grid-cols-3 gap-6 p-5">
        {renderInput('first_remainder', '1st Reminder', 'date')}
        {renderInput('second_remainder', '2nd Reminder', 'date')}
        {renderInput('third_remainder', '3rd Reminder', 'date')}
      </div> */}
      <ServiceRFQFormFields
        formData={formData}
        setFormData={setFormData}
        Dropdown={Dropdown}
        setUploadedFiles={setUploadedFiles}
        uploadedFiles={uploadedFiles}
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

export default ServiceRFQ

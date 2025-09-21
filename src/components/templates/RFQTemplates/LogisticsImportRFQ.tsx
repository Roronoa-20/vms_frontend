import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button";
import { AccountAssignmentCategory, Company, CostCenter, Country, DestinationPort, GLAccountNumber, IncoTerms, ItemCategoryMaster, MaterialCode, MaterialGroupMaster, ModeOfShipment, PackageType, PortCode, PortOfLoading, ProductCategory, ProfitCenter, PurchaseGroup, RFQType, ShipmentType, StoreLocation, UOMMaster, ValuationArea } from '@/src/types/PurchaseRequestType';
import VendorTable from '../../molecules/rfq/VendorTable';
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'
import useDebounce from '@/src/hooks/useDebounce';
import { VendorApiResponse, VendorSelectType } from '@/src/types/RFQtype';
import Pagination from '../../molecules/Pagination';
import SingleSelectVendorTable from '../../molecules/rfq/SingleSelectVendorTable';
import AddNewVendorRFQDialog from '../../molecules/AddNewVendorRFQDialog';
import NewVendorTable from '../../molecules/rfq/NewVendorTable';
import LogisticsImportRFQFormFields from './LogisticsImportRFQFormFields';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

export interface DropdownData {
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
    shipment_type: ShipmentType[]
}
type Props = {
    Dropdown: DropdownData;
}

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

const LogisticsImportRFQ = ({ Dropdown }: Props) => {
    const [formData, setFormData] = useState<Record<string, string>>({ rfq_type: "Logistics Vendor" });
    const [vendorSearchName, setVendorSearchName] = useState('')
    const [currentVendorPage, setVendorCurrentPage] = useState<number>(1);
    const [VendorList, setVendorList] = useState<VendorApiResponse>();
    const [loading, setLoading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const [selectedRows, setSelectedRows] = useState<VendorSelectType>(
        {
            vendors: []
        }
    );
    const debouncedDoctorSearchName = useDebounce(vendorSearchName, 500);
    const [isDialog, setIsDialog] = useState<boolean>(false);
    const [newVendorTable, setNewVendorTable] = useState<newVendorTable[]>([])
    const router = useRouter()
    useEffect(() => {
        const fetchVendorTableData = async (rfq_type: string) => {
            setSelectedRows({ vendors: [] })
            const url = `${API_END_POINTS?.fetchVendorListBasedOnRFQType}?rfq_type=${rfq_type}&page_no=${currentVendorPage}&vendor_name=${debouncedDoctorSearchName}&service_provider=${formData?.service_provider}&company=${formData?.company_name_logistic}`
            const response: AxiosResponse = await requestWrapper({ url: url, method: "GET" });
            if (response?.status == 200) {
                setVendorList(response.data.message)
                console.log(response, "response of vendor table data")
            } else {
                alert("error");
            }
        }
        if (formData?.service_provider != "Select" && formData?.service_provider && formData?.company_name_logistic) {
            fetchVendorTableData(formData?.rfq_type ? formData?.rfq_type : "Logistics Vendor");
        }
    }, [currentVendorPage, debouncedDoctorSearchName, formData?.service_provider,formData?.company_name_logistic]);

    const handleVendorSearch = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setVendorCurrentPage(1)
        setVendorSearchName(e.target.value);
    }
    const handleSubmit = async () => {
        setLoading(true)
        if (formData?.service_provider == "All Service Provider" || formData?.service_provider == "Select" || formData?.service_provider == "Premium Service Provider") {
            setSelectedRows({ vendors: [] })
        }
        const formdata = new FormData();
        const fullData = {
            ...formData,
            logistic_type: "Import",
            non_onboarded_vendors: newVendorTable,
            vendors: selectedRows.vendors,
        };
        formdata.append('data', JSON.stringify(fullData));
        if (uploadedFiles) {
            uploadedFiles?.forEach((file) => {
                formdata.append("file", file);
            });
        }
        const url = `${API_END_POINTS?.CreateImportRFQ}`;
        const response: AxiosResponse = await requestWrapper({ url: url, data: formdata, method: "POST" });
        if (response?.status == 200) {
            alert("Submit Successfull");
            router.push("/dashboard");
            setLoading(false)
        } else {
            alert("error");
            setLoading(false)
        }
    }
    const handleOpen = () => {
        setIsDialog(true);
    }
    const handleClose = () => {
        setIsDialog(false);
    }

    console.log(VendorList?.data, "VendorList?.data------------------------------------------0000000000086543")
    return (
        <div className='bg-white h-full w-full pb-6'>
            <div className='flex justify-between items-center pr-2'>
                <h1 className='font-bold text-[24px] p-5'>RFQ Data for Import</h1>
                {/* <Button onClick={() => { handleOpen() }}>Add New Vendor</Button> */}
            </div>
            <LogisticsImportRFQFormFields
                formData={formData}
                setFormData={setFormData}
                Dropdown={Dropdown}
                setUploadedFiles={setUploadedFiles}
                uploadedFiles={uploadedFiles}
            />
            {formData?.service_provider === "Adhoc Service Provider" && <VendorTable VendorList={VendorList?.data ? VendorList?.data : []} loading={loading} setSelectedRows={setSelectedRows} selectedRows={selectedRows} handleVendorSearch={handleVendorSearch} />}
            {formData?.service_provider === "Courier Service Provider" && <SingleSelectVendorTable VendorList={VendorList?.data ? VendorList?.data : []} loading={loading} setSelectedRows={setSelectedRows} selectedRows={selectedRows} handleVendorSearch={handleVendorSearch} />}
            {formData?.service_provider === "Courier Service Provider" || formData?.service_provider === "Adhoc Service Provider" && <div className='px-4'>
                <Pagination currentPage={currentVendorPage} setCurrentPage={setVendorCurrentPage} record_per_page={VendorList?.data.length ? VendorList?.data.length : 0} total_event_list={VendorList?.total_count ? VendorList?.total_count : 0} />
            </div>}
            {/* <div className='flex justify-end items-center pr-5 pt-2'>
                <Button
                    className='bg-[#5291CD] font-medium text-[14px] inline-flex items-center gap-2'
                    onClick={() => handleOpen()}
                >
                    <Plus className="w-4 h-4" />
                    Add New Vendor
                </Button>
            </div> */}
            <div className='py-4'>
                <NewVendorTable newVendorTable={newVendorTable} handleOpen={handleOpen}/>
            </div>
            <div className='flex justify-end pt-10 px-4'>
                <Button type='button' className={`bg-[#5291CD] py-2`} variant={"nextbtn"} size={"nextbtnsize"} onClick={() => { handleSubmit() }}>Submit RFQ</Button>
            </div>
            {
                isDialog &&
                <AddNewVendorRFQDialog Dropdown={Dropdown} setNewVendorTable={setNewVendorTable} handleClose={handleClose} />
            }
        </div>
    )
}

export default LogisticsImportRFQ

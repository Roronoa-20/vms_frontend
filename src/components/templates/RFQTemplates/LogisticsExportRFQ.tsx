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
import { AccountAssignmentCategory, Company, CostCenter, Country, DestinationPort, GLAccountNumber, IncoTerms, ItemCategoryMaster, MaterialCode, MaterialGroupMaster, ModeOfShipment, PackageType, PortCode, PortOfLoading, ProductCategory, ProfitCenter, PurchaseGroup, RFQType, StoreLocation, UOMMaster, ValuationArea } from '@/src/types/PurchaseRequestType';
import VendorTable from '../../molecules/rfq/VendorTable';
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'
import useDebounce from '@/src/hooks/useDebounce';
import { VendorApiResponse, VendorSelectType } from '@/src/types/RFQtype';
import Pagination from '../../molecules/Pagination';
import SingleSelectVendorTable from '../../molecules/rfq/SingleSelectVendorTable';
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
}
type Props = {
    Dropdown: DropdownData;
}
const LogisticsExportRFQ = ({ Dropdown }: Props) => {
    const [formData, setFormData] = useState<Record<string, string>>({ rfq_type: "Logistic Vendor" });
    const [vendorSearchName, setVendorSearchName] = useState('')
    const [currentVendorPage, setVendorCurrentPage] = useState<number>(1);
    const [VendorList, setVendorList] = useState<VendorApiResponse>();
    const [loading, setLoading] = useState(true);
    const debouncedDoctorSearchName = useDebounce(vendorSearchName, 500);
    useEffect(() => {
        const fetchVendorTableData = async (rfq_type: string) => {
             setSelectedRows({ vendors: [] })
            console.log(rfq_type, "rfq_type in table code")
            const url = `${API_END_POINTS?.fetchVendorListBasedOnRFQType}?rfq_type=${rfq_type}&page_no=${currentVendorPage}&vendor_name=${debouncedDoctorSearchName}&service_provider=${formData?.service_provider}`
            const response: AxiosResponse = await requestWrapper({ url: url, method: "GET" });
            if (response?.status == 200) {
                setVendorList(response.data.message)
                console.log(response, "response of vendor table data")
            } else {
                alert("error");
            }
        }
         if (formData?.service_provider != "Select" && formData?.service_provider) {
            fetchVendorTableData(formData?.rfq_type ? formData?.rfq_type : "Logistic Vendor");
        }
    }, [currentVendorPage, debouncedDoctorSearchName,formData?.service_provider]);
    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const [selectedRows, setSelectedRows] = useState<VendorSelectType>(
        {
            vendors: []
        }
    );
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
    const renderTextarea = (name: string, label: string, rows = 4) => (
        <div className="col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                {label}
                {/* {errors[name] && <span className="text-red-600 ml-1">*</span>} */}
            </h1>
            <textarea
                name={name}
                rows={rows}
                value={formData[name] || ''}
                onChange={(e) => handleFieldChange(e)}
                className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
        
        if (formData?.service_provider == "All Service Provider" || formData?.service_provider == "Select" || formData?.service_provider == "Premium Service Provider") {
            setSelectedRows({ vendors: [] })
        }
        console.log({ ...formData, vendors: selectedRows.vendors }, "submit data")
        const url = `${API_END_POINTS?.CreateExportRFQ}`;
        const response: AxiosResponse = await requestWrapper({ url: url, data: { data: { ...formData, vendors: selectedRows.vendors } }, method: "POST" });
        if (response?.status == 200) {
            alert("Submit Successfull");
        } else {
            alert("error");
        }
    }
    return (
        <div className='bg-white h-full w-full pb-6'>
            <h1 className='font-bold text-[24px] p-5'>RFQ Data for Exporting</h1>
            <div className="grid grid-cols-3 gap-6 p-5">
                {/* {renderInput('rfq_type', 'RFQ Type')} */}
                {renderSelect(
                    'rfq_type',
                    'RFQ Type',
                    Dropdown?.rfq_type,
                    (item) => item.name,
                    (item) => `${item.vendor_type_name}`,
                    true
                )}
                <div className="col-span-1">
                    <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                        Select Service
                    </h1>
                    <Select value={formData?.service_provider ?? ""} onValueChange={(value) => { handleSelectChange(value, "service_provider") }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem key={"Select"} value="Select">{"Select"}</SelectItem>
                                <SelectItem key={"All Service Provider"} value="All Service Provider">{"Send notification to all service provider"}</SelectItem>
                                <SelectItem key={"Premium Service Provider"} value="Premium Service Provider">{"Send notification to specific premium service provider"}</SelectItem>
                                <SelectItem key={"Courier Service Provider"} value="Courier Service Provider">{"Send notification to specific courier partner"}</SelectItem>
                                <SelectItem key={"Adhoc Service Provider"} value="Adhoc Service Provider">{"Send notification to adhoc partner"}</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                {renderSelect(
                    'company_name_logistic',
                    'Company Name',
                    Dropdown?.company,
                    (item) => item.name,
                    (item) => `${item.company_name}`
                )}
                {renderInput('sr_no', 'Sr No.')}
                {renderInput('rfq_cutoff_date_logistic', 'RFQ CutOff', 'datetime-local')}
                {renderInput('rfq_date_logistic', 'RFQ Date', 'date')}
                {renderSelect(
                    'mode_of_shipment',
                    'Mode of Shipment',
                    Dropdown?.mode_of_shipment,
                    (item) => item.name,
                    (item) => `${item.name}`
                )}
                {renderSelect(
                    'destination_port',
                    'Destination Port',
                    Dropdown?.port_master,
                    (item) => item.name,
                    (item) => `${item.port_name}`
                )}
                {renderSelect(
                    'country',
                    'Country',
                    Dropdown?.country_master,
                    (item) => item.name,
                    (item) => `${item.country_name}`
                )}
                {renderSelect(
                    'port_code',
                    'Port Code',
                    Dropdown?.port_master
                    ,
                    (item) => item.name,
                    (item) => `${item.port_code}`
                )}
                {renderSelect(
                    'port_of_loading',
                    'Port of Loading',
                    Dropdown?.port_master,
                    (item) => item.name,
                    (item) => `${item.port_name}`
                )}
                {renderSelect(
                    'inco_terms',
                    'Inco Terms',
                    Dropdown?.incoterm_master,
                    (item) => item.name,
                    (item) => `${item.incoterm_name}`
                )}

                {renderInput('ship_to_address', 'Ship to Address')}

                {renderSelect(
                    'package_type',
                    'Package Type',
                    Dropdown?.package_type,
                    (item) => item.name,
                    (item) => `${item.package_name}`
                )}
                {renderInput('no_of_pkg_units', 'No.Of Pkg Units', 'number')}
                {renderSelect(
                    'product_category',
                    'Product Category',
                    Dropdown?.product_category,
                    (item) => item.name,
                    (item) => `${item.product_category_name}`
                )}
                {renderInput('vol_weight', 'Vol Weight(KG)', 'number')}
                {renderInput('actual_weight', 'Actual Weight(KG)', 'number')}
                {renderInput('invoice_date', 'Invoice Date', 'date')}
                {renderInput('invoice_no', 'Invoice No')}
                {renderInput('consignee_name', 'Consignee Name')}
                {renderInput('shipment_date', 'Shipment Date', 'date')}
                {renderTextarea('remarks', 'Remarks')}
            </div>
            {formData?.service_provider === "Adhoc Service Provider" && <VendorTable VendorList={VendorList?.data ? VendorList?.data : []} loading={loading} setSelectedRows={setSelectedRows} selectedRows={selectedRows} handleVendorSearch={handleVendorSearch} />}
            {formData?.service_provider === "Courier Service Provider" && <SingleSelectVendorTable VendorList={VendorList?.data ? VendorList?.data : []} loading={loading} setSelectedRows={setSelectedRows} selectedRows={selectedRows} handleVendorSearch={handleVendorSearch} />}
            {formData?.service_provider === "Courier Service Provider" || formData?.service_provider === "Adhoc Service Provider" && <div className='px-4'>
                <Pagination currentPage={currentVendorPage} setCurrentPage={setVendorCurrentPage} record_per_page={VendorList?.data.length ? VendorList?.data.length : 0} total_event_list={VendorList?.total_count ? VendorList?.total_count : 0} />
            </div>}
            <div className='flex justify-end pt-10 px-4'>
                <Button type='button' className='flex bg-blue-400 hover:bg-blue-400 px-10 font-medium' onClick={() => { handleSubmit() }}>Submit RFQ</Button>
            </div>
        </div>
    )
}

export default LogisticsExportRFQ

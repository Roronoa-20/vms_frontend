import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { DropdownData } from './LogisticsImportRFQ';
import MultipleFileUpload from '../../molecules/MultipleFileUpload';
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'
interface Props {
    formData: Record<string, any>;
    setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    Dropdown: DropdownData;
    uploadedFiles: File[];
    setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
}
// RFQ current date
const today = new Date().toISOString().split("T")[0];

const LogisticsImportRFQFormFields = ({ formData, setFormData, Dropdown, setUploadedFiles, uploadedFiles }: Props) => {
    const [destinationPort, setDestinationPort] = useState([])   
    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSelectChange = (value: string, field: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    const renderInput = (name: string, label: string, type = 'text', isdisabled?:boolean) => (
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
                disabled={isdisabled}
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
                className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm text-gray-800 resize-none"
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
                <SelectTrigger>
                    <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {options && options.length > 0 ? (
                            options.map((item, idx) => (
                                <SelectItem key={idx} value={getValue(item)}>
                                    {getLabel(item)}
                                </SelectItem>
                            ))
                        ) : (
                            <SelectItem disabled value="no-data">
                                No data
                            </SelectItem>
                        )}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );

    useEffect(() => {
        const fetchDestinationPort = async (mode_of_shipment: string) => {
            setFormData((prev) => ({
                ...prev,
                destination_port: "",
            }));
            console.log(mode_of_shipment, "mode_of_shipment ---------------------")
            const url = `${API_END_POINTS?.fetchDestinationPortBasedonShipmentType}?mode_of_shipment=${mode_of_shipment}&port_type="destination"`
            const response: AxiosResponse = await requestWrapper({ url: url, method: "GET" });
            if (response?.status == 200) {
                console.log(response, "response of destination port data")
                setDestinationPort(response.data.message)
            } else {
                alert("error");
            }
        }
        if (formData?.mode_of_shipment) {
            fetchDestinationPort(formData?.mode_of_shipment);
        }
    }, [formData?.mode_of_shipment]);


    //RFQ date
    useEffect(() => {
        setFormData((prev) => ({ ...prev, rfq_date_logistic: formData?.rfq_date_logistic?formData?.rfq_date_logistic:today }));
      }, [today,formData?.rfq_date_logistic]);
    
      console.log(formData, "formData");

    return (
        <div>
            <div className="grid grid-cols-3 gap-6 p-5">
                {renderSelect(
                    'rfq_type',
                    'RFQ Type',
                    Dropdown?.rfq_type,
                    (item) => item.name,
                    (item) => `${item.vendor_type_name}`,
                    true
                )}
                {renderSelect(
                    'company_name_logistic',
                    'Company Name',
                    Dropdown?.company,
                    (item) => item.name,
                    (item) => `${item.company_name}`
                )}
                <div className="col-span-1">
                    <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                        Select Service
                    </h1>
                    <Select value={formData?.service_provider ?? ""} onValueChange={(value) => { handleSelectChange(value, "service_provider") }}>
                        <SelectTrigger disabled={formData?.company_name_logistic ? false : true}>
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
                {renderInput('sr_no', 'Sr No.')}
                {renderInput('rfq_cutoff_date_logistic', 'RFQ CutOff', 'datetime-local')}
                {renderInput('rfq_date_logistic', 'RFQ Date', 'date',true)}
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
                    destinationPort,
                    (item) => item,
                    (item) => `${item}`
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
                {/*{renderSelect(
                    'port_of_loading',
                    'Port of Loading',
                    Dropdown?.port_master,
                    (item) => item.name,
                    (item) => `${item.port_name}`
                )}*/}
                {renderSelect(
                    'inco_terms',
                    'Inco Terms',
                    Dropdown?.incoterm_master,
                    (item) => item.name,
                    (item) => `${item.incoterm_name}`
                )}

                {renderInput('shipper_name', 'Shipper Name')}

                {renderSelect(
                    'package_type',
                    'Package Type',
                    Dropdown?.package_type,
                    (item) => item.name,
                    (item) => `${item.package_name}`
                )}
                {renderInput('no_of_pkg_units', 'No.Of Pkg Units', 'number')}
                
                {renderInput('vol_weight', 'Vol Weight(KG)', 'number')}
                {renderInput('actual_weight', 'Actual Weight(KG)', 'number')}
                {renderSelect(
                    'product_category',
                    'Product Category',
                    Dropdown?.product_category,
                    (item) => item.name,
                    (item) => `${item.product_category_name}`
                )}
                {renderSelect(
                    'shipment_type',
                    'Shipment Type',
                    Dropdown?.shipment_type,
                    (item) => item.name,
                    (item) => `${item.shipment_type_name}`
                )}
                {renderInput('invoice_date', 'Invoice Date', 'date')}
                {renderInput('invoice_no', 'Invoice No')}
                {renderInput('invoice_value', 'Invoice Value', 'number')}
                {renderInput('expected_date_of_arrival', 'Expected Date of Arrival', 'date')}
                <div>
                    <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                        Uplaod Documents
                    </h1>
                    <MultipleFileUpload
                        files={uploadedFiles}
                        setFiles={setUploadedFiles}
                        buttonText="Attach Files"
                    />
                </div>
            </div>
            <div className='p-5'>
                {renderTextarea('remarks', 'Remarks')}
            </div>
        </div>
    )
}

export default LogisticsImportRFQFormFields

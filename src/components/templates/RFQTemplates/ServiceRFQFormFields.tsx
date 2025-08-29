import React from 'react'
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { DropdownDataMaterial } from './MaterialRFQ';
import MultipleFileUpload from '../../molecules/MultipleFileUpload';
import { DropdownDataService } from './ServiceRFQ';
import { useEffect } from 'react';
interface Props {
    formData: Record<string, any>;
    setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    Dropdown: DropdownDataService;
    uploadedFiles: File[];
    setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

// RFQ current date
const today = new Date().toISOString().split("T")[0];

const ServiceRFQFormFields = ({ formData, setFormData, Dropdown, setUploadedFiles, uploadedFiles }: Props) => {

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSelectChange = (value: string, field: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    const renderInput = (name: string, label: string, type = 'text',isdisabled?:boolean) => (
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

    //RFQ date
            useEffect(() => {
                setFormData((prev) => ({ ...prev, rfq_date: formData?.rfq_date?formData?.rfq_date:today }));
              }, [today,formData?.rfq_date]);
            
              console.log(formData, "formData");

    return (
        <div>
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
                {renderInput('rfq_date', 'RFQ Date', 'date',true)}
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
                    Dropdown?.plant,
                    (item) => item.name,
                    (item) => `${item.plant_name}`
                )}
                {renderSelect(
                    'storage_location',
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
                {renderInput('collection_number', 'Collection No.')}
                {renderInput('rfq_cutoff_date_logistic', 'Quotation Deadline', 'datetime-local')}
                {renderInput('bidding_person', 'Bidding Person')}
            </div>
            <h1 className='text-[24px] font-normal pt-5 px-5'>Quantity & Date</h1>
            <div className="grid grid-cols-3 gap-6 p-5">
                {renderInput('rfq_quantity', 'RFQ Quantity')}

                {renderSelect(
                    'quantity_unit',
                    'Quantity Unit',
                    Dropdown?.uom_master,
                    (item) => item.name,
                    (item) => `${item.uom}`
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
                        buttonText="Attach Files"
                    />
                </div>
            </div>

            <h1 className='text-[24px] font-normal pt-5 px-5'>Deadline Monitoring</h1>
            <div className="grid grid-cols-3 gap-6 p-5">
                {renderInput('first_reminder', '1st Reminder', 'date')}
                {renderInput('second_reminder', '2nd Reminder', 'date')}
                {renderInput('third_reminder', '3rd Reminder', 'date')}
            </div>
        </div>
    )
}

export default ServiceRFQFormFields

import React from 'react'
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { DropdownDataMaterial } from './MaterialRFQ';
interface Props {
    formData: Record<string, any>;
    setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    Dropdown: DropdownDataMaterial;
    files: Record<string, File | null>;
    setFiles: React.Dispatch<React.SetStateAction<Record<string, File | null>>>;
}
const MaterialRFQFormFields = ({ formData, setFormData, Dropdown, setFiles, files }: Props) => {

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
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
                {renderInput('rfq_cutoff_date_logistic', 'Quotation Deadline', 'datetime-local')}
                {renderInput('requestor_name', 'Requestor Name')}
                {renderFileInput('file', 'Upload Document')}
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

export default MaterialRFQFormFields

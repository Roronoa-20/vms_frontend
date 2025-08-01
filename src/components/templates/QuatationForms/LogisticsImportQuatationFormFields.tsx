import React from 'react'
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PurchaseRequestDropdown } from "@/src/types/PurchaseRequestType";
import MultipleFileUpload from "../../molecules/MultipleFileUpload";
interface Props {
    formData: Record<string, string>;
    setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    uploadedFiles: File[];
    setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
    Dropdown: PurchaseRequestDropdown["message"];
}
const LogisticsImportQuatationFormFields = ({
    formData,
    setFormData,
    uploadedFiles,
    setUploadedFiles,
    Dropdown,
}: Props) => {
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
                className="w-full rounded-md border border-neutral-200 px-3 h-10 py-2 text-sm text-gray-800"
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
                    'mode_of_shipment',
                    'Mode of Shipment',
                    Dropdown?.mode_of_shipment,
                    (item) => item.name,
                    (item) => `${item.name}`
                )}
                {renderInput('airlinevessel_name', 'Name')}
                {renderInput('chargeable_weight', 'Chargeable Weight')}
                {renderInput('ratekg', 'Rate/Kg')}
                {renderInput('fuel_surcharge', 'Fuel Surcharge')}
                {renderInput('sc', 'SC')}
                {renderInput('xray', 'X-Ray')}
                {renderInput('pickuporigin', 'Pick Up / Origin Charge')}
                {renderInput('ex_works', 'Ex Works')}
                {renderInput('total_freight', 'Total Freight')}
                {renderSelect(
                    'from_currency',
                    'From Currency',
                    Dropdown?.currency_master,
                    (item) => item.name,
                    (item) => `${item.name}`
                )}
                {renderSelect(
                    'to_currency',
                    'To Currency',
                    Dropdown?.currency_master,
                    (item) => item.name,
                    (item) => `${item.name}`
                )}
                {renderInput('exchange_rate', 'XR(XE.COM)')}
                {renderInput('total_freightinr', 'Total Freight(INR)')}
                {renderInput('destination_charge', 'DC(INR)')}
                {renderInput('shipping_line_charge', 'Shipping Line Charges')}
                {renderInput('cfs_charge', 'CFS Charges')}
                {renderInput('total_landing_price', 'Total Landing Price(INR)')}
                {renderInput('transit_days', 'Transit Days')}
                {renderTextarea('remarks', 'Remarks')}
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
        </div>
    )
}

export default LogisticsImportQuatationFormFields

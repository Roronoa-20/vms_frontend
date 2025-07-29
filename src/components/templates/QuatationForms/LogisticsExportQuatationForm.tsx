"use client"
import React, { useState } from 'react'
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
import { PurchaseRequestDropdown } from '@/src/types/PurchaseRequestType';
import MultipleFileUpload from '../../molecules/MultipleFileUpload';
interface Props {
    Dropdown: PurchaseRequestDropdown["message"];
    pr_codes?: string | null;
    pr_type?: string | null;
}
const LogisticsExportQuatationForm = ({ Dropdown }: Props) => {
    const [formData, setFormData] = useState<Record<string, string>>({ rfq_type: "Logistic Vendor" });
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
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

    const handleSubmit = async () => {
        // console.log({ ...formData, vendors: selectedRows.vendors }, "submit data")
        // if (formData?.service_provider == "All Service Provider" || formData?.service_provider == "Select" || formData?.service_provider == "Premium Service Provider") {
        //     setSelectedRows({ vendors: [] })
        // }
        // const url = `${API_END_POINTS?.CreateImportRFQ}`;
        // const response: AxiosResponse = await requestWrapper({ url: url, data: { data: { ...formData, vendors: selectedRows.vendors } }, method: "POST" });
        // if (response?.status == 200) {
        //     alert("Submit Successfull");
        // } else {
        //     alert("error");
        // }
    }
    return (
        <div>
            <h1 className='text-lg py-2 font-semibold'>Fill Quatation Details</h1>
            <div className="grid grid-cols-3 gap-6 p-5">
                {/* {renderInput('rfq_type', 'RFQ Type')} */}
                {renderSelect(
                    'mode_of_shipment',
                    'Mode of Shipment',
                    Dropdown?.mode_of_shipment,
                    (item) => item.name,
                    (item) => `${item.name}`
                )}
                {renderInput('sr_no', 'Airline/Vessel Name')}
                {renderInput('sr_no', 'Rate/Kg')}
                {renderInput('sr_no', 'Fuel Surcharge')}
                {renderInput('sr_no', 'SC')}
                {renderInput('sr_no', 'X-Ray')}
                {renderInput('sr_no', 'Other Charges in Total')}
                {renderInput('sr_no', 'Chargeable Weight')}
                {renderInput('sr_no', 'Total Freight')}
                {renderInput('sr_no', 'Expected Delivery in No of Days')}
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
            <div className='flex justify-end'><Button type='button' className='flex bg-blue-400 hover:bg-blue-400 px-10 font-medium' onClick={() => { handleSubmit() }}>Submit</Button></div>
        </div>
    )
}

export default LogisticsExportQuatationForm

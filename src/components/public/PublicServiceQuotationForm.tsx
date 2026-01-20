"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import { PurchaseRequestDropdown } from '@/src/types/PurchaseRequestType';
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'
import { useRouter } from 'next/navigation';
import { PurchaseRequisitionRow, RFQDetails } from '@/src/types/RFQtype';
import MultipleFileUpload from '../molecules/MultipleFileUpload';
import ServiceQuotationFormFields from '../templates/QuatationForms/ServiceQuotationFormFields';
import PublicQuoteServiceItemsTable from './PublicQuoteServiceItemsTable';
interface Props {
    Dropdown: PurchaseRequestDropdown["message"];
    token: string;
    RFQData: RFQDetails;
}
const PublicServiceQuotationForm = ({ Dropdown, token, RFQData }: Props) => {
    const [formData, setFormData] = useState<Record<string, string>>({ rfq_type: "Service Vendor" });
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const router = useRouter()
    const [paymentterms, setPaymentTerms] = useState<string>("");
    const [negotiation, setNegotiation] = useState<Record<string, string>>({});
    const [tableData, setTableData] = useState<PurchaseRequisitionRow[]>([]);

    const handleSubmit = async () => {
        const formdata = new FormData();
        const fullData = {
            "rfq_item_list": tableData,
            "negotiation": negotiation.payment_terms,
            "payment_terms": paymentterms,
            "rfq_type": "Service Vendor"
        };
        formdata.append('data', JSON.stringify(fullData));
        formdata.append("token", token)
        // Append file only if exists
        if (uploadedFiles) {
            uploadedFiles?.forEach((file) => {
                formdata.append("file", file);
            });
        }
        const url = `${API_END_POINTS?.SubmitPublicQuatation}`;
        const response: AxiosResponse = await requestWrapper({ url: url, data: formdata, method: "POST" });
        if (response?.status == 200) {
            console.log(response, "response")
            alert("Submit Successfull");
            router.push("/success")
        } else {
            alert("error");
        }
    }
    const handleFieldChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { value } = e.target;
        setPaymentTerms(value);
    };

    const handleRadioChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setNegotiation((prev) => ({ ...prev, [name]: value }));
    };
    const renderTextarea = (name: string, label: string, rows = 4) => (
        <div className="col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-1">{label}</h1>
            <textarea
                name={name}
                rows={rows}
                value={paymentterms || ""}
                onChange={handleFieldChange}
                className="w-full rounded-md border border-neutral-200 px-3 h-10 py-2 text-sm text-gray-800"
            />
        </div>
    );
    const renderRadioGroup = (
        name: string,
        label: string,
        options: { value: string; label: string }[],
        disabled = false
    ) => (
        <div className="col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">{label}</h1>
            <div className="flex gap-4">
                {options?.map((option) => (
                    <label key={option.value} className="flex items-center gap-2 text-sm pb-1">
                        <input
                            type="radio"
                            name={name}
                            value={option?.value ?? ""}
                            checked={negotiation[name] === option.value}
                            onChange={handleRadioChange}
                            disabled={disabled}
                        />
                        {option.label}
                    </label>
                ))}
            </div>
        </div>
    );
    return (
        <div>
            <h1 className='text-lg py-2 font-semibold'>Fill Quatation Details</h1>
            <ServiceQuotationFormFields
                formData={formData}
                setFormData={setFormData}
                Dropdown={Dropdown}
                itemcodes={RFQData?.pr_items}
                setTableData={setTableData}
            />
            {/* <div className='flex justify-end'><Button type='button' className='flex bg-blue-400 hover:bg-blue-400 px-10 font-medium' onClick={() => { handleAddItems() }}>Add Row</Button></div> */}
            <PublicQuoteServiceItemsTable serviceItems={tableData} setServiceItems={setTableData} />
            <div className='grid grid-cols-3 gap-6 items-center pt-6'>
                {renderTextarea("payment_terms", "Payment Terms")}
                {renderRadioGroup("payment_terms", "Payment Terms", [
                    { value: "1", label: "Negotiable" },
                    { value: "0", label: "Non-Negotiable" }
                ])}
                <div>
                    <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                        Upload Documents
                    </h1>
                    <MultipleFileUpload
                        files={uploadedFiles}
                        setFiles={setUploadedFiles}
                        buttonText="Attach Files"
                    />
                </div>
            </div>
            <div className='flex justify-end pt-6'><Button type='button' className='flex bg-blue-400 hover:bg-blue-400 px-10 font-medium text-lg' disabled={tableData?.length > 0 ? false : true} onClick={() => { handleSubmit() }}>Submit</Button></div>
        </div>
    )
}

export default PublicServiceQuotationForm

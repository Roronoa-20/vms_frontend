"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import { PurchaseRequestDropdown } from '@/src/types/PurchaseRequestType';
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'
import { useRouter } from 'next/navigation';
import LogisticsExportQuatationFormFields from '../templates/QuatationForms/LogisticsExportQuatationFormFields';
import { RFQDetails } from '@/src/types/RFQtype';
import { QuotationDetail } from '@/src/types/QuatationTypes';
interface Props {
    Dropdown: PurchaseRequestDropdown["message"];
    token: string;
    RFQData:RFQDetails;
    QuotationData:QuotationDetail | null
}
const PublicLogisticsExportQuatationForm = ({ Dropdown, token,QuotationData}: Props) => {
    // const [formData, setFormData] = useState<Record<string, string>>({ rfq_type: "Logistics Vendor",logistic_type:"Export" });
     const [formData, setFormData] = useState<QuotationDetail>({...QuotationData, rfq_type: "Logistics Vendor",logistic_type:"Export" } as QuotationDetail);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const router = useRouter()
    const handleSubmit = async () => {
        const formdata = new FormData();
        const fullData = {
            ...formData,
        };
        // Append JSON data as a string under key 'data'
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
    console.log(formData,"formData")
    return (
        <div>
            <h1 className='text-lg py-2 font-semibold'>Fill Quatation Details</h1>
            <LogisticsExportQuatationFormFields
                formData={formData}
                setFormData={setFormData}
                uploadedFiles={uploadedFiles}
                setUploadedFiles={setUploadedFiles}
                Dropdown={Dropdown} 
                
                />
            <div className='flex justify-end'><Button type='button' className='flex bg-blue-400 hover:bg-blue-400 px-10 font-medium' onClick={() => { handleSubmit() }}>Submit</Button></div>
        </div>
    )
}

export default PublicLogisticsExportQuatationForm

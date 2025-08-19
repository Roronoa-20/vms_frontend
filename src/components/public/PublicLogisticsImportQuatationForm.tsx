"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import { PurchaseRequestDropdown } from '@/src/types/PurchaseRequestType';
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'
import { useRouter } from 'next/navigation';
import LogisticsImportQuatationFormFields from '../templates/QuatationForms/LogisticsImportQuatationFormFields';
import { RFQDetails } from '@/src/types/RFQtype';
interface Props {
    Dropdown: PurchaseRequestDropdown["message"];
    token: string;
    RFQData:RFQDetails
}
const PublicLogisticsImportQuatationForm = ({ Dropdown, token,RFQData }: Props) => {
    const [formData, setFormData] = useState<Record<string, string>>({ rfq_type: "Logistic Vendor",mode_of_shipment:RFQData.mode_of_shipment });
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const router = useRouter()

    const handleSubmit = async () => {
        const formdata = new FormData();
        const fullData = {
            ...formData,
        };
        // Append JSON data as a string under key 'data'
        console.log(fullData, "fullData")
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
            alert("Not able to Submit");
            location.reload();
        }
    }
    return (
        <div>
            <h1 className='text-lg py-2 font-semibold'>Fill Quatation Details</h1>
            <LogisticsImportQuatationFormFields
                formData={formData}
                setFormData={setFormData}
                uploadedFiles={uploadedFiles}
                setUploadedFiles={setUploadedFiles}
                Dropdown={Dropdown} />

            <div className='flex justify-end'><Button type='button' className='flex bg-blue-400 hover:bg-blue-400 px-10 font-medium' onClick={() => { handleSubmit() }}>Submit Bid</Button></div>
        </div>
    )
}

export default PublicLogisticsImportQuatationForm

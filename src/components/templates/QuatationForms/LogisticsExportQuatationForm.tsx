"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import { PurchaseRequestDropdown } from '@/src/types/PurchaseRequestType';
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'
import { useRouter } from 'next/navigation';
import LogisticsExportQuatationFormFields from './LogisticsExportQuatationFormFields';
interface Props {
    Dropdown: PurchaseRequestDropdown["message"];
    refno: string;
}
const LogisticsExportQuatationForm = ({ Dropdown, refno }: Props) => {
    const [formData, setFormData] = useState<Record<string, string>>({ rfq_type: "Logistic Vendor", rfq_number: refno });
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

        // Append file only if exists
        if (uploadedFiles) {
            uploadedFiles?.forEach((file) => {
                formdata.append("file", file);
            });
        }
        const url = `${API_END_POINTS?.SubmitQuatation}`;
        const response: AxiosResponse = await requestWrapper({ url: url, data: formdata, method: "POST" });
        if (response?.status == 200) {
            console.log(response, "response")
            alert("Submit Successfull");
            router.push("/dashboard")
        } else {
            alert("error");
        }
    }
    return (
        <div>
            <h1 className='text-lg py-2 font-semibold'>Fill Quatation Details</h1>
            {/* <div className="grid grid-cols-3 gap-6 p-5">
                {renderSelect(
                    'mode_of_shipment',
                    'Mode of Shipment',
                    Dropdown?.mode_of_shipment,
                    (item) => item.name,
                    (item) => `${item.name}`
                )}
                {renderInput('airlinevessel_name', 'Airline/Vessel Name')}
                {renderInput('ratekg', 'Rate/Kg')}
                {renderInput('fuel_surcharge', 'Fuel Surcharge')}
                {renderInput('sc', 'SC')}
                {renderInput('xray', 'X-Ray')}
                {renderInput('other_charges_in_total', 'Other Charges in Total')}
                {renderInput('chargeable_weight', 'Chargeable Weight')}
                {renderInput('total_freight', 'Total Freight')}
                {renderInput('expected_delivery_in_no_of_days', 'Expected Delivery in No of Days')}
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
            </div> */}
            <LogisticsExportQuatationFormFields
                formData={formData}
                setFormData={setFormData}
                uploadedFiles={uploadedFiles}
                setUploadedFiles={setUploadedFiles}
                Dropdown={Dropdown} />
            <div className='flex justify-end'><Button type='button' className='flex bg-blue-400 hover:bg-blue-400 px-10 font-medium' onClick={() => { handleSubmit() }}>Submit</Button></div>
        </div>
    )
}

export default LogisticsExportQuatationForm

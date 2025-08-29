import React from 'react'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios';
import requestWrapper from '@/src/services/apiCall';
import { cookies } from 'next/headers';
import { RFQDetails } from '@/src/types/RFQtype';
import RFQBasicDetails from '../molecules/ViewRFQ/ViewRFQDetails';
import ViewFileAttachment from '../molecules/ViewRFQ/ViewFileAttachment';
import LogisticsExportQuatationForm from '../templates/QuatationForms/LogisticsExportQuatationForm';
import LogisticsImportQuatationForm from '../templates/QuatationForms/LogisticsImportQuatationForm';


interface PageProps {
    refno?: string
}
const SubmitQuatation = async ({ refno }: PageProps) => {
    const cookieStore = await cookies();
    const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");
    console.log(refno, "refno-----------------")
    const RFQDataUrl = `${API_END_POINTS?.getRFQData}?name=${refno}`;
    const RFQDataResponse: AxiosResponse = await requestWrapper({
        url: RFQDataUrl, method: "GET", headers: {
            cookie: cookieHeaderString
        }
    })
    const RFQData: RFQDetails = RFQDataResponse?.status == 200 ? RFQDataResponse?.data?.message : "";
    const dropdownApiUrl = API_END_POINTS?.vendorPurchaseRequestDropdown;
    const resposne: AxiosResponse = await requestWrapper({
        url: dropdownApiUrl, method: "GET", headers: {
            cookie: cookieHeaderString
        }
    });
    const Dropdown = resposne?.status == 200 ? resposne?.data.message : "";
    return (
        <div className='px-4 py-6'>
            <h1 className='text-lg py-2'>RFQ RefNo : <span className='font-bold'>{refno ? refno : ""}</span></h1>
            {
                RFQData.rfq_type == "Logistics Vendor" &&
                <>
                    <RFQBasicDetails RFQData={RFQData} />
                    <ViewFileAttachment RFQData={RFQData} />
                    {
                        RFQData.logistic_type == "Export" ?
                            <LogisticsExportQuatationForm Dropdown={Dropdown} refno={refno?refno:""}/>
                            :
                            <LogisticsImportQuatationForm Dropdown={Dropdown} refno={refno?refno:""}/>
                    }
                </>
            }
        </div>
    )
}

export default SubmitQuatation

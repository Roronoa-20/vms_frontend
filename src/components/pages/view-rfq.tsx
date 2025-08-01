import React from 'react'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios';
import requestWrapper from '@/src/services/apiCall';
import { cookies } from 'next/headers';
import { RFQDetails } from '@/src/types/RFQtype';
import ViewLogisticsRFQDetailsPage from '../templates/ViewRFQDetails/ViewLogisticsRFQDetailsPage';


interface PageProps {
    refno?: string
}

export const ViewRFQ = async ({refno}: PageProps) => {
    const cookieStore = await cookies();
    const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");  
    console.log(refno,"refno-----------------") 
    const RFQDataUrl = `${API_END_POINTS?.getRFQData}?name=${refno}`;
    const RFQDataResponse: AxiosResponse = await requestWrapper({
        url: RFQDataUrl, method: "GET", headers: {
            cookie: cookieHeaderString
        }
    })
    const RFQData: RFQDetails = RFQDataResponse?.status == 200 ? RFQDataResponse?.data?.message : "";
    const dropdownApiUrl = API_END_POINTS?.vendorPurchaseRequestDropdown;
    const resposne: AxiosResponse = await requestWrapper({ url: dropdownApiUrl, method: "GET", });
    const Dropdown = resposne?.status == 200 ? resposne?.data.message : "";

    console.log(RFQData,"RFQData")
    return (
        <ViewLogisticsRFQDetailsPage  RFQData={RFQData} refno={refno} Dropdown={Dropdown}/>
    )
}

import React from 'react'
import PrEnquiryForm from '../templates/PrEnquiryForm'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios';
import requestWrapper from '@/src/services/apiCall';
import { cookies } from 'next/headers';
import { cityDropdownType, purchaseInquiryDropdown } from '@/src/types/prEnquiry/prEnquiry.types';
import { TPRInquiry } from './View-Pr-Enquiry';
import { getCategoryTypeEnquiryDropdown, getCityDropdown, getCompanyDropdownBasedOUser, getlocationDropdown, getPurchaseEnquiryData, getPurchaseTypeDropdown } from '@/src/services/prEnquiry/prEnquiry.services';

interface Props {
    refno?: string
}



const PrInquiryPage = async ({ refno }: Props) => {

    const cookieStore = await cookies();
    const user = cookieStore.get("user_id")?.value
    console.log(user, "user")
    const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");
    const categoryDropdownUrl = API_END_POINTS?.getInquiryDropdown;
    const dropdownResponse: AxiosResponse = await requestWrapper({
        url: categoryDropdownUrl, method: "GET", headers: {
            cookie: cookieHeaderString
        }
    });

    const companyDropdown = await getCompanyDropdownBasedOUser(cookieHeaderString);
    const purchaseTypeDropdown = await getPurchaseTypeDropdown(cookieHeaderString);
    const categoryTypeDropdown = await getCategoryTypeEnquiryDropdown(cookieHeaderString);

    let data:any = null;
    if(refno){
       data = await getPurchaseEnquiryData(refno,cookieHeaderString)
    };

    let cityDropdown:cityDropdownType[] | null = null; 
    if(data?.company?.name){
       cityDropdown = await getCityDropdown("",data?.company?.name,cookieHeaderString);
    }
    console.log(cityDropdown,"fjdhfj")
    
    return (
        <PrEnquiryForm companyDropdown={companyDropdown} purchaseTypeDropdown={purchaseTypeDropdown} categoryTypeDropdown={categoryTypeDropdown} cityDropdown={cityDropdown as cityDropdownType[]} data={data}/>
        // <></>
    )
}

export default PrInquiryPage
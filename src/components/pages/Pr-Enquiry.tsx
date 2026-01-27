import React from 'react'
import PrEnquiryForm from '../templates/PrEnquiryForm'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios';
import requestWrapper from '@/src/services/apiCall';
import { cookies } from 'next/headers';
import { purchaseInquiryDropdown } from '@/src/types/prEnquiry/prEnquiry.types';
import { TPRInquiry } from './View-Pr-Enquiry';
import { getCategoryTypeEnquiryDropdown, getCompanyDropdownBasedOUser, getPurchaseTypeDropdown } from '@/src/services/prEnquiry/prEnquiry.services';

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
    // const dropdown: purchaseInquiryDropdown["message"] = dropdownResponse?.status == 200 ? dropdownResponse?.data?.message : ""

    // let PRInquiryData: TPRInquiry | null = null;
    // if (refno) {
    //     const PRInquiryDataUrl = `${API_END_POINTS?.prInquiryData}?pi_name=${refno}`;
    //     const PRInquiryDataResponse: AxiosResponse = await requestWrapper({
    //         url: PRInquiryDataUrl, method: "GET", headers: {
    //             cookie: cookieHeaderString
    //         }
    //     });
    //     PRInquiryData = PRInquiryDataResponse?.status == 200 ? PRInquiryDataResponse?.data?.message : "";
    // }

    // const companyDropdownUrl = `${API_END_POINTS?.InquirycompanyBasedOnUser}?usr=${user}`;
    // const companyDropdownResponse: AxiosResponse = await requestWrapper({
    //     url: companyDropdownUrl, method: "GET", headers: {
    //         cookie: cookieHeaderString
    //     }
    // });
    // const companyDropdown = companyDropdownResponse?.status == 200 ? companyDropdownResponse?.data?.message?.data : ""

    // const purchaseTypeUrl = API_END_POINTS?.InquiryPurchaseTypeDropdown;
    // const purchaseTypeResponse: AxiosResponse = await requestWrapper({
    //     url: purchaseTypeUrl, method: "GET", headers: {
    //         cookie: cookieHeaderString
    //     }
    // });
    // const purchaseTypeDropdown = purchaseTypeResponse?.status == 200 ? purchaseTypeResponse?.data?.message?.data : ""

    const companyDropdown = await getCompanyDropdownBasedOUser(cookieHeaderString);
    const purchaseTypeDropdown = await getPurchaseTypeDropdown(cookieHeaderString);
    const categoryTypeDropdown = await getCategoryTypeEnquiryDropdown(cookieHeaderString);
    
    return (
        <PrEnquiryForm companyDropdown={companyDropdown} purchaseTypeDropdown={purchaseTypeDropdown} categoryTypeDropdown={categoryTypeDropdown}/>
        // <></>
    )
}

export default PrInquiryPage
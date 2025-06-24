import React from 'react'
import PrInquiryForm from '../templates/PrInquiryForm'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios';
import requestWrapper from '@/src/services/apiCall';
import { cookies } from 'next/headers';

export interface purchaseInquiryDropdown {
    message:{
        category_type:{
            name:string,
            category_name:string
        }[],
        uom_master:{
            name:string,
            uom:string
        }[]
    }
}

interface Props {
    refno?:string
}

export type TableData = {
      assest_code:string,
      product_name:string,
      product_price:string,
      uom:string,
      lead_time:string,
      product_quantity:string,
      user_specifications:string
}

export type TPRInquiry = {
    user:string,
    company:string,
    cart_date:string,
    cart_use:string,
    category_type:string,
    cart_product:TableData[]
    hod:boolean,
    purchase_team:boolean
}

const PrInquiryPage = async({refno}:Props) => {

    const cookieStore = await cookies();
  const user = cookieStore.get("user_id")?.value
  console.log(user, "user")
  const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");
    const categoryDropdownUrl = API_END_POINTS?.getInquiryDropdown;
    const dropdownResponse:AxiosResponse = await requestWrapper({url:categoryDropdownUrl,method:"GET",headers:{
        cookie:cookieHeaderString
    }});
    const dropdown:purchaseInquiryDropdown["message"] = dropdownResponse?.status == 200? dropdownResponse?.data?.message : ""
  
let PRInquiryData: TPRInquiry | null   = null;
if (refno) {
    const PRInquiryDataUrl = `${API_END_POINTS?.prInquiryData}?pi_name=${refno}`;
    const PRInquiryDataResponse: AxiosResponse = await requestWrapper({ url: PRInquiryDataUrl, method: "GET",headers:{
        cookie:cookieHeaderString
    } });
    PRInquiryData = PRInquiryDataResponse?.status == 200 ? PRInquiryDataResponse?.data?.message : "";
}
console.log(PRInquiryData, "this is data");
return (
    <PrInquiryForm PRInquiryData={PRInquiryData} dropdown={dropdown} />
)
}

export default PrInquiryPage
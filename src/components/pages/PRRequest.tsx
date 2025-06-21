import React from 'react'
import PRRequestForm from '../templates/PRRequestForm'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios';
import requestWrapper from '@/src/services/apiCall';
import { PurchaseRequestData } from '@/src/types/PurchaseRequestType';


interface PageProps {
  pur_req?:string
  cartId?:string
}

export const PRRequest = async({ pur_req , cartId}:PageProps) => {

  const PRDataUrl = `${API_END_POINTS?.getPRData}?pur_req=${pur_req}`;
  const PRDataResponse:AxiosResponse = await requestWrapper({url:PRDataUrl,method:"GET"})
  const PRData:PurchaseRequestData["message"]["data"] = PRDataResponse?.status == 200 ?PRDataResponse?.data?.message?.data : "";

    const dropdownApiUrl = API_END_POINTS?.vendorPurchaseRequestDropdown;
    const resposne:AxiosResponse = await requestWrapper({url:dropdownApiUrl,method:"GET"});
    const Dropdown = resposne?.status == 200 ? resposne?.data.message : "";

  return (
    
    <PRRequestForm Dropdown={Dropdown} PRData={PRData} cartId={cartId}/>
    
  )
}

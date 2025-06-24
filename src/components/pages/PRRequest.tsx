import React from 'react'
import PRRequestForm from '../templates/PRRequestForm'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios';
import requestWrapper from '@/src/services/apiCall';
import { PurchaseRequestData } from '@/src/types/PurchaseRequestType';
import { cookies } from 'next/headers';


interface PageProps {
  pur_req?:string
  cartId?:string
}

export const PRRequest = async({ pur_req , cartId}:PageProps) => {
  let PRDataUrl ; 
  let PRData:PurchaseRequestData["message"]["data"] | null = null;
  const cookieStore = await cookies();
    const user = cookieStore.get("user_id")?.value
    console.log(user, "user")
    const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");
  if(pur_req){
    PRDataUrl = `${API_END_POINTS?.getPRData}?pur_req=${pur_req}`;
    const PRDataResponse:AxiosResponse = await requestWrapper({url:PRDataUrl,method:"GET",headers:{
      cookie:cookieHeaderString
    }})
    PRData = PRDataResponse?.status == 200 ?PRDataResponse?.data?.message?.data : "";
  }

    const dropdownApiUrl = API_END_POINTS?.vendorPurchaseRequestDropdown;
    const resposne:AxiosResponse = await requestWrapper({url:dropdownApiUrl,method:"GET",headers:{
      cookie:cookieHeaderString
    }});
    const Dropdown = resposne?.status == 200 ? resposne?.data.message : "";

  return (
    
    <PRRequestForm Dropdown={Dropdown} PRData={PRData} cartId={cartId}/>
    
  )
}

import React from 'react'
import ViewPRRequestForm from '../templates/ViewPRRequestForm'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios';
import requestWrapper from '@/src/services/apiCall';
import { PurchaseRequestData } from '@/src/types/PurchaseRequestType';
import { cookies } from 'next/headers';


interface PageProps {
  pur_req?:string
}

export const ViewPRRequest = async({ pur_req }:PageProps) => {
  const cookieStore = await cookies();
  const user = cookieStore.get("user_id")?.value
  console.log(user, "user")
  const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");

  const PRDataUrl = `${API_END_POINTS?.getPRData}?pr_w_name=${pur_req}`;
  const PRDataResponse:AxiosResponse = await requestWrapper({url:PRDataUrl,method:"GET", headers: {
      cookie: cookieHeaderString
    }})
  const PRData:PurchaseRequestData["message"]["data"] = PRDataResponse?.status == 200 ?PRDataResponse?.data?.message : "";
console.log(PRData,"this is data")
    const dropdownApiUrl = API_END_POINTS?.vendorPurchaseRequestDropdown;
    const resposne:AxiosResponse = await requestWrapper({url:dropdownApiUrl,method:"GET",});
    const Dropdown = resposne?.status == 200 ? resposne?.data.message : "";
  return (
    
    <ViewPRRequestForm Dropdown={Dropdown} PRData={PRData} hod={Dropdown?.hod} purchase_head={Dropdown?.purchase_head} refno={pur_req}/>
    
  )
}

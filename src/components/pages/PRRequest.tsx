import React from 'react'
import PRRequestForm from '../templates/PRRequestForm'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios';
import requestWrapper from '@/src/services/apiCall';
import { PurchaseRequestData } from '@/src/types/PurchaseRequestType';
import { cookies } from 'next/headers';


interface PageProps {
  pur_req?: string
  cart_id?: string
}

export const PRRequest = async ({ pur_req, cart_id }: PageProps) => {
  let PRDataUrl;
  let PRData: PurchaseRequestData["message"]["data"] | null = null;
  const cookieStore = await cookies();
  const user = cookieStore.get("user_id")?.value
  const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");
  if (cart_id) {
    PRDataUrl = `${API_END_POINTS?.fetchDataCartId}?cart_id=${cart_id}`;
    const PRDataResponse: AxiosResponse = await requestWrapper({
      url: PRDataUrl, method: "GET", headers: {
        cookie: cookieHeaderString
      }
    })
    PRData = PRDataResponse?.status == 200 ? PRDataResponse?.data?.message?.data : "";
  }

  const dropdownApiUrl = API_END_POINTS?.vendorPurchaseRequestDropdown;
  const resposne: AxiosResponse = await requestWrapper({
    url: dropdownApiUrl, method: "GET", headers: {
      cookie: cookieHeaderString
    }
  });
  const Dropdown = resposne?.status == 200 ? resposne?.data.message : "";
  return (
    <PRRequestForm Dropdown={Dropdown} PRData={PRData} cartId={cart_id} pur_req={pur_req}/>

  )
}

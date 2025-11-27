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
  prf_name?: string
}

export const PRRequest = async ({ pur_req, cart_id, prf_name }: PageProps) => {

  let PRDataUrl;
  let PRData: PurchaseRequestData["message"]["data"] | null = null;

  const cookieStore = await cookies();
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
  const company = PRData?.company || "";
  const purchaseGroupURL = `${API_END_POINTS?.filterpurchasegroup}?company=${company}`;
  const PurGroupresposne: AxiosResponse = await requestWrapper({
    url: purchaseGroupURL,
    method: "GET",
    headers: {
      cookie: cookieHeaderString
    }
  });
  const PurchaseGroupDropdown = PurGroupresposne?.status == 200 ? PurGroupresposne?.data.message?.pur_grp : "";

  const ProfitCenterURL = `${API_END_POINTS?.filterprofitcenter}?company=${company}`;
  const PorfitCenterResponse: AxiosResponse = await requestWrapper({
    url: ProfitCenterURL,
    method: "GET",
    headers: {
      cookie: cookieHeaderString
    }
  });
  const ProfitCenterDropdown = PorfitCenterResponse?.status == 200 ? PorfitCenterResponse?.data.message?.profit_center : "";
 
  const PurchaseOrgURL = `${API_END_POINTS?.filterpurchaseorg}?company=${company}`;
  const PurchaseOrgResponse: AxiosResponse = await requestWrapper({
    url: PurchaseOrgURL,
    method: "GET",
    headers: {
      cookie: cookieHeaderString
    }
  });
  const PurchaseOrgDropdown = PurchaseOrgResponse?.status == 200 ? PurchaseOrgResponse?.data.message?.purchase_org : "";

  return (
    <PRRequestForm Dropdown={Dropdown} PRData={PRData} cartId={cart_id} pur_req={pur_req} PurchaseGroupDropdown={PurchaseGroupDropdown}
      ProfitCenterDropdown={ProfitCenterDropdown} PurchaseOrgDropdown={PurchaseOrgDropdown} company={company} prf_name={prf_name}/>
  )
}

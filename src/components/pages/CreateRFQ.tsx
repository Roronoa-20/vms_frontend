import React from 'react'
import PRRequestForm from '../templates/PRRequestForm'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios';
import requestWrapper from '@/src/services/apiCall';
import { PurchaseRequestData } from '@/src/types/PurchaseRequestType';
import { cookies } from 'next/headers';
import CreateRFQForms from '../templates/CreateRFQForms';

interface PageProps {
  pur_req?: string
  cart_id?: string
}

export const CreateRFQ = async ({ pur_req, cart_id }: PageProps) => {
  const cookieStore = await cookies();
  const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");
  const dropdownApiUrl = API_END_POINTS?.vendorPurchaseRequestDropdown;
  const resposne: AxiosResponse = await requestWrapper({
    url: dropdownApiUrl, method: "GET", headers: {
      cookie: cookieHeaderString
    }
  });
  const Dropdown = resposne?.status == 200 ? resposne?.data.message : "";
  return (
    <CreateRFQForms Dropdown={Dropdown} />
  )
}
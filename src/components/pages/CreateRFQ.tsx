import React from 'react'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios';
import requestWrapper from '@/src/services/apiCall';
import { cookies } from 'next/headers';
import CreateRFQForms from '../templates/CreateRFQForms';


export const CreateRFQ = async () => {
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
import React from 'react'
import PRRequestForm from '../templates/PRRequestForm'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios';
import requestWrapper from '@/src/services/apiCall';

export const PRRequest = async() => {

    const dropdownApiUrl = API_END_POINTS?.vendorPurchaseRequestDropdown;
    const resposne:AxiosResponse = await requestWrapper({url:dropdownApiUrl,method:"GET"});
    const Dropdown = resposne?.status == 200 ? resposne?.data.message : "";

  return (
    
    <PRRequestForm Dropdown={Dropdown}/>
    
  )
}

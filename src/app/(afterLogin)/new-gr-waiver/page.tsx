export const dynamic = "force-dynamic";

import React from 'react'
import GRWaiver from '@/src/components/molecules/new-gr-waiver';
import API_END_POINTS from '@/src/services/apiEndPoints';
import { AxiosResponse } from 'axios';
import requestWrapper from '@/src/services/apiCall';
import { cookies } from 'next/headers';

export type companyDropdownType = {
  name:string
}

export type requestornameDropdownType = {
  name:string
}

export type requestDropdownType = {
  name:string
}

const GRWaivers = async() => {

  const cookie = await cookies()
  const cookieStore = await cookies();
  const user = cookie.get("user_id")?.value
  const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");
  
  const divisionUrl = API_END_POINTS?.dropdownmaterial;
  const divisionUrlApi: AxiosResponse = await requestWrapper({
    url: divisionUrl,
    method: "GET",
  });
  const divisionDropdownData:companyDropdownType[] =
    divisionUrlApi?.status == 200 ? divisionUrlApi?.data?.data : "";


  const requestornameUrl = API_END_POINTS?.dropdownrequestor;
  const requestornameUrlApi: AxiosResponse = await requestWrapper({
    url: requestornameUrl,
    method: "GET",
  });
  const requestornameDropdownData:requestornameDropdownType[] =
    requestornameUrlApi?.status == 200 ? requestornameUrlApi?.data?.message?.data : "";

  const requestUrl = API_END_POINTS?.dropdownrequest;
  const requestUrlApi: AxiosResponse = await requestWrapper({
    url: requestUrl,
    method: "GET",
    headers:{
      cookie:cookieHeaderString
    }
  });
  const requestDropdownData:requestDropdownType[] =
    requestUrlApi?.status == 200 ? requestUrlApi?.data?.data : "";


  console.log(divisionDropdownData,"this is dropdown data")
  console.log(requestornameDropdownData,"hello")
  console.log(requestDropdownData,"this is request dropdown")

  return (
        <GRWaiver 
        divisionDropdownData={divisionDropdownData}
        requestornameDropdownData={requestornameDropdownData}
        requestDropdownData={requestDropdownData}
        />
  )
}

export default GRWaivers;


import ViewPO from '@/src/components/pages/ViewPO'
import requestWrapper from '@/src/services/apiCall'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { TvendorRegistrationDropdown } from '@/src/types/types'
import { AxiosResponse } from 'axios'
import { cookies } from 'next/headers'
import React from 'react'

interface PageProps {
  searchParams:Promise<
  {
    po_name?:string
  }
  >
}

const page = async({searchParams}:PageProps) => {
  const params = await searchParams;
  const po_name = params["po_name"];

  const cookieStore = cookies();
  const cookieHeaderString = cookieStore.toString();

     const dropdownUrl = API_END_POINTS?.vendorRegistrationDropdown;
  const dropDownApi: AxiosResponse = await requestWrapper({
    url: dropdownUrl,
    method: "GET",
    headers: {
      cookie: cookieHeaderString
    }
  });
  const dropdownData: TvendorRegistrationDropdown["message"]["data"] =
    dropDownApi?.status == 200 ? dropDownApi?.data?.message?.data : "";
  const companyDropdown = dropdownData?.company_master

  return (
    <ViewPO po_name={po_name} companyDropdown={companyDropdown}/>
  )
}

export default page
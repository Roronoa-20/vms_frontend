import ViewVendorPO from '@/src/components/pages/ViewVendorPO'
import requestWrapper from '@/src/services/apiCall'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { TvendorRegistrationDropdown } from '@/src/types/types'
import { AxiosResponse } from 'axios'
import { cookies } from 'next/headers'
import React from 'react'

interface PageProps {
  searchParams: Promise<{
    po_name?:string
  }>
}

const page = async({ searchParams }:PageProps) => {
  const params = await searchParams;
  const po_name =  params["po_name"];

  const cookieStore = await cookies();
  const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");

  const url = API_END_POINTS?.getPONumberDropdown;
  const response:AxiosResponse = await requestWrapper({url:url,method:'GET',headers:{
    cookie: cookieHeaderString
  }});

  const dropdown = response?.status == 200? response?.data?.message?.total_po:"";

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
  const companyDropdown = dropdownData?.company_master;

  return (
    <ViewVendorPO po_name={po_name} dropdown={dropdown} companyDropdown={companyDropdown}/>
  )
}

export default page
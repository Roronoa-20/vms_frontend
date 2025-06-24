import ViewQMSForm from '@/src/components/pages/ViewQMSForm';
import requestWrapper from '@/src/services/apiCall';
import API_END_POINTS from '@/src/services/apiEndPoints';
import { AxiosResponse } from 'axios';
import React from 'react'


interface PageProps {
  searchParams: Promise<{ 
    vendor_onboarding?: string | string[];
    tabtype?: string | string[];
  }>
}

const page = async({ searchParams }:PageProps) => {
  const params = await searchParams;
  const vendor_onboarding =  params["vendor_onboarding"];
  const tabtype = params["tabtype"];
  return (
    <ViewQMSForm vendor_onboarding={ vendor_onboarding as string} tabtype={tabtype as string}/>
  )
}

export default page
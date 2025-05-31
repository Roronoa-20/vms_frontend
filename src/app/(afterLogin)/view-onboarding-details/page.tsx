import ViewOnboardingDetails from '@/src/components/pages/ViewOnboardingDetails'
import requestWrapper from '@/src/services/apiCall';
import API_END_POINTS from '@/src/services/apiEndPoints';
import { TvendorOnboardingDetail, TvendorRegistrationDropdown } from '@/src/types/types';
import { AxiosResponse } from 'axios';
import React from 'react'


interface PageProps {
  searchParams: Promise<{ 
    vendor_onboarding?: string | string[];
    tabtype?: string | string[];
    refno?: string | string[];
  }>
}

const page = async({ searchParams }:PageProps) => {
  const params = await searchParams;
  const vendor_onboarding =  params["vendor_onboarding"];
  const tabtype = params["tabtype"];
  const refno = params["refno"]
  return (
    <ViewOnboardingDetails vendor_onboarding={ vendor_onboarding as string} tabtype={tabtype as string} refno={refno as string}/>
  )
}

export default page
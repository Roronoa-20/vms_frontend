import ViewOnboardingDetails from '@/src/components/pages/ViewOnboardingDetails'
import requestWrapper from '@/src/services/apiCall';
import API_END_POINTS from '@/src/services/apiEndPoints';
import { TvendorOnboardingDetail, TvendorRegistrationDropdown } from '@/src/types/types';
import { AxiosResponse } from 'axios';
import React from 'react'

const page = async({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  const vendor_onboarding = await searchParams["vendor_onboarding"];
  const tabtype = await searchParams["tabtype"];
  const refno = await searchParams["refno"]
  return (
    <ViewOnboardingDetails vendor_onboarding={ vendor_onboarding as string} tabtype={tabtype as string} refno={refno as string}/>
  )
}

export default page
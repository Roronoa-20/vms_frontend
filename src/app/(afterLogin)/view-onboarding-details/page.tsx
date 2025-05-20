import ViewOnboardingDetails from '@/src/components/pages/ViewOnboardingDetails'
import requestWrapper from '@/src/services/apiCall';
import API_END_POINTS from '@/src/services/apiEndPoints';
import { TvendorOnboardingDetail, TvendorRegistrationDropdown } from '@/src/types/types';
import { AxiosResponse } from 'axios';
import React from 'react'

const page = () => {

  return (
    <ViewOnboardingDetails/>
  )
}

export default page
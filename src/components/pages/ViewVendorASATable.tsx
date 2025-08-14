import React from 'react';
import ViewVendorASAForm from '../templates/ViewVendorASATable';
import API_END_POINTS from '@/src/services/apiEndPoints';
import requestWrapper from '@/src/services/apiCall';
import { AxiosResponse } from 'axios';
import { cookies } from 'next/headers';
import { ASAForm } from '@/src/types/asatypes';

const ViewASAPage = async () => {
  const cookieStore = await cookies();
  const user = cookieStore.get('user_id')?.value || '';
  const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join('; ');

  let ASAData: ASAForm[] = [];

  const ASADataUrl = API_END_POINTS?.asavendorListdashboard;
  const ASADataResponse: AxiosResponse = await requestWrapper({
    url: ASADataUrl,
    method: 'GET',
    headers: {
      cookie: cookieHeaderString,
    },
  });

  if (ASADataResponse?.status === 200) {
    ASAData = ASADataResponse?.data?.message || [];
  }

  return (
    <ViewVendorASAForm
      ASAData={ASAData}
      user={user}
    />
  );
};

export default ViewASAPage;

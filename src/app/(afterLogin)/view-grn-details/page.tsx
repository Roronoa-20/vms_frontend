import React from 'react';
import { cookies } from 'next/headers';
import ViewGRNDetails from '@/src/components/templates/ViewGRNDetails';
import requestWrapper from '@/src/services/apiCall';
import API_END_POINTS from '@/src/services/apiEndPoints';
import { AxiosResponse } from 'axios';
import { GRNForm } from '@/src/types/grntypes';

type PageProps = {
  searchParams?: { grn_ref?: string };
};

const ViewGRNDetailPage = async ({ searchParams }: PageProps) => {
  const grn_ref = searchParams?.grn_ref || '';

  const cookieStore = await cookies();
  const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join('; ');

  const response: AxiosResponse = await requestWrapper({
    url: `${API_END_POINTS.SingleGRNdetails}?grn_number=${grn_ref}`,
    method: 'GET',
    headers: {
      cookie: cookieHeaderString,
    },
  });

  const data: GRNForm = response?.data?.message;
  console.log('GRN Data:', data);

  return <ViewGRNDetails grn={data} />;
};

export default ViewGRNDetailPage;

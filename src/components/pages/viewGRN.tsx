import React from 'react';
import ViewGRNForm from '../templates/ViewGRNtable';
import API_END_POINTS from '@/src/services/apiEndPoints';
import requestWrapper from '@/src/services/apiCall';
import { AxiosResponse } from 'axios';
import { cookies } from 'next/headers';
import { GRNForm } from '@/src/types/grntypes';
import { TvendorRegistrationDropdown } from "@/src/types/types";


const ViewGRNPage = async () => {
  const cookieStore = await cookies();
  const user = cookieStore.get('user_id')?.value || '';
  const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join('; ');

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

  let GRNData: GRNForm[] = [];

  const GRNDataUrl = API_END_POINTS?.AllGRNdetails;
  const GRNDataResponse: AxiosResponse = await requestWrapper({
    url: GRNDataUrl,
    method: 'GET',
    headers: {
      cookie: cookieHeaderString,
    },
  });

  if (GRNDataResponse?.status === 200) {
    GRNData = GRNDataResponse?.data?.message || [];
  }

  return (
    <ViewGRNForm
      GRNData={GRNData}
      user={user}
      companyDropdown={companyDropdown}
    />
  );
};

export default ViewGRNPage;

import React from 'react'
import GRWaiver from '@/src/components/molecules/gr-waiver-form';
import API_END_POINTS from '@/src/services/apiEndPoints';
import { AxiosResponse } from 'axios';
import requestWrapper from '@/src/services/apiCall';
import { cookies } from 'next/headers';
import { TvendorRegistrationDropdown } from "@/src/types/types";
import { requestornameDropdownType, requestDropdownType, formDataType } from '@/src/types/GR-waiverIterm';

interface Props {
  gr_name: string | undefined
}


const GRWaivers = async ({ gr_name }: Props) => {

  const cookieStore = await cookies();
  const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");

  const divisionUrl = API_END_POINTS?.vendorRegistrationDropdown;
  const divisionUrlApi: AxiosResponse = await requestWrapper({
    url: divisionUrl,
    method: "GET",
  });
  const divisionDropdownData: TvendorRegistrationDropdown["message"]["data"] =
    divisionUrlApi?.status == 200 ? divisionUrlApi?.data?.message?.data : "";
  const DivisionDropdown = divisionDropdownData?.company_master;

  const requestornameUrl = API_END_POINTS?.dropdownrequestor;
  const requestornameUrlApi: AxiosResponse = await requestWrapper({
    url: requestornameUrl,
    method: "GET",
  });
  const requestornameDropdownData: requestornameDropdownType[] =
    requestornameUrlApi?.status == 200 ? requestornameUrlApi?.data?.message?.data : "";

  const requestUrl = API_END_POINTS?.dropdownrequest;
  const requestUrlApi: AxiosResponse = await requestWrapper({
    url: requestUrl,
    method: "GET",
    headers: {
      cookie: cookieHeaderString
    }
  });
  const requestDropdownData: requestDropdownType[] =
    requestUrlApi?.status == 200 ? requestUrlApi?.data?.data : "";

  let Data: formDataType | null = null;

  if (gr_name) {
    const GRWaiverResponse: AxiosResponse = await requestWrapper({
      url: API_END_POINTS?.fetchGRWaiverDetails, method: "GET", params: { name: gr_name },
      headers: {
        cookie: cookieHeaderString
      },
    });
    if (GRWaiverResponse?.status == 200) {
      // setFetchedData(gateEntryResponse?.data?.message?.data);
      console.log(GRWaiverResponse?.data?.message?.data, "data at at at at at ");
      Data = GRWaiverResponse?.data?.message?.data;
    }
  }


  return (
    <GRWaiver
      DivisionDropdown={DivisionDropdown}
      requestornameDropdownData={requestornameDropdownData}
      requestDropdownData={requestDropdownData}
      GRWaiverData={Data as formDataType}

    />
  )
}

export default GRWaivers;
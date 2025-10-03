import React from 'react'
import GateEntryForm from '../templates/GateEntryForm';
import requestWrapper from '@/src/services/apiCall';
import API_END_POINTS from '@/src/services/apiEndPoints';
import { AxiosResponse } from 'axios';
import { TFetchedQRData } from '@/src/types/GateEntryTypes';
import { cookies } from 'next/headers';


interface Props {
  refno:string | undefined
}

const GateEntry = async({refno}:Props) => {

  const cookieStore = await cookies();
      const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");

  let Data:TFetchedQRData | null = null;
  const inwardLocationDropdownResponse : AxiosResponse = await requestWrapper({url:API_END_POINTS?.inwardLocationDropdown,method:"GET",
    headers: {
            cookie: cookieHeaderString
        },
  });
  const inwardLocationDropdown:{name:string,inward_location:string}[]  = inwardLocationDropdownResponse?.status == 200 ? inwardLocationDropdownResponse?.data?.message : "";
  if(refno){
    const gateEntryResponse:AxiosResponse = await requestWrapper({url:API_END_POINTS?.fetchGateEntry,method:"POST",params:{name:refno}});
    if(gateEntryResponse?.status == 200){
      // setFetchedData(gateEntryResponse?.data?.message?.data);
      console.log(gateEntryResponse?.data?.message?.data,"data at at at at at ");
      Data = gateEntryResponse?.data?.message?.data;
    }
  }
  
  return (
    <GateEntryForm refno={refno} QrfetchedData={Data as TFetchedQRData} inwardLocationDropdown={inwardLocationDropdown}/>
  )
}

export default GateEntry;
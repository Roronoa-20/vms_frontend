import { PRRequest } from '@/src/components/pages/PRRequest'
import requestWrapper from '@/src/services/apiCall';
import API_END_POINTS from '@/src/services/apiEndPoints'
import { PurchaseRequestData } from '@/src/types/PurchaseRequestType';
import { AxiosResponse } from 'axios';
import React from 'react'

interface PageProps {
  searchParams: Promise<{ 
    pur_req?:string
  }>
}


const page = async({ searchParams }:PageProps) => {
  const params = await searchParams;
  const pur_req =  params["pur_req"];

  return (
    <PRRequest pur_req={pur_req}/>
  )
}

export default page
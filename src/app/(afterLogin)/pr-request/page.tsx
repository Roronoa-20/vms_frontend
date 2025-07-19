import { PRRequest } from '@/src/components/pages/PRRequest'
import requestWrapper from '@/src/services/apiCall';
import API_END_POINTS from '@/src/services/apiEndPoints'
import { PurchaseRequestData } from '@/src/types/PurchaseRequestType';
import { AxiosResponse } from 'axios';
import React from 'react'

interface PageProps {
  searchParams: Promise<{ 
    pur_req?:string
    cart_Id?:string
  }>
}


const page = async({ searchParams }:PageProps) => {
  const params = await searchParams;
  console.log(params,"params in servr")
  const pur_req =  params["pur_req"];
  const cart_id =  params["cart_Id"];
console.log(cart_id,"cart_id in server page")
  return (
    <PRRequest pur_req={pur_req} cart_id={cart_id}/>
  )
}

export default page
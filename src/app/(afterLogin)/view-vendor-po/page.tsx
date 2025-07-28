import ViewPO from '@/src/components/pages/ViewPO'
import ViewVendorPO from '@/src/components/pages/ViewVendorPO'
import requestWrapper from '@/src/services/apiCall'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios'
import { cookies } from 'next/headers'
import React from 'react'

interface PageProps {
  searchParams: Promise<{ 
    po_name?:string
  }>
}

const page = async({ searchParams }:PageProps) => {
  const params = await searchParams;
  const po_name =  params["po_name"];

  const cookieStore = await cookies();
        // const user = cookieStore.get("user_id")?.value
        const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");
    const url = API_END_POINTS?.getPONumberDropdown;
    const response:AxiosResponse = await requestWrapper({url:url,method:'GET',headers:{
      cookie: cookieHeaderString
    }});
    
      // console.log(response?.data?.message?.data,"this is dropdown");
      // setPONumberDropdown(response?.data?.message?.total_po);
      const dropdown = response?.status == 200? response?.data?.message?.total_po:"";
    console.log(response?.data,"this is dropdown")
  

  return (
    <ViewVendorPO po_name={po_name} dropdown={dropdown}/>
  )
}

export default page
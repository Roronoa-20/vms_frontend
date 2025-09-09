import React from 'react'
import { ViewQuotation } from '@/src/components/pages/view-quotation';

interface PageProps {
  searchParams: Promise<{ 
    refno?:string
  }>
}


const Page = async({ searchParams }:PageProps) => {
  const params = await searchParams;
  const refno =  params["refno"];

  return (
    <ViewQuotation refno={refno}/>
  )
}

export default Page
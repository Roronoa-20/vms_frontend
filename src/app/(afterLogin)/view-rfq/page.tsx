import React from 'react'
import { ViewRFQ } from '@/src/components/pages/view-rfq';

interface PageProps {
  searchParams: Promise<{ 
    refno?:string
  }>
}


const Page = async({ searchParams }:PageProps) => {
  const params = await searchParams;
  const refno =  params["refno"];

  return (
    <ViewRFQ refno={refno}/>
  )
}

export default Page
import PrEnquiryPage from '@/src/components/pages/Pr-Enquiry'
import React from 'react'

const Page = async ({ searchParams }: { searchParams: Promise<{ cart_id?: string; }> }): Promise<React.ReactElement> => {
    const { cart_id } = (await searchParams);
  return (
    <PrEnquiryPage refno={cart_id}/>
  )
}

export default Page
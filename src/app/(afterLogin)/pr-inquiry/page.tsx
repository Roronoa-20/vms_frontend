import PrInquiryPage from '@/src/components/pages/Pr-Inquiry'
import React from 'react'

const Page = async ({ searchParams }: { searchParams: Promise<{ cart_Id?: string; }> }): Promise<React.ReactElement> => {
    const { cart_Id } = (await searchParams);
  return (
    <PrInquiryPage refno={cart_Id}/>
  )
}

export default Page
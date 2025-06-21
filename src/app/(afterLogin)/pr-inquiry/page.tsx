import PrInquiryPage from '@/src/components/pages/Pr-Inquiry'
import React from 'react'

const Page = async ({ searchParams }: { searchParams: Promise<{ refno?: string; }> }): Promise<React.ReactElement> => {
    const { refno } = (await searchParams);
  return (
    <PrInquiryPage refno={refno}/>
  )
}

export default Page
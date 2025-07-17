import Dispatch from '@/src/components/pages/Dispatch'
import React from 'react'

const Page = async ({ searchParams }: { searchParams: Promise<{ refno?: string; }> }): Promise<React.ReactElement> => {
    const { refno } = (await searchParams);
  return (
    <Dispatch refno={refno}/>
  )
}

export default Page
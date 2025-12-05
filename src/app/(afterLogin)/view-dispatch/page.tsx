import ViewDispatch from '@/src/components/pages/ViewDispatch'
import React from 'react'

const Page = async ({ searchParams }: { searchParams: Promise<{ refno?: string; }> }): Promise<React.ReactElement> => {

    const { refno } = (await searchParams);
    
  return (
    <ViewDispatch refno={refno}/>
  )
}

export default Page
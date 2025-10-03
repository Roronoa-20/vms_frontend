import GateEntry from '@/src/components/pages/GateEntry'
import React from 'react'

const Page = async ({ searchParams }: { searchParams: Promise<{ refno?: string; }> }): Promise<React.ReactElement> => {
  const param = (await searchParams);
  const refno = param?.refno;
  return (
    <GateEntry refno={refno}/>
  )
}

export default Page
import RaiseAdvancePayment from '@/src/components/pages/RaiseAdvancePayment'
import React from 'react'

interface PageProps {
  searchParams: Promise<{
    refno?: string
  }>
}

const page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const refno = params["refno"] as string;
  return (
    <RaiseAdvancePayment refno={refno} />
  )
}

export default page
import RaiseAdvancePayment from '@/src/components/pages/RaiseAdvancePayment'
import React from 'react'

interface PageProps {
  searchParams: Promise<{
    poname?: string
  }>
}

const page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const poname = params["poname"] as string;
  return (
    <RaiseAdvancePayment poname={poname} />
  )
}

export default page
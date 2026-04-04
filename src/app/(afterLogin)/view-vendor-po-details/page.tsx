import ViewVendorPoDetails from '@/src/components/pages/ViewVendorPoDetails'
import React from 'react'

interface PageProps {
  searchParams: Promise<{
    poname?: string
  }>
}

const page = async ({ searchParams }: PageProps) => {
  const params = await searchParams
  const poname = params.poname as string | undefined

  return (
    <div className="min-h-full bg-[#F8FAFC]">
      <ViewVendorPoDetails poname={poname ?? ''} />
    </div>
  )
}

export default page

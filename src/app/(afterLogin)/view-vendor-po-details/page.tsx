import ViewVendorPoDetails from '@/src/components/pages/ViewVendorPoDetails';
import React from 'react'

interface PageProps {
  searchParams:Promise<
  {
    poname?:string
  }
  >
}

const page = async ({searchParams}:PageProps) => {
    const params = await searchParams;
    const poname = params["poname"] as string;
  return (
    <ViewVendorPoDetails poname={poname} />
  )
}

export default page
import ViewPO from '@/src/components/pages/ViewPO'
import React from 'react'

interface PageProps {
  searchParams:Promise<
  {
    po_name?:string
  }
  >
}

const page = async({searchParams}:PageProps) => {
  const params = await searchParams;
  const po_name = params["po_name"];
  return (
    <ViewPO po_name={po_name}/>
  )
}

export default page
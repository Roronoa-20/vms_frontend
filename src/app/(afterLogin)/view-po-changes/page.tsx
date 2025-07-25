import ViewPOChanges from '@/src/components/pages/ViewPOChanges'
import React from 'react'

const page = async({ searchParams }: { searchParams: Promise<{ po_name: string; }> }) => {
    const po_name = (await searchParams)?.po_name
  return (
    <ViewPOChanges po_name={po_name}/>
  )
}

export default page
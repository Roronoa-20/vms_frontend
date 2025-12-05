import DispatchTable from '@/src/components/pages/VendorDispatchTable'
import React from 'react'

const page = async ({ searchParams }: { searchParams: Promise<{ poname?: string; }> }): Promise<React.ReactElement> => {

    const { poname } = (await searchParams);

  return (
    <DispatchTable />
  )
}

export default page
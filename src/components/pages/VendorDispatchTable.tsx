import React from 'react'
import DispatchVendorsTable from '../molecules/Vendor-Dispatch-Table-List'
import { AxiosResponse } from 'axios'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { cookies } from 'next/headers'
import requestWrapper from '@/src/services/apiCall'

type Props = {
  poname?:string
}

const DispatchTable = async ({poname}:Props) => {

  const cookieStore = await cookies();
  const cookieHeaderString = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");

  const tableResponse: AxiosResponse = await requestWrapper({
    url: API_END_POINTS?.dispatchTable,
    method: "GET",
    params:{po_name:poname},
    headers: { cookie: cookieHeaderString },
  })

  const dispatchTableData = tableResponse?.status === 200 ? tableResponse?.data?.message?.dispatches : [];

  return (
    <>
      <DispatchVendorsTable dashboardTableData={dispatchTableData} poname={poname as string} />
    </>
  )
}

export default DispatchTable
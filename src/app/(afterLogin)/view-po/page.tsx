import ViewPO from '@/src/components/pages/ViewPO'
import requestWrapper from '@/src/services/apiCall'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { DashboardPOTableData, TvendorRegistrationDropdown } from '@/src/types/types'
import { AxiosResponse } from 'axios'
import { cookies } from 'next/headers'
import React from 'react'

interface PageProps {
  searchParams: Promise<{
    po_name?: string
  }>
}

const page = async ({ searchParams }: PageProps) => {
  const params = await searchParams
  const po_name = params.po_name

  const cookieStore = await cookies()
  const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join('; ')

  const dashboardPOTableDataApi: AxiosResponse = await requestWrapper({
    url: `${API_END_POINTS?.poTable}`,
    method: 'GET',
    headers: { cookie: cookieHeaderString },
  })

  const rawTable = dashboardPOTableDataApi?.status === 200 ? dashboardPOTableDataApi?.data?.message : null
  const dashboardPOTableData: DashboardPOTableData['message'] | undefined =
    rawTable && typeof rawTable === 'object' ? rawTable : undefined

  const dropdownUrl = API_END_POINTS?.vendorRegistrationDropdown
  const dropDownApi: AxiosResponse = await requestWrapper({
    url: dropdownUrl,
    method: 'GET',
    headers: { cookie: cookieHeaderString },
  })

  const dropdownData: TvendorRegistrationDropdown['message']['data'] | undefined =
    dropDownApi?.status === 200 ? dropDownApi?.data?.message?.data : undefined
  const companyDropdown = dropdownData?.company_master

  return (
    <div className="min-h-full bg-[#F8FAFC]">
      <ViewPO po_name={po_name} POTableData={dashboardPOTableData} companyDropdown={companyDropdown} />
    </div>
  )
}

export default page

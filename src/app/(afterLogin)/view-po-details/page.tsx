import ViewPoDetails from '@/src/components/pages/ViewPoDetails'
import React from 'react'

interface PageProps {
  searchParams: Promise<{
    poname?: string
  }>
}

const page = async ({ searchParams }: PageProps) => {
  const params = await searchParams
  const poname = params.poname ?? ''

  return <ViewPoDetails poname={poname} />
}

export default page

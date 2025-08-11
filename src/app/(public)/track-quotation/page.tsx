import TrackQuotation from '@/src/components/public/TrackQuotation'
import React from 'react'

interface PageProps {
    searchParams: Promise<{ [key: string]: string }>;
}

const page = async({ searchParams }: PageProps): Promise<React.ReactElement> => {
   const searchparams = await searchParams;
      const { token } = searchparams
      console.log(token,"this is token")
  return (
    <TrackQuotation token={token}/>
  )
}

export default page
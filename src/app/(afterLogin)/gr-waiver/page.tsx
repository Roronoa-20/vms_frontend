export const dynamic = "force-dynamic";

import React from 'react'
import GRWaiverForm from '@/src/components/pages/gr-waiver';

const GRWaiverPage = async ({ searchParams }: { searchParams: Promise<{ gr_name?: string; }> }): Promise<React.ReactElement> => {
  const param = (await searchParams);

  const gr_name = param?.gr_name;

  return (
    <GRWaiverForm gr_name={gr_name}/>
  )
}

export default GRWaiverPage;


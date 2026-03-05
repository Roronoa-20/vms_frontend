import QuickVendor from '@/src/components/pages/QuickVendor';
import React from 'react'

interface params { searchParams: Promise<{ refno?: string; }> }

const page = async ({ searchParams }: params) => {
    const refno = (await searchParams)?.refno;
    return (
        <QuickVendor refno={refno} />
    )
}

export default page
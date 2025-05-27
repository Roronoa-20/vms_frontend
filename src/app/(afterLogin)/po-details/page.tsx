import React from 'react'
import PODetails from '@/src/components/pages/po-details'

const Page = async ({ searchParams }: { searchParams: Promise<{ name?: string; }> }): Promise<React.ReactElement> => {
    const { name } = (await searchParams);
    console.log(name, "name")
    return (
        <div>
            <PODetails name={name}/>
        </div>
    )
}

export default Page

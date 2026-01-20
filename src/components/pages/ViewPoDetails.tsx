import { cookies } from 'next/headers';
import React from 'react'
import { fetchPoDetailsData } from '../molecules/view-po-details/fetchData';
import BasicPoDetilails from '../molecules/view-po-details/BasicPoDetilails';
import PoItemsTable from '../molecules/view-po-details/PoItemsTable';
import { PoDetailsType } from '@/src/types/view-po-details/poDetailsType';


interface Props {
    poname: string
}

const ViewPoDetails = async({poname}: Props) => {

      const cookieStore = cookies();
      const cookieHeaderString = cookieStore.toString();

    const poDetails:PoDetailsType | undefined = await fetchPoDetailsData(poname, cookieHeaderString);

  return (
    <div>
        <BasicPoDetilails poBasicDetails={poDetails?.message as PoDetailsType["message"]} />
        <PoItemsTable POTableData={poDetails?.message.items as PoDetailsType["message"]["items"]} />
    </div>
  )
}

export default ViewPoDetails
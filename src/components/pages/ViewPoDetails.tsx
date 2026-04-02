import { cookies } from 'next/headers';
import React from 'react'
import { fetchPoDetailsData } from '../molecules/view-po-details/fetchData';
import BasicPoDetilails from '../molecules/view-po-details/BasicPoDetilails';
import PoItemsTable from '../molecules/view-po-details/PoItemsTable';
import { PoDetailsType, VendorPoDetailsType } from '@/src/types/view-po-details/poDetailsType';
import { fetchPoDetails } from '@/src/services/purchaseOrder/purchaseOrder.services';


interface Props {
    poname: string
}

const ViewPoDetails = async({poname}: Props) => {

      const cookieStore = cookies();
      const cookieHeaderString = cookieStore.toString();

    const poDetails:VendorPoDetailsType = await fetchPoDetails(poname, cookieHeaderString);
    console.log(poDetails?.data,"this is po email flag")
  return (
    <div>
        <BasicPoDetilails poBasicDetails={poDetails?.data as VendorPoDetailsType["data"]} />
        <PoItemsTable poName={poname} POTableData={poDetails?.data?.items as VendorPoDetailsType["data"]["items"]} po_mail_sent={poDetails?.data?.po_mail_sent as number} />
    </div>
  )
}

export default ViewPoDetails
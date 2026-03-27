import { cookies } from 'next/headers';
import React from 'react'
import { fetchPoDetailsData } from '../molecules/view-po-details/fetchData';
import AdvancePaymentBasicDetails from '../molecules/raise-advance-payment/AdvancePaymentBasicDetails';
import AdvancePaymentItemsTable from '../molecules/raise-advance-payment/AdvancePaymentItemsTable';
import { PoDetailsType } from '@/src/types/view-po-details/poDetailsType';

interface Props {
    poname: string
}

const RaiseAdvancePayment = async ({ poname }: Props) => {

    const cookieStore = cookies();
    const cookieHeaderString = cookieStore.toString();

    const poDetails: PoDetailsType | undefined = await fetchPoDetailsData(poname, cookieHeaderString);

    return (
        <div>
            <AdvancePaymentBasicDetails poBasicDetails={poDetails?.message as PoDetailsType["message"]} />
            <AdvancePaymentItemsTable poName={poname} POTableData={poDetails?.message.items as PoDetailsType["message"]["items"]} />
        </div>
    )
}

export default RaiseAdvancePayment
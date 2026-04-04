import { cookies } from 'next/headers';
import React from 'react'
import AdvancePaymentBasicDetails from '../molecules/raise-advance-payment/AdvancePaymentBasicDetails';
import AdvancePaymentItemsTable from '../molecules/raise-advance-payment/AdvancePaymentItemsTable';
import { getPaymentRequestDetails } from '@/src/services/advancePayment/advancePayment.services';
import { PaymentRequestDetails } from '@/src/types/advancePayment/advancePayment.types';

interface Props {
    refno: string;
    po_no: string;
}

const RaiseAdvancePayment = async ({ refno, po_no }: Props) => {

    const cookieStore = cookies();
    const cookieHeaderString = cookieStore.toString();

    let paymentDetails: PaymentRequestDetails | undefined;
    try {
        const res = await getPaymentRequestDetails(refno, cookieHeaderString);
        paymentDetails = res?.data;
        po_no = paymentDetails?.po_no;
    } catch (error) {
        console.error("Error fetching payment request details:", error);
    }

    return (
        <div className="p-4 space-y-5">
            <AdvancePaymentBasicDetails paymentDetails={paymentDetails} refno={refno} po_no={po_no} />
            <AdvancePaymentItemsTable paymentDetails={paymentDetails} refno={refno} />
        </div>
    )
}

export default RaiseAdvancePayment
import { cookies } from 'next/headers';
import React from 'react'
import Link from 'next/link';
import AdvancePaymentBasicDetails from '../molecules/raise-advance-payment/AdvancePaymentBasicDetails';
import AdvancePaymentItemsTable from '../molecules/raise-advance-payment/AdvancePaymentItemsTable';
import { getPaymentRequestDetails } from '@/src/services/advancePayment/advancePayment.services';
import { PaymentRequestDetails } from '@/src/types/advancePayment/advancePayment.types';

interface Props {
    refno: string
}

const RaiseAdvancePayment = async ({ refno }: Props) => {

    const cookieStore = cookies();
    const cookieHeaderString = cookieStore.toString();

    let paymentDetails: PaymentRequestDetails | undefined;
    try {
        const res = await getPaymentRequestDetails(refno, cookieHeaderString);
        paymentDetails = res?.data;
    } catch (error) {
        console.error("Error fetching payment request details:", error);
    }

    return (
        <div>
            <AdvancePaymentBasicDetails paymentDetails={paymentDetails} />
            <div className="m-3 mb-4 flex justify-end">
                <Link href="/advance-payment-history">
                    <button className="bg-[#5291CD] hover:bg-[#3d6ba3] text-white font-medium py-2 px-4 rounded-lg transition-colors">
                        View Payment History
                    </button>
                </Link>
            </div>
            <AdvancePaymentItemsTable paymentDetails={paymentDetails} refno={refno} />
        </div>
    )
}

export default RaiseAdvancePayment
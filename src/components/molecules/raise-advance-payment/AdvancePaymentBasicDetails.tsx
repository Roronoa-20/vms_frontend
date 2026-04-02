"use client"
import React from 'react'
import { PaymentRequestDetails } from '@/src/types/advancePayment/advancePayment.types'
import Link from 'next/link'

interface Props {
    paymentDetails?: PaymentRequestDetails
}

const AdvancePaymentBasicDetails = ({ paymentDetails }: Props) => {

    return (
        <>
            <div className='bg-white shadow-md border grid grid-cols-4 gap-3 p-4 rounded-xl mt-3 mx-2'>
                <div className='flex gap-2'>
                    <h1 className='font-semibold'>PO Number: </h1>
                    <p>{paymentDetails?.po_no}</p>
                </div>
                <div className='flex gap-2'>
                    <h1 className='font-semibold'>PO Date: </h1>
                    <p>{paymentDetails?.po_date}</p>
                </div>
                <div className='flex gap-2'>
                    <h1 className='font-semibold'>Vendor Code: </h1>
                    <p>{paymentDetails?.purchase_details?.vendor_code}</p>
                </div>
                <div className='flex gap-2'>
                    <h1 className='font-semibold'>Vendor Name: </h1>
                    <p>{paymentDetails?.vendor_name}</p>
                </div>
                <div className='flex gap-2'>
                    <h1 className='font-semibold'>Purchase Group: </h1>
                    <p>{paymentDetails?.purchase_details?.purchase_group_name}</p>
                </div>
                <div className='flex gap-2'>
                    <h1 className='font-semibold'>Purchase Contact Person: </h1>
                    <p>{paymentDetails?.purchase_details?.contact_person}</p>
                </div>
                <div className='flex gap-2'>
                    <h1 className='font-semibold'>Total Amount: </h1>
                    <p>{paymentDetails?.total_amt} {paymentDetails?.currency}</p>
                </div>
                <div className="flex gap-2">
                    <h1 className='font-semibold'>Status: </h1>
                    <p>{paymentDetails?.status}</p>
                </div>
                <div className='flex gap-2'>
                    <h1 className='font-semibold'>Payment Type: </h1>
                    <p>{paymentDetails?.payment_type}</p>
                </div>
                <div className='flex gap-2'>
                    <h1 className='font-semibold'>Payment Req Date: </h1>
                    <p>{paymentDetails?.payment_req_date}</p>
                </div>
                <div className='flex gap-2'>
                    <h1 className='font-semibold'>Company: </h1>
                    <p>{paymentDetails?.company}</p>
                </div>
                <div className='flex gap-2'>
                    <h1 className='font-semibold'>Purchase Team: </h1>
                    <p>{paymentDetails?.purchase_team}</p>
                </div>
            </div>
            {paymentDetails?.purchase_details?.po_attachment?.url && (
                <div className='bg-white shadow-md border gap-3 p-4 rounded-xl mt-3 mx-2'>
                    <div className='flex gap-4 items-center'>
                        <h1 className='font-semibold'>PO Attachment:</h1>
                        <Link target='_blank' href={paymentDetails.purchase_details.po_attachment.url} className='text-blue-500'>
                            {paymentDetails.purchase_details.po_attachment.file_name}
                        </Link>
                    </div>
                </div>
            )}
        </>
    )
}

export default AdvancePaymentBasicDetails
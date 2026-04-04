import { cookies } from 'next/headers'
import Link from 'next/link'
import React from 'react'
import BasicPoDetilails from '../molecules/view-po-details/BasicPoDetilails'
import PoItemsTable from '../molecules/view-po-details/PoItemsTable'
import { VendorPoDetailsType } from '@/src/types/view-po-details/poDetailsType'
import { fetchPoDetails } from '@/src/services/purchaseOrder/purchaseOrder.services'

interface Props {
    poname: string
}

const ViewPoDetails = async ({ poname }: Props) => {
    if (!poname?.trim()) {
        return (
            <div className="p-4 space-y-5 flex flex-col items-center justify-center min-h-[45vh] text-center">
                <p className="text-sm font-semibold text-[#475569]">No purchase order selected</p>
                <p className="text-xs text-[#94A3B8] max-w-sm">Open this page from the PO list after choosing View.</p>
                <Link
                    href="/view-po"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#475569] shadow-sm transition-colors hover:border-[#4F6BED]/40 hover:bg-[#F8FAFF] hover:text-[#4F6BED]"
                >
                    Back to purchase orders
                </Link>
            </div>
        )
    }

    const cookieStore = await cookies()
    const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join('; ')

    let poDetails: VendorPoDetailsType | null = null
    try {
        poDetails = await fetchPoDetails(poname, cookieHeaderString)
    } catch (error) {
        console.error('Error fetching PO details:', error)
    }

    if (!poDetails?.data) {
        return (
            <div className="p-4 space-y-5 flex flex-col items-center justify-center min-h-[45vh] text-center">
                <p className="text-sm font-semibold text-[#475569]">Could not load PO details</p>
                <p className="text-xs text-[#94A3B8] max-w-sm">The PO may be invalid or you may not have access.</p>
                <Link
                    href="/view-po"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#475569] shadow-sm transition-colors hover:border-[#4F6BED]/40 hover:bg-[#F8FAFF] hover:text-[#4F6BED]"
                >
                    Back to purchase orders
                </Link>
            </div>
        )
    }

    const data = poDetails.data

    return (
        <div className="p-4 space-y-5">
            <BasicPoDetilails poBasicDetails={data} />
            <PoItemsTable
                poName={poname}
                POTableData={data.items}
                po_mail_sent={data.po_mail_sent}
            />
        </div>
    )
}

export default ViewPoDetails

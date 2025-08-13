import { RFQDetails } from '@/src/types/RFQtype';
import { Database } from 'lucide-react'
import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/atoms/table";
interface Props {
    RFQData: RFQDetails;
}

const vendors = [
    { vendor_name: "ABC Corporation Ltd.", quotation_count: 12 },
    { vendor_name: "XYZ Industries", quotation_count: 8 },
    { vendor_name: "Tech Solutions Pvt Ltd", quotation_count: 15 },
    { vendor_name: "Global Suppliers Inc", quotation_count: 6 },
    { vendor_name: "Prime Vendors Co", quotation_count: 9 },
    { vendor_name: "Elite Manufacturing", quotation_count: 11 },
    { vendor_name: "Smart Solutions Ltd", quotation_count: 4 },
    { vendor_name: "Quality Products Inc", quotation_count: 7 },
]

const ViewRFQCards = ({ RFQData }: Props) => {
    return (
        <div className='mt-4'>
            <div className='flex justify-between items-center'>
                <h1 className='text-lg py-2 font-semibold'>No. of Quotation Received</h1>
                <div className="flex justify-between items-center text-sm text-gray-600 pr-2">
                    <span>Total: {vendors.length} vendors</span>
                    {/* <span>Average quotations per vendor: {(totalQuotations / RFQData.vendors.length).toFixed(1)}</span> */}
                </div>
            </div>
            {/* Vendor Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-[#DDE8FE]">
                            <TableRow>
                                <TableHead className="text-left text-xs font-medium text-gray-500 uppercase">#</TableHead>
                                <TableHead className="text-left text-xs font-medium text-gray-500 uppercase">Vendor Name</TableHead>
                                <TableHead className="text-center text-xs font-medium text-gray-500 uppercase">Quotations Submitted</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {vendors && vendors.length > 0 ? (
                                vendors.map((vendor, index) => (
                                    <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                                        <TableCell className="text-sm text-gray-500">{index + 1}</TableCell>
                                        <TableCell>
                                            <span className="text-sm font-medium text-gray-900">{vendor.vendor_name}</span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                {vendor.quotation_count}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="py-8 text-center">
                                        <div className="text-gray-500">
                                            <Database className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                            <p className="text-sm">No vendor data available</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default ViewRFQCards

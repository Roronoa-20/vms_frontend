import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/atoms/table";
import { RFQDetails } from '@/src/types/RFQtype';
import { Input } from '@/components/ui/input';
interface Props {
    RFQData: RFQDetails;
    refno?: string;
    handleVendorSearch: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
}
const ViewRFQVendors = ({ RFQData, handleVendorSearch }: Props) => {
    return (
        <div>
            <div className="flex w-full justify-between py-2 ">
                <h1 className='text-lg py-2 font-semibold'>No. of Quotation Received</h1>
                {/* <div className="flex gap-4 w-[25%]">
                    <Input placeholder="Search..." onChange={(e => { handleVendorSearch(e) })} />
                </div> */}
            </div>
            <div className="overflow-y-scroll max-h-[55vh]">
                <Table className="">
                    {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                    <TableHeader className="text-center">
                        <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
                            <TableHead className="">#</TableHead>
                            <TableHead className="text-center">Vendor Name</TableHead>
                            <TableHead className="text-center">Vendor Code</TableHead>
                            <TableHead className="text-center">Mobile</TableHead>
                            <TableHead className="text-center">Email</TableHead>
                            <TableHead className="text-center">Service Provider</TableHead>
                            <TableHead className={`text-center`}>Country</TableHead>
                            <TableHead className={`text-center`}>Quotations Submitted</TableHead>
                            {/* <TableHead className={`text-center`}>Action</TableHead> */}
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-center bg-white">
                        {RFQData.vendor_details.length > 0 ? (
                            RFQData.vendor_details?.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium text-center">{index + 1}</TableCell>
                                    <TableCell className="text-nowrap text-center">{item?.vendor_name}</TableCell>
                                    <TableCell className="text-nowrap text-center">{item?.vendor_code?.length > 0 ? item.vendor_code.join(", ") : "-"}</TableCell>
                                    <TableCell className="text-nowrap text-center">{item?.mobile_number}</TableCell>
                                    <TableCell className="text-nowrap text-center">{item?.office_email_primary}</TableCell>
                                    <TableCell className="text-nowrap text-center">{item?.service_provider_type}</TableCell>
                                    <TableCell className="text-nowrap text-center">{item?.country}</TableCell>
                                    <TableCell className="text-center">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                            {item?.quotations?.length}
                                        </span>
                                    </TableCell>
                                    {/* <TableCell className="text-nowrap text-center"><Link href={`/view-rfq?refno=${item?.name}`}><Button className="bg-white text-black hover:bg-white hover:text-black">View</Button></Link></TableCell> */}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center text-gray-500 py-4">
                                    No results found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default ViewRFQVendors

"use client"
import React, { useState,useEffect } from 'react'
import { RFQDetails } from '@/src/types/RFQtype'
import RFQBasicDetails from '../../molecules/ViewRFQ/ViewRFQDetails';
import { Button } from '@/components/ui/button';
import ViewFileAttachment from '../../molecules/ViewRFQ/ViewFileAttachment';
import ViewLogisticsQuatationVendors from '../../molecules/ViewRFQ/ViewLogisticsQuatationVendors';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { History, Repeat } from 'lucide-react';
import ViewRFQCards from '../../molecules/ViewRFQ/ViewRFQCards';
import Pagination from '../../molecules/Pagination';
import useDebounce from '@/src/hooks/useDebounce';
interface Props {
    RFQData: RFQDetails;
    refno?: string
}
const ViewLogisticsRFQDetailsPage = ({ RFQData, refno }: Props) => {
    const [currentVendorPage, setVendorCurrentPage] = useState<number>(1);
    const [vendorSearchName, setVendorSearchName] = useState('')
    const debouncedDoctorSearchName = useDebounce(vendorSearchName, 500);
    // useEffect(() => {
    //     const fetchVendorTableData = async (rfq_type: string) => {
    //         console.log(rfq_type, "rfq type", currentVendorPage, "page no ", debouncedDoctorSearchName, "vendor_name", formData?.service_provider, "rfq_type in table code api call ")
    //         const url = `${API_END_POINTS?.fetchVendorListBasedOnRFQType}?rfq_type=${rfq_type}&page_no=${currentVendorPage}&vendor_name=${debouncedDoctorSearchName}&service_provider=${formData?.service_provider}`
    //         const response: AxiosResponse = await requestWrapper({ url: url, method: "GET" });
    //         if (response?.status == 200) {
    //             setVendorList(response.data.message)
    //             console.log(response, "response of vendor table data")
    //         } else {
    //             alert("error");
    //         }
    //     }
    //         fetchVendorTableData(refno);
        
    // }, [currentVendorPage, debouncedDoctorSearchName]);
    const handleVendorSearch = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setVendorCurrentPage(1)
        setVendorSearchName(e.target.value);
    }
    return (
        <div className='px-4 pb-6 bg-gray-100'>
            <section className='flex justify-between py-4'>
                <h1 className='text-lg py-2'>RFQ RefNo : <span className='font-bold'>{refno ? refno : ""}</span>  </h1>
                {/* <div className='flex gap-4 items-center'>
                    <Button className='flex gap-1 p-2'><Repeat width={20} height={20}/>Revise RFQ </Button>
                    <Sheet>
                        <SheetTrigger className='p-2 bg-black text-white text-sm rounded-md flex gap-1'><History width={20} height={20}/>RFQ History</SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>RFQ History will be shown here</SheetTitle>
                                <SheetDescription>
                                    This action cannot be undone. This will permanently delete your account
                                    and remove your data from our servers.
                                </SheetDescription>
                            </SheetHeader>
                        </SheetContent>
                    </Sheet>
                </div> */}
            </section>
            <RFQBasicDetails RFQData={RFQData} />
            <ViewFileAttachment RFQData={RFQData} />
            <ViewRFQCards />
            <ViewLogisticsQuatationVendors RFQData={RFQData} handleVendorSearch={handleVendorSearch}/>
            {/* <Pagination currentPage={currentVendorPage} setCurrentPage={setVendorCurrentPage} record_per_page={VendorList?.data.length ? VendorList?.data.length : 0} total_event_list={VendorList?.total_count ? VendorList?.total_count : 0} /> */}
        </div>
    )
}

export default ViewLogisticsRFQDetailsPage

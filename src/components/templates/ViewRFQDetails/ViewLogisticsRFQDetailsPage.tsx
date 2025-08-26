"use client"
import React, { useState, useEffect } from 'react'
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
import ViewRFQVendors from '../../molecules/ViewRFQ/ViewRFQVendors';
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios';
import requestWrapper from '@/src/services/apiCall';
import { QuotationDetail } from '@/src/types/QuatationTypes';
import { useRouter } from 'next/navigation';
import FinalNegotiatedRateFormLogistics from '../../molecules/ViewRFQ/FinalNegotiatedRateFormLogistics';
import { ApproveConfirmationDialog } from '../../common/ApproveConfirmationDialog';
import { Badge } from '@/components/ui/badge';
import LogisticsReviseRFQ from '../RFQTemplates/LogisticsReviseRFQ';
import { PurchaseRequestDropdown } from '@/src/types/PurchaseRequestType';
import ViewMaterialPRItemsTable from '../../molecules/ViewRFQ/ViewMaterialPRItemsTable';
import ViewServicePRItemsTable from '../../molecules/ViewRFQ/ViewServicePRItemsTable';
import MaterialReviseRFQ from '../RFQTemplates/MaterialReviseRFQ';
import ServiceReviseRFQ from '../RFQTemplates/ServiceReviseRFQ';


interface Props {
    RFQData: RFQDetails;
    refno?: string;
    Dropdown: PurchaseRequestDropdown["message"]
}

const ViewLogisticsRFQDetailsPage = ({ RFQData, refno, Dropdown }: Props) => {
    const [currentVendorPage, setVendorCurrentPage] = useState<number>(1);
    const [vendorSearchName, setVendorSearchName] = useState('')
    const [QuatationVendorList, setQuatationVendorList] = useState<QuotationDetail[]>([])
    const debouncedDoctorSearchName = useDebounce(vendorSearchName, 500);
    const [selectedVendorName, setSelectedVendorName] = useState<string>("");
    type RFQKey = keyof RFQDetails;
    const requiredKeysForNegotataion: RFQKey[] = [
        "final_quotation_id",
        "final_ffn",
        "final_rate_kg",
        "final_chargeable_weight",
        "final_freight_fcr",
        "final_fsc",
        "final_sc",
        "final_xcr",
        "final_pickup",
        "final_xray",
        "final_sum_freight_inr",
        "final_gst_amount",
        "final_total",
        "final_others",
        "final_airline",
        "final_landing_price",
        "final_dc",
        "final_transit_days",
        "final_freight_total",
        "final_remarks",
        "final_tat",
    ];
    const filteredData = Object.fromEntries(
        requiredKeysForNegotataion.map((key) => [key, String(RFQData[key] ?? "")])
    );
    const [formData, setFormData] = useState<Record<string, string>>(filteredData);
    const [open, setOpen] = useState(false);
    const [finalNegotation, setFinalNegotation] = useState(false);
    const [reviseDialog, setReviseDialog] = useState(false);
    const router = useRouter()
    useEffect(() => {
        const fetchVendorTableData = async () => {
            const url = `${API_END_POINTS?.fetchQuatationVendorList}?rfq_number=${RFQData?.name}`
            const response: AxiosResponse = await requestWrapper({ url: url, method: "GET" });
            if (response?.status == 200) {
                setQuatationVendorList(response?.data?.message?.data ? response?.data?.message?.data : [])
            } else {
                alert("error");
            }
        }
        fetchVendorTableData();
    }, [currentVendorPage, debouncedDoctorSearchName, RFQData?.name]);
    const handleVendorSearch = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setVendorCurrentPage(1)
        setVendorSearchName(e.target.value);
    }
    const handleSubmit = async () => {
        const formdata = new FormData();
        const fullData = {
            name: selectedVendorName
        };
        console.log(fullData, "fullData")
        formdata.append('data', JSON.stringify(fullData));

        const url = `${API_END_POINTS?.ApproveQuotation}`;
        const response: AxiosResponse = await requestWrapper({ url: url, data: formdata, method: "POST" });
        if (response?.status == 200) {
            console.log(response, "response")
            alert("Approved Successfull");
            router.push("/dashboard")
        } else {
            alert("Not able to Submit");
            location.reload();
        }
    }
    const handleNegotationSubmit = async () => {
        const formdata = new FormData();
        const fullData = {
            ...formData,
        };

        console.log(fullData, "fullData")
        formdata.append('data', JSON.stringify(fullData));

        const url = `${API_END_POINTS?.NegotiateQuotation}`;
        const response: AxiosResponse = await requestWrapper({ url: url, data: formdata, method: "POST" });
        if (response?.status == 200) {
            console.log(response, "response")
            alert("Submited Successfull");
            router.push("/dashboard")
        } else {
            alert("Not able to Submit");
            location.reload();
        }
    }
    console.log(QuatationVendorList, 'QuatationVendorList')
    return (
        <div className='px-4 pb-6 bg-white'>
            <section className='flex justify-between py-4'>
                <h1 className='text-lg py-2'>RFQ RefNo : <span className='font-bold pr-2'>{refno ? refno : ""}</span>
                    {RFQData?.status && (
                        <Badge
                            variant="outline"
                            title={RFQData?.status}
                            className={`items-center gap-1 text-sm border ${RFQData?.status === "Approved"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : RFQData?.status === "Pending"
                                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                    : "bg-gray-50 text-gray-700 border-gray-200"
                                }`}
                        >
                            <span>{RFQData?.status}</span>
                        </Badge>
                    )}
                </h1>
                {RFQData?.status != "Approved" && <div className='flex gap-4 items-center'>
                    <Button className='flex gap-1 p-2' disabled={RFQData.rfq_type != "Logistics Vendor" ? true : false} onClick={() => setReviseDialog(true)}><Repeat width={20} height={20} />Revise RFQ </Button>
                    {/* <Sheet>
                        <SheetTrigger className='p-2 bg-black text-white text-sm rounded-md flex gap-1'><History width={20} height={20} />RFQ History</SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>RFQ History will be shown here</SheetTitle>
                                <SheetDescription>
                                    This action cannot be undone. This will permanently delete your account
                                    and remove your data from our servers.
                                </SheetDescription>
                            </SheetHeader>
                        </SheetContent>
                    </Sheet> */}
                </div>}
            </section>
            <RFQBasicDetails RFQData={RFQData} />
            <ViewFileAttachment RFQData={RFQData} />
            {/* <ViewRFQCards RFQData={RFQData} /> */}
            <ViewRFQVendors RFQData={RFQData} handleVendorSearch={handleVendorSearch} />
            {RFQData?.rfq_type === "Service Vendor" ? (
                <ViewServicePRItemsTable RFQData={RFQData} />
            ) : RFQData?.rfq_type === "Material Vendor" ? (
                <ViewMaterialPRItemsTable RFQData={RFQData} />
            ) : null}

            <ViewLogisticsQuatationVendors QuatationData={QuatationVendorList} handleVendorSearch={handleVendorSearch} logistic_type={RFQData?.logistic_type ? RFQData?.logistic_type : "Export"} selectedVendorName={selectedVendorName ? selectedVendorName : ""} setSelectedVendorName={setSelectedVendorName} RFQData={RFQData} />
            {/* <Pagination currentPage={currentVendorPage} setCurrentPage={setVendorCurrentPage} record_per_page={QuatationVendorList?.length ? QuatationVendorList?.length : 0} total_event_list={QuatationVendorList?.total_count ? QuatationVendorList?.total_count : 0} /> */}
            {(RFQData?.is_approved && (RFQData?.rfq_type != "Service Vendor" && RFQData?.rfq_type != "Material Vendor")) &&
                <>
                    <FinalNegotiatedRateFormLogistics logisticType={RFQData.logistic_type ? RFQData.logistic_type : "Export"} formData={formData} setFormData={setFormData} mode_of_shipment={RFQData?.final_mode_of_shipment} />
                    {!RFQData?.is_negotiated && <div className='flex justify-end py-4'><Button type='button' className={`flex bg-blue-400 hover:bg-blue-400 px-10 font-medium`} onClick={() => setFinalNegotation(true)}>Submit</Button></div>}
                </>
            }
            {RFQData?.status != "Approved" && <div className='flex justify-end py-4'><Button type='button' className={`flex bg-blue-400 hover:bg-blue-400 px-10 font-medium  ${!selectedVendorName ? "cursor-not-allowed" : "cursor-pointer"}`} disabled={!selectedVendorName} onClick={() => setOpen(true)}>Approve</Button></div>}
            <ApproveConfirmationDialog
                open={open}
                onClose={() => setOpen(false)}
                handleSubmit={handleSubmit}
            />
            <ApproveConfirmationDialog
                open={finalNegotation}
                onClose={() => setFinalNegotation(false)}
                handleSubmit={handleNegotationSubmit}
                title='Are you sure you want to Submit?'
                buttontext="Submit"
            />
            {(reviseDialog && RFQData?.rfq_type === "Logistics Vendor") && <LogisticsReviseRFQ
                open={reviseDialog}
                onClose={() => setReviseDialog(false)}
                Dropdown={Dropdown}
                RFQData={RFQData}
            />}

            {(reviseDialog && RFQData?.rfq_type === "Material Vendor") &&
                <MaterialReviseRFQ
                    open={reviseDialog}
                    onClose={() => setReviseDialog(false)}
                    Dropdown={Dropdown}
                    RFQData={RFQData}
                />}

            {(reviseDialog && RFQData?.rfq_type === "Service Vendor") &&
                <ServiceReviseRFQ
                    open={reviseDialog}
                    onClose={() => setReviseDialog(false)}
                    Dropdown={Dropdown}
                    RFQData={RFQData}
                />}
        </div>
    )
}

export default ViewLogisticsRFQDetailsPage

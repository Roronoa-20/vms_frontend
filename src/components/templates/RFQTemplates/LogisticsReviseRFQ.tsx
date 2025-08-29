import React from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { LogisticsExportRFQFormFields } from './LogisticsExportRFQFormFields';
import LogisticsImportRFQFormFields from './LogisticsImportRFQFormFields';
import { PurchaseRequestDropdown } from '@/src/types/PurchaseRequestType';
import { ExportPort, RFQDetails, VendorApiResponse, VendorSelectType } from '@/src/types/RFQtype';
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'
import useDebounce from '@/src/hooks/useDebounce';
import { newVendorTable } from './LogisticsImportRFQ';
import VendorTable from '../../molecules/rfq/VendorTable';
import SingleSelectVendorTable from '../../molecules/rfq/SingleSelectVendorTable';
import Pagination from '../../molecules/Pagination';
import NewVendorTable from '../../molecules/rfq/NewVendorTable';
import AddNewVendorRFQDialog from '../../molecules/AddNewVendorRFQDialog';
interface Props {
    RFQData: RFQDetails
    open: boolean;
    onClose: () => void;
    Dropdown: PurchaseRequestDropdown["message"]
}
const sanitizeData = (data: RFQDetails): Record<string, string> => {
    const result: Record<string, string> = {};
    Object.entries(data).forEach(([key, value]) => {
        if (typeof value === "string" || value === null) {
            result[key] = value ?? "";
        }
    });
    return result;
};
const LogisticsReviseRFQ = ({ open, onClose, Dropdown, RFQData }: Props) => {

    // const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Record<string, string>>(sanitizeData(RFQData));
    const [vendorSearchName, setVendorSearchName] = useState('')
    const [currentVendorPage, setVendorCurrentPage] = useState<number>(1);
    const [VendorList, setVendorList] = useState<VendorApiResponse>();
    const [loading, setLoading] = useState(true);
    const debouncedDoctorSearchName = useDebounce(vendorSearchName, 500);
    const [isDialog, setIsDialog] = useState<boolean>(false);
    const [newVendorTable, setNewVendorTable] = useState<newVendorTable[]>([])
    const [exportCountry, setExportCountry] = useState<ExportPort[]>([])
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    useEffect(() => {
        const fetchVendorTableData = async (rfq_type: string) => {
            setSelectedRows({ vendors: [] })
            const url = `${API_END_POINTS?.fetchVendorListBasedOnRFQType}?rfq_type=${rfq_type}&page_no=${currentVendorPage}&vendor_name=${debouncedDoctorSearchName}&service_provider=${formData?.service_provider}&company=${formData?.company_name_logistic}`
            const response: AxiosResponse = await requestWrapper({ url: url, method: "GET" });
            if (response?.status == 200) {
                setVendorList(response.data.message)
                console.log(response, "response of vendor table data")
            } else {
                alert("error");
            }
        }
        if (formData?.service_provider != "Select" && formData?.service_provider) {
            fetchVendorTableData(formData?.rfq_type ? formData?.rfq_type : "Logistics Vendor");
        }
    }, [currentVendorPage, debouncedDoctorSearchName, formData?.service_provider]);


    const [selectedRows, setSelectedRows] = useState<VendorSelectType>(
        {
            vendors: []
        }
    );

    const handleVendorSearch = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setVendorCurrentPage(1)
        setVendorSearchName(e.target.value);
    }
    useEffect(() => {
        const fetchExportCountry = async () => {
            const url = `${API_END_POINTS?.CountryExportDropdown}`
            const response: AxiosResponse = await requestWrapper({ url: url, method: "GET" });
            if (response?.status == 200) {
                setExportCountry(response.data.message)
            } else {
                alert("error");
            }
        }
        fetchExportCountry();
    }, []);
    const handleSubmit = async () => {

        if (formData?.service_provider == "All Service Provider" || formData?.service_provider == "Select" || formData?.service_provider == "Premium Service Provider") {
            setSelectedRows({ vendors: [] })
        }
        const url = `${API_END_POINTS?.ReviseRFQ}`;
        const response: AxiosResponse = await requestWrapper({ url: url, data: { data: { ...formData, non_onboarded_vendors: newVendorTable, vendors: selectedRows.vendors } }, method: "POST" });
        if (response?.status == 200) {
            alert("Submit Successfull RFQ Revised");
            location.reload()
        } else {
            alert("error");
        }
    }

    const handleOpen = () => {
        setIsDialog(true);
    }

    const handleClose = () => {
        setIsDialog(false);
    }
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-screen-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        <div className='flex justify-between items-center pr-4'>
                            <h1 className='font-bold text-[24px] p-4 '>Revise RFQ</h1>
                            <Button onClick={handleOpen}>Add New Vendor</Button>
                        </div>
                    </DialogTitle>
                </DialogHeader>
                {RFQData?.logistic_type === 'Export' ? <LogisticsExportRFQFormFields
                    formData={formData}
                    setFormData={setFormData}
                    Dropdown={Dropdown}
                    setUploadedFiles={setUploadedFiles}
                    uploadedFiles={uploadedFiles}
                    exportCountry={exportCountry ?? []}
                /> :
                    <LogisticsImportRFQFormFields
                        formData={formData}
                        setFormData={setFormData}
                        Dropdown={Dropdown}
                        setUploadedFiles={setUploadedFiles}
                        uploadedFiles={uploadedFiles}
                    />}

                {formData?.service_provider === "Adhoc Service Provider" && <VendorTable VendorList={VendorList?.data ? VendorList?.data : []} loading={loading} setSelectedRows={setSelectedRows} selectedRows={selectedRows} handleVendorSearch={handleVendorSearch} />}
                {formData?.service_provider === "Courier Service Provider" && <SingleSelectVendorTable VendorList={VendorList?.data ? VendorList?.data : []} loading={loading} setSelectedRows={setSelectedRows} selectedRows={selectedRows} handleVendorSearch={handleVendorSearch} />}
                {formData?.service_provider === "Courier Service Provider" || formData?.service_provider === "Adhoc Service Provider" && <div className='px-4'>
                    <Pagination currentPage={currentVendorPage} setCurrentPage={setVendorCurrentPage} record_per_page={VendorList?.data.length ? VendorList?.data.length : 0} total_event_list={VendorList?.total_count ? VendorList?.total_count : 0} />
                </div>}
                <div className='py-6'>
                    <NewVendorTable newVendorTable={newVendorTable} />
                </div>

                {
                    isDialog &&
                    <AddNewVendorRFQDialog Dropdown={Dropdown} setNewVendorTable={setNewVendorTable} handleClose={handleClose} />
                }
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    {/* <Button onClick={onApprove} disabled={loading}>
                        {loading ? 'Approving...' : 'Approve'}
                    </Button> */}
                    {/* <div className='flex justify-end pt-10 px-4'> */}
                    <Button type='button' className='flex bg-blue-400 hover:bg-blue-400 px-10 font-medium' onClick={() => { handleSubmit() }}>Submit RFQ</Button>
                    {/* </div> */}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default LogisticsReviseRFQ

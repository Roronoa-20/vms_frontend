import React from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { PurchaseRequestDropdown } from '@/src/types/PurchaseRequestType';
import { RFQDetails, SAPPRData, VendorApiResponse, VendorSelectType } from '@/src/types/RFQtype';
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'
import useDebounce from '@/src/hooks/useDebounce';
import { newVendorTable } from './LogisticsImportRFQ';
import VendorTable from '../../molecules/rfq/VendorTable';
import Pagination from '../../molecules/Pagination';
import NewVendorTable from '../../molecules/rfq/NewVendorTable';
import AddNewVendorRFQDialog from '../../molecules/AddNewVendorRFQDialog';
import PRServiceManager, { SelectedMaterial } from './PRServiceManager';
import ServiceRFQFormFields from './ServiceRFQFormFields';
import { useRouter } from 'next/navigation';
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
const ServiceReviseRFQ = ({ open, onClose, Dropdown, RFQData }: Props) => {

    // const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Record<string, string>>(sanitizeData(RFQData));
    const [vendorSearchName, setVendorSearchName] = useState('')
    const [currentVendorPage, setVendorCurrentPage] = useState<number>(1);
    const [VendorList, setVendorList] = useState<VendorApiResponse>();
    const [loading, setLoading] = useState(true);
    const [selectedRows, setSelectedRows] = useState<VendorSelectType>(
        {
            vendors: []
        }
    );
    const [availablePRs, setAvailablePRs] = useState<SAPPRData[]>([])
    const [selectedMaterials, setSelectedMaterials] = useState<SelectedMaterial[]>([])
    const debouncedDoctorSearchName = useDebounce(vendorSearchName, 500);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const [isDialog, setIsDialog] = useState<boolean>(false);
    const [newVendorTable, setNewVendorTable] = useState<newVendorTable[]>([])
    const router = useRouter()
    useEffect(() => {
        const fetchVendorTableData = async (rfq_type: string) => {
            const url = `${API_END_POINTS?.fetchVendorListBasedOnRFQType}?rfq_type=${rfq_type}&page_no=${currentVendorPage}&vendor_name=${debouncedDoctorSearchName}&company=${formData?.company_name}`
            const response: AxiosResponse = await requestWrapper({ url: url, method: "GET" });
            if (response?.status == 200) {
                setVendorList(response.data.message)
            } else {
                alert("error");
            }
        }
        if (formData?.company_name) {
            fetchVendorTableData(formData?.rfq_type ? formData?.rfq_type : "Service Vendor");
        }
    }, [currentVendorPage, debouncedDoctorSearchName, formData?.company_name]);

    useEffect(() => {
        const fetchPRDropdown = async (rfq_type: string) => {
            const url = `${API_END_POINTS?.fetchPRDropdown}?rfq_type=${rfq_type}`
            const response: AxiosResponse = await requestWrapper({ url: url, method: "GET" });
            if (response?.status == 200) {
                setAvailablePRs(response.data.message.pr_numbers)
            } else {
                alert("error");
            }
        }
        fetchPRDropdown(formData?.rfq_type ? formData?.rfq_type : "Service Vendor");
    }, []);

    const handleVendorSearch = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setVendorCurrentPage(1)
        setVendorSearchName(e.target.value);
    }

    const handleSubmit = async () => {
        const formdata = new FormData();
        const fullData = {
            ...formData,
            vendors: selectedRows.vendors,
            pr_items: selectedMaterials,
            non_onboarded_vendors: newVendorTable,
        };
        formdata.append('data', JSON.stringify(fullData));

        // Append file only if exists
        if (uploadedFiles) {
            uploadedFiles?.forEach((file) => {
                formdata.append("file", file);
            });
        }

        const url = `${API_END_POINTS?.ReviseRFQ}`;
        const response: AxiosResponse = await requestWrapper({ url: url, data: formdata, method: "POST" });
        if (response?.status == 200) {
            alert("Submit Successfull");
            router.push("/dashboard")
        } else {
            alert("error");
        }

    }
    const setItems = async (materials: SelectedMaterial[]) => {
        setSelectedMaterials(materials)
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
                <div className="w-full mx-auto space-y-6 p-5">
                    {/* PR Materials Manager Component */}
                    <PRServiceManager
                        prNumbers={availablePRs}
                        onSelectionChange={setItems}
                        title="Select Purchase Request Numbers"
                    />
                </div>
                <ServiceRFQFormFields
                    formData={formData}
                    setFormData={setFormData}
                    Dropdown={Dropdown}
                    setUploadedFiles={setUploadedFiles}
                    uploadedFiles={uploadedFiles}
                />
                <VendorTable VendorList={VendorList?.data ? VendorList?.data : []} loading={loading} setSelectedRows={setSelectedRows} selectedRows={selectedRows} handleVendorSearch={handleVendorSearch} />
                <div className='px-4'>
                    <Pagination currentPage={currentVendorPage} setCurrentPage={setVendorCurrentPage} record_per_page={VendorList?.data.length ? VendorList?.data.length : 0} total_event_list={VendorList?.total_count ? VendorList?.total_count : 0} />
                </div>
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
                    <Button type='button' className='flex bg-blue-400 hover:bg-blue-400 px-10 font-medium' onClick={() => { handleSubmit() }}>Revise RFQ</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ServiceReviseRFQ

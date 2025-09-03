import React from "react";
import {
    Vendor,
    AllVendorsCompanyCodeResponse,
    CompanyVendorCodeRecord,
} from "@/src/types/allvendorstypes";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/atoms/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FileText, CheckSquare, Square } from "lucide-react";
import PopUp from "@/src/components/molecules/PopUp";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";

interface Props {
    vendors: Vendor[];
    activeTab: string;
}

const VendorTable: React.FC<Props> = ({ vendors, activeTab }) => {
    console.log("Vendors in Table:", vendors);
    console.log("Active Tab in Table:", activeTab);
    const router = useRouter();

    const [isVendorCodeDialog, setIsVendorCodeDialog] = React.useState(false);
    const [selectedVendorCodes, setSelectedVendorCodes] =
        React.useState<CompanyVendorCodeRecord[] | null>(null);

    if (!vendors?.length) {
        return <p>No vendors found for company code {activeTab}.</p>;
    }

    const rows = vendors.flatMap((vendor) =>
        (vendor.multiple_company_data ?? [])
            .filter((c) => c.company_name === activeTab)
            .map((c) => {
                // find the first approved onboarding record
                const approvedRecord = vendor.vendor_onb_records?.find(
                    (record) => record.onboarding_form_status === "Approved"
                );

                // only include the row if an approved record exists
                if (!approvedRecord) return null;

                return {
                    name: vendor.name,
                    ref_no: approvedRecord.vendor_onboarding_no || "N.A.",
                    multiple_company: vendor.bank_details?.registered_for_multi_companies ?? 0,
                    company_code: c.company_name,
                    vendor_code: c.company_vendor_code || "N.A.",
                    vendor_name: vendor.vendor_name || "N.A.",
                    office_email_primary: vendor.office_email_primary || "N.A.",
                    pan_number: vendor.bank_details?.company_pan_number || "N.A.",
                    pan_file: vendor.bank_details?.bank_proof || "",
                    gst_no: vendor.document_details || "N.A.",
                    gst_file: "",
                    state: c.company_display_name || "N.A.",
                    country: vendor.country || "N.A.",
                    pincode: vendor.mobile_number || "N.A.",
                    trc_certificate_no: "",
                    msme_type: "",
                    udyam_no: "",
                    enterprise_reg_no: "",
                    iec_code: "",
                    bank_name: vendor.bank_details?.bank_name || "N.A.",
                    ifsc_code: vendor.bank_details?.ifsc_code || "N.A.",
                    bank_file: vendor.bank_details?.bank_proof || "",
                };
            })
            .filter(Boolean) // remove nulls where no approved record exists
    );
    console.log("Table Rows:", rows);

    const renderValue = (val: string) => {
        if (!val || val.trim() === "") return "N.A.";
        return val;
    };

    const renderFile = (url: string) =>
        url?.trim() ? (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center items-center text-blue-600"
            >
                <FileText className="w-5 h-5" />
            </a>
        ) : (
            "Not Available"
        );

    const handleView = (refno: string, vendorId: string) => {
        router.push(
            `/view-onboarding-details?tabtype=Company%20Detail&vendor_onboarding=${vendorId}&refno=${refno}`
        );
    };

    const handleClose = () => setIsVendorCodeDialog(false);

    const fetchVendorCodes = async (vendorId: string, company: string) => {
        try {
            const url = `${API_END_POINTS?.allvendorscompanycodedetails}?v_id=${vendorId}&company=${company}`;
            const res: AxiosResponse<AllVendorsCompanyCodeResponse> = await requestWrapper({
                url,
                method: "GET",
            });

            setSelectedVendorCodes(res.data.message?.data?.company_vendor_codes ?? []);
            setIsVendorCodeDialog(true);
        } catch (err) {
            console.error("Error fetching vendor codes:", err);
        }
    };

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow className="bg-[#a4c0fb] text-[14px] hover:bg-[#a4c0fb]">
                        <TableHead className="text-black text-center whitespace-nowrap">
                            Sr. No.
                        </TableHead>
                        <TableHead className="text-black text-center">
                            Multi-Company?
                        </TableHead>
                        <TableHead className="text-black text-center whitespace-nowrap">
                            Company Code
                        </TableHead>
                        <TableHead className="text-black text-center whitespace-nowrap">
                            Ref No
                        </TableHead>
                        <TableHead className="text-black text-center whitespace-nowrap">
                            Vendor Code
                        </TableHead>
                        <TableHead className="text-black text-center whitespace-nowrap">
                            Vendor Name
                        </TableHead>
                        <TableHead className="text-black text-center whitespace-nowrap">
                            Official Email
                        </TableHead>
                        <TableHead className="text-black text-center whitespace-nowrap">
                            PAN Number
                        </TableHead>
                        <TableHead className="text-black text-center whitespace-nowrap">
                            PAN File
                        </TableHead>
                        <TableHead className="text-black text-center whitespace-nowrap">
                            GST Number
                        </TableHead>
                        <TableHead className="text-black text-center whitespace-nowrap">
                            GST File
                        </TableHead>
                        <TableHead className="text-black text-center whitespace-nowrap">
                            State
                        </TableHead>
                        <TableHead className="text-black text-center whitespace-nowrap">
                            Country
                        </TableHead>
                        <TableHead className="text-black text-center whitespace-nowrap">
                            Pincode/ZipCode
                        </TableHead>
                        <TableHead className="text-black text-center whitespace-nowrap">
                            TRC Certificate No.
                        </TableHead>
                        <TableHead className="text-black text-center whitespace-nowrap">
                            MSME Type
                        </TableHead>
                        <TableHead className="text-black text-center whitespace-nowrap">
                            Udyam No.
                        </TableHead>
                        <TableHead className="text-black text-center whitespace-nowrap">
                            Entity Registration No.
                        </TableHead>
                        <TableHead className="text-black text-center whitespace-nowrap">
                            IEC Code
                        </TableHead>
                        <TableHead className="text-black text-center whitespace-nowrap">
                            Bank Name
                        </TableHead>
                        <TableHead className="text-black text-center whitespace-nowrap">
                            IFSC Code
                        </TableHead>
                        <TableHead className="text-black text-center whitespace-nowrap">
                            Bank File
                        </TableHead>
                        <TableHead className="text-black text-center whitespace-nowrap">
                            View Details
                        </TableHead>
                        <TableHead className="text-black text-center whitespace-nowrap">
                            Extend (Copy to other company)
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow
                            key={`${row?.name}-${row?.company_code}-${row?.vendor_code}-${index}`}
                        >
                            <TableCell className="text-center whitespace-nowrap">
                                {index + 1}
                            </TableCell>
                            <TableCell className="text-center">
                                {row && row.multiple_company === 1 ? (
                                    <CheckSquare className="w-4 h-4 text-blue-600 mx-auto" />
                                ) : (
                                    <Square className="w-4 h-4 text-gray-400 mx-auto" />
                                )}
                            </TableCell>
                            <TableCell className="text-center whitespace-nowrap">
                                {row ? renderValue(row.company_code) : "N.A."}
                            </TableCell>
                            <TableCell className="text-center whitespace-nowrap">
                                {row ? renderValue(row.ref_no) : "N.A."}
                            </TableCell>
                            <TableCell className="text-center">
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        row && fetchVendorCodes(row.name, row.company_code)
                                    }
                                >
                                    Vendor Codes
                                </Button>
                            </TableCell>
                            <TableCell className="text-center whitespace-nowrap">
                                {row ? renderValue(row.vendor_name) : "N.A."}
                            </TableCell>
                            <TableCell className="text-center whitespace-nowrap">
                                {row ? renderValue(row.office_email_primary) : "N.A."}
                            </TableCell>
                            <TableCell className="text-center whitespace-nowrap">
                                {row ? renderValue(row.pan_number) : "N.A."}
                            </TableCell>
                            <TableCell className="text-center whitespace-nowrap">
                                {row ? renderFile(row.pan_file) : "N.A."}
                            </TableCell>
                            <TableCell className="text-center whitespace-nowrap">
                                {row ? renderValue(row.gst_no) : "N.A."}
                            </TableCell>
                            <TableCell className="text-center whitespace-nowrap">
                                {row ? renderFile(row.gst_file) : "N.A."}
                            </TableCell>
                            <TableCell className="text-center whitespace-nowrap">
                                {row ? renderValue(row.state) : "N.A."}
                            </TableCell>
                            <TableCell className="text-center whitespace-nowrap">
                                {row ? renderValue(row.country) : "N.A."}
                            </TableCell>
                            <TableCell className="text-center whitespace-nowrap">
                                {row ? renderValue(row.pincode) : "N.A."}
                            </TableCell>
                            <TableCell className="text-center whitespace-nowrap">
                                {row ? renderValue(row.trc_certificate_no) : "N.A."}
                            </TableCell>
                            <TableCell className="text-center whitespace-nowrap">
                                {row ? renderValue(row.msme_type) : "N.A."}
                            </TableCell>
                            <TableCell className="text-center whitespace-nowrap">
                                {row ? renderValue(row.udyam_no) : "N.A."}
                            </TableCell>
                            <TableCell className="text-center whitespace-nowrap">
                                {row ? renderValue(row.enterprise_reg_no) : "N.A."}
                            </TableCell>
                            <TableCell className="text-center whitespace-nowrap">
                                {row ? renderValue(row.iec_code) : "N.A."}
                            </TableCell>
                            <TableCell className="text-center whitespace-nowrap">
                                {row ? renderValue(row.bank_name) : "N.A."}
                            </TableCell>
                            <TableCell className="text-center whitespace-nowrap">
                                {row ? renderValue(row.ifsc_code) : "N.A."}
                            </TableCell>
                            <TableCell className="text-center whitespace-nowrap">
                                {row ? renderFile(row.bank_file) : "N.A."}
                            </TableCell>
                            <TableCell>
                                <Button
                                    onClick={() => row && handleView(row.ref_no, row.name)}
                                    variant="outline"
                                >
                                    View Details
                                </Button>
                            </TableCell>
                            <TableCell className="text-center">
                                <Button variant="outline">Copy</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {isVendorCodeDialog && (
                <PopUp handleClose={handleClose} classname="overflow-y-scroll">
                    <Table>
                        <TableBody>
                            {selectedVendorCodes?.map((company) => (
                                <React.Fragment
                                    key={company.company_info.company_code}
                                >
                                    <TableRow className="bg-gray-700 hover:bg-gray-700 text-white font-semibold">
                                        <TableCell colSpan={3}>
                                            Company Code:{" "}
                                            {company.company_info.company_code}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableHead>State</TableHead>
                                        <TableHead>GST No</TableHead>
                                        <TableHead>Vendor Code</TableHead>
                                    </TableRow>

                                    {company.vendor_code_table.map(
                                        (vendor, vIdx) => (
                                            <TableRow
                                                key={vIdx}
                                                className={
                                                    vIdx % 2 === 0
                                                        ? "bg-gray-100"
                                                        : ""
                                                }
                                            >
                                                <TableCell>{vendor.state}</TableCell>
                                                <TableCell>{vendor.gst_no}</TableCell>
                                                <TableCell>
                                                    {vendor.vendor_code || "-"}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </PopUp>
            )}
        </>
    );
};

export default VendorTable;
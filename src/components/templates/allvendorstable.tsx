import React from "react";
import { VendorOnboarding } from "@/src/types/allvendorstypes";
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
import { FileText } from "lucide-react";

interface Props {
    vendors: VendorOnboarding[];
    activeTab: string;
}

const VendorTable: React.FC<Props> = ({ vendors, activeTab }) => {
    const router = useRouter();

    if (!vendors.length) {
        return <p>No vendors found for company code {activeTab}.</p>;
    }

    const rows = vendors.flatMap((vendor) =>
        vendor.company_vendor_codes
            .filter((c) => c.company_code === activeTab)
            .flatMap((c) =>
                c.vendor_codes.map((v) => {
                    const gstDetail = vendor.document_details_data?.gst_table?.[0];
                    return {
                        name: vendor.name,
                        ref_no: vendor.ref_no,
                        company_code: c.company_code,
                        vendor_code: v.vendor_code || "N.A.",
                        vendor_name: vendor.vendor_master.vendor_name || "N.A.",
                        office_email_primary: vendor.vendor_master.office_email_primary || "N.A.",
                        pan_number: vendor.document_details_data?.company_pan_number || "N.A.",
                        pan_file: vendor.document_details_data?.pan_proof?.url || "",
                        gst_no: v.gst_no || "N.A.",
                        gst_file: gstDetail?.gst_document?.url || "",
                        state: gstDetail?.gst_state || vendor.company_details?.state || "N.A.",
                        country: vendor.company_details?.country || "N.A.",
                        pincode: vendor.company_details?.pincode || "N.A.",
                        trc_certificate_no: vendor.document_details_data?.trc_certificate_no || "N.A.",
                        msme_type: vendor.document_details_data?.msme_enterprise_type || "N.A.",
                        udyam_no: vendor.document_details_data?.udyam_number || "N.A.",
                        enterprise_reg_no:
                            vendor.document_details_data?.enterprise_registration_number || "N.A.",
                        iec_code: vendor.document_details_data?.iec || "N.A.",
                        bank_name: vendor.payment_details_data?.bank_name || "N.A.",
                        ifsc_code: vendor.payment_details_data?.ifsc_code || "N.A.",
                        bank_file: vendor.payment_details_data?.bank_proof?.url || "",
                    };
                })
            )
    );

    const renderValue = (val: string) => {
        if (!val || val.trim() === "") return "N.A.";
        return val;
    };

    const renderFile = (url: string) => {
        return url && url.trim() !== "" ? (
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
    };

    const handleView = (refno: string, vendor_Onboarding: string) => {
        router.push(
            `/view-onboarding-details?tabtype=Company%20Detail&vendor_onboarding=${vendor_Onboarding}&refno=${refno}`
        );
    };

    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-[#a4c0fb] text-[14px] hover:bg-[#a4c0fb]">
                    <TableHead className="text-black text-center whitespace-nowrap">Sr. No.</TableHead>
                    <TableHead className="text-black text-center whitespace-nowrap">Company Code</TableHead>
                    <TableHead className="text-black text-center whitespace-nowrap">Vendor Code</TableHead>
                    <TableHead className="text-black text-center whitespace-nowrap">Vendor Name</TableHead>
                    <TableHead className="text-black text-center whitespace-nowrap">Official Email</TableHead>
                    <TableHead className="text-black text-center whitespace-nowrap">PAN Number</TableHead>
                    <TableHead className="text-black text-center whitespace-nowrap">PAN File</TableHead>
                    <TableHead className="text-black text-center whitespace-nowrap">GST Number</TableHead>
                    <TableHead className="text-black text-center whitespace-nowrap">GST File</TableHead>
                    <TableHead className="text-black text-center whitespace-nowrap">State</TableHead>
                    <TableHead className="text-black text-center whitespace-nowrap">Country</TableHead>
                    <TableHead className="text-black text-center whitespace-nowrap">Pincode/ZipCode</TableHead>
                    <TableHead className="text-black text-center whitespace-nowrap">TRC Certificate No.</TableHead>
                    <TableHead className="text-black text-center whitespace-nowrap">MSME Type</TableHead>
                    <TableHead className="text-black text-center whitespace-nowrap">Udyam No.</TableHead>
                    <TableHead className="text-black text-center whitespace-nowrap">Entity Registration No.</TableHead>
                    <TableHead className="text-black text-center whitespace-nowrap">IEC Code</TableHead>
                    <TableHead className="text-black text-center whitespace-nowrap">Bank Name</TableHead>
                    <TableHead className="text-black text-center whitespace-nowrap">IFSC Code</TableHead>
                    <TableHead className="text-black text-center whitespace-nowrap">Bank File</TableHead>
                    <TableHead className="text-black text-center whitespace-nowrap">View Details</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows.map((row, index) => (
                    <TableRow key={`${row.company_code}-${row.vendor_code}-${index}`}>
                        <TableCell className="text-center whitespace-nowrap">{index + 1}</TableCell>
                        <TableCell className="text-center whitespace-nowrap">{renderValue(row.company_code)}</TableCell>
                        <TableCell className="text-center whitespace-nowrap">{renderValue(row.vendor_code)}</TableCell>
                        <TableCell className="text-center whitespace-nowrap">{renderValue(row.vendor_name)}</TableCell>
                        <TableCell className="text-center whitespace-nowrap">{renderValue(row.office_email_primary)}</TableCell>
                        <TableCell className="text-center whitespace-nowrap">{renderValue(row.pan_number)}</TableCell>
                        <TableCell className="text-center whitespace-nowrap">{renderFile(row.pan_file)}</TableCell>
                        <TableCell className="text-center whitespace-nowrap">{renderValue(row.gst_no)}</TableCell>
                        <TableCell className="text-center whitespace-nowrap">{renderFile(row.gst_file)}</TableCell>
                        <TableCell className="text-center whitespace-nowrap">{renderValue(row.state)}</TableCell>
                        <TableCell className="text-center whitespace-nowrap">{renderValue(row.country)}</TableCell>
                        <TableCell className="text-center whitespace-nowrap">{renderValue(row.pincode)}</TableCell>
                        <TableCell className="text-center whitespace-nowrap">{renderValue(row.trc_certificate_no)}</TableCell>
                        <TableCell className="text-center whitespace-nowrap">{renderValue(row.msme_type)}</TableCell>
                        <TableCell className="text-center whitespace-nowrap">{renderValue(row.udyam_no)}</TableCell>
                        <TableCell className="text-center whitespace-nowrap">{renderValue(row.enterprise_reg_no)}</TableCell>
                        <TableCell className="text-center whitespace-nowrap">{renderValue(row.iec_code)}</TableCell>
                        <TableCell className="text-center whitespace-nowrap">{renderValue(row.bank_name)}</TableCell>
                        <TableCell className="text-center whitespace-nowrap">{renderValue(row.ifsc_code)}</TableCell>
                        <TableCell className="text-center whitespace-nowrap">{renderFile(row.bank_file)}</TableCell>
                        <TableCell>
                            <Button onClick={() => handleView(row.ref_no, row.name)} variant={"outline"}>
                                View Details
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default VendorTable;

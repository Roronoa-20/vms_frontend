import React, { useEffect } from "react";
import { Vendor, AllVendorsCompanyCodeResponse, CompanyVendorCodeRecord } from "@/src/types/allvendorstypes";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/atoms/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FileText, CheckSquare, Square } from "lucide-react";
import PopUp from "@/src/components/molecules/AllvendortablePopUp";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import Pagination from "@/src/components/molecules/Pagination";
import NewVendorRegistration from "@/src/components/pages/newvendorregistration";
import { TvendorRegistrationDropdown } from "@/src/types/types";
import { Label } from "@/components/ui/label";
import { Select, SelectGroup, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/src/components/atoms/select";
import { RowData, ExtendRowData } from "@/src/types/rowdata";


interface Props {
    vendors: Vendor[];
    activeTab: string;
}

const VendorTable: React.FC<Props> = ({ vendors, activeTab }) => {
    const router = useRouter();
    const [isVendorCodeDialog, setIsVendorCodeDialog] = React.useState(false);
    const [selectedVendorCodes, setSelectedVendorCodes] = React.useState<CompanyVendorCodeRecord[] | null>(null);
    const [copiedRow, setCopiedRow] = React.useState<RowData | null>(null);
    const [isExtendDialogOpen, setIsExtendDialogOpen] = React.useState(false);
    const [extendRow, setExtendRow] = React.useState<ExtendRowData  | null>(null);
    const [currentPage, setCurrentPage] = React.useState(1);
    const recordPerPage = 10;

    const rows: RowData[] = vendors.flatMap((vendor) => {
        const companyData = vendor.multiple_company_data?.length
            ? vendor.multiple_company_data.filter((c) => c.company_name === activeTab)
            : [{ company_name: activeTab, company_display_name: activeTab, company_vendor_code: "N.A.", sap_client_code: "N.A.", purchase_organization: "N.A." }];

        return companyData.map((c) => {
            const approvedRecord = vendor.vendor_onb_records?.find(
                (record) => record.onboarding_form_status === "Approved"
            );

            return {
                name: vendor.name,
                ref_no: approvedRecord?.vendor_onboarding_no || "N.A.",
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
                bank_name: vendor.bank_details?.bank_name || "N.A.",
                ifsc_code: vendor.bank_details?.ifsc_code || "N.A.",
                bank_file: vendor.bank_details?.bank_proof || "",
                sap_client_code: c.sap_client_code || "N.A.",
                purchase_org: c.purchase_organization || "N.A.",
            };
        });
    });

    const totalRecords = rows.length;
    const startIdx = (currentPage - 1) * recordPerPage;
    const paginatedRows = rows.slice(startIdx, startIdx + recordPerPage);

    if (!rows.length) return <p>No vendors found for company code {activeTab}.</p>;

    const columns: { key: keyof RowData; label: string; type?: "text" | "file" | "boolean" }[] = [
        { key: "multiple_company", label: "Multi-Company?", type: "boolean" },
        { key: "company_code", label: "Company Code" },
        { key: "vendor_name", label: "Vendor Name" },
        { key: "country", label: "Country" },
        { key: "office_email_primary", label: "Official Email" },
        { key: "pan_number", label: "PAN Number" },
        { key: "pan_file", label: "PAN File", type: "file" },
        { key: "gst_no", label: "GST Number" },
        { key: "gst_file", label: "GST File", type: "file" },
        { key: "state", label: "State" },
        { key: "pincode", label: "Pincode/ZipCode" },
        { key: "bank_name", label: "Bank Name" },
        { key: "ifsc_code", label: "IFSC Code" },
        { key: "bank_file", label: "Bank File", type: "file" },
    ];

    const renderCell = (row: RowData, col: typeof columns[0]) => {
        const value = row[col.key];
        switch (col.type) {
            case "file":
                return typeof value === "string" && value.trim() ? (
                    <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex justify-center items-center text-blue-600"
                    >
                        <FileText className="w-5 h-5" />
                    </a>
                ) : (
                    "Not Available"
                );
            case "boolean":
                return Boolean(value) ? (
                    <CheckSquare className="w-4 h-4 text-blue-600 mx-auto" />
                ) : (
                    <Square className="w-4 h-4 text-gray-400 mx-auto" />
                );
            default:
                return value != null && String(value).trim() ? String(value).trim() : "N.A.";
        }
    };

    const handleView = (refno: string, vendorId: string) => {
        router.push(`/view-onboarding-details?tabtype=Company%20Detail&vendor_onboarding=${vendorId}&refno=${refno}`);
    };

    const fetchVendorCodes = async (vendorId: string, company: string) => {
        try {
            const url = `${API_END_POINTS?.allvendorscompanycodedetails}?v_id=${vendorId}&company=${company}`;
            const res: AxiosResponse<AllVendorsCompanyCodeResponse> = await requestWrapper({ url, method: "GET" });
            setSelectedVendorCodes(res.data.message?.data?.company_vendor_codes ?? []);
            setIsVendorCodeDialog(true);
        } catch (err) {
            console.error("Error fetching vendor codes:", err);
        }
    };

    const dropdownUrl = API_END_POINTS?.vendorRegistrationDropdown;
    const [dropdownData, setDropdownData] = React.useState<TvendorRegistrationDropdown["message"]["data"] | null>(null);

    React.useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                if (!dropdownUrl || !activeTab) return;

                const selectedCompany = vendors
                    ?.flatMap((vendor) => vendor.multiple_company_data || [])
                    .find((c) => c.company_name === activeTab);

                const sapCode = selectedCompany?.sap_client_code;
                if (!sapCode || sapCode === "N.A.") {
                    console.warn(`No sap_client_code found for activeTab: ${activeTab}`);
                    return;
                }

                const dropDownApi: AxiosResponse = await requestWrapper({
                    url: `${dropdownUrl}?sap_client_code=${sapCode}`,
                    method: "GET",
                });

                setDropdownData(dropDownApi?.status === 200 ? dropDownApi.data?.message?.data ?? null : null);
            } catch (error) {
                console.error("Error fetching dropdown data:", error);
                setDropdownData(null);
            }
        };

        fetchDropdownData();
    }, [activeTab]);


    const vendorTypeDropdown = dropdownData?.vendor_type;
    const companyDropdown = dropdownData?.company_master;
    const incoTermsDropdown = dropdownData?.incoterm_master;
    const currencyDropdown = dropdownData?.currency_master;

    const handleCopy = (row: RowData) => {
        if (copiedRow?.name === row.name && copiedRow?.company_code === row.company_code) {
            setCopiedRow(null);
            return;
        }
        if (isExtendDialogOpen) {
            setIsExtendDialogOpen(false);
            setExtendRow(null);
        }
        setCopiedRow(row);
    };

    const handleExtend = (row: RowData) => {
        if (extendRow?.name === row.name && extendRow?.company_code === row.company_code) {
            setIsExtendDialogOpen(false);
            setExtendRow(null);
            return;
        }
        if (copiedRow) setCopiedRow(null);
        setExtendRow({
            ...row,
            prev_company: row.company_code,
            extend_company: "",
        } as any);
        setIsExtendDialogOpen(true);
    };

    const [purchaseOrganizations, setPurchaseOrganizations] = React.useState<any[]>([]);
    const handleCompanyDropdownChange = async (value: string) => {
        if (!companyDropdown) return;

        const selectedCompany = companyDropdown.find((c) => c.name === value);
        if (!selectedCompany) return;

        setExtendRow((prev: any) =>
            prev
                ? { ...prev, extend_company: selectedCompany.name, purchase_org: "" }
                : { extend_company: selectedCompany.name, purchase_org: "" }
        );
        try {
            const response = await requestWrapper({
                url: API_END_POINTS.companyBasedDropdown,
                method: "POST",
                data: { company_name: selectedCompany.name },
            });
            if (response?.data?.message?.status === "success") {
                setPurchaseOrganizations(response.data.message.data.purchase_organizations || []);
            } else {
                setPurchaseOrganizations([]);
            }
        } catch {
            setPurchaseOrganizations([]);
        }
    };


    const handlePurchaseOrganizationDropdownChange = (value: string) => {
        setExtendRow((prev) =>
            prev ? { ...prev, purchase_org: value } : prev
        );
    };

    const handleExtendSubmit = async () => {
        if (!extendRow) return;

        if (extendRow.prev_company === extendRow.extend_company) {
            alert("Cannot extend vendor in the same company.");
            return;
        }

        try {
            const response = await requestWrapper({
                url: API_END_POINTS?.extendexistingvendors,
                method: "POST",
                data: {
                    ref_no: extendRow.name,
                    prev_company: extendRow.prev_company,
                    extend_company: extendRow.extend_company,
                    purchase_org: extendRow.purchase_org,
                },
            });

            if (response?.status === 200) {
                alert("Vendor extended successfully");
            }
            setIsExtendDialogOpen(false);
        } catch (err) {
            console.error("Error extending vendor:", err);
            alert("Failed to extend vendor. Check console for details.");
        }
    };

    return (
        <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Vendors List</h2>

            <div className="overflow-x-auto rounded-xl shadow-md border">
                <Table className="min-w-full text-sm border-collapse">
                    <TableHeader className="sticky top-0 z-10 bg-blue-100">
                        <TableRow>
                            <TableHead className="text-black text-center px-4 py-2">Sr. No.</TableHead>
                            {columns.map((col, index) => (
                                <React.Fragment key={`${col.key}-${index}`}>
                                    <TableHead className="text-black text-center px-4 py-2 whitespace-nowrap">
                                        {col.label}
                                    </TableHead>
                                    {index === 2 && (
                                        <TableHead className="text-black text-center px-4 py-2 whitespace-nowrap">
                                            Vendor Codes
                                        </TableHead>
                                    )}
                                </React.Fragment>
                            ))}
                            <TableHead className="text-black text-center px-4 py-2 whitespace-nowrap">
                                View Details
                            </TableHead>
                            <TableHead className="text-black text-center px-4 py-2 whitespace-nowrap">
                                Extend Vendor
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    {/* Table Body */}
                    <TableBody>
                        {/* {paginatedRows.map((row, idx) => ( */}
                        {(copiedRow ? [copiedRow] : paginatedRows).map((row, idx) => (
                            <TableRow
                                key={`${row.name}-${row.company_code}-${idx}`}
                                className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} ${copiedRow?.name === row.name && copiedRow?.company_code === row.company_code
                                    ? "bg-yellow-100 border-2 border-yellow-400"
                                    : "hover:bg-blue-50"
                                    }`}
                            >
                                <TableCell className="text-center px-4 py-2 whitespace-nowrap">
                                    {startIdx + idx + 1}
                                </TableCell>

                                {columns.map((col, index) => (
                                    <React.Fragment key={`${row.name}-${col.key}-${index}`}>
                                        <TableCell className="text-center px-4 py-2 whitespace-nowrap">
                                            {renderCell(row, col)}
                                        </TableCell>
                                        {index === 2 && (
                                            <TableCell className="text-center px-4 py-2">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => fetchVendorCodes(row.name, row.company_code)}
                                                    className="whitespace-nowrap bg-[#5291CD] text-white text-sm rounded-xl px-3 py-1"
                                                >
                                                    View
                                                </Button>
                                            </TableCell>
                                        )}
                                    </React.Fragment>
                                ))}

                                {/* Actions */}
                                <TableCell className="text-center">
                                    <Button
                                        onClick={() => handleView(row.ref_no, row.name)}
                                        className="whitespace-nowrap bg-[#5291CD] text-white text-sm rounded-xl px-3 py-1"
                                    >
                                        View
                                    </Button>
                                </TableCell>
                                <TableCell className="text-center">
                                    {["1012", "1022", "1000", "1025", "1030"].includes(row.company_code) ? (
                                        <div className="flex gap-2 justify-center">
                                            <Button
                                                onClick={() => handleExtend(row)}
                                                className="bg-blue-600 text-white text-sm rounded-xl px-3 py-1"
                                            >
                                                Extend
                                            </Button>
                                            <Button
                                                onClick={() => handleCopy(row)}
                                                className="bg-green-600 text-white text-sm rounded-xl px-3 py-1"
                                            >
                                                Copy
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={() => handleCopy(row)}
                                            className="bg-green-600 text-white text-sm rounded-xl px-3 py-1"
                                        >
                                            Copy
                                        </Button>
                                    )}
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </div>

            {/* 🔹 Pagination */}
            <div className="mt-4">
                <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    total_event_list={totalRecords}
                    record_per_page={recordPerPage}
                />
            </div>

            {copiedRow && (
                <div className="mt-6 border rounded-lg shadow bg-gray-50">
                    <h3 className="text-lg text-center font-medium pl-2 pt-2">
                        Copy Vendor Registration for: <span className="text-green-700 font-semibold underline italic">{copiedRow.vendor_name}</span>
                    </h3>
                    <NewVendorRegistration
                        vendorTypeDropdown={vendorTypeDropdown || []}
                        companyDropdown={companyDropdown || []}
                        incoTermsDropdown={incoTermsDropdown || []}
                        currencyDropdown={currencyDropdown || []}
                        handleCancel={() => setCopiedRow(null)}
                        initialData={copiedRow}
                    />
                </div>
            )}

            {/* 🔹 Vendor Codes PopUp */}
            {isVendorCodeDialog && selectedVendorCodes && (
                <PopUp
                    handleClose={() => setIsVendorCodeDialog(false)}
                    headerText="Vendor Codes"
                    classname="overflow-y-auto md:max-w-3xl md:max-h-[80vh]"
                >
                    <div className="overflow-x-auto mt-3">
                        <Table className="min-w-full text-sm">
                            <TableBody>
                                {selectedVendorCodes.map((company) => (
                                    <React.Fragment key={company.company_info.company_code}>
                                        <TableRow className="bg-[#5291CD] text-white font-semibold sticky top-0">
                                            <TableCell colSpan={3} className="hover:bg-[#5291CD]">
                                                Company Code: {company.company_info.company_code}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow className="bg-gray-200 hover:bg-gray-200 font-semibold">
                                            <TableHead>State</TableHead>
                                            <TableHead>GST No</TableHead>
                                            <TableHead>Vendor Code</TableHead>
                                        </TableRow>
                                        {company.vendor_code_table.map((vendor, vIdx) => (
                                            <TableRow
                                                key={vIdx}
                                                className={vIdx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                                            >
                                                <TableCell>{vendor.state}</TableCell>
                                                <TableCell>{vendor.gst_no}</TableCell>
                                                <TableCell>{vendor.vendor_code || "-"}</TableCell>
                                            </TableRow>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </PopUp>
            )}
            {/* 🔹 Extend Vendor Inline Form */}
            {isExtendDialogOpen && extendRow && (
                <div className="mt-6 border rounded-lg shadow bg-gray-50 p-4">
                    <h3 className="text-lg text-center font-medium pl-2 pt-2">
                        Extend Vendor Registration for: <span className="text-green-700 font-semibold underline italic">{extendRow.vendor_name}</span>
                    </h3>
                    <div className="space-y-4">
                        <div className="flex gap-4 p-4">
                            {/* Company Name */}
                            <div className="flex-1">
                                <h1 className="text-[14px] font-normal text-black pb-2">Company Name</h1>
                                <Select
                                    required
                                    onValueChange={(value) => handleCompanyDropdownChange(value)}
                                    value={extendRow?.extend_company ?? ""}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Company Name" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {companyDropdown && companyDropdown.length > 0 ? (
                                                companyDropdown
                                                    .map((item: any) => (
                                                        <SelectItem value={item.name} key={item.name}>
                                                            {item.description}
                                                        </SelectItem>
                                                    ))
                                            ) : (
                                                <div className="text-center">No Value</div>
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Purchase Organization */}
                            <div className="flex-1">
                                <h1 className="text-[14px] font-normal text-black pb-2">Purchase Organization</h1>
                                <Select
                                    required
                                    onValueChange={(value) => handlePurchaseOrganizationDropdownChange(value)}
                                    value={extendRow?.purchase_org ?? ""}
                                    disabled={!extendRow?.company_code} // disable until company is chosen
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Purchase Organization" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {purchaseOrganizations && purchaseOrganizations.length > 0 ? (
                                                purchaseOrganizations.map((item) => (
                                                    <SelectItem value={item.name} key={item.name}>
                                                        {item.description}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="text-center">No Value</div>
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant={"backbtn"}
                                size={"backbtnsize"}
                                onClick={() => setIsExtendDialogOpen(false)}
                                className="py-2"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleExtendSubmit}
                                variant={"nextbtn"}
                                size={"nextbtnsize"}
                                className="py-2"
                            >
                                Save
                            </Button>
                        </div>
                    </div >
                </div >
            )}
        </>
    );

};

export default VendorTable;
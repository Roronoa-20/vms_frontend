import React, { useEffect, useMemo } from "react";
import { Vendor, AllVendorsCompanyCodeResponse, CompanyVendorCodeRecord, VendorRow, CompanyData } from "@/src/types/allvendorstypes";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/atoms/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FileText, CheckSquare, Square, Send, FilePlus, Eye, Copy, ExternalLink, Plus, Trash2, Mail, X, Check, CheckCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import PopUp from "@/src/components/molecules/AllvendortablePopUp";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { Badge } from "@/components/ui/badge";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import Pagination from "@/src/components/molecules/Pagination-at-all-vendors";
import NewVendorRegistration from "@/src/components/pages/newvendorregistration";
import { TvendorRegistrationDropdown } from "@/src/types/types";
import { Label } from "@/components/ui/label";
import { Select, SelectGroup, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/src/components/atoms/select";
import { RowData, ExtendRowData, MultipleCompanyData } from "@/src/types/rowdata";
import { useAuth } from "@/src/context/AuthContext";

interface Props {
    vendors: VendorRow[];
    activeTab: string;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
    searchVendorType: string;
    setSearchVendorType: (value: string) => void;
    vendorTypeOptions: any[];
}

const VendorTable: React.FC<Props> = ({
    vendors,
    activeTab,
    currentPage,
    setCurrentPage,
    pageSize,
    totalPages,
    totalRecords,
    searchVendorType,
    setSearchVendorType,
    vendorTypeOptions
}) => {
    console.log("Vendors of the table-------->", vendors);
    const router = useRouter();
    const { userid, asaResponsibleUser } = useAuth();
    const [isVendorCodeDialog, setIsVendorCodeDialog] = React.useState(false);
    const [selectedVendorCodes, setSelectedVendorCodes] = React.useState<CompanyVendorCodeRecord[] | null>(null);
    const [copiedRow, setCopiedRow] = React.useState<RowData | null>(null);
    const [isExtendDialogOpen, setIsExtendDialogOpen] = React.useState(false);
    const [extendRow, setExtendRow] = React.useState<ExtendRowData | null>(null);
    const [isASAPopupOpen, setIsASAPopupOpen] = React.useState(false);
    const [asaAdditionalEmails, setAsaAdditionalEmails] = React.useState<string[]>([]);
    const [asaEmailInput, setAsaEmailInput] = React.useState("");
    const [selectedRowForASA, setSelectedRowForASA] = React.useState<RowData | null>(null);
    const copyFormRef = React.useRef<HTMLDivElement | null>(null);
    const extendFormRef = React.useRef<HTMLDivElement | null>(null);
    const stickyKeys: (keyof RowData | "srno")[] = ["srno", "company_code", "name", "vendor_name"];
    const [colWidths, setColWidths] = React.useState<Record<string, number>>({});
    const headerRefs = React.useRef<Record<string, HTMLTableCellElement | null>>({});

    React.useEffect(() => {
        const widths: Record<string, number> = {};
        Object.entries(headerRefs.current).forEach(([key, el]) => {
            if (el) widths[key] = el.offsetWidth;
        });
        setColWidths(widths);
    }, [vendors, activeTab]);

    const getStickyLeft = (key: string) => {
        const index = stickyKeys.indexOf(key as any);
        if (index === -1) return undefined;
        return stickyKeys
            .slice(0, index)
            .reduce((sum, k) => sum + (colWidths[k] || 0), 0);
    };


    const normalizeCompanyData = (c: Partial<CompanyData> | any): MultipleCompanyData => ({
        company_name: c.company_name ?? "N.A.",
        purchase_organization: c.purchase_organization ?? "N.A.",
        account_group: c.account_group ?? undefined,
        terms_of_payment: c.terms_of_payment ?? undefined,
        sap_client_code: c.sap_client_code ?? "N.A.",
        purchase_group: c.purchase_group ?? undefined,
        order_currency: c.order_currency ?? undefined,
        incoterm: c.incoterm ?? undefined,
        reconciliation_account: c.reconciliation_account ?? undefined,
        company_vendor_code: c.company_vendor_code ?? "N.A.",
        company_display_name: c.company_display_name ?? "N.A.",
        via_import: c.via_import != null ? Number(c.via_import) : 0,
    });

    const rows: RowData[] = vendors.flatMap((vendor) => {
        // Always have at least one company entry for the active tab
        const companyDataList: Partial<CompanyData>[] = vendor.company_data?.length ? vendor.company_data
            : [{
                name: "",
                vendor_id: "",
                creation: "",
                modified: "",
                modified_by: "",
                owner: "",
                docstatus: 0,
                idx: 0,
                company_name: activeTab,
                purchase_organization: "N.A.",
                account_group: undefined,
                terms_of_payment: undefined,
                sap_client_code: "N.A.",
                purchase_group: undefined,
                order_currency: undefined,
                incoterm: undefined,
                reconciliation_account: undefined,
                company_vendor_code: "N.A.",
                company_display_name: activeTab,
                parent: "",
                parentfield: "",
                parenttype: "",
                via_import: 0,
            }];

        return companyDataList.map((company) => {
            const approvedRecord = vendor.onboarding_records?.find((record: any) => record.onboarding_form_status === "Approved");
            const normalizedCompany = normalizeCompanyData(company) as unknown as CompanyData;

            return {
                ...vendor,
                company_data: [normalizedCompany],
                multiple_company: vendor.bank_details?.registered_for_multi_companies ?? 0,
                company_code: normalizedCompany.company_name,
                vendor_code: normalizedCompany.company_vendor_code,
                ref_no: approvedRecord?.vendor_onboarding_no ?? "N.A.",
                pan_number: vendor.bank_details?.company_pan_number ?? "N.A.",
                gst_no: vendor.document_details ?? "N.A.",
                state: normalizedCompany.company_display_name,
                sap_client_code: normalizedCompany.sap_client_code,
                purchase_org: normalizedCompany.purchase_organization,
                vendor_type: vendor.vendor_types?.map((t: any) => t.vendor_type).join(", "),
            } as unknown as RowData;
        });
    });

    const paginatedRows = rows;

    const startIdx = (currentPage - 1) * pageSize;

    const columns: { key: keyof RowData; label: string; type?: "text" | "file" | "boolean"; sticky?: boolean; }[] = [
        { key: "company_code", label: "Company Code", sticky: true },
        { key: "vendor_id", label: "Vendor Ref No.", sticky: true },
        { key: "vendor_name", label: "Vendor Name", sticky: true },
        { key: "vendor_type", label: "Vendor Type" },
        { key: "country", label: "Country" },
        { key: "office_email_primary", label: "Official Email" },
        { key: "pan_number", label: "PAN Number" },
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


    const handleSendASA = (row: RowData) => {
        setSelectedRowForASA(row);
        setAsaAdditionalEmails([]);
        setAsaEmailInput("");
        setIsASAPopupOpen(true);
    };

    const handleAddAdditionalEmail = (email: string) => {
        const trimmedEmail = email.trim().replace(/,$/, "");
        if (trimmedEmail && !asaAdditionalEmails.includes(trimmedEmail)) {
            // Simple email validation
            if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
                setAsaAdditionalEmails((prev) => [...prev, trimmedEmail]);
                setAsaEmailInput("");
            }
        }
    };

    const handleRemoveAdditionalEmail = (index: number) => {
        setAsaAdditionalEmails((prev) => prev.filter((_, i) => i !== index));
    };

    const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            handleAddAdditionalEmail(asaEmailInput);
        }
    };

    const handleASASubmit = async () => {
        if (!selectedRowForASA) return;

        // Merge primary email with additional ones
        const allEmails = [
            selectedRowForASA.office_email_primary,
            ...asaAdditionalEmails
        ].filter(email => email?.trim() !== "");

        try {
            const response = await requestWrapper({
                url: API_END_POINTS?.sendasaemail,
                method: "POST",
                data: {
                    vendor_id: selectedRowForASA.vendor_id,
                    emails: allEmails.join(","),
                    asa_required: 1,
                    user_id: userid
                },
            });

            if (response?.status === 200) {
                alert("ASA Form sent successfully to all recipients.");
                setIsASAPopupOpen(false);
                window.location.reload();
            }
        } catch (err) {
            console.error("Error sending ASA Form:", err);
            alert("Failed to send ASA Form. Check console for details.");
        }
    };

    const handleView = (row: RowData) => {
        const isImported = row.company_data?.some(c => String(c.via_import) === "1");
        const isViaImport = String(row.via_data_import) === "1";
        const isFromRegistration = String(row.created_from_registration) === "1";

        if (isViaImport && isImported) {
            router.push(`/view-onboarding-details?tabtype=Company%20Detail&refno=${row.name}&company_code=${row.company_code}&via_data_import=1`);
        } else if (isFromRegistration && !isImported) {
            router.push(`/view-onboarding-details?tabtype=Company%20Detail&vendor_onboarding=${row.ref_no}&refno=${row.name}`);
        } else {
            router.push(`/view-onboarding-details?tabtype=Company%20Detail&vendor_onboarding=${row.ref_no}&refno=${row.name}`);
        }
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
    const [unfilteredDropdownData, setUnfilteredDropdownData] = React.useState<TvendorRegistrationDropdown["message"]["data"] | null>(null);

    React.useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                if (!dropdownUrl) return;

                const allDropDownApi: AxiosResponse = await requestWrapper({
                    url: dropdownUrl,
                    method: "GET",
                });
                setUnfilteredDropdownData(allDropDownApi?.status === 200 ? allDropDownApi.data?.message?.data ?? null : null);

                if (!activeTab) return;
                const selectedCompany = vendors?.flatMap((vendor) => vendor.company_data || []).find((c) => String(c.company_name) === String(activeTab));
                console.log("Selected Company for Dropdown:", selectedCompany);
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
                setUnfilteredDropdownData(null);
            }
        };

        fetchDropdownData();
    }, [activeTab, vendors]);

    const companyDropdown = dropdownData?.company_master;

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
        setTimeout(() => {
            copyFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
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
        setTimeout(() => {
            extendFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
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
        console.log("Submitting the extend row info---->", extendRow);

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

    const noVendors = !vendors?.length;

    return (
        <>
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-gray-800">Vendors List</h2>
                <div className="w-[200px]">
                    <Select onValueChange={(value: string) => setSearchVendorType(value)} value={searchVendorType} >
                        <SelectTrigger className="w-full h-9 text-xs bg-white border-blue-200 focus:ring-0 focus:ring-offset-0">
                            <SelectValue placeholder="Vendor Type" />
                        </SelectTrigger>
                        <SelectContent className="z-[100] bg-white border border-gray-200">
                            <SelectGroup>
                                <SelectItem value="All" className="text-xs">All Vendor Types</SelectItem>
                                {vendorTypeOptions.map((option) => (
                                    <SelectItem key={option.name} value={option.name} className="text-xs">
                                        {option.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {vendors.length === 0 ? (
                <p className="text-center text-gray-500 py-10 bg-white rounded-xl shadow-md border animate-fade-in">
                    No vendors found matching your current search criteria.
                </p>
            ) : (
                <div>
                    <div className="overflow-x-auto rounded-xl shadow-md border">
                        <Table className="min-w-full text-[13px] border-collapse">
                            <TableHeader className="sticky top-0 z-10 bg-blue-100 border-b">
                                <TableRow>
                                    <TableHead
                                        ref={(el) => { headerRefs.current["srno"] = el; }}
                                        className="sticky left-0 z-20 bg-blue-100 text-center text-black font-semibold text-nowrap px-3 py-2"
                                        style={{ left: getStickyLeft("srno") }}
                                    >
                                        Sr. No.
                                    </TableHead>
                                    {columns.map((col, index) => (
                                        <React.Fragment key={`${col.key}-${index}`}>
                                            <TableHead
                                                key={col.key}
                                                ref={(el) => { headerRefs.current[col.key] = el; }}
                                                className={`text-black text-center font-semibold px-3 py-2 whitespace-nowrap ${col.sticky ? "sticky left-0 bg-blue-100 z-20" : "bg-blue-100 border-b border-blue-200 shadow-sm"}`}
                                                style={stickyKeys.includes(col.key) ? { left: getStickyLeft(col.key) } : {}}
                                            >
                                                {col.label}
                                            </TableHead>
                                            {index === 2 && (
                                                <TableHead className="text-black text-center font-semibold px-3 py-2 whitespace-nowrap bg-blue-100 border-b border-blue-200 shadow-sm">
                                                    Vendor Codes & GST
                                                </TableHead>
                                            )}
                                        </React.Fragment>
                                    ))}
                                    <TableHead className="text-black text-center font-semibold px-3 py-2 whitespace-nowrap bg-blue-100 border-b border-blue-200 shadow-sm">
                                        Actions
                                    </TableHead>
                                    <TableHead className="text-black text-center font-semibold px-3 py-2 whitespace-nowrap bg-blue-100 border-b border-blue-200 shadow-sm rounded-tr-xl">
                                        Extend Vendor
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedRows.map((row, idx) => (
                                    <TableRow
                                        key={`${row.name}-${row.company_code}-${idx}`}
                                        className={`group transition-colors ${copiedRow?.name === row.name && copiedRow?.company_code === row.company_code
                                            ? "bg-yellow-100 border-2 border-yellow-400"
                                            : "bg-white hover:bg-gray-100"
                                            }`}
                                    >
                                        {/* Sr. No */}
                                        <TableCell
                                            className={`text-center px-3 py-2 whitespace-nowrap sticky left-0 z-[30] transition-colors ${stickyKeys.includes("srno")
                                                ? "bg-white group-hover:bg-gray-100"
                                                : "bg-[#f7f7f7]"
                                                }`}
                                            style={{ left: getStickyLeft("srno") }}
                                        >
                                            {startIdx + idx + 1}
                                        </TableCell>

                                        {/* Columns */}
                                        {columns.map((col, index) => (
                                            <React.Fragment key={`${row.name}-${col.key}-${index}`}>
                                                <TableCell
                                                    className={`text-center px-3 py-2 whitespace-nowrap text-black transition-colors ${stickyKeys.includes(col.key)
                                                        ? "sticky left-0 bg-white group-hover:bg-gray-100 z-[30]"
                                                        : "border-b border-gray-50"
                                                        }`}
                                                    style={stickyKeys.includes(col.key) ? { left: getStickyLeft(col.key) } : {}}
                                                >
                                                    {renderCell(row, col)}
                                                </TableCell>

                                                {/* Vendor Codes & GST Button */}
                                                {index === 2 && (
                                                    <TableCell className="text-center px-3 py-2 border-b border-gray-100">
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => fetchVendorCodes(row.name, row.company_code)}
                                                            className="whitespace-nowrap h-7 bg-[#5291CD]/90 hover:bg-[#5291CD] hover:text-white text-white border-none text-[10.5px] font-medium rounded-md px-2.5 transition-all relative z-0 shadow-sm"
                                                        >
                                                            View Codes
                                                        </Button>
                                                    </TableCell>
                                                )}
                                            </React.Fragment>
                                        ))}

                                        {/* Actions */}
                                        <TableCell className="text-center px-3 py-2">
                                            <div className="flex gap-2 justify-start relative z-0 pl-1">
                                                <TooltipProvider delayDuration={0}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                onClick={() => handleView(row)}
                                                                className="p-2 h-8 w-8 hover:bg-gray-100 transition-colors"
                                                            >
                                                                <Eye className="w-5 h-5 text-gray-500" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="bottom" sideOffset={5}>View Details</TooltipContent>
                                                    </Tooltip>

                                                    {(asaResponsibleUser === 1) && (row.vendor_type?.includes("Material") ||
                                                        row.vendor_types?.some(vt => vt.vendor_type?.includes("Material"))) && (
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <div className="inline-block">
                                                                        <Button
                                                                            variant="ghost"
                                                                            disabled={Number(row.user_create) === 0 && row.asa_form_link_sent !== 1}
                                                                            onClick={() => {
                                                                                if (row.asa_form_link_sent !== 1) {
                                                                                    handleSendASA(row);
                                                                                }
                                                                            }}
                                                                            className={`p-2 h-8 w-8 hover:bg-gray-100 transition-colors ${row.asa_form_link_sent === 1 ? "cursor-default opacity-80" : ""} ${Number(row.user_create) === 0 && row.asa_form_link_sent !== 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                                                                        >
                                                                            {row.asa_form_link_sent === 1 ? (
                                                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                                                            ) : (
                                                                                <Send className={`w-5 h-5 ${Number(row.user_create) === 0 ? "text-gray-400" : "text-blue-600"}`} />
                                                                            )}
                                                                        </Button>
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent side="bottom">
                                                                    {row.asa_form_link_sent === 1
                                                                        ? "ASA Form Sent"
                                                                        : Number(row.user_create) === 0
                                                                            ? "User not Created. Contact VMS Team"
                                                                            : "Send ASA Form"}
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        )}
                                                </TooltipProvider>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center px-3 py-2">
                                            <TooltipProvider delayDuration={0}>
                                                {["1012", "1022", "1000", "1025", "1030"].includes(row.company_code) ? (
                                                    <div className="flex gap-2 justify-center relative z-0">
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    onClick={() => handleExtend(row)}
                                                                    className="p-2 h-8 w-8 hover:bg-gray-100 transition-colors"
                                                                >
                                                                    <ExternalLink className="w-5 h-5 text-[#854D0E]" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="bottom">Extend Vendor</TooltipContent>
                                                        </Tooltip>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    onClick={() => handleCopy(row)}
                                                                    className="p-2 h-8 w-8 hover:bg-gray-100 transition-colors"
                                                                >
                                                                    <Copy className="w-5 h-5 text-green-600" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="bottom">Copy Vendor</TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                ) : (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                onClick={() => handleCopy(row)}
                                                                className="p-2 h-8 w-8 hover:bg-gray-100 transition-colors"
                                                            >
                                                                <Copy className="w-5 h-5 text-green-600" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="bottom">Copy Vendor</TooltipContent>
                                                    </Tooltip>
                                                )}
                                            </TooltipProvider>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div >
                </div>
            )}

            {/*Pagination */}
            <div className="mt-4 flex justify-between items-center">
                <p className="text-[12px] text-gray-500">
                    Showing {paginatedRows.length} of {totalRecords} entries
                </p>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>

            {copiedRow && (
                <div ref={copyFormRef} className="mt-6 border rounded-lg shadow bg-gray-50">
                    <h3 className="text-lg text-center font-medium pl-2 pt-2">
                        Copy Vendor Registration for: <span className="text-green-700 font-semibold underline italic">{copiedRow.vendor_name}</span>
                    </h3>
                    <NewVendorRegistration
                        vendorTypeDropdown={dropdownData?.vendor_type || []}
                        companyDropdown={unfilteredDropdownData?.company_master || []}
                        incoTermsDropdown={unfilteredDropdownData?.incoterm_master || []}
                        currencyDropdown={unfilteredDropdownData?.currency_master || []}
                        handleCancel={() => setCopiedRow(null)}
                        initialData={copiedRow}
                    />
                </div>
            )}

            {/*Vendor Codes PopUp */}
            {isVendorCodeDialog && selectedVendorCodes && (
                <PopUp
                    handleClose={() => setIsVendorCodeDialog(false)}
                    headerText="Vendor Codes"
                    classname="relative"
                    showBackButton={false}
                    padding="p-3"
                >
                    <div className="overflow-y-auto md:max-w-3xl md:max-h-[80vh] relative">
                        <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <Table className="min-w-full text-sm">
                                <TableBody>
                                    {selectedVendorCodes.map((company) => (
                                        <React.Fragment key={company.company_info.company_code}>
                                            <TableRow className="bg-[#5291CD] text-white font-semibold sticky top-0 z-10">
                                                <TableCell colSpan={3} className="hover:bg-[#5291CD]">
                                                    Company Code: {company.company_info.company_code}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow className="bg-gray-200 hover:bg-gray-200 font-semibold sticky top-[36px] z-10">
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
                    </div>
                </PopUp>
            )}

            {/*Extend Vendor Inline Form */}
            {isExtendDialogOpen && extendRow && (
                <div ref={extendFormRef} className="mt-6 border rounded-lg shadow bg-gray-50 p-4">
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
                                    disabled={!extendRow?.company_code}
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
                                Extend
                            </Button>
                        </div>
                    </div >
                </div >
            )}
            {/* Send ASA PopUp */}
            {isASAPopupOpen && selectedRowForASA && (
                <PopUp
                    handleClose={() => setIsASAPopupOpen(false)}
                    headerText="Send ASA Form"
                    isSubmit={true}
                    Submitbutton={handleASASubmit}
                    submitLabel="Send"
                    classname="md:max-w-md"
                    padding="p-4"
                >
                    <div className="space-y-5 py-2">
                        <div className="bg-gray-50/50 p-3 rounded-lg border border-gray-100 mb-2">
                            <p className="text-xs text-gray-900 font-medium mb-1 capitalize">Primary Recipient of {selectedRowForASA.vendor_name}</p>
                            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-md border border-gray-100 shadow-sm">
                                <Mail className="w-3.5 h-3.5 text-blue-500" />
                                <span className="text-sm text-gray-700 font-semibold">{selectedRowForASA.office_email_primary}</span>
                                <Badge variant="secondary" className="ml-auto text-[10px] h-4 bg-gray-100 text-gray-600 border-none px-1.5 uppercase font-bold tracking-wider">Primary</Badge>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wide">
                                Add More Recipients
                            </Label>

                            <div className="space-y-3">
                                <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-lg min-h-[44px] bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all outline-none">
                                    {asaAdditionalEmails.map((email, index) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded-md animate-in zoom-in-95 duration-200"
                                        >
                                            <span className="text-[11px] font-medium">{email}</span>
                                            <button
                                                onClick={() => handleRemoveAdditionalEmail(index)}
                                                className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                    <input
                                        type="text"
                                        value={asaEmailInput}
                                        onChange={(e) => setAsaEmailInput(e.target.value)}
                                        onKeyDown={handleEmailKeyDown}
                                        onBlur={() => handleAddAdditionalEmail(asaEmailInput)}
                                        placeholder={asaAdditionalEmails.length === 0 ? "Enter additional email..." : ""}
                                        className="flex-1 min-w-[120px] h-7 text-sm focus:outline-none bg-transparent"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-600 italic">Press Enter or Comma to add recipient</p>
                            </div>
                        </div>
                    </div>
                </PopUp>
            )}
        </>
    );

};

export default VendorTable;
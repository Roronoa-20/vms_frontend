"use client";

import React, { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MaterialRequestItem, MaterialRequestChildItem, TableFilters } from "@/src/types/MaterialRequestTableTypes";
import { TvendorRegistrationDropdown } from "@/src/types/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/src/components/atoms/select";
import Pagination from "../Pagination";

interface MaterialRequestTableProps {
    data: MaterialRequestItem[];
    companyDropdown: TvendorRegistrationDropdown["message"]["data"]["company_master"];
    TableTitle?: string;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalRecords: number;
    recordPerPage: number;
    filters?: TableFilters;
    onFilterChange: (filters: TableFilters) => void;
}

const MaterialRequestTable: React.FC<MaterialRequestTableProps> = ({
    data = [],
    companyDropdown,
    TableTitle,
    currentPage = 1,
    setCurrentPage,
    totalRecords = 0,
    recordPerPage = 20,
    filters = {},
    onFilterChange
}) => {
    const [localSearch, setLocalSearch] = useState(filters.search || "");

    const showStatus = TableTitle?.toLowerCase().includes("total");

    // Flatten data for display (no local filtering)
    const flattenedData = useMemo(() => {
        return data.flatMap((parent) => {
            const items = parent.material_request_items || [];
            if (items.length === 0) {
                return [{
                    child_name: "",
                    company_code: parent.requestor_company || "-",
                    material_description: parent.maktx || "No description",
                    material_type: "-",
                    requestor_ref_no: parent.name,
                    request_date: parent.request_date,
                    approval_status: parent.approval_status,
                    request_id: parent.request_id,
                    company_name: parent.requestor_company || "-"
                }];
            }
            return items.map((child) => ({
                ...child,
                requestor_ref_no: parent.name,
                request_date: parent.request_date,
                approval_status: parent.approval_status,
                request_id: parent.request_id,
                company_name: child.company_name || parent.requestor_company || "-"
            }));
        });
    }, [data]);

    const paginatedData = flattenedData;

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return "-";
        const [year, month, day] = dateStr.trim().split(" ")[0].split("-");
        return `${day}-${month}-${year}`;
    };

    // Debounce search
    React.useEffect(() => {
        const handler = setTimeout(() => {
            if (localSearch !== filters.search) {
                onFilterChange({ ...filters, search: localSearch });
            }
        }, 500);
        return () => clearTimeout(handler);
    }, [localSearch]);

    // Handle company and status changes immediately
    const handleCompanyChange = (value: string) => {
        const company = value === "all" ? "" : value;
        onFilterChange({ ...filters, company_name: company });
    };

    const handleStatusChange = (value: string) => {
        const status = value === "all" ? "" : value;
        onFilterChange({ ...filters, approval_status: status });
    };

    return (
        <div className="mt-4 border rounded-xl overflow-hidden shadow-md p-4 bg-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-3 md:gap-0">
                {TableTitle && <h2 className="text-lg font-semibold text-gray-800 mb-3">{TableTitle}</h2>}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mt-2 md:mt-0">
                    <Input
                        type="text"
                        placeholder="Search by Request ID or Material Description..."
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        className="border px-3 py-2 rounded-md text-sm w-full sm:w-[250px]"
                    />
                    <Select
                        value={filters.company_name || "all"}
                        onValueChange={handleCompanyChange}
                    >
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Select Company" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="all">All Company</SelectItem>
                                {companyDropdown?.map((item) => (
                                    <SelectItem key={item.name} value={item.name}>
                                        {item.description}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {showStatus && (
                        <Select
                            value={filters.approval_status || "all"}
                            onValueChange={handleStatusChange}
                        >
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="Pending by CP">Pending by CP</SelectItem>
                                    <SelectItem value="Sent to SAP">Sent to SAP</SelectItem>
                                    <SelectItem value="Code Generated by SAP">Code Generated by SAP</SelectItem>
                                    <SelectItem value="SAP Error">SAP Error</SelectItem>
                                    <SelectItem value="Use Existing Code">Use Existing Code</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}
                </div>
            </div>

            {paginatedData.length ? (
                <Table>
                    <TableHeader>
                        <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] text-center">
                            <TableHead className="text-center text-black">Sr.No.</TableHead>
                            {/* <TableHead className="text-center text-black text-nowrap">Requestor Ref No</TableHead> */}
                            <TableHead className="text-center text-black text-nowrap">Request ID</TableHead>
                            <TableHead className="text-center text-black text-nowrap">Request Date</TableHead>
                            <TableHead className="text-center text-black text-nowrap">Company</TableHead>
                            {/* <TableHead className="text-center text-black text-nowrap">Plant Name</TableHead> */}
                            <TableHead className="text-center text-black text-nowrap">Material Type</TableHead>
                            <TableHead className="text-center text-black text-nowrap">Material Description</TableHead>
                            <TableHead className="text-center text-black text-nowrap">Status</TableHead>
                            <TableHead className="text-center text-black text-nowrap">View Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((item, idx) => (
                            <TableRow key={item.child_name || idx}>
                                <TableCell className="text-center text-nowrap">{(currentPage - 1) * recordPerPage + idx + 1}</TableCell>
                                {/* <TableCell className="text-center text-nowrap">{item.requestor_ref_no}</TableCell> */}
                                <TableCell className="text-center text-nowrap">{item.request_id}</TableCell>
                                <TableCell className="text-center text-nowrap">{formatDate(item.request_date)}</TableCell>
                                <TableCell className="text-center text-nowrap">{item.company_code}</TableCell>
                                {/* <TableCell className="text-center text-nowrap">{item.plant || "-"}</TableCell> */}
                                <TableCell className="text-center text-nowrap">{item.material_type}</TableCell>
                                <TableCell className="text-center text-nowrap">{item.material_description}</TableCell>
                                <TableCell>
                                    {/* <p
                                        className={`rounded-[10px] text-[14px] font-medium text-center text-nowrap py-[7px] mx-auto ${item.approval_status === "Code Generated by SAP"
                                            ? "w-[180px]"
                                            : "w-[150px]"
                                            } ${item.approval_status === "Pending by CP" || !item.approval_status
                                                ? "bg-[#f35100] text-white"
                                                : ["Approved by CP", "Code Generated by SAP", "Sent to SAP"].includes(item.approval_status)
                                                    ? "bg-[#10ad30] text-white border"
                                                    : item.approval_status === "Re-Opened by CP"
                                                        ? "bg-[#f72fe3] text-white"
                                                        : item.approval_status === "Updated by CP"
                                                            ? "bg-[#2e8cf1] text-white"
                                                            : item.approval_status === "Use Existing Code"
                                                                ? "bg-[#5291CD] text-white"
                                                                : "bg-[#FFC6C6] text-white"
                                            }`}
                                    > */}
                                    <p
                                        className={`rounded-[10px] text-[14px] font-medium text-center text-nowrap py-[7px] mx-auto ${item.approval_status === "Code Generated by SAP" ? "w-[180px]" : "w-[150px]"}
                                            ${["Approved by CP", "Code Generated by SAP", "Sent to SAP"].includes(item.approval_status)
                                                ? "bg-green-100 text-green-800"
                                                : item.approval_status === "SAP Error"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                            }`}
                                    >
                                        {item.approval_status || "Pending"}
                                    </p>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Link
                                        href={`/material-code-request-form?name=${encodeURIComponent(item.requestor_ref_no)}&material_name=${encodeURIComponent(item.child_name)}`}
                                    >
                                        <Button className="bg-[#5291CD] rounded-[16px] hover:bg-white hover:text-black">View</Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <div className="text-center text-gray-500 py-6">No records found.</div>
            )}

            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                total_event_list={totalRecords}
                record_per_page={recordPerPage}
            />
        </div>
    );
};

export default MaterialRequestTable;

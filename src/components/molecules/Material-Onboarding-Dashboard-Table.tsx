import React, { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MaterialRequestItem, MaterialRequestChildItem } from "@/src/types/MaterialRequestTableTypes";
import { TvendorRegistrationDropdown } from "@/src/types/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/src/components/atoms/select";
import Pagination from "./Pagination";

interface MaterialRequestTableProps {
    data: MaterialRequestItem[];
    companyDropdown: TvendorRegistrationDropdown["message"]["data"]["company_master"];
    TableTitle?: string;
}

const MaterialRequestTable: React.FC<MaterialRequestTableProps> = ({ data = [], companyDropdown, TableTitle }) => {
    const [search, setSearch] = useState("");
    const [selectedCompany, setSelectedCompany] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const recordPerPage = 20;

    // Filtered & flattened data
    const flattenedData = useMemo(() => {
        const filtered = data.filter((parent) => {
            const matchesSearch = parent.material_request_items?.some((child) =>
                child.material_description?.toLowerCase().includes(search.toLowerCase())
            );
            const matchesCompany = selectedCompany ? parent.requestor_company === selectedCompany : true;
            return matchesSearch && matchesCompany;
        });

        return filtered.flatMap((parent) =>
            parent.material_request_items?.map((child) => ({
                ...child,
                requestor_ref_no: parent.name,
                request_date: parent.request_date,
                approval_status: parent.approval_status,
            })) || []
        );
    }, [data, search, selectedCompany]);

    const totalRecords = flattenedData.length;
    const startIndex = (currentPage - 1) * recordPerPage;
    const paginatedData = flattenedData.slice(startIndex, startIndex + recordPerPage);

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return "-";
        const [year, month, day] = dateStr.trim().split(" ")[0].split("-");
        return `${day}-${month}-${year}`;
    };

    // Reset page when filters change
    React.useEffect(() => setCurrentPage(1), [search, selectedCompany]);

    return (
        <div className="mt-4 border rounded-xl overflow-hidden shadow-md p-4 bg-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-3 md:gap-0">
                {TableTitle && <h2 className="text-lg font-semibold text-gray-800 mb-3">{TableTitle}</h2>}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mt-2 md:mt-0">
                    <Input
                        type="text"
                        placeholder="Search by Material Description..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border px-3 py-2 rounded-md text-sm w-full sm:w-[250px]"
                    />
                    <Select
                        value={selectedCompany || "all"}
                        onValueChange={(value) => setSelectedCompany(value === "all" ? "" : value)}
                    >
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="Select Company" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="all">All</SelectItem>
                                {companyDropdown?.map((item) => (
                                    <SelectItem key={item.name} value={item.name}>
                                        {item.description}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {paginatedData.length ? (
                <Table>
                    <TableHeader>
                        <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] text-center">
                            <TableHead>Sr.No.</TableHead>
                            <TableHead>Requestor Ref No</TableHead>
                            <TableHead>Request Date</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Plant Name</TableHead>
                            <TableHead>Material Type</TableHead>
                            <TableHead>Material Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>View Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((item, idx) => (
                            <TableRow key={item.child_name || idx}>
                                <TableCell className="text-center">{startIndex + idx + 1}</TableCell>
                                <TableCell className="text-center">{item.requestor_ref_no}</TableCell>
                                <TableCell className="text-center">{formatDate(item.request_date)}</TableCell>
                                <TableCell className="text-center">{item.company_code}</TableCell>
                                <TableCell className="text-center">{item.plant || "-"}</TableCell>
                                <TableCell className="text-center">{item.material_type}</TableCell>
                                <TableCell className="text-center">{item.material_description}</TableCell>
                                <TableCell>
                                    <p
                                        className={`rounded-[10px] text-[14px] font-medium text-center py-[7px] mx-auto w-[160px] ${item.approval_status === "Pending by CP" || !item.approval_status
                                                ? "bg-[#f35100] text-white"
                                                : ["Approved by CP", "Code Generated by SAP", "Sent to SAP"].includes(item.approval_status)
                                                    ? "bg-[#10ad30] text-white border"
                                                    : item.approval_status === "Re-Opened by CP"
                                                        ? "bg-[#f72fe3] text-white"
                                                        : item.approval_status === "Updated by CP"
                                                            ? "bg-[#2e8cf1] text-white"
                                                            : item.approval_status === "Use Existing Code"
                                                                ? "bg-[#3698ee] text-white"
                                                                : "bg-[#FFC6C6] text-white"
                                            }`}
                                    >
                                        {item.approval_status || "Pending"}
                                    </p>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Link
                                        href={`/new-material-code-request-form?name=${encodeURIComponent(item.requestor_ref_no)}&material_name=${encodeURIComponent(item.child_name)}`}
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

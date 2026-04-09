"use client";

import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/atoms/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, User, FileCheck, Eye, Mail, AlertTriangle, ChevronDown } from "lucide-react";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import Pagination from "@/src/components/molecules/Pagination-at-all-vendors";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/src/context/AuthContext";
import { Label } from "../atoms/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import PopUp from "@/src/components/molecules/AllvendortablePopUp";
import { FileSearch } from "lucide-react";

interface ESGForm {
    form_name: string;
    total_esg_score: string;
    status: string;
    form_is_submitted: number;
}

interface ASAVendor {
    vendor_id: string;
    vendor_name: string;
    responsible_users: {
        user_id: string;
        employee_id: string;
        employee_name: string;
    }[];
    esg_forms: ESGForm[];
}

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

const PurchaseASAVendorTable = () => {
    const router = useRouter();
    const { asaResponsibleUser } = useAuth();
    const [vendors, setVendors] = useState<ASAVendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterUsers, setFilterUsers] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [minScore, setMinScore] = useState("");
    const [maxScore, setMaxScore] = useState("");

    const debouncedSearch = useDebounce(searchTerm, 500);
    const debouncedUsers = useDebounce(filterUsers, 500);
    const debouncedMinScore = useDebounce(minScore, 500);
    const debouncedMaxScore = useDebounce(maxScore, 500);

    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
        total_records: 0,
        page_size: 10
    });

    const [expandedVendors, setExpandedVendors] = useState<Set<string>>(new Set());

    const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
    const [selectedReminderName, setSelectedReminderName] = useState("");
    const [remarks, setRemarks] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchASAVendors = async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                page_size: pagination.page_size.toString(),
                vendor_name: debouncedSearch,
                responsible_users: debouncedUsers,
                esg_status: filterStatus === "All" ? "" : filterStatus,
                min_score: debouncedMinScore,
                max_score: debouncedMaxScore,
            });

            const res: AxiosResponse<any> = await requestWrapper({
                url: `${API_END_POINTS.getasaallvendors}?${params.toString()}`,
                method: "GET",
            });

            if (res.data?.message) {
                const { data, total_count, page_size } = res.data.message;
                setVendors(data || []);
                setPagination(prev => ({
                    ...prev,
                    current_page: page,
                    total_records: total_count,
                    total_pages: Math.ceil(total_count / page_size),
                }));
            }
        } catch (error) {
            console.error("Error fetching ASA vendors:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchASAVendors(1);
    }, [debouncedSearch, debouncedUsers, filterStatus, debouncedMinScore, debouncedMaxScore]);

    const handleResetFilters = () => {
        setSearchTerm("");
        setFilterUsers("");
        setFilterStatus("All");
        setMinScore("");
        setMaxScore("");
    };

    const handleSendReminder = (name: string) => {
        setSelectedReminderName(name);
        setRemarks("");
        setIsReminderModalOpen(true);
    };

    const submitReminderEmail = async () => {
        if (!selectedReminderName) return;
        setIsSubmitting(true);

        try {
            const res: AxiosResponse = await requestWrapper({
                url: API_END_POINTS.asasendremindermail,
                method: "POST",
                data: {
                    name: selectedReminderName,
                    remarks: remarks || "Auto-generated reminder from Purchase Dashboard",
                },
            });

            if (res?.status === 200) {
                alert("Reminder email sent successfully!");
                setIsReminderModalOpen(false);
            }
        } catch (err) {
            console.error("Error sending reminder:", err);
            alert("Failed to send reminder.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleViewAsaForm = (vendorId: string, vendorName: string) => {
        localStorage.setItem("vendor_name", vendorName);
        router.push(`/view-asa-form?tabtype=company_information&vms_ref_no=${vendorId}`);
    };

    const toggleExpand = (vendorId: string) => {
        const next = new Set(expandedVendors);
        if (next.has(vendorId)) {
            next.delete(vendorId);
        } else {
            next.add(vendorId);
        }
        setExpandedVendors(next);
    };

    const getMainStatus = (forms: ESGForm[]) => {
        if (!forms || forms.length === 0) return "Pending";
        
        // Priority: Verified > Awaiting Verification > Draft > Rejected
        if (forms.some(f => f.status === "Verified")) return "Verified";
        if (forms.some(f => f.status === "Awaiting Verification")) return "Awaiting Verification";
        if (forms.some(f => f.status === "Draft")) return "Draft";
        if (forms.some(f => f.status === "Rejected")) return "Rejected";
        
        return forms[0].status;
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "verified": return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
            case "rejected": return "bg-rose-100 text-rose-700 border-rose-200";
            default: return "bg-blue-100 text-blue-700 border-blue-200";
        }
    };

    const startIdx = (pagination.current_page - 1) * pagination.page_size;

    return (
        <TooltipProvider>
            <div className="space-y-4">
                {/* Advanced Filter Panel */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-50 rounded-lg">
                                <Search className="w-4 h-4 text-blue-600" />
                            </div>
                            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight">Advanced Filters</h2>
                        </div>
                        <button
                            onClick={handleResetFilters}
                            className="text-xs font-medium text-gray-400 hover:text-blue-600 transition-colors"
                        >
                            Reset All
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-gray-400 uppercase ml-1">Vendor Name</Label>
                            <Input
                                placeholder="Filter by vendor..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="h-9 text-sm bg-gray-50/50 border-gray-100 focus:bg-white transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-gray-400 uppercase ml-1">Responsible User</Label>
                            <Input
                                placeholder="Search by user email..."
                                value={filterUsers}
                                onChange={(e) => setFilterUsers(e.target.value)}
                                className="h-9 text-sm bg-gray-50/50 border-gray-100 focus:bg-white transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-gray-400 uppercase ml-1">ESG Status</Label>
                            <div className="h-9">
                                {/* Using a simple native select or keeping standard Select from UI if available */}
                                <select 
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="w-full h-full px-3 text-sm bg-gray-50/50 border border-gray-100 rounded-lg outline-none focus:bg-white transition-all"
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="Draft">Draft</option>
                                    <option value="Awaiting Verification">Awaiting Verification</option>
                                    <option value="Verified">Verified</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-gray-400 uppercase ml-1">ESG Score Range</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    placeholder="Min"
                                    value={minScore}
                                    onChange={(e) => setMinScore(e.target.value)}
                                    className="h-9 text-sm bg-gray-50/50 border-gray-100 focus:bg-white transition-all w-full"
                                />
                                <span className="text-gray-300">-</span>
                                <Input
                                    type="number"
                                    placeholder="Max"
                                    value={maxScore}
                                    onChange={(e) => setMaxScore(e.target.value)}
                                    className="h-9 text-sm bg-gray-50/50 border-gray-100 focus:bg-white transition-all w-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden bg-white relative">
                    {loading && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-20">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                <span className="text-xs font-semibold text-gray-500 tracking-wide">Refining results...</span>
                            </div>
                        </div>
                    )}
                    <div className="overflow-x-auto">
                        <Table className="min-w-full text-[13px]">
                            <TableHeader className="bg-blue-100 border-b border-blue-200 shadow-sm text-black">
                                <TableRow>
                                    <TableHead className="w-[60px] font-semibold text-black py-4 text-center">Sr. No.</TableHead>
                                    <TableHead className="w-[120px] font-semibold text-black py-4">Vendor ID</TableHead>
                                    <TableHead className="min-w-[200px] font-semibold text-black py-4">Vendor Name</TableHead>
                                    <TableHead className="min-w-[200px] font-semibold text-black py-4">Responsible Users</TableHead>
                                    <TableHead className="w-[140px] font-semibold text-black py-4 text-center">Status</TableHead>
                                    <TableHead className="w-[100px] font-semibold text-black py-4 text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vendors.length === 0 && !loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-gray-400 italic">
                                            No ASA vendors found matching these filters
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    vendors.map((vendor, index) => {
                                        const isExpanded = expandedVendors.has(vendor.vendor_id);
                                        const hasSubmittedForm = vendor.esg_forms.some(f => f.form_is_submitted === 1);
                                        const mainStatus = getMainStatus(vendor.esg_forms);

                                        return (
                                            <React.Fragment key={vendor.vendor_id}>
                                                <TableRow className={cn("hover:bg-gray-50 transition-colors border-b border-gray-50", isExpanded && "bg-violet-50/10 hover:bg-violet-50/20")}>
                                                    <TableCell className="text-center text-gray-500 font-medium font-mono">
                                                        {startIdx + index + 1}
                                                    </TableCell>
                                                    <TableCell className="font-bold text-blue-600 tracking-tight">
                                                        {vendor.vendor_id}
                                                    </TableCell>
                                                    <TableCell className="font-extrabold text-gray-800 tracking-tight">
                                                        {vendor.vendor_name}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {vendor.responsible_users.length > 0 ? (
                                                                vendor.responsible_users.map((user, idx) => (
                                                                    <Badge key={idx} variant="outline" className="bg-blue-50/50 text-blue-700 border-blue-100 font-bold px-2 py-0.5 whitespace-nowrap text-[10px]">
                                                                        <User className="w-3 h-3 mr-1 opacity-70" />
                                                                        {typeof user === 'string' ? user : user.employee_name}
                                                                    </Badge>
                                                                ))
                                                            ) : (
                                                                <span className="text-gray-400 italic text-[11px]">Not Assigned</span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge className={cn("text-[10px] font-black px-2 py-1 border-none shadow-sm", getStatusColor(mainStatus))}>
                                                            {mainStatus}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            {hasSubmittedForm ? (
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <button
                                                                            onClick={() => toggleExpand(vendor.vendor_id)}
                                                                            className={cn(
                                                                                "flex items-center justify-center w-8 h-8 rounded-lg bg-violet-50 border border-violet-100 text-violet-600 hover:bg-violet-600 hover:text-white transition-all shadow-sm",
                                                                                isExpanded && "bg-violet-600 text-white"
                                                                            )}
                                                                        >
                                                                            <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isExpanded && "rotate-180")} />
                                                                        </button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent side="top">Expand to view assessments</TooltipContent>
                                                                </Tooltip>
                                                            ) : (
                                                                asaResponsibleUser === 1 && (
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <button
                                                                                onClick={() => handleSendReminder(vendor.vendor_id)}
                                                                                className="flex items-center justify-center w-8 h-8 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95"
                                                                            >
                                                                                <Mail className="w-4 h-4" />
                                                                            </button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>Send Reminder Email</TooltipContent>
                                                                    </Tooltip>
                                                                )
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>

                                                {/* Expanded Content Row */}
                                                {isExpanded && (
                                                    <TableRow className="bg-violet-50/5 hover:bg-violet-50/10 border-b border-gray-100">
                                                        <TableCell colSpan={6} className="p-0 border-none outline-none">
                                                            <div className="p-4 bg-white/40 backdrop-blur-sm">
                                                                <div className="bg-white rounded-2xl border border-violet-100 shadow-xl overflow-hidden ring-1 ring-black/5">
                                                                    <div className="px-4 py-3 bg-violet-50/50 border-b border-violet-100 flex items-center justify-between">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="p-1.5 bg-violet-600 rounded-lg shadow-sm shadow-violet-200">
                                                                                <FileSearch className="w-4 h-4 text-white" />
                                                                            </div>
                                                                            <div>
                                                                                <h4 className="text-[11px] font-black text-violet-900 uppercase tracking-widest leading-none">Assessment History</h4>
                                                                                <p className="text-[10px] font-bold text-violet-400 mt-1">{vendor.vendor_name} ({vendor.vendor_id})</p>
                                                                            </div>
                                                                        </div>
                                                                        <Badge className="bg-white text-violet-600 border-violet-100 font-black px-2 py-0.5 text-[10px]">
                                                                            {vendor.esg_forms.length} Records
                                                                        </Badge>
                                                                    </div>
                                                                    <Table className="min-w-full">
                                                                        <TableHeader className="bg-gray-50/50">
                                                                            <TableRow className="hover:bg-transparent border-b border-gray-100">
                                                                                <TableHead className="h-10 py-0 text-[10px] font-black text-gray-500 uppercase tracking-widest pl-6">ASA Form Name</TableHead>
                                                                                <TableHead className="h-10 py-0 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Submission Status</TableHead>
                                                                                <TableHead className="h-10 py-0 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">ESG Performance Score</TableHead>
                                                                                <TableHead className="h-10 py-0 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right pr-6">Management Action</TableHead>
                                                                            </TableRow>
                                                                        </TableHeader>
                                                                        <TableBody>
                                                                            {vendor.esg_forms.map((form, fIdx) => (
                                                                                <TableRow key={fIdx} className="hover:bg-violet-50/30 border-b border-gray-50 last:border-0 transition-colors">
                                                                                    <TableCell className="py-4 pl-6">
                                                                                        <div className="flex items-center gap-3">
                                                                                            <div className="p-2 bg-emerald-50 rounded-xl">
                                                                                                <FileCheck className="w-4 h-4 text-emerald-600" />
                                                                                            </div>
                                                                                            <span className="text-[13px] font-bold text-gray-900 tracking-tight">{form.form_name}</span>
                                                                                        </div>
                                                                                    </TableCell>
                                                                                    <TableCell className="py-4 text-center">
                                                                                        <Badge className={cn("text-[10px] font-black px-3 py-1 border-none shadow-sm capitalize", getStatusColor(form.status))}>
                                                                                            <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 opacity-50" />
                                                                                            {form.status}
                                                                                        </Badge>
                                                                                    </TableCell>
                                                                                    <TableCell className="py-4 text-center">
                                                                                        <div className="inline-flex flex-col items-center">
                                                                                            <span className="text-[14px] font-black text-blue-700 leading-none">
                                                                                                {form.total_esg_score}
                                                                                            </span>
                                                                                            <div className="w-16 h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden ring-1 ring-gray-200/50">
                                                                                                <div 
                                                                                                    className="h-full bg-blue-500 transition-all duration-1000"
                                                                                                    style={{ width: `${Math.min(parseFloat(form.total_esg_score), 100)}%` }}
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                    </TableCell>
                                                                                    <TableCell className="py-4 text-right pr-6">
                                                                                        <div className="flex items-center justify-end gap-3">
                                                                                            {form.form_is_submitted === 0 && asaResponsibleUser === 1 && (
                                                                                                <button
                                                                                                    onClick={() => handleSendReminder(form.form_name)}
                                                                                                    className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all"
                                                                                                >
                                                                                                    <Mail className="w-3.5 h-3.5" />
                                                                                                    Notify
                                                                                                </button>
                                                                                            )}
                                                                                            <button
                                                                                                onClick={() => handleViewAsaForm(vendor.vendor_id, vendor.vendor_name)}
                                                                                                className="flex items-center gap-2 text-[11px] font-black text-white bg-violet-600 px-4 py-2 rounded-xl hover:bg-violet-700 transition-all shadow-lg active:scale-95 shadow-violet-200"
                                                                                            >
                                                                                                <Eye className="w-4 h-4" />
                                                                                                View Report
                                                                                            </button>
                                                                                        </div>
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            ))}
                                                                        </TableBody>
                                                                    </Table>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </React.Fragment>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Pagination */}
                {!loading && vendors.length > 0 && (
                    <div className="flex items-center justify-between pt-4 px-2">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                          Showing <span className="text-gray-900">{vendors.length}</span> of <span className="text-gray-900">{pagination.total_records}</span> Vendors
                        </p>
                        <Pagination
                            currentPage={pagination.current_page}
                            totalPages={pagination.total_pages}
                            onPageChange={(page) => fetchASAVendors(page)}
                        />
                    </div>
                )}

                {/* Reminder Popup */}
                {isReminderModalOpen && (
                    <PopUp
                        handleClose={() => setIsReminderModalOpen(false)}
                        headerText="ASA Notification"
                        isSubmit={true}
                        Submitbutton={submitReminderEmail}
                        submitLabel={isSubmitting ? "Processing..." : "Notify Vendor"}
                        classname="md:max-w-md"
                        padding="p-5"
                    >
                        <div className="space-y-4 py-2">
                            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-2xl border border-indigo-100 shadow-sm">
                                <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest mb-2">Recipient Context</p>
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                                        <Mail className="w-5 h-5 text-indigo-500" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                      <span className="text-sm text-gray-900 font-black truncate leading-tight">
                                          {selectedReminderName}
                                      </span>
                                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter italic">ASA Form Submission Request</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">
                                    Strategic Remarks
                                </Label>
                                <textarea
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    placeholder="Add specific instructions or urgency context here..."
                                    className="w-full h-32 p-4 text-sm bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all resize-none shadow-inner font-medium outline-none"
                                />
                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold ml-1 opacity-70">
                                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                                  Markdown-style bullet points are supported.
                                </div>
                            </div>
                        </div>
                    </PopUp>
                )}
            </div>
        </TooltipProvider>
    );
};

export default PurchaseASAVendorTable;

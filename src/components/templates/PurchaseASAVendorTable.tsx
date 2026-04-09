"use client";

import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/atoms/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, User, FileCheck, Eye, Mail } from "lucide-react";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import Pagination from "@/src/components/molecules/Pagination-at-all-vendors";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/src/context/AuthContext";
import PopUp from "@/src/components/molecules/AllvendortablePopUp";
import { Label } from "../atoms/label";



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
    const debouncedSearch = useDebounce(searchTerm, 500);
    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
        total_records: 0,
        page_size: 10
    });

    // Modal State
    const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
    const [selectedReminderName, setSelectedReminderName] = useState("");
    const [remarks, setRemarks] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);


    const fetchASAVendors = async (page = 1) => {
        setLoading(true);
        try {
            const res: AxiosResponse<any> = await requestWrapper({
                url: `${API_END_POINTS.getasaallvendors}?page=${page}&page_size=${pagination.page_size}&vendor_name=${debouncedSearch}`,
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
    }, [debouncedSearch]);

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
                {/* Table Header / Search */}
                <div className="flex items-center justify-between gap-4 p-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search ASA vendors..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-10 bg-gray-50/50 border-gray-200 rounded-xl focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Table Container */}
                <div className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden bg-white">
                    <div className="overflow-x-auto">
                        <Table className="min-w-full text-[13px]">
                            <TableHeader className="bg-blue-100 border-b border-blue-200 shadow-sm">
                                <TableRow>
                                    <TableHead className="w-[60px] font-semibold text-black py-4 text-center">Sr. No.</TableHead>
                                    <TableHead className="w-[120px] font-semibold text-black py-4">Vendor ID</TableHead>
                                    <TableHead className="min-w-[200px] font-semibold text-black py-4">Vendor Name</TableHead>
                                    <TableHead className="min-w-[200px] font-semibold text-black py-4">Responsible Users</TableHead>
                                    <TableHead className="min-w-[300px] font-semibold text-black py-4 text-center">ESG Forms & Scoring</TableHead>


                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <TableRow key={i} className="animate-pulse">
                                            <TableCell colSpan={5} className="h-16 bg-gray-50/30" />
                                        </TableRow>
                                    ))
                                ) : vendors.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-gray-400">
                                            No ASA vendors found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    vendors.map((vendor, index) => (
                                        <TableRow key={vendor.vendor_id} className="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                                            <TableCell className="text-center text-gray-500 font-medium">
                                                {startIdx + index + 1}
                                            </TableCell>
                                            <TableCell className="font-medium text-blue-600">
                                                {vendor.vendor_id}
                                            </TableCell>
                                            <TableCell className="font-semibold text-gray-800">
                                                {vendor.vendor_name}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {vendor.responsible_users.length > 0 ? (
                                                        vendor.responsible_users.map((user, idx) => (
                                                            <Badge key={idx} variant="outline" className="bg-blue-50/50 text-blue-700 border-blue-100 font-normal px-2 py-0.5 whitespace-nowrap">
                                                                <User className="w-3 h-3 mr-1 opacity-70" />
                                                                {typeof user === 'string' ? user : user.employee_name}
                                                            </Badge>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-400 italic text-xs">Not Assigned</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-2">
                                                    {vendor.esg_forms.length > 0 ? (
                                                        vendor.esg_forms.map((form, idx) => (
                                                            <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100 group hover:border-emerald-200 transition-colors">
                                                                <div className="flex items-center gap-3">
                                                                    <FileCheck className="w-4 h-4 text-emerald-500" />
                                                                    <div className="flex flex-col">
                                                                        <span className="text-[13px] font-medium text-gray-700">{form.form_name}</span>
                                                                        <span className="text-[11px] text-gray-500">
                                                                            Score: <span className="font-bold text-emerald-600">{form.total_esg_score}</span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Badge className={`text-[10px] h-5 shadow-sm ${getStatusColor(form.status)}`}>
                                                                        {form.status}
                                                                    </Badge>
                                                                    {form.form_is_submitted === 1 ? (
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <button
                                                                                    onClick={() => handleViewAsaForm(vendor.vendor_id, vendor.vendor_name)}
                                                                                    className="p-1 hover:bg-white rounded-md transition-all text-blue-600 hover:shadow-sm shadow-none"
                                                                                >
                                                                                    <Eye className="w-4 h-4" />
                                                                                </button>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>View Form</TooltipContent>
                                                                        </Tooltip>
                                                                    ) : (
                                                                        asaResponsibleUser === 1 && (
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <button
                                                                                        onClick={() => handleSendReminder(form.form_name)}
                                                                                        className="p-1 hover:bg-white rounded-md transition-all text-indigo-600 hover:shadow-sm shadow-none"
                                                                                    >
                                                                                        <Mail className="w-4 h-4" />
                                                                                    </button>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent>Send Reminder Email</TooltipContent>
                                                                            </Tooltip>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 border border-dashed border-gray-200 group">
                                                            <span className="text-gray-400 text-xs italic">No forms submitted</span>
                                                            {asaResponsibleUser === 1 && (
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <button
                                                                            onClick={() => handleSendReminder(vendor.vendor_id)}
                                                                            className="p-1.5 hover:bg-white rounded-lg transition-all text-indigo-600 hover:shadow-md border border-transparent hover:border-indigo-100 bg-transparent shadow-none"
                                                                        >
                                                                            <Mail className="w-4 h-4" />
                                                                        </button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>Send Reminder Email</TooltipContent>
                                                                </Tooltip>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Pagination Container */}
                {!loading && vendors.length > 0 && (
                    <div className="flex items-center justify-end pt-4 px-2">
                        <Pagination
                            currentPage={pagination.current_page}
                            totalPages={pagination.total_pages}
                            onPageChange={(page) => fetchASAVendors(page)}
                        />
                    </div>
                )}

                {/* Send Reminder Popup */}
                {isReminderModalOpen && (
                    <PopUp
                        handleClose={() => setIsReminderModalOpen(false)}
                        headerText="Send Reminder Email"
                        isSubmit={true}
                        Submitbutton={submitReminderEmail}
                        submitLabel={isSubmitting ? "Sending..." : "Send"}
                        classname="md:max-w-md"
                        padding="p-5"
                    >
                        <div className="space-y-5 py-2">
                            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 shadow-sm">
                                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-2">Target Recipient</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Mail className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="text-sm text-gray-800 font-semibold truncate">
                                        {selectedReminderName}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                                    Remarks / Message
                                </Label>
                                <textarea
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    placeholder="Enter any additional instructions or remarks for the vendor..."
                                    className="w-full h-32 p-3 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none shadow-inner"
                                />
                                <p className="text-[10px] text-gray-500 italic">These remarks will be included in the reminder email.</p>
                            </div>
                        </div>
                    </PopUp>
                )}
            </div>
        </TooltipProvider>
    );
};

export default PurchaseASAVendorTable;


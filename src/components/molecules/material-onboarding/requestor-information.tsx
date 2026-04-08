"use client";

import React, { useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { MaterialRegistrationFormData, EmployeeDetail } from "@/src/types/MaterialCodeRequestFormTypes";
import { Package } from "lucide-react";



interface RequestorInformationProps {
    form: any;
    EmployeeDetails: EmployeeDetail;
    MaterialOnboarding?: MaterialRegistrationFormData;
    UserDetails?: any;
    companyInfo?: any;
}

export default function RequestorInformation({ form, EmployeeDetails, MaterialOnboarding }: RequestorInformationProps) {
    // Whenever EmployeeDetails changes, reset the form values
    useEffect(() => {
        // VIEW EXISTING FORM MODE
        if (MaterialOnboarding) {
            form.setValue("request_date", MaterialOnboarding.request_date ?? "");
            form.setValue("requested_by", MaterialOnboarding.requested_by ?? "");
            form.setValue("company", MaterialOnboarding.material_company_name ?? "");
            form.setValue("department", MaterialOnboarding.department ?? "");
            form.setValue("sub_department", MaterialOnboarding.sub_department ?? "");
            form.setValue("hod", MaterialOnboarding.hod ?? "");
            form.setValue("immediate_reporting_head", MaterialOnboarding.immediate_reporting_head ?? "");
            form.setValue("contact_information_email", MaterialOnboarding.contact_information_email ?? "");
            form.setValue("contact_information_phone", MaterialOnboarding.contact_information_phone ?? "");
        }

        // NEW FORM MODE
        else if (EmployeeDetails) {
            form.setValue("request_date", new Date().toISOString().split("T")[0]);
            form.setValue("requested_by", EmployeeDetails.name ?? "");
            form.setValue("company", EmployeeDetails.company?.[0]?.company_name ?? "");
            form.setValue("department", EmployeeDetails.department ?? "");
            form.setValue("sub_department", EmployeeDetails.sub_department ?? "");
            form.setValue("hod", EmployeeDetails.head_of_department ?? "");
            form.setValue("immediate_reporting_head", EmployeeDetails.reports_to ?? "");
            form.setValue("contact_information_email", EmployeeDetails.company_email ?? "");
            form.setValue("contact_information_phone", EmployeeDetails.cell_number ?? "");
        }
    }, [EmployeeDetails, MaterialOnboarding, form]);

    return (
        <div className="bg-[#F4F4F6]">
            <div className="flex flex-col justify-between bg-white rounded-xl shadow-sm border border-slate-200 p-3 transition-all duration-300 hover:shadow-md mb-4">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-800 border-b-2 border-slate-100">
                        <Package className="w-6 h-6 text-[#0C72F5]" />
                        <span>Requestor Information</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
                        {/* Column 1 */}
                        <FormField
                            control={form.control}
                            name="request_date"
                            render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                                        Request Date <span className="text-red-500 ml-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-3 text-sm rounded-lg bg-gradient-to-r from-white to-slate-50/50 border border-slate-200/80 shadow-sm text-slate-800 font-medium transition-all duration-300 hover:shadow-md hover:border-blue-400 focus:outline-none cursor-default"
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                            readOnly
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="requested_by"
                            render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                                        Requested By <span className="text-red-500 ml-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 text-sm rounded-lg bg-gradient-to-r from-white to-slate-50/50 border border-slate-200/80 shadow-sm text-slate-800 font-medium transition-all duration-300 hover:shadow-md hover:border-blue-400 focus:outline-none cursor-default"
                                            value={field.value ?? ""}
                                            readOnly
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="company"
                            key="company"
                            render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                                        Company <span className="text-red-500 ml-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 text-sm rounded-lg bg-gradient-to-r from-white to-slate-50/50 border border-slate-200/80 shadow-sm text-slate-800 font-medium transition-all duration-300 hover:shadow-md hover:border-blue-400 focus:outline-none cursor-default"
                                            value={field.value ?? ""}
                                            readOnly
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {/* Column 2 */}
                        <FormField
                            control={form.control}
                            name="department"
                            render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                                        Department <span className="text-red-500 ml-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 text-sm rounded-lg bg-gradient-to-r from-white to-slate-50/50 border border-slate-200/80 shadow-sm text-slate-800 font-medium transition-all duration-300 hover:shadow-md hover:border-blue-400 focus:outline-none cursor-default"
                                            value={field.value ?? ""}
                                            readOnly
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="sub_department"
                            render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                                        Sub-Department <span className="text-red-500 ml-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 text-sm rounded-lg bg-gradient-to-r from-white to-slate-50/50 border border-slate-200/80 shadow-sm text-slate-800 font-medium transition-all duration-300 hover:shadow-md hover:border-blue-400 focus:outline-none cursor-default"
                                            value={field.value ?? ""}
                                            readOnly
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="hod"
                            render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                                        HOD <span className="text-red-500 ml-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 text-sm rounded-lg bg-gradient-to-r from-white to-slate-50/50 border border-slate-200/80 shadow-sm text-slate-800 font-medium transition-all duration-300 hover:shadow-md hover:border-blue-400 focus:outline-none cursor-default"
                                            value={field.value ?? ""}
                                            readOnly
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Column 3 */}
                        <FormField
                            control={form.control}
                            name="immediate_reporting_head"
                            render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                                        Immediate Reporting Head <span className="text-red-500 ml-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 text-sm rounded-lg bg-gradient-to-r from-white to-slate-50/50 border border-slate-200/80 shadow-sm text-slate-800 font-medium transition-all duration-300 hover:shadow-md hover:border-blue-400 focus:outline-none cursor-default"
                                            value={field.value ?? ""}
                                            readOnly
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="contact_information_email"
                            render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                                        Email <span className="text-red-500 ml-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-3 text-sm rounded-lg bg-gradient-to-r from-white to-slate-50/50 border border-slate-200/80 shadow-sm text-slate-800 font-medium transition-all duration-300 hover:shadow-md hover:border-blue-400 focus:outline-none cursor-default"
                                            value={field.value ?? ""}
                                            readOnly
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="contact_information_phone"
                            render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                                        Contact Number <span className="text-red-500 ml-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 text-sm rounded-lg bg-gradient-to-r from-white to-slate-50/50 border border-slate-200/80 shadow-sm text-slate-800 font-medium transition-all duration-300 hover:shadow-md hover:border-blue-400 focus:outline-none cursor-default"
                                            value={field.value ?? ""}
                                            readOnly
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                </div>
            </div>
        </div>
    );
}

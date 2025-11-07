"use client";

import React, { useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { MaterialRegistrationFormData, EmployeeDetail } from "@/src/types/MaterialCodeRequestFormTypes";



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
            form.reset({
                request_date: MaterialOnboarding.request_date ?? "",
                requested_by: MaterialOnboarding.requested_by ?? "",
                company: MaterialOnboarding.material_company_name ?? "",
                department: MaterialOnboarding.department ?? "",
                sub_department: MaterialOnboarding.sub_department ?? "",
                hod: MaterialOnboarding.hod ?? "",
                immediate_reporting_head: MaterialOnboarding.immediate_reporting_head ?? "",
                contact_information_email: MaterialOnboarding.contact_information_email ?? "",
                contact_information_phone: MaterialOnboarding.contact_information_phone ?? "",
            });
        }

        // NEW FORM MODE
        else if (EmployeeDetails) {
            form.reset({
                request_date: new Date().toISOString().split("T")[0],
                requested_by: EmployeeDetails.name ?? "",
                company: EmployeeDetails.company?.[0]?.company_name ?? "",
                department: EmployeeDetails.department ?? "",
                sub_department: EmployeeDetails.sub_department ?? "",
                hod: EmployeeDetails.head_of_department ?? "",
                immediate_reporting_head: EmployeeDetails.reports_to ?? "",
                contact_information_email: EmployeeDetails.company_email ?? "",
                contact_information_phone: EmployeeDetails.cell_number ?? "",
            });
        }
    }, [EmployeeDetails, MaterialOnboarding, form]);

    return (
        <div className="bg-[#F4F4F6]">
            <div className="flex flex-col justify-between pt-4 bg-white rounded-[8px]">
                <div className="space-y-1">
                    <div className="text-[20px] font-semibold leading-[24px] text-[#03111F] border-b border-slate-500 pb-1">
                        Requestor Information
                    </div>
                    <div className="grid grid-cols-3 gap-x-6 gap-y-6 mt-4">

                        {/* Column 1 */}
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="request_date"
                                render={({ field }: { field: any }) => (
                                    <FormItem className="flex items-center gap-2">
                                        <FormLabel className="w-40 font-medium text-sm">
                                            Request Date <span className="text-red-500">*</span> :
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                type="date"
                                                className="flex-1 px-3 py-2 text-sm rounded"
                                                value={field.value ?? ""}
                                                onChange={field.onChange}
                                                // {...field}
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
                                    <FormItem className="flex items-center gap-2">
                                        <FormLabel className="w-40 font-medium text-sm">
                                            Requested By <span className="text-red-500">*</span> :
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                type="text"
                                                className="flex-1 px-3 py-2 text-sm rounded"
                                                value={field.value ?? ""}
                                                readOnly
                                                onChange={field.onChange}
                                            // {...field}
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
                                    <FormItem className="flex items-center gap-2">
                                        <FormLabel className="w-40 font-medium text-sm">
                                            Company <span className="text-red-500">*</span> :
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                type="text"
                                                className="flex-1 px-3 py-2 text-sm rounded"
                                                // {...field}
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

                        {/* Column 2 */}
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="department"
                                render={({ field }: { field: any }) => (
                                    <FormItem className="flex items-center gap-2">
                                        <FormLabel className="w-40 font-medium text-sm">
                                            Department <span className="text-red-500">*</span> :
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                type="text"
                                                className="flex-1 px-3 py-2 text-sm rounded"
                                                // {...field}
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
                                    <FormItem className="flex items-center gap-2">
                                        <FormLabel className="w-40 font-medium text-sm">
                                            Sub-Department <span className="text-red-500">*</span> :
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                type="text"
                                                className="flex-1 px-3 py-2 text-sm rounded"
                                                // {...field}
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
                                    <FormItem className="flex items-center gap-2">
                                        <FormLabel className="w-40 font-medium text-sm">
                                            HOD <span className="text-red-500">*</span> :
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                type="text"
                                                className="flex-1 px-3 py-2 text-sm rounded"
                                                // {...field}
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

                        {/* Column 3 */}
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="immediate_reporting_head"
                                render={({ field }: { field: any }) => (
                                    <FormItem className="flex items-center gap-2">
                                        <FormLabel className="w-40 font-medium text-sm">
                                            Immediate Reporting Head <span className="text-red-500">*</span> :
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                type="text"
                                                className="flex-1 px-3 py-2 text-sm rounded"
                                                // {...field}
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
                                    <FormItem className="flex items-center gap-2">
                                        <FormLabel className="w-40 font-medium text-sm">
                                            Email <span className="text-red-500">*</span> :
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                type="email"
                                                className="flex-1 px-3 py-2 text-sm rounded"
                                                // {...field}
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
                                    <FormItem className="flex items-center gap-2">
                                        <FormLabel className="w-40 font-medium text-sm">
                                            Contact Number <span className="text-red-500">*</span> :
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                type="text"
                                                className="flex-1 px-3 py-2 text-sm rounded"
                                                // {...field}
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
        </div>
    );
}

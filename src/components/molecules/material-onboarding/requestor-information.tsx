import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import SignatureCanvas from 'react-signature-canvas';
import { RotateCcw } from "lucide-react";



export default function MaterialApprovalForm({form, onSubmit, role, UserDetails, EmployeeDetails, companyInfo }) {

    React.useEffect(() => {
        if (!form.getValues("request_date")) {
            form.setValue("request_date", new Date().toISOString().split("T")[0]);
        }
    }, [form]);

    const [requestedByDisplay, setRequestedByDisplay] = useState("");

    useEffect(() => {
        if (EmployeeDetails) {
            form.setValue("requested_by", EmployeeDetails.name);
            setRequestedByDisplay(`${EmployeeDetails.full_name} - ${EmployeeDetails.employee_code}`);
            form.setValue("department", EmployeeDetails.department_name);
            form.setValue("sub_department", EmployeeDetails.sub_department_name);
            form.setValue("contact_information_email", EmployeeDetails.email);
            form.setValue("contact_information_phone", EmployeeDetails.contact_number);
            form.setValue("hod", EmployeeDetails.hod);
            form.setValue("immediate_reporting_head", EmployeeDetails.reporting_head);
            form.setValue("company", EmployeeDetails.company);
        }
    }, [EmployeeDetails]);



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
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2">
                                        <FormLabel className="w-40 font-medium text-sm">
                                            Request Date <span className="text-red-500">*</span> :
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                type="date"
                                                className="flex-1 px-3 py-2 text-sm rounded"
                                                value={new Date().toISOString().split("T")[0]}
                                                readOnly
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="requested_by"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2">
                                        <FormLabel className="w-40 font-medium text-sm">
                                            Requested By <span className="text-red-500">*</span> :
                                        </FormLabel>
                                        <FormControl>
                                            <>
                                                <input
                                                    type="text"
                                                    className="flex-1 px-3 py-2 text-sm rounded"
                                                    value={requestedByDisplay}
                                                    readOnly
                                                />
                                                <input
                                                    type="hidden"
                                                    {...field}
                                                />
                                            </>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="company"
                                key="company"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2">
                                        <FormLabel className="w-40 font-medium text-sm">
                                            Company <span className="text-red-500">*</span> :
                                        </FormLabel>
                                        <FormControl>
                                            <>
                                                <input
                                                    type="text"
                                                    className="flex-1 px-3 py-2 text-sm rounded"
                                                    value={`${EmployeeDetails.company} - ${companyInfo.company_name}`}
                                                    readOnly
                                                />
                                                <input type="hidden"
                                                    {...field}
                                                // value={EmployeeDetails.company} 
                                                />
                                            </>
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
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2">
                                        <FormLabel className="w-40 font-medium text-sm">
                                            Department <span className="text-red-500">*</span> :
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                type="text"
                                                className="flex-1 px-3 py-2 text-sm rounded"
                                                {...field}
                                                // value={EmployeeDetails.department_name}
                                                readOnly
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="sub_department"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2">
                                        <FormLabel className="w-40 font-medium text-sm">
                                            Sub-Department <span className="text-red-500">*</span> :
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                type="text"
                                                className="flex-1 px-3 py-2 text-sm rounded"
                                                {...field}
                                                // value={EmployeeDetails.sub_department_name}
                                                readOnly
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="hod"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2">
                                        <FormLabel className="w-40 font-medium text-sm">
                                            HOD <span className="text-red-500">*</span> :
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                type="text"
                                                className="flex-1 px-3 py-2 text-sm rounded"
                                                {...field}
                                                // value={EmployeeDetails.hod}
                                                readOnly
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
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2">
                                        <FormLabel className="w-40 font-medium text-sm">
                                            Immediate Reporting Head <span className="text-red-500">*</span> :
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                type="text"
                                                className="flex-1 px-3 py-2 text-sm rounded"
                                                {...field}
                                                // value={EmployeeDetails.reporting_head}
                                                readOnly
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="contact_information_email"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2">
                                        <FormLabel className="w-40 font-medium text-sm">
                                            Email <span className="text-red-500">*</span> :
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                type="email"
                                                className="flex-1 px-3 py-2 text-sm rounded"
                                                {...field}
                                                // value={EmployeeDetails.email}
                                                readOnly
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="contact_information_phone"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2">
                                        <FormLabel className="w-40 font-medium text-sm">
                                            Contact Number <span className="text-red-500">*</span> :
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                type="text"
                                                className="flex-1 px-3 py-2 text-sm rounded"
                                                {...field}
                                                // value={EmployeeDetails.contact_number}
                                                readOnly
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
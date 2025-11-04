"use client";

import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

interface MaterialOnboardingDetails {
  company?: string;
  request_date?: string;
  requested_by?: string;
  requestor_company?: string;
  requestor_company_name?: string;
  requestor_department?: string;
  sub_department?: string;
  requestor_hod?: string;
  immediate_reporting_head?: string;
  contact_information_email?: string;
  contact_information_phone?: string;
}

interface MaterialRequesterDetailsFormProps {
  form: UseFormReturn<any>;
  onSubmit?: () => void;
  MaterialOnboardingDetails: MaterialOnboardingDetails;
}

const MaterialRequesterDetailsForm: React.FC<MaterialRequesterDetailsFormProps> = ({
  form,
  onSubmit,
  MaterialOnboardingDetails,
}) => {
  useEffect(() => {
    if (MaterialOnboardingDetails.company) {
      form.setValue("company", MaterialOnboardingDetails.company);
    }
    if (MaterialOnboardingDetails.request_date) {
      form.setValue("request_date", MaterialOnboardingDetails.request_date);
    }
  }, [
    MaterialOnboardingDetails.company,
    MaterialOnboardingDetails.request_date,
    form,
  ]);

  return (
    <div className="bg-[#F4F4F6]">
      <div className="flex flex-col justify-between pt-4 bg-white rounded-[8px]">
        <div className="space-y-1">
          <div>
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
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 text-sm rounded"
                          {...field}
                          value={MaterialOnboardingDetails.requested_by || ""}
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
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
                            value={`${MaterialOnboardingDetails.requestor_company || ""} - ${MaterialOnboardingDetails.requestor_company_name || ""}`}
                            readOnly
                          />
                          <input
                            type="hidden"
                            {...field}
                            value={MaterialOnboardingDetails.company || ""}
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
                          value={MaterialOnboardingDetails.requestor_department || ""}
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
                          value={MaterialOnboardingDetails.sub_department || ""}
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
                          value={MaterialOnboardingDetails.requestor_hod || ""}
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
                          value={MaterialOnboardingDetails.immediate_reporting_head || ""}
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
                          value={MaterialOnboardingDetails.contact_information_email || ""}
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
                          value={MaterialOnboardingDetails.contact_information_phone || ""}
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
    </div>
  );
};

export default MaterialRequesterDetailsForm;
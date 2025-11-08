"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn, ControllerRenderProps } from "react-hook-form";
import { MaterialRegistrationFormData } from "@/src/types/MaterialCodeRequestFormTypes";

interface MaterialRequesterDetailsFormProps {
  form: UseFormReturn<any>;
  onSubmit?: () => void;
  MaterialOnboardingDetails?: MaterialRegistrationFormData;
}

const MaterialRequesterDetailsForm: React.FC<MaterialRequesterDetailsFormProps> = ({ onSubmit, MaterialOnboardingDetails }) => {
  // console.log("Material Onboardging Details in requestor form CP role:--->", MaterialOnboardingDetails)

  const form = useForm({
    defaultValues: {
      request_date: "",
      requested_by: "",
      company: "",
      department: "",
      sub_department: "",
      hod: "",
      immediate_reporting_head: "",
      contact_information_email: "",
      contact_information_phone: "",
    },
  });


  const details = Array.isArray(MaterialOnboardingDetails)
    ? MaterialOnboardingDetails[0]
    : MaterialOnboardingDetails;

  useEffect(() => {
    if (details) {
      form.setValue("request_date", details.request_date || "");
      form.setValue("requested_by", details.requested_by || "");
      form.setValue("company", details.material_company_name || "");
      form.setValue("department", details.department || "");
      form.setValue("sub_department", details.sub_department || "");
      form.setValue("hod", details.hod || "");
      form.setValue("immediate_reporting_head", details.immediate_reporting_head || "");
      form.setValue("contact_information_email", details.contact_information_email || "");
      form.setValue("contact_information_phone", details.contact_information_phone || "");
    }
  }, [details, form]);


  return (
    <div className="bg-[#F4F4F6]">
      <div className="flex flex-col justify-between bg-white rounded-[8px]">
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
                  render={({ field }: { field: ControllerRenderProps<any, string> }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel className="w-40 font-medium text-sm">
                        Request Date <span className="text-red-500">*</span> :
                      </FormLabel>
                      <FormControl>
                        <input
                          type="date"
                          className="flex-1 px-3 py-2 text-sm rounded"
                          readOnly
                          // {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requested_by"
                  render={({ field }: { field: ControllerRenderProps<any, string> }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel className="w-40 font-medium text-sm">
                        Requested By <span className="text-red-500">*</span> :
                      </FormLabel>
                      <FormControl>
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 text-sm rounded"
                          // {...field}
                          value={field.value || ""}
                          // value={MaterialOnboardingDetails?.requested_by || ""}
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
                  render={({ field }: { field: ControllerRenderProps<any, string> }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel className="w-40 font-medium text-sm">
                        Company <span className="text-red-500">*</span> :
                      </FormLabel>
                      <FormControl>
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 text-sm rounded"
                          // {...field}
                          value={field.value || ""}
                          // value={`${MaterialOnboardingDetails?.requestor_company || ""} - ${MaterialOnboardingDetails?.requestor_company_name || ""}`}
                          readOnly
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
                  render={({ field }: { field: ControllerRenderProps<any, string> }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel className="w-40 font-medium text-sm">
                        Department <span className="text-red-500">*</span> :
                      </FormLabel>
                      <FormControl>
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 text-sm rounded"
                          // {...field}
                          value={field.value || ""}
                          // value={MaterialOnboardingDetails?.requestor_department || ""}
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
                  render={({ field }: { field: ControllerRenderProps<any, string> }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel className="w-40 font-medium text-sm">
                        Sub-Department <span className="text-red-500">*</span> :
                      </FormLabel>
                      <FormControl>
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 text-sm rounded"
                          // {...field}
                          value={field.value || ""}
                          // value={MaterialOnboardingDetails?.sub_department || ""}
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
                  render={({ field }: { field: ControllerRenderProps<any, string> }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel className="w-40 font-medium text-sm">
                        HOD <span className="text-red-500">*</span> :
                      </FormLabel>
                      <FormControl>
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 text-sm rounded"
                          // {...field}
                          value={field.value || ""}
                          // value={MaterialOnboardingDetails?.requestor_hod || ""}
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
                  render={({ field }: { field: ControllerRenderProps<any, string> }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel className="w-40 font-medium text-sm">
                        Immediate Reporting Head <span className="text-red-500">*</span> :
                      </FormLabel>
                      <FormControl>
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 text-sm rounded"
                          // {...field}
                          value={field.value || ""}
                          // value={MaterialOnboardingDetails?.immediate_reporting_head || ""}
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
                  render={({ field }: { field: ControllerRenderProps<any, string> }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel className="w-40 font-medium text-sm">
                        Email <span className="text-red-500">*</span> :
                      </FormLabel>
                      <FormControl>
                        <input
                          type="email"
                          className="flex-1 px-3 py-2 text-sm rounded"
                          // {...field}
                          value={field.value || ""}
                          // value={MaterialOnboardingDetails?.contact_information_email || ""}
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
                  render={({ field }: { field: ControllerRenderProps<any, string> }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel className="w-40 font-medium text-sm">
                        Contact Number <span className="text-red-500">*</span> :
                      </FormLabel>
                      <FormControl>
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 text-sm rounded"
                          // {...field}
                          value={field.value || ""}
                          // value={MaterialOnboardingDetails?.contact_information_phone || ""}
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
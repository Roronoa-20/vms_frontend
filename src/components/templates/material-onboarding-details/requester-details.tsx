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
  MaterialDetails?: any;
}

const MaterialRequesterDetailsForm: React.FC<MaterialRequesterDetailsFormProps> = ({ form, MaterialOnboardingDetails, MaterialDetails }) => {

  const listData = MaterialOnboardingDetails;
  console.log("[RequesterDetails] Props received -> MaterialOnboardingDetails:", MaterialOnboardingDetails, "MaterialDetails:", MaterialDetails);

  // Safety check for array structure if it persists through prop
  const details = Array.isArray(MaterialDetails) ? MaterialDetails[0] : MaterialDetails;
  console.log("[RequesterDetails] details (after array check):", details);

  // Flexibility for different API response structures
  const fullData = details?.requestor_master || 
                  (details?.doctype === "Requestor Master" ? details : null) || 
                  details;
  console.log("[RequesterDetails] fullData resolved:", fullData);

  // Helper to get value from either source, prioritizing fullData (detailed record)
  const getValue = (field: string, fallbacks: string[] = []) => {
    if (!fullData && !listData) {
      console.log(`[RequesterDetails] getValue('${field}') -> Failed: No fullData and no listData available.`);
      return "";
    }

    // List of sources to check in order
    const sources = [fullData, listData];
    const allFields = [field, ...fallbacks];

    for (const [index, source] of sources.entries()) {
      if (!source) continue;
      for (const f of allFields) {
        if (source[f] !== undefined && source[f] !== null && source[f] !== "") {
          console.log(`[RequesterDetails] getValue('${field}') -> Found in source[${index === 0 ? 'fullData' : 'listData'}] using key '${f}':`, source[f]);
          return source[f];
        }
      }
    }

    console.log(`[RequesterDetails] getValue('${field}') -> Not found in any source or fallback fields:`, allFields);
    return "";
  };

  useEffect(() => {
    console.log("[RequesterDetails] useEffect triggered. Evaluating if form.setValue should run. listData:", !!listData, "fullData:", !!fullData);
    if (listData || fullData) {
      console.log("[RequesterDetails] Setting form values...");
      form.setValue("request_date", getValue("request_date") || "");
      form.setValue("requested_by", getValue("requested_by", ["requested_by_name"]) || "");

      // Company fallback logic
      const companyVal = getValue("requestor_company", [
        "material_company_name",
        "requestor_company_code",
        "requestor_company_name",
        "company_name_display",
        "company_name"
      ]) || details?.material_request_item?.company_name_display || "";
      console.log("[RequesterDetails] Final resolved company value:", companyVal);
      form.setValue("company", companyVal);

      form.setValue("department", getValue("requestor_department", ["department", "requestor_department_name"]) || "");
      form.setValue("sub_department", getValue("sub_department") || "");
      form.setValue("hod", getValue("requestor_hod", ["hod", "requestor_hod_name"]) || "");
      form.setValue("immediate_reporting_head", getValue("immediate_reporting_head") || "");
      form.setValue("contact_information_email", getValue("contact_information_email", ["requestor_email"]) || "");
      form.setValue("contact_information_phone", getValue("contact_information_phone", ["requestor_phone"]) || "");
    }
  }, [MaterialOnboardingDetails, MaterialDetails, form, fullData, listData, details]);

  return (
    <div className="bg-[#F4F4F6] overflow-hidden">
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
                          className="flex-1 px-3 py-2 text-sm rounded bg-gray-50 border border-gray-200"
                          readOnly
                          {...field}
                          value={field.value || getValue("request_date") || ""}
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
                          className="flex-1 px-3 py-2 text-sm rounded bg-gray-50 border border-gray-200"
                          readOnly
                          {...field}
                          value={field.value || getValue("requested_by", ["requested_by_name"]) || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }: { field: ControllerRenderProps<any, string> }) => {
                    const companyVal = getValue("requestor_company", [
                      "material_company_name",
                      "requestor_company_code",
                      "requestor_company_name",
                      "company_name_display",
                      "company_name"
                    ]) || details?.material_request_item?.company_name_display || "";
                    
                    return (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel className="w-40 font-medium text-sm">
                        Company <span className="text-red-500">*</span> :
                      </FormLabel>
                      <FormControl>
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 text-sm rounded bg-gray-50 border border-gray-200"
                          readOnly
                          {...field}
                          value={field.value || companyVal || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}}
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
                          className="flex-1 px-3 py-2 text-sm rounded bg-gray-50 border border-gray-200"
                          readOnly
                          {...field}
                          value={field.value || getValue("requestor_department", ["department", "requestor_department_name"]) || ""}
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
                          className="flex-1 px-3 py-2 text-sm rounded bg-gray-50 border border-gray-200"
                          readOnly
                          {...field}
                          value={field.value || getValue("sub_department") || ""}
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
                          className="flex-1 px-3 py-2 text-sm rounded bg-gray-50 border border-gray-200"
                          readOnly
                          {...field}
                          value={field.value || getValue("requestor_hod", ["hod", "requestor_hod_name"]) || ""}
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
                          className="flex-1 px-3 py-2 text-sm rounded bg-gray-50 border border-gray-200"
                          readOnly
                          {...field}
                          value={field.value || getValue("immediate_reporting_head") || ""}
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
                          className="flex-1 px-3 py-2 text-sm rounded bg-gray-50 border border-gray-200"
                          readOnly
                          {...field}
                          value={field.value || getValue("contact_information_email", ["requestor_email"]) || ""}
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
                          className="flex-1 px-3 py-2 text-sm rounded bg-gray-50 border border-gray-200"
                          readOnly
                          {...field}
                          value={field.value || getValue("contact_information_phone", ["requestor_phone"]) || ""}
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
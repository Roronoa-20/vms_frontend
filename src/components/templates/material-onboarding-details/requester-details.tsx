"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn, ControllerRenderProps } from "react-hook-form";
import { MaterialRegistrationFormData } from "@/src/types/MaterialCodeRequestFormTypes";
import { FileText } from "lucide-react";

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
    <div className="bg-transparent">
      <div className="flex flex-col justify-between bg-gray-100 rounded-xl shadow-sm border border-slate-200 p-3 transition-all duration-300">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-800 border-b border-slate-200 pb-2 mb-2">
            <FileText className="w-4 h-4 text-[#0C72F5]" />
            <span>Requestor Information</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Request Date */}
            <FormField
              control={form.control}
              name="request_date"
              render={({ field }: { field: ControllerRenderProps<any, string> }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">
                    Request Date <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <input
                      type="date"
                      className="w-full h-9 px-3 py-1 text-sm rounded-md border border-slate-200 text-slate-500 font-medium cursor-not-allowed"
                      readOnly
                      {...field}
                      value={field.value || getValue("request_date") || ""}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            {/* Requested By */}
            <FormField
              control={form.control}
              name="requested_by"
              render={({ field }: { field: ControllerRenderProps<any, string> }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">
                    Requested By <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      className="w-full h-9 px-3 py-1 text-sm rounded-md border border-slate-200 text-slate-500 font-medium cursor-not-allowed"
                      readOnly
                      {...field}
                      value={field.value || getValue("requested_by", ["requested_by_name"]) || ""}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            {/* Company */}
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
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">
                      Company <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        className="w-full h-9 px-3 py-1 text-sm rounded-md border border-slate-200 text-slate-500 font-medium cursor-not-allowed"
                        readOnly
                        {...field}
                        value={field.value || companyVal || ""}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )
              }}
            />

            {/* Department */}
            <FormField
              control={form.control}
              name="department"
              render={({ field }: { field: ControllerRenderProps<any, string> }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">
                    Department <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      className="w-full h-9 px-3 py-1 text-sm rounded-md border border-slate-200 text-slate-500 font-medium cursor-not-allowed"
                      readOnly
                      {...field}
                      value={field.value || getValue("requestor_department", ["department", "requestor_department_name"]) || ""}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            {/* Sub-Department */}
            <FormField
              control={form.control}
              name="sub_department"
              render={({ field }: { field: ControllerRenderProps<any, string> }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">
                    Sub-Department <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      className="w-full h-9 px-3 py-1 text-sm rounded-md border border-slate-200 text-slate-500 font-medium cursor-not-allowed"
                      readOnly
                      {...field}
                      value={field.value || getValue("sub_department") || ""}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            {/* HOD */}
            <FormField
              control={form.control}
              name="hod"
              render={({ field }: { field: ControllerRenderProps<any, string> }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">
                    HOD <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      className="w-full h-9 px-3 py-1 text-sm rounded-md border border-slate-200 text-slate-500 font-medium cursor-not-allowed"
                      readOnly
                      {...field}
                      value={field.value || getValue("requestor_hod", ["hod", "requestor_hod_name"]) || ""}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            {/* Immediate Reporting Head */}
            <FormField
              control={form.control}
              name="immediate_reporting_head"
              render={({ field }: { field: ControllerRenderProps<any, string> }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">
                    Reporting Head <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      className="w-full h-9 px-3 py-1 text-sm rounded-md border border-slate-200 text-slate-500 font-medium cursor-not-allowed"
                      readOnly
                      {...field}
                      value={field.value || getValue("immediate_reporting_head") || ""}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="contact_information_email"
              render={({ field }: { field: ControllerRenderProps<any, string> }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">
                    Email <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <input
                      type="email"
                      className="w-full h-9 px-3 py-1 text-sm rounded-md border border-slate-200 text-slate-500 font-medium cursor-not-allowed"
                      readOnly
                      {...field}
                      value={field.value || getValue("contact_information_email", ["requestor_email"]) || ""}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            {/* Contact Number */}
            <FormField
              control={form.control}
              name="contact_information_phone"
              render={({ field }: { field: ControllerRenderProps<any, string> }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">
                    Phone <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      className="w-full h-9 px-3 py-1 text-sm rounded-md border border-slate-200 text-slate-500 font-medium cursor-not-allowed"
                      readOnly
                      {...field}
                      value={field.value || getValue("contact_information_phone", ["requestor_phone"]) || ""}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialRequesterDetailsForm;
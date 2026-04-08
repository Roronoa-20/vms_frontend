"use client";

import React, { useEffect, useState } from "react";
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
import { ControllerRenderProps, FieldValues, UseFormReturn } from "react-hook-form";
import {
  MaterialRegistrationFormData,
  EmployeeDetail,
  MaterialRequestData,
} from "@/src/types/MaterialCodeRequestFormTypes";
import { CheckCircle } from "lucide-react";

interface MaterialApprovalFormProps {
  form: UseFormReturn<MaterialRegistrationFormData>;
  role: string;
  EmployeeDetailsJSON?: EmployeeDetail;
  MaterialOnboardingDetails?: MaterialRegistrationFormData;
  MaterialDetails?: MaterialRequestData;
}

const MaterialApprovalForm: React.FC<MaterialApprovalFormProps> = ({
  form,
  role,
  EmployeeDetailsJSON,
  MaterialOnboardingDetails,
  MaterialDetails,
}) => {
  const [approvalStatusState, setApprovalStatusState] = useState<string | undefined>(
    undefined
  );

  function formatDate(date: string | Date): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);
    return `${day}.${month}.${year}`;
  }

  // Load initial values into RHF
  useEffect(() => {
    const data = MaterialDetails?.material_onboarding;
    if (!data) return;

    const fields = [
      "special_instructionsnotes",
      "requested_by_name",
      "requested_by_place",
      "approval_date",
      "approved_by_name",
      "approved_by_place",
    ] as const;

    setApprovalStatusState(data.approval_stage || "");

    fields.forEach((field) => {
      if (data[field]) {
        form.setValue(field, data[field] as any);
      }
    });
  }, [MaterialDetails, form]);

  useEffect(() => {
    if (EmployeeDetailsJSON) {
      form.setValue("approved_by_name", EmployeeDetailsJSON.company_email);
    }
  }, [EmployeeDetailsJSON, form]);


  useEffect(() => {
    if (MaterialOnboardingDetails?.requested_by) {
      form.setValue("requested_by_name", MaterialOnboardingDetails.requested_by);
    }
    if (MaterialOnboardingDetails?.requested_by_place) {
      form.setValue(
        "requested_by_place",
        MaterialOnboardingDetails.requested_by_place
      );
    }
  }, [MaterialOnboardingDetails, form]);

  return (
    <div className="bg-gray-50">
      <div className="flex flex-col justify-between rounded-xl shadow-sm border border-slate-200 p-3 transition-all duration-300">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-800 border-b border-slate-200 pb-2 mb-2">
            <CheckCircle className="w-4 h-4 text-[#0C72F5]" />
            <span>Additional Information & Approvals</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Requested By - Name */}
            <FormField
              control={form.control}
              name="requested_by_name"
              render={({ field }: { field: ControllerRenderProps<FieldValues, "requested_by_name"> }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">Requested By - Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full h-9 px-3 py-1 text-sm rounded-md !bg-white !disabled:bg-white !opacity-100 !disabled:opacity-100 border border-slate-200 text-black font-medium cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter Name"
                      readOnly
                      disabled={role === "Material User"}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            {/* Requested By - Place */}
            <FormField
              control={form.control}
              name="requested_by_place"
              render={({ field }: { field: ControllerRenderProps<FieldValues, "requested_by_place"> }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">Requested By - Place</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full h-9 px-3 py-1 text-sm rounded-md !bg-white !disabled:bg-white !opacity-100 !disabled:opacity-100 border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-slate-700 placeholder:text-slate-400 disabled:opacity-50"
                      placeholder="Enter Place"
                      disabled={role === "Material User"}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            {/* Approved By - Name */}
            <FormField
              control={form.control}
              name="approved_by_name"
              render={({ field }: { field: ControllerRenderProps<FieldValues, "approved_by_name"> }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">Approved By - Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={EmployeeDetailsJSON?.name || ""}
                      readOnly
                      disabled={role === "Material User"}
                      onChange={() => { }}
                      className="w-full h-9 px-3 py-1 text-sm rounded-md !bg-white !disabled:bg-white !opacity-100 !disabled:opacity-100 border border-slate-200 text-black font-medium cursor-not-allowed disabled:opacity-50"
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            {/* Approved By - Place */}
            <FormField
              control={form.control}
              name="approved_by_place"
              render={({ field }: { field: ControllerRenderProps<FieldValues, "approved_by_place"> }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">Approved By - Place</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full h-9 px-3 py-1 text-sm rounded-md !bg-white !disabled:bg-white !opacity-100 !disabled:opacity-100 border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-slate-700 placeholder:text-slate-400 disabled:opacity-50"
                      placeholder="Enter Place"
                      disabled={role === "Material User"}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            {/* Approval Date */}
            <div className="space-y-1.5">
              <Label htmlFor="approval_date" className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">
                Approval Date
              </Label>
              <input
                type="text"
                id="approval_date"
                name="approval_date"
                className="w-full h-9 px-3 py-1 text-sm rounded-md !bg-white !disabled:bg-white !opacity-100 !disabled:opacity-100 border border-slate-200 text-black font-medium cursor-not-allowed disabled:opacity-50"
                readOnly
                disabled={role === "Material User"}
                value={
                  MaterialDetails?.material_onboarding?.approval_stage === "Approved"
                    ? formatDate(
                      MaterialDetails.material_onboarding.approval_date || new Date()
                    )
                    : formatDate(new Date())
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialApprovalForm;
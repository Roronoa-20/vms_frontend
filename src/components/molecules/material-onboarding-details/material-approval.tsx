"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import SignatureCanvas from "react-signature-canvas";
import { RotateCcw } from "lucide-react";
import { ControllerRenderProps, FieldValues, UseFormReturn } from "react-hook-form";
import { MaterialRegistrationFormData, EmployeeDetail, Company, Plant, division, industry, ClassType, UOMMaster, MRPType, ValuationClass, procurementType, ValuationCategory, MaterialGroupMaster, MaterialCategory, ProfitCenter, AvailabilityCheck, PriceControl, MRPController, StorageLocation, InspectionType, SerialNumber, LotSize, SchedulingMarginKey, ExpirationDate, MaterialRequestData, MaterialType, MaterialMaster } from "@/src/types/MaterialCodeRequestFormTypes";


interface MaterialApprovalFormProps {
  form: UseFormReturn<MaterialRegistrationFormData>;
  role: string;
  EmployeeDetails?: EmployeeDetail;
  MaterialOnboardingDetails?: MaterialRegistrationFormData;
  MaterialDetails?: MaterialRequestData;
}

const MaterialApprovalForm: React.FC<MaterialApprovalFormProps> = ({ form, role, EmployeeDetails, MaterialOnboardingDetails, MaterialDetails }) => {
  console.log("Approval MaterialOnboardingDetails--->", MaterialOnboardingDetails);

  const [approvalStatusState, setApprovalStatusState] = useState<string | undefined>(undefined);

  function formatDate(date: string | Date): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);
    return `${day}.${month}.${year}`;
  }

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
        form.setValue(field, data[field]);
      }
    });
  }, [MaterialDetails, form]);

  return (
    <div className="bg-[#F4F4F6]">
      <div className="flex flex-col justify-between bg-white rounded-[8px]">
        <div className="space-y-1">
          <div className="text-[20px] font-semibold leading-[24px] text-[#03111F] border-b border-slate-500 pb-1">
            Additional Information & Approvals
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="requested_by_name"
                key="requested_by_name"
                render={({ field }: { field: ControllerRenderProps<FieldValues, "requested_by_name"> }) => (
                  <FormItem>
                    <FormLabel>Requested By - Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="p-3 w-full text-sm placeholder:text-gray-400"
                        placeholder="Enter Name"
                        value={MaterialOnboardingDetails?.requested_by || ""}
                        disabled={role === "Material User"}
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="requested_by_place"
                key="requested_by_place"
                render={({ field }: { field: ControllerRenderProps<FieldValues, "requested_by_place"> }) => (
                  <FormItem>
                    <FormLabel>Requested By - Place</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="p-3 w-full text-sm placeholder:text-gray-400"
                        value={MaterialOnboardingDetails?.requested_by_place || ""}
                        disabled={role === "Material User"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="approved_by_name"
                key="approved_by_name"
                render={({ field }: { field: ControllerRenderProps<FieldValues, "approved_by_name"> }) => (
                  <FormItem>
                    <FormLabel>Approved By - Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="p-3 w-full text-sm placeholder:text-gray-400"
                        placeholder="Enter Name"
                        value={EmployeeDetails?.name || ""}
                        disabled={role === "Material User"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="approved_by_place"
                key="approved_by_place"
                render={({ field }: { field: ControllerRenderProps<FieldValues, "approved_by_place"> }) => (
                  <FormItem>
                    <FormLabel>Approved By - Place</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="p-3 w-full text-sm placeholder:text-gray-400"
                        placeholder="Enter Place"
                        disabled={role === "Material User"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2 col-span-1">
              <Label htmlFor="approval_date" className="text-sm font-medium text-gray-700">
                Approval Date
              </Label>
              <input
                type="text"
                id="approval_date"
                name="approval_date"
                key="approval_date"
                className="w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md placeholder:text-[14px]"
                readOnly
                disabled={role === "Material User"}
                value={
                  MaterialDetails?.material_onboarding?.approval_stage === "Approved"
                    ? formatDate(MaterialDetails.material_onboarding.approval_date || new Date())
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
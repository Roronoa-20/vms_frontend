"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/newselect";
import UOMConversionModal from "@/src/components/molecules/material-onboarding-modal/UOMConversionModal";
import { ControllerRenderProps, FieldValues, UseFormReturn } from "react-hook-form";
import { MaterialRegistrationFormData, Company, UOMMaster, MRPType, ValuationClass, procurementType, MRPController, LotSize, SchedulingMarginKey, MaterialRequestData, MaterialType, MRPGroup } from "@/src/types/MaterialCodeRequestFormTypes";
import { Package } from "lucide-react";


interface OptionType {
  name: string;
  description?: string;
  [key: string]: any;
}


interface MaterialMRPFormProps {
  form: UseFormReturn<any>;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  ValuationClass?: ValuationClass[];
  role?: string;
  ProcurementType?: procurementType[];
  designationname?: string;
  MaterialOnboardingDetails?: MaterialRegistrationFormData;
  LotSize?: LotSize[];
  PurchaseGroup?: OptionType[];
  companyInfo?: Company[];
  UnitOfMeasure?: UOMMaster[];
  MRPType?: MRPType[];
  MRPController?: MRPController[];
  MRPGroup?: MRPGroup[];
  AllMaterialType?: MaterialType[];
  MaterialDetails?: MaterialRequestData;
  SMK?: SchedulingMarginKey[];
  isZCAPMaterial?: boolean;
}

const MaterialMRPForm: React.FC<MaterialMRPFormProps> = ({ form, ProcurementType, LotSize, UnitOfMeasure, MRPType, MRPController, MaterialDetails, SMK, isZCAPMaterial, MRPGroup }) => {

  const [showConversionModal, setShowConversionModal] = useState<boolean>(false);
  const [conversionRatio, setConversionRatio] = useState<string>("");
  const issueUOM = form.watch("issue_unit");
  const baseUOM = MaterialDetails?.material_request_item?.unit_of_measure;
  const showConversionUOM = baseUOM && issueUOM && baseUOM !== issueUOM;
  const [issueUOMSearch, setIssueUOMSearch] = useState<string>("");
  const [MRPControllerSearch, setMRPControllerSearch] = useState<string>("");
  const [lotsizeSearch, setlotsizeSearch] = useState<string>("");
  const MRPTypeValue = form.watch("mrp_type");
  const materialCategory = MaterialDetails?.material_request_item?.material_category;
  const watchedMaterialCategory = form.watch("material_category") || materialCategory;
  const shouldShowSMK = !isZCAPMaterial && (watchedMaterialCategory === "R" || watchedMaterialCategory === "P");

  useEffect(() => {
    if (MRPTypeValue === "ND") {
      form.setValue("procurement_type", "F");
    }
  }, [MRPTypeValue, form]);

  useEffect(() => {
    const defaultUOM = MaterialDetails?.material_request_item?.unit_of_measure;
    const currentIssueUnit = form.getValues("issue_unit");

    if (defaultUOM && !currentIssueUnit) {
      form.setValue("issue_unit", defaultUOM, { shouldDirty: false, shouldTouch: false, shouldValidate: false });
    }
  }, [MaterialDetails?.material_request_item?.unit_of_measure, form]);

  const handleUOMConversionSubmit = ({ numerator, denominator }: { numerator: string; denominator: string; }) => {
    form.setValue("numerator_issue_uom", numerator);
    form.setValue("denominator_issue_uom", denominator);
    if (baseUOM && issueUOM) {
      setConversionRatio(`${numerator} ${baseUOM} = ${denominator} ${issueUOM}`);
    }
  };

  useEffect(() => {
    if (!baseUOM || !issueUOM) return;

    const { numerator_issue_uom, denominator_issue_uom } = form.getValues();

    if (numerator_issue_uom && denominator_issue_uom) return;

    if (issueUOM !== baseUOM) {
      setShowConversionModal(true);
    }
  }, [issueUOM]);

  useEffect(() => {
    const { numerator_issue_uom, denominator_issue_uom } = form.getValues();

    if (baseUOM && issueUOM && numerator_issue_uom && denominator_issue_uom) {
      setConversionRatio(
        `${numerator_issue_uom} ${baseUOM} = ${denominator_issue_uom} ${issueUOM}`
      );
    }
  }, [MaterialDetails]);

  const IssueUOMOptions = issueUOMSearch ? UnitOfMeasure?.filter((group) =>
    group.description?.toLowerCase().includes(issueUOMSearch.toLowerCase()) ||
    group.name?.toLowerCase().includes(issueUOMSearch.toLowerCase())) : UnitOfMeasure;

  const filteredMRPControllerOptions = MRPControllerSearch ? MRPController?.filter((group) =>
    group.description?.toLowerCase().includes(MRPControllerSearch.toLowerCase()) ||
    group.name?.toLowerCase().includes(MRPControllerSearch.toLowerCase())) : MRPController;

  const filteredLotSizeOptions = lotsizeSearch ? LotSize?.filter((group) =>
    group.description?.toLowerCase().includes(lotsizeSearch.toLowerCase()) ||
    group.name?.toLowerCase().includes(lotsizeSearch.toLowerCase())) : LotSize;

  useEffect(() => {
    const data = MaterialDetails?.material_master;
    if (!data) return;

    const fields = ["mrp_type", "mrp_group", "mrp_controller_revised", "lot_size_key", "procurement_type", "scheduling_margin_key", "numerator_issue_uom", "denominator_issue_uom"] as const;

    fields.forEach((field) => {
      if (data[field] !== undefined && data[field] !== null) {
        form.setValue(field, data[field], {
          shouldDirty: false,
          shouldValidate: false,
        });
      }
    });

    if (data.base_uom) {
      form.setValue("issue_unit", data.base_uom, { shouldDirty: false, shouldValidate: false });
    }
  }, [MaterialDetails?.material_master]);


  return (
    <div className="bg-transparent">
      <div className="flex flex-col justify-between bg-gray-100 rounded-xl shadow-sm border border-slate-200 p-3 transition-all duration-300">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-800 border-b border-slate-200 pb-2 mb-2">
            <Package className="w-4 h-4 text-[#0C72F5]" />
            <span>MRP Data</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* MRP Type */}
            <div className="space-y-1.5">
              <FormField
                control={form.control}
                name="mrp_type"
                key="mrp_type"
                render={({ field }: { field: ControllerRenderProps<FieldValues, "mrp_type"> }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">MRP Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? undefined}
                      >
                        <SelectTrigger className="w-full h-9 px-3 py-1 text-sm rounded-md bg-white border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-slate-700">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto">
                          {MRPType?.map((mrp) => (
                            <SelectItem key={mrp.name} value={mrp.name} className="text-xs">
                              {mrp.name} - {mrp.mrp_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            {MRPTypeValue !== "ND" && !isZCAPMaterial && (
              <>
                {/* MRP Group */}
                <div className="space-y-1.5">
                  <FormField
                    control={form.control}
                    name="mrp_group"
                    key="mrp_group"
                    render={({ field }: { field: ControllerRenderProps<FieldValues, "mrp_group"> }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">MRP Group</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value ?? undefined}
                          >
                            <SelectTrigger className="w-full h-9 px-3 py-1 text-sm rounded-md bg-white border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-slate-700">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto">
                              {MRPGroup?.map((mrp) => (
                                <SelectItem key={mrp.name} value={mrp.name} className="text-xs">
                                  {mrp.description}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* MRP Controller Revised */}
                <div className="space-y-1.5">
                  <FormField
                    control={form.control}
                    name="mrp_controller_revised"
                    key="mrp_controller_revised"
                    render={({ field }: { field: ControllerRenderProps<FieldValues, "mrp_controller_revised"> }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block leading-tight">MRP Controller (Revised)</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(val) => {
                              field.onChange(val);
                              setMRPControllerSearch("");
                            }}
                            value={field.value ?? undefined}
                          >
                            <SelectTrigger className="w-full h-9 px-3 py-1 text-sm rounded-md bg-white border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-slate-700">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto">
                              <div className="px-2 py-1">
                                <input
                                  type="text"
                                  value={MRPControllerSearch}
                                  onChange={(e) =>
                                    setMRPControllerSearch(e.target.value)
                                  }
                                  onKeyDown={(e) => {
                                    if (
                                      !["ArrowDown", "ArrowUp", "Enter"].includes(e.key)
                                    ) {
                                      e.stopPropagation();
                                    }
                                  }}
                                  placeholder="Search..."
                                  className="w-full h-8 p-2 border border-slate-200 rounded text-sm"
                                />
                              </div>
                              {filteredMRPControllerOptions?.length ? (
                                filteredMRPControllerOptions.map((mrpcontroller) => (
                                  <SelectItem
                                    key={mrpcontroller.name}
                                    value={mrpcontroller.name}
                                    className="text-xs"
                                  >
                                    {mrpcontroller.mrp_controller} - {mrpcontroller.description}
                                  </SelectItem>
                                ))
                              ) : (
                                <div className="px-3 py-2 text-xs text-slate-500">
                                  No records found
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Lot Size Key */}
                <div className="space-y-1.5">
                  <FormField
                    control={form.control}
                    name="lot_size_key"
                    key="lot_size_key"
                    render={({ field }: { field: ControllerRenderProps<FieldValues, "lot_size_key"> }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Lot Size Key</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(val) => {
                              field.onChange(val);
                              setlotsizeSearch("");
                            }}
                            value={field.value || ""}
                          >
                            <SelectTrigger className="w-full h-9 px-3 py-1 text-sm rounded-md bg-white border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-slate-700">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto">
                              <div className="px-2 py-1">
                                <input
                                  type="text"
                                  value={lotsizeSearch}
                                  onChange={(e) => setlotsizeSearch(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (
                                      !["ArrowDown", "ArrowUp", "Enter"].includes(e.key)
                                    ) {
                                      e.stopPropagation();
                                    }
                                  }}
                                  placeholder="Search..."
                                  className="w-full h-8 p-2 border border-slate-200 rounded text-sm"
                                />
                              </div>
                              {filteredLotSizeOptions?.length ? (
                                filteredLotSizeOptions.map((lot) => (
                                  <SelectItem key={lot.name} value={lot.name} className="text-xs">
                                    {lot.name} - {lot.description}
                                  </SelectItem>
                                ))
                              ) : (
                                <div className="px-3 py-2 text-xs text-slate-500">
                                  No records found
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Procurement Type */}
                <div className="space-y-1.5">
                  <FormField
                    control={form.control}
                    name="procurement_type"
                    key="procurement_type"
                    render={({ field }: { field: ControllerRenderProps<FieldValues, "procurement_type"> }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">
                          Procurement Type <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value ?? undefined}
                          >
                            <SelectTrigger className="w-full h-9 px-3 py-1 text-sm rounded-md bg-white border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-slate-700">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto">
                              {ProcurementType?.map((procurement) => (
                                <SelectItem key={procurement.name} value={procurement.procurement_type_code} className="text-xs">
                                  {procurement.procurement_type_code} -{" "}
                                  {procurement.procurement_type_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            {shouldShowSMK && (
              <div className="space-y-1.5">
                <FormField
                  control={form.control}
                  name="scheduling_margin_key"
                  key="scheduling_margin_key"
                  render={({ field }: { field: ControllerRenderProps<FieldValues, "scheduling_margin_key"> }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block leading-tight">Scheduling Margin Key</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? undefined}
                        >
                          <SelectTrigger className="w-full h-9 px-3 py-1 text-sm rounded-md bg-white border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-slate-700">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 overflow-y-auto">
                            {SMK?.map((smk) => (
                              <SelectItem key={smk.name} value={smk.name} className="text-xs">
                                {smk.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {!isZCAPMaterial && (
              <div className="space-y-1.5">
                <FormField
                  control={form.control}
                  name="issue_unit"
                  key="issue_unit"
                  render={({ field }: { field: ControllerRenderProps<FieldValues, "issue_unit"> }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Issue Unit</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(val) => {
                            field.onChange(val);
                            setIssueUOMSearch("");
                          }}
                          value={field.value ?? undefined}
                        >
                          <SelectTrigger className="w-full h-9 px-3 py-1 text-sm rounded-md bg-white border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-slate-700">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 overflow-y-auto">
                            <div className="px-2 py-1">
                              <input
                                type="text"
                                value={issueUOMSearch}
                                onChange={(e) => setIssueUOMSearch(e.target.value)}
                                onKeyDown={(e) => {
                                  if (
                                    !["ArrowDown", "ArrowUp", "Enter"].includes(e.key)
                                  ) {
                                    e.stopPropagation();
                                  }
                                }}
                                placeholder="Search..."
                                className="w-full h-8 p-2 border border-slate-200 rounded text-sm"
                              />
                            </div>
                            {IssueUOMOptions?.length ? (
                              IssueUOMOptions.map((uom) => (
                                <SelectItem key={uom.name} value={uom.name} className="text-xs">
                                  {uom.name} - {uom.description}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="px-3 py-2 text-xs text-slate-500">
                                No records found
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Conversion Ratio */}
            {conversionRatio && (
              <div className="col-span-1 md:col-span-4 text-[11px] text-blue-600 font-bold bg-blue-50/50 p-2 rounded-md border border-blue-100 italic">
                Conversion Ratio: {conversionRatio}
              </div>
            )}

            {/* Conversion UOM Modal */}
            <UOMConversionModal
              open={showConversionModal}
              onClose={() => setShowConversionModal(false)}
              baseUOM={baseUOM}
              issueUOM={issueUOM}
              onSubmit={handleUOMConversionSubmit}
            />

            {/* Hidden fields */}
            <input type="hidden" {...form.register("numerator_issue_uom")} />
            <input type="hidden" {...form.register("denominator_issue_uom")} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialMRPForm;
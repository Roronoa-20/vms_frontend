"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UOMConversionModal from "@/src/components/molecules/material-onboarding-modal/UOMConversionModal";
import { ControllerRenderProps, FieldValues, UseFormReturn } from "react-hook-form";
import { MaterialRegistrationFormData, Company, UOMMaster, MRPType, ValuationClass, procurementType, MRPController, LotSize, SchedulingMarginKey, MaterialRequestData, MaterialType, MRPGroup } from "@/src/types/MaterialCodeRequestFormTypes";


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

  console.log("MRP Type----->", MRPGroup)

  const [showConversionModal, setShowConversionModal] = useState<boolean>(false);
  const [conversionRatio, setConversionRatio] = useState<string>("");
  const issueUOM = form.watch("base_uom");
  const baseUOM = MaterialDetails?.material_request_item?.unit_of_measure;
  const showConversionUOM = baseUOM && issueUOM && baseUOM !== issueUOM;
  const [issueUOMSearch, setIssueUOMSearch] = useState<string>("");
  const [MRPControllerSearch, setMRPControllerSearch] = useState<string>("");
  const [lotsizeSearch, setlotsizeSearch] = useState<string>("");

  console.log("MRP Issue UOM--->", issueUOM);
  console.log("MRP Base UOM--->", baseUOM);

  const MRPTypeValue = form.watch("mrp_type");

  console.log("MRP Value--->", MRPTypeValue);

  const materialCategory = MaterialDetails?.material_request_item?.material_category;
  const watchedMaterialCategory = form.watch("material_category") || materialCategory;
  const shouldShowSMK = !isZCAPMaterial && (watchedMaterialCategory === "R" || watchedMaterialCategory === "P");

  useEffect(() => {
    if (MRPTypeValue === "ND") {
      form.setValue("procurement_type", "F");
    } else {
      form.setValue("procurement_type", "");
    }
  }, [MRPTypeValue, form]);

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

    const fields = [
      "mrp_type",
      "mrp_group",
      "mrp_controller_revised",
      "lot_size_key",
      "procurement_type",
      "scheduling_margin_key",
      "base_uom",
      "numerator_issue_uom",
      "denominator_issue_uom",
    ] as const;

    fields.forEach((field) => {
      if (data[field] !== undefined && data[field] !== null) {
        form.setValue(field, data[field], {
          shouldDirty: false,
          shouldValidate: false,
        });
      }
    });
  }, [MaterialDetails?.material_master]);


  return (
    <div className="bg-[#F4F4F6] overflow-hidden">
      <div className="flex flex-col justify-between pb-2 bg-white rounded-[8px] p-1">
        <div className="space-y-1">
          <div className="text-[20px] font-semibold leading-[24px] text-[#03111F] border-b border-slate-500 pb-1">
            MRP Data
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* MRP Type */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="mrp_type"
                key="mrp_type"
                render={({ field }: { field: ControllerRenderProps<FieldValues, "mrp_type"> }) => (
                  <FormItem>
                    <FormLabel>MRP Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? undefined}
                      >
                        <SelectTrigger className="p-3 w-full text-sm data-[placeholder]:text-gray-500">
                          <SelectValue placeholder="Select Type of MRP" />
                        </SelectTrigger>
                        <SelectContent>
                          {MRPType?.map((mrp) => (
                            <SelectItem key={mrp.name} value={mrp.name}>
                              {mrp.name} - {mrp.mrp_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {MRPTypeValue !== "ND" && !isZCAPMaterial && (
              <>
                {/* MRP Group */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="mrp_group"
                    key="mrp_group"
                    render={({ field }: { field: ControllerRenderProps<FieldValues, "mrp_group"> }) => (
                      <FormItem>
                        <FormLabel>MRP Type</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value ?? undefined}
                          >
                            <SelectTrigger className="p-3 w-full text-sm data-[placeholder]:text-gray-500">
                              <SelectValue placeholder="Select MRP GRoup" />
                            </SelectTrigger>
                            <SelectContent>
                              {MRPGroup?.map((mrp) => (
                                <SelectItem key={mrp.name} value={mrp.name}>
                                  {mrp.description}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* MRP Controller Revised */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="mrp_controller_revised"
                    key="mrp_controller_revised"
                    render={({ field }: { field: ControllerRenderProps<FieldValues, "mrp_controller_revised"> }) => (
                      <FormItem>
                        <FormLabel>MRP Controller (Revised)</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(val) => {
                              field.onChange(val);
                              setMRPControllerSearch("");
                            }}
                            value={field.value ?? undefined}
                          >
                            <SelectTrigger className="p-3 w-full text-sm data-[placeholder]:text-gray-500">
                              <SelectValue placeholder="Select MRP Controller" />
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
                                  placeholder="Search MRP Controller..."
                                  className="w-full p-2 border border-gray-300 rounded text-sm"
                                />
                              </div>
                              {filteredMRPControllerOptions?.length ? (
                                filteredMRPControllerOptions.map((mrpcontroller) => (
                                  <SelectItem
                                    key={mrpcontroller.name}
                                    value={mrpcontroller.name}
                                  >
                                    {mrpcontroller.mrp_controller} -
                                    {mrpcontroller.description}
                                  </SelectItem>
                                ))
                              ) : (
                                <div className="px-3 py-2 text-sm text-gray-500">
                                  No matching MRP Controller found
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Lot Size Key */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="lot_size_key"
                    key="lot_size_key"
                    render={({ field }: { field: ControllerRenderProps<FieldValues, "lot_size_key"> }) => (
                      <FormItem>
                        <FormLabel>Lot Size Key</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(val) => {
                              field.onChange(val);
                              setlotsizeSearch("");
                            }}
                            value={field.value || ""}
                          >
                            <SelectTrigger className="p-3 w-full text-sm data-[placeholder]:text-gray-500">
                              <SelectValue placeholder="Select Min Lot Size" />
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
                                  placeholder="Search Min. Lot Size..."
                                  className="w-full p-2 border border-gray-300 rounded text-sm"
                                />
                              </div>
                              {filteredLotSizeOptions?.length ? (
                                filteredLotSizeOptions.map((lot) => (
                                  <SelectItem key={lot.name} value={lot.name}>
                                    {lot.name} - {lot.description}
                                  </SelectItem>
                                ))
                              ) : (
                                <div className="px-3 py-2 text-sm text-gray-500">
                                  No matching Lot Size found
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>


                {/* Procurement Type */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="procurement_type"
                    key="procurement_type"
                    render={({ field }: { field: ControllerRenderProps<FieldValues, "procurement_type"> }) => (
                      <FormItem>
                        <FormLabel>
                          Procurement Type <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value ?? undefined}
                          >
                            <SelectTrigger className="p-3 w-full text-sm data-[placeholder]:text-gray-500">
                              <SelectValue placeholder="Select Procurement Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {ProcurementType?.map((procurement) => (
                                <SelectItem key={procurement.name} value={procurement.name}>
                                  {procurement.procurement_type_code} -{" "}
                                  {procurement.procurement_type_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            {shouldShowSMK && (
              <>
                {/* Scheduling Margin Key */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="scheduling_margin_key"
                    key="scheduling_margin_key"
                    render={({ field }: { field: ControllerRenderProps<FieldValues, "scheduling_margin_key"> }) => (
                      <FormItem>
                        <FormLabel>Scheduling Margin Key</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value ?? undefined}
                          >
                            <SelectTrigger className="p-3 w-full text-sm data-[placeholder]:text-gray-500">
                              <SelectValue placeholder="Select scheduling margin key" />
                            </SelectTrigger>
                            <SelectContent>
                              {SMK?.map((smk) => (
                                <SelectItem key={smk.name} value={smk.name}>
                                  {smk.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            {!isZCAPMaterial && (
              <>
                {/* Issue Unit */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="base_uom"
                    key="base_uom"
                    render={({ field }: { field: ControllerRenderProps<FieldValues, "base_uom"> }) => (
                      <FormItem>
                        <FormLabel>Issue Unit</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(val) => {
                              field.onChange(val);
                              setIssueUOMSearch("");
                            }}
                            value={field.value ?? undefined}
                          >
                            <SelectTrigger className="p-3 w-full text-sm data-[placeholder]:text-gray-500">
                              <SelectValue placeholder="Select Issue Unit" />
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
                                  placeholder="Search Issue UOM..."
                                  className="w-full p-2 border border-gray-300 rounded text-sm"
                                />
                              </div>
                              {IssueUOMOptions?.length ? (
                                IssueUOMOptions.map((uom) => (
                                  <SelectItem key={uom.name} value={uom.name}>
                                    {uom.name} - {uom.description}
                                  </SelectItem>
                                ))
                              ) : (
                                <div className="px-3 py-2 text-sm text-gray-500">
                                  No matching UOM found
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
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

            {/* Conversion Ratio */}
            {conversionRatio && (
              <div className="col-span-3 text-sm text-blue-600 mt-2 font-bold">
                Conversion Ratio: {conversionRatio}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialMRPForm;
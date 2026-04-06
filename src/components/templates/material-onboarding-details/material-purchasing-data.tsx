'use client';

import React, { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/newselect";
import UOMConversionModal from "@/src/components/molecules/material-onboarding-modal/UOMConversionModal";
import { ControllerRenderProps, FieldValues, UseFormReturn } from "react-hook-form";
import { MaterialRegistrationFormData, EmployeeDetail, Company, Plant, division, industry, ClassType, UOMMaster, MRPType, ValuationClass, procurementType, ValuationCategory, MaterialGroupMaster, MaterialCategory, ProfitCenter, AvailabilityCheck, PriceControl, MRPController, StorageLocation, InspectionType, SerialNumber, LotSize, SchedulingMarginKey, ExpirationDate, MaterialRequestData, MaterialType, MaterialMaster } from "@/src/types/MaterialCodeRequestFormTypes";
import { TcompanyNameBasedDropdown } from "@/src/types/types";
import { ShoppingCart } from "lucide-react";

interface UOMConversionData {
  numerator: string;
  denominator: string;
}

interface MaterialPurchasingDataFormProps {
  form: UseFormReturn<any>;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  role?: string;
  ProcurementType?: procurementType[];
  designationname?: string;
  MaterialOnboardingDetails?: MaterialRegistrationFormData;
  LotSize?: LotSize[];
  PurchaseGroup?: TcompanyNameBasedDropdown["message"]["data"]["purchase_groups"];
  companyInfo?: Company[];
  UnitOfMeasure?: UOMMaster[];
  MaterialDetails?: MaterialRequestData;
  AllMaterialType?: MaterialType[];
  isZCAPMaterial?: boolean;
}

const MaterialPurchasingDataForm: React.FC<MaterialPurchasingDataFormProps> = ({ form, MaterialOnboardingDetails, LotSize = [], PurchaseGroup, companyInfo, UnitOfMeasure = [], MaterialDetails, isZCAPMaterial = false }) => {

  const [filteredPurchaseGroup, setFilteredPurchaseGroup] = useState<TcompanyNameBasedDropdown["message"]["data"]["purchase_groups"]>([]);
  const [showConversionModal, setShowConversionModal] = useState(false);
  const initialLoadRef = useRef(false);

  const purchaseUOM = form.watch("purchase_uom");
  const baseUOM = MaterialDetails?.material_request_item?.unit_of_measure;
  const showConversionUOM = baseUOM && purchaseUOM && baseUOM !== purchaseUOM;
  const [conversionRatio, setConversionRatio] = useState("");
  const [purchaseGroupSearch, setPurchaseGroupSearch] = useState("");
  const [purchaseUOMSearch, setPurchaseUOMSearch] = useState("");
  const [lotsizeSearch, setLotsizeSearch] = useState("");

  useEffect(() => {
    form.register("numerator_purchase_uom");
    form.register("denominator_purchase_uom");
  }, []);

  useEffect(() => {
    const defaultUOM = MaterialDetails?.material_request_item?.unit_of_measure;
    const currentPurchaseUOM = form.getValues("purchase_uom");
    if (defaultUOM && !currentPurchaseUOM) {
      form.setValue("purchase_uom", defaultUOM, { shouldDirty: false, shouldTouch: false, shouldValidate: false });
    }
  }, [MaterialDetails?.material_request_item?.unit_of_measure, form]);


  const handleUOMConversionSubmit = ({ numerator, denominator }: UOMConversionData) => {
    form.setValue("numerator_purchase_uom", numerator);
    form.setValue("denominator_purchase_uom", denominator);
    setConversionRatio(`${numerator} ${baseUOM} = ${denominator} ${purchaseUOM}`);
  };

  useEffect(() => {
    if (purchaseUOM && baseUOM && purchaseUOM !== baseUOM) {
      const num = form.getValues("numerator_purchase_uom");
      const den = form.getValues("denominator_purchase_uom");
      if (!num || !den) {
        setShowConversionModal(true);
      }
    } else if (purchaseUOM === baseUOM) {
      form.setValue("numerator_purchase_uom", "");
      form.setValue("denominator_purchase_uom", "");
      setConversionRatio("");
    }
  }, [purchaseUOM, baseUOM, form]);

  useEffect(() => {
    const employeeCompanyCode =
      MaterialOnboardingDetails?.material_company_code || "";
    const filtered =
      PurchaseGroup?.filter(
        (group) => String(group.company) === employeeCompanyCode
      ) || [];
    console.log("Purchase Group---->", filtered)
    setFilteredPurchaseGroup(filtered);
  }, [companyInfo, PurchaseGroup, MaterialOnboardingDetails]);

  const filteredPurchaseGroupOptions = purchaseGroupSearch ? filteredPurchaseGroup?.filter((group) => group.description?.toLowerCase().includes(purchaseGroupSearch.toLowerCase()) || group.name?.toLowerCase().includes(purchaseGroupSearch.toLowerCase())) : filteredPurchaseGroup;

  const PurchaseUOMOptions = purchaseUOMSearch ? UnitOfMeasure?.filter((group) => group.description?.toLowerCase().includes(purchaseUOMSearch.toLowerCase()) || group.name?.toLowerCase().includes(purchaseUOMSearch.toLowerCase())) : UnitOfMeasure;

  const filteredLotSizeOptions = lotsizeSearch ? LotSize?.filter((group) => group.description?.toLowerCase().includes(lotsizeSearch.toLowerCase()) || group.name?.toLowerCase().includes(lotsizeSearch.toLowerCase())) : LotSize;

  useEffect(() => {
    form.setValue("purchasing_value_key", "3", { shouldDirty: false, shouldTouch: false });
  }, [form]);

  useEffect(() => {
    if (initialLoadRef.current) return;
    if (!MaterialDetails?.material_master || !filteredPurchaseGroup.length) return;

    initialLoadRef.current = true;

    const fieldMap: Record<string, keyof MaterialMaster> = {
      purchasing_group: "purchasing_group",
      gr_processing_time: "gr_processing_time",
      purchase_uom: "purchase_uom",
      lead_time: "lead_time",
      purchasing_value_key: "purchasing_value_key",
      min_lot_size: "min_lot_size",
      purchase_order_text: "purchase_order_text",
      numerator_purchase_uom: "numerator_for_conversion",
      denominator_purchase_uom: "denominator_for_conversion",
    };

    Object.entries(fieldMap).forEach(([formField, apiField]) => {
      const value = MaterialDetails.material_master[apiField];
      if (value != null) {
        form.setValue(formField, value, { shouldDirty: false, shouldTouch: false });
      }
    });

  }, [MaterialDetails, filteredPurchaseGroup, form]);

  useEffect(() => {
    const numerator = form.getValues("numerator_purchase_uom");
    const denominator = form.getValues("denominator_purchase_uom");

    if (numerator && denominator && baseUOM && purchaseUOM) {
      setConversionRatio(`${numerator} ${baseUOM} = ${denominator} ${purchaseUOM}`);
    }
  }, [form.watch("numerator_purchase_uom"), form.watch("denominator_purchase_uom"), baseUOM, purchaseUOM]);

  return (
    <div className="bg-transparent">
      <div className="flex flex-col justify-between bg-gray-100 rounded-xl shadow-sm border border-slate-200 p-3 transition-all duration-300">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-800 border-b border-slate-200 pb-2 mb-2">
            <ShoppingCart className="w-4 h-4 text-[#0C72F5]" />
            <span>Purchasing Data</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Purchasing Group */}
            <div className="space-y-1.5">
              <FormField
                control={form.control}
                name="purchasing_group"
                key="purchasing_group"
                render={({ field }: { field: ControllerRenderProps<FieldValues, "purchasing_group"> }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">
                      Purchasing Group <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                          setPurchaseGroupSearch("");
                        }}
                        value={
                          filteredPurchaseGroupOptions.some((opt) => opt.name === field.value)
                            ? field.value
                            : ""
                        }
                      >
                        <SelectTrigger className="w-full h-9 px-3 py-1 text-sm rounded-md bg-white border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-slate-700">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-scroll">
                          {/* Search */}
                          <div className="sticky top-0 z-10 bg-white px-2 py-1">
                            <input
                              type="text"
                              value={purchaseGroupSearch}
                              onChange={(e) => setPurchaseGroupSearch(e.target.value)}
                              onKeyDown={(e) => {
                                if (!["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) {
                                  e.stopPropagation();
                                }
                              }}
                              placeholder="Search..."
                              className="w-full h-8 p-2 border border-slate-200 rounded text-sm"
                            />
                          </div>

                          <SelectGroup>
                            {filteredPurchaseGroupOptions?.length > 0 ? (
                              filteredPurchaseGroupOptions.map((pgroup) => (
                                <SelectItem key={pgroup.name} value={pgroup.name} className="text-xs">
                                  {pgroup.description}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="px-3 py-2 text-xs text-slate-500">
                                No records found
                              </div>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            {/* GR Processing Time (conditional) */}
            {!isZCAPMaterial && (
              <div className="space-y-1.5">
                <FormField
                  control={form.control}
                  name="gr_processing_time"
                  key="gr_processing_time"
                  render={({ field }: { field: ControllerRenderProps<FieldValues, "gr_processing_time"> }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">GR Processing Time</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="w-full h-9 px-3 py-1 text-sm rounded-md bg-white border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-slate-700"
                          placeholder="Enter Time"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Purchase UOM */}
            <div className="space-y-1.5">
              <FormField
                control={form.control}
                name="purchase_uom"
                key="purchase_uom"
                render={({ field }: { field: ControllerRenderProps<FieldValues, "purchase_uom"> }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Purchase UOM</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                          setPurchaseUOMSearch("");
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
                              value={purchaseUOMSearch}
                              onChange={(e) => setPurchaseUOMSearch(e.target.value)}
                              onKeyDown={(e) => {
                                if (!["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) {
                                  e.stopPropagation();
                                }
                              }}
                              placeholder="Search..."
                              className="w-full h-8 p-2 border border-slate-200 rounded text-sm"
                            />
                          </div>
                          {PurchaseUOMOptions?.length > 0 ? (
                            PurchaseUOMOptions.map((uom) => (
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

            {/* Lead Time */}
            <div className="space-y-1.5">
              <FormField
                control={form.control}
                name="lead_time"
                key="lead_time"
                render={({ field }: { field: ControllerRenderProps<FieldValues, "lead_time"> }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Lead Time</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full h-9 px-3 py-1 text-sm rounded-md bg-white border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-slate-700"
                        placeholder="Enter Lead Time"
                        onChange={(e) => {
                          const formattedValue = e.target.value
                            .toLowerCase()
                            .replace(/\b\w/g, (char) => char.toUpperCase());
                          field.onChange(formattedValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            {/* Purchasing Value Key */}
            <div className="space-y-1.5">
              <FormField
                control={form.control}
                name="purchasing_value_key"
                key="purchasing_value_key"
                render={({ field }: { field: ControllerRenderProps<FieldValues, "purchasing_value_key"> }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Purchasing Value Key</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        className="w-full h-9 px-3 py-1 text-sm rounded-md !bg-white !disabled:bg-white !opacity-100 !disabled:opacity-100 border border-slate-200 text-slate-500 font-medium cursor-not-allowed"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            {/* Min Lot Size (conditional) */}
            {!isZCAPMaterial && (
              <div className="space-y-1.5">
                <FormField
                  control={form.control}
                  name="min_lot_size"
                  key="min_lot_size"
                  render={({ field }: { field: ControllerRenderProps<FieldValues, "min_lot_size"> }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Min Lot Size</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(val) => {
                            field.onChange(val);
                            setLotsizeSearch("");
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
                                onChange={(e) => setLotsizeSearch(e.target.value)}
                                onKeyDown={(e) => {
                                  if (!["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) {
                                    e.stopPropagation();
                                  }
                                }}
                                placeholder="Search..."
                                className="w-full h-8 p-2 border border-slate-200 rounded text-sm"
                              />
                            </div>
                            {filteredLotSizeOptions?.length > 0 ? (
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
            )}

            {/* Purchase Order Text */}
            {!isZCAPMaterial && (
              <div className="col-span-1 md:col-span-2 space-y-1.5">
                <FormField
                  control={form.control}
                  name="purchase_order_text"
                  key="purchase_order_text"
                  render={({ field }: { field: ControllerRenderProps<FieldValues, "purchase_order_text"> }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Purchase Order Text</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          rows={2}
                          className="w-full px-3 py-2 text-sm rounded-md bg-white border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-slate-700 resize-none min-h-[36px]"
                          placeholder="Enter PO Text"
                          onChange={(e) => {
                            const formattedValue = e.target.value
                              .toLowerCase()
                              .replace(/\b\w/g, (char) => char.toUpperCase());
                            field.onChange(formattedValue);
                          }}
                        />
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

            {/* UOM Conversion Modal */}
            <UOMConversionModal
              open={showConversionModal}
              onClose={() => setShowConversionModal(false)}
              baseUOM={baseUOM}
              purchaseUOM={purchaseUOM}
              onSubmit={handleUOMConversionSubmit}
            />

            <input type="hidden" {...form.register("numerator_purchase_uom")} />
            <input type="hidden" {...form.register("denominator_purchase_uom")} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialPurchasingDataForm;
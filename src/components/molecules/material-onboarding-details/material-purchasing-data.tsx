'use client';

import React, { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UOMConversionModal from "@/src/components/molecules/material-onboarding-modal/UOMConversionModal";
import { ControllerRenderProps, FieldValues, UseFormReturn } from "react-hook-form";
import { MaterialRegistrationFormData, EmployeeDetail, Company, Plant, division, industry, ClassType, UOMMaster, MRPType, ValuationClass, procurementType, ValuationCategory, MaterialGroupMaster, MaterialCategory, ProfitCenter, AvailabilityCheck, PriceControl, MRPController, StorageLocation, InspectionType, SerialNumber, LotSize, SchedulingMarginKey, ExpirationDate, MaterialRequestData, MaterialType, MaterialMaster } from "@/src/types/MaterialCodeRequestFormTypes";
import { TcompanyNameBasedDropdown } from "@/src/types/types";

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

  const handleUOMConversionSubmit = ({ numerator, denominator }: UOMConversionData) => {
    form.setValue("numerator_purchase_uom", numerator);
    form.setValue("denominator_purchase_uom", denominator);
    setConversionRatio(`${numerator} ${baseUOM} = ${denominator} ${purchaseUOM}`);
  };

  useEffect(() => {
    const numerator = form.getValues("numerator_purchase_uom");
    const denominator = form.getValues("denominator_purchase_uom");

    if (showConversionUOM && !numerator && !denominator && !showConversionModal) {
      setShowConversionModal(true);
    }
  }, [showConversionUOM, form, showConversionModal]);

  useEffect(() => {
    const employeeCompanyCode =
      MaterialOnboardingDetails?.material_company_code || "";
    const filtered =
      PurchaseGroup?.filter(
        (group) => String(group.company) === employeeCompanyCode
      ) || [];
    setFilteredPurchaseGroup(filtered);
  }, [companyInfo, PurchaseGroup, MaterialOnboardingDetails]);

  const filteredPurchaseGroupOptions = purchaseGroupSearch ? filteredPurchaseGroup?.filter((group) => group.description?.toLowerCase().includes(purchaseGroupSearch.toLowerCase()) || group.name?.toLowerCase().includes(purchaseGroupSearch.toLowerCase())) : filteredPurchaseGroup;

  const PurchaseUOMOptions = purchaseUOMSearch ? UnitOfMeasure?.filter((group) => group.description?.toLowerCase().includes(purchaseUOMSearch.toLowerCase()) || group.name?.toLowerCase().includes(purchaseUOMSearch.toLowerCase())) : UnitOfMeasure;

  const filteredLotSizeOptions = lotsizeSearch ? LotSize?.filter((group) => group.description?.toLowerCase().includes(lotsizeSearch.toLowerCase()) || group.name?.toLowerCase().includes(lotsizeSearch.toLowerCase())) : LotSize;

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
    <div className="bg-[#F4F4F6] overflow-hidden">
      <div className="flex flex-col pt-4 justify-between bg-white rounded-[8px] p-1">
        <div className="space-y-1">
          <div className="text-[20px] font-semibold leading-[24px] text-[#03111F] border-b border-slate-500 pb-1">
            Purchasing Data
          </div>
          <div className="grid grid-cols-3 gap-4">
            {/* Purchasing Group */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="purchasing_group"
                key="purchasing_group"
                render={({ field }: { field: ControllerRenderProps<FieldValues, "purchasing_group"> }) => (
                  <FormItem>
                    <FormLabel>
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
                        <SelectTrigger className="p-3 w-full text-sm data-[placeholder]:text-gray-500">
                          <SelectValue placeholder="Select Purchasing Group" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto">
                          <div className="px-2 py-1">
                            <input
                              type="text"
                              value={purchaseGroupSearch}
                              onChange={(e) => setPurchaseGroupSearch(e.target.value)}
                              onKeyDown={(e) => {
                                if (!["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) {
                                  e.stopPropagation();
                                }
                              }}
                              placeholder="Search Purchasing Group..."
                              className="w-full p-2 border border-gray-300 rounded text-sm"
                            />
                          </div>
                          {filteredPurchaseGroupOptions?.length > 0 ? (
                            filteredPurchaseGroupOptions.map((pgroup) => (
                              <SelectItem key={pgroup.name} value={pgroup.name}>
                                {pgroup.description}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-sm text-gray-500">
                              No matching groups found
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

            {/* GR Processing Time (conditional) */}
            {!isZCAPMaterial && (
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="gr_processing_time"
                  key="gr_processing_time"
                  render={({ field }: { field: ControllerRenderProps<FieldValues, "gr_processing_time"> }) => (
                    <FormItem>
                      <FormLabel>GR Processing Time</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="p-3 w-full text-sm placeholder:text-gray-500"
                          placeholder="Enter GR Processing Time"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Purchase UOM */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="purchase_uom"
                key="purchase_uom"
                render={({ field }: { field: ControllerRenderProps<FieldValues, "purchase_uom"> }) => (
                  <FormItem>
                    <FormLabel>Purchase UOM</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                          setPurchaseUOMSearch("");
                        }}
                        // value={
                        //   PurchaseUOMOptions.some((opt) => opt.name === field.value)
                        //     ? field.value
                        //     : ""
                        // }
                        value={field.value || ""}
                      >
                        <SelectTrigger className="p-3 w-full text-sm data-[placeholder]:text-gray-500">
                          <SelectValue placeholder="Select Purchase UOM" />
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
                              placeholder="Search UOM..."
                              className="w-full p-2 border border-gray-300 rounded text-sm"
                            />
                          </div>
                          {PurchaseUOMOptions?.length > 0 ? (
                            PurchaseUOMOptions.map((uom) => (
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

            {/* Lead Time */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="lead_time"
                key="lead_time"
                render={({ field }: { field: ControllerRenderProps<FieldValues, "lead_time"> }) => (
                  <FormItem>
                    <FormLabel>Lead Time</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="p-3 w-full text-sm placeholder:text-gray-500"
                        placeholder="Enter Lead Time"
                        onChange={(e) => {
                          const formattedValue = e.target.value
                            .toLowerCase()
                            .replace(/\b\w/g, (char) => char.toUpperCase());
                          field.onChange(formattedValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Purchasing Value Key */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="purchasing_value_key"
                key="purchasing_value_key"
                render={({ field }: { field: ControllerRenderProps<FieldValues, "purchasing_value_key"> }) => (
                  <FormItem>
                    <FormLabel>Purchasing Value Key</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || "3"}
                        readOnly
                        className="p-3 w-full text-sm placeholder:text-gray-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Min Lot Size (conditional) */}
            {!isZCAPMaterial && (
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="min_lot_size"
                  key="min_lot_size"
                  render={({ field }: { field: ControllerRenderProps<FieldValues, "min_lot_size"> }) => (
                    <FormItem>
                      <FormLabel>Min Lot Size</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(val) => {
                            field.onChange(val);
                            setLotsizeSearch("");
                          }}
                          value={field.value || ""}
                        // value={
                        //   filteredLotSizeOptions.some((opt) => opt.name === field.value)
                        //     ? field.value
                        //     : ""
                        // }
                        >
                          <SelectTrigger className="p-3 w-full text-sm data-[placeholder]:text-gray-500">
                            <SelectValue placeholder="Select Min Lot Size" />
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
                                placeholder="Search Min. Lot Size..."
                                className="w-full p-2 border border-gray-300 rounded text-sm"
                              />
                            </div>
                            {filteredLotSizeOptions?.length > 0 ? (
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
            )}

            {/* Purchase Order Text */}
            {!isZCAPMaterial && (
              <div className="col-span-3 space-y-2">
                <FormField
                  control={form.control}
                  name="purchase_order_text"
                  key="purchase_order_text"
                  render={({ field }: { field: ControllerRenderProps<FieldValues, "purchase_order_text"> }) => (
                    <FormItem>
                      <FormLabel>Purchase Order Text</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          rows={2}
                          className="w-full p-3 text-sm placeholder:text-gray-500 border border-gray-300 rounded-[8px]"
                          placeholder="Enter PO Text"
                          onChange={(e) => {
                            const formattedValue = e.target.value
                              .toLowerCase()
                              .replace(/\b\w/g, (char) => char.toUpperCase());
                            field.onChange(formattedValue);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Conversion Ratio */}
            {conversionRatio && (
              <div className="col-span-3 text-sm text-blue-600 pb-3 font-bold">
                Conversion Ratio: {conversionRatio}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialPurchasingDataForm;
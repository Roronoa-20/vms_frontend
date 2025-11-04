'use client';

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import UOMConversionModal from "@/src/components/molecules/material-onboarding-modal/UOMConversionModal";
import { UseFormReturn } from "react-hook-form";

// ---------- Types ----------
interface OptionType {
  name: string;
  description?: string;
  company_code?: string | number;
}

interface MaterialDetailsType {
  material_request_item?: {
    base_unit_of_measure?: string;
  };
  material_master?: Record<string, any>;
}

interface MaterialOnboardingDetailsType {
  material_request?: { company_name?: string }[];
}

interface UOMConversionData {
  numerator: string;
  denominator: string;
}

interface MaterialPurchasingDataFormProps {
  form: UseFormReturn<any>;
  onSubmit?: () => void;
  role?: string;
  ProcurementType?: string;
  designationname?: string;
  MaterialOnboardingDetails?: MaterialOnboardingDetailsType;
  LotSize?: OptionType[];
  PurchaseGroup?: OptionType[];
  companyInfo?: Record<string, any>;
  UnitOfMeasure?: OptionType[];
  MaterialDetails?: MaterialDetailsType;
  AllMaterialType?: OptionType[];
  isZCAPMaterial?: boolean;
}

// ---------- Component ----------
const MaterialPurchasingDataForm: React.FC<MaterialPurchasingDataFormProps> = ({
  form,
  onSubmit,
  role,
  ProcurementType,
  designationname,
  MaterialOnboardingDetails,
  LotSize = [],
  PurchaseGroup = [],
  companyInfo,
  UnitOfMeasure = [],
  MaterialDetails,
  AllMaterialType = [],
  isZCAPMaterial = false,
}) => {
  const [filteredPurchaseGroup, setFilteredPurchaseGroup] = useState<OptionType[]>([]);
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const purchaseUOM = form.watch("purchase_uom");
  const baseUOM = MaterialDetails?.material_request_item?.base_unit_of_measure;
  const showConversionUOM = baseUOM && purchaseUOM && baseUOM !== purchaseUOM;
  const [conversionRatio, setConversionRatio] = useState("");
  const [purchaseGroupSearch, setPurchaseGroupSearch] = useState("");
  const [purchaseUOMSearch, setPurchaseUOMSearch] = useState("");
  const [lotsizeSearch, setLotsizeSearch] = useState("");

  const handleUOMConversionSubmit = ({ numerator, denominator }: UOMConversionData) => {
    form.setValue("numerator_purchase_uom", numerator);
    form.setValue("denominator_purchase_uom", denominator);
    setConversionRatio(`${numerator} ${baseUOM} = ${denominator} ${purchaseUOM}`);
  };

  useEffect(() => {
    if (!initialLoadDone) return;

    const numerator = form.getValues("numerator_purchase_uom");
    const denominator = form.getValues("denominator_purchase_uom");

    if (showConversionUOM && !numerator && !denominator && !showConversionModal) {
      setShowConversionModal(true);
    }
  }, [purchaseUOM, baseUOM, initialLoadDone, showConversionUOM, form, showConversionModal]);

  useEffect(() => {
    const employeeCompanyCode =
      MaterialOnboardingDetails?.material_request?.[0]?.company_name || "";

    const filtered =
      PurchaseGroup?.filter(
        (group) => String(group.company_code) === employeeCompanyCode
      ) || [];
    setFilteredPurchaseGroup(filtered);
  }, [companyInfo, PurchaseGroup, MaterialOnboardingDetails]);

  const filteredPurchaseGroupOptions = purchaseGroupSearch
    ? filteredPurchaseGroup?.filter(
        (group) =>
          group.description?.toLowerCase().includes(purchaseGroupSearch.toLowerCase()) ||
          group.name?.toLowerCase().includes(purchaseGroupSearch.toLowerCase())
      )
    : filteredPurchaseGroup;

  const PurchaseUOMOptions = purchaseUOMSearch
    ? UnitOfMeasure?.filter(
        (group) =>
          group.description?.toLowerCase().includes(purchaseUOMSearch.toLowerCase()) ||
          group.name?.toLowerCase().includes(purchaseUOMSearch.toLowerCase())
      )
    : UnitOfMeasure;

  const filteredLotSizeOptions = lotsizeSearch
    ? LotSize?.filter(
        (group) =>
          group.description?.toLowerCase().includes(lotsizeSearch.toLowerCase()) ||
          group.name?.toLowerCase().includes(lotsizeSearch.toLowerCase())
      )
    : LotSize;

  useEffect(() => {
    const data = MaterialDetails?.material_master;
    if (!data || !filteredPurchaseGroup.length) return;

    if (!initialLoadDone) {
      setInitialLoadDone(true);
    }

    const fields = [
      "purchasing_group",
      "gr_processing_time",
      "purchase_uom",
      "lead_time",
      "purchasing_value_key",
      "min_lot_size",
      "purchase_order_text",
      "conversion_purchase_uom",
      "numerator_purchase_uom",
      "denominator_purchase_uom",
    ];

    fields.forEach((field) => {
      if (data[field]) {
        form.setValue(field, data[field]);
      }
    });

    if (
      data.numerator_purchase_uom &&
      data.denominator_purchase_uom &&
      baseUOM &&
      purchaseUOM
    ) {
      setConversionRatio(
        `${data.numerator_purchase_uom} ${baseUOM} = ${data.denominator_purchase_uom} ${purchaseUOM}`
      );
    }
  }, [MaterialDetails, filteredPurchaseGroup, baseUOM, purchaseUOM, initialLoadDone, form]);

  return (
    <div className="bg-[#F4F4F6]">
      <div className="flex flex-col justify-between pt-4 bg-white rounded-[8px]">
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
                render={({ field }) => (
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
                        value={field.value || ""}
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
                  render={({ field }) => (
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase UOM</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                          setPurchaseUOMSearch("");
                        }}
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
                render={({ field }) => (
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchasing Value Key</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="p-3 w-full text-sm placeholder:text-gray-500"
                        placeholder="Enter Purchasing Value Key"
                        value="3"
                        readOnly
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
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Lot Size</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(val) => {
                            field.onChange(val);
                            setLotsizeSearch("");
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
                  render={({ field }) => (
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
              <div className="col-span-3 text-sm text-blue-600 mt-2 font-medium">
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
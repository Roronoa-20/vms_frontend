"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/newselect";
import { Button } from "@/components/ui/button";
import { Paperclip, Layers } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ControllerRenderProps, FieldValues, UseFormReturn } from "react-hook-form";
import { MaterialRegistrationFormData, Company, Plant, ValuationClass, ProfitCenter, PriceControl, MaterialRequestData, MaterialType } from "@/src/types/MaterialCodeRequestFormTypes";

interface MaterialProcurementFormProps {
  form: UseFormReturn<any>;
  role: string;
  designationname?: string;
  MaterialOnboardingDetails?: MaterialRegistrationFormData;
  MaterialDetails?: MaterialRequestData;
  companyInfo?: Company[];
  PriceControl?: PriceControl[];
  ValuationClass?: ValuationClass[];
  filteredProfit?: ProfitCenter[];
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
  handleLabelClick: (id: string) => void;
  handleRemoveFile: (id: string, setFileName: React.Dispatch<React.SetStateAction<string>>) => void;
  lineItemFiles?: any;
  fileSelected: boolean;
  setFileSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setFileName: React.Dispatch<React.SetStateAction<string>>;
  fileName: string;
  MaterialType?: MaterialType[];
  isZCAPMaterial?: boolean;
  plantcode?: Plant[];
  isFileUploading?: boolean;
  localLineItemFiles?: any;
}


const MaterialOthersData: React.FC<MaterialProcurementFormProps> = ({ form, role, plantcode, MaterialDetails, PriceControl = [], handleImageChange, handleLabelClick, handleRemoveFile, fileSelected, setFileSelected, setFileName, fileName, MaterialType = [], isZCAPMaterial = false, isFileUploading = false, localLineItemFiles }) => {

  const [filteredProfitCenter, setFilteredProfitCenter] = useState<ProfitCenter[]>([]);
  const [filteredValuationClass, setFilteredValuationClass] = useState<ValuationClass[]>([]);
  const [profitcenterSearch, setProfitCenterSearch] = useState<string>("");

  useEffect(() => {
    const currentPriceControl = form.getValues("price_control");

    if (currentPriceControl === "S") {
      form.setValue("do_not_cost", null);
      return;
    }

    const matched = PriceControl.find((item) => item.name === (currentPriceControl || "V"));

    if (!currentPriceControl && matched) {
      form.setValue("price_control", matched.name);
    }

    form.setValue("do_not_cost", matched?.do_not_cost ? matched.do_not_cost : null);
  }, [form.watch("price_control"), PriceControl, form]);

  useEffect(() => {
    const materialType = MaterialDetails?.material_request_item?.material_type;
    const company = MaterialDetails?.material_request_item?.company_name;

    if (!materialType || !company || !MaterialType?.length) return;

    const matchedType = MaterialType.find((type) => type.name === materialType);

    if (matchedType && matchedType.valuation_and_profit?.length) {
      const valuationProfit = matchedType.valuation_and_profit.filter(
        (item) => item.company === company
      );
      const uniqueValuationClasses: ValuationClass[] = [];

      valuationProfit.forEach((item) => {
        if (item.valuation_class && !uniqueValuationClasses.find(
          (vc) => vc.name === item.valuation_class
        )
        ) {
          uniqueValuationClasses.push({
            name: item.valuation_class,
            valuation_class_code: item.valuation_class,
            valuation_class_name: item.valuation_class_description || "",
            description: item.valuation_class_description || "",
          });
        }
      });

      setFilteredValuationClass(uniqueValuationClasses);
    }
  }, [MaterialDetails, MaterialType, form]);

  useEffect(() => {
    const plantFromMaterial =
      MaterialDetails?.material_request_item?.plant;

    if (!plantFromMaterial || !plantcode?.length) {
      setFilteredProfitCenter([]);
      return;
    }

    const matchedPlant = plantcode.find((p) =>
      p.name === plantFromMaterial ||
      p.plant_code === plantFromMaterial
    );

    if (!matchedPlant || !matchedPlant.profit_center_list?.length) {
      setFilteredProfitCenter([]);
      return;
    }

    const profitCenters: ProfitCenter[] = matchedPlant.profit_center_list.filter((pc) => pc.profit_center !== undefined).map((pc) => ({
      name: pc.profit_center as string,
      description: pc.profit_center_name || "",
    }));

    setFilteredProfitCenter(profitCenters);

  }, [MaterialDetails, plantcode]);

  const filteredProfitCenterOptions = profitcenterSearch ? filteredProfitCenter.filter((profit) => profit.name?.toLowerCase().includes(profitcenterSearch.toLowerCase())) : filteredProfitCenter;

  useEffect(() => {
    const data = MaterialDetails?.material_onboarding;
    if (!data) return;

    const fields = ["price_control", "hsn_code", "do_not_cost", "material_information", "profit_center", "valuation_class"];

    fields.forEach((field) => {
      const currentValue = form.getValues(field);
      if ((data as any)[field] && (currentValue === "" || currentValue === undefined || currentValue === null)) {
        form.setValue(field, (data as any)[field]);
        if (field === "material_information") {
          const fileUrl = (data as any)[field];
          const fileNameFromUrl = fileUrl?.split("/").pop();
          setFileName(fileNameFromUrl);
          setFileSelected(true);
        }
      }
    });

    if (filteredProfitCenter.length && filteredValuationClass.length && data.profit_center && data.valuation_class) {
      form.setValue("profit_center", data.profit_center);
      form.setValue("valuation_class", data.valuation_class);
    }
  }, [MaterialDetails, filteredProfitCenter, filteredValuationClass, form]);


  return (
    <div className="bg-gray-50">
      <div className="flex flex-col justify-between rounded-xl shadow-sm border border-slate-200 p-3 transition-all duration-300">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-800 border-b border-slate-200 pb-2 mb-2">
            <Layers className="w-4 h-4 text-[#0C72F5]" />
            <span>Others Data</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Profit Center */}
            <div className="space-y-1.5">
              <FormField
                control={form.control}
                name="profit_center"
                key="profit_center"
                render={({ field }: { field: ControllerRenderProps<FieldValues, "profit_center"> }) => (
                  <FormItem>
                    <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">
                      Profit Center <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                          setProfitCenterSearch("");
                        }}
                        value={field.value || ""}
                      >
                        <SelectTrigger className="w-full h-9 px-3 py-1 text-sm rounded-md bg-white border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-black">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto">
                          <div className="px-2 py-1">
                            <input
                              type="text"
                              value={profitcenterSearch}
                              onChange={(e) => setProfitCenterSearch(e.target.value)}
                              onKeyDown={(e) => {
                                if (!["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) {
                                  e.stopPropagation();
                                }
                              }}
                              placeholder="Search..."
                              className="w-full h-8 p-2 border border-slate-200 rounded text-sm"
                            />
                          </div>
                          {filteredProfitCenterOptions?.length > 0 ? (
                            filteredProfitCenterOptions.map((profit) => (
                              <SelectItem key={profit.name} value={profit.name} className="text-sm">
                                {profit.name} - {profit.description}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-sm text-black">
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

            {!isZCAPMaterial && (
              <>
            {/* Valuation Class */}
            <div className="space-y-1.5">
              <FormField
                control={form.control}
                name="valuation_class"
                key="valuation_class"
                render={({ field }: { field: ControllerRenderProps<FieldValues, "valuation_class"> }) => (
                  <FormItem>
                    <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">
                      Valuation Class <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                      >
                        <SelectTrigger className="w-full h-9 px-3 py-1 text-sm rounded-md bg-white border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-black">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto">
                          {filteredValuationClass.map((vclass) => (
                            <SelectItem key={vclass.name} value={vclass.name} className="text-sm">
                              {vclass.valuation_class_code} - {vclass.valuation_class_name}
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

            {/* Price Control */}
            <div className="space-y-1.5">
              <FormField
                control={form.control}
                name="price_control"
                key="price_control"
                render={({ field }: { field: ControllerRenderProps<FieldValues, "price_control"> }) => (
                  <FormItem>
                    <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">
                      Price Control <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                      >
                        <SelectTrigger className="w-full h-9 px-3 py-1 text-sm rounded-md bg-white border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-black">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {PriceControl.map((price) => (
                            <SelectItem key={price.name} value={price.name} className="text-sm">
                              {price.name} - {price.description}
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

            {/* HSN Code */}
            <div className="space-y-1.5">
              <FormField
                control={form.control}
                name="hsn_code"
                key="hsn_code"
                render={({ field }: { field: ControllerRenderProps<FieldValues, "hsn_code"> }) => (
                  <FormItem>
                    <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">HSN Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        maxLength={8}
                        inputMode="numeric"
                        pattern="\d{8}"
                        className="w-full h-9 px-3 py-1 text-sm rounded-md bg-white border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-black"
                        placeholder="Enter Code"
                        onChange={(e) => {
                          const formattedValue = e.target.value
                            .toLowerCase()
                            .replace(/\b\w/g, (char) =>
                              char.toUpperCase()
                            );
                          field.onChange(formattedValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            {/* Do Not Cost */}
            <div className="space-y-1.5">
              <FormField
                control={form.control}
                name="do_not_cost"
                key="do_not_cost"
                render={({ field }: { field: ControllerRenderProps<FieldValues, "do_not_cost"> }) => (
                  <FormItem>
                    <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">Do Not Cost</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value || null)}
                        readOnly
                        disabled={form.watch("price_control") === "S"}
                        className="w-full h-9 px-3 py-1 text-sm rounded-md !bg-white !disabled:bg-white !opacity-100 !disabled:opacity-100 border border-slate-200 text-black font-medium cursor-not-allowed disabled:opacity-50"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            {(role === "Material CP" || role === "Store") && (
              <div className="col-span-1 md:col-span-2 space-y-1.5">
                <Label htmlFor="material_information_fileinput" className="text-[12px] font-semibold uppercase tracking-wider text-black mb-3 block leading-tight">
                  Upload Material Information File
                </Label>
                <div
                  className="border border-dashed border-slate-300 rounded-md cursor-pointer bg-white hover:bg-slate-50 transition-colors w-full px-3 py-1 shadow-sm min-h-[36px] flex items-center"
                  onClick={() => !fileSelected && handleLabelClick("material_information_fileinput")}
                >
                  <div className="flex items-center justify-between gap-3 w-full">
                    <input
                      type="file"
                      id="material_information_fileinput"
                      name="material_information"
                      key="material_information"
                      className="hidden"
                      onChange={(event) =>
                        handleImageChange(event, "material_information")
                      }
                    />
                    <div className="flex items-center gap-2 w-full">
                      {isFileUploading ? (
                        <div className="flex items-center gap-2 w-full">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#0C72F5]"></div>
                          <span className="text-[12px] text-black">Uploading...</span>
                        </div>
                      ) : !fileSelected ? (
                        <>
                          <Paperclip
                            size={14}
                            className="text-[#0C72F5]"
                          />
                          <span className="text-[12px] text-black truncate">
                            Click to upload file
                          </span>
                        </>
                      ) : (
                        <div className="flex w-full items-center justify-between gap-2 overflow-hidden">
                          <a
                            href={
                              localLineItemFiles?.["material_information"]?.fileURL
                              || (form.getValues("material_information") && typeof form.getValues("material_information") === "string" ? `${process.env.NEXT_PUBLIC_BASE_URL}${form.getValues("material_information")}` : "#")
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[12px] text-[#0C72F5] hover:underline truncate"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {fileName}
                          </a>
                          <Button
                            type="button"
                            variant="ghost"
                            className="text-red-500 hover:text-red-600 font-bold p-0 h-4 w-4 flex items-center justify-center rounded-sm hover:bg-red-50 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFile("material_information_fileinput", setFileName);
                            }}
                          >
                            ✕
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialOthersData;
"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Paperclip } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ControllerRenderProps, FieldValues, UseFormReturn } from "react-hook-form";
import { MaterialRegistrationFormData, EmployeeDetail, Company, Plant, division, industry, ClassType, UOMMaster, MRPType, ValuationClass, procurementType, ValuationCategory, MaterialGroupMaster, MaterialCategory, ProfitCenter, AvailabilityCheck, PriceControl, MRPController, StorageLocation, InspectionType, SerialNumber, LotSize, SchedulingMarginKey, ExpirationDate, MaterialRequestData, MaterialType } from "@/src/types/MaterialCodeRequestFormTypes";

interface MaterialProcurementFormProps {
  form: UseFormReturn<any>;
  setFilteredProfit: React.Dispatch<React.SetStateAction<ProfitCenter[]>>;
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
}


const MaterialOthersData: React.FC<MaterialProcurementFormProps> = ({ form, role, designationname, MaterialOnboardingDetails, MaterialDetails, companyInfo, PriceControl = [], ValuationClass, filteredProfit, handleImageChange, handleLabelClick, handleRemoveFile, lineItemFiles, fileSelected, setFileSelected, setFileName, fileName, MaterialType = [], isZCAPMaterial = false }) => {

  const [filteredProfitCenter, setFilteredProfitCenter] = useState<ProfitCenter[]>([]);
  const [filteredValuationClass, setFilteredValuationClass] = useState<ValuationClass[]>([]);
  const [profitcenterSearch, setProfitCenterSearch] = useState<string>("");

  console.log("Others Data Material Details----------->", MaterialType)

  useEffect(() => {
    const currentPriceControl = form.getValues("price_control");
    const matched = PriceControl.find(
      (item) => item.name === (currentPriceControl || "V")
    );

    if (!currentPriceControl && matched) {
      form.setValue("price_control", matched.name);
    }

    if (matched?.do_not_cost !== undefined) {
      form.setValue("do_not_cost", matched.do_not_cost);
    } else {
      form.setValue("do_not_cost", "");
    }
  }, [form.watch("price_control"), PriceControl, form]);

  useEffect(() => {
    const materialType = MaterialDetails?.material_request_item?.material_type;
    const company = MaterialDetails?.material_request_item?.company_name;

    if (!materialType || !company || !MaterialType?.length) return;

    const matchedType = MaterialType.find(
      (type) => type.name === materialType
    );

    if (matchedType && matchedType.valuation_and_profit?.length) {
      const valuationProfit = matchedType.valuation_and_profit.filter(
        (item) => item.company === company
      );
      const uniqueValuationClasses: ValuationClass[] = [];
      const uniqueProfits: ProfitCenter[] = [];

      valuationProfit.forEach((item) => {
        if (
          item.valuation_class &&
          !uniqueValuationClasses.find(
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

        if (
          item.profit_center &&
          !uniqueProfits.find((pc) => pc.name === item.profit_center)
        ) {
          uniqueProfits.push({
            name: item.profit_center,
            description: item.profit_center_description || "",
          });
        }
      });

      setFilteredValuationClass(uniqueValuationClasses);
      setFilteredProfitCenter(uniqueProfits);
    }
  }, [MaterialDetails, MaterialType, form]);

  const filteredProfitCenterOptions = profitcenterSearch
    ? filteredProfitCenter.filter((profit) =>
      profit.name
        ?.toLowerCase()
        .includes(profitcenterSearch.toLowerCase())
    )
    : filteredProfitCenter;

  useEffect(() => {
    const data = MaterialDetails?.material_onboarding;
    if (!data) return;

    const fields = [
      "price_control",
      "hsn_code",
      "do_not_cost",
      "material_information",
      "profit_center",
      "valuation_class",
    ];

    fields.forEach((field) => {
      if ((data as any)[field]) {
        form.setValue(field, (data as any)[field]);
        if (field === "material_information") {
          const fileUrl = (data as any)[field];
          const fileNameFromUrl = fileUrl?.split("/").pop();
          setFileName(fileNameFromUrl);
          setFileSelected(true);
        }
      }
    });

    if (
      filteredProfitCenter.length &&
      filteredValuationClass.length &&
      data.profit_center &&
      data.valuation_class
    ) {
      form.setValue("profit_center", data.profit_center);
      form.setValue("valuation_class", data.valuation_class);
    }
  }, [MaterialDetails, filteredProfitCenter, filteredValuationClass, form]);


  return (
    <div className="bg-[#F4F4F6] overflow-hidden">
      <div className="flex flex-col justify-between pt-4 bg-white rounded-[8px] p-1">
        <div className="space-y-1">
          <div className="text-[20px] font-semibold leading-[24px] text-[#03111F] border-b border-slate-500 pb-1">
            Others Data
          </div>

          <div className="grid grid-cols-3 gap-4">
            {!isZCAPMaterial && (
              <>
                {/* Profit Center */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="profit_center"
                    key="profit_center"
                    render={({ field }: { field: ControllerRenderProps<FieldValues, "profit_center"> }) => (
                      <FormItem>
                        <FormLabel>
                          Profit Center <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(val) => {
                              field.onChange(val);
                              setProfitCenterSearch("");
                            }}
                            value={field.value || ""}
                          // disabled={isZCAPMaterial}
                          >
                            <SelectTrigger className="p-3 w-full text-sm data-[placeholder]:text-gray-500">
                              <SelectValue placeholder="Select Profit Center" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto">
                              <div className="px-2 py-1">
                                <input
                                  type="text"
                                  value={profitcenterSearch}
                                  onChange={(e) => setProfitCenterSearch(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (
                                      !["ArrowDown", "ArrowUp", "Enter"].includes(e.key)
                                    ) {
                                      e.stopPropagation();
                                    }
                                  }}
                                  placeholder="Search Division..."
                                  className="w-full p-2 border border-gray-300 rounded text-sm"
                                />
                              </div>
                              {filteredProfitCenterOptions?.length > 0 ? (
                                filteredProfitCenterOptions.map((profit) => (
                                  <SelectItem key={profit.name} value={profit.name}>
                                    {profit.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <div className="px-3 py-2 text-sm text-gray-500">
                                  No matching profit center found
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


                {/* Valuation Class */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="valuation_class"
                    key="valuation_class"
                    render={({ field }: { field: ControllerRenderProps<FieldValues, "valuation_class"> }) => (
                      <FormItem>
                        <FormLabel>
                          Valuation Class <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || undefined}
                          >
                            <SelectTrigger className="p-3 w-full text-sm data-[placeholder]:text-gray-500">
                              <SelectValue placeholder="Select Valuation Class" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto">
                              {filteredValuationClass.map((vclass) => (
                                <SelectItem key={vclass.name} value={vclass.name}>
                                  {vclass.valuation_class_code} - {vclass.valuation_class_name}
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

                {/* Price Control */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="price_control"
                    key="price_control"
                    render={({ field }: { field: ControllerRenderProps<FieldValues, "price_control"> }) => (
                      <FormItem>
                        <FormLabel>
                          Price Control <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || undefined}
                          >
                            <SelectTrigger className="p-3 w-full text-sm data-[placeholder]:text-gray-500">
                              <SelectValue placeholder="Select Price Control" />
                            </SelectTrigger>
                            <SelectContent>
                              {PriceControl.map((price) => (
                                <SelectItem key={price.name} value={price.name}>
                                  {price.name} - {price.description}
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

                {/* HSN Code */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="hsn_code"
                    key="hsn_code"
                    render={({ field }: { field: ControllerRenderProps<FieldValues, "hsn_code"> }) => (
                      <FormItem>
                        <FormLabel>HSN Code</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            maxLength={8}
                            inputMode="numeric"
                            pattern="\d{8}"
                            className="p-3 w-full text-sm placeholder:text-gray-500"
                            placeholder="Enter HSN Code"
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Do Not Cost */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="do_not_cost"
                    key="do_not_cost"
                    render={({ field }: { field: ControllerRenderProps<FieldValues, "do_not_cost"> }) => (
                      <FormItem>
                        <FormLabel>Do Not Cost</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            readOnly
                            className="p-3 w-full text-sm placeholder:text-gray-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {(role === "Material CP" || role === "Store") && (
                  <div className="col-span-1 space-y-[5px]">
                    <Label htmlFor="fileinput">
                      Upload Material Information File
                    </Label>
                    <div className="border-2 border-dashed border-gray-400 rounded-lg">
                      <div className="items-center">
                        <div className="flex items-center justify-between gap-4 mt-1 px-2 py-2">
                          <input
                            type="file"
                            id="fileinput"
                            name="material_information"
                            key="material_information"
                            className="hidden"
                            onChange={(event) =>
                              handleImageChange(event, "material_information")
                            }
                          />
                          <div className="flex items-center gap-2">
                            {!fileSelected && (
                              <Paperclip
                                size={18}
                                className="cursor-pointer text-blue-600 hover:text-blue-800"
                                onClick={() => handleLabelClick("fileinput")}
                              />
                            )}

                            {!fileSelected ? (
                              <span className="text-sm text-gray-500">
                                No file selected
                              </span>
                            ) : (
                              <>
                                <a
                                  href={`${process.env.NEXT_PUBLIC_BASE_URL}${form.getValues(
                                    "material_information"
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 underline"
                                >
                                  {fileName}
                                </a>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  className="text-red-500 font-bold p-0 h-auto"
                                  onClick={() =>
                                    handleRemoveFile("fileinput", setFileName)
                                  }
                                >
                                  ✕
                                </Button>
                              </>
                            )}
                          </div>
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

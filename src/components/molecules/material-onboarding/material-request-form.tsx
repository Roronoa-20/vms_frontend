"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Delete } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import { MaterialRegistrationFormData, Company, Plant, MaterialCategory, MaterialType, UOMMaster, MaterialSafePrefillData } from "@/src/types/MaterialCodeRequestFormTypes";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";


interface Masters {
  companyMaster: Company[];
  materialCategoryMaster: MaterialCategory[];
  uomMaster: UOMMaster[];
}

interface UserRequestFormProps {
  form: any;
  masters: Masters;
  MaterialOnboardingDetails?: MaterialRegistrationFormData;
  handleMaterialSearch: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  searchResults: any[];
  showSuggestions: boolean;
  handleMaterialSelect: (item: any) => void;
  materialSelectedFromList: boolean;
  setMaterialSelectedFromList: React.Dispatch<React.SetStateAction<boolean>>;
  setMaterialCodeAutoFetched: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedMaterialType: React.Dispatch<React.SetStateAction<string>>;
  materialCodeAutoFetched: boolean;
  materialCodeStatus: "idle" | "checking" | "exists" | "available";
  selectedCodeLogic: string;
  setSelectedCodeLogic: React.Dispatch<React.SetStateAction<string>>;
  latestCodeSuggestions: any[];

}

export default function UserMaterialRequestForm({ form, masters, MaterialOnboardingDetails, handleMaterialSearch, searchResults, showSuggestions, handleMaterialSelect, materialSelectedFromList, setMaterialSelectedFromList, setMaterialCodeAutoFetched, setShowSuggestions, materialCodeAutoFetched, setSelectedMaterialType, materialCodeStatus, selectedCodeLogic, setSelectedCodeLogic, latestCodeSuggestions }: UserRequestFormProps) {

  const { companyMaster, materialCategoryMaster, uomMaster } = masters;
  console.log("Masters will be shown here------>",masters)
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([]);
  const [filteredMaterialType, setFilteredMaterialType] = useState<MaterialType[]>([]);
  const [materialCompanyCode, setMaterialCompanyCode] = useState<string>("");
  const [plantSearch, setPlantSearch] = useState("");
  const [materialTypeSearch, setMaterialTypeSearch] = useState("");
  const [uomSearch, setUomSearch] = useState("");
  const prefillRef = useRef<MaterialRegistrationFormData | null>(null);
  const { name } = useAuth();
  const isMastersReady = [companyMaster, materialCategoryMaster, uomMaster].every((arr) => arr && arr.length > 0);
  const [materialCategoryTypeOptions, setMaterialCategoryTypeOptions] = useState<{
    material_category_type: string; code_logic: string;
  }[]>([]);

  const selectedMaterialCategory = form.watch("material_category");
  const selectedMaterialType = form.watch("material_type");
  console.log("Slelected Matearial Type--->", selectedMaterialType)

  const isZRND = selectedMaterialType === "ZRND - R&D Material";

  const shouldShowMaterialCode =
    !isZRND &&
    (selectedMaterialCategory === "R" || selectedMaterialCategory === "P");

  useEffect(() => {
    if (!MaterialOnboardingDetails || !isMastersReady) return;

    const details = MaterialOnboardingDetails;
    const currentValues = form.getValues();

    if (
      currentValues.material_name_description === details.material_name_description &&
      currentValues.material_company_code === details.material_company_code
    ) { return; }

    if (details.material_company_code) {
      setMaterialCompanyCode(String(details.material_company_code));
    }
    prefillRef.current = details;
  }, [MaterialOnboardingDetails?.name, isMastersReady]);

  useEffect(() => {
    if (name) {
      form.setValue("requested_by_name", name);
    }
  }, [name]);

  useEffect(() => {
    if (!MaterialOnboardingDetails || !isMastersReady) return;

    const prefillForm = async () => {
      const details = MaterialOnboardingDetails;

      if (details.material_company_code) setMaterialCompanyCode(String(details.material_company_code));

      const [plants, materialTypes] = await Promise.all([
        fetchPlantMaster(String(details.material_company_code)),
        fetchMaterialTypeMaster(details.material_category, String(details.material_company_code)),
      ]);

      setFilteredPlants(plants);
      setFilteredMaterialType(materialTypes);

      const plantExists = !details.plant || plants.some(p => p.plant_name === details.plant);
      const typeExists = !details.material_type || materialTypes.some((t: MaterialType) => t.name === details.material_type);
      form.reset({
        ...form.getValues(),
        material_company_code: details.material_company_code || "",
        material_category: details.material_category || "",
        base_unit_of_measure: details.unit_of_measure || "",
        plant_name: plantExists ? details.plant : "",
        material_type: typeExists ? details.material_type : "",
        material_type_category: typeExists ? details.material_type_category : "",
        material_name_description: details.material_name_description || "",
        material_code_revised: details.material_code_revised || "",
        material_specifications: details.material_specifications || "",
        comment_by_user: details.comment_by_user || "",
        requested_by_name: details.requested_by || name || "",
        requested_by_place: details.requested_by_place || "",
      });

      if (typeExists && details.material_type) setSelectedMaterialType(details.material_type);

      form.trigger([
        "material_company_code",
        "plant_name",
        "material_category",
        "material_type",
        "base_unit_of_measure",
        "material_type_category",
      ]);

      console.log("Prefill successful!", { plantExists, typeExists });
    };
    prefillForm();
  }, [MaterialOnboardingDetails, name, isMastersReady]);

  const fetchPlantMaster = async (query?: string): Promise<Plant[]> => {
    const baseUrl = API_END_POINTS?.getPlantMaster;
    let url = baseUrl;
    if (query) {
      url += `${url.includes('?') ? '&' : '?'}company=${encodeURIComponent(query)}`;
    }
    const response: AxiosResponse = await requestWrapper({ url: url, method: "GET" });
    if (response?.status == 200) {
      return response.data.message.data
    } else {
      alert("error");
    }
    return []
  };

  const fetchMaterialTypeMaster = async (categoryType: string, companyCode: string) => {
    try {
      const res: AxiosResponse = await requestWrapper({
        method: "GET",
        url: `${API_END_POINTS.getMaterialTypeMaster}?material_category_type=${categoryType}&company=${companyCode}`,
      });
      // console.log("Material Type Response---->", res)
      return res?.data?.message?.data || [];
    } catch (err) {
      console.error("Error fetching MaterialTypeMaster:", err);
      return [];
    }
  };

  useEffect(() => {
    if (!materialCompanyCode) return;
    const loadPlantMaster = async () => {
      const plants = await fetchPlantMaster(materialCompanyCode);
      setFilteredPlants(plants);
    };
    loadPlantMaster();
  }, [materialCompanyCode]);

  useEffect(() => {
    if (!materialCompanyCode || !selectedMaterialCategory) return;
    const loadMaterialTypes = async () => {
      const materialTypes = await fetchMaterialTypeMaster(
        selectedMaterialCategory,
        materialCompanyCode
      );
      setFilteredMaterialType(materialTypes);
    };
    loadMaterialTypes();
  }, [selectedMaterialCategory, materialCompanyCode]);


  // --- Search Filters ---
  const filteredPlantOptions = plantSearch ? filteredPlants?.filter((plant) => plant.plant_name?.toLowerCase().includes(plantSearch.toLowerCase())) : filteredPlants;

  const filteredMaterialTypeOptions = materialTypeSearch ? filteredMaterialType?.filter((type) => type.name.toLowerCase().includes(materialTypeSearch.toLowerCase()) || type.description?.toLowerCase().includes(materialTypeSearch.toLowerCase())) : filteredMaterialType;

  const filteredUomOptions = uomSearch ? uomMaster?.filter(
    (unit) => unit.name.toLowerCase().includes(uomSearch.toLowerCase()) || unit.description?.toLowerCase().includes(uomSearch.toLowerCase())) : uomMaster;

  // --- Reset invalid material type ---
  useEffect(() => {
    const currentMaterialType = form.getValues("material_type");
    const isTypeStillValid = filteredMaterialType.some(
      (type) => type.name === currentMaterialType
    );
    if (!isTypeStillValid) {
      form.setValue("material_type", "");
    }
  }, [filteredMaterialType]);

  const desc = form.watch("material_name_description");
  const code = form.watch("material_code_revised");

  useEffect(() => {

    if (!desc && materialSelectedFromList) {
      form.setValue("material_code_revised", "");
      setMaterialSelectedFromList(false);
      setMaterialCodeAutoFetched(true);
    }

    if (!desc && !materialSelectedFromList) {
      form.setValue("material_code_revised", "");
      setMaterialCodeAutoFetched(true);
    }
  }, [desc]);

  useEffect(() => {
    const desc = form.getValues("material_name_description");

    if (desc && !materialSelectedFromList) {
      form.setValue("is_revised_code_new", true);
    } else {
      form.setValue("is_revised_code_new", false);
    }
  }, [form.watch("material_name_description"), materialSelectedFromList]);

  useEffect(() => {
    if (!selectedCodeLogic) return;

    if (!materialSelectedFromList) {
      form.setValue("material_code_revised", `${selectedCodeLogic}-`);
      setMaterialCodeAutoFetched(false);
    }
  }, [selectedCodeLogic, materialSelectedFromList]);

  useEffect(() => {
    if (!shouldShowMaterialCode) {
      form.setValue("material_code_revised", "");
      form.clearErrors("material_code_revised");
      return;
    }

    if (selectedMaterialCategory === "R") {
      form.setValue("material_code_revised", "R-");
    }

    if (selectedMaterialCategory === "P") {
      form.setValue("material_code_revised", "P-");
    }
  }, [selectedMaterialCategory, selectedMaterialType]);

  useEffect(() => {
    if (!shouldShowMaterialCode) {
      form.clearErrors("material_code_revised");
    }
  }, [shouldShowMaterialCode]);

  // --- Delete a row from table (DO NOT DELETE) ---
  // const handleDeleteRow = (indexToDelete: number) => {
  //   setMaterialRequestList((prevList) =>
  //     prevList.filter((_, index) => index !== indexToDelete)
  //   );
  // };

  return (
    <div className="bg-[#F4F4F6]">
      <div className="flex flex-col justify-between bg-white rounded-[8px]">
        <div>
          <div className="text-[20px] font-semibold leading-[24px] text-[#03111F] border-b border-slate-500 pb-1">
            Basic Data
          </div>

          <div className="grid grid-cols-3 gap-4 pt-3">
            {/* Company Code */}
            <FormField
              control={form.control}
              name="material_company_code"
              key="material_company_code"
              render={({ field }: { field: { value?: string; onChange: (value: string) => void; ref?: React.Ref<any> } }) => (
                <FormItem>
                  <FormLabel>Company Code</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setMaterialCompanyCode(value);
                      }}
                      value={field.value || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companyMaster?.map((item: Company) => (
                          <SelectItem key={item.name} value={item.name}>
                            {item.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Plant Name */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                rules={{ required: "Plant Code is required." }}
                name="plant_name"
                key="plant_name"
                render={({ field }: { field: { value?: string; onChange: (value: string) => void; ref?: React.Ref<any> } }) => (
                  <FormItem>
                    <FormLabel>Plant Code <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setPlantSearch("");
                        }}
                        value={field.value || ""}
                      >
                        <SelectTrigger className={`p-3 w-full text-sm data-[placeholder]:text-gray-500`}>
                          <SelectValue placeholder="Select Plant Code" />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="px-2 py-1">
                            <input
                              type="text"
                              value={plantSearch}
                              onChange={(e) => setPlantSearch(e.target.value)}
                              onKeyDown={(e) => {
                                if (!["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) {
                                  e.stopPropagation();
                                }
                              }} placeholder="Search Plant Code..."
                              className="w-full p-2 border border-gray-300 rounded text-sm"
                            />
                          </div>
                          {filteredPlantOptions?.length > 0 ? (
                            filteredPlantOptions.map((plant) => (
                              <SelectItem key={plant.plant_name ?? ""} value={plant.plant_name ?? ""}>
                                {plant.plant_name}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-sm text-gray-500">
                              No matching plant found
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

            {/* Material Category */}
            <FormField
              control={form.control}
              name="material_category"
              key="material_category"
              render={({ field }: { field: { value?: string; onChange: (value: string) => void; ref?: React.Ref<any> } }) => (
                <FormItem>
                  <FormLabel>Material Category <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {materialCategoryMaster?.map((item: MaterialCategory) => (
                          <SelectItem key={item.name} value={item.name}>
                            {item.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Material Type */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                rules={{ required: "Material Type is required." }}
                name="material_type"
                key="material_type"
                render={({ field }: { field: { value?: string; onChange: (value: string) => void; ref?: React.Ref<any> } }) => (
                  <FormItem>
                    <FormLabel>
                      Material Type <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value || ""}
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedMaterialType(value);
                          setMaterialTypeSearch("");
                          const selectedType = filteredMaterialType.find(
                            (t) => t.name === value
                          );

                          if (selectedType?.material_code_logic?.length) {
                            setMaterialCategoryTypeOptions(
                              selectedType.material_code_logic.map((item: any) => ({
                                material_category_type: item.material_type_category,
                                code_logic: item.code_logic,
                              }))
                            );

                            form.setValue("material_type_category", "");
                          } else {
                            setMaterialCategoryTypeOptions([]);
                            form.setValue("material_type_category", "");
                          }
                        }}
                      >
                        <SelectTrigger className={`p-2 w-full text-sm data-[placeholder]:text-gray-500`}>
                          <SelectValue placeholder="Select Material Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="px-2 py-1">
                            <Input
                              type="text"
                              value={materialTypeSearch}
                              onChange={(e) => setMaterialTypeSearch(e.target.value)}
                              onKeyDown={(e) => {
                                if (!["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) {
                                  e.stopPropagation();
                                }
                              }}
                              placeholder="Search Material Type..."
                              className="w-full p-2 border border-gray-300 rounded text-sm"
                            />
                          </div>
                          {filteredMaterialTypeOptions?.length > 0 ? (
                            filteredMaterialTypeOptions.map((material) => (
                              <SelectItem key={material.name} value={material.name}>
                                {material.name}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-sm text-gray-500">No material types found</div>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Material Type Category */}
            {materialCategoryTypeOptions.length > 0 && (
              <FormField
                control={form.control}
                name="material_type_category"
                rules={{ required: "Material Type Category is required." }}
                render={({ field }: { field: { value?: string; onChange: (value: string) => void; ref?: React.Ref<any> } }) => (
                  <FormItem>
                    <FormLabel>
                      Material Type Category <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value || ""}
                        onValueChange={(value) => {
                          field.onChange(value);

                          const selectedCategory = materialCategoryTypeOptions.find(
                            (item) => item.material_category_type === value
                          );

                          if (selectedCategory?.code_logic) {
                            setSelectedCodeLogic(selectedCategory.code_logic);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Material Category Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {materialCategoryTypeOptions.map((item) => (
                            <SelectItem
                              key={item.material_category_type}
                              value={item.material_category_type}
                            >
                              {item.material_category_type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}


            <FormField
              control={form.control}
              name="base_unit_of_measure"
              key="base_unit_of_measure"
              render={({ field }: { field: { value?: string; onChange: (value: string) => void; ref?: React.Ref<any> } }) => (
                <FormItem>
                  <FormLabel>Base Unit of Measure <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select UOM" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredUomOptions?.map((item: UOMMaster) => (
                          <SelectItem key={item.name} value={item.name}>
                            {item.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-3">
            {/* Material Description */}
            <div className="col-span-2 relative">
              <FormField
                control={form.control}
                name="material_name_description"
                rules={{ required: "Material Name/Description is required." }}
                render={({ field }: { field: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; ref: React.Ref<HTMLTextAreaElement> } }) => (
                  <FormItem>
                    <FormLabel>
                      Material Name/Description <span className="text-red-500">*</span><span className="text-[10px]">(Max Char 40)</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <textarea
                          ref={field.ref}
                          value={field.value || ""}
                          onChange={(e) => {
                            field.onChange(e);
                            handleMaterialSearch(e);
                          }}
                          onFocus={() => {
                            console.log("🧠 Current searchResults:", searchResults);
                            console.log("🎯 Selected Material Type:", selectedMaterialType);
                            console.log("🔍 Filtered by Material Type:", searchResults?.filter(item => item.material_type === selectedMaterialType));
                            if (searchResults.length) setShowSuggestions(true);
                          }}
                          onBlur={(e) => {
                            if (!e.relatedTarget || !e.relatedTarget.classList.contains("material-suggestion")) {
                              setTimeout(() => setShowSuggestions(false), 100);
                            }
                          }}
                          rows={2}
                          maxLength={40}
                          className="w-full p-[9px] text-sm text-gray-700 border border-gray-300 rounded-md placeholder:text-gray-500 hover:border-blue-400 focus:border-blue-400 focus:outline-none"
                          placeholder="Enter or Search Material Name/Description"
                        />
                        {showSuggestions && (
                          <div className="absolute left-0 top-full mt-1 z-10 bg-white border border-gray-300 rounded-md shadow-md w-full min-w-full max-h-40 overflow-y-auto">
                            {searchResults
                              .filter(item => {
                                if (!selectedMaterialType) return true;
                                return item.material_type === selectedMaterialType;
                              })
                              .map((item, idx) => (
                                <div
                                  key={idx}
                                  tabIndex={-1}
                                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm material-suggestion"
                                  onClick={() => handleMaterialSelect(item)}
                                >
                                  {item.material_name_description} - {item.material_code_revised}
                                </div>
                              ))}
                            {searchResults.filter(item => !selectedMaterialType || item.material_type === selectedMaterialType).length === 0 && (
                              <div className="px-3 py-2 text-sm text-gray-500">No matching materials</div>
                            )}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Material Code Revised  */}
            {shouldShowMaterialCode && (
              <div className="col-span-1 relative">
                <FormField
                  control={form.control}
                  name="material_code_revised"
                  render={({ field }: { field: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; ref: React.Ref<HTMLInputElement> } }) => {
                    return (
                      <FormItem>
                        <FormLabel>Material Code <span className="text-red-500">*</span><span className="text-[10px]">(Max. Char 18)</span></FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              {...field}
                              className="p-3 w-full text-sm placeholder:text-gray-500"
                              placeholder="Enter Revised Material Code"
                              maxLength={18}
                              // onChange={(e) => {
                              //   setMaterialCodeAutoFetched(false);
                              //   field.onChange(e);
                              // }}
                              onChange={(e) => {
                                const value = e.target.value;

                                // If material selected from dropdown → don't interfere
                                if (materialSelectedFromList) {
                                  field.onChange(e);
                                  return;
                                }

                                // If no code logic, allow normal typing
                                // if (!selectedCodeLogic) {
                                //   field.onChange(e);
                                //   return;
                                // }

                                // PREFIX PROTECTION
                                //   if (!value.startsWith(selectedCodeLogic)) {
                                //     e.target.value = `${selectedCodeLogic}-`;
                                //     field.onChange(e);
                                //     return;
                                //   }
                                //   setMaterialCodeAutoFetched(false);
                                //   field.onChange(e);
                                // }}
                                const prefix =
                                  selectedMaterialCategory === "R" ? "R-" :
                                    selectedMaterialCategory === "P" ? "P-" :
                                      "";

                                if (prefix && !value.startsWith(prefix)) {
                                  e.target.value = prefix;
                                }

                                field.onChange(e);
                              }}
                              disabled={materialCodeAutoFetched}
                            />
                          </FormControl>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {materialCodeStatus === "checking" && (
                              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                            )}
                            {materialCodeStatus === "available" && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                            {materialCodeStatus === "exists" && (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          {latestCodeSuggestions[0] && !materialSelectedFromList && (
                            <p className="mt-1 text-xs text-gray-500">
                              Latest existing code:{" "}
                              <span className="font-semibold">
                                {latestCodeSuggestions[0].material_code}
                              </span>
                            </p>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            )}
          </div>

          {/* Comment By User */}
          <div className="col-span-3 grid grid-cols-12 items-center gap-4">
            {/* Material specifications*/}
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="material_specifications"
                key="material_specifications"
                render={({ field }: { field: { value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; ref: React.Ref<HTMLTextAreaElement> } }) => (
                  <FormItem>
                    <FormLabel>Material Specifications <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        rows={2}
                        className="w-full p-2 text-sm rounded-md placeholder:text-gray-400 border border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:outline-none"
                        placeholder="Enter Material Specifications"
                        onChange={field.onChange}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Comment By User */}
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="comment_by_user"
                key="comment_by_user"
                rules={{ required: "Comment is required when material is selected." }}
                render={({ field }: { field: { value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; ref: React.Ref<HTMLTextAreaElement> } }) => (
                  <FormItem>
                    <FormLabel>
                      Comment <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        rows={2}
                        className="w-full p-2 text-sm text-gray-700 border border-gray-300 rounded-md placeholder:text-gray-500 hover:border-blue-400 focus:border-blue-400 focus:outline-none"
                        placeholder="Provide a reason for selecting this material"
                        onChange={field.onChange}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Materials Table */}
            {/* <div className="mt-4 border p-4 rounded w-full overflow-auto">
            <h3 className="font-bold mb-2">Materials</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.No</TableHead>
                  <TableHead>Company Code</TableHead>
                  <TableHead>Plant Code</TableHead>
                  <TableHead>Material Category</TableHead>
                  <TableHead>Material Type</TableHead>
                  <TableHead>Material Description</TableHead>
                  <TableHead>Base UOM</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materialRequestList.length > 0 ? (
                  materialRequestList.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.material_company_code}</TableCell>
                      <TableCell>{item.plant_name}</TableCell>
                      <TableCell>{item.material_category}</TableCell>
                      <TableCell>{item.material_type}</TableCell>
                      <TableCell>{item.material_name_description}</TableCell>
                      <TableCell>{item.base_unit_of_measure}</TableCell>
                      <TableCell>{item.comment_by_user}</TableCell>
                      <TableCell>
                        <Delete
                          className="ml-[15px] text-red-600 cursor-pointer"
                          size={18}
                          onClick={() => handleDeleteRow(index)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">
                      No materials added yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div> */}
          </div>
        </div>
      </div>
    </div >
  );
}
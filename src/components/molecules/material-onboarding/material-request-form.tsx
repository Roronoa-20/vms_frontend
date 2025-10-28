"use client";

import React, { useState, useEffect } from "react";
import {
  Input
} from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Table,
  TableHead,
  TableHeader,
  TableCell,
  TableRow,
  TableBody
} from "@/components/ui/table";
import { Delete } from "lucide-react";

// --- Type definitions for props and masters ---
interface MasterItem {
  name: string;
  description?: string;
  company_name?: string;
  company?: string;
  plant_name?: string;
  category_name?: string;
  material_type_name?: string;
  multiple_company?: { company: string }[];
  material_category_type?: string;
}

interface Masters {
  companyMaster: MasterItem[];
  plantMaster: MasterItem[];
  materialCategoryMaster: MasterItem[];
  materialTypeMaster: MasterItem[];
  uomMaster: MasterItem[];
}

interface UserRequestFormProps {
  form: any;
  masters: Masters;
  MaterialOnboardingDetails?: any;
  EmployeeDetails?: any;
  companyName?: any;
  handleMaterialSearch: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  searchResults: any[];
  showSuggestions: boolean;
  handleMaterialSelect: (item: any) => void;
  materialSelectedFromList: boolean;
  setMaterialSelectedFromList: React.Dispatch<React.SetStateAction<boolean>>;
  setMaterialCodeAutoFetched: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
  materialCodeAutoFetched: boolean;
}

export default function UserRequestForm({
  form,
  masters,
  MaterialOnboardingDetails,
  EmployeeDetails,
  companyName,
  handleMaterialSearch,
  searchResults,
  showSuggestions,
  handleMaterialSelect,
  materialSelectedFromList,
  setMaterialSelectedFromList,
  setMaterialCodeAutoFetched,
  setShowSuggestions,
  materialCodeAutoFetched
}: UserRequestFormProps) {
  const {
    companyMaster,
    plantMaster,
    materialCategoryMaster,
    materialTypeMaster,
    uomMaster
  } = masters;
  console.log("Material Type Mster----->", materialTypeMaster);
  // --- State Management ---
  const [filteredPlants, setFilteredPlants] = useState<MasterItem[]>([]);
  const [filteredMaterialType, setFilteredMaterialType] = useState<MasterItem[]>([]);
  const [materialCompanyCode, setMaterialCompanyCode] = useState<string>("");
  const [plantSearch, setPlantSearch] = useState("");
  const [materialTypeSearch, setMaterialTypeSearch] = useState("");
  const [uomSearch, setUomSearch] = useState("");
  const [materialRequestList, setMaterialRequestList] = useState<any[]>([]);

  const selectedMaterialCategory = form.watch("material_category");
  const selectedMaterialType = form.watch("material_type");

  // --- Effect: Filter Plants and Material Types ---
  useEffect(() => {
    if (!materialCompanyCode) return;

    // Filter plants by company
    const filtered = plantMaster?.filter(
      (plant) => String(plant.company) === materialCompanyCode
    );
    setFilteredPlants(filtered || []);

    const filteredMaterialType = materialTypeMaster?.filter((type) => {
      const hasMatchingCompany = type.multiple_company?.some(
        (comp) => String(comp.company) === String(materialCompanyCode)
      );

      const matchesCategory =
        !selectedMaterialCategory ||
        String(type.material_category_type) === String(selectedMaterialCategory);

      return hasMatchingCompany && matchesCategory;
    });

    setFilteredMaterialType(filteredMaterialType || []);
  }, [materialCompanyCode, selectedMaterialCategory, plantMaster, materialTypeMaster]);

  // --- Search Filters ---
  const filteredPlantOptions = plantSearch
    ? filteredPlants?.filter((plant) =>
      plant.plant_name
        ?.toLowerCase()
        .includes(plantSearch.toLowerCase())
    )
    : filteredPlants;

  const filteredMaterialTypeOptions = materialTypeSearch
    ? filteredMaterialType?.filter(
      (type) =>
        type.name.toLowerCase().includes(materialTypeSearch.toLowerCase()) ||
        type.description?.toLowerCase().includes(materialTypeSearch.toLowerCase())
    )
    : filteredMaterialType;

  const filteredUomOptions = uomSearch
    ? uomMaster?.filter(
      (unit) =>
        unit.name.toLowerCase().includes(uomSearch.toLowerCase()) ||
        unit.description?.toLowerCase().includes(uomSearch.toLowerCase())
    )
    : uomMaster;

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

  // --- Auto populate employee details ---
  useEffect(() => {
    if (EmployeeDetails?.name) {
      form.setValue("requested_by_name", EmployeeDetails.name);
    }
  }, [EmployeeDetails?.name]);

  useEffect(() => {
    const desc = form.watch("material_name_description");

    if (!desc && materialSelectedFromList) {
      form.setValue("material_code_revised", "");
      setMaterialSelectedFromList(false);
      setMaterialCodeAutoFetched(true);
    }

    if (!desc && !materialSelectedFromList) {
      form.setValue("material_code_revised", "");
      setMaterialCodeAutoFetched(true);
    }
  }, [form.watch("material_name_description")]);

  useEffect(() => {
    const desc = form.watch("material_name_description");
    const code = form.watch("material_code_revised");

    if (desc && code && !materialSelectedFromList) {
      form.setValue("is_revised_code_new", true);
    } else {
      form.setValue("is_revised_code_new", false);
    }
  }, [form.watch("material_name_description"), form.watch("material_code_revised"), materialSelectedFromList]);


  // --- Prefill from MaterialOnboardingDetails ---
  useEffect(() => {
    if (MaterialOnboardingDetails?.material_request && companyName?.data?.length > 0) {
      const request = MaterialOnboardingDetails?.material_request?.[0] || {};
      const requestby = MaterialOnboardingDetails || {};

      form.setValue("material_company_code", String(request.company_name || ""));
      form.setValue("material_category", request.material_category || "");
      form.setValue("base_unit_of_measure", request.base_unit_of_measure || "");
      form.setValue("material_name_description", request.material_name_description || "");
      form.setValue("material_code_revised", request.material_code_revised || "");
      form.setValue("material_specifications", request.material_specifications || "");
      form.setValue("comment_by_user", request.comment_by_user || "");
      form.setValue("requested_by_name", requestby.requested_by || "");
      form.setValue("requested_by_place", requestby.requested_by_place || "");

      setMaterialCompanyCode(String(request.company_name || ""));
    }
  }, [MaterialOnboardingDetails?.material_request, companyName?.data]);

  useEffect(() => {
    const request = MaterialOnboardingDetails?.material_request?.[0];

    if (
      request &&
      filteredPlantOptions?.some(p => p.plant_name === request.plant_name) &&
      filteredMaterialTypeOptions?.some(t => t.name === request.material_type)
    ) {
      form.setValue("plant_name", String(request.plant_name || ""));
      form.setValue("material_type", String(request.material_type || ""));
    }
  }, [filteredPlants, filteredMaterialType]);

  // --- Delete a row from table ---
  const handleDeleteRow = (indexToDelete: number) => {
    setMaterialRequestList((prevList) =>
      prevList.filter((_, index) => index !== indexToDelete)
    );
  };

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
              name="material_company_code"
              render={() => (
                <FormItem>
                  <FormLabel>Company Code</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => setMaterialCompanyCode(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companyMaster?.map((item: MasterItem) => (
                          <SelectItem key={item.name} value={item.name}>
                            {item.company_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Plant Code */}
            <FormField
              name="plant_name"
              render={() => (
                <FormItem>
                  <FormLabel>Plant Code</FormLabel>
                  <FormControl>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Plant" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredPlantOptions?.map((item: MasterItem) => (
                          <SelectItem key={item.name} value={item.name}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Material Category */}
            <FormField
              name="material_category"
              render={() => (
                <FormItem>
                  <FormLabel>Material Category</FormLabel>
                  <FormControl>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {materialCategoryMaster?.map((item: MasterItem) => (
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
            <FormField
              name="material_type"
              render={() => (
                <FormItem>
                  <FormLabel>Material Type</FormLabel>
                  <FormControl>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Material Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredMaterialTypeOptions?.map((item: MasterItem) => (
                          <SelectItem key={item.name} value={item.name}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Base UOM */}
            <FormField
              name="base_unit_of_measure"
              render={() => (
                <FormItem>
                  <FormLabel>Base Unit of Measure</FormLabel>
                  <FormControl>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select UOM" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredUomOptions?.map((item: MasterItem) => (
                          <SelectItem key={item.name} value={item.name}>
                            {item.name} - {item.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          {/* Material Description */}
          <div className="col-span-2 relative">
            <FormField
              control={form.control}
              name="material_name_description"
              rules={{ required: "Material Name/Description is required." }}
              render={({ field }: { field: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; ref: React.Ref<HTMLTextAreaElement> } }) => (
                <FormItem>
                  <FormLabel>
                    Material Name/Description <span className="text-red-500">*</span>
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
          <div className="space-y-2 hidden">
            <FormField
              control={form.control}
              name="material_code_revised"
              render={({ field }: { field: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; ref: React.Ref<HTMLInputElement> } }) => {
                return (
                  <FormItem>
                    <FormLabel>Material Code - Revised <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="p-3 w-full text-sm placeholder:text-gray-500"
                        placeholder="Enter Revised Material Code"
                        onChange={(e) => {
                          setMaterialCodeAutoFetched(false);
                          field.onChange(e);
                        }}
                        disabled={materialCodeAutoFetched}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
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
                      Comment
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

          {/* Personal Data */}
          <div className="pt-4">
            <div className="text-[20px] font-semibold leading-[24px] text-[#03111F] border-b border-slate-500 pb-1 mt-2">
              Personal Data
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <FormField
                name="requested_by_name"
                render={({ field }: { field: { value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; ref?: React.Ref<HTMLInputElement> } }) => (
                  <FormItem>
                    <FormLabel>Requested By - Name</FormLabel>
                    <FormControl>
                      <Input readOnly className="p-3 w-full text-sm" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="requested_by_place"
                render={({ field }: { field: { value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; ref?: React.Ref<HTMLInputElement> } }) => (
                  <FormItem>
                    <FormLabel>Requested By - Place</FormLabel>
                    <FormControl>
                      <Input {...field} className="p-3 w-full text-sm" placeholder="Enter Place" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import { ControllerRenderProps, FieldValues, UseFormReturn } from "react-hook-form";

interface Company {
    company_code: string;
    company_name: string;
}

interface Plant {
    company: string;
    plant_name: string;
}

interface MaterialType {
    name: string;
    multiple_company?: { company: string }[];
    valuation_and_profit?: { company: string; division: string }[];
}

interface StorageLocationType {
    plant_code: string;
    name: string;
}

interface UnitType {
    name: string;
    description: string;
}

interface MaterialCategoryType {
    name: string;
    description: string;
}

interface MaterialCode {
    name: string;
    material_description: string;
    material_type?: string;
}

interface MaterialRequestItem {
    material_name_description?: string;
    comment_by_user?: string;
    plant_name?: string;
    material_type?: string;
    company_name?: string;
    base_unit_of_measure?: string;
    material_category?: string;
    material_code_revised?: string;
    is_revised_code_new?: number;
}

interface MaterialMaster {
    storage_location?: string;
    division?: string;
    old_material_code?: string;
    material_code_revised?: string;
}

interface MaterialDetailsType {
    material_request_item?: MaterialRequestItem;
    material_master?: MaterialMaster;
}

interface MaterialOnboardingDetailsType {
    approval_status?: string;
    material_request?: { company_name?: string }[];
}

interface EmployeeDetailsType {
    employee_name?: string;
    employee_code?: string;
}

interface SearchResult {
    material_name_description: string;
    material_code_revised: string;
}

interface UserRequestFormProps {
    form: UseFormReturn<any>;
    onSubmit?: (data: any) => void;
    role: string;
    companyName: Company[] ;
    plantcode: Plant[];
    UnitOfMeasure: UnitType[];
    EmployeeDetails: EmployeeDetailsType[];
    MaterialType: MaterialType[];
    StorageLocation: StorageLocationType[];
    searchResults: SearchResult[];
    showSuggestions: boolean;
    handleMaterialSearch: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleMaterialSelect: (item: SearchResult) => void;
    setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
    selectedMaterialType: string;
    setSelectedMaterialType: React.Dispatch<React.SetStateAction<string>>;
    setMaterialCompanyCode: React.Dispatch<React.SetStateAction<string>>;
    materialCompanyCode: string;
    MaterialDetails: MaterialDetailsType;
    MaterialCode: string;
    MaterialCategory: MaterialCategoryType[];
    AllMaterialType: MaterialType[];
    setIsMaterialCodeEdited: React.Dispatch<React.SetStateAction<boolean>>;
    MaterialOnboardingDetails: MaterialOnboardingDetailsType;
    AllMaterialCodes: MaterialCode[];
    isMaterialCodeEdited: boolean;
    setShouldShowAllFields: React.Dispatch<React.SetStateAction<boolean>>;
    shouldShowAllFields: boolean;
    setIsMatchedMaterial: React.Dispatch<React.SetStateAction<boolean>>;
    isZCAPMaterial: boolean;
}

// === Component ===
const UserRequestForm: React.FC<UserRequestFormProps> = ({ form, role, companyName, plantcode, UnitOfMeasure, MaterialCategory, AllMaterialType, StorageLocation, AllMaterialCodes, MaterialDetails, MaterialOnboardingDetails, handleMaterialSearch, handleMaterialSelect, searchResults, showSuggestions, setShowSuggestions, selectedMaterialType, setSelectedMaterialType, setMaterialCompanyCode, materialCompanyCode, setIsMaterialCodeEdited, setShouldShowAllFields, shouldShowAllFields, setIsMatchedMaterial, isZCAPMaterial
}) => {
    const [filteredPlants, setFilteredPlants] = useState<Plant[]>([]);
    const [filteredMaterialType, setFilteredMaterialType] = useState<MaterialType[]>([]);
    const [filteredStorageLocations, setFilteredStorageLocations] = useState<StorageLocationType[]>([]);
    const [FilteredDivision, setFilteredDivisions] = useState<{ division_name: string }[]>([]);
    const [originalMaterialCodeRevisedState, setOriginalMaterialCodeRevisedState] = useState<string | null>(null);
    const [originalDescState, setOriginalDescState] = useState<string | null>(null);
    const [materialCodeSuggestions, setMaterialCodeSuggestions] = useState<MaterialCode[]>([]);
    const [showCodeSuggestions, setShowCodeSuggestions] = useState(false);
    const [divisionSearch, setDivisionSearch] = useState("");
    const [storageSearch, setStorageSearch] = useState("");

    const selectedPlantName = form.watch("plant_name");

    const getCodeFromDescription = (desc: string): string => {
        const match = AllMaterialCodes?.find(
            (code) => code.material_description?.trim().toLowerCase() === desc.trim().toLowerCase()
        );
        return match?.name || "";
    };

    useEffect(() => {
        if (!materialCompanyCode) return;

        setFilteredPlants(
            plantcode?.data?.filter((plant) => String(plant.company) === materialCompanyCode) || []
        );

        setFilteredMaterialType(
            AllMaterialType?.filter((group) =>
                group.multiple_company?.some((comp) => String(comp.company) === String(materialCompanyCode))
            ) || []
        );

        if (selectedPlantName && StorageLocation?.length) {
            const filtered = StorageLocation.filter(
                (storage) => String(storage.plant_code) === selectedPlantName
            );
            setFilteredStorageLocations(filtered);
        }
    }, [materialCompanyCode, selectedPlantName, plantcode, AllMaterialType, StorageLocation]);

    const filteredStorageOptions = storageSearch
        ? filteredStorageLocations?.filter((storage) =>
            storage.name?.toLowerCase().includes(storageSearch.toLowerCase())
        )
        : filteredStorageLocations;

    useEffect(() => {
        const item = MaterialDetails?.material_request_item;
        const storage = MaterialDetails?.material_master;
        if (!item) return;

        form.setValue("material_name_description", item.material_name_description || "");
        form.setValue("comment_by_user", item.comment_by_user || "");

        if (filteredPlants.length && item.plant_name) { form.setValue("plant_name", item.plant_name); }

        if (filteredMaterialType.length && item.material_type) {
            form.setValue("material_type", item.material_type);
            setSelectedMaterialType(item.material_type);
        }

        if (item.company_name) {
            setMaterialCompanyCode(item.company_name);
            form.setValue("material_company_code", item.company_name);
        }

        form.setValue("base_unit_of_measure", item.base_unit_of_measure || "");
        form.setValue("material_category", item.material_category || "");

        const materialDesc = item.material_name_description;
        let revisedCode = materialDesc ? getCodeFromDescription(materialDesc) : "";

        const approvalStatus = MaterialOnboardingDetails?.approval_status;
        if (approvalStatus && ["Sent to SAP", "Saved as Draft", "Re-Opened by CP"].includes(approvalStatus)) {
            revisedCode = storage?.material_code_revised || revisedCode;
        }

        form.setValue("material_code_revised", revisedCode || item.material_code_revised || "");

        setOriginalMaterialCodeRevisedState(revisedCode || item.material_code_revised || "");
        setOriginalDescState(materialDesc?.trim()?.toLowerCase() || "");

        if (storage) {
            form.setValue("storage_location", storage.storage_location || "");
            form.setValue("division", storage.division || "");
            form.setValue("old_material_code", storage.old_material_code || "");
        }
    }, [MaterialDetails, UnitOfMeasure, MaterialCategory, AllMaterialCodes, filteredPlants, filteredMaterialType]);

    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (
                (role === "CP" || role === "Store") && name === "material_name_description" && value.material_name_description && AllMaterialCodes?.length > 0
            ) {
                const revisedCode = getCodeFromDescription(value.material_name_description);
                form.setValue("material_code_revised", revisedCode);
            }
        });
        return () => subscription.unsubscribe();
    }, [form, role, AllMaterialCodes]);

    useEffect(() => {
        const selectedCompany = MaterialOnboardingDetails?.material_request?.[0]?.company_name;
        if (!selectedMaterialType || !AllMaterialType?.length || !selectedCompany) {
            setFilteredDivisions([]);
            return;
        }
        const filteredType = AllMaterialType.find((type) => {
            const isMatchingType = type.name === selectedMaterialType;
            const companyMatch = type.multiple_company?.some((comp) => String(comp.company) === String(selectedCompany));
            return isMatchingType && companyMatch;
        });

        if (!filteredType) {
            setFilteredDivisions([]);
            return;
        }
        const divisions = filteredType.valuation_and_profit?.filter((vp) => String(vp.company) === String(selectedCompany)).map((vp) => vp.division).filter(Boolean);

        const uniqueDivisions = [...new Set(divisions)].map((name) => ({ division_name: name, }));
        setFilteredDivisions(uniqueDivisions);
    }, [selectedMaterialType, AllMaterialType, MaterialOnboardingDetails]);

    const filteredDivisionOptions = divisionSearch ? FilteredDivision?.filter((division) => division.division_name?.toLowerCase().includes(divisionSearch.toLowerCase())) : FilteredDivision;

    console.log("Filtered Division Options:", FilteredDivision);

    useEffect(() => {
        if (!isZCAPMaterial || !FilteredDivision?.length) return;
        const commonDivision = FilteredDivision.find((div) => div.division_name?.toLowerCase().includes("co - common"));
        if (commonDivision) {
            form.setValue("division", commonDivision.division_name);
        }
    }, [isZCAPMaterial, FilteredDivision, form]);

    useEffect(() => {
        if (!originalMaterialCodeRevisedState || !originalDescState) return;
        const subscription = form.watch((value) => {
            const currentCode = value.material_code_revised?.trim() || "";
            const currentDesc = value.material_name_description?.trim().toLowerCase() || "";
            const originalCode = originalMaterialCodeRevisedState;
            const originalDesc = originalDescState;
            const isManualChange = currentCode !== originalCode || currentDesc !== originalDesc;
            const isNewRevisedCode = MaterialDetails?.material_request_item?.is_revised_code_new === 1;
            const existsInList = AllMaterialCodes?.some((code) => code.name === currentCode && code.material_description?.trim().toLowerCase() === currentDesc);
            const noRevisedCodeEntered = currentDesc && !currentCode;
            const isManualEntryDueToNoMatch = noRevisedCodeEntered && !existsInList;
            const shouldShow = isManualChange || isNewRevisedCode || !existsInList || isManualEntryDueToNoMatch;
            console.log("Current Code:", currentCode);
            console.log("Current Desc:", currentDesc);
            console.log("Exists In List:", existsInList);
            console.log("is_revised_code_new:", isNewRevisedCode);
            console.log("shouldShowAllFields:", shouldShow);
            console.log("Manual Change Detected:", isManualChange);
            console.log("Original Code:", originalCode);
            console.log("Original Desc:", originalDesc);
            setIsMatchedMaterial?.(existsInList);
            setIsMaterialCodeEdited(shouldShow);
            setShouldShowAllFields(shouldShow);
        });
        return () => subscription.unsubscribe();
    }, [form, AllMaterialCodes, originalMaterialCodeRevisedState, originalDescState]);

    useEffect(() => {
        if (originalMaterialCodeRevisedState !== null || originalDescState !== null) return;
        const subscription = form.watch((value) => {
            const currentCode = value.material_code_revised?.trim() || "";
            const currentDesc = value.material_name_description?.trim().toLowerCase() || "";
            const existsInList = AllMaterialCodes?.some((code) => code.name === currentCode && code.material_description?.trim().toLowerCase() === currentDesc);
            const noRevisedCodeEntered = currentDesc && !currentCode;
            const isManualEntryDueToNoMatch = noRevisedCodeEntered && !existsInList;
            const shouldShow = !existsInList || isManualEntryDueToNoMatch;
            console.log("NEW ENTRY MODE");
            console.log("Current Code:", currentCode);
            console.log("Current Desc:", currentDesc);
            console.log("Exists In List:", existsInList);
            console.log("shouldShowAllFields (new entry):", shouldShow);
            setIsMatchedMaterial?.(existsInList);
            setIsMaterialCodeEdited(shouldShow);
            setShouldShowAllFields(shouldShow);
        });
        return () => subscription.unsubscribe();
    }, [form, AllMaterialCodes, originalMaterialCodeRevisedState, originalDescState]);

    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            const code = value.material_code_revised?.trim();
            const desc = value.material_name_description?.trim().toLowerCase();
            // if (!code || !desc) return;
            const found = AllMaterialCodes?.find(item => item.name === code);
            if (!code) {
                form.clearErrors("material_code_revised");
                return;
            }
            if (found && found.material_description?.trim().toLowerCase() !== desc) {
                const actualDesc = found.material_description;
                // toast({
                //     title: "Material Code Exists for Different Material Description",
                //     description: `Code "${code}" belongs to "${actualDesc}"`,
                //     variant: "destructive",
                // });
                form.setError("material_code_revised", {
                    type: "manual",
                    message: `Material Code already exists for "${actualDesc}"`,
                });
            } else {
                form.clearErrors("material_code_revised");
            }
        });
        return () => subscription.unsubscribe();
    }, [form, AllMaterialCodes]);


    const showMaterialCodeStatuses = ["Pending by CP", "Sent to SAP", "Re-Opened by CP", "Code Generated by SAP"];
    const showMaterialCode = MaterialOnboardingDetails?.approval_status ? showMaterialCodeStatuses.includes(MaterialOnboardingDetails.approval_status) : false;

    return (
        <div className="bg-[#F4F4F6]">
            <div className="flex flex-col justify-between bg-white rounded-[8px]">
                <div className="space-y-1">
                    <div className="flex items-center justify-between text-[20px] font-semibold leading-[24px] text-[#03111F] border-b border-slate-500 pb-1">
                        <span>Basic Data</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {/* Company Code */}
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                rules={{ required: "Company Code is required." }}
                                name="material_company_code"
                                key="material_company_code"
                                readOnly
                                // render={({ field }) => (
                                render={({ field }: { field: ControllerRenderProps<FieldValues, "material_company_code"> }) => (
                                    <FormItem>
                                        <FormLabel>Company Code <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={(val) => {
                                                    console.log("Dropdown changed to", val);
                                                    field.onChange(val);
                                                    setMaterialCompanyCode(val);
                                                }}
                                                value={field.value || ""}
                                                disabled
                                            >
                                                <SelectTrigger className="p-3 w-full text-sm">
                                                    <SelectValue placeholder="Select Company Code" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {companyName?.data?.map((company) => (
                                                        <SelectItem key={company.company_code} value={company.company_code}>
                                                            {company.company_code} - {company.company_name}
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
                        {/* Plant Name */}
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                rules={{ required: "Plant Code is required." }}
                                name="plant_name"
                                key="plant_name"
                                render={({ field }: { field: ControllerRenderProps<FieldValues, "plant_name"> }) => (
                                    <FormItem>
                                        <FormLabel>Plant Code <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value || ""}
                                                disabled
                                            >
                                                <SelectTrigger className="p-3 w-full text-sm">
                                                    <SelectValue placeholder="Select Plant Code" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {filteredPlants?.map((plant) => (
                                                        <SelectItem key={plant.plant_name} value={plant.plant_name}>
                                                            {plant.plant_name}
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
                        {/* Material Category */}
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                rules={{ required: "Material Category is required." }}
                                name="material_category"
                                key="material_category"
                                render={({ field }: { field: ControllerRenderProps<FieldValues, "material_category"> }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Material Category <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value || ""}
                                                onValueChange={(value) => {
                                                    field.onChange(value);
                                                    setSelectedMaterialType(value);
                                                }}
                                            >
                                                <SelectTrigger className="w-full text-sm whitespace-nowrap placeholder:pl-1 placeholder:text-gray-400">
                                                    <SelectValue placeholder="Select Material Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {MaterialCategory?.map((materialcategory) => (
                                                        <SelectItem key={materialcategory.name} value={materialcategory.name}>
                                                            {materialcategory.description}
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
                        {/* Material Type */}
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                rules={{ required: "Material Type is required." }}
                                name="material_type"
                                key="material_type"
                                render={({ field }: { field: ControllerRenderProps<FieldValues, "material_type"> }) => (
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
                                                }}
                                            >
                                                <SelectTrigger className="w-full text-sm whitespace-nowrap placeholder:pl-1 placeholder:text-gray-400">
                                                    <SelectValue placeholder="Select Material Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {filteredMaterialType?.map((material) => (
                                                        <SelectItem key={material.name} value={material.name}>
                                                            {material.name}
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
                        {/* UOM */}
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                rules={{ required: "Base Unit of Measure is required." }}
                                name="base_unit_of_measure"
                                render={({ field }: { field: ControllerRenderProps<FieldValues, "material_category"> }) => (
                                    <FormItem>
                                        <FormLabel>Base Unit of Measure <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value || ""}
                                            >
                                                <SelectTrigger className="p-3 w-full text-sm">
                                                    <SelectValue placeholder="Select Unit of Measure" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {UnitOfMeasure?.map((unit) => (
                                                        <SelectItem key={unit.name} value={unit.name}>
                                                            {unit.name} - {unit.description}
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
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {/* Material Description */}
                        <div className="col-span-2 relative">
                            <FormField
                                control={form.control}
                                name="material_name_description"
                                key="material_name_description"
                                rules={{ required: "Material Name/Description is required." }}
                                render={({ field }: { field: ControllerRenderProps<FieldValues, "material_name_description"> }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">
                                            Material Name/Description <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <>
                                                <textarea
                                                    ref={field.ref}
                                                    value={field.value || ""}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        handleMaterialSearch(e);
                                                    }}
                                                    onFocus={() => {
                                                        if (searchResults.length) setShowSuggestions(true);
                                                    }}
                                                    onBlur={(e) => {
                                                        if (!e.relatedTarget || !e.relatedTarget.classList.contains("material-suggestion")) {
                                                            setTimeout(() => setShowSuggestions(false), 100);
                                                        }
                                                    }}
                                                    rows={1}
                                                    className="w-full p-[9px] text-sm text-gray-400 border border-gray-300 rounded-md placeholder:text-gray-700 hover:border-blue-400 focus:border-blue-400 focus:outline-none"
                                                    placeholder="Enter or Search Material Name/Description"
                                                />
                                                {showSuggestions && searchResults.length > 0 && (
                                                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-md w-full max-h-40 overflow-y-auto">
                                                        {searchResults.map((item, idx) => (
                                                            <div
                                                                key={idx}
                                                                tabIndex={-1}
                                                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm material-suggestion"
                                                                onClick={() => handleMaterialSelect(item)}
                                                            >
                                                                {item.material_name_description} - {item.material_code_revised}
                                                            </div>

                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {(showMaterialCode) && (
                            <>
                                {/* Material Code Revised  */}
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="material_code_revised"
                                        key="material_code_revised"
                                        render={({ field }: { field: ControllerRenderProps<FieldValues, "material_code_revised"> }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel className="font-bold">Material Code<span className="text-red-500">*</span></FormLabel>
                                                    <FormControl>
                                                        <>
                                                            <Input
                                                                {...field}
                                                                value={field.value || ""}
                                                                placeholder="Enter or Search Revised Material Code"
                                                                className="p-3 w-full text-sm text-gray-400 placeholder:text-gray-400"
                                                                onChange={(e) => {
                                                                    field.onChange(e);
                                                                    const value = e.target.value;
                                                                    const filtered = AllMaterialCodes?.filter(
                                                                        (item) =>
                                                                            item.name?.toLowerCase().includes(value.toLowerCase()) &&
                                                                            item.material_type === selectedMaterialType
                                                                    );
                                                                    setMaterialCodeSuggestions(filtered || []);
                                                                    setShowCodeSuggestions(true);
                                                                }}
                                                                onFocus={() => {
                                                                    if (materialCodeSuggestions?.length > 0) {
                                                                        setShowCodeSuggestions(true);
                                                                    }
                                                                }}
                                                                onBlur={(e) => {
                                                                    if (!e.relatedTarget || !e.relatedTarget.classList.contains("code-suggestion")) {
                                                                        setTimeout(() => setShowCodeSuggestions(false), 100);
                                                                    }
                                                                }}
                                                            />
                                                            {showCodeSuggestions && materialCodeSuggestions?.length > 0 && (
                                                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-md w-[31%] max-h-40 overflow-y-auto">
                                                                    {materialCodeSuggestions.map((item, idx) => (
                                                                        <div
                                                                            key={idx}
                                                                            tabIndex={-1}
                                                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm code-suggestion"
                                                                            onClick={() => {
                                                                                form.setValue("material_code_revised", item.name);
                                                                                setShowCodeSuggestions(false);
                                                                            }}
                                                                        >
                                                                            {item.name} - {item.material_description}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                </div>
                                {/* Material Specifications */}
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        key="material_specifications"
                                        name="material_specifications"
                                        render={({ field }: { field: ControllerRenderProps<FieldValues, "material_specifications"> }) => (
                                            <FormItem>
                                                <FormLabel>Material Specifications <span className="text-red-500">*</span></FormLabel>
                                                <FormControl>
                                                    <textarea
                                                        {...field}
                                                        rows={2}
                                                        className="w-full p-3 text-sm rounded-md placeholder:text-gray-400 border border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:outline-none"
                                                        placeholder="Enter Material Specifications"
                                                        readOnly
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {/* Comment by User */}
                                {!shouldShowAllFields && (
                                    <div className="space-y-2">
                                        <FormField
                                            control={form.control}
                                            name="comment_by_user"
                                            key="comment_by_user"
                                            rules={{ required: "Comment is required when material is selected." }}
                                            render={({ field }: { field: ControllerRenderProps<FieldValues, "comment_by_user"> }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        User Comment <span className="text-red-500">*</span>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <textarea
                                                            {...field}
                                                            rows={2}
                                                            className="w-full p-3 text-sm text-gray-700 border border-gray-300 rounded-md placeholder:text-gray-400 hover:border-blue-400 focus:border-blue-400 focus:outline-none"
                                                            placeholder="Provide a reason for selecting this material"
                                                            onChange={field.onChange}
                                                            value={field.value || ""}
                                                            readOnly
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                        {shouldShowAllFields && (role === "CP" || role === "Store") && (
                            <>
                                {/* Division */}
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="division"
                                        key="division"
                                        render={({ field }: { field: ControllerRenderProps<FieldValues, "division"> }) => (
                                            <FormItem>
                                                <FormLabel>Division <span className="text-red-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={(val) => {
                                                            field.onChange(val);
                                                            setDivisionSearch("");
                                                        }}
                                                        value={field.value || ""}
                                                        disabled={isZCAPMaterial}
                                                    >
                                                        <SelectTrigger className={`p-3 w-full text-sm data-[placeholder]:text-gray-600`}>
                                                            <SelectValue placeholder="Select Division" />
                                                        </SelectTrigger>
                                                        <SelectContent className="max-h-60 overflow-y-auto">
                                                            <div className="px-2 py-1">
                                                                <input
                                                                    type="text"
                                                                    value={divisionSearch}
                                                                    onChange={(e) => setDivisionSearch(e.target.value)}
                                                                    onKeyDown={(e) => {
                                                                        if (!["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) {
                                                                            e.stopPropagation();
                                                                        }
                                                                    }}
                                                                    placeholder="Search Division..."
                                                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                                                />
                                                            </div>
                                                            {filteredDivisionOptions?.length > 0 ? (
                                                                filteredDivisionOptions.map((division) => (
                                                                    <SelectItem
                                                                        key={division.division_name}
                                                                        value={division.division_name}
                                                                    >
                                                                        {division.division_name}
                                                                    </SelectItem>
                                                                ))
                                                            ) : (
                                                                <div className="px-3 py-2 text-sm text-gray-500">
                                                                    No matching divisions
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
                                {/* Storage Location */}
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="storage_location"
                                        key="storage_location"
                                        render={({ field }: { field: ControllerRenderProps<FieldValues, "storage_location"> }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Storage Location <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={(val) => {
                                                            field.onChange(val);
                                                            setStorageSearch("");
                                                        }}
                                                        value={field.value || ""}
                                                    >
                                                        <SelectTrigger className={`p-3 w-full text-sm data-[placeholder]:text-gray-600`}>
                                                            <SelectValue placeholder="Select Storage Location" />
                                                        </SelectTrigger>
                                                        <SelectContent className="max-h-60 overflow-y-auto">
                                                            <div className="px-2 py-1">
                                                                <input
                                                                    type="text"
                                                                    value={storageSearch}
                                                                    onChange={(e) => setStorageSearch(e.target.value)}
                                                                    onKeyDown={(e) => {
                                                                        if (!["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) {
                                                                            e.stopPropagation();
                                                                        }
                                                                    }}
                                                                    placeholder="Search Storage Location..."
                                                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                                                />
                                                            </div>
                                                            {filteredStorageOptions?.length > 0 ? (
                                                                filteredStorageOptions.map((storage) => (
                                                                    <SelectItem key={storage.name} value={storage.name}>
                                                                        {storage.name}
                                                                    </SelectItem>
                                                                ))
                                                            ) : (
                                                                <div className="px-3 py-2 text-sm text-gray-500">
                                                                    No storage locations found
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
                                {/* Old Material Code 
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="old_material_code"
                                        key="old_material_code"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Old Material Code</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            className="p-3 w-full text-sm text-black placeholder:text-gray-400"
                                                            placeholder="Enter Old Material Code"
                                                            onChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                </div> */}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserRequestForm;
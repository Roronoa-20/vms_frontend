"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { ControllerRenderProps, FieldValues, UseFormReturn } from "react-hook-form";
import { MaterialCode } from "@/src/types/PurchaseRequestType";
import { MaterialRegistrationFormData, EmployeeDetail, EmployeeAPIResponse, Company, Plant, division, industry, ClassType, UOMMaster, MRPType, ValuationClass, procurementType, ValuationCategory, MaterialGroupMaster, MaterialCategory, ProfitCenter, AvailabilityCheck, PriceControl, MRPController, StorageLocation, InspectionType, SerialNumber, LotSize, SchedulingMarginKey, ExpirationDate, MaterialType, MaterialRequestData } from "@/src/types/MaterialCodeRequestFormTypes";


interface UserRequestFormProps {
    form: UseFormReturn<any>;
    onSubmit?: (data: any) => void;
    companyName?: Company[];
    plantcode?: Plant[];
    UnitOfMeasure?: UOMMaster[];
    EmployeeDetails?: EmployeeDetail[];
    MaterialType?: MaterialType[];
    StorageLocation?: any[];
    searchResults?: MaterialCode[];
    showSuggestions?: boolean;
    handleMaterialSearch: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleMaterialSelect: (item: MaterialCode) => void;
    setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
    selectedMaterialType: string;
    setSelectedMaterialType: React.Dispatch<React.SetStateAction<string>>;
    setMaterialCompanyCode: React.Dispatch<React.SetStateAction<string>>;
    materialCompanyCode?: string;
    MaterialDetails?: MaterialRequestData;
    MaterialCode?: string;
    MaterialCategory?: MaterialCategory[];
    AllMaterialType?: MaterialType[];
    setIsMaterialCodeEdited: React.Dispatch<React.SetStateAction<boolean>>;
    MaterialOnboardingDetails?: MaterialRegistrationFormData;
    AllMaterialCodes: MaterialCode[];
    isMaterialCodeEdited?: boolean;
    setShouldShowAllFields: React.Dispatch<React.SetStateAction<boolean>>;
    setSearchResults: React.Dispatch<React.SetStateAction<MaterialCode[]>>;
    shouldShowAllFields: boolean;
    setIsMatchedMaterial: React.Dispatch<React.SetStateAction<boolean>>;
    isZCAPMaterial?: boolean;
    DivisionDetails?: division[];
    filteredStorage?: any[];
    materialSelectedFromList?: boolean;
    filteredDivision?: division[];
}

const UserRequestForm: React.FC<UserRequestFormProps> = ({ form, plantcode, AllMaterialType, StorageLocation, AllMaterialCodes, MaterialDetails, MaterialOnboardingDetails, handleMaterialSearch, handleMaterialSelect, searchResults = [], showSuggestions, setShowSuggestions, selectedMaterialType, setSelectedMaterialType, setMaterialCompanyCode, materialCompanyCode, setIsMaterialCodeEdited, setShouldShowAllFields, shouldShowAllFields, setIsMatchedMaterial, isZCAPMaterial }) => {

    const { designation } = useAuth();
    const role = designation || "";
    const [originalMaterialCode, setOriginalMaterialCode] = useState<string>("");
    const [originalDesc, setOriginalDesc] = useState<string>("");
    const [divisionSearch, setDivisionSearch] = useState("");
    const [storageSearch, setStorageSearch] = useState("");
    const [materialCodeSuggestions, setMaterialCodeSuggestions] = useState<MaterialCode[]>([]);
    const [showCodeSuggestions, setShowCodeSuggestions] = useState(false);

    // -------------------- MEMOIZED FILTERS --------------------
    const filteredPlants = useMemo(
        () => plantcode?.filter((p) => String(p.company) === materialCompanyCode) || [],
        [plantcode, materialCompanyCode]
    );

    const filteredMaterialTypes = useMemo(
        () =>
            AllMaterialType?.filter((t) =>
                t.multiple_company?.some((c) => String(c.company) === materialCompanyCode)
            ) || [],
        [AllMaterialType, materialCompanyCode]
    );

    const selectedPlantName = form.getValues("plant_name");
    const filteredStorageLocations = useMemo(
        () =>
            StorageLocation?.filter((s) => String(s.plant_code) === selectedPlantName) || [],
        [StorageLocation, selectedPlantName]
    );

    // -------------------- HELPER --------------------
    const getCodeFromDescription = (desc: string) =>
        AllMaterialCodes?.find(
            (code) => code.material_description?.trim().toLowerCase() === desc.trim().toLowerCase()
        )?.name || "";

    // -------------------- INITIALIZE FORM --------------------
    useEffect(() => {
        if (!MaterialDetails?.material_request_item) return;

        const item = MaterialDetails.material_request_item;
        const storage = MaterialDetails.material_master;
        const matspecs = MaterialDetails?.requestor_master?.material_request?.[0];

        if (matspecs) {
            form.setValue("material_specifications", matspecs.material_specifications || "");
        }


        const materialDesc = item.material_name_description || "";
        let revisedCode = getCodeFromDescription(materialDesc);

        const approvalStatus = MaterialOnboardingDetails?.approval_status;
        const shouldPrefill = ["Sent to SAP", "Re-Opened by CP", "Saved as Draft"].includes(approvalStatus);

        if (approvalStatus && shouldPrefill) {
            revisedCode = storage?.material_code_revised || revisedCode;
        }

        form.setValue("material_name_description", materialDesc);
        form.setValue("comment_by_user", item.comment_by_user || "");
        form.setValue("base_unit_of_measure", item.unit_of_measure || "");
        form.setValue("material_category", item.material_category || "");

        if (filteredPlants.length && item.plant) form.setValue("plant_name", item.plant);
        if (filteredMaterialTypes.length && item.material_type) {
            form.setValue("material_type", item.material_type);
            setSelectedMaterialType(item.material_type);
        }
        if (item.company_name) {
            setMaterialCompanyCode(item.company_name);
            form.setValue("material_company_code", item.company_name);
        }
        form.setValue("material_code_revised", revisedCode || item.material_code_revised || "");
        setOriginalMaterialCode(revisedCode || item.material_code_revised || "");
        setOriginalDesc(materialDesc.trim().toLowerCase());

        if (shouldPrefill && storage) {
            form.setValue("storage_location", storage.storage_location || "");
            form.setValue("division", storage.division || "");
            form.setValue("old_material_code", storage.old_material_code || "");
        }
    }, [MaterialDetails, filteredPlants, filteredMaterialTypes, MaterialOnboardingDetails, AllMaterialCodes, form, setMaterialCompanyCode, setSelectedMaterialType]);

    // -------------------- AUTO-UPDATE MATERIAL CODE --------------------
    useEffect(() => {
        if (!(role === "Material CP" || role === "Store")) return;

        const currentDesc = form.getValues("material_name_description")?.trim();
        const currentCode = form.getValues("material_code_revised") || "";
        if (!currentDesc) return;

        const revised = getCodeFromDescription(currentDesc);
        if (revised && revised !== currentCode) {
            form.setValue("material_code_revised", revised, { shouldValidate: true, shouldDirty: true });
        }
    }, [role, AllMaterialCodes, form]);

    // -------------------- CHECK MANUAL EDITS & VALIDATION --------------------
    const materialCode = form.watch("material_code_revised");
    const materialDesc = form.watch("material_name_description");
    useEffect(() => {
        const currentCode = materialCode?.trim() || "";
        const currentDesc = materialDesc?.trim().toLowerCase() || "";

        const isManualChange = currentCode !== originalMaterialCode || currentDesc !== originalDesc;
        const existsInList = AllMaterialCodes?.some(
            (c) => c.name === currentCode && c.material_description?.trim().toLowerCase() === currentDesc
        );

        const noRevisedCodeEntered = currentDesc && !currentCode;
        const shouldShowAll = isManualChange || !existsInList || noRevisedCodeEntered;

        setIsMatchedMaterial(existsInList);
        setIsMaterialCodeEdited(shouldShowAll);
        setShouldShowAllFields(shouldShowAll);

        if (currentCode) {
            const found = AllMaterialCodes.find((item) => item.name === currentCode);
            if (found && found.material_description?.trim().toLowerCase() !== currentDesc) {
                form.setError("material_code_revised", {
                    type: "manual",
                    message: `Material Code already exists for "${found.material_description}"`,
                });
            } else form.clearErrors("material_code_revised");
        } else form.clearErrors("material_code_revised");
    }, [materialCode, materialDesc, originalMaterialCode, originalDesc, AllMaterialCodes, setIsMatchedMaterial, setIsMaterialCodeEdited, setShouldShowAllFields]);

    // -------------------- FILTERED DIVISIONS --------------------
    const filteredDivisions = useMemo(() => {
        const selectedCompany = MaterialDetails?.material_request_item?.company_name?.trim();
        if (!MaterialDetails || !selectedMaterialType || !AllMaterialType?.length || !selectedCompany) return [];

        const matchedType = AllMaterialType.find(
            (type) =>
                type.name === selectedMaterialType &&
                type.multiple_company?.some((comp) => String(comp.company).trim() === selectedCompany)
        );
        if (!matchedType) return [];

        const divisions = matchedType.valuation_and_profit
            ?.filter((vp) => String(vp.company).trim() === selectedCompany)
            .map((vp) => vp.division)
            .filter(Boolean) || [];

        return [...new Set(divisions)].map((d) => ({ division_name: d }));
    }, [selectedMaterialType, MaterialDetails, AllMaterialType]);

    const filteredDivisionOptions = divisionSearch
        ? filteredDivisions.filter((d) => d.division_name?.toLowerCase().includes(divisionSearch.toLowerCase()))
        : filteredDivisions;

    const filteredStorageOptions = storageSearch
        ? filteredStorageLocations.filter((s) => s.name?.toLowerCase().includes(storageSearch.toLowerCase()))
        : filteredStorageLocations;

    const showMaterialCodeStatuses = ["Pending by CP", "Sent to SAP", "Re-Opened by CP", "Code Generated by SAP"];
    const showMaterialCode = MaterialOnboardingDetails?.approval_status ? showMaterialCodeStatuses.includes(MaterialOnboardingDetails.approval_status) : false;

    return (
        <div className="bg-[#F4F4F6]">
            <div className="flex flex-col justify-between bg-white rounded-[8px] pt-6">
                <div className="space-y-1">
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
                                            <div>
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
                                                                {item.material_description} - {item.material_code}
                                                            </div>

                                                        ))}
                                                    </div>
                                                )}
                                            </div>
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
                                                        <div className="relative">
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
                                                                <div className="absolute left-0 top-full mt-1 bg-white border border-gray-300 rounded-md shadow-md w-full max-h-40 overflow-y-auto z-50">
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
                                                        </div>
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
                        {shouldShowAllFields && (role === "Material CP" || role === "Store") && (
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
                                                                        value={division.division_name ?? ""}
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
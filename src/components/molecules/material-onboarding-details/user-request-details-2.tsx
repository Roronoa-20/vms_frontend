"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ControllerRenderProps, FieldValues, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { MaterialCode } from "@/src/types/PurchaseRequestType";
import { MaterialRegistrationFormData, Plant, MaterialType, UOMMaster, MaterialRequestData, division, MaterialCategory } from "@/src/types/MaterialCodeRequestFormTypes";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";


interface UserRequestFormProps {
    form: UseFormReturn<any>;
    plantcode?: Plant[];
    AllMaterialType?: MaterialType[];
    StorageLocation?: any[];
    AllMaterialCodes: MaterialCode[];
    MaterialDetails?: MaterialRequestData;
    MaterialOnboardingDetails?: MaterialRegistrationFormData;
    handleMaterialSearch: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleMaterialSelect: (item: MaterialCode) => void;
    searchResults?: MaterialCode[];
    showSuggestions?: boolean;
    setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
    selectedMaterialType: string;
    setSelectedMaterialType: React.Dispatch<React.SetStateAction<string>>;
    setMaterialCompanyCode: React.Dispatch<React.SetStateAction<string>>;
    materialCompanyCode?: string;
    setIsMaterialCodeEdited: React.Dispatch<React.SetStateAction<boolean>>;
    setShouldShowAllFields: React.Dispatch<React.SetStateAction<boolean>>;
    shouldShowAllFields: boolean;
    setSearchResults: React.Dispatch<React.SetStateAction<MaterialCode[]>>;
    setIsMatchedMaterial: React.Dispatch<React.SetStateAction<boolean>>;
    isZCAPMaterial?: boolean;
    DivisionDetails?: division[];
    filteredStorage?: any[];
    materialSelectedFromList?: boolean;
    filteredDivision?: division[];
    UnitOfMeasure?: UOMMaster[];
    MaterialCategory?: MaterialCategory[];
    materialCodeStatus: "idle" | "checking" | "exists" | "available";
    selectedCodeLogic: string;
    setSelectedCodeLogic: React.Dispatch<React.SetStateAction<string>>;
    latestCodeSuggestions: any[];
    setMaterialSelectedFromList: React.Dispatch<React.SetStateAction<boolean>>;
    setMaterialCodeAutoFetched: React.Dispatch<React.SetStateAction<boolean>>;
    materialCodeAutoFetched: boolean;
}

const UserRequestForm: React.FC<UserRequestFormProps> = ({ form, plantcode, AllMaterialType, StorageLocation, AllMaterialCodes, MaterialDetails, MaterialOnboardingDetails, handleMaterialSearch, handleMaterialSelect, searchResults = [], showSuggestions, setShowSuggestions, selectedMaterialType, setSelectedMaterialType, setMaterialCompanyCode, materialCompanyCode, setIsMaterialCodeEdited, setShouldShowAllFields, shouldShowAllFields, setIsMatchedMaterial, isZCAPMaterial, materialCodeStatus, selectedCodeLogic, setSelectedCodeLogic, latestCodeSuggestions, setMaterialSelectedFromList, materialSelectedFromList, setMaterialCodeAutoFetched, materialCodeAutoFetched }) => {

    console.log("latestCodeSuggestions--------->", selectedCodeLogic)

    const { designation } = useAuth();
    const role = designation || "";
    const isMaterialCP = designation === "Material CP";
    const [originalMaterialCode, setOriginalMaterialCode] = useState<string>("");
    const [originalDesc, setOriginalDesc] = useState<string>("");
    const [divisionSearch, setDivisionSearch] = useState("");
    const [storageSearch, setStorageSearch] = useState("");
    const [hideMaterialCode, setHideMaterialCode] = useState(false);

    const isRevisedNewCode = MaterialDetails?.material_request_item?.is_revised_code_new === 1 || MaterialDetails?.material_request_item?.is_revised_code_new === true;
    const isNewCodeFlow = isRevisedNewCode || Boolean(selectedCodeLogic);

    // watchers
    const materialCode = form.watch("material_code_revised");
    const materialDesc = (form.watch("material_name_description") || "").trim().toLowerCase();

    const selectedMaterialCategory = form.watch("material_category");

    const isZRND = selectedMaterialType === "ZRND - R&D Material";

    const shouldShowMaterialCode = !isZRND && (selectedMaterialCategory === "R" || selectedMaterialCategory === "P");

    // -------------------- MEMOIZED FILTERS (kept intact) --------------------
    const filteredPlants = useMemo(() => plantcode?.filter((p) => String(p.company) === materialCompanyCode) || [], [plantcode, materialCompanyCode]);

    const filteredMaterialTypes = useMemo(() => AllMaterialType?.filter((t) => t.multiple_company?.some((c) => String(c.company) === materialCompanyCode)) || [], [AllMaterialType, materialCompanyCode]);

    const selectedPlantName = form.getValues("plant_name");
    const filteredStorageLocations = useMemo(() => StorageLocation?.filter((s) => String(s.plant_code) === selectedPlantName) || [], [StorageLocation, selectedPlantName]);

    // -------------------- HELPER --------------------
    const getCodeFromDescription = (desc: string) => AllMaterialCodes?.find((code) => code.material_description?.trim().toLowerCase() === desc.trim().toLowerCase())?.name || "";

    // -------------------- INITIALIZE FORM --------------------
    useEffect(() => {
        if (!MaterialDetails?.material_request_item) return;

        const item = MaterialDetails.material_request_item;
        const storage = MaterialDetails.material_master;

        const materialDescValue = item.material_name_description || "";
        let revisedCode = getCodeFromDescription(materialDescValue);

        const approvalStatus = MaterialOnboardingDetails?.approval_status;
        const shouldPrefill = ["Sent to SAP", "Re-Opened by CP", "Saved as Draft"].includes(approvalStatus || "");

        if (shouldPrefill && storage) {
            revisedCode = storage?.material_code_revised || revisedCode;
        }

        form.setValue("material_name_description", materialDescValue);
        form.setValue("comment_by_user", item.comment_by_user || "");
        form.setValue("material_specifications", item.material_specifications || "");
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

        const initialCode = revisedCode || item.material_code_revised || "";
        form.setValue("material_code_revised", initialCode);
        setOriginalMaterialCode(initialCode);
        setOriginalDesc(materialDescValue.trim().toLowerCase());

        if (shouldPrefill && storage) {
            form.setValue("storage_location", storage.storage_location || "");
            form.setValue("division", storage.division || "");
            form.setValue("old_material_code", storage.old_material_code || "");
        }
    }, [MaterialDetails, filteredPlants, filteredMaterialTypes, MaterialOnboardingDetails, AllMaterialCodes, form, setMaterialCompanyCode, setSelectedMaterialType]);

    // -------------------- AUTO-UPDATE MATERIAL CODE FOR CP / STORE --------------------
    useEffect(() => {
        if (!(role === "Material CP" || role === "Store")) return;

        const currentDesc = (form.getValues("material_name_description") || "").trim();
        const currentCode = form.getValues("material_code_revised") || "";
        if (!currentDesc) return;

        const revised = getCodeFromDescription(currentDesc);
        if (revised && revised !== currentCode) {
            form.setValue("material_code_revised", revised, { shouldValidate: true, shouldDirty: true });
        }
    }, [role, AllMaterialCodes, form]);

    useEffect(() => {
        if (isNewCodeFlow) {
            setHideMaterialCode(true);
            setShouldShowAllFields(true);
        } else {
            setHideMaterialCode(false);
            setShouldShowAllFields(false);
        }
    }, [isNewCodeFlow]);

    // -------------------- MANUAL EDIT DETECTION & VALIDATION --------------------
    useEffect(() => {
        const currentCode = (materialCode || "").trim();
        const currentDesc = materialDesc;

        const isManualChange = currentCode !== originalMaterialCode || currentDesc !== originalDesc;
        const existsInList = AllMaterialCodes?.some(
            (c) => c.name === currentCode && c.material_description?.trim().toLowerCase() === currentDesc
        );

        const noRevisedCodeEntered = !!currentDesc && !currentCode;
        const shouldShowAll = isManualChange || !existsInList || noRevisedCodeEntered;

        setIsMatchedMaterial(existsInList);
        setIsMaterialCodeEdited(shouldShowAll);

        // Only set the global "shouldShowAllFields" from this logic when NOT in New Code flow.
        if (!hideMaterialCode) {
            setShouldShowAllFields(shouldShowAll);
        }

        if (currentCode) {
            const found = AllMaterialCodes.find((item) => item.name === currentCode);
            if (found && found.material_description?.trim().toLowerCase() !== currentDesc) {
                form.setError("material_code_revised", {
                    type: "manual",
                    message: `Material Code already exists for "${found.material_description}"`,
                });
            } else {
                form.clearErrors("material_code_revised");
            }
        } else {
            form.clearErrors("material_code_revised");
        }
    }, [materialCode, materialDesc, originalMaterialCode, originalDesc, AllMaterialCodes, setIsMatchedMaterial, setIsMaterialCodeEdited, setShouldShowAllFields, hideMaterialCode, form]);

    // Only show remaining fields (division/storage) when both: New Code clicked AND description changed from original.
    useEffect(() => {
        if (hideMaterialCode && materialDesc && materialDesc !== originalDesc) {
            setShouldShowAllFields(true);
        } else if (hideMaterialCode) {
            setShouldShowAllFields(false);
        }
        // if not hideMaterialCode, other effects manage shouldShowAllFields
    }, [hideMaterialCode, materialDesc, originalDesc, setShouldShowAllFields]);

    // -------------------- DIVISION FILTERING (kept intact) --------------------
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

    useEffect(() => {
        if (!selectedCodeLogic) return;

        form.setValue("material_code_revised", `${selectedCodeLogic}-`, {
            shouldDirty: false,
            shouldValidate: true,
        });
    }, [selectedCodeLogic]);

    useEffect(() => {
        if (selectedCodeLogic) return;

        if (!shouldShowMaterialCode || isNewCodeFlow) return;

        if (selectedMaterialCategory === "R") {
            form.setValue("material_code_revised", "R", {shouldDirty: false, shouldValidate: true});}

        if (selectedMaterialCategory === "P") {
            form.setValue("material_code_revised", "P", {shouldDirty: false, shouldValidate: true});}
    }, [selectedMaterialCategory, selectedCodeLogic, shouldShowMaterialCode, isNewCodeFlow]);


    useEffect(() => {
        if (!shouldShowMaterialCode) {
            form.clearErrors("material_code_revised");
        }
    }, [shouldShowMaterialCode]);



    return (
        <div className="bg-[#F4F4F6] overflow-hidden">
            <div className="flex flex-col justify-between bg-white rounded-[8px] pt-3 p-1">
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
                                                    disabled={!hideMaterialCode}
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
                                                    className="w-full p-[9px] text-sm text-gray-700 border border-gray-300 rounded-md placeholder:text-gray-400 hover:border-blue-400 focus:border-blue-400 focus:outline-none"
                                                    placeholder="Enter or Search Material Name/Description"
                                                />
                                                {!isRevisedNewCode && hideMaterialCode && (
                                                    <span className="text-xs text-blue-600 italic">
                                                        **change the material description to create new material code
                                                    </span>
                                                )}
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

                        {/* Right column: Material Code area + New Code toggle */}
                        <div className="space-y-2">
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
                                                                if (!isRevisedNewCode && !selectedCodeLogic) return;

                                                                if (materialSelectedFromList) {
                                                                    field.onChange(e);
                                                                    return;
                                                                }

                                                                let value = e.target.value;

                                                                const prefix =
                                                                    selectedCodeLogic
                                                                        ? `${selectedCodeLogic}-`
                                                                        : selectedMaterialCategory === "R"
                                                                            ? "R"
                                                                            : selectedMaterialCategory === "P"
                                                                                ? "P"
                                                                                : "";

                                                                if (prefix && !value.startsWith(prefix)) {
                                                                    value = prefix;
                                                                }

                                                                setMaterialCodeAutoFetched(false);
                                                                field.onChange({
                                                                    ...e,
                                                                    target: { ...e.target, value },
                                                                });
                                                            }}
                                                            disabled={materialCodeAutoFetched}
                                                        />
                                                    </FormControl>

                                                    {isRevisedNewCode && (
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
                                                    )}

                                                    {isRevisedNewCode && latestCodeSuggestions[0] && !materialSelectedFromList && (
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

                        </div>

                        {/* Material Specifications + User Comment side-by-side */}
                        <div className="col-span-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <FormField
                                        control={form.control}
                                        key="material_specifications"
                                        name="material_specifications"
                                        render={({ field }: { field: ControllerRenderProps<FieldValues, "material_specifications"> }) => (
                                            <FormItem>
                                                <FormLabel>Material Specifications</FormLabel>
                                                <FormControl>
                                                    <textarea
                                                        {...field}
                                                        rows={2}
                                                        className="w-full p-3 text-sm rounded-md placeholder:text-gray-400 border border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:outline-none"
                                                        placeholder="Enter Material Specifications"
                                                        value={field.value || ""}
                                                        readOnly={shouldShowAllFields}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div>
                                    {shouldShowAllFields && (
                                        <FormField
                                            control={form.control}
                                            name="comment_by_user"
                                            key="comment_by_user"
                                            rules={{ required: !shouldShowAllFields ? "Comment is required when material is selected." : false }}
                                            render={({ field }: { field: ControllerRenderProps<FieldValues, "comment_by_user"> }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        User Comment {!shouldShowAllFields && <span className="text-red-500">*</span>}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <textarea
                                                            {...field}
                                                            rows={2}
                                                            className="w-full p-3 text-sm text-gray-700 border border-gray-300 rounded-md placeholder:text-gray-400 hover:border-blue-400 focus:border-blue-400 focus:outline-none"
                                                            placeholder="Provide a reason for selecting this material"
                                                            onChange={field.onChange}
                                                            value={field.value || ""}
                                                            readOnly={shouldShowAllFields}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Remaining fields: show only when shouldShowAllFields is true AND user clicked New Code AND role is CP/Store */}
                        {shouldShowAllFields && hideMaterialCode && (role === "Material CP" || role === "Store") && (
                            <>
                                {/* Division */}
                                {/* {!isZCAPMaterial && ( */}
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
                                                        // disabled={isZCAPMaterial}
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
                                                                    <div className="px-3 py-2 text-sm text-gray-500">No matching divisions</div>
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                {/* )} */}

                                {/* Storage Location */}
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="storage_location"
                                        key="storage_location"
                                        render={({ field }: { field: ControllerRenderProps<FieldValues, "storage_location"> }) => (
                                            <FormItem>
                                                <FormLabel>Storage Location <span className="text-red-500">*</span></FormLabel>
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
                                                                <div className="px-3 py-2 text-sm text-gray-500">No storage locations found</div>
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserRequestForm;
"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/newselect";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ControllerRenderProps, FieldValues, UseFormReturn } from "react-hook-form";
import { MaterialCode } from "@/src/types/PurchaseRequestType";
import { MaterialRegistrationFormData, Plant, MaterialType, UOMMaster, MaterialRequestData, division, MaterialCategory, LatestCodeSuggestions } from "@/src/types/MaterialCodeRequestFormTypes";
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
    latestCodeSuggestions: LatestCodeSuggestions | null;
    setMaterialSelectedFromList: React.Dispatch<React.SetStateAction<boolean>>;
    setMaterialCodeAutoFetched: React.Dispatch<React.SetStateAction<boolean>>;
    materialCodeAutoFetched: boolean;
}


const UserRequestForm: React.FC<UserRequestFormProps> = ({ form, plantcode, AllMaterialType, StorageLocation, AllMaterialCodes, MaterialDetails, MaterialOnboardingDetails, handleMaterialSearch, handleMaterialSelect, searchResults = [], showSuggestions, setShowSuggestions, selectedMaterialType, setSelectedMaterialType, setMaterialCompanyCode, materialCompanyCode, setIsMaterialCodeEdited, setShouldShowAllFields, shouldShowAllFields, setIsMatchedMaterial, materialCodeStatus, selectedCodeLogic, latestCodeSuggestions, materialSelectedFromList, setMaterialCodeAutoFetched, materialCodeAutoFetched }) => {
    console.log("latestCodeSuggestions", latestCodeSuggestions);
    const { designation } = useAuth();
    const role = designation || "";
    const [originalMaterialCode, setOriginalMaterialCode] = useState<string>("");
    const [originalDesc, setOriginalDesc] = useState<string>("");
    const [divisionSearch, setDivisionSearch] = useState("");
    const [storageSearch, setStorageSearch] = useState("");

    // watchers
    const materialCode = form.watch("material_code_revised") ?? "";
    const materialDesc = form.watch("material_name_description") ?? "";;
    const normalizedDesc = useMemo(
        () => (materialDesc || "").trim().toLowerCase(),
        [materialDesc]
    );

    const selectedMaterialCategory = form.watch("material_category") ?? "";
    const revisedFlag = MaterialDetails?.material_request_item?.is_revised_code_new;

    const materialMode = useMemo(() => {
        if (revisedFlag === 1 || revisedFlag === true) return "NEW";
        if (revisedFlag === 0 || revisedFlag === false) return "EXISTING";
        return "UNKNOWN";
    }, [revisedFlag]);

    const isNewMaterial = materialMode === "NEW";
    const isExistingMaterial = materialMode === "EXISTING";

    const uiState = useMemo(() => {
        const isPrivilegedUser = role === "Material CP" || role === "Store";
        const isDescriptionChanged =
            normalizedDesc && normalizedDesc !== originalDesc;

        return {
            // show material code section
            showCodeInput: isNewMaterial || (isExistingMaterial && Boolean(selectedCodeLogic)),
            // show hint message
            showHint: isExistingMaterial && !selectedCodeLogic,
            // show division + storage
            showAdvancedFields: isPrivilegedUser && (isNewMaterial || (isExistingMaterial && isDescriptionChanged))
        };
    }, [role, isNewMaterial, isExistingMaterial, selectedCodeLogic, normalizedDesc, originalDesc]);

    const hasInitialized = React.useRef(false);

    const approvalStatus = MaterialOnboardingDetails?.approval_status?.trim();
    const isSAPGenerated = approvalStatus === "Code Generated by SAP";
    const isSentToSAP = approvalStatus === "Sent to SAP";
    const isCP = role === "Material CP";

    const isCodeDisabled = isSAPGenerated || (isSentToSAP && isCP);

    const isZRND = selectedMaterialType === "ZRND - R&D Material";

    const shouldShowMaterialCode = !isZRND && (selectedMaterialCategory === "R" || selectedMaterialCategory === "P");

    // -------------------- MEMOIZED FILTERS (kept intact) --------------------
    const filteredPlants = useMemo(() => plantcode?.filter((p) => String(p.company) === materialCompanyCode) || [], [plantcode, materialCompanyCode]);

    const filteredMaterialTypes = useMemo(() => AllMaterialType?.filter((t) => t.multiple_company?.some((c) => String(c.company) === materialCompanyCode)) || [], [AllMaterialType, materialCompanyCode]);

    const selectedPlantName = form.watch("plant_name");
    const filteredStorageLocations = useMemo(() => StorageLocation?.filter((s) => String(s.plant_code) === selectedPlantName) || [], [StorageLocation, selectedPlantName]);

    // -------------------- HELPER --------------------
    const getCodeFromDescription = useCallback((desc: string) => {
        return AllMaterialCodes?.find(
            (code) =>
                code.material_description?.trim().toLowerCase() ===
                desc.trim().toLowerCase()
        )?.name || "";
    }, [AllMaterialCodes]);

    const item = MaterialDetails?.material_request_item;

    const materialDescValue = item?.material_name_description || "";

    let revisedCode = "";

    if (isExistingMaterial) {
        revisedCode = item?.material_code_revised || "";
    } else if (isNewMaterial) {
        revisedCode = getCodeFromDescription(materialDescValue);
    }

    // useEffect(() => {
    //     if (!isSAPGenerated) return;

    //     const sapCode = MaterialOnboardingDetails?.material_code_revised || "";
    //     const sapDesc = MaterialOnboardingDetails?.material_name_description || "";

    //     if (!sapCode) return;

    //     form.setValue("material_code_revised", sapCode, { shouldDirty: false, shouldTouch: false, shouldValidate: true });
    //     form.setValue("material_name_description", MaterialOnboardingDetails?.material_name_description || "", { shouldDirty: false });
    //     form.setValue("material_specifications", MaterialOnboardingDetails?.material_specifications || "", { shouldDirty: false });
    //     setOriginalMaterialCode(sapCode);
    //     setOriginalDesc(sapDesc.trim().toLowerCase());
    //     form.clearErrors([
    //         "material_name_description",
    //         "material_specifications",
    //         "material_code_revised",
    //     ]);
    // }, [isSAPGenerated, MaterialOnboardingDetails, form]);

    // // -------------------- INITIALIZE FORM --------------------
    // useEffect(() => {
    //     if (isSAPGenerated) return;
    //     if (!MaterialDetails?.material_request_item) return;
    //     if (!MaterialDetails?.material_master) return;

    //     const item = MaterialDetails.material_request_item;
    //     const storage = MaterialDetails.material_master;

    //     const materialDescValue = item.material_name_description || "";
    //     let revisedCode = getCodeFromDescription(materialDescValue);

    //     const approvalStatus = MaterialOnboardingDetails?.approval_status;
    //     console.log("approvalStatus", MaterialOnboardingDetails);
    //     const isDraftStatus = approvalStatus === "Draft" || approvalStatus === "Saved as Draft";
    //     const shouldPrefill = ["Sent to SAP", "Re-Opened by CP", "Saved as Draft", "Draft"].includes(approvalStatus || "");

    //     if (isDraftStatus) {
    //         revisedCode = MaterialDetails?.material_master?.material_code_revised || MaterialDetails?.material_master?.material_code || revisedCode;
    //     } else if (shouldPrefill && storage) {
    //         revisedCode = storage?.material_code_revised || revisedCode;
    //     }

    //     form.setValue("material_name_description", materialDescValue);
    //     form.setValue("comment_by_user", item.comment_by_user || "");
    //     form.setValue("material_specifications", item.material_specifications || "");
    //     form.setValue("base_unit_of_measure", item.unit_of_measure || "");
    //     form.setValue("material_category", item.material_category || "");

    //     if (filteredPlants.length && item.plant) form.setValue("plant_name", item.plant);
    //     if (filteredMaterialTypes.length && item.material_type) {
    //         form.setValue("material_type", item.material_type);
    //         form.setValue("material_type_category", item.material_type_category || "");
    //         setSelectedMaterialType(item.material_type);
    //     }
    //     if (item.company_name) {
    //         setMaterialCompanyCode(item.company_name);
    //         form.setValue("material_company_code", item.company_name);
    //     }

    //     const initialCode = revisedCode || item.material_code_revised || "";
    //     const currentCode = form.getValues("material_code_revised");

    //     if (!currentCode || currentCode === initialCode) {
    //         form.setValue("material_code_revised", initialCode);
    //     }

    //     setOriginalMaterialCode(initialCode);
    //     setOriginalDesc(materialDescValue.trim().toLowerCase());


    // }, [MaterialDetails, filteredPlants, filteredMaterialTypes, MaterialOnboardingDetails, AllMaterialCodes, form, setMaterialCompanyCode, setSelectedMaterialType]);


    // -------------------- AUTO-UPDATE MATERIAL CODE FOR CP / STORE --------------------

    useEffect(() => {
        if (hasInitialized.current) return;

        if (isSAPGenerated && MaterialOnboardingDetails) {
            const sapCode = MaterialOnboardingDetails.material_code_revised || "";
            const sapDesc = MaterialOnboardingDetails.material_name_description || "";
            const sapSpec = MaterialOnboardingDetails.material_specifications || "";

            if (sapCode) form.setValue("material_code_revised", sapCode);
            if (sapDesc) form.setValue("material_name_description", sapDesc);
            if (sapSpec) form.setValue("material_specifications", sapSpec);

            hasInitialized.current = true;
            return;
        }

        if (MaterialDetails?.material_request_item && MaterialDetails?.material_master) {
            const item = MaterialDetails.material_request_item;
            const storage = MaterialDetails.material_master;

            const fields: any = {
                material_name_description: item.material_name_description || "",
                material_specifications: item.material_specifications || "",
                comment_by_user: item.comment_by_user || "",
                base_unit_of_measure: item.unit_of_measure || "",
                material_category: item.material_category || "",
                plant_name: item.plant || "",
                material_type: item.material_type || "",
                material_company_code: item.company_name || "",
                division: storage.division || "",
                storage_location: storage.storage_location || "",
                material_code_revised: item.material_code_revised || storage.material_code_revised || "",
            };

            Object.entries(fields).forEach(([key, value]) => {
                const currentValue = form.getValues(key as any);
                if (value !== undefined && value !== null && (currentValue === "" || currentValue === undefined || currentValue === null)) {
                    form.setValue(key as any, value);
                }
            });

            setMaterialCompanyCode(item.company_name || "");
            setSelectedMaterialType(item.material_type || "");

            hasInitialized.current = true;
        }
    }, [isSAPGenerated, MaterialOnboardingDetails, MaterialDetails, form, setMaterialCompanyCode, setSelectedMaterialType]);

    useEffect(() => {
        if (isSAPGenerated || isExistingMaterial) return;
        if (!(role === "Material CP" || role === "Store")) return;

        const currentDesc = (form.getValues("material_name_description") || "").trim();
        const currentCode = form.getValues("material_code_revised") || "";
        if (!currentDesc) return;

        const revised = getCodeFromDescription(currentDesc);
        if (!materialSelectedFromList && revised && revised !== currentCode) {
            if (currentCode && currentCode !== originalMaterialCode) return;
            form.setValue("material_code_revised", revised, { shouldValidate: true });
        }
    }, [role, AllMaterialCodes, form, materialSelectedFromList, isExistingMaterial, getCodeFromDescription, originalMaterialCode]);

    // -------------------- MANUAL EDIT DETECTION & VALIDATION --------------------
    useEffect(() => {
        if (isCodeDisabled) {
            form.clearErrors("material_code_revised");
            setIsMaterialCodeEdited(false);
            setIsMatchedMaterial(true);
            return;
        }
        const currentCode = (materialCode || "").trim();
        const currentDesc = normalizedDesc;

        const isManualChange = currentCode !== originalMaterialCode || (currentDesc !== originalDesc && !materialSelectedFromList);

        const existsInList = AllMaterialCodes?.some((c) => c.name === currentCode && c.material_description?.trim().toLowerCase() === currentDesc);

        // const noRevisedCodeEntered = !currentCode && currentDesc.length > 0;

        setIsMaterialCodeEdited(isManualChange);
        setIsMatchedMaterial(existsInList);

        if (!isCodeDisabled) {
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
    }, [materialCode, normalizedDesc, isSAPGenerated, originalMaterialCode, originalDesc, AllMaterialCodes, materialSelectedFromList]);

    // Only show remaining fields (division/storage) when both: New Code clicked AND description changed from original.
    useEffect(() => {
        if (isSAPGenerated) return;
        setShouldShowAllFields(uiState.showAdvancedFields);
    }, [uiState.showAdvancedFields, isSAPGenerated]);

    // -------------------- DIVISION FILTERING (kept intact) --------------------
    const filteredDivisions = useMemo(() => {
        const selectedCompany = form.watch("material_company_code") || MaterialDetails?.material_request_item?.company_name?.trim();
        if (!MaterialDetails || !selectedMaterialType || !AllMaterialType?.length || !selectedCompany) return [];

        const matchedType = AllMaterialType.find((type) =>
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

    const filteredDivisionOptions = divisionSearch ? filteredDivisions.filter((d) => d.division_name?.toLowerCase().includes(divisionSearch.toLowerCase())) : filteredDivisions;

    const filteredStorageOptions = storageSearch ? filteredStorageLocations.filter((s) => s.name?.toLowerCase().includes(storageSearch.toLowerCase())) : filteredStorageLocations;

    useEffect(() => {
        if (isSAPGenerated) return;
        if (!selectedCodeLogic) return;

        const existing = form.getValues("material_code_revised");
        if (existing) return;

        form.setValue("material_code_revised", `${selectedCodeLogic}-`, { shouldDirty: false, shouldValidate: true });
    }, [selectedCodeLogic, form, isSAPGenerated, MaterialDetails]);

    const ensureValueExists = (fieldName: string, options: any[], key: string) => {
        const current = form.getValues(fieldName);
        if (current && !options.find(o => o[key] === current)) {
            form.setValue(fieldName, current);
        }
    };

    useEffect(() => {
        ensureValueExists("division", filteredDivisionOptions, "division_name");
    }, [filteredDivisionOptions]);

    useEffect(() => {
        ensureValueExists("storage_location", filteredStorageOptions, "name");
    }, [filteredStorageOptions]);


    useEffect(() => {
        if (!isNewMaterial) return;
        if (isSAPGenerated) return;
        if (selectedCodeLogic) return;
        if (!shouldShowMaterialCode) return;

        const existingCode = form.getValues("material_code_revised") || "";

        if (!existingCode) {
            form.setValue("material_code_revised", selectedMaterialCategory, { shouldDirty: false, shouldValidate: true });
            return;
        }

        const stripped = existingCode.replace(/^(R|P)/, "");

        if (selectedMaterialCategory === "R") {
            form.setValue("material_code_revised", `R${stripped}`, { shouldDirty: false, shouldValidate: true });
        }

        if (selectedMaterialCategory === "P") {
            form.setValue("material_code_revised", `P${stripped}`, { shouldDirty: false, shouldValidate: true });
        }
    }, [selectedMaterialCategory, isNewMaterial, isSAPGenerated, selectedCodeLogic, shouldShowMaterialCode, form, MaterialDetails]);


    useEffect(() => {
        if (!shouldShowMaterialCode) {
            form.clearErrors("material_code_revised");
        }
    }, [shouldShowMaterialCode, form]);


    return (
        <div className="bg-gray-50">
            <div className="flex flex-col justify-between rounded-xl shadow-sm border border-slate-200 p-3 transition-all duration-300 mt-3">
                <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Material Description - 2 columns */}
                        <div className="col-span-1 md:col-span-2 relative space-y-1.5">
                            <FormField
                                control={form.control}
                                name="material_name_description"
                                key="material_name_description"
                                rules={{ required: "Material Name/Description is required." }}
                                render={({ field }: { field: ControllerRenderProps<FieldValues, "material_name_description"> }) => (
                                    <FormItem>
                                        <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">
                                            Material Name/Description <span className="text-red-500 ml-1">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <textarea
                                                    disabled={isSAPGenerated || !uiState.showCodeInput || isExistingMaterial}
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
                                                    className="w-full min-h-[36px] px-3 py-1.5 text-sm rounded-md bg-white border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-slate-700 placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed resize-none"
                                                    placeholder="Enter or Search description"
                                                />
                                                {showSuggestions && searchResults.length > 0 && (
                                                    <div className="absolute z-50 bg-white border border-slate-200 rounded-md shadow-lg w-full max-h-40 overflow-y-auto mt-1 py-1">
                                                        {searchResults.map((item, idx) => (
                                                            <div
                                                                key={idx}
                                                                tabIndex={-1}
                                                                className="px-3 py-1.5 hover:bg-slate-50 cursor-pointer text-sm material-suggestion text-slate-600 border-b border-slate-50 last:border-0"
                                                                onClick={() => handleMaterialSelect(item)}
                                                            >
                                                                {item.material_description} - {item.material_code || item.name}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Material Code - 2 columns */}
                        <div className="col-span-1 md:col-span-2 relative space-y-1.5">
                            <FormField
                                control={form.control}
                                name="material_code_revised"
                                render={({ field }: { field: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; ref: React.Ref<HTMLInputElement> } }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">Material Code <span className="text-red-500 ml-1">*</span><span className="text-[9px] ml-2 text-slate-400 lowercase tracking-normal">(Max 18)</span></FormLabel>
                                            <div className="relative">
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        className="w-full h-9 px-3 py-1 text-sm rounded-md bg-white border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-slate-700 placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
                                                        placeholder="Revised Material Code"
                                                        maxLength={18}
                                                        onChange={(e) => {
                                                            if (isExistingMaterial && !selectedCodeLogic) return;

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

                                                            if (prefix) {
                                                                const stripped = value.replace(/^([A-Z]+-|R|P)/gi, "")
                                                                value = prefix + stripped;
                                                            }
                                                            setMaterialCodeAutoFetched(false);
                                                            field.onChange({
                                                                ...e,
                                                                target: { ...e.target, value },
                                                            });
                                                        }}
                                                        disabled={isCodeDisabled || isExistingMaterial}
                                                    />
                                                </FormControl>

                                                {!isCodeDisabled && isNewMaterial && (
                                                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                                        {materialCodeStatus === "checking" && (
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
                                                        )}
                                                        {materialCodeStatus === "available" && (
                                                            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                                        )}
                                                        {materialCodeStatus === "exists" && (
                                                            <XCircle className="w-3.5 h-3.5 text-red-500" />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            {!isCodeDisabled && isNewMaterial && latestCodeSuggestions && !materialSelectedFromList && (
                                                <div className="mt-1">
                                                    {latestCodeSuggestions.next && (
                                                        <p className="text-[12px] text-green-600 font-bold">
                                                            Suggested: <span className="underline">{latestCodeSuggestions.next}</span>
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                            <FormMessage className="text-[12px]" />
                                        </FormItem>
                                    );
                                }}
                            />
                        </div>

                        {/* Material Specifications - 2 columns */}
                        <div className="col-span-1 md:col-span-2 space-y-1.5">
                            <FormField
                                control={form.control}
                                key="material_specifications"
                                name="material_specifications"
                                render={({ field }: { field: ControllerRenderProps<FieldValues, "material_specifications"> }) => (
                                    <FormItem>
                                        <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">Specifications</FormLabel>
                                        <FormControl>
                                            <textarea
                                                {...field}
                                                rows={2}
                                                className="w-full min-h-[60px] px-3 py-1.5 text-sm rounded-md bg-white border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-slate-700 placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed resize-none"
                                                placeholder="Enter Material Specifications"
                                                value={field.value || ""}
                                                readOnly={!shouldShowAllFields}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* User Comment - 2 columns */}
                        {shouldShowAllFields && (
                            <div className="col-span-1 md:col-span-2 space-y-1.5">
                                <FormField
                                    control={form.control}
                                    name="comment_by_user"
                                    key="comment_by_user"
                                    rules={{ required: !shouldShowAllFields ? "Comment is required when material is selected." : false }}
                                    render={({ field }: { field: ControllerRenderProps<FieldValues, "comment_by_user"> }) => (
                                        <FormItem>
                                            <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">
                                                User Comment {!shouldShowAllFields && <span className="text-red-500 ml-1">*</span>}
                                            </FormLabel>
                                            <FormControl>
                                                <textarea
                                                    {...field}
                                                    rows={2}
                                                    className="w-full min-h-[60px] px-3 py-1.5 text-sm rounded-md bg-white border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-slate-700 placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed resize-none"
                                                    placeholder="Provide a reason for selecting this material"
                                                    onChange={field.onChange}
                                                    value={field.value || ""}
                                                    readOnly={shouldShowAllFields}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-[10px]" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        {/* Advanced Fields - 4 columns container if visible */}
                        {(uiState.showAdvancedFields && (role === "Material CP" || role === "Store")) && (
                            <>
                                {/* Division */}
                                <div className="col-span-1 md:col-span-2 space-y-1.5">
                                    <FormField
                                        control={form.control}
                                        name="division"
                                        key="division"
                                        render={({ field }: { field: ControllerRenderProps<FieldValues, "division"> }) => (
                                            <FormItem>
                                                <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">Division <span className="text-red-500 ml-1">*</span></FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={(val) => {
                                                            field.onChange(val);
                                                            setDivisionSearch("");
                                                        }}
                                                        value={field.value || undefined}
                                                    >
                                                        <SelectTrigger className="w-full h-9 px-3 py-1 text-sm rounded-md bg-white border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-slate-700">
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
                                                                    placeholder="Search..."
                                                                    className="w-full h-8 p-2 border border-slate-200 rounded text-sm"
                                                                />
                                                            </div>
                                                            {filteredDivisionOptions?.length > 0 ? (
                                                                filteredDivisionOptions.map((division) => (
                                                                    <SelectItem
                                                                        key={division.division_name}
                                                                        value={division.division_name ?? ""}
                                                                        className="text-sm"
                                                                    >
                                                                        {division.division_name}
                                                                    </SelectItem>
                                                                ))
                                                            ) : (
                                                                <div className="px-3 py-2 text-sm text-slate-500">No records found</div>
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage className="text-[10px]" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Storage Location */}
                                <div className="col-span-1 md:col-span-2 space-y-1.5">
                                    <FormField
                                        control={form.control}
                                        name="storage_location"
                                        render={({ field }: { field: ControllerRenderProps<FieldValues, "storage_location"> }) => (
                                            <FormItem>
                                                <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">
                                                    Storage Location <span className="text-red-500 ml-1">*</span>
                                                </FormLabel>

                                                <FormControl>
                                                    <Select
                                                        required
                                                        value={field.value || undefined}
                                                        onValueChange={(value) => {
                                                            field.onChange(value);
                                                            setStorageSearch("");
                                                        }}
                                                    >
                                                        <SelectTrigger className="w-full h-9 px-3 py-1 text-sm rounded-md bg-white border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-slate-700">
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>

                                                        <SelectContent className="max-h-60 overflow-y-auto">
                                                            <div className="sticky top-0 bg-white px-2 py-1 z-10">
                                                                <input
                                                                    type="text"
                                                                    value={storageSearch}
                                                                    onChange={(e) => setStorageSearch(e.target.value)}
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
                                                                {filteredStorageOptions?.length ? (
                                                                    filteredStorageOptions.map((storage) => (
                                                                        <SelectItem
                                                                            key={storage.name}
                                                                            value={storage.name}
                                                                            className="text-sm"
                                                                        >
                                                                            {storage.name}
                                                                        </SelectItem>
                                                                    ))
                                                                ) : (
                                                                    <div className="px-3 py-2 text-sm text-slate-500">
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
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserRequestForm;
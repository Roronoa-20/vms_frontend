"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ControllerRenderProps, FieldValues, UseFormReturn } from "react-hook-form";
import { MaterialCode } from "@/src/types/PurchaseRequestType";
import { MaterialRegistrationFormData, EmployeeDetail, Company, Plant, division, MaterialType, StorageLocation, MaterialCategory, MaterialRequestData, UOMMaster } from "@/src/types/MaterialCodeRequestFormTypes";

interface UserRequestFormProps {
    form: UseFormReturn<any>;
    onSubmit?: (data: any) => void;
    companyName?: Company[]
    plantcode?: Plant[]
    UnitOfMeasure?: UOMMaster[]
    EmployeeDetails?: EmployeeDetail[]
    MaterialType?: MaterialType[]
    StorageLocation?: StorageLocation[]
    searchResults?: MaterialCode[]
    showSuggestions?: boolean
    handleMaterialSearch: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    handleMaterialSelect: (item: MaterialCode) => void
    setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>
    selectedMaterialType: string
    setSelectedMaterialType: React.Dispatch<React.SetStateAction<string>>
    setMaterialCompanyCode: React.Dispatch<React.SetStateAction<string>>
    materialCompanyCode?: string
    MaterialDetails?: MaterialRequestData
    MaterialCode?: string
    MaterialCategory?: MaterialCategory[]
    AllMaterialType?: MaterialType[]
    setIsMaterialCodeEdited: React.Dispatch<React.SetStateAction<boolean>>
    MaterialOnboardingDetails?: MaterialRegistrationFormData
    AllMaterialCodes: MaterialCode[]
    isMaterialCodeEdited?: boolean
    setShouldShowAllFields: React.Dispatch<React.SetStateAction<boolean>>
    setSearchResults: React.Dispatch<React.SetStateAction<MaterialCode[]>>
    shouldShowAllFields: boolean
    setIsMatchedMaterial: React.Dispatch<React.SetStateAction<boolean>>
    isZCAPMaterial?: boolean
    DivisionDetails?: division[]
    filteredStorage?: StorageLocation[]
    materialSelectedFromList?: boolean
    filteredDivision?: division[];
}

const UserRequestForm: React.FC<UserRequestFormProps> = ({ form, companyName, plantcode, UnitOfMeasure, MaterialCategory, AllMaterialType, StorageLocation, AllMaterialCodes, MaterialDetails, MaterialOnboardingDetails, setMaterialCompanyCode, setSelectedMaterialType, setIsMaterialCodeEdited, setShouldShowAllFields, setIsMatchedMaterial, materialCompanyCode }) => {

    const { designation } = useAuth();
    const role = designation || "";
    const [originalMaterialCode, setOriginalMaterialCode] = useState("");
    const [originalDesc, setOriginalDesc] = useState("");

    const filteredPlants = useMemo(
        () => plantcode?.filter(p => String(p.company) === materialCompanyCode) || [],
        [plantcode, materialCompanyCode]
    );

    const filteredMaterialType = useMemo(
        () =>
            AllMaterialType?.filter(t =>
                t.multiple_company?.some(c => String(c.company) === materialCompanyCode)
            ) || [],
        [AllMaterialType, materialCompanyCode]
    );

    const getCodeFromDescription = (desc: string) =>
        AllMaterialCodes?.find(
            c => c.material_description?.trim().toLowerCase() === desc.trim().toLowerCase()
        )?.name || "";

    useEffect(() => {
        if (!MaterialDetails?.material_request_item) return;

        const item = MaterialDetails.material_request_item;
        const storage = MaterialDetails.material_master;
        console.log("MaterialDetails item:", item);

        form.setValue("material_name_description", item.material_name_description || "");
        form.setValue("comment_by_user", item.comment_by_user || "");
        form.setValue("base_unit_of_measure", item.unit_of_measure || "");
        form.setValue("material_category", item.material_category || "");

        if (filteredPlants.length && item.plant) form.setValue("plant_name", item.plant);
        if (filteredMaterialType.length && item.material_type) {
            form.setValue("material_type", item.material_type);
            setSelectedMaterialType(item.material_type);
        }
        if (item.company_name) {
            setMaterialCompanyCode(item.company_name);
            form.setValue("material_company_code", item.company_name);
        }

        const revisedCode =
            MaterialOnboardingDetails?.approval_status &&
                ["Sent to SAP", "Saved as Draft", "Re-Opened by CP"].includes(
                    MaterialOnboardingDetails.approval_status
                )
                ? storage?.material_code_revised || getCodeFromDescription(item.material_name_description || "")
                : getCodeFromDescription(item.material_name_description || "");

        form.setValue("material_code_revised", revisedCode || item.material_code_revised || "");
        setOriginalMaterialCode(revisedCode || item.material_code_revised || "");
        setOriginalDesc(item.material_name_description?.trim()?.toLowerCase() || "");

        if (storage) {
            form.setValue("storage_location", storage.storage_location || "");
            form.setValue("division", storage.division || "");
            form.setValue("old_material_code", storage.old_material_code || "");
        }
    }, [MaterialDetails, filteredPlants, filteredMaterialType, MaterialOnboardingDetails, AllMaterialCodes, form, setMaterialCompanyCode, setSelectedMaterialType]);


    useEffect(() => {
        if (!(role === "Material CP" || role === "Store")) return;

        const desc = form.getValues("material_name_description")?.trim() || "";
        const currentCode = form.getValues("material_code_revised") || "";
        const revisedCode = getCodeFromDescription(desc);

        if (revisedCode && revisedCode !== currentCode) {
            form.setValue("material_code_revised", revisedCode, { shouldValidate: true });
        }
    }, [role, AllMaterialCodes, form]);

    useEffect(() => {
        const currentCode = form.getValues("material_code_revised")?.trim() || "";
        const currentDesc = form.getValues("material_name_description")?.trim().toLowerCase() || "";

        const isManualEdit = currentCode !== originalMaterialCode || currentDesc !== originalDesc;
        const existsInList = AllMaterialCodes.some(
            c => c.name === currentCode && c.material_description?.trim().toLowerCase() === currentDesc
        );

        const shouldShow = Boolean(isManualEdit || !existsInList || (currentDesc && !currentCode));

        setIsMatchedMaterial(prev => (prev !== existsInList ? existsInList : prev));
        setIsMaterialCodeEdited(prev => (prev !== shouldShow ? shouldShow : prev));
        setShouldShowAllFields(prev => (prev !== shouldShow ? shouldShow : prev));

        if (currentCode) {
            const found = AllMaterialCodes.find(c => c.name === currentCode);
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
    }, [AllMaterialCodes, form, originalMaterialCode, originalDesc, setIsMaterialCodeEdited, setShouldShowAllFields, setIsMatchedMaterial]);


    return (
        <div className="bg-[#F4F4F6]">
            <div className="flex flex-col justify-between bg-white rounded-[8px]">
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-[20px] font-semibold text-[#03111F] border-b border-slate-500 pb-1">
                        <span>Basic Data</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {/* Company Code */}
                        <FormField
                            control={form.control}
                            rules={{ required: "Company Code is required." }}
                            name="material_company_code"
                            render={({ field }: { field: ControllerRenderProps<FieldValues, "material_company_code"> }) => (
                                <FormItem>
                                    <FormLabel>Company Code <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Select onValueChange={val => { field.onChange(val); setMaterialCompanyCode(val); }} value={field.value || ""} disabled>
                                            <SelectTrigger className="p-3 w-full text-sm"><SelectValue placeholder="Select Company Code" /></SelectTrigger>
                                            <SelectContent>
                                                {companyName?.map(c => <SelectItem key={c.company_code} value={c.company_code}>{c.company_name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Plant Name */}
                        <FormField
                            control={form.control}
                            rules={{ required: "Plant Code is required." }}
                            name="plant_name"
                            render={({ field }: { field: ControllerRenderProps<FieldValues, "plant_name"> }) => (
                                <FormItem>
                                    <FormLabel>Plant Code <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value || ""} disabled>
                                            <SelectTrigger className="p-3 w-full text-sm"><SelectValue placeholder="Select Plant Code" /></SelectTrigger>
                                            <SelectContent>
                                                {filteredPlants?.map(p => <SelectItem key={p.plant_name} value={p.plant_name ?? ""}>{p.plant_name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Material Category */}
                        <FormField
                            control={form.control}
                            rules={{ required: "Material Category is required." }}
                            name="material_category"
                            render={({ field }: { field: ControllerRenderProps<FieldValues, "material_category"> }) => (
                                <FormItem>
                                    <FormLabel>Material Category <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Select value={field.value || ""} onValueChange={val => { field.onChange(val); setSelectedMaterialType(val); }} disabled>
                                            <SelectTrigger className="w-full text-sm"><SelectValue placeholder="Select Material Type" /></SelectTrigger>
                                            <SelectContent>
                                                {MaterialCategory?.map(m => <SelectItem key={m.name} value={m.name}>{m.description}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Material Type */}
                        <FormField
                            control={form.control}
                            rules={{ required: "Material Type is required." }}
                            name="material_type"
                            render={({ field }: { field: ControllerRenderProps<FieldValues, "material_type"> }) => (
                                <FormItem>
                                    <FormLabel>Material Type <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Select value={field.value || ""} onValueChange={val => { field.onChange(val); setSelectedMaterialType(val); }} disabled>
                                            <SelectTrigger className="w-full text-sm"><SelectValue placeholder="Select Material Type" /></SelectTrigger>
                                            <SelectContent>
                                                {filteredMaterialType?.map(m => <SelectItem key={m.name} value={m.name}>{m.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* UOM */}
                        <FormField
                            control={form.control}
                            rules={{ required: "Base Unit of Measure is required." }}
                            name="base_unit_of_measure"
                            render={({ field }: { field: ControllerRenderProps<FieldValues, "base_unit_of_measure"> }) => (
                                <FormItem>
                                    <FormLabel>Base Unit of Measure <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value || ""} disabled>
                                            <SelectTrigger className="p-3 w-full text-sm"><SelectValue placeholder="Select Unit of Measure" /></SelectTrigger>
                                            <SelectContent>
                                                {UnitOfMeasure?.map(u => <SelectItem key={u.name} value={u.name}>{u.name} - {u.description}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserRequestForm;


































































// import React, { useEffect, useState } from "react";
// import { useAuth } from "@/src/context/AuthContext";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
// import { ControllerRenderProps, FieldValues, UseFormReturn } from "react-hook-form";
// import { MaterialCode } from "@/src/types/PurchaseRequestType";
// import { MaterialRegistrationFormData, EmployeeDetail, EmployeeAPIResponse, Company, Plant, division, industry, ClassType, UOMMaster, MRPType, ValuationClass, procurementType, ValuationCategory, MaterialGroupMaster, MaterialCategory, ProfitCenter, AvailabilityCheck, PriceControl, MRPController, StorageLocation, InspectionType, SerialNumber, LotSize, SchedulingMarginKey, ExpirationDate, MaterialType, MaterialRequestData } from "@/src/types/MaterialCodeRequestFormTypes";


// interface UserRequestFormProps {
//     form: UseFormReturn<any>;
//     onSubmit?: (data: any) => void;
//     companyName?: Company[];
//     plantcode?: Plant[];
//     UnitOfMeasure?: UOMMaster[];
//     EmployeeDetails?: EmployeeDetail[];
//     MaterialType?: MaterialType[];
//     StorageLocation?: StorageLocation[];
//     searchResults?: MaterialCode[];
//     showSuggestions?: boolean;
//     handleMaterialSearch: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
//     handleMaterialSelect: (item: MaterialCode) => void;
//     setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
//     selectedMaterialType: string;
//     setSelectedMaterialType: React.Dispatch<React.SetStateAction<string>>;
//     setMaterialCompanyCode: React.Dispatch<React.SetStateAction<string>>;
//     materialCompanyCode?: string;
//     MaterialDetails?: MaterialRequestData;
//     MaterialCode?: string;
//     MaterialCategory?: MaterialCategory[];
//     AllMaterialType?: MaterialType[];
//     setIsMaterialCodeEdited: React.Dispatch<React.SetStateAction<boolean>>;
//     MaterialOnboardingDetails?: MaterialRegistrationFormData;
//     AllMaterialCodes: MaterialCode[];
//     isMaterialCodeEdited?: boolean;
//     setShouldShowAllFields: React.Dispatch<React.SetStateAction<boolean>>;
//     setSearchResults: React.Dispatch<React.SetStateAction<MaterialCode[]>>;
//     shouldShowAllFields: boolean;
//     setIsMatchedMaterial: React.Dispatch<React.SetStateAction<boolean>>;
//     isZCAPMaterial?: boolean;
//     DivisionDetails?: division[];
//     filteredStorage?: StorageLocation[];
//     materialSelectedFromList?: boolean;
//     filteredDivision?: division[];

// }

// // === Component ===
// const UserRequestForm: React.FC<UserRequestFormProps> = ({ form, companyName, plantcode, UnitOfMeasure, MaterialCategory, AllMaterialType, StorageLocation, AllMaterialCodes, MaterialDetails, MaterialOnboardingDetails, handleMaterialSearch, handleMaterialSelect, searchResults = [], showSuggestions, setShowSuggestions, selectedMaterialType, setSelectedMaterialType, setMaterialCompanyCode, materialCompanyCode, setIsMaterialCodeEdited, setShouldShowAllFields, shouldShowAllFields, setIsMatchedMaterial, isZCAPMaterial
// }) => {
//     console.log("All Material Type---->", AllMaterialType);
//     const [filteredPlants, setFilteredPlants] = useState<Plant[]>([]);
//     const [filteredMaterialType, setFilteredMaterialType] = useState<MaterialType[]>([]);
//     const [filteredStorageLocations, setFilteredStorageLocations] = useState<StorageLocation[]>([]);
//     const [FilteredDivision, setFilteredDivisions] = useState<division[]>([]);
//     const [originalMaterialCodeRevisedState, setOriginalMaterialCodeRevisedState] = useState<string | null>(null);
//     const [originalDescState, setOriginalDescState] = useState<string | null>(null);
//     const [materialCodeSuggestions, setMaterialCodeSuggestions] = useState<MaterialCode[]>([]);
//     const [showCodeSuggestions, setShowCodeSuggestions] = useState(false);
//     const [divisionSearch, setDivisionSearch] = useState("");
//     const [storageSearch, setStorageSearch] = useState("");
//     const { designation } = useAuth();
//     const role = designation || "";

//     const selectedPlantName = form.watch("plant_name");

//     const getCodeFromDescription = (desc: string): string => {
//         const match = AllMaterialCodes?.find(
//             (code) => code.material_description?.trim().toLowerCase() === desc.trim().toLowerCase()
//         );
//         return match?.name || "";
//     };

//     useEffect(() => {
//         if (!materialCompanyCode) return;

//         // Filter plants and material types based on selected company
//         setFilteredPlants(
//             plantcode?.filter((plant) => String(plant.company) === materialCompanyCode) || []
//         );

//         setFilteredMaterialType(
//             AllMaterialType?.filter((group) =>
//                 group.multiple_company?.some((comp) => String(comp.company) === materialCompanyCode)
//             ) || []
//         );

//         // Filter storage locations based on selected plant
//         if (selectedPlantName && StorageLocation?.length) {
//             const filtered = StorageLocation.filter(
//                 (storage) => String(storage.plant_code) === selectedPlantName
//             );
//             setFilteredStorageLocations(filtered);
//         }
//     }, [materialCompanyCode, selectedPlantName, plantcode, AllMaterialType, StorageLocation]);

//     const filteredStorageOptions = storageSearch
//         ? filteredStorageLocations?.filter((storage) =>
//             storage.name?.toLowerCase().includes(storageSearch.toLowerCase())
//         )
//         : filteredStorageLocations;

//     useEffect(() => {
//         if (!MaterialDetails) return;

//         const item = MaterialDetails.material_request_item;
//         const storage = MaterialDetails.material_master;

//         if (!item) return;

//         // Set form values safely
//         form.setValue("material_name_description", item.material_name_description || "");
//         form.setValue("comment_by_user", item.comment_by_user || "");
//         form.setValue("base_unit_of_measure", item.unit_of_measure || "");
//         form.setValue("material_category", item.material_category || "");

//         if (filteredPlants.length && item.plant) form.setValue("plant_name", item.plant);
//         if (filteredMaterialType.length && item.material_type) {
//             form.setValue("material_type", item.material_type);
//             setSelectedMaterialType(item.material_type);
//         }
//         if (item.company_name) {
//             setMaterialCompanyCode(item.company_name);
//             form.setValue("material_company_code", item.company_name);
//         }

//         // Determine revised code
//         const materialDesc = item.material_name_description;
//         let revisedCode = materialDesc ? getCodeFromDescription(materialDesc) : "";

//         const approvalStatus = MaterialOnboardingDetails?.approval_status;
//         if (approvalStatus && ["Sent to SAP", "Saved as Draft", "Re-Opened by CP"].includes(approvalStatus)) {
//             revisedCode = storage?.material_code_revised || revisedCode;
//         }

//         form.setValue("material_code_revised", revisedCode || item.material_code_revised || "");
//         setOriginalMaterialCodeRevisedState(revisedCode || item.material_code_revised || "");
//         setOriginalDescState(materialDesc?.trim()?.toLowerCase() || "");

//         if (storage) {
//             form.setValue("storage_location", storage.storage_location || "");
//             form.setValue("division", storage.division || "");
//             form.setValue("old_material_code", storage.old_material_code || "");
//         }
//     }, [MaterialDetails, filteredPlants, filteredMaterialType, MaterialOnboardingDetails, AllMaterialCodes]);

//     console.log("Selected Material Type--->", selectedMaterialType);

//     useEffect(() => {
//         const subscription = form.watch((value, { name }) => {
//             if (
//                 (role === "Material CP" || role === "Store") &&
//                 name === "material_name_description" &&
//                 value.material_name_description &&
//                 AllMaterialCodes?.length > 0
//             ) {
//                 const revisedCode = getCodeFromDescription(value.material_name_description);
//                 const current = form.getValues("material_code_revised");
//                 if (current !== revisedCode) {
//                     form.setValue("material_code_revised", revisedCode);
//                 }
//             }
//         });
//         return () => subscription.unsubscribe();
//     }, [form, role, AllMaterialCodes]);

//     useEffect(() => {
//         // Filter divisions based on selected material type and company
//         if (!MaterialDetails || !selectedMaterialType || !AllMaterialType?.length) return;

//         const selectedCompany = MaterialDetails?.material_request_item?.company_name?.trim();
//         const matchedType = AllMaterialType.find(
//             (type) =>
//                 type.name === selectedMaterialType &&
//                 type.multiple_company?.some((comp) => String(comp.company).trim() === selectedCompany)
//         );

//         if (!matchedType) {
//             setFilteredDivisions([]);
//             return;
//         }

//         const divisions = matchedType.valuation_and_profit
//             ?.filter((vp) => String(vp.company).trim() === selectedCompany)
//             .map((vp) => vp.division)
//             .filter(Boolean) || [];

//         const uniqueDivisions = [...new Set(divisions)].map((d) => ({ division_name: d }));
//         setFilteredDivisions(uniqueDivisions);
//     }, [selectedMaterialType, MaterialDetails, AllMaterialType]);

//     const filteredDivisionOptions = divisionSearch ? FilteredDivision?.filter((division) => division.division_name?.toLowerCase().includes(divisionSearch.toLowerCase())) : FilteredDivision;

//     console.log("Filtered Division Options:", FilteredDivision);

//     useEffect(() => {
//         // Auto-select common division for ZCAP materials
//         if (!isZCAPMaterial || !FilteredDivision?.length) return;
//         const commonDivision = FilteredDivision.find((div) => div.division_name?.toLowerCase().includes("co - common"));
//         if (commonDivision) {
//             form.setValue("division", commonDivision.division_name);
//         }
//     }, [isZCAPMaterial, FilteredDivision]);

//     useEffect(() => {
//         const subscription = form.watch((values) => {
//             const currentCode = values.material_code_revised?.trim() || "";
//             const currentDesc = values.material_name_description?.trim().toLowerCase() || "";

//             const originalCode = originalMaterialCodeRevisedState || "";
//             const originalDesc = originalDescState || "";

//             // Determine if fields changed manually
//             const isManualChange = currentCode !== originalCode || currentDesc !== originalDesc;
//             const isNewRevisedCode = MaterialDetails?.material_request_item?.is_revised_code_new === 1;

//             // Check existence in AllMaterialCodes
//             const existsInList = AllMaterialCodes?.some(
//                 (code) =>
//                     code.name === currentCode &&
//                     code.material_description?.trim().toLowerCase() === currentDesc
//             );

//             const noRevisedCodeEntered = currentDesc && !currentCode;
//             const isManualEntryDueToNoMatch = noRevisedCodeEntered && !existsInList;
//             const shouldShowAll = isManualChange || isNewRevisedCode || !existsInList || isManualEntryDueToNoMatch;

//             // Only update state if changed
//             setIsMatchedMaterial((prev) => (prev === existsInList ? prev : existsInList));
//             setIsMaterialCodeEdited((prev) => (prev === shouldShowAll ? prev : shouldShowAll));
//             setShouldShowAllFields((prev) => (prev === shouldShowAll ? prev : shouldShowAll));

//             // Auto-sync revised code for CP / Store roles
//             if ((role === "Material CP" || role === "Store") && currentDesc) {
//                 const revisedFromDesc = getCodeFromDescription(currentDesc).trim();
//                 if (revisedFromDesc && revisedFromDesc !== currentCode) {
//                     // Only setValue if different
//                     form.setValue("material_code_revised", revisedFromDesc, { shouldValidate: true, shouldDirty: true });
//                 }
//             }

//             // Validation: material code uniqueness
//             if (currentCode) {
//                 const found = AllMaterialCodes.find((item) => item.name === currentCode);
//                 if (found && found.material_description?.trim().toLowerCase() !== currentDesc) {
//                     form.setError("material_code_revised", {
//                         type: "manual",
//                         message: `Material Code already exists for "${found.material_description}"`,
//                     });
//                 } else {
//                     form.clearErrors("material_code_revised");
//                 }
//             } else {
//                 form.clearErrors("material_code_revised");
//             }
//         });

//         return () => subscription.unsubscribe();
//     }, [
//         form,
//         AllMaterialCodes,
//         originalMaterialCodeRevisedState,
//         originalDescState,
//         role,
//         MaterialDetails,
//     ]);


//     useEffect(() => {
//         const subscription = form.watch((value, { name }) => {
//             const code = value.material_code_revised?.trim();
//             const desc = value.material_name_description?.trim().toLowerCase();
//             // if (!code || !desc) return;
//             const found = AllMaterialCodes?.find(item => item.name === code);
//             if (!code) {
//                 form.clearErrors("material_code_revised");
//                 return;
//             }
//             if (found && found.material_description?.trim().toLowerCase() !== desc) {
//                 const actualDesc = found.material_description;
//                 form.setError("material_code_revised", {
//                     type: "manual",
//                     message: `Material Code already exists for "${actualDesc}"`,
//                 });
//             } else {
//                 form.clearErrors("material_code_revised");
//             }
//         });
//         return () => subscription.unsubscribe();
//     }, [form, AllMaterialCodes]);

//     return (
//         <div className="bg-[#F4F4F6]">
//             <div className="flex flex-col justify-between bg-white rounded-[8px]">
//                 <div className="space-y-1">
//                     <div className="flex items-center justify-between text-[20px] font-semibold leading-[24px] text-[#03111F] border-b border-slate-500 pb-1">
//                         <span>Basic Data</span>
//                     </div>
//                     <div className="grid grid-cols-3 gap-4">
//                         {/* Company Code */}
//                         <div className="space-y-2">
//                             <FormField
//                                 control={form.control}
//                                 rules={{ required: "Company Code is required." }}
//                                 name="material_company_code"
//                                 key="material_company_code"
//                                 readOnly
//                                 // render={({ field }) => (
//                                 render={({ field }: { field: ControllerRenderProps<FieldValues, "material_company_code"> }) => (
//                                     <FormItem>
//                                         <FormLabel>Company Code <span className="text-red-500">*</span></FormLabel>
//                                         <FormControl>
//                                             <Select
//                                                 onValueChange={(val) => {
//                                                     console.log("Dropdown changed to", val);
//                                                     field.onChange(val);
//                                                     setMaterialCompanyCode(val);
//                                                 }}
//                                                 value={field.value || ""}
//                                                 disabled
//                                             >
//                                                 <SelectTrigger className="p-3 w-full text-sm">
//                                                     <SelectValue placeholder="Select Company Code" />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     {companyName?.map((company) => (
//                                                         <SelectItem key={company.company_code} value={company.company_code}>
//                                                             {company.company_code} - {company.company_name}
//                                                         </SelectItem>
//                                                     ))}
//                                                 </SelectContent>
//                                             </Select>
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                         </div>
//                         {/* Plant Name */}
//                         <div className="space-y-2">
//                             <FormField
//                                 control={form.control}
//                                 rules={{ required: "Plant Code is required." }}
//                                 name="plant_name"
//                                 key="plant_name"
//                                 render={({ field }: { field: ControllerRenderProps<FieldValues, "plant_name"> }) => (
//                                     <FormItem>
//                                         <FormLabel>Plant Code <span className="text-red-500">*</span></FormLabel>
//                                         <FormControl>
//                                             <Select
//                                                 onValueChange={field.onChange}
//                                                 value={field.value || ""}
//                                                 disabled
//                                             >
//                                                 <SelectTrigger className="p-3 w-full text-sm">
//                                                     <SelectValue placeholder="Select Plant Code" />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     {filteredPlants?.map((plant) => (
//                                                         <SelectItem key={plant.plant_name ?? ''} value={plant.plant_name ?? ''}>
//                                                             {plant.plant_name ?? ''}
//                                                         </SelectItem>
//                                                     ))}
//                                                 </SelectContent>
//                                             </Select>
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                         </div>
//                         {/* Material Category */}
//                         <div className="space-y-2">
//                             <FormField
//                                 control={form.control}
//                                 rules={{ required: "Material Category is required." }}
//                                 name="material_category"
//                                 key="material_category"
//                                 render={({ field }: { field: ControllerRenderProps<FieldValues, "material_category"> }) => (
//                                     <FormItem>
//                                         <FormLabel>
//                                             Material Category <span className="text-red-500">*</span>
//                                         </FormLabel>
//                                         <FormControl>
//                                             <Select
//                                                 value={field.value || ""}
//                                                 onValueChange={(value) => {
//                                                     field.onChange(value);
//                                                     setSelectedMaterialType(value);
//                                                 }}
//                                             >
//                                                 <SelectTrigger className="w-full text-sm whitespace-nowrap placeholder:pl-1 placeholder:text-gray-400">
//                                                     <SelectValue placeholder="Select Material Type" />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     {MaterialCategory?.map((materialcategory) => (
//                                                         <SelectItem key={materialcategory.name} value={materialcategory.name}>
//                                                             {materialcategory.description}
//                                                         </SelectItem>
//                                                     ))}
//                                                 </SelectContent>
//                                             </Select>
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                         </div>
//                         {/* Material Type */}
//                         <div className="space-y-2">
//                             <FormField
//                                 control={form.control}
//                                 rules={{ required: "Material Type is required." }}
//                                 name="material_type"
//                                 key="material_type"
//                                 render={({ field }: { field: ControllerRenderProps<FieldValues, "material_type"> }) => (
//                                     <FormItem>
//                                         <FormLabel>
//                                             Material Type <span className="text-red-500">*</span>
//                                         </FormLabel>
//                                         <FormControl>
//                                             <Select
//                                                 value={field.value || ""}
//                                                 onValueChange={(value) => {
//                                                     field.onChange(value);
//                                                     setSelectedMaterialType(value);
//                                                 }}
//                                             >
//                                                 <SelectTrigger className="w-full text-sm whitespace-nowrap placeholder:pl-1 placeholder:text-gray-400">
//                                                     <SelectValue placeholder="Select Material Type" />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     {filteredMaterialType?.map((material) => (
//                                                         <SelectItem key={material.name} value={material.name}>
//                                                             {material.name}
//                                                         </SelectItem>
//                                                     ))}
//                                                 </SelectContent>
//                                             </Select>
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                         </div>
//                         {/* UOM */}
//                         <div className="space-y-2">
//                             <FormField
//                                 control={form.control}
//                                 rules={{ required: "Base Unit of Measure is required." }}
//                                 name="base_unit_of_measure"
//                                 render={({ field }: { field: ControllerRenderProps<FieldValues, "material_category"> }) => (
//                                     <FormItem>
//                                         <FormLabel>Base Unit of Measure <span className="text-red-500">*</span></FormLabel>
//                                         <FormControl>
//                                             <Select
//                                                 onValueChange={field.onChange}
//                                                 value={field.value || ""}
//                                             >
//                                                 <SelectTrigger className="p-3 w-full text-sm">
//                                                     <SelectValue placeholder="Select Unit of Measure" />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     {UnitOfMeasure?.map((unit) => (
//                                                         <SelectItem key={unit.name} value={unit.name}>
//                                                             {unit.name} - {unit.description}
//                                                         </SelectItem>
//                                                     ))}
//                                                 </SelectContent>
//                                             </Select>
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default UserRequestForm;
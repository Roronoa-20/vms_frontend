// "use client";

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


    console.log("Material Details---->", MaterialDetails)
    console.log("Material Onboarding---->", MaterialOnboardingDetails)

    const { designation } = useAuth();
    const role = designation || "";
    const [originalMaterialCode, setOriginalMaterialCode] = useState("");
    const [originalDesc, setOriginalDesc] = useState("");
    const [materialCategoryTypeOptions, setMaterialCategoryTypeOptions] = useState<{
        material_type_category: string; code_logic: string;
    }[]>([]);


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
        const materialType = form.getValues("material_type");
        if (!materialType || !AllMaterialType?.length) return;

        const matchedType = AllMaterialType.find(
            (t) => t.name === materialType
        );

        if (!matchedType?.material_code_logic?.length) {
            setMaterialCategoryTypeOptions([]);
            form.setValue("material_type_category", "");
            return;
        }

        // 1️⃣ Set dropdown options
        const transformedOptions = matchedType.material_code_logic.map(item => ({
            material_type_category: item.material_type_category,
            code_logic: item.code_logic
        }));
        setMaterialCategoryTypeOptions(transformedOptions);

        // 2️⃣ Auto-select first category (SAP-style default)
        form.setValue(
            "material_type_category",
            matchedType.material_code_logic[0].material_type_category,
            { shouldValidate: true }
        );

    }, [form.watch("material_type"), AllMaterialType]);

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
            <div className="flex flex-col justify-between bg-white rounded-[8px] p-1">
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
                                                {companyName?.map(c =>
                                                    <SelectItem key={c.name} value={c.name}>
                                                        {c.company_name}
                                                    </SelectItem>
                                                )}
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

                        <FormField
                            control={form.control}
                            name="material_type_category"
                            rules={{ required: "Material Type Category is required." }}
                            render={({ field }: { field: ControllerRenderProps<FieldValues, "material_type_category"> }) => (
                                <FormItem>
                                    <FormLabel>
                                        Material Type Category <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value || ""}
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                            }}
                                            disabled
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Material Category Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {materialCategoryTypeOptions.map((item) => (
                                                    <SelectItem
                                                        key={item.material_type_category}
                                                        value={item.material_type_category}
                                                    >
                                                        {item.material_type_category}
                                                    </SelectItem>
                                                ))}
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
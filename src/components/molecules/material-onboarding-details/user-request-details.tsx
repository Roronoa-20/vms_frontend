// "use client";

import React, { useEffect, useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ControllerRenderProps, FieldValues, UseFormReturn } from "react-hook-form";
import { MaterialCode } from "@/src/types/PurchaseRequestType";
import { MaterialRegistrationFormData, Company, Plant, division, MaterialType, StorageLocation, MaterialCategory, MaterialRequestData, UOMMaster } from "@/src/types/MaterialCodeRequestFormTypes";

interface UserRequestFormProps {
    form: UseFormReturn<any>;
    onSubmit?: (data: any) => void;
    companyName?: Company[]
    plantcode?: Plant[]
    UnitOfMeasure?: UOMMaster[]
    StorageLocation?: StorageLocation[]
    setSelectedMaterialType: React.Dispatch<React.SetStateAction<string>>
    setMaterialCompanyCode: React.Dispatch<React.SetStateAction<string>>
    materialCompanyCode?: string
    MaterialDetails?: MaterialRequestData
    MaterialCategory?: MaterialCategory[]
    AllMaterialType?: MaterialType[]
    MaterialOnboardingDetails?: MaterialRegistrationFormData
    AllMaterialCodes: MaterialCode[]
    filteredStorage?: StorageLocation[]
    filteredDivision?: division[];
}

const UserRequestForm: React.FC<UserRequestFormProps> = ({ form, companyName, plantcode, UnitOfMeasure, MaterialCategory, AllMaterialType, StorageLocation, AllMaterialCodes, MaterialDetails, MaterialOnboardingDetails, setMaterialCompanyCode, setSelectedMaterialType, materialCompanyCode }) => {

    const [materialCategoryTypeOptions, setMaterialCategoryTypeOptions] = useState<{ material_type_category: string; code_logic: string; }[]>([]);
    const filteredPlants = useMemo(() => plantcode?.filter(p => String(p.company) === materialCompanyCode) || [], [plantcode, materialCompanyCode]);
    const filteredMaterialType = useMemo(() => AllMaterialType?.filter(t => t.multiple_company?.some(c => String(c.company) === materialCompanyCode)) || [], [AllMaterialType, materialCompanyCode]);

    const materialType = form.watch("material_type");

    useEffect(() => {
        if (!materialType || !AllMaterialType?.length) return;

        const matchedType = AllMaterialType.find((t) => t.name === materialType);

        if (!matchedType?.material_code_logic?.length) {
            setMaterialCategoryTypeOptions([]);
            return;
        }

        setMaterialCategoryTypeOptions(matchedType.material_code_logic.map(item => ({
                material_type_category: item.material_type_category,
                code_logic: item.code_logic
            }))
        );
    }, [materialType, AllMaterialType]);

    useEffect(() => {
        if (!MaterialDetails?.material_request_item) return;
        if (!materialCategoryTypeOptions.length) return;

        const backendCategory = MaterialDetails.material_request_item.material_type_category;

        if (!backendCategory) {
            form.setValue("material_type_category", "", { shouldValidate: true });
            return;
        }

        const normalize = (v: string) => v.trim().toLowerCase();

        const matchedOption = materialCategoryTypeOptions.find(o =>
                normalize(o.material_type_category) ===
                normalize(backendCategory)
        );

        if (!matchedOption) {
            console.warn(
                "[Material Type Category mismatch]",
                "Backend:", backendCategory,
                "UI Options:", materialCategoryTypeOptions
            );

            form.setValue("material_type_category", "", { shouldValidate: true });
            return;
        }

        form.setValue("material_type_category", matchedOption.material_type_category, { shouldValidate: true });
    }, [MaterialDetails, materialCategoryTypeOptions, form]);


    useEffect(() => {
        if (!MaterialDetails?.material_request_item) return;

        const item = MaterialDetails.material_request_item;
        const storage = MaterialDetails.material_master;
        console.log("MaterialDetails item:", item);

        if (item.company_name) {
            setMaterialCompanyCode(item.company_name);
            form.setValue("material_company_code", item.company_name);
        }

        if (item.material_type) {
            form.setValue("material_type", item.material_type);
            setSelectedMaterialType(item.material_type);
        }

        form.setValue("comment_by_user", item.comment_by_user || "");
        form.setValue("base_unit_of_measure", item.unit_of_measure || "");
        form.setValue("material_category", item.material_category || "");

        if (filteredPlants.length && item.plant) form.setValue("plant_name", item.plant);

        if (storage) {
            form.setValue("storage_location", storage.storage_location || "");
            form.setValue("division", storage.division || "");
            form.setValue("old_material_code", storage.old_material_code || "");
        }
    }, [MaterialDetails, filteredPlants, filteredMaterialType, MaterialOnboardingDetails, AllMaterialCodes, form, setMaterialCompanyCode, setSelectedMaterialType]);

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
                                            key={materialCategoryTypeOptions.length}
                                            value={field.value || ""}
                                            onValueChange={(value) => { field.onChange(value); }}
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
// "use client";

import React, { useEffect, useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/newselect";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ControllerRenderProps, FieldValues, UseFormReturn } from "react-hook-form";
import { MaterialCode } from "@/src/types/PurchaseRequestType";
import { MaterialRegistrationFormData, Company, Plant, division, MaterialType, StorageLocation, MaterialCategory, MaterialRequestData, UOMMaster } from "@/src/types/MaterialCodeRequestFormTypes";
import { Info } from "lucide-react";

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
            if (!form.getValues("material_company_code")) {
                form.setValue("material_company_code", item.company_name);
            }
        }

        if (item.material_type) {
            if (!form.getValues("material_type")) {
                form.setValue("material_type", item.material_type);
            }
            setSelectedMaterialType(item.material_type);
        }

        if (!form.getValues("comment_by_user")) {
            form.setValue("comment_by_user", item.comment_by_user || "");
        }
        if (!form.getValues("base_unit_of_measure")) {
            form.setValue("base_unit_of_measure", item.unit_of_measure || "");
        }
        if (!form.getValues("material_category")) {
            form.setValue("material_category", item.material_category || "");
        }

        if (filteredPlants.length && item.plant && !form.getValues("plant_name")) {
            form.setValue("plant_name", item.plant);
        }

        if (storage) {
            if (!form.getValues("storage_location")) {
                form.setValue("storage_location", storage.storage_location || "");
            }
            if (!form.getValues("division")) {
                form.setValue("division", storage.division || "");
            }
            if (!form.getValues("old_material_code")) {
                form.setValue("old_material_code", storage.old_material_code || "");
            }
        }
    }, [MaterialDetails, filteredPlants, filteredMaterialType, MaterialOnboardingDetails, AllMaterialCodes, form, setMaterialCompanyCode, setSelectedMaterialType]);

    return (
        <div className="bg-gray-50">
            <div className="flex flex-col justify-between rounded-xl shadow-sm border border-slate-200 p-3 transition-all duration-300">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-800 border-b border-slate-200 pb-2 mb-2">
                        <Info className="w-4 h-4 text-[#0C72F5]" />
                        <span>Basic Data</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Company Code */}
                        <div className="space-y-1.5">
                            <FormField
                                control={form.control}
                                rules={{ required: "Company Code is required." }}
                                name="material_company_code"
                                render={({ field }: { field: ControllerRenderProps<FieldValues, "material_company_code"> }) => (
                                    <FormItem>
                                        <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">Company Code <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Select onValueChange={val => { field.onChange(val); setMaterialCompanyCode(val); }} value={field.value || ""} disabled>
                                                <SelectTrigger className="w-full h-9 px-3 py-1 text-sm rounded-md !bg-white !disabled:bg-white !opacity-100 !disabled:opacity-100 border border-slate-200 text-black font-medium cursor-not-allowed"><SelectValue placeholder="Select" /></SelectTrigger>
                                                <SelectContent>
                                                    {companyName?.map(c =>
                                                        <SelectItem key={c.name} value={c.name} className="text-sm">
                                                            {c.company_name}
                                                        </SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Plant Name */}
                        <div className="space-y-1.5">
                            <FormField
                                control={form.control}
                                rules={{ required: "Plant Code is required." }}
                                name="plant_name"
                                render={({ field }: { field: ControllerRenderProps<FieldValues, "plant_name"> }) => (
                                    <FormItem>
                                        <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">Plant Code <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value || ""} disabled>
                                                <SelectTrigger className="w-full h-9 px-3 py-1 text-sm rounded-md !bg-white !disabled:bg-white !opacity-100 !disabled:opacity-100 border border-slate-200 text-black font-medium cursor-not-allowed"><SelectValue placeholder="Select" /></SelectTrigger>
                                                <SelectContent>
                                                    {filteredPlants?.map(p => <SelectItem key={p.name} value={p.name ?? ""} className="text-sm">{p.plant_name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Material Category */}
                        <div className="space-y-1.5">
                            <FormField
                                control={form.control}
                                rules={{ required: "Material Category is required." }}
                                name="material_category"
                                render={({ field }: { field: ControllerRenderProps<FieldValues, "material_category"> }) => (
                                    <FormItem>
                                        <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">Material Category <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Select value={field.value || ""} onValueChange={val => { field.onChange(val); setSelectedMaterialType(val); }} disabled>
                                                <SelectTrigger className="w-full h-9 px-3 py-1 text-sm rounded-md !bg-white !disabled:bg-white !opacity-100 !disabled:opacity-100 border border-slate-200 text-black font-medium cursor-not-allowed"><SelectValue placeholder="Select" /></SelectTrigger>
                                                <SelectContent>
                                                    {MaterialCategory?.map(m => <SelectItem key={m.name} value={m.name} className="text-sm">{m.description}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Material Type */}
                        <div className="space-y-1.5">
                            <FormField
                                control={form.control}
                                rules={{ required: "Material Type is required." }}
                                name="material_type"
                                render={({ field }: { field: ControllerRenderProps<FieldValues, "material_type"> }) => (
                                    <FormItem>
                                        <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">Material Type <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Select value={field.value || ""} onValueChange={val => { field.onChange(val); setSelectedMaterialType(val); }} disabled>
                                                <SelectTrigger className="w-full h-9 px-3 py-1 text-sm rounded-md !bg-white !disabled:bg-white !opacity-100 !disabled:opacity-100 border border-slate-200 text-black font-medium cursor-not-allowed"><SelectValue placeholder="Select" /></SelectTrigger>
                                                <SelectContent>
                                                    {filteredMaterialType?.map(m => <SelectItem key={m.name} value={m.name} className="text-sm">{m.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <FormField
                                control={form.control}
                                name="material_type_category"
                                rules={{ required: "Material Type Category is required." }}
                                render={({ field }: { field: ControllerRenderProps<FieldValues, "material_type_category"> }) => (
                                    <FormItem>
                                        <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">
                                            Material Type Category <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                key={materialCategoryTypeOptions.length}
                                                value={field.value || ""}
                                                onValueChange={(value) => { field.onChange(value); }}
                                                disabled
                                            >
                                                <SelectTrigger className="w-full h-9 px-3 py-1 text-sm rounded-md !bg-white !disabled:bg-white !opacity-100 !disabled:opacity-100 border border-slate-200 text-black font-medium cursor-not-allowed">
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {materialCategoryTypeOptions.map((item) => (
                                                        <SelectItem
                                                            key={item.material_type_category}
                                                            value={item.material_type_category}
                                                            className="text-sm"
                                                        >
                                                            {item.material_type_category}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />
                        </div>


                        {/* UOM */}
                        <div className="space-y-1.5">
                            <FormField
                                control={form.control}
                                rules={{ required: "Base Unit of Measure is required." }}
                                name="base_unit_of_measure"
                                render={({ field }: { field: ControllerRenderProps<FieldValues, "base_unit_of_measure"> }) => (
                                    <FormItem>
                                        <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">Base UOM <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value || ""} disabled>
                                                <SelectTrigger className="w-full h-9 px-3 py-1 text-sm rounded-md !bg-white !disabled:bg-white !opacity-100 !disabled:opacity-100 border border-slate-200 text-black font-medium cursor-not-allowed"><SelectValue placeholder="Select" /></SelectTrigger>
                                                <SelectContent>
                                                    {UnitOfMeasure?.map(u => <SelectItem key={u.name} value={u.name} className="text-sm">{u.name} - {u.description}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserRequestForm;
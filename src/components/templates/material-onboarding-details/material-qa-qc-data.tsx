"use client";

import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/newselect";
import { Controller, ControllerRenderProps, FieldValues, UseFormReturn, useWatch } from "react-hook-form";
import { ExpirationDate, MaterialRequestData, MaterialType, InspectionType } from "@/src/types/MaterialCodeRequestFormTypes";
import { ShieldCheck } from "lucide-react";

interface MaterialOnboardingData {
    minimum_remaining_shell_life?: string;
    total_shell_life?: string;
    expiration_date?: string;
    inspection_require?: string;
    inspection_interval?: string;
    incoming_inspection_01?: boolean;
    incoming_inspection_09?: boolean;
}

interface MaterialQAQCFormProps {
    form: UseFormReturn<any>;
    InspectionType?: InspectionType[];
    AllMaterialType?: MaterialType[];
    ExpirationDate?: ExpirationDate[];
    MaterialDetails?: MaterialRequestData;
}

const MaterialQAQCForm: React.FC<MaterialQAQCFormProps> = ({ form, ExpirationDate, MaterialDetails }) => {

    const prevDataRef = React.useRef<string>("");
    const inspectionRequire = useWatch({ control: form.control, name: "inspection_require" });

    const expirationMemo = React.useMemo(() => ExpirationDate ?? [], [ExpirationDate]);

    useEffect(() => {
        const data = MaterialDetails?.material_onboarding;
        if (!data) return;

        const dataString = JSON.stringify(data);
        if (dataString === prevDataRef.current) return;
        prevDataRef.current = dataString;

        const fields: (keyof MaterialOnboardingData)[] = ["minimum_remaining_shell_life", "total_shell_life", "expiration_date", "inspection_require", "inspection_interval",
            "incoming_inspection_01", "incoming_inspection_09"];

        const currentValues = form.getValues();

        let didUpdate = false;
        for (const field of fields) {
            const incoming = (data as any)[field];
            const current = (currentValues as any)[field];

            if (incoming !== undefined && incoming !== null && (current === "" || current === undefined || current === null)) {
                form.setValue(field as any, incoming, {
                    shouldDirty: false,
                    shouldTouch: false,
                    shouldValidate: false,
                });
                didUpdate = true;
            }
        }

        if (!didUpdate) return;
    }, [MaterialDetails, form]);

    useEffect(() => {
        const currentValue = form.getValues("expiration_date");

        if (!currentValue) {
            form.setValue("expiration_date", "D", {
                shouldDirty: false,
                shouldTouch: false,
                shouldValidate: false,
            });
        }
    }, [form]);

    const makeOnValueChangeGuarded = (field: ControllerRenderProps<FieldValues, string>) => {
        return (val: string) => {
            if (val !== field.value) field.onChange(val);
        };
    };

    return (
        <div className="bg-gray-50">
            <div className="flex flex-col justify-between rounded-xl shadow-sm border border-slate-200 p-3 transition-all duration-300">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-800 border-b border-slate-200 pb-2 mb-2">
                        <ShieldCheck className="w-4 h-4 text-[#0C72F5]" />
                        <span>QA/QC Data</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Minimum Remaining Shelf Life */}
                        <div className="space-y-1.5">
                            <FormField
                                control={form.control}
                                name="minimum_remaining_shell_life"
                                key="minimum_remaining_shell_life"
                                render={({ field }: { field: ControllerRenderProps<FieldValues, "minimum_remaining_shell_life"> }) => (
                                    <FormItem>
                                        <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">Min. Remaining Life</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="w-full h-9 px-3 py-1 text-sm rounded-md bg-white border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-black"
                                                placeholder="Enter value"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Total Shelf Life */}
                        <div className="space-y-1.5">
                            <FormField
                                control={form.control}
                                name="total_shell_life"
                                render={({ field }: { field: ControllerRenderProps<FieldValues, "total_shell_life"> }) => (
                                    <FormItem>
                                        <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">Total Shell Life</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="w-full h-9 px-3 py-1 text-sm rounded-md bg-white border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-black"
                                                placeholder="Enter shell life"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Expiration Date */}
                        <div className="space-y-1.5">
                            <FormField
                                control={form.control}
                                name="expiration_date"
                                render={({ field }: { field: ControllerRenderProps<FieldValues, "expiration_date"> }) => (
                                    <FormItem>
                                        <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block leading-tight">Shelf Life Indicator</FormLabel>
                                        <FormControl>
                                            <Select value={field.value ?? undefined} onValueChange={(val) => {
                                                if (val !== field.value) field.onChange(val);
                                            }}
                                            >
                                                <SelectTrigger className="w-full h-9 px-3 py-1 text-sm rounded-md bg-white border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-black">
                                                    <SelectValue placeholder="Select indicator" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-60 overflow-y-auto">
                                                    {expirationMemo.map((exp) => (
                                                        <SelectItem key={exp.name} value={exp.name} className="text-sm">
                                                            {exp.description}
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

                        {/* Inspection Require */}
                        <div className="space-y-1.5">
                            <FormField
                                control={form.control}
                                name="inspection_require"
                                render={({ field }: { field: ControllerRenderProps<FieldValues, "inspection_require"> }) => (
                                    <FormItem>
                                        <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">Inspection Required</FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value ?? ""}
                                                onValueChange={makeOnValueChangeGuarded(field as any)}
                                            >
                                                <SelectTrigger className="w-full h-9 px-3 py-1 text-sm rounded-md bg-white border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-black">
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Yes" className="text-sm">Yes</SelectItem>
                                                    <SelectItem value="No" className="text-sm">No</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Conditionally Render QA Fields */}
                        {inspectionRequire === "Yes" && (
                            <>
                                <div className="space-y-1.5">
                                    <FormField
                                        control={form.control}
                                        name="inspection_interval"
                                        render={({ field }: { field: ControllerRenderProps<FieldValues, "inspection_interval"> }) => (
                                            <FormItem>
                                                <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">Interval (Days)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        className="w-full h-9 px-3 py-1 text-sm rounded-md bg-white border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-black"
                                                        placeholder="Enter days"
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-[10px]" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="space-y-1.5 col-span-1 md:col-span-2">
                                    <label className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">Inspection Protocols</label>
                                    <div className="flex items-center gap-6 h-9">
                                        <FormField
                                            control={form.control}
                                            name="incoming_inspection_01"
                                            render={({ field }: { field: ControllerRenderProps<FieldValues, "incoming_inspection_01"> }) => (
                                                <FormItem className="flex items-center gap-2 space-y-0">
                                                    <FormControl>
                                                        <input
                                                            type="checkbox"
                                                            className="w-4 h-4 rounded border-slate-300 text-[#0C72F5] focus:ring-[#0C72F5] transition-colors cursor-pointer"
                                                            checked={field.value === 1 || field.value === true}
                                                            onChange={(e) => field.onChange(e.target.checked ? 1 : 0)}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="text-sm font-medium text-slate-600 m-0 cursor-pointer">Incoming 01</FormLabel>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="incoming_inspection_09"
                                            render={({ field }: { field: ControllerRenderProps<FieldValues, "incoming_inspection_09"> }) => (
                                                <FormItem className="flex items-center gap-2 space-y-0">
                                                    <FormControl>
                                                        <input
                                                            type="checkbox"
                                                            className="w-4 h-4 rounded border-slate-300 text-[#0C72F5] focus:ring-[#0C72F5] transition-colors cursor-pointer"
                                                            checked={field.value === 1 || field.value === true}
                                                            onChange={(e) => field.onChange(e.target.checked ? 1 : 0)}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="text-sm font-medium text-slate-600 m-0 cursor-pointer">Incoming 09</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaterialQAQCForm;
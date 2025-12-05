"use client";

import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Controller, ControllerRenderProps, FieldValues, UseFormReturn, useWatch } from "react-hook-form";
import { ExpirationDate, MaterialRequestData, MaterialType, InspectionType } from "@/src/types/MaterialCodeRequestFormTypes";

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
    console.log("QA QC ExpirationDate Details---->", ExpirationDate)
    const prevDataRef = React.useRef<string>("");
    const inspectionRequire = useWatch({
        control: form.control,
        name: "inspection_require",
    });

    const expirationMemo = React.useMemo(() => ExpirationDate ?? [], [ExpirationDate]);

    useEffect(() => {
        const data = MaterialDetails?.material_onboarding;
        console.log("Data of MaterialOnbarding---->", data)
        if (!data) return;

        const dataString = JSON.stringify(data);
        if (dataString === prevDataRef.current) return;
        prevDataRef.current = dataString;

        const fields: (keyof MaterialOnboardingData)[] = [
            "minimum_remaining_shell_life",
            "total_shell_life",
            "expiration_date",
            "inspection_require",
            "inspection_interval",
            "incoming_inspection_01",
            "incoming_inspection_09",
        ];

        const currentValues = form.getValues();

        let didUpdate = false;
        for (const field of fields) {
            const incoming = (data as any)[field];
            const current = (currentValues as any)[field];

            if (incoming !== undefined && incoming !== null && incoming !== current) {
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

    const makeOnValueChangeGuarded = (field: ControllerRenderProps<FieldValues, string>) => {
        return (val: string) => {
            if (val !== field.value) field.onChange(val);
        };
    };

    return (
        <div className="bg-[#F4F4F6]">
            <div className="flex flex-col justify-between pt-4 pb-2 bg-white rounded-[8px]">
                <div className="space-y-1">
                    <div className="text-[20px] font-semibold leading-[24px] text-[#03111F] border-b border-slate-500 pb-1">
                        QA/QC Data
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {/* Minimum Remaining Shelf Life */}
                        <FormField
                            control={form.control}
                            name="minimum_remaining_shell_life"
                            key="minimum_remaining_shell_life"
                            render={({ field }: { field: ControllerRenderProps<FieldValues, "minimum_remaining_shell_life"> }) => (
                                <FormItem>
                                    <FormLabel>Minimum Remaining Shell Life</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="p-3 w-full text-sm placeholder:text-gray-400"
                                            placeholder="Enter minimum remaining shell life"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {/* Total Shelf Life */}
                        <FormField
                            control={form.control}
                            name="total_shell_life"
                            render={({ field }: { field: ControllerRenderProps<FieldValues, "total_shell_life"> }) => (
                                <FormItem>
                                    <FormLabel>Total Shelf Life</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="p-3 w-full text-sm placeholder:text-gray-400"
                                            placeholder="Enter total shelf life"
                                            onChange={(e) => field.onChange(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Expiration Date */}
                        <FormField
                            control={form.control}
                            name="expiration_date"
                            render={({ field }: { field: ControllerRenderProps<FieldValues, "expiration_date"> }) => (
                                <FormItem>
                                    <FormLabel>Period Indicator for Shelf Life Expiration Date</FormLabel>
                                    <FormControl>
                                        <Select value={field.value ?? undefined} onValueChange={(val) => {
                                            if (val !== field.value) field.onChange(val);
                                        }}
                                        >
                                            <SelectTrigger className="p-3 w-full text-sm data-[placeholder]:text-gray-500">
                                                <SelectValue placeholder="Select Expiration Date Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {expirationMemo.map((exp) => (
                                                    <SelectItem key={exp.name} value={exp.name}>
                                                        {exp.description}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Inspection Require - whole row */}
                        <div className="col-span-3 grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="inspection_require"
                                render={({ field }: { field: ControllerRenderProps<FieldValues, "inspection_require"> }) => (
                                    <FormItem>
                                        <FormLabel>Inspection Require</FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value ?? ""}
                                                onValueChange={makeOnValueChangeGuarded(field as any)}
                                            >
                                                <SelectTrigger className="p-3 w-full text-sm data-[placeholder]:text-gray-500">
                                                    <SelectValue placeholder="Select Yes or No" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Yes">Yes</SelectItem>
                                                    <SelectItem value="No">No</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Conditionally Render QA Fields */}
                            {inspectionRequire === "Yes" && (
                                <>
                                    <div className="grid grid-cols-2 gap-4 mt-[36.8px]">
                                        <FormField
                                            control={form.control}
                                            name="incoming_inspection_01"
                                            render={({ field }: { field: ControllerRenderProps<FieldValues, "incoming_inspection_01"> }) => (
                                                <FormItem>
                                                    <div className="flex items-center gap-2">
                                                        <FormControl>
                                                            <input
                                                                type="checkbox"
                                                                className="w-4 h-4 accent-blue-600"
                                                                checked={!!field.value}
                                                                onChange={(e) => field.onChange(e.target.checked)}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="text-[16px] m-0">Incoming Inspection 01</FormLabel>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="incoming_inspection_09"
                                            render={({ field }: { field: ControllerRenderProps<FieldValues, "incoming_inspection_09"> }) => (
                                                <FormItem>
                                                    <div className="flex items-center gap-2">
                                                        <FormControl>
                                                            <input
                                                                type="checkbox"
                                                                className="w-4 h-4 accent-blue-600"
                                                                checked={!!field.value}
                                                                onChange={(e) => field.onChange(e.target.checked)}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="text-[16px] m-0">Incoming Inspection 09</FormLabel>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="inspection_interval"
                                        render={({ field }: { field: ControllerRenderProps<FieldValues, "inspection_interval"> }) => (
                                            <FormItem>
                                                <FormLabel>Inspection Interval (In Days)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        className="p-3 w-full text-sm placeholder:text-gray-400"
                                                        placeholder="Enter Inspection interval in days"
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaterialQAQCForm;






// import React, { useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { ControllerRenderProps, FieldValues, UseFormReturn, useWatch } from "react-hook-form";
// import { MaterialRegistrationFormData, EmployeeDetail, Company, Plant, division, industry, ClassType, UOMMaster, MRPType, ValuationClass, procurementType, ValuationCategory, MaterialGroupMaster, MaterialCategory, ProfitCenter, AvailabilityCheck, PriceControl, MRPController, StorageLocation, InspectionType, SerialNumber, LotSize, SchedulingMarginKey, ExpirationDate, MaterialRequestData, MaterialType, MaterialMaster } from "@/src/types/MaterialCodeRequestFormTypes";

// interface MaterialOnboardingData {
//     minimum_remaining_shell_life?: string;
//     total_shell_life?: string;
//     expiration_date?: string;
//     inspection_require?: string;
//     inspection_interval?: string;
//     incoming_inspection_01?: boolean;
//     incoming_inspection_09?: boolean;
// }

// interface MaterialQAQCFormProps {
//     form: UseFormReturn<any>;
//     InspectionType?: InspectionType[];
//     AllMaterialType?: MaterialType[];
//     ExpirationDate?: ExpirationDate[];
//     MaterialDetails?: MaterialRequestData;
// }

// const MaterialQAQCForm: React.FC<MaterialQAQCFormProps> = ({ form, InspectionType, AllMaterialType, ExpirationDate, MaterialDetails }) => {
//     const prevDataRef = React.useRef<string>("");
//     const inspectionRequire = useWatch({
//         control: form.control,
//         name: "inspection_require",
//     });

//     useEffect(() => {
//         if (!form.getValues("inspection_require")) {
//             form.setValue("inspection_require", "No", { shouldDirty: false, shouldTouch: false });
//         }
//     }, []);

//     useEffect(() => {
//         const data = MaterialDetails?.material_onboarding;
//         if (!data) return;

//         const dataString = JSON.stringify(data);
//         if (dataString === prevDataRef.current) return;
//         prevDataRef.current = dataString;

//         const fields: (keyof MaterialOnboardingData)[] = [
//             "minimum_remaining_shell_life",
//             "total_shell_life",
//             "expiration_date",
//             "inspection_require",
//             "inspection_interval",
//             "incoming_inspection_01",
//             "incoming_inspection_09",
//         ];

//         const currentValues = form.getValues();
//         const newValues: Record<string, any> = {};

//         for (const field of fields) {
//             const newVal = data[field];
//             if (newVal !== undefined && newVal !== currentValues[field]) {
//                 newValues[field] = newVal;
//             }
//         }

//         // 🚫 Nothing changed → no reset
//         if (Object.keys(newValues).length === 0) return;

//         // ✅ Only update once
//         form.reset({ ...currentValues, ...newValues }, { keepDefaultValues: true });
//     }, [MaterialDetails, form]);


//     return (
//         <div className="bg-[#F4F4F6]">
//             <div className="flex flex-col justify-between pt-4 bg-white rounded-[8px]">
//                 <div className="space-y-1">
//                     <div className="text-[20px] font-semibold leading-[24px] text-[#03111F] border-b border-slate-500 pb-1">
//                         QA/QC Data
//                     </div>
//                     <div className="grid grid-cols-3 gap-4">
//                         {/* Minimum Remaining Shelf Life */}
//                         <FormField
//                             control={form.control}
//                             name="minimum_remaining_shell_life"
//                             key="minimum_remaining_shell_life"
//                             render={({ field }: { field: ControllerRenderProps<FieldValues, "minimum_remaining_shell_life"> }) => (
//                                 <FormItem>
//                                     <FormLabel>Minimum Remaining Shell Life</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             {...field}
//                                             className="p-3 w-full text-sm placeholder:text-gray-400"
//                                             placeholder="Enter minimum remaining shell life"
//                                             onChange={field.onChange}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         {/* Total Shelf Life */}
//                         <FormField
//                             control={form.control}
//                             name="total_shell_life"
//                             key="total_shell_life"
//                             render={({ field }: { field: ControllerRenderProps<FieldValues, "total_shell_life"> }) => (
//                                 <FormItem>
//                                     <FormLabel>Total Shelf Life</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             {...field}
//                                             className="p-3 w-full text-sm placeholder:text-gray-400"
//                                             placeholder="Enter total shelf life"
//                                             onChange={field.onChange}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         {/* Expiration Date */}
//                         <FormField
//                             control={form.control}
//                             name="expiration_date"
//                             key="expiration_date"
//                             render={({ field }: { field: ControllerRenderProps<FieldValues, "expiration_date"> }) => (
//                                 <FormItem>
//                                     <FormLabel>Period Indicator for Shelf Life Expiration Date</FormLabel>
//                                     <FormControl>
//                                         <Select
//                                             value={field.value ?? ""}
//                                             onValueChange={(val) => {
//                                                 if (val !== field.value) field.onChange(val);
//                                             }}
//                                         >
//                                             <SelectTrigger className="p-3 w-full text-sm data-[placeholder]:text-gray-500">
//                                                 <SelectValue placeholder="Select Expiration Date Type" />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 {ExpirationDate?.map((exp) => (
//                                                     <SelectItem key={exp.name} value={exp.name}>
//                                                         {exp.description}
//                                                     </SelectItem>
//                                                 ))}
//                                             </SelectContent>
//                                         </Select>
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         {/* Inspection Require */}
//                         <div className="col-span-3 grid grid-cols-3 gap-4">
//                             <FormField
//                                 control={form.control}
//                                 name="inspection_require"
//                                 key="inspection_require"
//                                 render={({ field }: { field: ControllerRenderProps<FieldValues, "inspection_require"> }) => (
//                                     <FormItem>
//                                         <FormLabel>Inspection Require</FormLabel>
//                                         <FormControl>
//                                             <Select
//                                                 value={field.value ?? ""}
//                                                 onValueChange={(val) => {
//                                                     if (val !== field.value) field.onChange(val);
//                                                 }}
//                                             >
//                                                 <SelectTrigger className="p-3 w-full text-sm data-[placeholder]:text-gray-500">
//                                                     <SelectValue placeholder="Select Yes or No" />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     <SelectItem value="Yes">Yes</SelectItem>
//                                                     <SelectItem value="No">No</SelectItem>
//                                                 </SelectContent>
//                                             </Select>
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />

//                             {/* Conditionally Render QA Fields */}
//                             {inspectionRequire === "Yes" && (
//                                 <>
//                                     <div className="grid grid-cols-2 gap-4 mt-[36.8px]">
//                                         <FormField
//                                             control={form.control}
//                                             name="incoming_inspection_01"
//                                             key="incoming_inspection_01"
//                                             render={({ field }: { field: ControllerRenderProps<FieldValues, "incoming_inspection_01"> }) => (
//                                                 <FormItem>
//                                                     <div className="flex items-center gap-2">
//                                                         <FormControl>
//                                                             <input
//                                                                 type="checkbox"
//                                                                 className="w-4 h-4 accent-blue-600"
//                                                                 checked={field.value || false}
//                                                                 onChange={(e) => field.onChange(e.target.checked)}
//                                                             />
//                                                         </FormControl>
//                                                         <FormLabel className="text-[16px] m-0">
//                                                             Incoming Inspection 01
//                                                         </FormLabel>
//                                                     </div>
//                                                 </FormItem>
//                                             )}
//                                         />

//                                         <FormField
//                                             control={form.control}
//                                             name="incoming_inspection_09"
//                                             key="incoming_inspection_09"
//                                             render={({ field }: { field: ControllerRenderProps<FieldValues, "incoming_inspection_09"> }) => (
//                                                 <FormItem>
//                                                     <div className="flex items-center gap-2">
//                                                         <FormControl>
//                                                             <input
//                                                                 type="checkbox"
//                                                                 className="w-4 h-4 accent-blue-600"
//                                                                 checked={field.value || false}
//                                                                 onChange={(e) => field.onChange(e.target.checked)}
//                                                             />
//                                                         </FormControl>
//                                                         <FormLabel className="text-[16px] m-0">
//                                                             Incoming Inspection 09
//                                                         </FormLabel>
//                                                     </div>
//                                                 </FormItem>
//                                             )}
//                                         />
//                                     </div>

//                                     {/* Inspection Interval */}
//                                     <FormField
//                                         control={form.control}
//                                         name="inspection_interval"
//                                         key="inspection_interval"
//                                         render={({ field }: { field: ControllerRenderProps<FieldValues, "inspection_interval"> }) => (
//                                             <FormItem>
//                                                 <FormLabel>Inspection Interval (In Days)</FormLabel>
//                                                 <FormControl>
//                                                     <Input
//                                                         {...field}
//                                                         type="number"
//                                                         className="p-3 w-full text-sm placeholder:text-gray-400"
//                                                         placeholder="Enter Inspection interval in days"
//                                                         onChange={field.onChange}
//                                                     />
//                                                 </FormControl>
//                                                 <FormMessage />
//                                             </FormItem>
//                                         )}
//                                     />
//                                 </>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MaterialQAQCForm;
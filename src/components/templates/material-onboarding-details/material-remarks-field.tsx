import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ControllerRenderProps, FieldValues, UseFormReturn } from "react-hook-form";
import { MaterialRequestData, MaterialOnboarding } from "@/src/types/MaterialCodeRequestFormTypes";
import { MessageSquare } from "lucide-react";

interface MaterialRemarksFormProps {
    form: UseFormReturn<any>;
    MaterialDetails?: MaterialRequestData;
}

const MaterialRemarksForm: React.FC<MaterialRemarksFormProps> = ({
    form,
    MaterialDetails,
}) => {
    useEffect(() => {
        const onboardingData = MaterialDetails?.material_onboarding;
        const requestItem = MaterialDetails?.material_request_item;

        if (onboardingData) {
            const fields: (keyof MaterialOnboarding)[] = ["comment_by_store"];

            fields.forEach((field) => {
                const currentValue = form.getValues(field);
                if (onboardingData[field] && (currentValue === "" || currentValue === undefined || currentValue === null)) {
                    form.setValue(field, onboardingData[field]);
                }
            });
        }

        const currentComment = form.getValues("comment_by_user");
        if (requestItem?.comment_by_user && (currentComment === "" || currentComment === undefined || currentComment === null)) {
            form.setValue("comment_by_user", requestItem.comment_by_user);
        }
    }, [MaterialDetails, form]);

    return (
        <div className="bg-gray-50">
            <div className="flex flex-col justify-between rounded-xl shadow-sm border border-slate-200 p-3 transition-all duration-300">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-800 border-b border-slate-200 pb-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-[#0C72F5]" />
                        <span>Comments</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* User Comment Field */}
                        <div className="space-y-1.5">
                            <FormField
                                control={form.control}
                                name="comment_by_user"
                                key="comment_by_user"
                                rules={{
                                    required:
                                        "Comment is required when material is selected.",
                                }}
                                render={({ field }: { field: ControllerRenderProps<FieldValues, "comment_by_user"> }) => (
                                    <FormItem>
                                        <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">
                                            User Comment
                                            <span className="text-red-500 ml-1">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <textarea
                                                {...field}
                                                rows={2}
                                                className="w-full px-3 py-2 text-sm rounded-md !bg-white !disabled:bg-white !opacity-100 !disabled:opacity-100 border border-slate-200 text-black font-medium cursor-not-allowed min-h-[60px]"
                                                placeholder="Provide a reason for selecting this material"
                                                readOnly
                                            />
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Store Comment Field */}
                        <div className="space-y-1.5">
                            <FormField
                                control={form.control}
                                name="comment_by_store"
                                key="comment_by_store"
                                rules={{
                                    required:
                                        "Store Comment is required when material is selected.",
                                }}
                                render={({ field }: { field: ControllerRenderProps<FieldValues, "comment_by_store"> }) => (
                                    <FormItem>
                                        <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">
                                            Store Comment
                                            <span className="text-red-500 ml-1">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <textarea
                                                {...field}
                                                rows={2}
                                                className="w-full px-3 py-2 text-sm rounded-md bg-white border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-black placeholder:text-slate-400 min-h-[60px]"
                                                placeholder="Provide a reason for selecting this material"
                                            />
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

export default MaterialRemarksForm;
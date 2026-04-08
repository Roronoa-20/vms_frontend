import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/newselect";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Pencil, ListChecks } from "lucide-react";
import { ControllerRenderProps, FieldValues, UseFormReturn } from "react-hook-form";
import { MaterialRequestData } from "@/src/types/MaterialCodeRequestFormTypes";

interface MaterialSpecificationsFormProps {
  form: UseFormReturn<any>;
  MaterialDetails?: MaterialRequestData;
  isZCAPMaterial: boolean;
}

const MaterialSpecificationsForm: React.FC<MaterialSpecificationsFormProps> = ({ form, MaterialDetails, isZCAPMaterial = false }) => {

  useEffect(() => {
    const data = MaterialDetails?.material_onboarding;
    const requestItem = MaterialDetails?.material_request_item;

    if (data) {
      const fields = [
        "storage_requirements",
        "intended_usage_application",
        "hazardous_material",
      ] as const;

      fields.forEach((field) => {
        const currentValue = form.getValues(field);
        if (data[field] && (currentValue === "" || currentValue === undefined || currentValue === null)) {
          form.setValue(field, data[field]);
        }
      });
    }

    const currentSpecs = form.getValues("material_specifications");
    if (requestItem?.material_specifications && (currentSpecs === "" || currentSpecs === undefined || currentSpecs === null)) {
      form.setValue("material_specifications", requestItem.material_specifications);
    }
  }, [MaterialDetails, form]);

  return (
    <div className="bg-gray-50">
      <div className="flex flex-col justify-between rounded-xl shadow-sm border border-slate-200 p-3 transition-all duration-300">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-800 border-b border-slate-200 pb-2 mb-2">
            <ListChecks className="w-4 h-4 text-[#0C72F5]" />
            <span>Characteristics & Specifications</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {!isZCAPMaterial && (
              <>
                {/* Storage Requirements */}
                <div className="col-span-1 md:col-span-2 lg:col-span-4 space-y-1.5">
                  <FormField
                    control={form.control}
                    name="storage_requirements"
                    key="storage_requirements"
                    render={({ field }: { field: ControllerRenderProps<FieldValues, "storage_requirements"> }) => (
                      <FormItem>
                        <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">Storage Requirements</FormLabel>
                        <FormControl>
                          <textarea
                            {...field}
                            rows={3}
                            placeholder="Enter storage requirements"
                            className="w-full px-3 py-2 text-sm rounded-md bg-white border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-black placeholder:text-slate-400 min-h-[80px]"
                            onChange={(e) => {
                              const formattedValue = e.target.value
                                .toLowerCase()
                                .replace(/\b\w/g, (char) => char.toUpperCase());
                              field.onChange(formattedValue);
                            }}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Intended Usage / Application */}
                <div className="col-span-1 md:col-span-2 lg:col-span-4 space-y-1.5">
                  <FormField
                    control={form.control}
                    name="intended_usage_application"
                    key="intended_usage_application"
                    render={({ field }: { field: ControllerRenderProps<FieldValues, "intended_usage_application"> }) => (
                      <FormItem>
                        <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">Intended Usage / Application</FormLabel>
                        <FormControl>
                          <textarea
                            {...field}
                            rows={3}
                            placeholder="Enter intended usage / application"
                            className="w-full px-3 py-2 text-sm rounded-md bg-white border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-black placeholder:text-slate-400 min-h-[80px]"
                            onChange={(e) => {
                              const formattedValue = e.target.value
                                .toLowerCase()
                                .replace(/\b\w/g, (char) => char.toUpperCase());
                              field.onChange(formattedValue);
                            }}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Hazardous Material */}
                <div className="space-y-1.5">
                  <FormField
                    control={form.control}
                    name="hazardous_material"
                    key="hazardous_material"
                    render={({ field }: { field: ControllerRenderProps<FieldValues, "hazardous_material"> }) => (
                      <FormItem>
                        <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">Hazardous Material (Y/N)</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialSpecificationsForm;

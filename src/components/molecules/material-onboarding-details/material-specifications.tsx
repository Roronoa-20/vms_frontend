import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Pencil } from "lucide-react";
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
        if (data[field]) {
          form.setValue(field, data[field]);
        }
      });
    }

    if (requestItem?.material_specifications) {
      form.setValue("material_specifications", requestItem.material_specifications);
    }
  }, [MaterialDetails, form]);

  return (
    <div className="bg-[#F4F4F6] overflow-hidden">
      <div className="flex flex-col justify-between pt-4 bg-white rounded-[8px] p-1">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[20px] font-semibold leading-[24px] text-[#03111F] border-b border-slate-500 pb-1">
            <span>Characteristics & Specifications</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {!isZCAPMaterial && (
              <>
                {/* Storage Requirements */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="storage_requirements"
                    key="storage_requirements"
                    render={({ field }: { field: ControllerRenderProps<FieldValues, "storage_requirements"> }) => (
                      <FormItem>
                        <FormLabel>Storage Requirements</FormLabel>
                        <FormControl>
                          <textarea
                            {...field}
                            rows={4}
                            placeholder="Enter storage requirements"
                            className="w-full p-3 text-sm rounded-md placeholder:text-gray-400 border border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:outline-none"
                            onChange={(e) => {
                              const formattedValue = e.target.value
                                .toLowerCase()
                                .replace(/\b\w/g, (char) => char.toUpperCase());
                              field.onChange(formattedValue);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Intended Usage / Application */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="intended_usage_application"
                    key="intended_usage_application"
                    render={({ field }: { field: ControllerRenderProps<FieldValues, "intended_usage_application"> }) => (
                      <FormItem>
                        <FormLabel>Intended Usage / Application</FormLabel>
                        <FormControl>
                          <textarea
                            {...field}
                            rows={4}
                            placeholder="Enter intended usage / application"
                            className="w-full p-3 text-sm rounded-md placeholder:text-gray-400 border border-gray-300 hover:border-blue-400 focus:border-blue-400 focus:outline-none"
                            onChange={(e) => {
                              const formattedValue = e.target.value
                                .toLowerCase()
                                .replace(/\b\w/g, (char) => char.toUpperCase());
                              field.onChange(formattedValue);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Hazardous Material */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="hazardous_material"
                    key="hazardous_material"
                    render={({ field }: { field: ControllerRenderProps<FieldValues, "hazardous_material"> }) => (
                      <FormItem>
                        <FormLabel>Hazardous Material (Y/N)</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full text-sm whitespace-nowrap rounded-md data-[placeholder]:text-gray-500">
                              <SelectValue placeholder="Select" />
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

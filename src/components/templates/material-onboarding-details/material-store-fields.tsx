import React, { useEffect, useState, useMemo, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/newselect";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MaterialRegistrationFormData, Company, Plant, ClassType, UOMMaster, MaterialGroupMaster, ProfitCenter, AvailabilityCheck, SerialNumber, MaterialType, MaterialRequestData } from "@/src/types/MaterialCodeRequestFormTypes";
import { ControllerRenderProps, FieldValues, UseFormReturn } from "react-hook-form";
import { Store } from "lucide-react";


interface MaterialStoreFieldsProps {
  form: any;
  onSubmit?: () => void;
  UserDetails?: any;
  role?: string;
  UnitOfMeasure?: UOMMaster[];
  MaterialGroup?: MaterialGroupMaster[];
  MaterialOnboardingDetails?: MaterialRegistrationFormData;
  companyInfo?: Company[];
  ProfitCenter?: ProfitCenter[];
  AvailabilityCheck?: AvailabilityCheck[];
  ClassType?: ClassType[];
  SerialProfile?: SerialNumber[];
  MaterialDetails?: MaterialRequestData;
  AllMaterialType?: MaterialType[];
  isZCAPMaterial?: boolean;
  materialCompanyCode?: string;
  setMaterialCompanyCode?: React.Dispatch<React.SetStateAction<string>>;
  MaterialType?: MaterialType[];
  plantcode?: Plant[];

}

const Storefields: React.FC<MaterialStoreFieldsProps> = ({ form, MaterialGroup, MaterialOnboardingDetails, companyInfo, AvailabilityCheck = [], ClassType = [], SerialProfile = [], MaterialDetails, isZCAPMaterial }) => {

  const [filteredMaterialGroup, setFilteredMaterialGroup] = useState<MaterialGroupMaster[]>([]);
  const [materialGroupSearch, setMaterialGroupSearch] = useState<string>("");

  useEffect(() => {
    setFilteredMaterialGroup(MaterialGroup || []);
  }, [MaterialGroup?.length]);


  const materialGroupOptions = useMemo(() => {
    if (!materialGroupSearch) return filteredMaterialGroup;
    return filteredMaterialGroup.filter((group) =>
      `${group.name} - ${group.material_group_description}`
        .toLowerCase()
        .includes(materialGroupSearch.toLowerCase())
    );
  }, [filteredMaterialGroup, materialGroupSearch]);

  useEffect(() => {
    const data = MaterialDetails?.material_master;
    if (!data || !filteredMaterialGroup.length) return;

    const fields = ["material_group", "batch_requirements_yn", "brand_make", "availability_check", "class_type", "class_number", "serial_number_profile", "serialization_level"] as const;

    fields.forEach((field) => {
      const currentValue = form.getValues(field);

      if (!currentValue && data[field]) {
        form.setValue(field, data[field], {
          shouldValidate: false,
          shouldDirty: false,
        });
      }
    });

  }, [MaterialDetails?.material_master, filteredMaterialGroup]);

  const batchRequirement = form.watch("batch_requirements_yn");
  const classTypeSelected = form.watch("class_type");
  const serialNumberProfile = form.watch("serial_number_profile");
  const materialCategory = form.watch("material_category");

  useEffect(() => {
    if (batchRequirement === "No") {
      form.setValue("class_type", "");
      form.setValue("class_number", "");
    }
  }, [batchRequirement, form]);

  useEffect(() => {
    if (classTypeSelected && ClassType?.length > 0) {
      const selectedClass = ClassType.find(
        (item) => item.name === classTypeSelected
      );
      if (selectedClass?.class_number) {
        form.setValue("class_number", selectedClass.class_number);
      } else {
        form.setValue("class_number", "");
      }
    }

    if (serialNumberProfile && SerialProfile?.length > 0) {
      const selectedSerial = SerialProfile.find(
        (item) => item.name === serialNumberProfile
      );

      if (selectedSerial?.serialization_level) {
        form.setValue("serialization_level", selectedSerial.serialization_level);
      } else {
        form.setValue("serialization_level", "");
      }
    }
  }, [classTypeSelected, ClassType, form, serialNumberProfile, SerialProfile]);

  return (
    <div className="bg-gray-50">
      <div className="flex flex-col justify-between rounded-xl shadow-sm border border-slate-200 p-3 transition-all duration-300">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-800 border-b border-slate-200 pb-2 mb-2">
            <Store className="w-4 h-4 text-[#0C72F5]" />
            <span>Store Data</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Material Group */}
            <div className="space-y-1.5">
              <FormField
                control={form.control}
                name="material_group"
                key="material_group"
                render={({ field }: { field: ControllerRenderProps<FieldValues, "material_group"> }) => (
                  <FormItem>
                    <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">
                      Material Group <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setMaterialGroupSearch("");
                        }}
                        value={field.value || ""}
                      >
                        <SelectTrigger className="w-full h-9 px-3 py-1 text-sm rounded-md bg-white border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-black">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-scroll">
                          {/* Search */}
                          <div className="sticky top-0 z-10 bg-white px-2 py-1">
                            <Input
                              type="text"
                              value={materialGroupSearch}
                              onChange={(e) => setMaterialGroupSearch(e.target.value)}
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
                            {materialGroupOptions.length > 0 ? (
                              materialGroupOptions.map((group) => (
                                <SelectItem key={group.name} value={group.name} className="text-sm">
                                  {group.material_group_name} – {group.material_group_description}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="px-3 py-2 text-sm text-black">
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

            {!isZCAPMaterial && (
              <div className="space-y-1.5">
                <FormField
                  control={form.control}
                  name="batch_requirements_yn"
                  key="batch_requirements_yn"
                  render={({ field }: { field: ControllerRenderProps<FieldValues, "batch_requirements_yn"> }) => (
                    <FormItem>
                      <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block leading-tight">Batch Management Required</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
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
            )}

            {/* Availability Check */}
            <div className="space-y-1.5">
              <FormField
                control={form.control}
                name="availability_check"
                key="availability_check"
                render={({ field }: { field: ControllerRenderProps<FieldValues, "availability_check"> }) => (
                  <FormItem>
                    <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">Availability Check</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                      >
                        <SelectTrigger className="w-full h-9 px-3 py-1 text-sm rounded-md bg-white border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-black">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {AvailabilityCheck.map((check) => (
                            <SelectItem key={check.name} value={check.name} className="text-sm">
                              {check.name} - {check.description}
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

            {/* Serial Number Profile */}
            {!isZCAPMaterial && materialCategory !== "C" && materialCategory !== "G" && (
              <div className="space-y-1.5">
                <FormField
                  control={form.control}
                  name="serial_number_profile"
                  key="serial_number_profile"
                  render={({ field }: { field: ControllerRenderProps<FieldValues, "serial_number_profile"> }) => (
                    <FormItem>
                      <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">Serial Profile</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || undefined}
                        >
                          <SelectTrigger className="w-full h-9 px-3 py-1 text-sm rounded-md bg-white border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-black">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {SerialProfile.map((serial) => (
                              <SelectItem key={serial.name} value={serial.name} className="text-sm">
                                {serial.serial_no_profile}
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
            )}

            {/* Conditional Fields: Class Type & Class Number */}
            {!isZCAPMaterial && batchRequirement === "Yes" && (
              <>
                <div className="space-y-1.5">
                  <FormField
                    control={form.control}
                    name="class_type"
                    key="class_type"
                    render={({ field }: { field: ControllerRenderProps<FieldValues, "class_type"> }) => (
                      <FormItem>
                        <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">Class Type</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || undefined}
                          >
                            <SelectTrigger className="w-full h-9 px-3 py-1 text-sm rounded-md bg-white border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#0C72F5]/10 focus:border-[#0C72F5] hover:border-slate-300 text-black">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {ClassType.map((classtype) => (
                                <SelectItem key={classtype.name} value={classtype.name} className="text-sm">
                                  {classtype.name}
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

                <div className="space-y-1.5">
                  <FormField
                    control={form.control}
                    name="class_number"
                    key="class_number"
                    render={({ field }: { field: ControllerRenderProps<FieldValues, "class_number"> }) => (
                      <FormItem>
                        <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">Class Number</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            readOnly
                            className="w-full h-9 px-3 py-1 text-sm rounded-md !bg-white !disabled:bg-white !opacity-100 !disabled:opacity-100 border border-slate-200 text-black font-medium cursor-not-allowed"
                            placeholder="Auto-filled"
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            {/* Serialization Level */}
            {!isZCAPMaterial && materialCategory !== "C" && materialCategory !== "G" && serialNumberProfile && (
              <div className="space-y-1.5">
                <FormField
                  control={form.control}
                  name="serialization_level"
                  key="serialization_level"
                  render={({ field }: { field: ControllerRenderProps<FieldValues, "serialization_level"> }) => (
                    <FormItem>
                      <FormLabel className="text-[12px] font-semibold uppercase tracking-wider text-black mb-1 block">Serialization Level</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="w-full h-9 px-3 py-1 text-sm rounded-md !bg-white !disabled:bg-white !opacity-100 !disabled:opacity-100 border border-slate-200 text-black font-medium cursor-not-allowed"
                          placeholder="Auto-filled"
                          readOnly
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Storefields;
import React, { useEffect, useState, useMemo, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MaterialRegistrationFormData, EmployeeDetail, EmployeeAPIResponse, Company, Plant, division, industry, ClassType, UOMMaster, MRPType, ValuationClass, procurementType, ValuationCategory, MaterialGroupMaster, MaterialCategory, ProfitCenter, AvailabilityCheck, PriceControl, MRPController, StorageLocation, InspectionType, SerialNumber, LotSize, SchedulingMarginKey, ExpirationDate, MaterialType, MaterialRequestData } from "@/src/types/MaterialCodeRequestFormTypes";
import { ControllerRenderProps, FieldValues, UseFormReturn } from "react-hook-form";


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

    const fields = [
      "material_group",
      "batch_requirements_yn",
      "brand_make",
      "availability_check",
      "class_type",
      "class_number",
      "serial_number_profile",
      "serialization_level",
    ] as const;

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
    <div className="bg-[#F4F4F6] overflow-hidden">
      <div className="flex flex-col justify-between bg-white rounded-[8px] p-1">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[20px] font-semibold leading-[24px] text-[#03111F] border-b border-slate-500 pb-1 mt-4">
            <span>Store Data</span>
          </div>
          <div className="grid grid-cols-3 gap-4 pb-2">
            {/* Material Group */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="material_group"
                key="material_group"
                render={({ field }: { field: ControllerRenderProps<FieldValues, "material_group"> }) => (
                  <FormItem>
                    <FormLabel>
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
                        <SelectTrigger className="p-3 w-full text-sm data-[placeholder]:text-gray-500">
                          <SelectValue placeholder="Select Material Group" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto">
                          <div className="px-2 py-1">
                            <input
                              type="text"
                              value={materialGroupSearch}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setMaterialGroupSearch(e.target.value)
                              }
                              placeholder="Search Material Group..."
                              className="w-full p-2 border border-gray-300 rounded text-sm"
                            />
                          </div>
                          {materialGroupOptions.length > 0 ? (
                            materialGroupOptions.map((group) => (
                              <SelectItem key={group.name} value={group.name}>
                                {group.material_group_name} -{" "}
                                {group.material_group_description}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-sm text-gray-500">
                              No material group found
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {!isZCAPMaterial && (
              <>
                {/* Batch Management Required */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="batch_requirements_yn"
                    key="batch_requirements_yn"
                    render={({ field }: { field: ControllerRenderProps<FieldValues, "batch_requirements_yn"> }) => (
                      <FormItem>
                        <FormLabel>Batch Management Required (Y/N)</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full text-sm whitespace-nowrap data-[placeholder]:text-gray-500">
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

                {/* Brand / Make */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="brand_make"
                    key="brand_make"
                    render={({ field }: { field: ControllerRenderProps<FieldValues, "brand_make"> }) => (
                      <FormItem>
                        <FormLabel>Brand / Make (if required)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="p-3 w-full text-sm placeholder:text-gray-500"
                            placeholder="Enter Brand / Make Name"
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Availability Check */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="availability_check"
                    key="availability_check"
                    render={({ field }: { field: ControllerRenderProps<FieldValues, "availability_check"> }) => (
                      <FormItem>
                        <FormLabel>Availability Check</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || undefined}
                          >
                            <SelectTrigger className="p-3 w-full text-sm data-[placeholder]:text-gray-500">
                              <SelectValue placeholder="Select Availability Check" />
                            </SelectTrigger>
                            <SelectContent>
                              {AvailabilityCheck.map((check) => (
                                <SelectItem key={check.name} value={check.name}>
                                  {check.name} - {check.description}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Conditional Fields */}
                {batchRequirement === "Yes" && (
                  <>
                    {/* Class Type */}
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="class_type"
                        key="class_type"
                        render={({ field }: { field: ControllerRenderProps<FieldValues, "class_type"> }) => (
                          <FormItem>
                            <FormLabel>Class Type</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value || undefined}
                              >
                                <SelectTrigger className="p-3 w-full text-sm data-[placeholder]:text-gray-500">
                                  <SelectValue placeholder="Select Class Type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {ClassType.map((classtype) => (
                                    <SelectItem key={classtype.name} value={classtype.name}>
                                      {classtype.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Class Number (Auto-populated) */}
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="class_number"
                        key="class_number"
                        render={({ field }: { field: ControllerRenderProps<FieldValues, "class_number"> }) => (
                          <FormItem>
                            <FormLabel>Class Number</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="text"
                                readOnly
                                className="p-3 w-full text-sm placeholder:text-gray-500"
                                placeholder="Class Number will be auto-filled"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}

                {/* Serial Number Profile */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="serial_number_profile"
                    key="serial_number_profile"
                    render={({ field }: { field: ControllerRenderProps<FieldValues, "serial_number_profile"> }) => (
                      <FormItem>
                        <FormLabel>Serial Number Profile</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || undefined}
                          >
                            <SelectTrigger className="p-3 w-full text-sm data-[placeholder]:text-gray-500">
                              <SelectValue placeholder="Select Serial Number Profile" />
                            </SelectTrigger>
                            <SelectContent>
                              {SerialProfile.map((serial) => (
                                <SelectItem key={serial.name} value={serial.name}>
                                  {serial.serial_no_profile}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Serialization Level */}
                {serialNumberProfile && (
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="serialization_level"
                      key="serialization_level"
                      render={({ field }: { field: ControllerRenderProps<FieldValues, "serialization_level"> }) => (
                        <FormItem>
                          <FormLabel>Serialization Level</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="p-3 w-full text-sm placeholder:text-gray-400"
                              placeholder="Enter Serialization Level"
                              readOnly
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Storefields;
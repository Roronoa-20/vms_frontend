import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DropdownDataExport } from "./LogisticsExportRFQ";

interface Props {
    formData: Record<string, any>;
    setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    Dropdown: DropdownDataExport;
}

export const LogisticsExportRFQFormFields = ({ formData, setFormData, Dropdown }: Props) => {
    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value: string, field: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const renderInput = (name: string, label: string, type = "text") => (
        <div className="col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">{label}</h1>
            <Input
                name={name}
                type={type}
                className="border-neutral-200"
                value={formData[name] || ""}
                onChange={handleFieldChange}
            />
        </div>
    );

    const renderTextarea = (name: string, label: string, rows = 4) => (
        <div className="col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">{label}</h1>
            <Textarea
                name={name}
                rows={rows}
                value={formData[name] || ""}
                onChange={handleFieldChange}
                className="w-full border border-neutral-200"
            />
        </div>
    );

    const renderSelect = <T,>(
        name: string,
        label: string,
        options: T[],
        getValue: (item: T) => string,
        getLabel: (item: T) => string,
        isDisabled?: boolean,
    ) => (
        <div className="col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                {label}
                {/* {errors[name as keyof typeof errors] && (
                    <span className="text-red-600 ml-1">*</span>
                )} */}
            </h1>
            <Select
                value={formData[name] ?? ""}
                onValueChange={(value) => handleSelectChange(value, name)}
                disabled={isDisabled}
            >
                {/* className={errors[name as keyof typeof errors] ? 'border border-red-600' : ''} */}
                <SelectTrigger>
                    <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {options?.map((item, idx) => (
                            <SelectItem key={idx} value={getValue(item)}>
                                {getLabel(item)}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );

    return (
        <div className="grid grid-cols-3 gap-6 p-5">
            {renderSelect("rfq_type", "RFQ Type", Dropdown?.rfq_type, (i) => i.name, (i) => i.vendor_type_name, true)}
            {renderSelect("company_name_logistic", "Company Name", Dropdown?.company, (i) => i.name, (i) => i.company_name)}
            <div className="col-span-1">
                <h1 className="text-[12px] font-normal text-[#626973] pb-3">Select Service</h1>
                <Select
                    value={formData?.service_provider ?? ""}
                    onValueChange={(val) => handleSelectChange(val, "service_provider")}
                >
                    <SelectTrigger disabled={formData?.company_name_logistic ? false: true}>
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="Select">Select</SelectItem>
                            <SelectItem value="All Service Provider">Send notification to all service provider</SelectItem>
                            <SelectItem value="Premium Service Provider">Send notification to specific premium service provider</SelectItem>
                            <SelectItem value="Courier Service Provider">Send notification to specific courier partner</SelectItem>
                            <SelectItem value="Adhoc Service Provider">Send notification to adhoc partner</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            {renderInput("sr_no", "Sr No.")}
            {renderInput("rfq_cutoff_date_logistic", "RFQ CutOff", "datetime-local")}
            {renderInput("rfq_date_logistic", "RFQ Date", "date")}
            {renderSelect("mode_of_shipment", "Mode of Shipment", Dropdown?.mode_of_shipment, (i) => i.name, (i) => i.name)}
            {renderSelect("destination_port", "Destination Port", Dropdown?.port_master, (i) => i.name, (i) => i.port_name)}
            {renderSelect("country", "Country", Dropdown?.country_master, (i) => i.name, (i) => i.country_name)}
            {renderSelect("port_code", "Port Code", Dropdown?.port_master, (i) => i.name, (i) => i.port_code)}
            {renderSelect("port_of_loading", "Port of Loading", Dropdown?.port_master, (i) => i.name, (i) => i.port_name)}
            {renderSelect("inco_terms", "Inco Terms", Dropdown?.incoterm_master, (i) => i.name, (i) => i.incoterm_name)}
            {renderInput("ship_to_address", "Ship to Address")}
            {renderSelect("package_type", "Package Type", Dropdown?.package_type, (i) => i.name, (i) => i.package_name)}
            {renderInput("no_of_pkg_units", "No.Of Pkg Units", "number")}
            {renderSelect("product_category", "Product Category", Dropdown?.product_category, (i) => i.name, (i) => i.product_category_name)}
            {renderInput("vol_weight", "Vol Weight(KG)", "number")}
            {renderInput("actual_weight", "Actual Weight(KG)", "number")}
            {renderInput("invoice_date", "Invoice Date", "date")}
            {renderInput("invoice_no", "Invoice No")}
            {renderInput("consignee_name", "Consignee Name")}
            {renderInput("shipment_date", "Shipment Date", "date")}
            {renderTextarea("remarks", "Remarks")}
        </div>
    );
};

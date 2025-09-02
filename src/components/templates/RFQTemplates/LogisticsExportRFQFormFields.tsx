import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DropdownDataExport } from "./LogisticsExportRFQ";
import MultipleFileUpload from "../../molecules/MultipleFileUpload";
import { ExportPort } from "@/src/types/RFQtype";
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'
import SearchSelectComponent from "../../common/SelectSearchComponent";
interface Props {
    formData: Record<string, any>;
    setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    Dropdown: DropdownDataExport;
    uploadedFiles: File[];
    setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export const LogisticsExportRFQFormFields = ({
    formData,
    setFormData,
    Dropdown,
    setUploadedFiles,
    uploadedFiles
}: Props) => {
    const today = new Date().toISOString().split("T")[0];
    const [exportCountry, setExportCountry] = useState<ExportPort[]>([])
    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value: string, name: string) => {
        if (name === "country") {
            const selected = exportCountry.find((p) => p.country === value);
            if (selected) {
                setFormData((prev) => ({
                    ...prev,
                    country: selected.country,
                    destination_port: selected.port_name,
                    port_code: selected.port_code,
                }));
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const renderInput = (name: string, label: string, type = "text", isdisabled?: boolean) => (
        <div className="col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">{label}</h1>
            <Input
                name={name}
                type={type}
                className="border-neutral-200"
                value={formData[name] || ""}
                onChange={handleFieldChange}
                disabled={isdisabled ? isdisabled : false}
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
        isDisabled?: boolean
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
    const fetchExportCountry = async (query?: string) => {
        console.log(query, "query")
        let url = `${API_END_POINTS?.CountryExportDropdown}`;
        if (query && query.trim() !== "") {
            url += `?search=${encodeURIComponent(query)}`;
        }
        const response: AxiosResponse = await requestWrapper({ url: url, method: "GET" });
        if (response?.status == 200) {
            console.log(response.data.message.data, "response.data.message in export country")
            setExportCountry(response.data.message.data)
            return response.data.message.data
        } else {
            alert("error");
        }
    }
    useEffect(() => {
        if (formData.country) {
            const selected = exportCountry.find(
                (p) => p.country === formData.country
            );
            if (selected) {
                setFormData((prev) => ({
                    ...prev,
                    country: selected.country,
                    destination_port: selected.port_name,
                    port_code: selected.port_code,
                }));
            }
        }
    }, [formData.country, exportCountry]);
    useEffect(() => {
        const fetchDestinationPort = async (company_name_logistic: string) => {
            setFormData((prev) => ({
                ...prev,
                destination_port: "",
            }));
            const url = `${API_END_POINTS?.fetchSerialNumber}?company=${company_name_logistic}&rfq_type=Export`
            const response: AxiosResponse = await requestWrapper({ url: url, method: "GET" });
            if (response?.status == 200) {
                console.log(response, "response of destination port data")
                setFormData((prev) => ({
                    ...prev,
                    sr_no: response.data.message.serial_number,
                }));
            } else {
                alert("error");
            }
        }
        if (formData.company_name_logistic) {
            fetchDestinationPort(formData.company_name_logistic);
        }
    }, [formData.company_name_logistic]);
    useEffect(() => {
        fetchExportCountry();
    }, []);
    useEffect(() => {
        setFormData((prev) => ({ ...prev, rfq_date_logistic: formData?.rfq_date_logistic ? formData?.rfq_date_logistic : today }));
    }, [today, formData?.rfq_date_logistic]);
    return (
        <div>
            <div className="grid grid-cols-3 gap-6 p-5">
                {renderSelect("rfq_type", "RFQ Type", Dropdown?.rfq_type, (i) => i.name, (i) => i.vendor_type_name, true)}
                {renderSelect("company_name_logistic", "Company Name", Dropdown?.company, (i) => i.name, (i) => i.company_name)}
                <div className="col-span-1">
                    <h1 className="text-[12px] font-normal text-[#626973] pb-3">Select Service</h1>
                    <Select
                        value={formData?.service_provider ?? ""}
                        onValueChange={(val) => handleSelectChange(val, "service_provider")}
                    >
                        <SelectTrigger disabled={formData?.company_name_logistic ? false : true}>
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
                {renderInput("sr_no", "Sr No.", "text", true)}
                {renderInput("rfq_cutoff_date_logistic", "RFQ CutOff", "datetime-local")}
                {renderInput("rfq_date_logistic", "RFQ Date", "date", true)}
                {renderSelect("mode_of_shipment", "Mode of Shipment", Dropdown?.mode_of_shipment, (i) => i.name, (i) => i.name)}
                {/* {renderSelect("country", "Country", exportCountry, (i) => i.country, (i) => `${i.country} - ${i.port_code} - ${i.port_name}`)} */}
                <div className='w-full'>
                    <h1 className="flex items-center gap-1  text-[12px] font-normal text-[#626973] pb-3">
                        {"Select Country Code"}
                    </h1>
                    <SearchSelectComponent
                        setData={(value) => handleSelectChange(value ?? "", "country")}
                        data={formData?.country ?? ""}
                        getLabel={(item) => `${item.country} - ${item.port_code} - ${item.port_name}`}
                        getValue={(item) => item?.country}
                        dropdown={exportCountry}
                        setDropdown={setExportCountry}
                        searchApi={fetchExportCountry}
                        placeholder='Select Country'
                    // disabled={formData?.is_submitted}
                    />
                </div>
                {renderInput("destination_port", "Destination Port", "text", true)}
                {renderInput("port_code", "Port Code", "text", true)}
                {renderSelect("port_of_loading", "Port of Loading", Dropdown?.port_of_loading, (i) => i.name, (i) => i.name)}
                {renderSelect("inco_terms", "Inco Terms", Dropdown?.incoterm_master, (i) => i.name, (i) => i.incoterm_name)}
                {renderInput("ship_to_address", "Ship to Address")}
                {renderSelect("package_type", "Package Type", Dropdown?.package_type, (i) => i.name, (i) => i.package_name)}
                {renderInput("no_of_pkg_units", "No.Of Pkg Units", "number")}
                {renderSelect("product_category", "Product Category", Dropdown?.product_category, (i) => i.name, (i) => i.product_category_name)}
                {renderInput("vol_weight", "Vol Weight(KG)", "number")}
                {renderInput("actual_weight", "Actual Weight(KG)", "number")}
                {renderInput("invoice_date", "Invoice Date", "date")}
                {renderInput("invoice_no", "Invoice No")}
                {renderInput("invoice_value", "Invoice Value")}
                {renderInput("consignee_name", "Consignee Name")}
                {renderSelect(
                    'shipment_type',
                    'Shipment Type',
                    Dropdown?.shipment_type,
                    (item) => item.name,
                    (item) => `${item.shipment_type_name}`
                )}
                {renderInput("shipment_date", "Shipment Date", "date")}
                <div>
                    <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                        Uplaod Documents
                    </h1>
                    <MultipleFileUpload
                        files={uploadedFiles}
                        setFiles={setUploadedFiles}
                        buttonText="Attach Files"
                    />
                </div>
            </div>
            <div className='p-5'>
                {renderTextarea("remarks", "Remarks")}
            </div>
        </div>
    )
}
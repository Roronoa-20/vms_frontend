"use client";
import React, { useEffect } from 'react'
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PurchaseRequestDropdown } from "@/src/types/PurchaseRequestType";
import MultipleFileUpload from "../../molecules/MultipleFileUpload";
import { QuotationDetail } from '@/src/types/QuatationTypes';

interface Props {
    formData: QuotationDetail;
    setFormData: React.Dispatch<React.SetStateAction<QuotationDetail>>;
    uploadedFiles: File[];
    setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
    Dropdown: PurchaseRequestDropdown["message"];
}

const LogisticsImportQuatationFormFields = ({
    formData,
    setFormData,
    uploadedFiles,
    setUploadedFiles,
    Dropdown,
}: Props) => {

    const safeParseFloat = (val: string): number => {
        const parsed = parseFloat(val);
        return isNaN(parsed) ? 0 : parsed;
    };

    const chargeableWeight = safeParseFloat(formData["chargeable_weight"]);
    const rateKg = safeParseFloat(formData["ratekg"]);
    const fuelSurcharge = safeParseFloat(formData["fuel_surcharge"]);
    const sc = safeParseFloat(formData["sc"]);
    const xray = safeParseFloat(formData["xray"]);
    const pickupOrigin = safeParseFloat(formData["pickuporigin"]);
    const dcInr = safeParseFloat(formData["destination_charge"]);
    const shippingLineCharge = safeParseFloat(formData["shipping_line_charge"]);
    const cfsCharge = safeParseFloat(formData["cfs_charge"]);
    const exchangeRate = safeParseFloat(formData["exchange_rate"]);
    const mode = formData["mode_of_shipment"];

    // Fetch XR rate from API (replace with your actual API call)
    const fetchExchangeRate = async (from: string, to: string) => {
        try {
            if (from && to) {
                // Replace with your real API call
                const response = await fetch(`https://v6.exchangerate-api.com/v6/dd3284edb1dd6c2f9a1d4a12/pair/${from}/${to}`);
                const data = await response.json();
                setFormData(prev => ({
                    ...prev,
                    exchange_rate: data.conversion_rate
                }));
            }
        } catch (error) {
            console.error("Failed to fetch exchange rate:", error);
        }
    };

    // Calculate all fields when formData changes
    useEffect(() => {
        let totalFreight = 0;
        let exWorks = 0;
        let totalFreightINR = 0;
        let totalLandingPriceINR = 0;

        if (mode === "Air") {
            totalFreight = chargeableWeight * (rateKg + fuelSurcharge + sc) + xray + pickupOrigin;
            exWorks = xray + pickupOrigin;
            totalFreightINR = exchangeRate * totalFreight;
            totalLandingPriceINR = totalFreightINR + dcInr;
        }
        if (mode === "Ocean") {
            totalFreight = chargeableWeight * (rateKg + fuelSurcharge + sc) + xray;
            exWorks = xray;
            totalFreightINR = exchangeRate * totalFreight;
            totalLandingPriceINR = totalFreightINR + dcInr + shippingLineCharge + cfsCharge;
        }
        setFormData(prev => ({
            ...prev,
            total_freight: totalFreight.toFixed(2),
            ex_works: exWorks.toFixed(2),
            total_freightinr: totalFreightINR.toFixed(2),
            total_landing_price: totalLandingPriceINR.toFixed(2)
        }));

    }, [
        mode, chargeableWeight, rateKg, fuelSurcharge, sc, xray,
        pickupOrigin, dcInr, shippingLineCharge, cfsCharge, exchangeRate
    ]);

    useEffect(() => {
        const from = formData["from_currency"];
        const to = formData["to_currency"];
        if (from && to) {
            fetchExchangeRate(from, to);
        }
    }, [formData["from_currency"], formData["to_currency"]]);

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        // Only allow valid float input
        const isNumericField = ['chargeable_weight', 'ratekg', 'fuel_surcharge', 'sc', 'xray', 'pickuporigin', 'destination_charge', 'shipping_line_charge', 'cfs_charge'].includes(name);

        if (isNumericField && value !== "" && isNaN(Number(value))) return;

        setFormData(prev => ({ ...prev, [name]: value }));
    };


    const handleSelectChange = (value: string, field: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    const renderInput = (name: string, label: string, type = 'text', disabled = false,placeholder?:string) => (
        <div className="col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">{label}</h1>
            <Input
                name={name}
                type={type}
                className="border-neutral-200"
                value={formData[name as keyof QuotationDetail] as string  || ''}
                onChange={handleFieldChange}
                disabled={disabled}
                placeholder={placeholder?placeholder:""}
            />
        </div>
    );

    const renderTextarea = (name: string, label: string, rows = 4) => (
        <div className="col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">{label}</h1>
            <textarea
                name={name}
                rows={rows}
                value={formData[name as keyof QuotationDetail] as string  || ''}
                onChange={(e) => handleFieldChange(e)}
                className="w-full rounded-md border border-neutral-200 px-3 h-10 py-2 text-sm text-gray-800"
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
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">{label}</h1>
            <Select
                value={formData[name as keyof QuotationDetail] as string  ?? ''}
                onValueChange={(value) => handleSelectChange(value, name)}
                disabled={isDisabled}
            >
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
        <div>
            <div className="grid grid-cols-3 gap-6 p-5">
                {renderSelect(
                    'mode_of_shipment',
                    'Mode of Shipment',
                    Dropdown?.mode_of_shipment,
                    (item) => item?.name,
                    (item) => `${item?.name}`
                )}
                {renderInput('airlinevessel_name', 'Name')}
                {renderInput('chargeable_weight', 'Chargeable Weight')}
                {renderInput('ratekg', 'Rate/Kg')}
                {renderInput('fuel_surcharge', 'Fuel Surcharge')}
                {renderInput('sc', 'SC')}
                {renderInput('xray', 'X-Ray')}
                {renderInput('pickuporigin', 'Pick Up / Origin Charge', 'text', mode === 'Ocean')}
                {renderInput('ex_works', 'Ex Works', 'text', true)}
                {renderInput('total_freight', 'Total Freight', 'text', true)}
                {renderSelect(
                    'from_currency',
                    'From Currency',
                    Dropdown?.currency_master,
                    (item) => item?.name,
                    (item) => `${item?.name}`
                )}
                {renderSelect(
                    'to_currency',
                    'To Currency',
                    Dropdown?.currency_master,
                    (item) => item?.name,
                    (item) => `${item?.name}`
                )}
                {renderInput('exchange_rate', 'XR(XE.COM)', 'text', true)}
                {renderInput('total_freightinr', 'Total Freight(INR)', 'text', true)}
                {renderInput('destination_charge', 'DC(INR)')}
                {renderInput('shipping_line_charge', 'Shipping Line Charges', 'text', mode === "Air","NA")}
                {renderInput('cfs_charge', 'CFS Charges', 'text', mode === "Air","NA")}
                {renderInput('total_landing_price', 'Total Landing Price(INR)', 'text', true)}
                {renderInput('transit_days', 'Transit Days')}
                {renderTextarea('remarks', 'Remarks')}
                <div>
                    <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                        Upload Documents
                    </h1>
                    <MultipleFileUpload
                        files={uploadedFiles}
                        setFiles={setUploadedFiles}
                        buttonText="Attach Files"
                    />
                </div>
            </div>
        </div>
    )
}

export default LogisticsImportQuatationFormFields;

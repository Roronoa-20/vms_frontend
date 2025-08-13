import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';

type LogisticsFormProps = {
    logisticType: string;
    formData: Record<string, string>;
    setFormData: (data: Record<string, string>) => void;
    mode_of_shipment: string; // 'Air' or 'Ocean'
};

const importFields = [
    { key: "final_ffn", label: "FFN" },
    { key: "final_rate_kg", label: "Rate per KG" },
    { key: "final_chargeable_weight", label: "Chargeable Weight" },
    { key: "final_freight_fcr", label: "Freight FCR" },
    { key: "final_fsc", label: "FSC" },
    { key: "final_xcr", label: "XCR" },
    { key: "final_pickup", label: "Pickup" },
    { key: "final_xray", label: "X-Ray" },
    { key: "final_sum_freight_inr", label: "Sum Freight INR" },
    { key: "final_gst_amount", label: "GST Amount" },
    { key: "final_airline", label: "Airline" },
    { key: "final_dc", label: "DC" },
    { key: "final_sc", label: "SC" },
    { key: "final_cfs_charge", label: "CFS Charge" },
    { key: "final_landing_price", label: "Landing Price" },
    { key: "final_transit_days", label: "Transit Days" },
    { key: "final_remarks", label: "Remarks" },
];

const exportFields = [
    { key: "final_ffn", label: "FFN" },
    { key: "final_airline", label: "Airline" },
    { key: "final_chargeable_weight", label: "Chargeable Weight" },
    { key: "final_rate_kg", label: "Rate per KG" },
    { key: "final_fsc", label: "FSC" },
    { key: "final_sc", label: "SC" },
    { key: "final_xray", label: "X-Ray" },
    { key: "final_total", label: "Total" },
    { key: "final_others", label: "Others" },
    { key: "final_freight_total", label: "Freight Total" },
    { key: "final_tat", label: "TAT" },
    { key: "final_remarks", label: "Remarks" },
];


const FinalNegotiatedRateFormLogistics: React.FC<LogisticsFormProps> = ({
    logisticType,
    formData,
    setFormData,
    mode_of_shipment
}) => {
    const fields = logisticType === 'Import' ? importFields : exportFields;

    const parse = (val: string) => parseFloat(val) || 0;

    useEffect(() => {
        const updated = { ...formData };

        if (logisticType === 'Export') {
            const chargeableWeight = parse(formData.final_chargeable_weight);
            const rateKg = parse(formData.final_rate_kg);
            const fsc = parse(formData.final_fsc);
            const sc = parse(formData.final_sc);
            const xray = parse(formData.final_xray);
            const others = parse(formData.final_others);

            const total = chargeableWeight * (rateKg + fsc + sc + xray) + others;
            const freightTotal = total + others;

            updated.final_total = total.toFixed(2);
            updated.final_freight_total = freightTotal.toFixed(2);
        }

        if (logisticType === 'Import') {
            const chargeableWeight = parse(formData.final_chargeable_weight);
            const rateKg = parse(formData.final_rate_kg);
            const fsc = parse(formData.final_fsc);
            const sc = parse(formData.final_sc);
            const xray = parse(formData.final_xray);
            const pickup = parse(formData.final_pickup);
            const xcr = parse(formData.final_xcr);
            const dc = parse(formData.final_dc);
            const cfsCharge = parse(formData.final_cfs_charge);

            if (mode_of_shipment === 'Air') {
                const freightFcr = chargeableWeight * (rateKg + fsc + sc) + xray + pickup;
                const freightInr = xcr * freightFcr;
                const landingPrice = freightInr + dc;

                updated.final_freight_fcr = freightFcr.toFixed(2);
                updated.final_sum_freight_inr = freightInr.toFixed(2);
                updated.final_landing_price = landingPrice.toFixed(2);
            }

            if (mode_of_shipment === 'Ocean') {
                const freightFcr = chargeableWeight * (rateKg + fsc + sc) + xray;
                const freightInr = xcr * freightFcr;
                const landingPrice = freightInr + dc + sc + cfsCharge;

                updated.final_freight_fcr = freightFcr.toFixed(2);
                updated.final_sum_freight_inr = freightInr.toFixed(2);
                updated.final_landing_price = landingPrice.toFixed(2);
            }
        }

        setFormData(updated);
    }, [
        logisticType,
        mode_of_shipment,
        formData.final_chargeable_weight,
        formData.final_rate_kg,
        formData.final_fsc,
        formData.final_sc,
        formData.final_xray,
        formData.final_pickup,
        formData.final_xcr,
        formData.final_dc,
        formData.final_others,
        formData.final_cfs_charge,
        setFormData
    ]);

    const isDisabled = (field: string): boolean => {
        if (logisticType === 'Export') {
            return ['final_ffn', 'final_total', 'final_freight_total'].includes(field);
        }

        if (logisticType === 'Import') {
            if (mode_of_shipment === 'Air') {
                return [
                    "final_ffn",
                    'final_freight_fcr',
                    'final_sum_freight_inr',
                    'final_landing_price',
                    'final_xcr',
                    'final_sc',
                    'final_cfs_charge',
                ].includes(field);
            }
            if (mode_of_shipment === 'Ocean') {
                return [
                    'final_ffn',
                    'final_freight_fcr',
                    'final_xcr',
                    'final_sum_freight_inr',
                    'final_landing_price',
                    "final_pickup",
                ].includes(field);
            }
        }
        return false;
    };

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const renderInput = (name: string, label: string, type = 'text') => (
        <div className="col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-2">
                {label}
            </h1>
            <Input
                name={name}
                type={type}
                className="border-neutral-200"
                value={formData[name] || ''}
                onChange={handleFieldChange}
                disabled={isDisabled(name)}
            />
        </div>
    );


    return (
        <>
            <h1 className="text-lg py-2 font-semibold pt-4">Final Negotiated Rate</h1>
            <div className="grid grid-cols-3 gap-4 p-2 bg-white rounded-md">
                {fields.map(({ key, label }) => (
                    <div key={key}>
                        {renderInput(key, label)}
                    </div>
                ))}
            </div>
        </>
    );
};

export default FinalNegotiatedRateFormLogistics;

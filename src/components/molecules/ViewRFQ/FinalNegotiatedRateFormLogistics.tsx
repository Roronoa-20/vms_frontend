import React from 'react';
import { Input } from '@/components/ui/input'; // Update this path to your Input component

type LogisticsFormProps = {
    logisticType: string;
    formData: Record<string, string>;
    setFormData: (data: Record<string, string>) => void;
};

const importFields = [
    "final_ffn",
    "final_freight_fcr",
    "final_xcr",
    "final_sum_freight_inr",
    "final_dc",
    "final_remarks",
    "final_rate_kg",
    "final_fsc",
    "final_pickup",
    "final_gst_amount",
    "final_airline",
    "final_transit_days",
    "final_chargeable_weight",
    "final_sc",
    "final_xray",
    "final_landing_price"
];

const exportFields = [
    "final_ffn",
    "final_others",
    "final_remarks",
    "final_rate_kg",
    "final_fsc",
    "final_airline",
    "final_tat",
    "final_chargeable_weight",
    "final_sc",
    "final_xray",
    "final_total",
    "final_freight_total"
];

const FinalNegotiatedRateFormLogistics: React.FC<LogisticsFormProps> = ({ logisticType, formData, setFormData }) => {
    const fields = logisticType === 'Import' ? importFields : exportFields;

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // const handleReset = () => {
    //     const resetValues: Record<string, string> = {};
    //     fields.forEach(field => {
    //         resetValues[field] = '';
    //     });
    //     setFormData(resetValues);
    // };

    const renderInput = (name: string, label: string, type = 'text') => (
        <div className="col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-2 capitalize">
                {label}
            </h1>
            <Input
                name={name}
                type={type}
                className="border-neutral-200"
                value={formData[name] || ''}
                onChange={handleFieldChange}
            />
        </div>
    );

    return (
        <>
            <h1 className="text-lg py-2 font-semibold pt-4">Final Negotiated Rate</h1>
            <div className="grid grid-cols-3 gap-4 p-2 bg-white rounded-md">
                {fields.map((fieldName) => (
                    <div key={fieldName} >
                        {renderInput(fieldName, fieldName.replace('final_', '').replace(/_/g, ' '))}
                    </div>
                ))}
                {/* <div className="col-span-3 flex justify-end mt-4" >
                    <button
                        type="button"
                        onClick={handleReset}
                        className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
                    >
                        Reset
                    </button>
                </div> */}
            </div>
        </>
    );
};

export default FinalNegotiatedRateFormLogistics;

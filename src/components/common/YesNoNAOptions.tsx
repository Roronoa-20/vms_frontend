import React from 'react';
import { Input } from '@/src/components/atoms/input';
import { Label } from '@/src/components/atoms/label';

interface YesNoNAOptionsProps {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
    disabled?: boolean;
}

const YesNoNAOptions: React.FC<YesNoNAOptionsProps> = ({
    name,
    value,
    onChange,
    disabled = true,
}) => {
    const options = ['Yes', 'No', 'N/A'];

    return (
        <div className="flex space-x-6">
            {options.map((option) => (
                <Label key={option} className="inline-flex items-center space-x-2">
                    <Input
                        type="radio"
                        name={name}
                        value={option}
                        disabled={disabled}
                        checked={value === option}
                        onChange={(e) => onChange(e, name)}
                        className="w-4 h-4 accent-blue-500 disabled:opacity-100 disabled:bg-white disabled:checked:accent-blue-500"
                    />
                    <span className="text-[14px]">{option}</span>
                </Label>
            ))}
        </div>
    );
};

export default YesNoNAOptions;

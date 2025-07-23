import React from 'react';
import { Input } from '@/src/components/atoms/input';
import { Label } from '@/src/components/atoms/label';

interface YesNoNAGroupProps {
  name: string;
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
  // disabled?: boolean
}

const YesNoNAGroup: React.FC<YesNoNAGroupProps> = ({ name, label, value, onChange }) => {
  const options = ["Yes", "No", "N/A"];

  return (
    <div className="mb-3 border-b border-gray-300 pb-4">
      <Label htmlFor={name} className="font-semibold text-[16px] leading-[19px] text-[#03111F]">
        {label}
      </Label>
      <div className="space-x-16 mt-2">
        {options.map((val) => (
          <Label key={val} className="inline-flex items-center space-x-2">
            <Input
              type="checkbox"
              name={name}
              className="w-4 h-4"
              value={val}
              checked={value === val}
              onChange={(e) => onChange(e, name)}
              // disabled={disabled}
            />
            <span className="text-[14px]">{val}</span>
          </Label>
        ))}
      </div>
    </div>
  );
};

export default YesNoNAGroup;

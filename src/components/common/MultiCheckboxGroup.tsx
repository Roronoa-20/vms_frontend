import React from 'react';
import { Input } from '@/src/components/atoms/input';
import { Label } from '@/src/components/atoms/label';

interface MultiCheckboxGroupProps {
  name: string;
  label: string;
  options: string[];
  selected: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
  columns?: number;
  disabled?: boolean;
}

const MultiCheckboxGroup: React.FC<MultiCheckboxGroupProps> = ({ name, label, options, selected, onChange, columns = 3, disabled}) => (
  <div className="mb-3 border-b border-gray-300 pb-4">
    <Label htmlFor={name} className="font-semibold text-[16px] leading-[19px] text-[#03111F]">{label}</Label>
    <div className={`grid grid-cols-${columns} mt-2 gap-2`}>
      {options.map(option => (
        <Label className="inline-flex items-center space-x-2" key={option}>
          <Input
            type="checkbox"
            name={name}
            className="w-4 h-4"
            value={option}
            checked={selected.includes(option)}
            onChange={(e) => onChange(e, name)}
            disabled={disabled}
          />
          <span className="text-[14px]">{option}</span>
        </Label>
      ))}
    </div>
  </div>
);


export default MultiCheckboxGroup;

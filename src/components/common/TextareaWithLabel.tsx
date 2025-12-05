import React from 'react';
import { Input } from '@/src/components/atoms/input';
import { Label } from '@/src/components/atoms/label';

interface TextareaWithLabelProps {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
}

const TextareaWithLabel: React.FC<TextareaWithLabelProps> = ({ name, label, value, onChange, placeholder, rows = 4, required = false, disabled }) => (
  <div className="mt-3">
    {label && (
      <Label
        htmlFor={name}
        className="font-semibold text-[16px] leading-[19px] text-[#03111F]"
      >
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </Label>
    )}
    <textarea
      name={name}
      placeholder={placeholder}
      className="w-full border border-gray-300 p-2 mt-2"
      value={value}
      rows={rows}
      onChange={onChange}
      disabled={disabled}
    />
  </div>
);

export default TextareaWithLabel;


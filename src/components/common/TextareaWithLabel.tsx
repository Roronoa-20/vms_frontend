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
}

const TextareaWithLabel: React.FC<TextareaWithLabelProps> = ({
  name, label, value, onChange, placeholder, rows = 4
}) => (
  <div className="mt-3">
    <Label htmlFor={name} className="font-semibold text-[16px] leading-[19px] text-[#03111F]">{label}</Label>
    <textarea
      name={name}
      placeholder={placeholder}
      className="w-full border border-gray-300 p-2 mt-2"
      value={value}
      rows={rows}
      onChange={onChange}
    />
  </div>
);

export default TextareaWithLabel;


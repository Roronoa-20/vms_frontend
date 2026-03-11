import React from 'react';
import { Input } from '@/src/components/atoms/input';
import { Label } from '@/src/components/atoms/label';


interface ConditionalTextareaGroupProps {
  name: string;
  label: string;
  value: string;
  condition: boolean;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  required?: boolean;
}

const ConditionalTextareaGroup: React.FC<ConditionalTextareaGroupProps> = ({ name, label, value, condition, placeholder, onChange, disabled, required=false}) => condition ? (
  <div className="mt-1">
    <Label htmlFor={name} className="font-semibold text-[16px]">{label}{required && <span className="text-red-500 ml-1">*</span>}</Label>
    <textarea
      name={name}
      className="w-full border border-gray-300 p-2"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  </div>
) : null;

export default ConditionalTextareaGroup

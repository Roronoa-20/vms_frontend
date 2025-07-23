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
}

const ConditionalTextareaGroup: React.FC<ConditionalTextareaGroupProps> = ({
  name, label, value, condition, placeholder, onChange
}) => condition ? (
  <div className="mt-1">
    <Label htmlFor={name} className="font-semibold text-[16px]">{label}</Label>
    <textarea
      name={name}
      className="w-full border border-gray-300 p-2"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
) : null;

export default ConditionalTextareaGroup

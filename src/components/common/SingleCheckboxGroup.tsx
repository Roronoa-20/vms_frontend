import React from "react";
import { Input } from "@/src/components/atoms/input";
import { Label } from "@/src/components/atoms/label";

interface SingleCheckboxGroupProps {
  name: string;
  label?: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
}

const SingleCheckboxGroup: React.FC<SingleCheckboxGroupProps> = ({
  name,
  label,
  value,
  options,
  onChange,
}) => {
  return (
    <div className="mb-3 border-b border-gray-300 pb-4">
      {label && (
        <Label
          htmlFor={name}
          className="font-semibold text-[16px] leading-[19px] text-[#03111F] block mb-2"
        >
          {label}
        </Label>
      )}
      <div className="flex flex-wrap gap-x-10 gap-y-2">
        {options.map((option) => (
          <Label
            key={option}
            htmlFor={`${name}_${option}`}
            className="inline-flex items-center space-x-2"
          >
            <Input
              type="checkbox"
              id={`${name}_${option}`}
              name={name}
              className="w-4 h-4"
              value={option}
              checked={value === option}
              onChange={(e) => onChange(e, name)}
            />
            <span className="text-[14px]">{option}</span>
          </Label>
        ))}
      </div>
    </div>
  );
};

export default SingleCheckboxGroup;

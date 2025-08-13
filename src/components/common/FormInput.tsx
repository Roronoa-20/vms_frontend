import React from "react";
import { Input } from "@/src/components/atoms/input";
import { Label } from "@/src/components/atoms/label";

type FormInputProps = {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
};

export default function Form_Input({ label, name, value, onChange, placeholder }: FormInputProps) {
  return (
    <>
      <div className="mb-3">
        <Label htmlFor={name} className="font-semibold text-[16px] leading-[19px] text-[#03111F]">{label}</Label>
        <Input
          type="text"
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full border border-gray-300 p-2 mt-2"
          // className="block w-80 p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </>
  );
}

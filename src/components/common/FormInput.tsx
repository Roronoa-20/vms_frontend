import React from "react";

type FormInputProps = {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Form_Input({ name, value, onChange }: FormInputProps) {
  return (
    <>
      <div className="mb-3">
        <input
          type="text"
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="block w-80 p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="border-b border-gray-300"></div>
    </>
  );
}

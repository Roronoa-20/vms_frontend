"use client";

import React from "react";
import type { YesNoNAValue } from "@/src/types/asatypes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface YesNoNAProps {
  name: string;
  value: YesNoNAValue;
  onSelectionChange: (name: string, selection: "yes" | "no" | "na") => void;
  onCommentChange: (name: string, comment: string) => void;
  onFileChange: (name: string, file: File | null) => void;
}

export default function YesNoNA({
  name,
  value,
  onSelectionChange,
  onCommentChange,
  onFileChange,
}: YesNoNAProps) {
  return (
    <>
      {/* Selection Radio */}
      <div className="flex items-center mb-2">
        {["yes", "no", "na"].map((option) => (
          <div key={option} className="flex items-center ml-4">
            <Input
              id={`${name}-${option}`}
              type="checkbox"
              name={name}
              value={option}
              checked={value.selection === option}
              onChange={() => onSelectionChange(name, option as "yes" | "no" | "na")}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
            />
            <Label htmlFor={`${name}-${option}`} className="ms-2 text-sm font-medium text-gray-900 capitalize">
              {option}
            </Label>
          </div>
        ))}
      </div>

      {/* Comment and File upload */}
      <div className="flex mb-3">
        {(value.selection === "yes" || value.selection === "no") && (
          <div>
            <Label className="text-sm font-medium text-gray-900">Please Specify</Label>
            <textarea
              className="block w-full p-2 text-sm border border-gray-400 rounded-lg"
              value={value.comment}
              onChange={(e) => onCommentChange(name, e.target.value)}
            />
          </div>
        )}

        <div>
          <Label className="text-sm font-medium text-gray-900">Upload File</Label>
          <Input
            type="file"
            onChange={(e) => onFileChange(name, e.target.files?.[0] ?? null)}
            className="block w-full text-sm border border-gray-400 rounded cursor-pointer bg-gray-50"
          />
        </div>
      </div>

      <div className="border-b border-gray-300 mt-3"></div>
    </>
  );
}

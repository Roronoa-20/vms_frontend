"use client";

import React from "react";
import type { YesNoNAValue } from "@/src/types/asatypes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Paperclip } from "lucide-react";
import { X } from "lucide-react";
import { useRef } from "react";

interface YesNoNAProps {
  name: string;
  value: YesNoNAValue;
  onSelectionChange: (name: string, selection: "Yes" | "No" | "NA" | "") => void;
  onCommentChange: (name: string, comment: string) => void;
  onFileChange: (name: string, file: File | null) => void;
  label: string;
  customYesInputType?: "date" | "text" | "textarea";
  disabled?: boolean;
}

export default function YesNoNA({ name, value, onSelectionChange, onCommentChange, onFileChange, label, customYesInputType, disabled }: YesNoNAProps) {

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="mb-6">
      {/* Main Question Label */}
      <Label className="font-semibold text-[16px] leading-[19px] text-[#03111F]">{label}</Label>

      {/* Radio Selection */}
      <div className="flex gap-24 mt-4">
        {(["Yes", "No", "NA"] as const).map((option) => (
          <Label
            key={option}
            htmlFor={`${name}-${option}`}
            className={`flex items-center gap-2 text-sm capitalize cursor-pointer
      ${value.selection === option ? "text-blue-600 font-semibold" : "text-gray-800"}`}
          >
            <Input
              id={`${name}-${option}`}
              type="checkbox"
              checked={value.selection === option}
              onChange={() =>
                !disabled &&
                onSelectionChange(name, value.selection === option ? "" : option)
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            {option}
          </Label>
        ))}
      </div>

      {value.selection === "Yes" && (
        <div className="mt-4">
          <Label htmlFor={`${name}-comment`} className="font-semibold text-[12px] leading-[19px] text-[#03111F] mb-1">
            {customYesInputType === "date" ? "If Yes, provide expiry date" : "Please Specify"}
          </Label>

          {customYesInputType === "date" ? (
            <Input
              type="date"
              id={`${name}-comment`}
              className="block w-full p-2 text-sm border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              value={value.comment}
              onChange={(e) => !disabled && onCommentChange(name, e.target.value)}
            />
          ) : (
            <textarea
              id={`${name}-comment`}
              className="block w-full p-2 text-sm border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              value={value.comment}
              onChange={(e) => !disabled && onCommentChange(name, e.target.value)}
            />
          )}
        </div>
      )}


      {/* File Upload */}
      <div className="mt-4 relative">
        <Label htmlFor={`${name}-file`} className="block text-sm font-medium text-gray-900 mb-1">
          Upload File
        </Label>

        <Input
          ref={fileInputRef}
          id={`${name}-file`}
          type="file"
          onChange={(e) => onFileChange(name, e.target.files?.[0] ?? null)}
          className="hidden"
        />

        <div
          className={`flex items-center w-full border rounded-md px-2 py-1 text-sm 
    ${value.file ? " py-0 text-green-600" : "text-gray-500"} 
    bg-white`}
          onClick={() => {
            if (!disabled && !value.file) fileInputRef.current?.click();
          }}
        >
          {!value.file && <Paperclip className="w-4 h-4 mr-2 text-gray-500 cursor-pointer" />}

          <span className="flex-1 truncate pr-2">
            {value.file ? (
              "url" in value.file ? (
                <a
                  href={value.file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 truncate pr-2 text-blue-600 underline"
                >
                  {"file_name" in value.file
                    ? value.file.file_name
                    : value.file.name || value.file.url}
                </a>
              ) : (
                <span className="flex-1 truncate pr-2">{value.file.name}</span>
              )
            ) : (
              <span className="flex-1 truncate pr-2">Choose file...</span>
            )}
          </span>


          {value.file && !disabled && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onFileChange(name, null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="text-red-600 hover:text-red-800 p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

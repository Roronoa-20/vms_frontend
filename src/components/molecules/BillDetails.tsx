"use client";
import { useState } from "react";
import MultipleFileUpload from "./MultipleFileUpload";
import { billdetails, Field } from "@/src/constants/paymentFields";

export default function BillDetails() {
  const [boeFiles, setBoeFiles] = useState<File[]>([]);

  const renderLabel = (label: string) => {
    const hasAsterisk = label.includes("*");
    if (!hasAsterisk) return <span>{label}</span>;

    const [text, ...rest] = label.split("*");
    return (
      <span>
        {text}
        <span className="text-red-500">*</span>
        {rest.join("")}
      </span>
    );
  };

  const renderField = (field: Field, index: number) => (
    <div key={index} className="flex flex-col">
      <label className="mb-1 text-[14px] text-gray-700">{renderLabel(field.label)}</label>
      {field.type === "text" && (
        <input
          type="text"
          placeholder={field.placeholder || ""}
          className="border border-gray-300 rounded-md px-3 py-1.5 hover:border-blue-500 focus:outline-none 
                     focus:ring-blue-500 focus:border-blue-500 transition text-[16px]"
        />
      )}
      {field.type === "date" && (
        <input
          type="date"
          className="border border-gray-300 rounded-md px-3 py-1.5 hover:border-blue-500 focus:outline-none 
                     focus:ring-blue-500 focus:border-blue-500 transition"
        />
      )}
      
        {field.type === "text-date" && (
        <div className="flex gap-2">
            <input
            type="text"
            placeholder={field.placeholder || ""}
            className="w-1/2 border border-gray-300 rounded-md px-3 py-1.5 hover:border-blue-500 focus:outline-none 
                        focus:ring-blue-500 focus:border-blue-500 transition text-[16px]"
            />
            <input
            type="date"
            className="w-1/2 border border-gray-300 rounded-md px-3 py-1.5 hover:border-blue-500 focus:outline-none 
                        focus:ring-blue-500 focus:border-blue-500 transition"
            />
        </div>
        )}
    </div>
  );

  const renderFileTable = (fileList: File[], setFileList: Function) => (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full border border-gray-300 text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">File Name</th>
            <th className="border px-4 py-2">File Uploaded By</th>
            <th className="border px-4 py-2">Upload Date & Time</th>
            <th className="border px-4 py-2">Download</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {fileList.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">
                No files uploaded
              </td>
            </tr>
          )}
          {fileList.map((file, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{file.name}</td>
              <td className="border px-4 py-2">Current User</td>
              <td className="border px-4 py-2">{new Date().toLocaleString()}</td>
              <td
                className="border px-4 py-2 text-blue-600 cursor-pointer"
                onClick={() => {
                  const url = URL.createObjectURL(file);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = file.name;
                  link.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Download
              </td>
              <td
                className="border px-4 py-2 text-red-600 cursor-pointer"
                onClick={() => setFileList((prev: File[]) => prev.filter((_, i) => i !== index))}
              >
                Delete
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const handleSubmit = () => {
    console.log("BOE Files:", boeFiles);
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="text-lg font-semibold mb-4">Bill Of Entry Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {billdetails.map(renderField)}
      </div>

      <div className="flex justify-between items-center mt-6">
        <h2 className="text-lg font-semibold">Uploaded Documents</h2>
        <MultipleFileUpload
          files={boeFiles}
          setFiles={setBoeFiles}
          buttonText="Attach Files"
          onNext={(uploadedFiles) => console.log("Files uploaded:", uploadedFiles)}
        />
      </div>

      {renderFileTable(boeFiles, setBoeFiles)}

      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={handleSubmit}
          className="text-white px-6 py-2 rounded-xl shadow transition"
          style={{ backgroundColor: "#5291CD" }}
        >
          Update BOE
        </button>
      </div>
    </div>
  );
}

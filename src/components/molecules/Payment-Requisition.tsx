"use client";
import { useState, useRef, useEffect } from "react";
import MultipleFileUpload from "./MultipleFileUpload";
import BoeDetails from "./BillDetails"; 
import { remainingFields, remarkField, Field } from "@/src/constants/paymentFields";
import BillDetails from "./BillDetails";

export default function PaymentRequisition() {
  const [files, setFiles] = useState<File[]>([]);
  const [showBOEDetails, setShowBOEDetails] = useState(false);
  const boeRef = useRef<HTMLDivElement | null>(null);

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

  const renderField = (field: Field, index: number) => {
    const fullWidthFields = [
      "Duty Amount in Word:*",
      "Payment Details:*",
      "RODTEP Details:*",
      "Specific Remark:",
    ];
    const isFullWidth = fullWidthFields.includes(field.label);

    return (
      <div
        key={index}
        className={`flex flex-col ${isFullWidth ? "col-span-1 md:col-span-3" : ""}`}
      >
        <label className="mb-1 text-[14px] text-gray-700">{renderLabel(field.label)}</label>

        {field.type === "text" && (
          <input
            type="text"
            placeholder={field.placeholder || ""}
            className="border border-gray-300 rounded-md px-3 py-1.5 hover:border-blue-500 focus:outline-none 
                       focus:ring-blue-500 focus:border-blue-500 transition text-[16px]"
          />
        )}

        {field.type === "number" && (
          <input
            type="number"
            placeholder={field.placeholder || ""}
            className="border border-gray-300 rounded-md px-3 py-1.5 hover:border-blue-500 focus:outline-none 
                       focus:ring-blue-500 focus:border-blue-500 transition text-[16px]"
          />
        )}

        {field.type === "date" && (
          <input
            type="date"
            className="border border-gray-300 rounded-md px-3 py-1.5 hover:border-blue-500 focus:outline-none 
                       focus:ring-blue-500 focus:border-blue-500 transition text-[16px]"
          />
        )}

        {field.type === "select" && (
          <select className="border border-gray-300 rounded-md px-3 py-2 hover:border-blue-500 focus:outline-none 
                       focus:ring-blue-500 focus:border-blue-500 transition text-[16px]">
            <option value="">{field.placeholder || "Select"}</option>
          </select>
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
                         focus:ring-blue-500 focus:border-blue-500 transition text-[16px]"
            />
          </div>
        )}

        {field.type === "textarea" && (
          <textarea
            rows={field.rows || 3}
            placeholder={field.placeholder || ""}
            className="border border-gray-300 rounded-md px-3 py-2 hover:border-blue-500 focus:outline-none 
                        focus:ring-blue-500 focus:border-blue-500 transition resize-y text-[16px]"
          />
        )}
      </div>
    );
  };

  const handleSubmit = () => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    console.log("Submitting form with files:", files);
  };

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

  useEffect(() => {
    if (showBOEDetails && boeRef.current) {
      boeRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showBOEDetails]);

  return (
    <div className="container mx-auto p-2 w-full bg-gray-100">
      <div className="bg-white p-4 rounded shadow space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {remainingFields.map(renderField)}
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {remarkField.map(renderField)}
        </div>

        <div className="flex justify-between items-center mt-6">
          <h2 className="text-lg font-semibold">Uploaded Documents</h2>
          <MultipleFileUpload
            files={files}
            setFiles={setFiles}
            buttonText="Attach Files"
            onNext={(uploadedFiles) => console.log("Files uploaded:", uploadedFiles)}
          />
        </div>

        {renderFileTable(files, setFiles)}

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={() => setShowBOEDetails((prev) => !prev)}
            className="text-white px-6 py-2 rounded-xl shadow transition"
            style={{ backgroundColor: "#5291CD" }}
          >
            {showBOEDetails ? "Update BOE" : "Update BOE"}
          </button>

          <button
            onClick={handleSubmit}
            className="text-white px-6 py-2 rounded-xl shadow transition"
            style={{ backgroundColor: "#5291CD" }}
          >
            Submit
          </button>
        </div>

        {showBOEDetails && (
          <div ref={boeRef}>
            <BillDetails/>
          </div>
        )}
      </div>
    </div>
  );
}

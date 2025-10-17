"use client";
import { useState } from "react";
import MultipleFileUpload from "./MultipleFileUpload";

type Field = {
  label: string;
  type: "text" | "date" | "select" | "text-date" | "textarea" | "checkbox";
  placeholder?: string;
  rows?: number;
};

export default function PickupRequest() {
  const [files, setFiles] = useState<File[]>([]);

  const remainingFields: Field[] = [
    { label: "Division:*", type: "select", placeholder: "Search By" },
    { label: "PI Number:", type: "text" },
    { label: "INCOTERMS", type: "text" },
    { label: "PO Number:*", type: "text" },
    { label: "Pick-up Date By:*", type: "date" },
    { label: "No of Boxes: *", type: "text" },
    { label: "Gross Weight: *", type: "text" },
    { label: "Type of Cargo: *", type: "select", placeholder: "Search By" },
    { label: "Inco Terms: *", type: "select", placeholder: "Search By" },
    { label: "Dual-Use NOC: *", type: "select", placeholder: "Search By" },
    { label: "Invoice Value: *", type: "text" },
    { label: "Mode of Shipment: *", type: "select", placeholder: "Search By" },
    { label: "Type of Shipments:*", type: "select", placeholder: "Search By" },
    { label: "LC Number", type: "text" },
    { label: "Group Email:*", type: "select", placeholder: "Search By" },
    { label: "Insurance Intimation:", type: "checkbox" },
    { label: "Name of Supplier: *", type: "text" },
    { label: "Origin Country: *", type: "select", placeholder: "Search By" },
    { label: "POL:", type: "select", placeholder: "Search By" },
    { label: "POD:", type: "select", placeholder: "Search By" },
    { label: "Billing Address:", type: "textarea" },
    { label: "Pickup Address:*", type: "textarea" },
    { label: "Additional Email Id:", type: "select", placeholder: "Search By" },
  ];

  const remarkField: Field[] = [
    { label: "Dimension (cm):*", type: "textarea", rows: 3, placeholder: "" },
    { label: "Remark", type: "textarea", rows: 3, placeholder: "Enter remarks here..." },
  ];

  const renderField = (field: Field, index: number) => {
    const fullWidthFields = ["Dimension (cm):*", "Remark"];
    const isFullWidth = fullWidthFields.includes(field.label);

    return (
      <div
        key={index}
        className={`flex flex-col ${isFullWidth ? "col-span-1 md:col-span-3" : ""}`}
      >
        {/* Label */}
        {field.type !== "checkbox" && (
          <label className="text-sm font-medium text-gray-700 mb-1">{field.label}</label>
        )}

        {/* Text Input */}
        {field.type === "text" && (
          <input
            type="text"
            placeholder={field.placeholder || ""}
            className="border border-gray-300 rounded-md px-3 py-2 hover:border-blue-500 focus:outline-none 
                       focus:ring-blue-500 focus:border-blue-500 transition"
          />
        )}

        {/* Date Input */}
        {field.type === "date" && (
          <input
            type="date"
            className="border border-gray-300 rounded-md px-3 py-2 hover:border-blue-500 focus:outline-none 
                       focus:ring-blue-500 focus:border-blue-500 transition"
          />
        )}

        {/* Select */}
        {field.type === "select" && (
          <select className="border border-gray-300 rounded-md px-3 py-2 hover:border-blue-500 focus:outline-none 
                       focus:ring-blue-500 focus:border-blue-500 transition">
            <option value="">{field.placeholder || "Select"}</option>
          </select>
        )}

        {/* Text + Date */}
        {field.type === "text-date" && (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={field.placeholder || ""}
              className="w-1/2 border border-gray-300 rounded-md px-3 py-2 hover:border-blue-500 focus:outline-none 
                         focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <input
              type="date"
              className="w-1/2 border border-gray-300 rounded-md px-3 py-2 hover:border-blue-500 focus:outline-none 
                         focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        )}

        {/* Textarea */}
        {field.type === "textarea" && (
          <textarea
            rows={3}
            placeholder={field.placeholder || ""}
            className={`border border-gray-300 rounded-md px-3 py-2 hover:border-blue-500 focus:outline-none 
                        focus:ring-blue-500 focus:border-blue-500 transition resize-y ${
              ["Pickup Address:*", "Billing Address:"].includes(field.label)
                ? "h-[42px] resize-none" // match text input height
                : ""
            }`}
          />
        )}

        {/* Checkbox */}
        {field.type === "checkbox" && (
          <>
            <label className="text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`field-${index}`}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-500">
                [If selected email notification will sent to insurance team]
              </span>
            </div>
          </>
        )}
      </div>
    );
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
  };

  return (
    <div className="container mx-auto p-2 w-full bg-gray-100">
      <div className="bg-white p-4 rounded shadow space-y-6">
       
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {remainingFields.map(renderField)}
          {remarkField.map(renderField)}
        </div>

        <div className="flex justify-between items-center mt-6">
          <h2 className="text-lg font-semibold">Uploaded Documents</h2>
          <MultipleFileUpload
            files={files}
            setFiles={setFiles}
            buttonText="Attach Files"
            onNext={(uploadedFiles) => {
              console.log("Files uploaded:", uploadedFiles);
            }}
          />
        </div>

        <div className="overflow-x-auto mt-4">
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
              {files.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No files uploaded
                  </td>
                </tr>
              )}
              {files.map((file, index) => (
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
                    onClick={() => {
                      setFiles((prev) => prev.filter((_, i) => i !== index));
                    }}
                  >
                    Delete
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={handleSubmit}
            className="text-white px-6 py-2 rounded-xl shadow hover:border-blue-600 focus:outline-none 
                       focus:ring-blue-500 focus:border-blue-500 transition"
            style={{ backgroundColor: "#5291CD" }}
          >
            Generate RFQ
          </button>
          <button
            onClick={handleSubmit}
            className="text-white px-6 py-2 rounded-xl shadow hover:border-blue-600 focus:outline-none 
                       focus:ring-blue-500 focus:border-blue-500 transition"
            style={{ backgroundColor: "#5291CD" }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

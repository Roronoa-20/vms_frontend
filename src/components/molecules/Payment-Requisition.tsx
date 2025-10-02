"use client";
import { useState, useRef, useEffect } from "react";
import MultipleFileUpload from "./MultipleFileUpload";

type Field = {
  label: string;
  type: "text" | "date" | "select" | "text-date" | "textarea" | "number";
  placeholder?: string;
  rows?: number;
};

export default function PaymentRequisition() {
  const [files, setFiles] = useState<File[]>([]);
  const [boeFiles, setBoeFiles] = useState<File[]>([]);
  const [showBOEDetails, setShowBOEDetails] = useState(false);
  const boeRef = useRef<HTMLDivElement | null>(null);

  const remainingFields: Field[] = [
    { label: "Division:*", type: "select", placeholder: "Search By" },
    { label: "PRF Number & Date:*", type: "text-date", placeholder: "PRF Number" },
    { label: "Favoring Of: *", type: "select", placeholder: "Search By" },
    { label: "Origin: *", type: "select", placeholder: "Search By" },
    { label: "Consignment: *", type: "select", placeholder: "Search By" },
    { label: "Mode of Shipment: *", type: "select", placeholder: "Search By" },
    { label: "Payable At: *", type: "select", placeholder: "Search By" },
    { label: "Payment By: *", type: "select", placeholder: "Search By" },
    { label: "Payment Required: *", type: "text" },
    { label: "P.O. W.O.No: *", type: "number" },
    { label: "P.O. W.O. Date:", type: "date" },
    { label: "CHA:", type: "select", placeholder: "Search By" },
    { label: "Type of Materials : *", type: "select", placeholder: "Search By" },
    { label: "Supplier Name: *", type: "text" },
    { label: "Duty Amount:*", type: "text" },
    { label: "Job No:*", type: "number" },
    { label: "Duty Amount in Word:*", type: "text" },
    { label: "Payment Details:*", type: "text" },
    { label: "RODTEP Details:*", type: "select", placeholder: "Search By" },
  ];

  const billdetails: Field[] = [
    { label: "Assessable Value: *", type: "text" },
    { label: "Deferred Duty Amt: *", type: "text" },
    { label: "Cargo Type: *", type: "text" },
    { label: "BOE No/Date: *", type: "text-date", placeholder: "PRF Number" },
    { label: "Deferred Duty: *", type: "text" },
    { label: "Remarks: *", type: "text" },
    { label: "Period: *", type: "text" },
    { label: "BCD: *", type: "text" },
    { label: "Health Cess: *", type: "text" },
    { label: "SW Surcharge: *", type: "text" },
    { label: "IGST: *", type: "text" },
    { label: "Penalty:", type: "text" },
    { label: "Total: *", type: "text" },
  ];

  const remarkField: Field[] = [
    {
      label: "Specific Remark:",
      type: "textarea",
      rows: 3,
      placeholder: "Enter remarks here...",
    },
  ];

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
    const fullWidthFields = ["Dimension (cm):*", "Remark", "Specific Remark:"];
    const isFullWidth = fullWidthFields.includes(field.label);

    return (
      <div
        key={index}
        className={`flex flex-col ${isFullWidth ? "col-span-1 md:col-span-3" : ""}`}
      >
        <label className="mb-1 font-medium text-gray-700">{renderLabel(field.label)}</label>

        {field.type === "text" && (
          <input
            type="text"
            placeholder={field.placeholder || ""}
            className="border border-gray-300 rounded-md px-3 py-2 hover:border-blue-500 focus:outline-none 
                       focus:ring-blue-500 focus:border-blue-500 transition"
          />
        )}

        {field.type === "number" && (
          <input
            type="number"
            placeholder={field.placeholder || ""}
            className="border border-gray-300 rounded-md px-3 py-2 hover:border-blue-500 focus:outline-none 
                       focus:ring-blue-500 focus:border-blue-500 transition"
          />
        )}

        {field.type === "date" && (
          <input
            type="date"
            className="border border-gray-300 rounded-md px-3 py-2 hover:border-blue-500 focus:outline-none 
                       focus:ring-blue-500 focus:border-blue-500 transition"
          />
        )}

        {field.type === "select" && (
          <select className="border border-gray-300 rounded-md px-3 py-2 hover:border-blue-500 focus:outline-none 
                       focus:ring-blue-500 focus:border-blue-500 transition">
            <option value="">{field.placeholder || "Select"}</option>
          </select>
        )}

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

        {field.type === "textarea" && (
          <textarea
            rows={field.rows || 3}
            placeholder={field.placeholder || ""}
            className={`border border-gray-300 rounded-md px-3 py-2 hover:border-blue-500 focus:outline-none 
                        focus:ring-blue-500 focus:border-blue-500 transition resize-y`}
          />
        )}
      </div>
    );
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    boeFiles.forEach((file) => formData.append("boeFiles", file));
    console.log("Submitting form with files:", files, boeFiles);
  };

  useEffect(() => {
    if (showBOEDetails && boeRef.current) {
      boeRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showBOEDetails]);

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
            className="text-white px-6 py-2 rounded-xl shadow hover:border-blue-600 focus:outline-none 
                        focus:ring-blue-500 focus:border-blue-500 transition"
            style={{ backgroundColor: "#5291CD" }}
          >
            {showBOEDetails ? "Update BOE" : "Update BOE"}
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

        {showBOEDetails && (
          <div ref={boeRef} className="bg-white p-4 rounded shadow mt-6">
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
                className="text-white px-6 py-2 rounded-xl shadow hover:border-blue-600 focus:outline-none 
                           focus:ring-blue-500 focus:border-blue-500 transition"
                style={{ backgroundColor: "#5291CD" }}
              >
                Update BOE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

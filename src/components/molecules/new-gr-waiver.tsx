"use client";
import { useState } from "react";

type Field = {
  label: string;
  type: "text" | "date" | "select" | "text-date" | "number";
  placeholder?: string;
  rows?: number;
};

export default function GRWaiver() {
  const [files, setFiles] = useState<File[]>([]);

  // Example fields for Requestor Closer Detail
  const RequestorCloserDetail: Field[] = [
    { label: "Closer Name:", type: "text" },
    { label: "Closer Date:", type: "date" },
    { label: "Remark:", type: "text" },
  ];

  const RequestorDetail: Field[] = [
    { label: "Requestor Name:", type: "text" },
    { label: "Email Id:", type: "text" },
    { label: "Reporting Head Name:", type: "text" },
    { label: "Email Id:", type: "text" },
    { label: "Request Type::", type: "select", placeholder: "Search By" },
    { label: "Division", type: "select", placeholder: "Search By" },
    { label: "Material:", type: "text" },
    { label: "Material Description:", type: "text" },
    { label: "Party:", type: "text" },
    { label: "Quantity:", type: "number" },
    { label: "Tentative Closer Date:", type: "text" },
  ];

  const ReportingHeadApproval: Field[] = [
    { label: "Approval Status:", type: "select", placeholder: "Search By" },
    { label: "Remark", type: "text" },
  ];

  const LogisticDetails: Field[] = [
    { label: "Approval Status:", type: "select", placeholder: "Search By" },
    { label: "Remark", type: "text" },
    { label: "Invoice No:", type: "text" },
    { label: "Invoice Date:", type: "text" },
    { label: "Amount In FC:", type: "text" },
    { label: "Port Of Discharge:", type: "text" },
    { label: "Port Of Loading:", type: "text" },
    { label: "Port Code:", type: "select", placeholder: "Search By" },
    { label: "Currency:", type: "select", placeholder: "Search By" },
    { label: "EX.Rate:", type: "text" },
    { label: "Amount In INR:", type: "text" },
  ];

  const AccountsDetails: Field[] = [
    { label: "Approval Status:", type: "select", placeholder: "Search By" },
    { label: "Remark", type: "text" },
    { label: "Bank:", type: "select", placeholder: "Search By" },
    { label: "GR Waiver No", type: "text" },
  ];

  const DispatchForm: Field[] = [
    { label: "SB No:", type: "text" },
    { label: "SB Date:", type: "text" },
    { label: "AWB No:", type: "text" },
    { label: "AWB Date:", type: "text" },
    { label: "Shipping Amount In FC:", type: "text" },
    { label: "Currency::", type: "select", placeholder: "Search By" },
    { label: "Shipping EX.Rate:", type: "text" },
    { label: "Shipping Amount In INR:", type: "text" },
  ];

  const AccountCloserDetail: Field[] = [
    { label: "Approval Status:", type: "select", placeholder: "Search By" },
    { label: "Remark", type: "text" },
    { label: "Status:", type: "select", placeholder: "Search By" },
  ];

  const renderField = (field: Field, index: number) => (
    <div key={index} className="flex flex-col space-y-1">
      <label className="text-sm font-medium text-gray-700">{field.label}</label>

      {field.type === "text" && (
        <input
          type="text"
          placeholder={field.placeholder || ""}
          className="border border-gray-300 rounded-md px-3 py-2 hover:border-blue-500 
                     focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
        />
      )}

      {field.type === "date" && (
        <input
          type="date"
          className="border border-gray-300 rounded-md px-3 py-2 hover:border-blue-500 
                     focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
        />
      )}

      {field.type === "number" && (
        <input
          type="number"
          className="border border-gray-300 rounded-md px-3 py-2 hover:border-blue-500 
                     focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
        />
      )}

      {field.type === "select" && (
        <select
          className="border border-gray-300 rounded-md px-3 py-2 hover:border-blue-500 
                     focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
        >
          <option value="">{field.placeholder || "Select"}</option>
        </select>
      )}

      {field.type === "text-date" && (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={field.placeholder || ""}
            className="w-1/2 border border-gray-300 rounded-md px-3 py-2 hover:border-blue-500 
                       focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
          />
          <input
            type="date"
            className="w-1/2 border border-gray-300 rounded-md px-3 py-2 hover:border-blue-500 
                       focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
      )}
    </div>
  );

  const handleSubmit = (section: string) => {
    console.log(`Submitting ${section} form...`);
  };

  const renderSection = (title: string, fields?: Field[]) => (
    <div className="bg-white p-4 rounded-lg shadow space-y-4 border border-gray-300">
      <h2 className="text-lg font-semibold">{title}</h2>

      {fields && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fields.map(renderField)}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => handleSubmit(title)}
          className="text-white px-6 py-2 rounded-xl shadow hover:border-blue-600 
                     focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
          style={{ backgroundColor: "#5291CD" }}
        >
          Submit
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gray-100 flex justify-center items-start p-2">
      <div className="w-full max-w-7xl bg-white p-6 rounded-sm shadow-lg space-y-8 border border-gray-200 overflow-y-auto">
        {renderSection("Requestor Detail", RequestorDetail)}
        {renderSection("Reporting Head Approval", ReportingHeadApproval)}
        {renderSection("Logistic Details", LogisticDetails)}
        {renderSection("Accounts Details", AccountsDetails)}
        {renderSection("Dispatch Form", DispatchForm)}
        {renderSection("Account Approval", ReportingHeadApproval)}

        <div className="bg-white p-4 rounded-lg shadow space-y-6 border border-gray-300">
          <div className="p-4 rounded-lg shadow space-y-4 border border-gray-200">
            <h2 className="text-lg font-semibold">Closure Form</h2>
            <div className="space-y-2">
              <h3 className="text-md font-semibold">Requestor Closer Detail</h3>
            </div>
            <div>
              <a
                href="/path-to-certificate.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Download Destruction Certificate
              </a>
            </div>
          </div>

          <div className="p-4 rounded-lg shadow space-y-4 border border-gray-200">
            <h2 className="text-lg font-semibold">Account Closer Detail</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {AccountCloserDetail.map(renderField)}
            </div>
            <div className="flex justify-end">
            <button
              onClick={() => handleSubmit("Account Closer Detail")}
              className="text-white px-6 py-2 rounded-xl shadow hover:border-blue-600 
                        focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
              style={{ backgroundColor: "#5291CD" }}
            >
               Submit
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={() => window.history.back()}
          className="border border-blue-500 text-blue-500 px-6 py-2 rounded-xl shadow transition hover:bg-blue-500 hover:text-white"
        >
          Back
        </button>
      </div>
    </div>
  </div>
  );
}

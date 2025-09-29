type Field = {
  label: string;
  type: "text" | "date" | "select" | "text-date" | "textarea" | "info";
  placeholder?: string;
  rows?: number;
  fullWidth?: boolean;
};

export default function ServiceBill() {
  const secondRow: Field[] = [
    { label: "RFQ Number & Date", type: "text-date", },
    { label: "MERIL Job # & Date", type: "text-date", },
  ];

  const remainingFields: Field[] = [
    { label: "Bill Number", type: "text" },
    { label: "Bill Date", type: "date" },
    { label: "RFQ Amount", type: "text" },
    { label: "Bill Amount", type: "text" },
    { label: "RFQ Weight", type: "text" },
    { label: "Actual Weight", type: "text" },
    { label: "Bill Received On", type: "text" },
    { label: "Bill Sent to Accounts on", type: "text" },
    { label: "Bill Booking Ref No", type: "text" },
    { label: "Bill Booking Date", type: "date" },
    { label: "Bill Amount", type: "text" },
    { label: "UTR Number", type: "text" },
    { label: "UTR Date", type: "date" },
    { label: "Amount Paid", type: "text" },
    { label: "The consolidated amount againts clearing document # is .This is for information purpose only!", type: "info" },
    { label: "HAWB NO", type: "text" },
  ];

  const remarkField: Field[] = [
    { label: "Service Provider Remark", type: "textarea", fullWidth: true },
    { label: "EXIM Team Remark", type: "textarea", fullWidth: true, rows: 3, placeholder: "Enter remarks here..." },
  ];

  const renderField = (field: Field, index: number) => (
    <div
      key={index}
      className={`flex flex-col ${field.fullWidth ? "col-span-1 md:col-span-3" : ""}`}
    >
      {field.type !== "info" && (
        <label className="text-sm font-medium text-gray-700 mb-1">{field.label}</label>
      )}

      {field.type === "text" && (
        <input
          type="text"
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
          className="border border-gray-300 rounded-md px-3 py-2 hover:border-blue-500 focus:outline-none 
                   focus:ring-blue-500 focus:border-blue-500 transition"
        />
      )}

      {field.type === "info" && (
        <p className="text-red-600 font-medium">{field.label}</p>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-4 w-full bg-slate-400">
      <div className="bg-white p-6 rounded shadow space-y-6">
        {/* RFQ and JRN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {secondRow.map(renderField)}
        </div>

        {/* Remaining fields in 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {remainingFields.map(renderField)}
          {remarkField.map(renderField)}
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button
            className="text-white px-6 py-2 rounded-md shadow hover:border-blue-500 focus:outline-none 
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

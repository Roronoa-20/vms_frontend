type Field = {
  label: string;
  type: "text" | "date" | "select" | "text-date" | "textarea";
  placeholder?: string;
  rows?: number;
};


export default function ShipmentStatus() {
  const topFields: Field[] = [
    { label: "Enter Document No", type: "select", placeholder: "Search By" },
  ];

  const secondRow: Field[] = [
    { label: "RFQ Number & Date", type: "text-date", placeholder: "RFQ Number" },
    { label: "JRN & Date", type: "text-date", placeholder: "JRN Number" },
  ];

  const thirdRow: Field[] = [
    { label: "Consignee Name (RFQ)", type: "text" },
    { label: "Consignor Name (JRN)", type: "text" },
  ];

  const remainingFields: Field[] = [
    { label: "Port Of Loading", type: "text" },
    { label: "Port Of Discharge", type: "text" },
    { label: "INCOTERMS", type: "text" },
    { label: "Shipment Mode", type: "select", placeholder: "Search By" },
    { label: "House Bill #", type: "text" },
    { label: "Master Bill #", type: "text", placeholder: "Master Airway Bill Number" },
    { label: "House Bill Date", type: "date" },
    { label: "MAWB Date", type: "date" },
    { label: "Estimated Arrival", type: "date" },
    { label: "Estimated Departure", type: "date" },
    { label: "Actual Dep at Origin", type: "date" },
    { label: "Booking Date", type: "date" },
    { label: "Estimated Pickup", type: "date" },
    { label: "Actual Pickup", type: "date" },
    { label: "Number of Packs", type: "text" },
    { label: "Packs Unit", type: "text" },
    { label: "Actual Weight", type: "text", placeholder: "Actual Weight/Gross Weight" },
    { label: "Chargeable Weight", type: "text", placeholder: "Actual Chargeable Weight" },
    { label: "Carrier Name", type: "text" },
    { label: "CHA Name", type: "text" },
    { label: "Shipment Status", type: "select", placeholder: "Search By" },
    { label: "Actual Volume", type: "text" },
    { label: "Month/Year", type: "text" },
  ];

  const remarkField: Field[] = [
    { label: "Remark", type: "textarea", rows: 3, placeholder: "Enter remarks here..." },
  ];

  const renderField = (field: Field, index: number) => (
    <div
      key={index}
      className={`flex flex-col ${field.label === "Remark" ? "col-span-1 md:col-span-3" : ""}`}
    >
      <label className="text-sm font-medium text-gray-700 mb-1">{field.label}</label>

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
          className="border border-gray-300 rounded-md px-3 py-2 hover:border-blue-500 focus:outline-none 
                     focus:ring-blue-500 focus:border-blue-500 transition"
        />
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-2 w-full bg-gray-100">
      <div className="bg-white p-4 rounded shadow space-y-6">
        {/* Top field */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topFields.map(renderField)}
        </div>

        {/* RFQ and JRN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {secondRow.map(renderField)}
        </div>

        {/* Consignee and Consignor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {thirdRow.map(renderField)}
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

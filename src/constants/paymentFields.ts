export type Field = {
  label: string;
  type: "text" | "date" | "select" | "text-date" | "textarea" | "number";
  placeholder?: string;
  rows?: number;
};

export const remainingFields: Field[] = [
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

  export const billdetails: Field[] = [
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

  export const remarkField: Field[] = [
    {
      label: "Specific Remark:",
      type: "textarea",
      rows: 3,
      placeholder: "Enter remarks here...",
    },
  ];

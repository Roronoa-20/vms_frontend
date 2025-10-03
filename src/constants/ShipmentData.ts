import { shipmentItem } from "../types/ShipmentItems";

export const sampleData: shipmentItem[] = [
  {
    shipment_no: "GRN123",
    shipment_company: "ABC Corp",
    shipment_date: "2025-09-25",
    sap_booking_id: "SAP001",
    sap_status: "Confirmed",
    invoice_url: "https://example.com/invoice1.pdf",
  },
  {
    shipment_no: "GRN456",
    shipment_company: "XYZ Ltd",
    shipment_date: "2025-09-24",
    sap_booking_id: "SAP002",
    sap_status: "Pending",
  },
];

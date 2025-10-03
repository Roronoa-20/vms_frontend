import { pickupItem } from "../types/pickupItem";

export const pickupsData: pickupItem[] = [
  {
    pickup_no: "PN123",
    pickup_company: "ABC Corp",
    pickup_date: "2025-09-25",
    sap_booking_id: "SAP001",
    sap_status: "Confirmed",
    invoice_url: "https://example.com/invoice1.pdf",
  },
  {
    pickup_no: "PN456",
    pickup_company: "XYZ Ltd",
    pickup_date: "2025-09-24",
    sap_booking_id: "SAP002",
    sap_status: "Pending",
  },
];

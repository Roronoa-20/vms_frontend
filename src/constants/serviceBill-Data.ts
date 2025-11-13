import { serviceItem } from "../types/serviceBill-Item";

export const ServicebillData: serviceItem[] = [
  {
    ServiceBill_no: "GR123",
    ServiceBill_company: "ABC Corp",
   ServiceBill_date: "2025-09-25",
    sap_booking_id: "SAP001",
    sap_status: "Confirmed",
    invoice_url: "https://example.com/invoice1.pdf",
  },
  {
   ServiceBill_no: "GR456",
    ServiceBill_company: "XYZ Ltd",
    ServiceBill_date: "2025-09-24",
    sap_booking_id: "SAP002",
    sap_status: "Pending",
  },
];

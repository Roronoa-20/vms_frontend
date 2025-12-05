export interface serviceItem {
  ServiceBill_no: string;
  ServiceBill_company: string;
  ServiceBill_date: string;
  sap_booking_id: string;
  sap_status: string;
  invoice_url?: string;
}

export interface ViewServiceBillRequestProps {
  serviceData?: serviceItem[];
  onNewService?: () => void;
}

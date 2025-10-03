export interface GRItem {
  gr_no: string;
  gr_company: string;
  gr_date: string;
  sap_booking_id: string;
  sap_status: string;
  invoice_url?: string;
}

export interface ViewGrWaiverProps {
  GRData?: GRItem[];
  onNewGR?: () => void;
}

export interface pickupItem {
  pickup_no: string;
  pickup_company: string;
  pickup_date: string;
  sap_booking_id: string;
  sap_status: string;
  invoice_url?: string;
}

export interface ViewPickupRequestProps {
  pickupData?: pickupItem[];
  onNewPickup?: () => void;
}

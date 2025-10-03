export interface shipmentItem {
  shipment_no: string;
  shipment_company: string;
  shipment_date: string;
  sap_booking_id: string;
  sap_status: string;
  invoice_url?: string;
}

export interface ShipmentStatusTableProps {
  shipmentData?: shipmentItem[];
  onNewShipment?: () => void;
}

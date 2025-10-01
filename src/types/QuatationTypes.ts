import { PurchaseRequisitionRow } from "./RFQtype";

export type QuotationDetail = {
  name: string;
  rfq_number: string;
  vendor_code: string ;
  quote_amount: string ;
  rank: string ;
  mode_of_shipment: string;
  office_email_primary: string ;
  airlinevessel_name: string;
  chargeable_weight: string;
  ratekg: string;
  fuel_surcharge: string;
  destination_port: string;
  actual_weight: string;
  sc: string;
  xray: string;
  pickuporigin: string ;
  ex_works: string ;
  total_freight: string;
  from_currency: string ;
  to_currency: string ;
  exchange_rate: string ;
  total_freightinr: string ;
  destination_charge: string ;
  shipping_line_charge: string ;
  cfs_charge: string ;
  total_landing_price: string ;
  invoice_no: string;
  transit_days: string ;
  other_charges_in_total: string;
  expected_delivery_in_no_of_days: string;
  remarks: string;
  vendor_name: string;
  attachments: DocumentAttachment[]
  status: string;
  payment_terms:string;
  negotiation:boolean;
  quotation_item_list: PurchaseRequisitionRow[]
  rfq_type:string;
};
export type DocumentAttachment = {
  document_name: string;
  attach: string;
  file_url: string;
};

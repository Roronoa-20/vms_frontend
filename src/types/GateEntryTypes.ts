export type TFetchedQRData = {
    name:string
    company_name:string,
    vendor_name:string,
    supplier_gst:string,
    invoice_number:string,
    invoice_date:string,
    courier_name:string,
    invoice_amount:string,
    vendor_address:string,
    owner:string,
    vehical_details:TVehicalDetails[],
    purchase_number:TPurchaseDetailTable[]
    creation:string,
    bill_of_entry_no:string,
    bill_of_entry_date:string,
    e_way_bill_no:string,
    e_way_bill_date:string
}

export type TVehicalDetails = {
  name: string;
  vehicle_no: string;
  driver_name: string;
  driver_phone: string ;
  driver_license: string;
  loading_state: string ;
  loading_location: string;
  transporter_name: string;
  destination_plant: string;
  lr_number: string;
  lr_date: string;
  attachment: string;
}

export type TPurchaseDetailTable = {
  name: string;
  owner: string;
  creation: string;
  modified: string;
  modified_by: string;
  docstatus: number;
  idx: number;
  purchase_number: string;
  date_time: string;
  parent: string;
  parentfield: string;
  parenttype: string;
  doctype: string;
}


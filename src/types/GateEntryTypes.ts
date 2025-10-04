export type TFetchedQRData = {
    // name:string
    // company_name:string,
    // vendor_name:string,
    // supplier_gst:string,
    // invoice_number:string,
    // invoice_date:string,
    // courier_name:string,
    // invoice_amount:string,
    // vendor_address:string,
    // owner:string,
    // vehicle_details_item:TVehicalDetails[],
    // gate_entry_details:TPurchaseDetailTable[]
    // creation:string,
    // bill_of_entry_no:string,
    // bill_of_entry_date:string,
    // e_way_bill_no:string,
    // e_way_bill_date:string,
    // inward_location:string
    handover_remark:string
    handover_to_person:string
    status:string
    received_remark:string
    is_submitted:number
    name:string
    inward_location:string
        name_of_company:string
        name_of_vendor:string
        vendor_address:string
        vendor_gst:string
        challan_no:string
        challan_date:string
        bill_of_entry_no:string
        bill_of_entry_date:string
        eway_bill_no:string
        eway_bill_date:string
        transport:string
        created_by:string
        created_date:string
        invoice_value:string
        gate_entry_details:TPurchaseDetailTable[]
        vehicle_details_item:TVehicalDetails[],
        remarks:string
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
  vehicle_type:string
}

export type TPurchaseDetailTable = {
name: string;
  owner: string;
  creation: string;
  modified: string;
  modified_by: string;
  docstatus: number;
  idx: number;
  row_id: string | null;
  po_number: string;
  product_code: string;
  product_name: string;
  description: string;
  quantity: string;
  hsnsac: string;
  uom: string;
  rate: string;
  amount: string;
  dispatch_qty: string | null;
  pending_qty: string;
  coa_document: string | null;
  msds_document: string | null;
  parent: string;
  parentfield: string;
  parenttype: string;
  doctype: string;
  received_qty:string;
  purchase_order:string
}


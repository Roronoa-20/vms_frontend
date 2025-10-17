
export interface GRNForm {
  naming_series?: string;
  grn_company?: string;
  grn_no: string;
  grn_date?: string;
  sap_booking_id?: string;
  sap_status?: string;
  invoice_url?: string;
  inoice_date?: string;
  plant?: string;
  grn_items?: string;
  movement_type?: string;
  pr_item?: string;
  pr_requester?: string;
  po_no?: string;
  po_date?: string;
  material_description?: string;
  po_delivery_date?: string;
  quantity?: number;
  uom?: string;
  material_receipt_date?: string;
  quantity_4?: number;
  grn_status?: string;
  reason_for_rejection?: string;
  po_created_by?: string;
  gate_entry_date?: string;
  gate_entry?: string;
  transporter?: string;
  pending_days?: number;
  account_doc_no?: string;
  ref_invoice_no?: string;
  grn_number: string;
  grn_date_2?: string;
  pr_no?: string;
  pr_date?: string;
  pr_cost_center?: string;
  po_item?: string;
  material?: string;
  batch_no?: string;
  vendor_batch_no?: string;
  vendor_code?: string;
  vendor_name?: string;
  invoice_no?: string;
  qunatity_2?: number;
  quantity_3?: number;
  rtv_inv_no?: string;
  qc_clearance_date?: string;
  grn_submit_to_ac?: string;
  gr_covering_note_ref?: string;
  remarks?: string;
  vehicle_no?: string;
  gate_entry_description?: string;
  account_doc_year?: string;
  company_code?: string;
  miro_no?: string;
  attachments: FileList[];

}

export type FileList = {
  actual_file_name: string;
  file_doc_name: string;
  file_name: string;
  full_url: string;
  row_name: string;
}

export type TGRNFormDetail = {
  message: {
    data: GRNForm;
  };
};
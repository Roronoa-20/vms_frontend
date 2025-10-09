export interface PurchaseRequisitionResponse {
  status: string;
  docname: string;
  Requisitioner: string;
  purchase_requisition_type: string;
  Company: CompanyInfo[];
  "Purchase Group": string;
  "Cart ID": string;
  "Form Status": string;
  form_is_submitted:boolean;
  data: PurchaseRequisitionDataItem[];
}

export interface CompanyInfo {
  name: string;
  company_name: string;
  description: string | null;
}


export interface PurchaseRequisitionDataItem {
  name: string;
  row_name: string;
  head_unique_id: string;
  purchase_requisition_item_head: string | null;
  item_number_of_purchase_requisition_head: string | null;
  purchase_requisition_date_head: string | null;
  delivery_date_head: string | null;
  store_location_head: string | null;
  item_category_head: string | null;
  material_group_head: string | null;
  uom_head: string | null;
  cost_center_head: string | null;
  main_asset_no_head: string | null;
  asset_subnumber_head: string | null;
  profit_ctr_head: string | null;
  short_text_head: string | null;
  quantity_head: string | null;
  price_of_purchase_requisition_head: string | null;
  gl_account_number_head: string | null;
  material_code_head: string | null;
  account_assignment_category_head: string | null;
  purchase_group_head: string | null;
  product_name_head: string | null;
  product_price_head: string | null;
  final_price_by_purchase_team_head: string | null;
  lead_time_head: string | null;
  plant: string | null;
  purchase_requisition_type: string | null;
  purchase_requisition_date: string | null;
  plant_head: string | null;
  subhead_fields: SubheadField[];
  requisitioner: string;
  company_code_head: string;
  valuation_area_head: string;
  asset_number: string;
  purchase_requisitioner_name: string;
  status_head: string;
  quantity_head_head:string;
  c_delivery_date_head:string;
  tracking_id_head:string;
  desired_vendor_head:string;
  fixed_value_head:string;
  spit_head:string;
  agreement_head:string;
  item_of_head:string;
  mpn_number_head:string;
  company_code_area_head:string;
  requisitioner_name_head:string;
  sap_pr_code:string;
}


export interface SubheadField {
  row_id:string;
  row_name: string;
  sub_head_unique_id: string;
  purchase_requisition_item_subhead: string | null;
  item_number_of_purchase_requisition_subhead: string | null;
  purchase_requisition_date_subhead: string | null;
  delivery_date_subhead: string ;
  store_location_subhead: string | null;
  item_category_subhead: string | null;
  material_group_subhead: string | null;
  uom_subhead: string | null;
  cost_center_subhead: string | null;
  main_asset_no_subhead: string | null;
  asset_subnumber_subhead: string | null;
  profit_ctr_subhead: string | null;
  short_text_subhead: string | null;
  quantity_subhead: string ;
  price_of_purchase_requisition_subhead: string | null;
  gl_account_number_subhead: string | null;
  material_code_subhead: string | null;
  account_assignment_category_subhead: string | null;
  purchase_group_subhead: string | null;
  service_number_subhead: string | null
  gross_price_subhead: number | null
  currency_subhead: string | null
  service_type_subhead: string | null
  net_value_subhead: number | null
  subhead_unique_field: string
  material_name_subhead: string
  price_subhead: string
  original_quantity:string
  original_delivery_date:string
}

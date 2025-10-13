// Child table interface
export interface MaterialRequestChildItem {
  child_name: string;
  company_code: string;
  company_name: string;
  plant: string | null;
  material_description: string;
  material_type: string;
  comment_by_user: string;
}

// Parent table interface
export interface MaterialRequestItem {
  name: string;                           // REQ-9275
  owner: string;
  creation: string;
  modified: string;
  modified_by: string;
  docstatus: number;
  idx: number;
  material_master_ref_no: string;
  material_onboarding_ref_no: string;
  approval_status: string;
  revert_remark: string | null;
  request_id: string;
  request_date: string;
  requestor_company: string;
  sub_department: string;
  immediate_reporting_head: string;
  contact_information_phone: string;
  requested_by: string;
  requestor_department: string;
  requestor_hod: string;
  contact_information_email: string;
  requested_by_place: string;
  zmsg: string | null;
  maktx: string | null;
  ztext: string | null;
  sap_summary: string | null;
  doctype: string;
  material_request_items: MaterialRequestChildItem[]; // Nested child table
}

// Pagination info
export interface Pagination {
  total_count: number;
  limit: number;
  offset: number;
  has_next: boolean;
  has_previous: boolean;
}

// Full API response
export interface MaterialRequestListResponse {
  message: {
    message: string;
    data: MaterialRequestItem[];
    pagination: Pagination;
  };
}

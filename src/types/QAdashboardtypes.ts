// QAdashboardtypes.ts

export interface QMSOnboardingRecord {
  name: string;
  ref_no: string;
  company_name: string;
  vendor_name: string;
  onboarding_form_status: string;
  awaiting_approval_status: string | null;
  modified: string;
  purchase_t_approval: string;
  accounts_t_approval: string;
  purchase_h_approval: string;
  mandatory_data_filled: number;
  purchase_team_undertaking: number;
  accounts_team_undertaking: number;
  purchase_head_undertaking: number;
  form_fully_submitted_by_vendor: number;
  sent_registration_email_link: number;
  rejected: number;
  data_sent_to_sap: number;
  expired: number;
  payee_in_document: number;
  check_double_invoice: number;
  gr_based_inv_ver: number;
  service_based_inv_ver: number;
  qms_form_filled: number;
  sent_qms_form_link: number;
  registered_by: string;
  register_by_account_team: number;
  vendor_country: string | null;
  rejected_by: string | null;
  rejected_by_designation: string | null;
  reason_for_rejection: string | null;
  sap_error_mail_sent: number;
  qms_required: string;
  company_vendor_codes: string;
}

export interface BaseQMSResponse {
  status: string;
  message: string;
  total_count: number;
  page_no: number;
  page_length: number;
}

export interface TotalQMSOnboardingResponse {
  message: BaseQMSResponse & {
    total_qms_onboarding: QMSOnboardingRecord[];
  };
}

export interface PendingQMSOnboardingResponse {
  message: BaseQMSResponse & {
    pending_qms_onboarding: QMSOnboardingRecord[];
  };
}

export interface DraftSupplierQMSResponse {
  message: BaseQMSResponse & {
    draft_supplier_qms: QMSOnboardingRecord[];
  };
}

export interface ApprovedSupplierQMSResponse {
  message: BaseQMSResponse & {
    approved_supplier_qms: QMSOnboardingRecord[];
  };
}

export interface RejectedSupplierQMSResponse {
  message: BaseQMSResponse & {
    rejected_supplier_qms: QMSOnboardingRecord[];
  };
}

export interface FullyFilledSupplierQMSResponse {
  message: BaseQMSResponse & {
    completed_qms_onboarding: QMSOnboardingRecord[];
  };
}

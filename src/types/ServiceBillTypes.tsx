
export interface CompanyWiseCount {
  name: string;
  company_code: string;
  company_name: string;
  count: number;
}

export interface ServiceBillCountData {
  total_count: number;
  [key: string]: number | CompanyWiseCount;
}

export interface StatusWiseCount {
  status: string | null;
  count: number;
}

export interface ServiceBillCountResponse {
  message: {
    message: string;
    data: ServiceBillCountData;
  };
}

export interface ServiceBillItem {
  creation: string;
  bill_sent_to_accounts_remarks: string;
  modified_by: string;
  utr_date: string;
  modified: string;
  exim_team_remark: string;
  bill_received_on_remarks: string;
  rfq_date: string;
  bill_booking_date: string;
  bill_number: string;
  bill_amount: string;
  meril_date: string;
  amount_paid: string;
  idx: string;
  actual_weight: string;
  rfq_amount: string;
  service_provider_remark: string;
  bill_received_on: string;
  company: string;
  bill_date: string;
  rfq_weight: string;
  utr_number: string;
  docstatus: string;
  bill_booking_ref_no: string;
  name: string;
  owner: string;
  rfq_number: string;
  meril_job: string;
  hawb_no: string;
  bill_sent_to_accounts_on: string;
  status: string;
  service_provider_name: string;
}

export interface ServiceBillTableResponse {
  message: {
    message: string;
    data: ServiceBillItem[];
    pagination: {
      total_count: number;
      limit: number;
      offset: number;
      has_next: boolean;
      has_previous: boolean;
    };
  };
}

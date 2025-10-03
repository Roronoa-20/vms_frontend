
export interface CompanyWiseCount {
  company: string | null;
  company_name?: string;
  count: number;
}

export interface StatusWiseCount {
  status: string | null;
  count: number;
}

export interface ShipmentCountResponse {
  message: {
    message: string;
    data: {
      total_count: number;
      company_wise_count: CompanyWiseCount[];
      status_wise_count?: StatusWiseCount[];
    };
  };
}

export interface ShipmentItem {
  tracking_status: string;
  actual_pickup: string | null;
  port_of_loading: string | null;
  shipment_status: string;
  jrn: string;
  rfq_date: string;
  creation: string;
  value_of_goods: string;
  port_of_discharge: string | null;
  enter_rfq_no: string;
  name: string;
  rfq_number: string;
  jrn_date: string;
  company: string;
  consignee_name: string;
  consignor_name: string;
  shipment_type: string;
  incoterms: string;
  shipment_mode: string;
}

export interface ShipmentTableResponse {
  message: {
    message: string;
    data: ShipmentItem[];
    pagination: {
      total_count: number;
      limit: number;
      offset: number;
      has_next: boolean;
      has_previous: boolean;
    };
  };
}

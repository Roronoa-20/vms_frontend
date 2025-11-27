export interface GRItem {
	gr_no: string;
	gr_company: string;
	gr_date: string;
	sap_booking_id: string;
	sap_status: string;
	invoice_url?: string;
}

export interface ViewGrWaiverProps {
	GRData?: GRItem[];
	onNewGR?: () => void;
}

export type companyDropdownType = {
	name: string;
	company_name: string;
}

export type requestornameDropdownType = {
	name: string;
}

export type requestDropdownType = {
	name: string;
}

export type formDataType = {
	name: string;
	requestor_name: string;
	email_id: string;
	reporting_head_name: string;
	reports_to_email: string;
	request_type: string;
	division: string;
	material: string;
	material_description: string;
	party: string;
	quantity: number;
	tentative_closer_date: string;
	approval_status: string;
	remark: string;
	logistic_approval_status: string;
	invoice_no: number;
	amount_in_fc: number;
	port_of_loading: string;
	currency: string;
	amount_in_inr: number;
	logistic_remark: string;
	invoice_date: string;
	port_of_discharge: string;
	port_code: number;
	exrate: string;
	accountsapproval_status: string;
	bank: string;
	accounts_remark: string;
	gr_waiver_no: number;
	sb_no: number;
	awb_no: number;
	shipping_amount_in_fc: string;
	shipping_exrate: string;
	shiping_bill: string;
	sb_date: string;
	awb_date: string;
	dispatch_currency: string;
	shipping_amount_in_inr: string;
	account_approval_status: string;
	account_approval_remark: string;
	boe_no: number;
	boe_date: string;
	account_closer_approval_status: string;
	status: string;
	account_closer_remark: string;
	declaration__letter: UploadedFileType | null;
	reporting_head_email_id: string;
}

export type UploadedFileType = {
	file_url: string;
	full_url: string;
	file_name: string;
  };
  

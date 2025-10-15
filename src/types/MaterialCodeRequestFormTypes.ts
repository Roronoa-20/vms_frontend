export interface EmployeeDetail {
  name: string;
  employee_code: string;
  first_name: string;
  last_name: string;
  full_name: string;
  user_id: string;
  department?: string | null;
  sub_department?: string | null;
  designation?: string | null;
  company_email?: string | null;
  branch?: string | null;
  team?: string | null;
  cell_number?: string | null;
}

export interface EmployeeAPIResponse {
  message: {
    message: string;
    data: EmployeeDetail;
  }
}


export type MaterialRegistrationFormData = {
  material_name: string;
  material_code: string;
  material_type: string;
  uom: string;
  requestor_name: string;
  requestor_email: string;
  [key: string]: any;
};

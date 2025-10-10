export interface UserData {
  name: string;
  email: string;
  team?: string;
  [key: string]: any;
}

export interface EmployeeData {
  full_name: string;
  role: string;
  company: string;
  [key: string]: any;
}

export interface Company {
  name: string;
  company_name: string;
  short_form: string;
  company_code: string;
}

export interface MaterialRequest {
  material_name_description?: string;
  material_code_revised?: string;
  material_company_code?: string;
  material_type?: string;
  plant_name?: string;
  material_category?: string;
  base_unit_of_measure?: string;
  comment_by_user?: string;
  material_specifications?: string;
  is_revised_code_new?: boolean | string;
}

export interface MaterialOnboardingDetails {
  name?: string;
  approval_status?: string;
  requestor_master?: MaterialRequest[];
  [key: string]: any;
}

export interface ApiResponse<T> {
  data?: T[];
  message?: T;
}

export interface VendorRegistrationProps {
  sid: string;
  companyName: ApiResponse<Company>;
  PlantCode: ApiResponse<any>;
  FullName: string;
  useremail: string;
  UserDetailsJSON: ApiResponse<UserData>;
  EmployeeDetailsJSON: ApiResponse<EmployeeData>;
  DivisiondetailsJSon: ApiResponse<any>;
  IndustryDetailsJson: ApiResponse<any>;
  UnitDetailsJSON: ApiResponse<any>;
  MRPTypeJSON: ApiResponse<any>;
  ValuationClassJson: ApiResponse<any>;
  ProcurementTypeJSOn: ApiResponse<any>;
  ValuatnCategoryJSON: ApiResponse<any>;
  MaterialGroupJson: ApiResponse<any>;
  ProfitCenterJson: ApiResponse<any>;
  PriceControlJson: ApiResponse<any>;
  AvailabilityCheckJson: ApiResponse<any>;
  MaterialTypeJSON: ApiResponse<any>;
  MRPControllerJson: ApiResponse<any>;
  StorageJson: ApiResponse<any>;
  ClassTypeJson: ApiResponse<any>;
  PurchaseGroupJson: ApiResponse<any>;
  SerialProfileJson: ApiResponse<any>;
  InspectionTypeJson: ApiResponse<any>;
  MaterialCategoryJson: ApiResponse<any>;
  MaterialCodeJSON: ApiResponse<any>;
  MaterialDetailsJSON: ApiResponse<any>;
  materialOnboardingDetailsJson: MaterialOnboardingDetails;
}


// Purchase Requisition Type
interface PurchaseRequisitionType {
  name: string;
  purchase_requisition_type_code: string;
  purchase_requisition_type_name: string;
  description: string;
}

// Plant
interface Plant {
  name: string;
  plant_code: string;
  plant_name: string | null;
  description: string | null;
}

// Company Code Area
interface CompanyCodeArea {
  name: string;
  company_area_code: string;
  company_area_name: string;
  description: string;
}

// Company
interface Company {
  name: string;
  company_code: string;
  company_name: string;
  description: string | null;
}

// Item Category Master
interface ItemCategoryMaster {
  name: string;
  item_code: string;
  item_name: string;
  description: string;
}

// Material Group Master
interface MaterialGroupMaster {
  name: string;
  material_group_name: string;
  material_group_description: string;
}

// UOM Master
interface UOMMaster {
  name: string;
  uom_code: string;
  uom: string;
  description: string | null;
}

// Cost Center
interface CostCenter {
  name: string;
  cost_center_code: string;
  cost_center_name: string;
  description: string;
}

// Profit Center
interface ProfitCenter {
  name: string;
  profit_center_code: string;
  profit_center_name: string;
  description: string;
}

// GL Account Number
interface GLAccountNumber {
  name: string;
  gl_account_code: string;
  gl_account_name: string;
  description: string;
}

// Material Code
interface MaterialCode {
  name: string;
  material_code: string;
  material_name: string;
  description: string;
}

// Account Assignment Category
interface AccountAssignmentCategory {
  name: string;
  account_assignment_category_code: string;
  account_assignment_category_name: string;
  description: string;
}

// Purchase Group
interface PurchaseGroup {
  name: string;
  purchase_group_code: string;
  purchase_group_name: string;
  description: string;
}

// Account Category
interface AccountCategory {
  name: string;
  account_category_code: string;
  account_category_name: string;
  description: string;
}

export type PurchaseRequestDropdown = {
    message:{
        purchase_requisition_type: PurchaseRequisitionType[];
  plant: Plant[];
  company_code_area: CompanyCodeArea[];
  company: Company[];
  item_category_master: ItemCategoryMaster[];
  material_group_master: MaterialGroupMaster[];
  uom_master: UOMMaster[];
  cost_center: CostCenter[];
  profit_center: ProfitCenter[];
  gl_account_number: GLAccountNumber[];
  material_code: MaterialCode[];
  account_assignment_category: AccountAssignmentCategory[];
  purchase_group: PurchaseGroup[];
  account_category: AccountCategory[];
    }
}
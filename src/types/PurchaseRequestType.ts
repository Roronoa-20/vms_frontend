
// Purchase Requisition Type
export interface PurchaseRequisitionType {
  name: string;
  purchase_requisition_type_code: string;
  purchase_requisition_type_name: string;
  description: string;
}

// Plant
export interface Plant {
  name: string;
  plant_code: string;
  plant_name: string | null;
  description: string | null;
}

// Company Code Area
export interface CompanyCodeArea {
  name: string;
  company_area_code: string;
  company_area_name: string;
  description: string;
}

// Company
export interface Company {
  name: string;
  company_code: string;
  company_name: string;
  description: string | null;
}

// Item Category Master
export interface ItemCategoryMaster {
  name: string;
  item_code: string;
  item_name: string;
  description: string;
}

// Material Group Master
export interface MaterialGroupMaster {
  name: string;
  material_group_name: string;
  material_group_description: string;
}

// UOM Master
export interface UOMMaster {
  name: string;
  uom_code: string;
  uom: string;
  description: string | null;
}

export interface ProductCategory {
  name: string;
  product_category_code: string;
  product_category_name: string;
  description: string | null;
}
// Cost Center
export interface CostCenter {
  name: string;
  cost_center_code: string;
  cost_center_name: string;
  description: string;
}

// Profit Center
export interface ProfitCenter {
  name: string;
  profit_center_code: string;
  profit_center_name: string;
  description: string;
}

// GL Account Number
export interface GLAccountNumber {
  name: string;
  gl_account_code: string;
  gl_account_name: string;
  description: string;
}

// Material Code
export interface MaterialCode {
  name: string;
  material_code: string;
  material_name: string;
  description: string;
  material_description: string;
  material_code_name: string;
  material_type: string;
  material_group: string;
  plant: string;
  valuation_class: string;
  profit_center: string;
}

export interface serviceCode {
  name: string,
  service_code: string,
  service_name: string
}

export interface serviceCategory {
  name: string,
  service_category_name: string
}

export interface plantCode {
  name: string,
  plant_name: string
}

export interface quantityUnit {
  name: string,
  quantity_unit_name: string
}

// Account Assignment Category
export interface AccountAssignmentCategory {
  name: string;
  account_assignment_category_code: string;
  account_assignment_category_name: string;
  description: string;
}

// Purchase Group
export interface PurchaseGroup {
  name: string;
  purchase_group_code: string;
  purchase_group_name: string;
  description: string;
  company: string;
  purchase_group: string
}

export interface PurchaseOrganisation {
  name: string;
  purchase_organisation_code: string;
  purchase_organisation_name: string;
  description: string;
  purchase_organization_name: string;
  purchase_organization_code: string;
}
// Account Category
export interface AccountCategory {
  name: string;
  account_category_code: string;
  account_category_name: string;
  description: string;
}

export interface Currency {
  name: string;
  currency_code: string;
  currency_name: string;
}

export interface StoreLocation {
  name: string;
  store_name: string;
  store_location_name: string;
  description: string;
}

export interface StorageLocation {
  name: string;
  storage_name: string;
  storage_location_name: string;
  storage_location: string;
  description: string;
  company: string;
}

export interface ValuationArea {
  name: string;
  valuation_area_code: string;
  valuation_area_name: string;
  description: string;
}

export interface ValuationClass {
  name: string;
  valuation_class_code: string;
  valuation_class_name: string;
  description: string;
}

export interface UOMMaster {
  name: string;
  uom_code: string;
  uom: string;
  description: string | null;
}
export interface ModeOfShipment {
  name: string;
  mode_of_shipment: string;
  description: string | null;
}
export interface DestinationPort {
  name: string;
  destination_port_code: string;
  destination_port_name: string;
  description: string | null;
}
export interface Country {
  name: string;
  country_code: string;
  country_name: string;
  description: string | null;
  display_text: string;
}
export interface PortCode {
  name: string;
  port_code: string;
  port_name: string;
  description: string | null;
}
export interface PortOfLoading {
  name: string;
  port_of_loading_code: string;
  port_of_loading_name: string;
  description: string | null;
}
export interface IncoTerms {
  name: string;
  incoterm_code: string;
  incoterm_name: string;
  description: string | null;
}
export interface PackageType {
  name: string;
  package_code: string;
  package_name: string;
  description: string | null;
}
export interface RFQType {
  name: string;
  vendor_type_code: string;
  vendor_type_name: string;
}

export interface ShipmentType {
  name: string;
  shipment_type_code: string;
  shipment_type_name: string;
  description: string
}

export interface ServiceCode {
  name: string;
  service_code: string;
  service_code_name: string;
}

export interface ServiceCategory {
  name: string;
  service_category: string;
  service_category_name: string;
}

export interface PlantCode {
  name: string;
  plant_code: string;
  plant_name: string;
}
export type PurchaseRequestDropdown = {
  message: {
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
    purchase_organisation: PurchaseOrganisation[];
    currency_master: Currency[];
    store_location: StoreLocation[];
    storage_location: StorageLocation[];
    valuation_area: ValuationArea[];
    product_category: ProductCategory[];
    mode_of_shipment: ModeOfShipment[];
    destination_port: DestinationPort[];
    country_master: Country[];
    port_master: PortCode[];
    port_of_loading: PortOfLoading[];
    incoterm_master: IncoTerms[];
    package_type: PackageType[];
    rfq_type: RFQType[];
    service_code: serviceCode[];
    service_category: serviceCategory[]
    plant_code: plantCode[];
    quantity_unit: quantityUnit[]
    shipment_type: ShipmentType[]
  }
}

export interface PurchaseRequisitionFormTable {
  name: string;
  owner: string;
  creation: string;
  modified: string;
  modified_by: string;
  docstatus: number;
  idx: number;
  purchase_requisition_item: string | null;
  item_number_of_purchase_requisition: string;
  purchase_requisition_date: string;
  delivery_date: string;
  store_location: string;
  item_category: string;
  material_group: string;
  uom: string;
  cost_center: string;
  main_asset_no: string;
  asset_subnumber: string;
  profit_ctr: string;
  short_text: string;
  quantity: string;
  price_of_purchase_requisition: string;
  gl_account_number: string;
  material_code: string;
  account_assignment_category: string;
  purchase_group: string;
  parent: string;
  parentfield: string;
  parenttype: string;
  doctype: string;
}

export type PurchaseRequestData = {
  message: {
    data: {
      name: string;
      owner: string;
      creation: string;
      modified: string;
      modified_by: string;
      docstatus: number;
      idx: number;
      naming_series: string;
      purchase_requisition_form_link: string;
      purchase_requisition_type: string;
      plant: string;
      company_code_area: string;
      company: string;
      requisitioner: string;
      doctype: string;
      purchase_group: string
      purchase_requisition_form_table: PurchaseRequisitionFormTable[];
      hod: boolean,
      purchase_head: boolean
      cart_id: string;
    }
  }
}
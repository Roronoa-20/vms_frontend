export type QMSForm = {
  name: string;
  creation: string;
  owner: string;
  ref_no: string;
  vendor_name1?: string;
  date1?: string;
  name_of_parent_company?: string;
  name_of_manufacturer_of_supplied_material?: string;
  mobile_number?: string;
  status?: string;
  vendor_signature?: string;
  qms_form_status?: string;
  quality_control_system?: {
    qms_quality_control?: string | string[];
  };
  others_certificates?: string;
  have_documentsprocedure?: {
    qms_procedure_doc ?: string | string[];
  };
  if_yes_for_prior_notification?: {
    qms_prior_notification?: string | string[];
  };
  regular_review_of_quality_system?: string;
  sites_inspected_by?: string;
  inspected_by_others?: string;
  prior_notification?: string;
  calibrations_performed?: string;
  review_frequency?: string;
  organizational_chart?: string;
  maintain_training_records?: string;
  written_authority?: string;
  procedure_for_training?: string;
  effectiveness_of_training?: string;
  area_of_facility?: string;
  valid_license?: string;
  air_handling_unit?: string;
  pest_control?: string;
  clean_rooms?: string;
  safety_committee?: string;
  no_of_employees?: string;
  license_registrations_attach?: string;
  humidity?: string;
  adequate_sizes?: string;
  water_disposal?: string;
  approved_supplierlist?: string;
  control_and_inspection?: string;
  inspection_reports?: {
    qms_inspection_report?: string | string[];
  }
  agreements?: string;
  defined_areas?: string;
  qc_independent_of_production?: string;
  testing_laboratories?: string;
  analytical_methods_validated?: string;
  failure_investigation?: string;
  manufactruing_process_validate?: string;
  handling_of_start_materials?: string;
  quarantined_finish_products?: string;
  identification_number?: string;
  traceability?: string;
  testing_or_inspection?: string;
  details_of_batch_records?: string;
  nonconforming_materials_removed?: string;
  manufacturing?: string;
  storage_of_approved_finished_products?: string;
  product_identifiable?: string;
  prevent_cross_contamination?: string;
  batch_record?: string;
  duration_of_batch_records?: string;
  customer_complaints?: string;
  reviews_customer_complaints?: string;
  reporting_environmental_accident?: string;
  retain_complaints_records?: string;
  any_recalls?: string;
  additional_or_supplement_information?: string;
  quality_manual?: string;
  name1?: string;
  title?: string;
  date?: string;
  ssignature?: string;
  signature?: string;
  mdpl_qa_date?: string;
  supplier_company_name?: string;
  mdpl_qa_vendor_name?: string;
  name_of_person?: string;
  designation_of_person?: string;
  person_signature?: string;
  signed_date?: string;
  meril_signature?: string;
  meril_signed_date?: string;
  supplier_contact_person_2?: string;
  supplier_contact_person_1?: string;
  tissue_supplier?: string;
  new_supplier?: string;
  technical_agreement_labs?: string;
  amendment_existing_supplier?: string;
  conclusion_by_meril?: string;
  assessment_outcome?: string;
  performer_name?: string;
  performer_signature?: string;
  performer_esignature?: string;
  performer_title?: string;
  performent_date?: string;
  qms_quality_control?: string | string[];
  qms_prior_notification?: string | string[];
  qms_procedure_doc?: string | string[];
};

export type TqmsformDetail = {
  message: {
    data: {
      qms_form: QMSForm;
    };
  };
};

export type VendorQMSForm = {
  name: string;
  creation: string;
  owner: string;
  ref_no: string;
  vendor_name1?: string;
  date1?: string;
  name_of_parent_company?: string;
  name_of_manufacturer_of_supplied_material?: string;
  mobile_number?: string;
  status?: string;
  vendor_signature?: string;
  qms_form_status?: string;
  quality_control_system?: string | string[];
  others_certificates?: string;
  have_documentsprocedure?: string | string[];
  if_yes_for_prior_notification?:string | string[];
  regular_review_of_quality_system?: string;
  sites_inspected_by?: string;
  inspected_by_others?: string;
  prior_notification?: string;
  calibrations_performed?: string;
  review_frequency?: string;
  organizational_chart?: string;
  maintain_training_records?: string;
  written_authority?: string;
  procedure_for_training?: string;
  effectiveness_of_training?: string;
  area_of_facility?: string;
  valid_license?: string;
  air_handling_unit?: string;
  pest_control?: string;
  clean_rooms?: string;
  safety_committee?: string;
  no_of_employees?: string;
  license_registrations_attach?: string;
  humidity?: string;
  adequate_sizes?: string;
  water_disposal?: string;
  approved_supplierlist?: string;
  control_and_inspection?: string;
  inspection_reports?: string | string[];
  agreements?: string;
  defined_areas?: string;
  qc_independent_of_production?: string;
  testing_laboratories?: string;
  analytical_methods_validated?: string;
  failure_investigation?: string;
  manufactruing_process_validate?: string;
  handling_of_start_materials?: string;
  quarantined_finish_products?: string;
  identification_number?: string;
  traceability?: string;
  testing_or_inspection?: string;
  details_of_batch_records?: string;
  nonconforming_materials_removed?: string;
  manufacturing?: string;
  storage_of_approved_finished_products?: string;
  product_identifiable?: string;
  prevent_cross_contamination?: string;
  batch_record?: string;
  duration_of_batch_records?: string;
  customer_complaints?: string;
  reviews_customer_complaints?: string;
  reporting_environmental_accident?: string;
  retain_complaints_records?: string;
  any_recalls?: string;
  additional_or_supplement_information?: string;
  quality_manual?: string;
  name1?: string;
  title?: string;
  date?: string;
  ssignature?: string;
  signature?: string;
  mdpl_qa_date?: string;
  supplier_company_name?: string;
  mdpl_qa_vendor_name?: string;
  name_of_person?: string;
  designation_of_person?: string;
  person_signature?: string;
  signed_date?: string;
  meril_signature?: string;
  meril_signed_date?: string;
  supplier_contact_person_2?: string;
  supplier_contact_person_1?: string;
  tissue_supplier?: string;
  new_supplier?: string;
  technical_agreement_labs?: string;
  amendment_existing_supplier?: string;
  conclusion_by_meril?: string;
  assessment_outcome?: string;
  performer_name?: string;
  performer_signature?: string;
  performer_esignature?: string;
  performer_title?: string;
  performent_date?: string;
  qms_quality_control?: string | string[];
  qms_prior_notification?: string | string[];
  qms_procedure_doc?: string | string[];
};

export type Tqmsform = {
  message: {
    data: {
      vendor_qms_form: VendorQMSForm;
    };
  };
};


type QMSChildTable = Record<string, any>;

interface FormData {
  ref_no: string;
  vendor_onboarding: string;

  have_documentsprocedure?: QMSChildTable[];
  have_training?: QMSChildTable[];
  have_qualitycontrol?: QMSChildTable[];
  have_materialinspection?: QMSChildTable[];
  have_complaints?: QMSChildTable[];

}


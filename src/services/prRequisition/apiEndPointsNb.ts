const url = process.env.NEXT_PUBLIC_BACKEND_END;

const API_END_POINTS = {
  getPurchaseRequisitionTypeDropdown: `${url}/api/method/vms.APIs.purchase_api.vms_pr_utility_api.get_pr_types`,
  getCompanyDropdownBasedOUser: `${url}/api/method/vms.APIs.cart_details.v1.cart_details.get_company_for_user`,
  createPurchaseReqisition: `${url}/api/method/vms.APIs.purchase_api.vms_pr_api.create_vms_pr`,
  getPurchaseRequisitionData: `${url}/api/method/vms.APIs.purchase_api.vms_pr_api.get_vms_pr`,
  getMaterialDropdown: `${url}/api/method/vms.APIs.purchase_api.vms_pr_utility_api.get_materials_by_company`,
  getPlantDropdown: `${url}/api/method/vms.APIs.purchase_api.vms_pr_utility_api.get_plants_by_company`,
  getPurchaseGroupDropdown: `${url}/api/method/vms.APIs.purchase_api.vms_pr_utility_api.get_purchasing_group_by_material`,
  getUOMDropdown: `${url}/api/method/vms.APIs.purchase_api.vms_pr_utility_api.get_uom_by_material`,
  addPurchaseRequisitionNBItems: `${url}/api/method/vms.APIs.purchase_api.nb_normal_api.create_nb_normal_item`,
  deletePurchaseRequisitionNBItems: `${url}/api/method/vms.APIs.purchase_api.nb_normal_api.delete_nb_normal_item`,
  updatePurchaseRequisitionNBItems: `${url}/api/method/vms.APIs.purchase_api.nb_normal_api.update_nb_normal_item`,
  submitPurchaseRequisition: `${url}/api/method/vms.APIs.purchase_api.vms_pr_api.submit_vms_pr`,

  getPlantByMaterial: `${url}/api/method/vms.APIs.purchase_api.vms_pr_utility_api.get_plant_by_material`,
  getMaterialNameByCode: `${url}/api/method/vms.APIs.purchase_api.vms_pr_utility_api.get_material_name_by_code`,
  //   CAPEX API END POINTS

  addPurchaseRequisitionCapexItems: `${url}/api/method/vms.APIs.purchase_api.nb_capex_api.create_nb_capex_item`,
  updatePurchaseRequisitionCapexItems: `${url}/api/method/vms.APIs.purchase_api.nb_capex_api.update_nb_capex_item`,
  deletePurchaseRequisitionCapexItems: `${url}/api/method/vms.APIs.purchase_api.nb_capex_api.delete_nb_capex_item`,

  // Approval
  processApprovalAction: `${url}/api/method/vms.approval.approval_router.process_approval_action`,
}

export default API_END_POINTS;
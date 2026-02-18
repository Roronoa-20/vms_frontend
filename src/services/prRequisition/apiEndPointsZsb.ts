
const url = process.env.NEXT_PUBLIC_BACKEND_END;

const API_END_POINTS = {
    getPlantBasedOnCompany:`${url}/api/method/vms.APIs.purchase_api.vms_pr_utility_api.get_plants_by_company`,
    getUom:`${url}/api/method/vms.APIs.purchase_api.vms_pr_utility_api.get_uom`,
    addServiceLineItems:`${url}/api/method/vms.APIs.purchase_api.zsb_service_api.create_zsb_service_cost_centre`,
    addAssetLineItems:`${url}/api/method/vms.APIs.purchase_api.zsb_asset_api.create_zsb_service_asset`,
    deleteServiceLineItems:`${url}/api/method/vms.APIs.purchase_api.zsb_service_api.delete_zsb_service_cost_centre`,
    deleteAssetLineItems:`${url}/api/method/vms.APIs.purchase_api.zsb_asset_api.delete_zsb_service_asset`,
    updateServiceLineItems:`${url}/api/method/vms.APIs.purchase_api.zsb_service_api.update_zsb_service_cost_centre`,
    updateAssetLineItems:`${url}/api/method/vms.APIs.purchase_api.zsb_asset_api.update_zsb_service_asset`,
    getMaterialGroupDropdown:`${url}/api/method/vms.APIs.purchase_api.vms_pr_utility_api.get_material_group`,
    getCostCenterDropdown:`${url}/api/method/vms.APIs.purchase_api.vms_pr_utility_api.get_cost_centers`,
    getGlAccountDropdown:`${url}/api/method/vms.APIs.purchase_api.vms_pr_utility_api.get_gl_accounts`,
    getServiceCodeDropdown:`${url}/api/method/vms.APIs.purchase_api.vms_pr_utility_api.get_service_code_master`,
    getUomBasedOnServiceCode:`${url}/api/method/vms.APIs.purchase_api.vms_pr_utility_api.get_service_code_uom`,
    getShortTextBasedOnServiceCode:`${url}/api/method/vms.APIs.purchase_api.vms_pr_utility_api.get_service_code_short_text`,
    addServiceSublineItem:`${url}/api/method/vms.APIs.purchase_api.zsb_sub_item_api.create_zsb_sub_item`,
    addAssetSublineItem:`${url}/api/method/vms.APIs.purchase_api.zsb_asset_sub_item_api.create_zsb_asset_sub_item`,
    deleteServiceSublineItem:`${url}/api/method/vms.APIs.purchase_api.zsb_sub_item_api.delete_zsb_sub_item`,
    deleteAssetSublineItem:`${url}/api/method/vms.APIs.purchase_api.zsb_asset_sub_item_api.delete_zsb_asset_sub_item`,
    updateServiceSublineItem:`${url}/api/method/vms.APIs.purchase_api.zsb_sub_item_api.update_zsb_sub_item`,
    updateAssetSublineItem:`${url}/api/method/vms.APIs.purchase_api.zsb_asset_sub_item_api.update_zsb_asset_sub_item`,
}

export default API_END_POINTS;
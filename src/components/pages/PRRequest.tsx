import React from 'react'
import PRRequestForm from '../templates/PRRequestForm'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios';
import requestWrapper from '@/src/services/apiCall';
import { PurchaseRequestData } from '@/src/types/PurchaseRequestType';
import { cookies } from 'next/headers';


interface PageProps {
  pur_req?: string
  cart_id?: string
}

export const PRRequest = async ({ pur_req, cart_id }: PageProps) => {
  let PRDataUrl;
  let PRData: PurchaseRequestData["message"]["data"] | null = null;
  const cookieStore = await cookies();
  const user = cookieStore.get("user_id")?.value
  const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");
  console.log(cart_id, "cart_id in server api")
  if (cart_id) {
    PRDataUrl = `${API_END_POINTS?.fetchDataCartId}?cart_id=${cart_id}`;
    const PRDataResponse: AxiosResponse = await requestWrapper({
      url: PRDataUrl, method: "GET", headers: {
        cookie: cookieHeaderString
      }
    })
    PRData = PRDataResponse?.status == 200 ? PRDataResponse?.data?.message?.data : "";
  }
  console.log(PRData, "PRDataPRDataPRDataPRDataPRDataPRData")
  const dropdownApiUrl = API_END_POINTS?.vendorPurchaseRequestDropdown;
  const resposne: AxiosResponse = await requestWrapper({
    url: dropdownApiUrl, method: "GET", headers: {
      cookie: cookieHeaderString
    }
  });
  const Dropdown = resposne?.status == 200 ? resposne?.data.message : "";
  console.log(Dropdown, "DropdownDropdownDropdownDropdownDropdownDropdown")
  const company = PRData?.company || "";
  console.log(company, "companycompanycompany")
  const purchaseGroupURL = `${API_END_POINTS?.filterpurchasegroup}?company=${company}`;
  const PurGroupresposne: AxiosResponse = await requestWrapper({
    url: purchaseGroupURL,
    method: "GET",
    headers: {
      cookie: cookieHeaderString
    }
  });
  console.log(PurGroupresposne, "PurGroupresposne")
  const PurchaseGroupDropdown = PurGroupresposne?.status == 200 ? PurGroupresposne?.data.message?.pur_grp : "";
  console.log("PurchaseGroupDropdown--------------------------->", PurGroupresposne)

  const StoragelocationURL = `${API_END_POINTS?.filterstoragelocation}?company=${company}`;
  const Storelocationresponse: AxiosResponse = await requestWrapper({
    url: StoragelocationURL,
    method: "GET",
    headers: {
      cookie: cookieHeaderString
    }
  });
  const StorageLocationDropdown = Storelocationresponse?.status == 200 ? Storelocationresponse?.data.message?.storage : "";
  console.log("StorageLocationDropdown---->", StorageLocationDropdown)


  const CostCenterURL = `${API_END_POINTS?.filtercostcenter}?company=${company}`;
  const CostCenterResponse: AxiosResponse = await requestWrapper({
    url: CostCenterURL,
    method: "GET",
    headers: {
      cookie: cookieHeaderString
    }
  });
  const CostCenterDropdown = CostCenterResponse?.status == 200 ? CostCenterResponse?.data.message?.cost_center : "";
  console.log("CostCenterDropdown---->", CostCenterDropdown);

  const GLAccountURL = `${API_END_POINTS?.filterglaccount}?company=${company}`;
  const GLAccountResponse: AxiosResponse = await requestWrapper({
    url: GLAccountURL,
    method: "GET",
    headers: {
      cookie: cookieHeaderString
    }
  });
  const GLAccountDropdwon = GLAccountResponse?.status == 200 ? GLAccountResponse?.data.message?.gl_account : "";
  console.log("GLAccountDropdwon---->", GLAccountDropdwon);
  // 
  const MaterialGroupURL = `${API_END_POINTS?.filtermaterialgroup}?company=${company}`;
  const MaterialGroupResponse: AxiosResponse = await requestWrapper({
    url: MaterialGroupURL,
    method: "GET",
    headers: {
      cookie: cookieHeaderString
    }
  });
  const MaterialGroupDropdown = MaterialGroupResponse?.status == 200 ? MaterialGroupResponse?.data.message?.material_group : "";
  console.log("MaterialGroupDropdown---->", MaterialGroupDropdown);
  // 
  const ProfitCenterURL = `${API_END_POINTS?.filterprofitcenter}?company=${company}`;
  const PorfitCenterResponse: AxiosResponse = await requestWrapper({
    url: ProfitCenterURL,
    method: "GET",
    headers: {
      cookie: cookieHeaderString
    }
  });
  const ProfitCenterDropdown = PorfitCenterResponse?.status == 200 ? PorfitCenterResponse?.data.message?.profit_center : "";
  console.log("ProfitCenterDropdown---->", ProfitCenterDropdown);
  // 
  const ValuationClassURL = `${API_END_POINTS?.filtervaluationclass}?company=${company}`;
  const ValuationClassResponse: AxiosResponse = await requestWrapper({
    url: ValuationClassURL,
    method: "GET",
    headers: {
      cookie: cookieHeaderString
    }
  });
  const ValuationClassDropdown = ValuationClassResponse?.status == 200 ? ValuationClassResponse?.data.message?.valuation_class : "";
  console.log("ValuatnClassDropdown---->", ValuationClassDropdown);
  // 
  // const MaterialCodeURL = `${API_END_POINTS?.MaterialCodeSearchApi}?company=${company}`;
  // const MaterialCodeResponse: AxiosResponse = await requestWrapper({
  //   url: MaterialCodeURL,
  //   method: "GET",
  //   headers: {
  //     cookie: cookieHeaderString
  //   }
  // });
  // const MaterialCodeDropdown = MaterialCodeResponse?.status == 200 ? MaterialCodeResponse?.data.message?.material_master : "";
  // console.log("MaterialCodeDropdown---->", MaterialCodeDropdown);
  // 
  const PurchaseOrgURL = `${API_END_POINTS?.filterpurchaseorg}?company=${company}`;
  const PurchaseOrgResponse: AxiosResponse = await requestWrapper({
    url: PurchaseOrgURL,
    method: "GET",
    headers: {
      cookie: cookieHeaderString
    }
  });
  const PurchaseOrgDropdown = PurchaseOrgResponse?.status == 200 ? PurchaseOrgResponse?.data.message?.purchase_org : "";
  console.log("PRData---->", PRData);


  return (
    <PRRequestForm Dropdown={Dropdown} PRData={PRData} cartId={cart_id} pur_req={pur_req} PurchaseGroupDropdown={PurchaseGroupDropdown} StorageLocationDropdown={StorageLocationDropdown} ValuationClassDropdown={ValuationClassDropdown}
      ProfitCenterDropdown={ProfitCenterDropdown} MaterialGroupDropdown={MaterialGroupDropdown} GLAccountDropdwon={GLAccountDropdwon} CostCenterDropdown={CostCenterDropdown}  PurchaseOrgDropdown={PurchaseOrgDropdown} company={company}/>

  )
}

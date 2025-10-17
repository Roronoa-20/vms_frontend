import React from 'react'
import ViewDispatchForm from '../templates/ViewDispatchForm'
import { cookies } from 'next/headers';
import API_END_POINTS from '@/src/services/apiEndPoints';
import { AxiosResponse } from 'axios';
import requestWrapper from '@/src/services/apiCall';

interface Props {
  refno?:string
}

interface FileAttachment {
  url:string,
  name:string,
  file_name:string
}

export interface TDisptachDetails {
  name:string,
  vendor_code:string,
  courier_number:string,
  courier_name:string,
  invoice_amount:string,
  packing_list_attachment:FileAttachment,
  e_way_bill_attachment:FileAttachment,
  dispatch_form_submitted:boolean,
  docket_number:string,
  dispatch_date:string,
  invoice_number:string,
  invoice_date:string,
  invoice_attachment:FileAttachment,
  commercial_attachment:FileAttachment,
  test_certificates_attachment:FileAttachment,
  purchase_number:{purchase_number:string}[],
  items:{
    name:string,
    po_number:string,
    product_name:string,
    quantity:number,
    uom:string,
    coa_document:FileAttachment,
    msds_document:FileAttachment
    item_name:string,
    actual_quantity:number,
    dispatch_qty:number,
    pending_qty:number,
    coa_document_upload:File,
    msds_document_upload:File
  }[]
  vehicle_details:{
    name:string
    vehicle_no:string,
  loading_state:string,
  loading_location:string,
  driver_name:string,
  transporter_name:string,
  driver_phone:string,
  driver_license:string,
  lr_number:string,
  lr_date:string,
  destination_plant:string,
  attachment:FileAttachment,
  }[]
}


export type DispatchStateAndPlant = {
  states:{
    name:string,
    state_name:string,
    state_code:string,
    country_name:string
  }[],
  plants:{
    name:string,
    plant_name:string,
    company:string
  }[]
}

const ViewDispatch = async({refno}:Props) => {

  const cookieStore = await cookies();
  const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");

  let DispatchDetails:TDisptachDetails | null = null;
  console.log(refno,"this is refno")
  if(refno){
    const url = `${API_END_POINTS?.dispatchDetails}?name=${refno}`;
    const response:AxiosResponse = await requestWrapper({url:url,method:"GET"});
    DispatchDetails = response?.status == 200? response?.data?.message?.data : null
  }

  const StateAndPlantResponse:AxiosResponse = await requestWrapper({url:API_END_POINTS?.DispatchStateAndPlant,method:"GET"});
  const StateAndPlant:DispatchStateAndPlant =  StateAndPlantResponse?.status == 200 ? StateAndPlantResponse?.data?.message?.data : ""

  console.log(StateAndPlant,"this is state and plant")

  return (
    <ViewDispatchForm DispatchDetails={DispatchDetails} refno={refno} StateAndPlant={StateAndPlant}/>
  )
}

export default ViewDispatch
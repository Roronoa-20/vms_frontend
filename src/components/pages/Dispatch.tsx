import React from 'react'
import DispatchForm from '../templates/DispatchForm'
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
}

const Dispatch = async({refno}:Props) => {

  const cookieStore = await cookies();
  const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");

  let DispatchDetails:TDisptachDetails | null = null;
  if(refno){
    const url = `${API_END_POINTS?.dispatchDetails}?name=${refno}`;
    const response:AxiosResponse = await requestWrapper({url:url,method:"GET"});
    DispatchDetails = response?.status == 200? response?.data?.message?.data : null
  }

  return (
    <DispatchForm DispatchDetails={DispatchDetails} refno={refno}/>
  )
}

export default Dispatch
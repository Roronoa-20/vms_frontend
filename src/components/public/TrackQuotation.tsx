import requestWrapper from '@/src/services/apiCall';
import API_END_POINTS from '@/src/services/apiEndPoints';
import { QuotationDetail } from '@/src/types/QuatationTypes';
import { AxiosResponse } from 'axios';
import { cookies } from 'next/headers';
import React from 'react'


type QuotationColumnKey = keyof QuotationDetail | "index" | "action" | "select";
 
interface ColumnConfig {
    label: string;
    key: QuotationColumnKey;
}

interface Props {
  token:string
}


const TrackQuotation = async({token}:Props) => {
    const cookieStore = await cookies();
    const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");
  

  const exportColumns: ColumnConfig[] = [
        { label: "Sr No.", key: "index" },
        { label: "Vendor Name", key: "vendor_name" },
        { label: "Vendor Code", key: "vendor_code" },
        { label: "Email", key: "office_email_primary" },
        { label: "Status", key: "status" },
        { label: "Shipment Mode", key: "mode_of_shipment" },
        { label: "Airline / Vessel Name", key: "airlinevessel_name" },
        { label: "Rate Per Kg", key: "ratekg" },
        { label: "Fuel Surcharge", key: "fuel_surcharge" },
        { label: "SC", key: "sc" },
        { label: "XRAY", key: "xray" },
        { label: "Others Charges in Total", key: "other_charges_in_total" },
        { label: "Chargeable Weight", key: "chargeable_weight" },
        { label: "Total Freight FCR", key: "total_freight" },
        { label: "Expected Delivery in No of Days", key: "expected_delivery_in_no_of_days" },
        { label: "Remarks", key: "remarks" },
        { label: "Attachments", key: "attachments" },
    ];

    const importColumns: ColumnConfig[] = [
        { label: "Sr No.", key: "index" },
        { label: "Vendor Name", key: "vendor_name" },
        { label: "Vendor Code", key: "vendor_code" },
        { label: "Email", key: "office_email_primary" },
        { label: "Status", key: "status" },
        { label: "Shipment Mode", key: "mode_of_shipment" },
        { label: "AirLine Name", key: "airlinevessel_name" },
        { label: "Weight", key: "destination_port" },
        { label: "Rate Per Kg", key: "ratekg" },
        { label: "FSC", key: "fuel_surcharge" },
        { label: "SC", key: "sc" },
        { label: "XRAY", key: "xray" },
        { label: "Pick Up Charge", key: "pickuporigin" },
        { label: "Ex Works Charges FCR", key: "ex_works" },
        { label: "Freight FCR", key: "total_freight" },
        { label: "Currency Type From", key: "from_currency" },
        { label: "Currency Type To", key: "to_currency" },
        { label: "XCR", key: "exchange_rate" },
        { label: "Sum Freight INR", key: "total_freightinr" },
        { label: "DC", key: "destination_charge" },
        { label: "Shipping Charges", key: "shipping_line_charge" },
        { label: "CFS Charges", key: "cfs_charge" },
        { label: "Landing Price", key: "total_landing_price" },
        { label: "Transit Days", key: "transit_days" },
        { label: "Remarks", key: "remarks" },
        { label: "Attachments", key: "attachments" },
    ];


    const Url = API_END_POINTS?.quotationTracking;
    const formdata = new FormData();
    formdata.append("token",token)
    const resposne: AxiosResponse = await requestWrapper({
        url: Url, method: "POST",data:formdata, headers: {
            cookie: cookieHeaderString
        },
    });

    const data = resposne?.status == 200?resposne?.data?.message?.data : "";
  return (
    <div className='bg-white p-4'>
      <h1 className='p-2 pl-10 flex gap-5 items-center'>RFQ No : {data?.name} <span className='bg-green-100 text-green-500 rounded-md px-2 py-1'>{data?.rank}</span></h1>
      <div className='border p-6 border-black rounded-lg mx-8'>
          <ul className='grid grid-cols-3'>
            {
             data?.logistic_type == "Import"? importColumns?.map((item,index)=>(
                <li key={index} className='border-b p-1'>{item?.label} :<span className='font-semibold px-1'>{data[item?.key]}</span></li>
              ))
              :data?.logistic_type == "Export"?exportColumns?.map((item,index)=>(
                <li key={index} className='border-b p-1'>{item?.label} :<span className='font-semibold px-1'>{data[item?.key]}</span></li>
              )):""
            }
          </ul>
        </div>
      </div>
  )
}

export default TrackQuotation
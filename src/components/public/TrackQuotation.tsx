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
        { label: "Select", key: "select" },
        { label: "Sr No.", key: "index" },
        { label: "RefNo", key: "name" },
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
        { label: "Select", key: "select" },
        { label: "Sr No.", key: "index" },
        { label: "RefNo", key: "name" },
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

    const data = resposne?.status == 200?resposne?.data : "";

    console.log(data,"this is data");

  return (
    <div>
        
    </div>
  )
}

export default TrackQuotation
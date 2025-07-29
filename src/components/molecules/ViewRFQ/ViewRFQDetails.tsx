import { RFQDetails } from '@/src/types/RFQtype'
import React from 'react'
interface Props {
  RFQData: RFQDetails;
}
const RFQBasicDetails = ({ RFQData }: Props) => {
  return (
    <div className='bg-white'>
      <div className='border rounded-md mb-7 p-2 text-black grid grid-cols-3 '>
        <div className='grid-cols-1 px-2 border-r'>
          <ul className=''>
            <li className='border-b p-1'>Sr No. :<span className='font-semibold px-1'>{RFQData ? RFQData.sr_no : ''}</span></li>
            <li className='border-b p-1'>RFQ Type :<span className='font-semibold px-1'>{RFQData ? RFQData.rfq_type : ''}</span></li>
            <li className='border-b p-1'>Service Type :<span className='font-semibold px-1'>{RFQData ? RFQData.service_category : ''}</span></li>
            <li className='border-b p-1'>Company Name :<span className='font-semibold px-1'>{RFQData ? RFQData.company_name : ''}</span></li>
            <li className='border-b p-1'>RFQ Date :<span className='font-semibold px-1'>{RFQData ? RFQData.rfq_date_logistic : ''}</span></li>
            <li className='border-b p-1'>RFQ CutOff :<span className='font-semibold px-1'>{RFQData ? RFQData.rfq_cutoff_date_logistic : ''}</span></li>
            <li className='border-b p-1'>Mode of Shipment :<span className='font-semibold px-1'>{RFQData ? RFQData.mode_of_shipment : ''}</span></li>
          </ul>
        </div>
        <div className='grid-cols-1 px-4 border-r'>
          <ul className=''>
            <li className='border-b p-1'>Destination Port :<span className='font-semibold px-1'>{RFQData ? RFQData.destination_port : ''}</span></li>
            <li className='border-b p-1'>Country :<span className='font-semibold px-1'>{RFQData ? RFQData.country : ''}</span></li>
            <li className='border-b p-1'>Port Code :<span className='font-semibold px-1'>{RFQData ? RFQData.port_code : ''}</span></li>
            <li className='border-b p-1'>Port of Loading :<span className='font-semibold px-1'>{RFQData ? RFQData.port_of_loading : ''}</span></li>
            <li className='border-b p-1'>Inco Terms :<span className='font-semibold px-1'>{RFQData ? RFQData.inco_terms : ''}</span></li>
            <li className='border-b p-1'>Package Type :<span className='font-semibold px-1'>{RFQData ? RFQData.package_type : ''}</span></li>
            <li className='border-b p-1'>Product Category :<span className='font-semibold px-1'>{RFQData ? RFQData.product_category : ''}</span></li>
          </ul>
        </div>
        <div className='grid-cols-1 px-4'>
          <ul className=''>
            <li className='border-b p-1'>Vol Weight(KG) :<span className='font-semibold px-1'>{RFQData ? RFQData.vol_weight : ''}</span></li>
            <li className='border-b p-1'>Actual Weight(KG) :<span className='font-semibold px-1'>{RFQData ? RFQData.actual_weight : ''}</span></li>
            <li className='border-b p-1'>Invoice Date :<span className='font-semibold px-1'>{RFQData ? RFQData.invoice_date : ''}</span></li>
            <li className='border-b p-1'>Invoice No :<span className='font-semibold px-1'>{RFQData ? RFQData.invoice_no : ''}</span></li>
            <li className='border-b p-1'>Invoice Value :<span className='font-semibold px-1'>{RFQData ? RFQData.invoice_value : ''}</span></li>
            <li className='border-b p-1'>Expected Date of Arrival :<span className='font-semibold px-1'>{RFQData ? RFQData.expected_date_of_arrival : ''}</span></li>
          </ul>
        </div>
        <p className='p-1 px-3'>Remarks :<span className='font-semibold px-1'>{RFQData ? RFQData.remarks : ''}</span></p>
      </div>
    </div>
  )
}

export default RFQBasicDetails

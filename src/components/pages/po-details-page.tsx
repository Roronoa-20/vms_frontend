import { PurchaseOrder } from '@/src/types/types'
import React from 'react'
type Props = {
  PODetailData:  PurchaseOrder
}
const PoDetailsPage = ({PODetailData}:Props) => {
    console.log(PODetailData,"PODetailData")
  return (
    <div className='text-black'>
      Hello here is data of PO : {
        <p>Hello</p>
      }
    </div>
  )
}

export default PoDetailsPage
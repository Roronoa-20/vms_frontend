import React from 'react'
import ProductHistoryTable from '../molecules/ProductHistoryTable'
import { ProductHistory as ProductHistoryType } from './Pr-Inquiry'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { cookies } from 'next/headers'

interface Props {
    refno:string,
    product_name:string
}

export type productHIstoryResponse = {
    data:ProductHistoryType[],
    pagination:{
        page_no:number,
        page_size:number,
        total_records:number,
        total_pages:number,
        has_next:number,
        has_previous:number
    }
}

const ProductHistory = async({refno,product_name}:Props) => {

     const cookieStore = await cookies();
      const user = cookieStore.get("user_id")?.value
      console.log(user, "user")
      const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");

    const response:AxiosResponse = await requestWrapper({url:API_END_POINTS?.FullProductHistory,method:"GET",params:{cart_id:refno,product_name:product_name},headers:{
        cookie:cookieHeaderString
    }})

    const tableData:productHIstoryResponse = response?.status == 200?response?.data?.message:"";

  return (
    <ProductHistoryTable tableData={tableData} refno={refno} product_name={product_name}/>
  )
}

export default ProductHistory
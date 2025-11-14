import ProductHistory from '@/src/components/pages/ProductHistory'
import React from 'react'

interface PageProps {
  searchParams: Promise<{
    product_name: string
    cart_id: string
  }>
}


const page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  console.log(params, "params in servr")
;  const product_name = params["product_name"];
  const cart_id = params["cart_id"];

  return (
    <ProductHistory product_name={product_name} refno={cart_id}/>
  )
}

export default page
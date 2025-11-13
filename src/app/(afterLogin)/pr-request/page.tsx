import { PRRequest } from '@/src/components/pages/PRRequest'
import React from 'react'

interface PageProps {
  searchParams: Promise<{
    pur_req?: string
    cart_id?: string
  }>
}


const page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  console.log(params, "params in servr")
;  const pur_req = params["pur_req"];
  const cart_id = params["cart_id"];
  console.log(cart_id, "cart_id in server page", pur_req);

  return (
    <PRRequest pur_req={pur_req} cart_id={cart_id} />
  )
}

export default page
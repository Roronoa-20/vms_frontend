import { PRRequest } from '@/src/components/pages/PRRequest'
import React from 'react'

interface PageProps {
  searchParams: Promise<{
    pur_req?: string
    cart_id?: string
    prf_name?: string
  }>
}


const page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const pur_req = params["pur_req"];
  const cart_id = params["cart_id"];
  const prf_name = params["prf_name"];
  console.log(cart_id, "cart_id in server page", pur_req, "prf name",prf_name);

  return (
    <PRRequest pur_req={pur_req} cart_id={cart_id} prf_name={prf_name} />
  )
}

export default page
import SubmitQuatation from "@/src/components/pages/SubmitQuatation";
import React from "react";
interface PageProps {
  searchParams: Promise<{ 
    refno?:string
  }>
}

const Page =async  ({ searchParams }:PageProps) => {
     const params = await searchParams;
  const refno =  params["refno"];
  return(
    <SubmitQuatation  refno={refno}/>
  ) 
};

export default Page;
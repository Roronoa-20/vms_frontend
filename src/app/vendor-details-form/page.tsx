import VendorDetail from "@/src/components/pages/VendorDetail";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { TvendorOnboardingDetail } from "@/src/types/types";
import { AxiosResponse } from "axios";
import React from "react";

const page = async({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {

  const vendor_onboarding = await searchParams["vendor_onboarding"];
  const tabtype = await searchParams["tabtype"];
  console.log(vendor_onboarding,tabtype)
  return <VendorDetail vendor_onboarding={ vendor_onboarding as string} tabtype={tabtype as string}/>;
};

export default page;

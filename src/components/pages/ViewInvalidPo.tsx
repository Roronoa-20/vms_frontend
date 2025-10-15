import React from 'react'
import InvalidPoTable from '../molecules/InvalidPoTable'
import requestWrapper from '@/src/services/apiCall'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { DashboardPOTableData } from '@/src/types/types'
import { cookies } from 'next/headers'

const ViewInvalidPo = async() => {

    const cookieStore = await cookies();
      const user = cookieStore.get("user_id")?.value
      console.log(user, "user")
      const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");

    let viewInvalidPOTable:DashboardPOTableData["message"] | null = null;
    const viewInvalidPoReponse = await requestWrapper({url:API_END_POINTS?.poTable,params:{vendor_code_invalid:1},method:"GET",headers: {
      cookie: cookieHeaderString
    }});
    if(viewInvalidPoReponse?.status == 200){
        viewInvalidPOTable = viewInvalidPoReponse?.data?.message;
    }

  return (
    <InvalidPoTable viewInvalidPOTable={viewInvalidPOTable as DashboardPOTableData["message"]}/>
  )
}

export default ViewInvalidPo
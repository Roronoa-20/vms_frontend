import React from "react";
import DashboardCardCounter from "../molecules/Dashboard-Card-Count";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import { DashboardPOTableData, PurchaseOrderResponse, dashboardCardData } from "@/src/types/types";
import { cookies } from "next/headers";
import PoDetailsPage from "./po-details-page";
type Props = {
    name:string;
}
const PODetails = async ({name}:Props) => {
    console.log(name,"name-------------------------")
    const cookieStore = await cookies();
    const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");
    const PODetailApi: AxiosResponse = await requestWrapper({
        url: `${API_END_POINTS?.getPoDetailURL}`,
        method: "GET",
        headers: {
            cookie: cookieHeaderString
        },
        data:{data:{"po_name":name}}
    });
    const PODetailData: PurchaseOrderResponse["message"] =
        PODetailApi?.status == 200 ? PODetailApi?.data?.message : "";
    return (
        <div className="p-8">
            {/* Cards */}
            <PoDetailsPage PODetailData={PODetailData} />
        </div>
    );
};

export default PODetails;
